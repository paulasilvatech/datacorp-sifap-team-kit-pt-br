# Redes y replicación geográfica

## Índice

- [Replicación geográfica](#replicación-geográfica)
- [Redundancia de zona](#redundancia-de-zona)
- [Puntos de conexión privados (Private Link)](#puntos-de-conexión-privados-private-link)
- [Reglas de red pública](#reglas-de-red-pública)
- [Puntos de conexión de datos dedicados](#puntos-de-conexión-de-datos-dedicados)
- [Registro conectado](#registro-conectado)
- [Canalizaciones de transferencia entre registros](#canalizaciones-de-transferencia-entre-registros)

La replicación geográfica, los puntos de conexión privados, las reglas de red por IP pública, los puntos de conexión de datos dedicados, los registros conectados y las canalizaciones de transferencia requieren la SKU **Premium**. La redundancia de zona es automática en todos los niveles.

---

## Replicación geográfica

Un registro, un servidor de inicio de sesión e imágenes servidas desde la región más cercana:

```bash
az acr replication create --registry {registry} --location westeurope
az acr replication list --registry {registry} --output table
az acr replication show --registry {registry} --name westeurope
az acr replication delete --registry {registry} --name westeurope

# Estado del punto de conexión regional (útil para depurar webhooks y replicación)
az acr replication update --registry {registry} --name westeurope --region-endpoint-enabled true
```

Los envíos se replican automáticamente; los clientes siguen extrayendo desde `{registry}.azurecr.io` y Traffic Manager los dirige a la réplica más cercana.

## Redundancia de zona

La redundancia de zona se **habilita automáticamente para todos los registros, en todos los niveles (Basic/Standard/Premium), en las regiones que admiten zonas de disponibilidad**. No requiere opciones, una SKU específica ni acciones, y no se puede deshabilitar. Las réplicas geográficas de regiones compatibles también tienen redundancia de zona de forma predeterminada.

No te bases en la propiedad `zoneRedundancy` ni en la opción heredada `--zone-redundancy`: la propiedad es un vestigio obsoleto que puede mostrar `Disabled` aunque el registro tenga redundancia de zona completa. Los registros de regiones sin zonas de disponibilidad son la única excepción; mígralos a una región compatible mediante `az acr import` o una canalización de transferencia.

## Puntos de conexión privados (Private Link)

```bash
# 1. Deshabilitar las políticas de red en la subred del punto de conexión si es necesario y después crearlo
az network private-endpoint create --resource-group {rg} --name {registry}-pe \
  --vnet-name {vnet} --subnet {subnet} \
  --private-connection-resource-id $(az acr show --name {registry} --query id --output tsv) \
  --group-ids registry \
  --connection-name {registry}-pe-conn

# 2. DNS privado para que {registry}.azurecr.io se resuelva a la IP privada
az network private-dns zone create --resource-group {rg} --name privatelink.azurecr.io
az network private-dns link vnet create --resource-group {rg} \
  --zone-name privatelink.azurecr.io --name {registry}-dns-link --virtual-network {vnet} --registration-enabled false
az network private-endpoint dns-zone-group create --resource-group {rg} \
  --endpoint-name {registry}-pe --name default \
  --private-dns-zone privatelink.azurecr.io --zone-name registry

# 3. Opcionalmente, deshabilitar por completo el acceso público
az acr update --name {registry} --public-network-enabled false

# Gestionar las aprobaciones de conexión
az acr private-endpoint-connection list --registry-name {registry} --output table
az acr private-endpoint-connection approve --registry-name {registry} --name {connection}
```

Notas:

- Cada punto de conexión privado crea registros DNS para el registro de contenedores **y** sus puntos de conexión de datos (`{registry}.{region}.data.azurecr.io`); los registros con replicación geográfica necesitan un registro DNS de datos por región.
- Con el acceso público deshabilitado, los agentes estándar de ACR Tasks no pueden acceder al registro; usa un grupo de agentes dedicado conectado a una subred de la VNet o habilita los servicios de confianza **y** la política de omisión de restricciones de red para tareas (consulta más abajo).

## Reglas de red pública

Restringe el acceso público a IP concretas en lugar de hacerlo totalmente privado, o antes de hacerlo:

```bash
# Denegar de forma predeterminada y después permitir rangos concretos
az acr update --name {registry} --default-action Deny
az acr network-rule add --name {registry} --ip-address 203.0.113.0/24
az acr network-rule list --name {registry}
az acr network-rule remove --name {registry} --ip-address 203.0.113.0/24

# Permitir que los servicios de Azure de confianza (Defender, ACI, importación de imágenes, etc.) atraviesen el firewall
az acr update --name {registry} --allow-trusted-services true
```

⚠️ **Desde el 1 de junio de 2025, `--allow-trusted-services` por sí solo NO basta para ACR Tasks que use una identidad administrada asignada por el sistema**. Sin la política de omisión de restricciones de red para tareas, sus ejecuciones reciben errores 403 en registros con restricciones de red. Habilítala explícitamente:

```bash
az resource update \
  --namespace Microsoft.ContainerRegistry --resource-type registries \
  --name {registry} --resource-group {rg} \
  --api-version 2025-06-01-preview \
  --set properties.networkRuleBypassAllowedForTasks=true
```

Alternativas que evitan por completo esa excepción: ejecutar las tareas en un grupo de agentes conectado a una VNet o ejecutar `acr purge` localmente con el [binario acr-cli](https://github.com/azure/acr-cli). Las tareas que usan una identidad asignada por el usuario no se ven afectadas.

## Puntos de conexión de datos dedicados

Proporciona a las descargas de capas FQDN estables y específicos del registro (`{registry}.{region}.data.azurecr.io`) en lugar de puntos de conexión de almacenamiento compartidos; esto simplifica las reglas de firewall del cliente:

```bash
az acr update --name {registry} --data-endpoint-enabled true
az acr show-endpoints --name {registry}
```

## Registro conectado

Réplica de un registro en la nube alojada en las instalaciones o en el perímetro de IoT:

```bash
# El registro principal debe tener un punto de conexión de datos dedicado
az acr update --name {registry} --data-endpoint-enabled true

az acr connected-registry create --registry {registry} --name {connected-name} \
  --repository "app" "hello-world" \
  --mode ReadOnly            # o ReadWrite

az acr connected-registry list --registry {registry} --output table
az acr connected-registry get-settings --registry {registry} --name {connected-name} \
  --parent-protocol https --generate-password 1
az acr connected-registry deactivate --registry {registry} --name {connected-name}
```

## Canalizaciones de transferencia entre registros

Mueve imágenes entre nubes o inquilinos desconectados mediante blobs de almacenamiento (extensión `acrtransfer`):

```bash
az extension add --name acrtransfer

# Exportar desde el registro de origen a un contenedor de almacenamiento (token SAS en Key Vault)
az acr export-pipeline create --resource-group {rg} --registry {src-registry} \
  --name export-pipe \
  --secret-uri https://{vault}.vault.azure.net/secrets/{sas-secret} \
  --storage-container-uri https://{account}.blob.core.windows.net/{container}

# Importar en el destino
az acr import-pipeline create --resource-group {rg} --registry {dst-registry} \
  --name import-pipe \
  --secret-uri https://{vault}.vault.azure.net/secrets/{sas-secret} \
  --storage-container-uri https://{account}.blob.core.windows.net/{container}

# Ejecutar una exportación
az acr pipeline-run create --resource-group {rg} --registry {src-registry} \
  --pipeline export-pipe --name run1 --pipeline-type export \
  --artifacts app:v1 app:v2 --storage-blob transfer-blob-1
```

Para copias sencillas dentro de la misma nube, prefiere `az acr import` (consulta `images-and-artifacts.md`).
