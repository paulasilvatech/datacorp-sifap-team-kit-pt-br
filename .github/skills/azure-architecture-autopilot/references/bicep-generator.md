# Agente generador de Bicep

Recibe la especificación de arquitectura finalizada en la fase 1 y genera plantillas Bicep listas para desplegar.

## Paso 0: Verificar las especificaciones más recientes (obligatorio antes de generar Bicep)

No fijes versiones de API en el código Bicep sin verificarlas.
Consulta siempre la referencia de Bicep de MS Docs para los servicios que vayas a usar y confirma la apiVersion estable más reciente antes de utilizarla.

### Pasos de verificación

1. Identifica la lista de servicios que se utilizarán
2. Consulta la URL de MS Docs de cada servicio (mediante la herramienta web_fetch)
3. Confirma en la página la versión estable más reciente de la API
4. Escribe Bicep usando esa versión

### Comprobación de disponibilidad para desplegar modelos (obligatoria al usar modelos de Foundry/OpenAI)

Verifica que el modelo indicado por la persona pueda desplegarse realmente en la región de destino **antes de generar Bicep**.
La disponibilidad de modelos varía por región y cambia con frecuencia; no te bases en conocimiento estático.

**Métodos de verificación (por orden de prioridad):**

1. Consulta la página de disponibilidad de modelos de MS Docs: https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models
2. O consulta directamente mediante Azure CLI:

   ```powershell
   az cognitiveservices account list-models --name "<FOUNDRY_NAME>" --resource-group "<RG_NAME>" -o table
   ```

   (Cuando el recurso de Foundry ya exista)

**Si el modelo no está disponible en la región de destino:**

- Informa a la persona y sugiere regiones disponibles o modelos alternativos
- No sustituyas el modelo ni la región sin la aprobación de la persona

### URL de MS Docs por servicio

El registro completo de URL está en `references/azure-dynamic-sources.md`. Consulta ese archivo al recuperar información.
Los archivos de referencia se encuentran en la ruta `.github/skills/azure-architecture-autopilot/`.

> **Importante**: consulta directamente la URL mediante web_fetch para confirmar la apiVersion estable más reciente. No uses sin verificar las versiones fijadas en archivos de referencia o conversaciones anteriores.

> **Verifica siempre también los recursos secundarios**: comprueba las versiones de API de los recursos secundarios (accounts/projects, accounts/deployments, privateDnsZones/virtualNetworkLinks, privateEndpoints/privateDnsZoneGroups, etc.) desde la página del recurso principal. Sus versiones de API pueden ser diferentes.

> **El mismo principio se aplica ante errores o advertencias**: si se produce un error relacionado con la versión de API durante what-if o el despliegue, no asumas que la versión del mensaje de error es la "más reciente" ni la apliques directamente. Vuelve siempre a consultar la URL de MS Docs para confirmar la versión estable más reciente real antes de corregir.

---

## Principios de consulta de información (estable frente a dinámica)

### Consultar siempre (dinámica)

- Versión de API → Consultar las URL de `azure-dynamic-sources.md`
- Disponibilidad de modelos (nombre, versión, región) → Consultar
- Lista de SKU y precios → Consultar
- Disponibilidad regional → Consultar

### Primero los archivos de referencia (estable)

- Patrones de propiedades obligatorias (`isHnsEnabled`, `allowProjectManagement`, etc.) → `service-gotchas.md`
- Correspondencias entre groupId de PE y zonas DNS (servicios principales) → `service-gotchas.md`
- Patrones comunes de PE, seguridad y nomenclatura → `azure-common-patterns.md`
- Guía de configuración de servicios de IA y datos → `ai-data.md`

> Si tienes dudas sobre la información estable, vuelve a verificarla en MS Docs. No es necesario consultarla externamente cada vez.

---

## Flujo alternativo para servicios desconocidos

Cuando la persona solicite un servicio que no esté incluido en el alcance de v1 (`ai-data.md`):

1. **Informa a la persona**: "Este servicio queda fuera del alcance predeterminado de v1. Se generará con el mejor esfuerzo posible, consultando MS Docs."
2. **Consulta la versión de API**: construye la URL con el formato `https://learn.microsoft.com/en-us/azure/templates/microsoft.{provider}/{resourceType}` y consúltala
3. **Identifica el tipo de recurso y las propiedades obligatorias**: confírmalos en la documentación consultada
4. **Verifica el mapeo de PE**: consulta `https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns` para confirmar groupId y zona DNS
5. **Aplica los patrones comunes**: aplica los patrones de seguridad, red y nomenclatura de `azure-common-patterns.md`
6. **Escribe Bicep**: genera el módulo a partir de la información anterior
7. **Entrega al revisor**: valida la compilación con `az bicep build`

## Información de entrada

La siguiente información debe quedar definida al finalizar la fase 1:

```
- services: [Lista de servicios + SKU]
- networking: Si se usa private_endpoint
- resource_group: Nombre del grupo de recursos
- location: Ubicación de despliegue (confirmada con la persona en la fase 1)
- subscription_id: ID de la suscripción de Azure
```

## Estructura de los archivos de salida

```
<project-name>/
├── main.bicep              # Orquestación principal: llamadas a módulos y paso de parámetros
├── main.bicepparam         # Archivo de parámetros: valores por entorno, sin información sensible
└── modules/
    ├── network.bicep           # VNet, subred (incluida pe-subnet)
    ├── ai.bicep                # Servicios de IA (según los requisitos de la persona)
    ├── storage.bicep           # ADLS Gen2 (isHnsEnabled: true obligatorio)
    ├── fabric.bicep            # Microsoft Fabric Capacity (solo cuando sea necesario)
    ├── keyvault.bicep          # Key Vault
    ├── monitoring.bicep        # Application Insights, Log Analytics (solo para configuraciones basadas en Hub)
    └── private-endpoints.bicep # Todos los PE + zonas DNS privadas + enlaces VNet + grupos de zonas DNS
```

## Responsabilidades de los módulos

### `network.bicep`

- VNet: CIDR recibido como parámetro (para evitar conflictos con espacios de direcciones existentes en el entorno del cliente)
- pe-subnet: `privateEndpointNetworkPolicies: 'Disabled'` obligatorio
- Subredes adicionales gestionadas mediante parámetros según sea necesario

### `ai.bicep`

- **Recurso de Microsoft Foundry** (`Microsoft.CognitiveServices/accounts`, `kind: 'AIServices'`): recurso de IA de nivel superior
  - `customSubDomainName: foundryName` obligatorio: **no puede cambiarse después de la creación. Si se omite, hay que eliminar y volver a crear el recurso**
  - `identity: { type: 'SystemAssigned' }` obligatorio
  - `allowProjectManagement: true` obligatorio
  - Despliegue de modelos (`Microsoft.CognitiveServices/accounts/deployments`): se realiza en el nivel del recurso de Foundry
- **⚠️ Proyecto de Foundry** (`Microsoft.CognitiveServices/accounts/projects`): **debe crearse como recurso secundario**
  - Tipo de recurso: `Microsoft.CognitiveServices/accounts/projects` (nunca crearlo como un recurso `accounts` independiente)
  - Usa `parent: foundryAccount` en Bicep
  - Ejemplo incorrecto: crear un proyecto como una cuenta `kind: 'AIServices'` separada → El portal no lo reconoce
  - Ejemplo correcto:

    ```bicep
    resource foundryProject 'Microsoft.CognitiveServices/accounts/projects@<apiVersion>' = {
      parent: foundryAccount
      name: 'project-${uniqueString(resourceGroup().id)}'
      location: location
      kind: 'AIServices'
      properties: {}
    }
    ```

- **Azure AI Search**: configuración de clasificación semántica y búsqueda vectorial
- La configuración basada en Hub (`Microsoft.MachineLearningServices/workspaces`) solo debe considerarse si la persona la solicita explícitamente o si se necesita entrenamiento de ML o modelos de código abierto. Para cargas habituales de IA/RAG, Foundry (AIServices) es la opción predeterminada

**⛔ Propiedades prohibidas de CognitiveServices:**

- `apiProperties.statisticsEnabled`: esta propiedad no existe. Nunca la uses. Provoca el error `ApiPropertiesInvalid` durante el despliegue
- `apiProperties.qnaAzureSearchEndpointId`: solo para QnA Maker. No la uses con Foundry
- No añadas arbitrariamente propiedades no validadas a `properties.apiProperties`

### `storage.bicep`

- ADLS Gen2: `isHnsEnabled: true` ← **Nunca lo omitas**
- Contenedores: raw, processed, curated (o según los requisitos)
- `allowBlobPublicAccess: false`, `minimumTlsVersion: 'TLS1_2'`

### `keyvault.bicep`

- `enableRbacAuthorization: true` (no uses el modelo de directivas de acceso)
- `enableSoftDelete: true`, `softDeleteRetentionInDays: 90`
- `enablePurgeProtection: true`

### `monitoring.bicep`

- Área de trabajo de Log Analytics
- Application Insights (solo necesario en configuraciones basadas en Hub; no se requiere para Foundry AIServices)

### `private-endpoints.bicep`

- Conjunto de 3 componentes para cada servicio:
  1. `Microsoft.Network/privateEndpoints` (ubicado en pe-subnet)
  2. `Microsoft.Network/privateDnsZones` + enlace VNet (`registrationEnabled: false`)
  3. `Microsoft.Network/privateEndpoints/privateDnsZoneGroups`
- Para las correspondencias de zonas DNS por servicio, consulta `references/service-gotchas.md`

**⚠️ Reglas DNS de los PE de Foundry/AIServices:**

- groupId del PE: `account`
- El grupo de zonas DNS debe incluir **2 zonas**:
  1. `privatelink.cognitiveservices.azure.com`
  2. `privatelink.openai.azure.com`
- Incluir solo una provoca fallos de resolución DNS en las llamadas a la API de OpenAI → Error de conexión

**⚠️ Reglas de PE para ADLS Gen2 (isHnsEnabled: true):**

- Se requieren 2 PE:
  1. `blob` → `privatelink.blob.core.windows.net`
  2. `dfs` → `privatelink.dfs.core.windows.net`
- Sin el PE de DFS, las operaciones de Data Lake (creación de sistemas de archivos y manipulación de directorios) fallarán

### `rbac.bicep` (o directamente en main.bicep)

**⚠️ Asignación de roles RBAC: nunca omitir**

**Todo servicio con una identidad administrada (`identity.type: 'SystemAssigned'`) debe tener asignaciones de roles RBAC creadas.**
Una identidad sin asignaciones de roles provoca fallos de autenticación entre servicios.
No es opcional; es un **elemento obligatorio**.
Su omisión se notificará como CRITICAL (crítica) en la revisión de la fase 3.

- Correspondencias RBAC obligatorias:

| Servicio de origen | Servicio de destino | Rol | ID de definición del rol |
|------------|-----------|------|-------------------|
| Foundry | Storage | `Storage Blob Data Contributor` | `ba92f5b4-2d11-453d-a403-e96b0029c9fe` |
| Foundry | AI Search | `Search Index Data Contributor` | `8ebe5a00-799e-43f5-93ac-243d3dce84a7` |
| Foundry | AI Search | `Search Service Contributor` | `7ca78c08-252a-4471-8644-bb5ff32d4ba0` |
| App Service | Key Vault | `Key Vault Secrets User` | `4633458b-17de-408a-b874-0445c86b69e6` |
| AKS (kubeletIdentity) | ACR | `AcrPull` | `7f951dda-4ed3-4680-a7ca-43fe172d538d` |
| Data Factory | Storage | `Storage Blob Data Contributor` | `ba92f5b4-2d11-453d-a403-e96b0029c9fe` |
| Data Factory | Key Vault | `Key Vault Secrets User` | `4633458b-17de-408a-b874-0445c86b69e6` |
| Databricks | Storage | `Storage Blob Data Contributor` | `ba92f5b4-2d11-453d-a403-e96b0029c9fe` |

> **Regla especial de AKS**: AKS usa `identityProfile.kubeletidentity.objectId`, no `identity.principalId`.

```bicep
// Ejemplo de RBAC: Foundry → Storage Blob Data Contributor
resource foundryStorageRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageAccount.id, foundry.id, 'ba92f5b4-2d11-453d-a403-e96b0029c9fe')
  scope: storageAccount
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'ba92f5b4-2d11-453d-a403-e96b0029c9fe')
    principalId: foundry.identity.principalId
    principalType: 'ServicePrincipal'
  }
}
```

### Reglas de SQL Server

- **Gestión de contraseñas**: declara `@secure() param sqlAdminPassword string` en main.bicep y pásalo a los módulos
  - No lo generes con `newGuid()` dentro de los módulos; la contraseña cambiaría al volver a desplegar
  - Almacénalo como un secreto de Key Vault para poder recuperarlo después del despliegue
- **Método de autenticación**: usa `administrators.azureADOnlyAuthentication: true` de forma predeterminada
  - Muchas políticas organizativas (MCAPS, etc.) bloquean la autenticación SQL independiente
  - La autenticación solo con AAD más la identidad administrada es la configuración más segura

### Gestión de secretos de red

- **Clave compartida de VPN Gateway**: `@secure() param vpnSharedKey string`; `@secure()` es obligatorio
- Nunca incluyas claves VPN en texto sin cifrar en `.bicepparam`; proporciónalas durante el despliegue o usa una referencia a Key Vault
- Esta regla se aplica igual que a las contraseñas SQL
- **Se aplica a**: clave compartida VPN, clave de autorización de ExpressRoute, PSK de Wi-Fi y todos los demás secretos de red
- Los parámetros de los módulos también deben incluir el decorador `@secure()`

### ⚠️ Reglas de coherencia del aislamiento de red

- Al establecer `publicNetworkAccess: 'Disabled'`, también **debes** crear el PE correspondiente para ese servicio
- Establecer publicNetworkAccess en Disabled sin un PE hace que el servicio sea inaccesible → No se puede usar después del despliegue
- El revisor de la fase 3 debe notificar esta incoherencia como **CRITICAL (crítica)**
- Si se detecta una incoherencia, añade un módulo de PE o restablece publicNetworkAccess a Enabled

## Principios obligatorios de codificación

### Convenciones de nomenclatura

```bicep
// Usa uniqueString para evitar colisiones de nombres; siempre es obligatorio
param foundryName string = 'foundry-${uniqueString(resourceGroup().id)}'
param searchName string = 'srch-${uniqueString(resourceGroup().id)}'
param storageName string = 'st${uniqueString(resourceGroup().id)}'  // No se permiten caracteres especiales
param keyVaultName string = 'kv-${uniqueString(resourceGroup().id)}'
```

> **⚠️ Los recursos que requieren `customSubDomainName` (Foundry, Cognitive Services, etc.) deben incluir `uniqueString()`.**
> Las cadenas estáticas (por ejemplo, `'my-rag-chatbot'`) pueden estar en uso en otro inquilino y provocar fallos de despliegue.
> Lo mismo se aplica a los nombres de proyectos de Foundry: `'project-${uniqueString(resourceGroup().id)}'`

### Aislamiento de red

```bicep
// Obligatorio para todos los servicios cuando se usan puntos de conexión privados
publicNetworkAccess: 'Disabled'
networkAcls: {
  defaultAction: 'Deny'
  ipRules: []
  virtualNetworkRules: []
}
```

### Gestión de dependencias

```bicep
// Usa dependencias implícitas mediante referencias a recursos en lugar de dependsOn explícitos
resource aiProject '...' = {
  properties: {
    hubResourceId: aiHub.id  // Referencia a aiHub → aiHub se despliega primero automáticamente
  }
}
```

### Seguridad

```bicep
// Usa referencias a Key Vault para valores sensibles; nunca los guardes sin cifrar en archivos de parámetros
@secure()
param adminPassword string  // No incluyas valores sin cifrar en main.bicepparam
```

### Comentarios del código

```bicep
// Recurso de Microsoft Foundry: kind: 'AIServices'
// customSubDomainName: obligatorio y único globalmente. No puede cambiarse después de crearlo; si se omite, hay que eliminar y volver a crear el recurso
// allowProjectManagement: true es obligatorio; de lo contrario, fallará la creación del proyecto de Foundry
// Sustituye apiVersion por la versión más reciente consultada en el paso 0
resource foundry 'Microsoft.CognitiveServices/accounts@<version fetched in Step 0>' = {
  kind: 'AIServices'
  properties: {
    customSubDomainName: foundryName
    allowProjectManagement: true
    ...
  }
}
```

### ⚠️ Validación de calidad del código Bicep (obligatoria después de generarlo)

**Validación de declaraciones de módulos:**

- Verifica que la propiedad `name:` de cada bloque de módulo no esté duplicada
- Ejemplo correcto: `name: 'deploy-sql'`
- Ejemplo incorrecto: `name: 'name: 'deploy-sql'` (name: duplicado → Error de compilación)

**Prevención de propiedades duplicadas:**

- Si el mismo nombre de propiedad aparece más de una vez en un bloque de recurso, provoca un error de compilación
- Es especialmente habitual en recursos complejos como VPN Gateway (`gatewayType`), Firewall, AKS, etc.
- Busca `BCP025: The property "xxx" is declared multiple times` en la salida de `az bicep build`

**Es obligatorio ejecutar `az bicep build`:**

- Después de generar todos los archivos Bicep, ejecuta siempre `az bicep build --file main.bicep`
- Corrige los errores y vuelve a compilar
- Las advertencias (BCP081, etc.) pueden ignorarse después de verificar la versión de API en MS Docs

## Estructura base de main.bicep

```bicep
// ============================================================
// Infraestructura de Azure [Nombre del proyecto]: main.bicep
// Generado: [Fecha]
// ============================================================

targetScope = 'resourceGroup'

// ── Parámetros comunes ─────────────────────────────────────
param location string   // Ubicación confirmada en la fase 1; no fijarla en el código
param projectPrefix string
param vnetAddressPrefix string    // ← Confirmar con la persona. Evitar conflictos con redes existentes
param peSubnetPrefix string       // ← CIDR de la subred dedicada a PE dentro de la VNet

// ── Red ───────────────────────────────────────────────
module network './modules/network.bicep' = {
  name: 'deploy-network'
  params: {
    location: location
    vnetAddressPrefix: vnetAddressPrefix
    peSubnetPrefix: peSubnetPrefix
  }
}

// ── Servicios de IA y datos ──────────────────────────────────────
module ai './modules/ai.bicep' = {
  name: 'deploy-ai'
  params: {
    location: location
    // Añade parámetros separados si las regiones difieren por servicio; verifica las regiones disponibles en MS Docs
  }
  dependsOn: [network]
}

// ── Almacenamiento ───────────────────────────────────────────────
module storage './modules/storage.bicep' = {
  name: 'deploy-storage'
  params: {
    location: location
  }
}

// ── Key Vault ─────────────────────────────────────────────
module keyVault './modules/keyvault.bicep' = {
  name: 'deploy-keyvault'
  params: {
    location: location
  }
}

// ── Puntos de conexión privados (todos los servicios) ──────────────────────
module privateEndpoints './modules/private-endpoints.bicep' = {
  name: 'deploy-private-endpoints'
  params: {
    location: location
    vnetId: network.outputs.vnetId
    peSubnetId: network.outputs.peSubnetId
    foundryId: ai.outputs.foundryId
    searchId: ai.outputs.searchId
    storageId: storage.outputs.storageId
    keyVaultId: keyVault.outputs.keyVaultId
  }
}

// ── Salidas ───────────────────────────────────────────────
output vnetId string = network.outputs.vnetId
output foundryEndpoint string = ai.outputs.foundryEndpoint
output searchEndpoint string = ai.outputs.searchEndpoint
```

## Estructura base de main.bicepparam

```bicep
using './main.bicep'

param location = '<Location confirmed in Phase 1>'
param projectPrefix = '<Project prefix>'
// No incluyas valores sensibles aquí; usa referencias a Key Vault
// Establece las regiones después de verificar la disponibilidad por servicio en MS Docs
```

### Gestión de parámetros @secure()

Cuando un archivo `.bicepparam` contiene una directiva `using`, no se pueden usar opciones `--parameters` adicionales con `az deployment`.
Por tanto, los parámetros `@secure()` deben seguir estas reglas:

- **Establece un valor predeterminado cuando sea posible**: `@secure() param password string = newGuid()`
- **Si los parámetros @secure() requieren datos de la persona**: genera un archivo de parámetros JSON (`main.parameters.json`) junto a los demás, en lugar de usar `.bicepparam`
- **Nunca hagas esto**: generar un comando que use `.bicepparam` y `--parameters key=value` simultáneamente

## Lista de verificación de errores habituales

La lista completa está en `references/service-gotchas.md`. Resumen de los puntos principales:

| Elemento | ❌ Incorrecto | ✅ Correcto |
|------|--------|----------|
| ADLS Gen2 | `isHnsEnabled` omitido | `isHnsEnabled: true` |
| Subred de PE | Política sin configurar | `privateEndpointNetworkPolicies: 'Disabled'` |
| Configuración de PE | Solo se crea el PE | PE + zona DNS + enlace VNet + grupo de zonas DNS |
| Foundry | `kind: 'OpenAI'` | `kind: 'AIServices'` + `allowProjectManagement: true` |
| Foundry | `customSubDomainName` omitido | `customSubDomainName: foundryName`; no puede cambiarse después de la creación |
| Proyecto de Foundry | No se crea | Debe crearse siempre junto con el recurso de Foundry |
| Uso de Hub | Se usa para IA convencional | Solo cuando la persona lo solicita explícitamente o se requieren ML o modelos de código abierto |
| Red pública | Sin configurar | `publicNetworkAccess: 'Disabled'` |
| Nombre de Storage | Contiene guiones | Solo minúsculas y dígitos; se recomienda `uniqueString()` |
| Versión de API | Copiada de un valor anterior | Consultar MS Docs (dinámica) |
| Región | Fijada en el código | Parámetro + verificación de disponibilidad en MS Docs (dinámica) |

## Una vez finalizada la generación

Cuando finalice la generación de Bicep:

1. Entrega a la persona un informe resumido con la lista de archivos generados y la función de cada uno
2. Pasa inmediatamente a la fase 3 (revisor de Bicep)
3. El revisor realiza la revisión automatizada y las correcciones siguiendo las directrices de `references/bicep-reviewer.md`
