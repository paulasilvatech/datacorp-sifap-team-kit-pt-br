# Fase 0: Analizador de recursos existentes

Este archivo contiene las instrucciones detalladas de la fase 0. Cuando la persona solicite analizar recursos existentes de Azure (ruta B), lee y sigue este archivo.

Los resultados del análisis se visualizan como un diagrama de arquitectura y las solicitudes posteriores de modificación en lenguaje natural se dirigen a la fase 1.

> **🚨 Regla de ubicación de salidas**: todas las salidas (JSON del análisis, HTML del diagrama, código Bicep) deben guardarse en **una carpeta de proyecto bajo el directorio de trabajo actual (cwd)**. NUNCA las guardes en `~/.copilot/session-state/`. El directorio de estado de sesión es temporal y puede eliminarse al finalizar la sesión.

---

## Paso 1: Inicio de sesión en Azure y selección del alcance del análisis

### 1-A: Verificar el inicio de sesión en Azure

```powershell
az account show 2>&1
```

- Si la sesión está iniciada → Pasar al paso 1-B
- Si no está iniciada → Pedir a la persona que ejecute `az login`

### 1-B: Selección de suscripciones (se admite selección múltiple)

```powershell
az account list --output json
```

Presenta la lista de suscripciones como opciones de `ask_user`. **Se pueden seleccionar varias suscripciones:**

```
ask_user({
  question: "Selecciona las suscripciones de Azure que se analizarán. (Puedes añadirlas una a una para seleccionar varias)",
  choices: [
    "sub-002 (Suscripción predeterminada actual) (Recomendado)",
    "sub-001",
    "Analizar todas las suscripciones anteriores"
  ]
})
```

- Una suscripción seleccionada → Analizar solo esa suscripción
- "Analizar todas" seleccionado → Analizar todas las suscripciones
- Si la persona quiere suscripciones adicionales → Usar ask_user de nuevo para añadirlas

### 1-C: Selección del alcance del análisis (se admiten varios grupos de recursos)

```
ask_user({
  question: "¿Qué alcance de recursos de Azure quieres analizar?",
  choices: [
    "Especificar un grupo de recursos concreto (Recomendado)",
    "Seleccionar varios grupos de recursos",
    "Todos los grupos de recursos de la suscripción actual"
  ]
})
```

- **Grupo de recursos concreto** → Seleccionarlo de la lista o introducirlo manualmente
- **Varios grupos de recursos** → Repetir ask_user para añadirlos de uno en uno. Detenerse cuando la persona diga "es suficiente".
  Como alternativa, la persona puede introducir varios grupos separados por comas (por ejemplo, `rg-prod, rg-dev, rg-network`)
- **Suscripción completa** → `az group list` → Analizar todos los grupos de recursos (advertir que puede tardar si hay muchos recursos)

**Se admite combinar varias suscripciones y varios grupos de recursos:**

- rg-prod de la suscripción A + rg-network de la suscripción B → Analizar ambos y mostrarlos en un único diagrama

---

## Jerarquía del diagrama: mostrar varias suscripciones y grupos de recursos

**Una suscripción + un grupo de recursos**: igual que antes (solo el límite de la VNet)
**Varios grupos de recursos (misma suscripción)**: límite discontinuo por grupo
**Varias suscripciones**: límite de dos niveles, Suscripción > Grupo de recursos

Pasa la información de jerarquía en el JSON del diagrama:

**Añade los campos `subscription` y `resourceGroup` al JSON de services:**

```json
{
  "id": "foundry",
  "name": "foundry-xxx",
  "type": "ai_foundry",
  "subscription": "sub-002",
  "resourceGroup": "rg-prod",
  "details": [...]
}
```

**Pasa la información de jerarquía mediante el parámetro `--hierarchy`:**

```
--hierarchy '[{"subscription":"sub-002","resourceGroups":["rg-prod","rg-dev"]},{"subscription":"sub-001","resourceGroups":["rg-network"]}]'
```

Con esta información, el script del diagrama hará lo siguiente:

- Varios grupos de recursos → Representar cada grupo como una agrupación con límite discontinuo (etiqueta: nombre del grupo)
- Varias suscripciones → Anidar los límites de grupos de recursos dentro de límites de suscripción más amplios
- Los límites de la VNet se muestran dentro del grupo de recursos al que pertenece

---

## Paso 2: Análisis de recursos

**🚨 Principios de salida de az CLI:**

- La salida de az CLI debe **guardarse siempre en un archivo** y después leerse con `view`. La salida directa en el terminal puede truncarse.
- Agrupa **como máximo 3 comandos az** por llamada de PowerShell. Agrupar demasiados puede agotar el tiempo de espera.
- Usa `--query` con JMESPath para extraer solo los campos necesarios y reducir el tamaño de la salida.

```powershell
# ✅ Enfoque correcto: guardar en un archivo y después leer
az resource list -g "<RG>" --query "[].{name:name,type:type,kind:kind,location:location}" -o json | Set-Content -Path "$outDir/resources.json"

# ❌ Enfoque incorrecto: salida directa en el terminal (puede truncarse)
az resource list -g "<RG>" -o json
```

### 2-A: Enumerar todos los recursos y mostrarlos a la persona

```powershell
$outDir = "<project-name>/azure-scan"
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

# Paso 1: lista básica de recursos (name, type, kind, location)
az resource list -g "<RG>" --query "[].{name:name,type:type,kind:kind,location:location,id:id}" -o json | Set-Content "$outDir/resources.json"
```

**🚨 Inmediatamente después de leer resources.json, DEBES mostrar a la persona la tabla completa de recursos:**

```
📋 Lista de recursos de rg-<RG> (N recursos)

┌─────────────────────────┬──────────────────────────────────────────────┬─────────────────┐
│ Nombre                  │ Tipo                                         │ Ubicación       │
├─────────────────────────┼──────────────────────────────────────────────┼─────────────────┤
│ my-storage              │ Microsoft.Storage/storageAccounts             │ koreacentral    │
│ my-keyvault             │ Microsoft.KeyVault/vaults                    │ koreacentral    │
│ ...                     │ ...                                          │ ...             │
└─────────────────────────┴──────────────────────────────────────────────┴─────────────────┘

⏳ Recuperando información detallada...
```

Muestra **primero** esta tabla antes de continuar con las consultas detalladas. No hagas esperar a la persona sin que sepa qué recursos existen.

### 2-B: Consulta detallada dinámica basada en resources.json

**Determina dinámicamente los comandos de consulta detallada según los tipos de recurso encontrados en resources.json.**

No uses una lista fija de comandos. Ejecuta solo los comandos de tipos que existan en resources.json, seleccionados de la tabla de correspondencias siguiente.

**Correspondencia Tipo → Comando de consulta detallada:**

| Tipo en resources.json | Comando de consulta detallada | Archivo de salida |
|---|---|---|
| `Microsoft.Network/virtualNetworks` | `az network vnet list -g "<RG>" --query "[].{name:name,addressSpace:addressSpace.addressPrefixes,subnets:subnets[].{name:name,prefix:addressPrefix,pePolicy:privateEndpointNetworkPolicies}}" -o json` | `vnets.json` |
| `Microsoft.Network/privateEndpoints` | `az network private-endpoint list -g "<RG>" --query "[].{name:name,subnetId:subnet.id,targetId:privateLinkServiceConnections[0].privateLinkServiceId,groupIds:privateLinkServiceConnections[0].groupIds,state:provisioningState}" -o json` | `pe.json` |
| `Microsoft.Network/networkSecurityGroups` | `az network nsg list -g "<RG>" --query "[].{name:name,location:location,subnets:subnets[].id,nics:networkInterfaces[].id}" -o json` | `nsg.json` |
| `Microsoft.CognitiveServices/accounts` | `az cognitiveservices account list -g "<RG>" --query "[].{name:name,kind:kind,sku:sku.name,endpoint:properties.endpoint,publicAccess:properties.publicNetworkAccess,location:location}" -o json` | `cognitive.json` |
| `Microsoft.Search/searchServices` | `az search service list -g "<RG>" --query "[].{name:name,sku:sku.name,publicAccess:properties.publicNetworkAccess,semanticSearch:properties.semanticSearch,location:location}" -o json 2>$null` | `search.json` |
| `Microsoft.Compute/virtualMachines` | `az vm list -g "<RG>" --query "[].{name:name,size:hardwareProfile.vmSize,os:storageProfile.osDisk.osType,location:location,nicIds:networkProfile.networkInterfaces[].id}" -o json` | `vms.json` |
| `Microsoft.Storage/storageAccounts` | `az storage account list -g "<RG>" --query "[].{name:name,sku:sku.name,kind:kind,hns:properties.isHnsEnabled,publicAccess:properties.publicNetworkAccess,location:location}" -o json` | `storage.json` |
| `Microsoft.KeyVault/vaults` | `az keyvault list -g "<RG>" --query "[].{name:name,location:location}" -o json 2>$null` | `keyvault.json` |
| `Microsoft.ContainerService/managedClusters` | `az aks list -g "<RG>" --query "[].{name:name,kubernetesVersion:kubernetesVersion,sku:sku,agentPoolProfiles:agentPoolProfiles[].{name:name,count:count,vmSize:vmSize},networkProfile:networkProfile.networkPlugin,location:location}" -o json` | `aks.json` |
| `Microsoft.Web/sites` | `az webapp list -g "<RG>" --query "[].{name:name,kind:kind,sku:appServicePlan,state:state,defaultHostName:defaultHostName,httpsOnly:httpsOnly,location:location}" -o json` | `webapps.json` |
| `Microsoft.Web/serverFarms` | `az appservice plan list -g "<RG>" --query "[].{name:name,sku:sku.name,tier:sku.tier,kind:kind,location:location}" -o json` | `appservice-plans.json` |
| `Microsoft.DocumentDB/databaseAccounts` | `az cosmosdb list -g "<RG>" --query "[].{name:name,kind:kind,databaseAccountOfferType:databaseAccountOfferType,locations:locations[].locationName,publicAccess:publicNetworkAccess}" -o json` | `cosmosdb.json` |
| `Microsoft.Sql/servers` | `az sql server list -g "<RG>" --query "[].{name:name,fullyQualifiedDomainName:fullyQualifiedDomainName,publicAccess:publicNetworkAccess,location:location}" -o json` | `sql-servers.json` |
| `Microsoft.Databricks/workspaces` | `az databricks workspace list -g "<RG>" --query "[].{name:name,sku:sku.name,url:workspaceUrl,publicAccess:parameters.enableNoPublicIp.value,location:location}" -o json 2>$null` | `databricks.json` |
| `Microsoft.Synapse/workspaces` | `az synapse workspace list -g "<RG>" --query "[].{name:name,sqlAdminLogin:sqlAdministratorLogin,publicAccess:publicNetworkAccess,location:location}" -o json 2>$null` | `synapse.json` |
| `Microsoft.DataFactory/factories` | `az datafactory list -g "<RG>" --query "[].{name:name,publicAccess:publicNetworkAccess,location:location}" -o json 2>$null` | `adf.json` |
| `Microsoft.EventHub/namespaces` | `az eventhubs namespace list -g "<RG>" --query "[].{name:name,sku:sku.name,location:location}" -o json` | `eventhub.json` |
| `Microsoft.Cache/redis` | `az redis list -g "<RG>" --query "[].{name:name,sku:sku.name,port:port,sslPort:sslPort,publicAccess:publicNetworkAccess,location:location}" -o json` | `redis.json` |
| `Microsoft.ContainerRegistry/registries` | `az acr list -g "<RG>" --query "[].{name:name,sku:sku.name,adminUserEnabled:adminUserEnabled,publicAccess:publicNetworkAccess,location:location}" -o json` | `acr.json` |
| `Microsoft.MachineLearningServices/workspaces` | `az resource show --ids "<ID>" --query "{name:name,sku:sku,kind:kind,location:location,publicAccess:properties.publicNetworkAccess,hbiWorkspace:properties.hbiWorkspace,managedNetwork:properties.managedNetwork.isolationMode}" -o json` | `mlworkspace.json` |
| `Microsoft.Insights/components` | `az monitor app-insights component show -g "<RG>" --app "<NAME>" --query "{name:name,kind:kind,instrumentationKey:instrumentationKey,workspaceResourceId:workspaceResourceId,location:location}" -o json 2>$null` | `appinsights-<NAME>.json` |
| `Microsoft.OperationalInsights/workspaces` | `az monitor log-analytics workspace show -g "<RG>" -n "<NAME>" --query "{name:name,sku:sku.name,retentionInDays:retentionInDays,location:location}" -o json` | `log-analytics-<NAME>.json` |
| `Microsoft.Network/applicationGateways` | `az network application-gateway list -g "<RG>" --query "[].{name:name,sku:sku,location:location}" -o json` | `appgateway.json` |
| `Microsoft.Cdn/profiles` / `Microsoft.Network/frontDoors` | `az afd profile list -g "<RG>" --query "[].{name:name,sku:sku.name,location:location}" -o json 2>$null` | `frontdoor.json` |
| `Microsoft.Network/azureFirewalls` | `az network firewall list -g "<RG>" --query "[].{name:name,sku:sku,threatIntelMode:threatIntelMode,location:location}" -o json` | `firewall.json` |
| `Microsoft.Network/bastionHosts` | `az network bastion list -g "<RG>" --query "[].{name:name,sku:sku.name,location:location}" -o json` | `bastion.json` |

**Proceso de consulta dinámica:**

1. Lee `resources.json`
2. Extrae los valores distintos del campo `type`
3. Ejecuta **solo los comandos de los tipos coincidentes** de la tabla anterior (omite los tipos que no estén presentes)
4. Si encuentras un tipo que no esté en la tabla → Usa la consulta genérica: `az resource show --ids "<ID>" --query "{name:name,sku:sku,kind:kind,location:location,properties:properties}" -o json`
5. Ejecuta los comandos en grupos de 2-3 (no todos a la vez)

### 2-C: Consulta de despliegues de modelos (cuando existe Cognitive Services)

```powershell
# Consultar los despliegues de modelos de cada recurso de Cognitive Services
az cognitiveservices account deployment list --name "<NAME>" -g "<RG>" --query "[].{name:name,model:properties.model.name,version:properties.model.version,sku:sku.name}" -o json | Set-Content "$outDir/<NAME>-deployments.json"
```

### 2-D: Consulta de NIC e IP públicas (cuando existen máquinas virtuales)

```powershell
az network nic list -g "<RG>" --query "[].{name:name,subnetId:ipConfigurations[0].subnet.id,privateIp:ipConfigurations[0].privateIPAddress,publicIpId:ipConfigurations[0].publicIPAddress.id}" -o json | Set-Content "$outDir/nics.json"
az network public-ip list -g "<RG>" --query "[].{name:name,ip:ipAddress,sku:sku.name}" -o json | Set-Content "$outDir/public-ips.json"
```

Desde la VNet:

- `addressSpace.addressPrefixes` → CIDR
- `subnets[].name`, `subnets[].addressPrefix` → Información de subredes
- `subnets[].privateEndpointNetworkPolicies` → Políticas de PE

---

## Paso 3: Deducir relaciones entre recursos

Deduce automáticamente las **relaciones (conexiones)** entre los recursos analizados para construir el JSON de connections del diagrama.

### Reglas para deducir relaciones

**🚨 Si no hay suficientes líneas de conexión, el diagrama pierde sentido. Deduce tantas relaciones como sea posible.**

#### Deducción confirmada (verificable directamente mediante ID o propiedades de recursos)

| Tipo de relación | Método de deducción | Tipo de conexión |
|---|---|---|
| PE → Servicio | Extraer el ID del servicio desde `privateLinkServiceId` del PE | `private` |
| PE → VNet | Extraer la VNet desde `subnet.id` del PE | (Representada como límite de VNet) |
| Foundry → Proyecto | Recurso principal de `accounts/projects` | `api` |
| VM → NIC → Subred | Deducir la VNet y subred desde `subnet.id` de la NIC | (Límite de VNet) |
| NSG → Subred | Comprobar las subredes conectadas desde `subnets[].id` del NSG | `network` |
| NSG → NIC | Comprobar las máquinas virtuales conectadas desde `networkInterfaces[].id` del NSG | `network` |
| NIC → IP pública | Comprobar la PIP desde `publicIPAddress.id` de la NIC | (Incluida en details) |
| Databricks → VNet | Configuración de inyección en VNet del área de trabajo | (Límite de VNet) |

#### Deducción razonable (patrones habituales entre servicios del mismo grupo de recursos)

| Tipo de relación | Condición para deducirla | Tipo de conexión |
|---|---|---|
| Foundry → AI Search | Ambos existen en el mismo grupo → Deducir una conexión RAG | `api` (label: "Búsqueda RAG") |
| Foundry → Storage | Ambos existen en el mismo grupo → Deducir una conexión de datos | `data` (label: "Datos") |
| AI Search → Storage | Ambos existen en el mismo grupo → Deducir una conexión de indexación | `data` (label: "Indexación") |
| Servicio → Key Vault | Key Vault existe en el mismo grupo → Deducir gestión de secretos | `security` (label: "Secretos") |
| VM → Foundry/Search | Existen máquinas virtuales y servicios de IA en el mismo grupo → Deducir llamadas a API | `api` (label: "API") |
| DI → Foundry | Existen Document Intelligence y Foundry en el mismo grupo → Deducir una conexión de OCR o extracción | `api` (label: "OCR/Extracción") |
| ADF → Storage | Existen ADF y Storage en el mismo grupo → Deducir una canalización de datos | `data` (label: "Canalización") |
| ADF → SQL | Existen ADF y SQL en el mismo grupo → Deducir un origen de datos | `data` (label: "Origen") |
| Databricks → Storage | Ambos existen en el mismo grupo → Deducir una conexión de lago de datos | `data` (label: "Lago de datos") |

#### Confirmación de la persona después de la deducción

Muestra la lista de conexiones deducidas y solicita confirmación:

```
> **⏳ Se han deducido relaciones entre los recursos**: verifica si las siguientes son correctas.

Conexiones deducidas:
- Foundry → AI Search (Búsqueda RAG)
- Foundry → Storage (Datos)
- VM → Foundry (Llamada a API)
- Document Intelligence → Foundry (OCR/Extracción)

¿Es correcto? Indica si quieres añadir o quitar alguna conexión.
```

#### Relaciones que no pueden deducirse

Puede haber conexiones que no se puedan deducir con las reglas anteriores. La persona puede añadir libremente conexiones adicionales.

### Consulta de despliegues de modelos (cuando existen recursos de Foundry)

```powershell
az cognitiveservices account deployment list --name "<FOUNDRY_NAME>" -g "<RG>" --query "[].{name:name,model:properties.model.name,version:properties.model.version,sku:sku.name}" -o json
```

Añade el nombre del modelo, la versión y la SKU de cada despliegue a los detalles del nodo de Foundry.

---

## Paso 4: Conversión a JSON de services/connections

Convierte los resultados del análisis al formato de entrada del motor de diagramas integrado.

### Correspondencia Tipo de recurso → type del diagrama

| Tipo de recurso de Azure | type del diagrama |
|---|---|
| `Microsoft.CognitiveServices/accounts` (kind: AIServices) | `ai_foundry` |
| `Microsoft.CognitiveServices/accounts` (kind: OpenAI) | `openai` |
| `Microsoft.CognitiveServices/accounts` (kind: FormRecognizer) | `document_intelligence` |
| `Microsoft.CognitiveServices/accounts` (kind: TextAnalytics, etc.) | `ai_foundry` (predeterminado) |
| `Microsoft.CognitiveServices/accounts/projects` | `ai_foundry` |
| `Microsoft.Search/searchServices` | `search` |
| `Microsoft.Storage/storageAccounts` | `storage` |
| `Microsoft.KeyVault/vaults` | `keyvault` |
| `Microsoft.Databricks/workspaces` | `databricks` |
| `Microsoft.Sql/servers` | `sql_server` |
| `Microsoft.Sql/servers/databases` | `sql_database` |
| `Microsoft.DocumentDB/databaseAccounts` | `cosmos_db` |
| `Microsoft.Web/sites` | `app_service` |
| `Microsoft.ContainerService/managedClusters` | `aks` |
| `Microsoft.Web/sites` (kind: functionapp) | `function_app` |
| `Microsoft.Synapse/workspaces` | `synapse` |
| `Microsoft.Fabric/capacities` | `fabric` |
| `Microsoft.DataFactory/factories` | `adf` |
| `Microsoft.Compute/virtualMachines` | `vm` |
| `Microsoft.Network/privateEndpoints` | `pe` |
| `Microsoft.Network/virtualNetworks` | (Representada como límite de VNet; no se incluye en services) |
| `Microsoft.Network/networkSecurityGroups` | `nsg` |
| `Microsoft.Network/bastionHosts` | `bastion` |
| `Microsoft.OperationalInsights/workspaces` | `log_analytics` |
| `Microsoft.Insights/components` | `app_insights` |
| Otros | `default` |

### Reglas de construcción del JSON de services

```json
{
  "id": "nombre del recurso (en minúsculas, sin caracteres especiales)",
  "name": "nombre real del recurso",
  "type": "determinado a partir de la tabla de correspondencias anterior",
  "sku": "SKU real (si está disponible)",
  "private": true/false,  // true si hay un PE conectado
  "details": ["property1", "property2", ...]
}
```

**Información que debe incluirse en details:**

- URL del punto de conexión
- Detalles de SKU o nivel
- kind (AIServices, OpenAI, etc.)
- Lista de despliegues de modelos (Foundry)
- Propiedades principales (isHnsEnabled, semanticSearch, etc.)
- Región

### Información de VNet → Parámetro `--vnet-info`

Si se encuentra una VNet, muéstrala en la etiqueta del límite mediante `--vnet-info`:

```
--vnet-info "10.0.0.0/16 | pe-subnet: 10.0.1.0/24 | <region>"
```

### Generación de nodos PE

Si se encuentran PE, añade cada uno como nodo independiente y conéctalo al servicio correspondiente con el tipo `private`:

```json
{"id": "pe_<serviceId>", "name": "PE: <serviceName>", "type": "pe", "details": ["groupId: <groupId>", "<status>"]}
```

---

## Paso 5: Generación del diagrama y presentación a la persona

Nombre del archivo de diagrama: `<project-name>/00_arch_current.html`

Usa el nombre del grupo de recursos analizado como nombre predeterminado del proyecto:

```
ask_user({
  question: "Elige un nombre de proyecto. (Será el nombre de la carpeta de resultados del análisis)",
  choices: ["<RG-name>", "azure-analysis"]
})
```

Después de generar el diagrama, informa:

```
## Arquitectura actual de Azure

[Diagrama interactivo: 00_arch_current.html]

Recursos analizados (N en total):
[Tabla de resumen por tipo de recurso]

¿Qué quieres cambiar aquí?
- 🔧 Mejora del rendimiento ("va lento", "aumentar el rendimiento")
- 💰 Optimización de costos ("reducir costos", "abaratarlo")
- 🔒 Fortalecimiento de seguridad ("añadir PE", "bloquear acceso público")
- 🌐 Cambios de red ("separar la VNet", "añadir Bastion")
- ➕ Añadir o quitar recursos ("añadir una VM", "eliminar esto")
- 📊 Supervisión ("configurar registros", "añadir alertas")
- 🤔 Diagnóstico ("¿está bien esta arquitectura?", "¿qué falla?")
- O simplemente obtener el diagrama y terminar aquí
```

---

## Paso 6: Conversación sobre modificaciones → Transición a la fase 1

Cuando la persona solicite modificaciones, pasa a la fase 1 (phase1-advisor.md).
Este es el **punto de entrada de la ruta B**, que usa los resultados del análisis existente como referencia.

### Gestión de solicitudes de modificación en lenguaje natural: patrones de preguntas aclaratorias

Haz preguntas aclaratorias para concretar las solicitudes imprecisas de la persona:

**🔧 Rendimiento**

| Solicitud de la persona | Ejemplo de pregunta aclaratoria |
|---|---|
| "Va lento" / "La respuesta tarda demasiado" | "¿Qué servicio va lento? ¿Conviene subir de SKU o cambiar la región?" |
| "Quiero aumentar el rendimiento" | "¿De qué servicio debemos aumentar el rendimiento? ¿Escalar horizontalmente? ¿Aumentar DTU/RU?" |
| "La indexación de AI Search es lenta" | "¿Añadimos particiones? ¿Subimos la SKU a S2?" |

**💰 Costo**

| Solicitud de la persona | Ejemplo de pregunta aclaratoria |
|---|---|
| "Quiero reducir costos" | "¿De qué servicio reducimos el costo? ¿Bajamos de SKU? ¿Limpiamos recursos sin uso?" |
| "¿Cuánto cuesta esto?" | Consultar precios en MS Docs y proporcionar un costo estimado según las SKU actuales |
| "Es un entorno de desarrollo, así que hazlo barato" | "¿Pasamos a niveles Free/Basic? ¿Qué servicios?" |

**🔒 Seguridad**

| Solicitud de la persona | Ejemplo de pregunta aclaratoria |
|---|---|
| "Refuerza la seguridad" | "¿Añadimos PE a los servicios que no los tienen? ¿Revisamos RBAC? ¿Deshabilitamos publicNetworkAccess?" |
| "Bloquea el acceso público" | "¿Aplicamos PE + publicNetworkAccess: Disabled a todos los servicios?" |
| "Gestiona las claves" | "¿Añadimos Key Vault y lo conectamos con una identidad administrada?" |

**🌐 Red**

| Solicitud de la persona | Ejemplo de pregunta aclaratoria |
|---|---|
| "Añade PE" | "¿A qué servicio? ¿Los añadimos a todos los servicios a la vez?" |
| "Separa la VNet" | "¿Qué subredes separamos? ¿Añadimos también NSG?" |
| "Añade Bastion" | "Se añadirá Azure Bastion para acceder a las máquinas virtuales. Especifica el CIDR de la subred." |

**➕ Añadir o quitar recursos**

| Solicitud de la persona | Ejemplo de pregunta aclaratoria |
|---|---|
| "Añade una VM" | "¿Cuántas? ¿Qué SKU? ¿La misma VNet? ¿Qué sistema operativo?" |
| "Añade Fabric" | "¿Qué SKU? ¿Cuál es el correo del administrador?" |
| "Elimina esto" | "¿Seguro que quieres eliminar [nombre del recurso]? También se eliminarán los PE conectados." |

**📊 Supervisión y operaciones**

| Solicitud de la persona | Ejemplo de pregunta aclaratoria |
|---|---|
| "Quiero ver los registros" | "¿Añadimos un área de trabajo de Log Analytics y conectamos la configuración de diagnóstico?" |
| "Configura alertas" | "¿Para qué métricas? ¿CPU? ¿Tasa de errores? ¿Tiempo de respuesta?" |
| "Conecta Application Insights" | "¿A qué servicio? ¿App Service? ¿Function App?" |

**🔄 Migración y cambios**

| Solicitud de la persona | Ejemplo de pregunta aclaratoria |
|---|---|
| "Cambia la región" | "¿A qué región? Verificaré que todos los servicios estén disponibles allí." |
| "Cambia SQL por Cosmos" | "¿Qué tipo de API de Cosmos DB? (SQL/MongoDB/Cassandra) También puedo proporcionar una guía de migración de datos." |
| "Cambia Foundry por Hub" | "Hub solo es adecuado cuando se necesita entrenamiento de ML o modelos de código abierto. Voy a verificar el caso de uso." |

**🤔 Diagnóstico y preguntas**

| Solicitud de la persona | Ejemplo de pregunta aclaratoria |
|---|---|
| "¿Qué falla?" | Analizar la configuración actual (publicNetworkAccess abierto, PE sin conectar, SKU inadecuada, etc.) y sugerir mejoras |
| "¿Está bien esta arquitectura?" | Revisar según Well-Architected Framework (seguridad, fiabilidad, rendimiento, costo y operaciones) |
| "¿Está bien conectado el PE?" | Comprobar el estado de conexión con `az network private-endpoint show` e informar |
| "Solo quiero el diagrama" | No pasar a la fase 1; proporcionar la ruta de 00_arch_current.html y terminar |

Una vez definidas las modificaciones:

1. Aplica la regla de confirmación de cambios de la fase 1
2. Comprueba los hechos (contrasta con MS Docs)
3. Genera el diagrama actualizado (01_arch_diagram_draft.html)
4. Confirmación de la persona → Continuar con las fases 2–4

---

## Optimización del rendimiento del análisis

- Si hay 50 recursos o más, advierte a la persona: "Hay muchos recursos, por lo que el análisis puede tardar."
- Ejecuta primero `az resource list` para determinar el número de recursos y después continúa con las consultas detalladas
- Consulta primero los servicios principales (Foundry, Search, Storage, KeyVault, VNet, PE) y recopila solo información básica del resto mediante `az resource show`
- Mantén informada a la persona sobre el progreso:
  > **⏳ Analizando recursos**: M de N recursos completados

---

## Gestión de recursos no compatibles

Para tipos de recurso no incluidos en las correspondencias de tipos del diagrama:

- Muéstralos con el tipo `default` (icono de interrogación)
- Incluye el nombre y tipo del recurso en details
- Muéstralos a la persona, pero no intentes deducir relaciones
