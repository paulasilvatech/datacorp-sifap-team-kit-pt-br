# Paquete de dominio: IA/datos (v1)

Guía de configuración de servicios especializada en cargas de trabajo de IA y datos de Azure.
Alcance de v1: Foundry, AI Search, ADLS Gen2, Key Vault, Fabric, ADF, VNet/PE.

> Propiedades obligatorias y errores habituales → `service-gotchas.md`
> Información dinámica (versión de API, SKU, región) → `azure-dynamic-sources.md`
> Patrones comunes (PE, seguridad, nomenclatura) → `azure-common-patterns.md`

---

## 1. Microsoft Foundry (CognitiveServices)

### Jerarquía de recursos

```
Microsoft.CognitiveServices/accounts (kind: 'AIServices')
├── /projects          — Proyecto de Foundry (obligatorio para acceder al portal)
└── /deployments       — Despliegues de modelos (GPT-4o, embeddings, etc.)
```

### Estructura central de Bicep: 1. Microsoft Foundry (CognitiveServices)

```bicep
// Recurso de Foundry
resource foundry 'Microsoft.CognitiveServices/accounts@<fetch>' = {
  name: foundryName
  location: location
  kind: 'AIServices'
  sku: { name: '<confirm with user>' }               // ← SKU confirmada tras consultar MS Docs en la fase 1
  identity: { type: 'SystemAssigned' }
  properties: {
    customSubDomainName: foundryName  // ← Obligatorio y único globalmente. No puede cambiarse después de la creación; si se omite, hay que eliminar y volver a crear el recurso
    allowProjectManagement: true
    publicNetworkAccess: 'Disabled'
    networkAcls: { defaultAction: 'Deny' }
  }
}

// Proyecto de Foundry: debe crearse junto con Foundry
resource project 'Microsoft.CognitiveServices/accounts/projects@<fetch>' = {
  parent: foundry
  name: '${foundryName}-project'
  location: location
  sku: { name: '<same as parent>' }
  kind: 'AIServices'
  identity: { type: 'SystemAssigned' }
  properties: {}
}

// Despliegue de modelos: en el nivel del recurso de Foundry
resource deployment 'Microsoft.CognitiveServices/accounts/deployments@<fetch>' = {
  parent: foundry
  name: '<model-name>'                              // ← Confirmado con la persona en la fase 1
  sku: {
    name: '<deployment-type>'                        // ← GlobalStandard, Standard, etc.; consultar MS Docs
    capacity: <confirm with user>                    // ← Unidades de capacidad; verificar el rango disponible en MS Docs
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: '<model-name>'                           // ← Es obligatorio consultar y verificar la disponibilidad
      version: '<fetch>'                             // ← La versión también se consulta
    }
  }
}
```

> `@<fetch>`: verifica la versión de API en las URL de `azure-dynamic-sources.md`.
> Nombre del modelo, versión, tipo de despliegue y capacidad: todos son datos dinámicos; se confirman con la persona después de consultar MS Docs en la fase 1.

---

## 2. Azure AI Search

### Estructura central de Bicep: 2. Azure AI Search

```bicep
resource search 'Microsoft.Search/searchServices@<fetch>' = {
  name: searchName
  location: location
  sku: { name: '<confirm with user>' }
  identity: { type: 'SystemAssigned' }
  properties: {
    hostingMode: 'default'
    publicNetworkAccess: 'disabled'
    semanticSearch: '<confirm with user>'    // disabled | free | standard; verificar en MS Docs
  }
}
```

### Notas de diseño: 2. Azure AI Search

- Compatibilidad con PE: SKU Basic o superior (verifica las restricciones más recientes en MS Docs)
- Semantic Ranker: se activa mediante la propiedad `semanticSearch` (`disabled` | `free` | `standard`); verifica la compatibilidad de cada SKU en MS Docs
- Búsqueda vectorial: admitida en SKU de pago (verifica en MS Docs)
- Se usa habitualmente junto con Foundry en configuraciones RAG

---

## 3. ADLS Gen2 (cuenta de almacenamiento)

### Estructura central de Bicep: 3. ADLS Gen2 (cuenta de almacenamiento)

```bicep
resource storage 'Microsoft.Storage/storageAccounts@<fetch>' = {
  name: storageName        // Solo minúsculas y números, sin guiones
  location: location
  kind: 'StorageV2'
  sku: { name: 'Standard_LRS' }
  properties: {
    isHnsEnabled: true                 // ← Nunca omitir
    accessTier: 'Hot'
    allowBlobPublicAccess: false
    minimumTlsVersion: 'TLS1_2'
    publicNetworkAccess: 'Disabled'
    networkAcls: { defaultAction: 'Deny' }
  }
}

// Contenedor
resource container 'Microsoft.Storage/storageAccounts/blobServices/containers@<fetch>' = {
  name: '${storage.name}/default/raw'
}
```

### Notas de diseño: 3. ADLS Gen2 (cuenta de almacenamiento)

- `isHnsEnabled` no puede cambiarse después de la creación → Si se omite, hay que volver a crear el recurso
- PE: pueden necesitarse los PE de `blob` y `dfs` según el caso de uso
- Contenedores habituales: `raw`, `processed`, `curated`

---

## 4. Microsoft Fabric

### Estructura central de Bicep: 4. Microsoft Fabric

```bicep
resource fabric 'Microsoft.Fabric/capacities@<fetch>' = {
  name: fabricName
  location: location
  sku: { name: '<confirm with user>', tier: 'Fabric' }
  properties: {
    administration: {
      members: [ '<admin-email>' ]    // ← Obligatorio; sin él, falla el despliegue
    }
  }
}
```

### Notas de diseño: 4. Microsoft Fabric

- Solo la capacidad puede aprovisionarse mediante Bicep
- El área de trabajo, Lakehouse, Warehouse, etc. deben crearse manualmente en el portal
- Confirma el correo del administrador con la persona (`ask_user`)

### Elementos de confirmación obligatoria al añadir en la fase 1

Cuando se añada Fabric durante la conversación, deben confirmarse los siguientes elementos mediante ask_user antes de actualizar el diagrama:

- [ ] **SKU/Capacidad**: F2, F4, F8, ...; ofrece opciones después de consultar las SKU disponibles en MS Docs
- [ ] **administration.members**: correo del administrador; sin él, falla el despliegue

> No incluyas arbitrariamente cargas de trabajo secundarias (OneLake, canalizaciones de datos, Warehouse, etc.) que la persona no haya especificado. Solo la capacidad puede aprovisionarse mediante Bicep.

---

## 5. Azure Data Factory

### Estructura central de Bicep: 5. Azure Data Factory

```bicep
resource adf 'Microsoft.DataFactory/factories@<fetch>' = {
  name: adfName
  location: location
  identity: { type: 'SystemAssigned' }
  properties: {
    publicNetworkAccess: 'Disabled'
  }
}
```

### Notas de diseño: 5. Azure Data Factory

- El runtime de integración autohospedado requiere configuración manual fuera de Bicep
- Se usa principalmente en escenarios de ingesta de datos locales
- groupId del PE: `dataFactory`

---

## 6. AML / AI Hub (MachineLearningServices)

### Cuándo usar

```
Regla de decisión:
├─ IA/RAG general → Usar Foundry (AIServices)
└─ Se requiere entrenamiento de ML o modelos de código abierto → Considerar AI Hub
    └─ Solo cuando la persona lo solicite explícitamente
```

### Estructura central de Bicep: 6. AML / AI Hub (MachineLearningServices)

```bicep
resource hub 'Microsoft.MachineLearningServices/workspaces@<fetch>' = {
  name: hubName
  location: location
  kind: 'Hub'
  sku: { name: '<confirm with user>', tier: '<confirm with user>' }  // Por ejemplo, Basic/Basic; verificar las SKU disponibles en MS Docs
  identity: { type: 'SystemAssigned' }
  properties: {
    friendlyName: hubName
    storageAccount: storage.id
    keyVault: keyVault.id
    applicationInsights: appInsights.id    // Obligatorio para Hub
    publicNetworkAccess: 'Disabled'
  }
}
```

### Dependencias de AI Hub

Recursos adicionales necesarios al usar Hub:

- Cuenta de almacenamiento
- Key Vault
- Application Insights + área de trabajo de Log Analytics
- Container Registry (opcional)

---

## 7. Combinaciones habituales de arquitectura de IA y datos

### Chatbot RAG

```
Foundry (AIServices) + Proyecto
├── <chat-model> (chat)              — Confirmado tras verificar la disponibilidad en la fase 1
├── <embedding-model> (embeddings)   — Confirmado tras verificar la disponibilidad en la fase 1
├── AI Search (vectorial + semántica)
├── ADLS Gen2 (almacén de documentos)
└── Key Vault (secretos)
+ Configuración completa de VNet/PE
```

### Plataforma de datos

```
Fabric Capacity (análisis)
├── ADLS Gen2 (lago de datos)
├── ADF (ingesta)
└── Key Vault (secretos)
+ Configuración de VNet/PE
```
