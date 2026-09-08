# Aspectos que debes tener en cuenta por servicio (estables)

Resumen por servicio de **propiedades obligatorias no evidentes**, **errores habituales** y **correspondencias de PE**.
Aquí solo se incluyen patrones prácticamente inmutables. No se incluyen valores dinámicos como versiones de API, listas de SKU y regiones.

---

## 1. Propiedades obligatorias (su omisión provoca fallos de despliegue o problemas funcionales)

| Servicio | Propiedad obligatoria | Resultado si se omite | Notas |
|---------|------------------|-------------------|-------|
| ADLS Gen2 | `isHnsEnabled: true` | Se convierte en Blob Storage convencional. No se puede revertir | `kind: 'StorageV2'` obligatorio |
| Cuenta de almacenamiento | Sin caracteres especiales ni guiones en el nombre | Fallo de despliegue | Solo minúsculas y números, 3-24 caracteres |
| Foundry (AIServices) | `customSubDomainName: foundryName` | No se puede crear el proyecto ni cambiar después de la creación → Hay que eliminar y volver a crear el recurso | Valor único globalmente |
| Foundry (AIServices) | `allowProjectManagement: true` | No se puede crear el proyecto de Foundry | `kind: 'AIServices'` |
| Foundry (AIServices) | `identity: { type: 'SystemAssigned' }` | Falla la creación del proyecto | |
| Proyecto de Foundry | Debe crearse junto con el recurso de Foundry | No se puede usar desde el portal | `accounts/projects` |
| Key Vault | `enableRbacAuthorization: true` | Riesgo de uso combinado de directivas de acceso | |
| Key Vault | `enablePurgeProtection: true` | Obligatorio en producción | |
| Fabric Capacity | `administration.members` obligatorio | Fallo de despliegue | Correo del administrador |
| Subred de PE | `privateEndpointNetworkPolicies: 'Disabled'` | Fallo de despliegue del PE | |
| Zona DNS de PE | `registrationEnabled: false` (enlace VNet) | Posible conflicto DNS | |
| Configuración de PE | Conjunto de 3 componentes (PE + zona DNS + enlace VNet + grupo de zonas) | Falla la resolución DNS incluso con el PE presente | |

---

## 2. Correspondencias de groupId de PE y zonas DNS (servicios principales)

Las correspondencias siguientes son estables, pero al añadir servicios nuevos vuelve a verificarlas en el documento de integración DNS de PE indicado en `azure-dynamic-sources.md`.

| Servicio | groupId | Zona DNS privada |
|---------|---------|-----------------|
| Azure OpenAI / CognitiveServices | `account` | `privatelink.cognitiveservices.azure.com` |
| ⚠️ (adicional para Foundry/AIServices) | `account` | `privatelink.openai.azure.com` ← **Ambas zonas deben incluirse en el grupo de zonas DNS. Si se omite, falla la resolución DNS de la API de OpenAI** |
| Azure AI Search | `searchService` | `privatelink.search.windows.net` |
| Storage (Blob/ADLS) | `blob` | `privatelink.blob.core.windows.net` |
| Storage (DFS/ADLS Gen2) | `dfs` | `privatelink.dfs.core.windows.net` |
| Key Vault | `vault` | `privatelink.vaultcore.azure.net` |
| Azure ML / AI Hub | `amlworkspace` | `privatelink.api.azureml.ms` |
| Container Registry | `registry` | `privatelink.azurecr.io` |
| Cosmos DB (SQL) | `Sql` | `privatelink.documents.azure.com` |
| Azure Cache for Redis | `redisCache` | `privatelink.redis.cache.windows.net` |
| Data Factory | `dataFactory` | `privatelink.datafactory.azure.net` |
| API Management | `Gateway` | `privatelink.azure-api.net` |
| Event Hub | `namespace` | `privatelink.servicebus.windows.net` |
| Service Bus | `namespace` | `privatelink.servicebus.windows.net` |
| Monitor (AMPLS) | ⚠️ Configuración compleja: consulta más abajo | ⚠️ Se requieren varias zonas DNS: consulta más abajo |

> **Nota sobre ADLS Gen2**: cuando `isHnsEnabled: true`, **se requieren los PE de `blob` y de `dfs`**.
>
> - Con solo el PE de `blob`, la API de Blob funciona, pero las operaciones de Data Lake (creación de sistemas de archivos, manipulación de directorios y protocolo `abfss://`) fallan.
> - PE de DFS: groupId `dfs`, zona DNS `privatelink.dfs.core.windows.net`
>
> **⚠️ Nota sobre Azure Monitor Private Link (AMPLS)**: Azure Monitor no puede configurarse con un único PE y una sola zona DNS. Se conecta mediante Azure Monitor Private Link Scope (AMPLS) y requiere las **5 zonas DNS**:
>
> - `privatelink.monitor.azure.com`
> - `privatelink.oms.opinsights.azure.com`
> - `privatelink.ods.opinsights.azure.com`
> - `privatelink.agentsvc.azure-automation.net`
> - `privatelink.blob.core.windows.net` (para la ingesta de datos de Log Analytics)
>
> Este mapeo es complejo y puede cambiar, por lo que debes consultar y verificar siempre MS Docs al configurar el PE de Monitor:
> https://learn.microsoft.com/en-us/azure/azure-monitor/logs/private-link-configure

---

## 3. Lista de verificación de errores habituales

| Elemento | ❌ Ejemplo incorrecto | ✅ Ejemplo correcto |
|------|---------------------|-------------------|
| HNS de ADLS Gen2 | `isHnsEnabled` omitido o `false` | `isHnsEnabled: true` |
| Subred de PE | Política sin configurar | `privateEndpointNetworkPolicies: 'Disabled'` |
| Grupo de zonas DNS | Solo se crea el PE | PE + zona DNS + enlace VNet + grupo de zonas DNS |
| Recurso de Foundry | `kind: 'OpenAI'` | `kind: 'AIServices'` + `allowProjectManagement: true` |
| Recurso de Foundry | `customSubDomainName` omitido | `customSubDomainName: foundryName`; no puede cambiarse después de la creación |
| Proyecto de Foundry | Solo existe Foundry, sin proyecto | Deben crearse juntos |
| Autenticación de Key Vault | Directiva de acceso | `enableRbacAuthorization: true` |
| Red pública | Sin configurar | `publicNetworkAccess: 'Disabled'` |
| Nombre de Storage | `st-my-storage` | `stmystorage` o `st${uniqueString(...)}` |
| Versión de API | Copiada de una conversación o error anterior | Verificar la versión estable más reciente en MS Docs |
| Región | Fijada en el código (`'eastus'`) | Pasar como parámetro (`param location`) |
| Valores sensibles | Texto sin cifrar en `.bicepparam` | `@secure()` + referencia a Key Vault |

---

## 4. Reglas de decisión sobre las relaciones entre servicios

Se presentan como **reglas de selección predeterminadas**, no como decisiones absolutas.

### Foundry frente a Azure OpenAI frente a AI Hub

```
Reglas predeterminadas:
├─ Cargas de trabajo de IA/RAG → Usar Microsoft Foundry (kind: 'AIServices')
│   ├─ Crear juntos el recurso de Foundry y el proyecto de Foundry
│   └─ El despliegue de modelos se realiza en el nivel del recurso de Foundry (accounts/deployments)
│
├─ Se necesita entrenamiento de ML o de modelos de código abierto → Considerar AI Hub (MachineLearningServices)
│   └─ Solo si la persona lo solicita explícitamente o se necesitan funcionalidades no admitidas por Foundry
│
└─ Recurso independiente de Azure OpenAI →
    Considerarlo solo si la persona lo solicita explícitamente o
    la documentación oficial exige un recurso separado
```

> Estas reglas son una **guía de selección predeterminada** que refleja las recomendaciones actuales de Microsoft.
> Las relaciones entre productos de Azure pueden cambiar; consulta MS Docs si tienes dudas.

### Supervisión

```
Reglas predeterminadas:
├─ Foundry (AIServices) → No requiere Application Insights
└─ AI Hub (MachineLearningServices) → Requiere Application Insights + Log Analytics
```
