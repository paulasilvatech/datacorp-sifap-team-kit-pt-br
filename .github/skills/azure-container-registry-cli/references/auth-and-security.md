# Autenticación y seguridad

## Índice

- [Inicio de sesión individual](#inicio-de-sesión-individual)
- [Roles RBAC de Microsoft Entra](#roles-rbac-de-microsoft-entra)
- [Entidades de servicio](#entidades-de-servicio)
- [Identidades administradas](#identidades-administradas)
- [Integración con AKS](#integración-con-aks)
- [Tokens con ámbito de repositorio](#tokens-con-ámbito-de-repositorio)
- [Usuario administrador](#usuario-administrador)
- [Confianza del contenido (obsoleta)](#confianza-del-contenido-obsoleta)

---

## Inicio de sesión individual

```bash
# Inicio de sesión estándar: configura las credenciales de Docker/Podman con tu identidad de az login
az acr login --name {registry}

# Sin demonio de Docker: obtener un token de acceso de Entra y pasarlo por una tubería a docker login
LOGIN_SERVER=$(az acr show --name {registry} --query loginServer --output tsv)
az acr login --name {registry} --expose-token --query accessToken --output tsv | \
  docker login $LOGIN_SERVER --username 00000000-0000-0000-0000-000000000000 --password-stdin
```

Notas:

- Los tokens de `az acr login` son válidos durante 3 horas; vuelve a ejecutar el comando cuando caduquen.
- Obtén el servidor de inicio de sesión con `az acr show --name {registry} --query loginServer --output tsv` en lugar de fijarlo: suele ser `{registry}.azurecr.io`, pero las nubes soberanas usan otros sufijos y los registros con ámbito de etiqueta de nombre de dominio reciben un sufijo hash.

## Roles RBAC de Microsoft Entra

Los roles aplicables al plano de datos dependen del **modo de permisos de asignación de roles** del registro; compruébalo primero:

```bash
az acr show --name {registry} --query roleAssignmentMode --output tsv
# LegacyRegistryPermissions  -> usar AcrPull/AcrPush/AcrDelete
# AbacRepositoryPermissions  -> usar Container Registry Repository Reader/Writer/Contributor
```

**Modo heredado (permisos RBAC del registro):**

| Rol | Permisos |
|---|---|
| `AcrPull` | Extraer imágenes |
| `AcrPush` | Extraer y enviar imágenes |
| `AcrDelete` | Eliminar imágenes |
| `AcrImageSigner` | Firmar imágenes (confianza del contenido) |
| `Contributor`/`Owner` | Administración completa del plano de control y envío/extracción |

**Modo con ABAC habilitado (permisos RBAC del registro + ABAC del repositorio):** `AcrPull`/`AcrPush`/`AcrDelete` **no se aplican**, y `Owner`/`Contributor`/`Reader` solo conceden acceso al plano de control. Usa en su lugar:

| Rol | Permisos |
|---|---|
| `Container Registry Repository Reader` | Leer imágenes, etiquetas y metadatos (añade condiciones ABAC para limitar el ámbito a repositorios) |
| `Container Registry Repository Writer` | Leer y escribir/actualizar |
| `Container Registry Repository Contributor` | Leer, escribir y eliminar |
| `Container Registry Repository Catalog Lister` | Enumerar repositorios; asignar solo cuando la identidad deba enumerar el catálogo (por ejemplo, `az acr repository list`); no es necesario para extraer o enviar en repositorios conocidos |

```bash
# Obtener el ID de recurso del registro
ACR_ID=$(az acr show --name {registry} --query id --output tsv)

# Conceder acceso de extracción a un usuario, grupo, entidad de servicio o identidad administrada
az role assignment create --assignee {principal-id} --scope $ACR_ID --role AcrPull

# Enumerar quién tiene acceso
az role assignment list --scope $ACR_ID --output table
```

## Entidades de servicio

Para sistemas CI/CD que no pueden usar OIDC o identidades administradas:

```bash
# Crear una entidad de servicio (SP) limitada a extracción
ACR_ID=$(az acr show --name {registry} --query id --output tsv)
az ad sp create-for-rbac --name {sp-name} --scopes $ACR_ID --role AcrPull

# Iniciar sesión en Docker con la SP: pasar el secreto por stdin, nunca como argumento
# (printf con una variable entre comillas conserva exactamente los espacios y caracteres glob)
printf '%s' "$SP_PASSWORD" | docker login $LOGIN_SERVER --username {appId} --password-stdin
```

Prefiere credenciales federadas (OIDC) a contraseñas de entidades de servicio en GitHub Actions / Azure DevOps cuando sea posible.

## Identidades administradas

Para recursos de proceso de Azure (VM, App Service, Container Apps, Functions):

```bash
# Asignar una identidad administrada por el sistema y concederle permiso de extracción
az vm identity assign --name {vm} --resource-group {rg}
PRINCIPAL_ID=$(az vm show --name {vm} --resource-group {rg} --query identity.principalId --output tsv)
az role assignment create --assignee $PRINCIPAL_ID --scope $ACR_ID --role AcrPull
```

App Service / Container Apps extraen entonces con opciones como `--assign-identity` + `--acr-identity` de sus propias CLI, sin necesidad de contraseña del registro.

## Integración con AKS

```bash
# Vincular al crear el clúster
az aks create --name {cluster} --resource-group {rg} --attach-acr {registry}

# Vincular o desvincular un clúster existente (concede AcrPull a la identidad del kubelet)
az aks update --name {cluster} --resource-group {rg} --attach-acr {registry}
az aks update --name {cluster} --resource-group {rg} --detach-acr {registry}

# Validar que el clúster puede acceder al registro
az aks check-acr --name {cluster} --resource-group {rg} --acr {registry}.azurecr.io
```

`--attach-acr` requiere Owner o User Access Administrator en el registro. La vinculación entre suscripciones funciona pasando el ID de recurso completo de ACR.

⚠️ `--attach-acr` asigna `AcrPull`, que **no se aplica en registros con ABAC habilitado** (`roleAssignmentMode` = `AbacRepositoryPermissions`). En esos registros, asigna manualmente los roles ABAC a la identidad del kubelet:

```bash
ACR_ID=$(az acr show --name {registry} --query id --output tsv)
KUBELET_ID=$(az aks show --name {cluster} --resource-group {rg} \
  --query identityProfile.kubeletidentity.objectId --output tsv)
az role assignment create --assignee $KUBELET_ID --scope $ACR_ID \
  --role "Container Registry Repository Reader"
# "Container Registry Repository Catalog Lister" NO es necesario para extraer imágenes;
# añádelo solo si la identidad debe enumerar repositorios
```

## Tokens con ámbito de repositorio

Disponibles en todos los niveles de servicio. Credenciales granulares ajenas a Entra (por ejemplo, para socios externos o dispositivos IoT):

```bash
# 1. Crear un mapa de ámbito (acciones: content/read, content/write, content/delete, metadata/read, metadata/write)
az acr scope-map create --name {scope-map} --registry {registry} \
  --repository app content/read metadata/read \
  --description "Pull-only access to app"

# 2. Crear un token vinculado al mapa de ámbito
az acr token create --name {token} --registry {registry} --scope-map {scope-map}

# 3. Generar o rotar contraseñas (hasta 2, con caducidad opcional)
az acr token credential generate --name {token} --registry {registry} --password1 --expiration-in-days 30

# Iniciar sesión con el token: pasar la contraseña por stdin, nunca como argumento
printf '%s' "$TOKEN_PWD" | docker login $LOGIN_SERVER --username {token} --password-stdin

# Deshabilitar o eliminar
az acr token update --name {token} --registry {registry} --status disabled
az acr token delete --name {token} --registry {registry} --yes
```

## Usuario administrador

Cuenta única, con envío y extracción completos en todo el registro y sin auditoría por usuario; **mantener deshabilitada en producción**:

```bash
az acr update --name {registry} --admin-enabled false   # recomendado
az acr credential show --name {registry}                # ver usuario y contraseñas (si está habilitado)
az acr credential renew --name {registry} --password-name password2   # rotar
```

Usos legítimos: pruebas locales rápidas y servicios que solo admiten usuario y contraseña y no pueden usar tokens.

## Confianza del contenido (obsoleta)

Docker Content Trust (DCT) está en proceso de retirada: **desde el 31 de mayo de 2026 no puede habilitarse en registros nuevos** (ni en registros donde nunca se habilitó), y se eliminará por completo el 31 de marzo de 2028. No configures DCT; firma las imágenes con **Notation (Notary Project)** y guarda las firmas como artefactos OCI. Consulta "Transición de Docker Content Trust a Notary Project" en la documentación de ACR.

```bash
# Solo registros con DCT heredado: inspeccionar o deshabilitar la configuración existente
az acr config content-trust show --registry {registry}
az acr config content-trust update --registry {registry} --status disabled
```

Los firmantes de DCT heredado necesitaban `AcrImageSigner` además de `AcrPush`.
