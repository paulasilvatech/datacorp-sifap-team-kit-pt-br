# Patrones comunes de Azure (estables)

Este archivo contiene únicamente **patrones prácticamente inmutables** que se repiten entre los servicios de Azure.
La información dinámica, como versiones de API, SKU y regiones, no se incluye aquí → Consulta `azure-dynamic-sources.md`.

---

## 1. Patrones de aislamiento de red

### Conjunto de 3 componentes de puntos de conexión privados

Todos los servicios que usan PE deben tener configurado el conjunto de 3 componentes:

1. **Punto de conexión privado**: ubicado en pe-subnet
2. **Zona DNS privada** + **enlace VNet** (`registrationEnabled: false`)
3. **Grupo de zonas DNS**: vinculado al PE

> Si falta cualquiera de ellos, la resolución DNS falla aunque el PE esté presente y provoca un fallo de conexión.

### Configuración obligatoria de la subred de PE

```bicep
resource peSubnet 'Microsoft.Network/virtualNetworks/subnets' = {
  properties: {
    addressPrefix: peSubnetPrefix              // ← CIDR como parámetro; evitar conflictos con redes existentes
    privateEndpointNetworkPolicies: 'Disabled'  // ← Obligatorio. Sin él, falla el despliegue del PE
  }
}
```

### Patrón publicNetworkAccess

Los servicios que usan PE deben incluir:

```bicep
properties: {
  publicNetworkAccess: 'Disabled'
  networkAcls: {
    defaultAction: 'Deny'
  }
}
```

---

## 2. Patrones de seguridad

### Key Vault

```bicep
properties: {
  enableRbacAuthorization: true    // No usar el método de directivas de acceso
  enableSoftDelete: true
  softDeleteRetentionInDays: 90
  enablePurgeProtection: true
}
```

### Identidad administrada

Cuando los servicios de IA acceden a otros recursos:

```bicep
identity: {
  type: 'SystemAssigned'  // o 'UserAssigned'
}
```

### Información sensible

- Usa el decorador `@secure()`
- No almacenes valores sin cifrar en archivos `.bicepparam`
- Usa referencias a Key Vault

---

## 3. Convenciones de nomenclatura (basadas en CAF)

```
rg-{project}-{env}          Grupo de recursos
vnet-{project}-{env}        Red virtual
st{project}{env}             Cuenta de almacenamiento (sin caracteres especiales, solo minúsculas y números)
kv-{project}-{env}           Key Vault
srch-{project}-{env}         AI Search
foundry-{project}-{env}      Cognitive Services (Foundry)
```

> Prevención de colisiones de nombres: se recomienda usar `uniqueString(resourceGroup().id)`
>
> ```bicep
> param storageName string = 'st${uniqueString(resourceGroup().id)}'
> ```

---

## 4. Estructura de módulos Bicep

```
<project>/
├── main.bicep              # Orquestación: llamadas a módulos y paso de parámetros
├── main.bicepparam         # Valores específicos del entorno (sin información sensible)
└── modules/
    ├── network.bicep           # VNet, subred
    ├── <service>.bicep         # Módulos por servicio
    ├── keyvault.bicep          # Key Vault
    └── private-endpoints.bicep # Todos los PE + zona DNS + enlace VNet
```

### Gestión de dependencias

```bicep
// ✅ Correcto: dependencia implícita mediante una referencia a recurso
resource project '...' = {
  properties: {
    parentId: foundry.id  // Referencia a foundry → foundry se despliega primero automáticamente
  }
}

// ❌ Evitar: dependsOn explícito (usar solo cuando sea necesario)
```

---

## 5. Plantilla Bicep común de PE

```bicep
// ── Punto de conexión privado ──
resource pe 'Microsoft.Network/privateEndpoints@<fetch>' = {
  name: 'pe-${serviceName}'
  location: location
  properties: {
    subnet: { id: peSubnetId }
    privateLinkServiceConnections: [{
      name: 'pls-${serviceName}'
      properties: {
        privateLinkServiceId: serviceId
        groupIds: ['<groupId>']  // ← Varía según el servicio. Consulta service-gotchas.md
      }
    }]
  }
}

// ── Zona DNS privada ──
resource dnsZone 'Microsoft.Network/privateDnsZones@<fetch>' = {
  name: '<dnsZoneName>'  // ← Varía según el servicio
  location: 'global'
}

// ── Enlace VNet ──
resource vnetLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@<fetch>' = {
  parent: dnsZone
  name: '${dnsZone.name}-link'
  location: 'global'
  properties: {
    virtualNetwork: { id: vnetId }
    registrationEnabled: false  // ← Debe ser false
  }
}

// ── Grupo de zonas DNS ──
resource dnsGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@<fetch>' = {
  parent: pe
  name: 'default'
  properties: {
    privateDnsZoneConfigs: [{
      name: 'config'
      properties: { privateDnsZoneId: dnsZone.id }
    }]
  }
}
```

> `@<fetch>`: verifica siempre en MS Docs la versión estable más reciente de la API antes del despliegue.
