# Imágenes y artefactos

## Índice

- [Importar imágenes (copia en el servidor)](#importar-imágenes-copia-en-el-servidor)
- [Repositorios y etiquetas](#repositorios-y-etiquetas)
- [Manifiestos](#manifiestos)
- [Quitar etiquetas frente a eliminar](#quitar-etiquetas-frente-a-eliminar)
- [Purgar imágenes antiguas (acr purge)](#purgar-imágenes-antiguas-acr-purge)
- [Bloquear imágenes](#bloquear-imágenes)
- [Política de retención y eliminación temporal](#política-de-retención-y-eliminación-temporal)
- [Caché de artefactos (caché de extracción)](#caché-de-artefactos-caché-de-extracción)
- [Uso de almacenamiento](#uso-de-almacenamiento)

---

## Importar imágenes (copia en el servidor)

Se prefiere a `docker pull` + `docker push`: no utiliza almacenamiento local y mantiene intactos los manifiestos de varias arquitecturas:

```bash
# Desde un registro público
az acr import --name {registry} --source mcr.microsoft.com/hello-world:latest
az acr import --name {registry} --source docker.io/library/nginx:1.27 --image nginx:1.27

# Desde otro ACR del mismo inquilino (por ID de recurso, sin necesidad de credenciales)
az acr import --name {registry} \
  --source app:v1 \
  --registry /subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.ContainerRegistry/registries/{src-registry}

# Desde un registro privado con credenciales
az acr import --name {registry} --source private.example.com/app:v1 \
  --username {user} --password {password}

# Sobrescribir una etiqueta existente
az acr import --name {registry} --source docker.io/library/nginx:1.27 --image nginx:1.27 --force
```

## Repositorios y etiquetas

```bash
az acr repository list --name {registry} --output table

# Etiquetas, de más reciente a más antigua, con digest y marcas de tiempo
az acr repository show-tags --name {registry} --repository app \
  --orderby time_desc --detail --output table

az acr repository show --name {registry} --image app:v1        # atributos de la etiqueta
az acr repository show --name {registry} --repository app      # atributos del repositorio
```

## Manifiestos

```bash
# Metadatos de todos los manifiestos de un repositorio (digest, etiquetas, tamaño, marcas de tiempo)
az acr manifest list-metadata --registry {registry} --name app --output table

# Metadatos o contenido sin procesar de un manifiesto
az acr manifest show-metadata --registry {registry} --name app:v1
az acr manifest show --registry {registry} --name app@sha256:{digest}

# Buscar manifiestos sin etiquetas (huérfanos)
az acr manifest list-metadata --registry {registry} --name app \
  --query "[?tags==null].digest" --output tsv
```

## Quitar etiquetas frente a eliminar

```bash
# Quitar etiqueta: elimina solo la etiqueta; conserva el manifiesto y las capas (aún se pueden extraer por digest)
az acr repository untag --name {registry} --image app:v1

# Eliminar por etiqueta: elimina todo el manifiesto y TODAS las demás etiquetas que apuntan a él
az acr repository delete --name {registry} --image app:v1 --yes

# Eliminar por digest (preciso)
az acr repository delete --name {registry} --image app@sha256:{digest} --yes

# Eliminar un repositorio completo
az acr repository delete --name {registry} --repository app --yes
```

⚠️ Eliminar por etiqueta borra el manifiesto subyacente; las demás etiquetas de la misma imagen también desaparecen. Usa primero la operación de quitar etiqueta si solo quieres retirar su nombre.

## Purgar imágenes antiguas (acr purge)

`acr purge` se ejecuta como una ACR Task (contenedor `mcr.microsoft.com/acr/acr-cli`):

```bash
# Primero una simulación: SIEMPRE
az acr run --registry {registry} \
  --cmd "acr purge --filter 'app:.*' --ago 30d --untagged --dry-run" /dev/null

# Eliminar etiquetas de más de 30 días que coincidan con la expresión regular y manifiestos sin etiquetas
az acr run --registry {registry} \
  --cmd "acr purge --filter 'app:.*' --ago 30d --untagged" /dev/null

# Conservar las 5 etiquetas más recientes, independientemente de su antigüedad
az acr run --registry {registry} \
  --cmd "acr purge --filter 'app:.*' --ago 0d --keep 5 --untagged" /dev/null

# Programar como tarea nocturna
az acr task create --registry {registry} --name purge-old-images \
  --cmd "acr purge --filter 'app:.*' --ago 30d --untagged" \
  --context /dev/null --schedule "0 3 * * *"
```

`--filter` recibe `repository:tag-regex` y puede repetirse para varios repositorios.

⚠️ `--untagged` ignora `--ago`: elimina **todos** los manifiestos sin etiquetas, incluidos los creados hace unos instantes (imágenes cuyo envío está en curso y artefactos de referencia). Omite `--untagged` si deben conservarse los manifiestos recientes sin etiquetas; el límite de antigüedad solo se aplica a las imágenes etiquetadas que coincidan con `--filter`.

## Bloquear imágenes

Evita que se sobrescriban o eliminen etiquetas críticas (por ejemplo, versiones publicadas):

```bash
# Solo lectura: no se puede sobrescribir ni eliminar
az acr repository update --name {registry} --image app:v1 --write-enabled false

# No se puede eliminar, pero sí sobrescribir
az acr repository update --name {registry} --image app:v1 --delete-enabled false

# Desbloquear
az acr repository update --name {registry} --image app:v1 --write-enabled true --delete-enabled true
```

## Política de retención y eliminación temporal

Dos políticas distintas que **no pueden habilitarse a la vez**. La política de retención requiere **Premium**; la eliminación temporal (versión preliminar) está disponible en **todos los niveles**, pero no admite registros con replicación geográfica o caché de artefactos habilitada.

```bash
# Política de retención (Premium): eliminar automáticamente manifiestos sin etiquetas después de N días (0 = inmediatamente)
az acr config retention update --registry {registry} \
  --status enabled --days 7 --type UntaggedManifests
az acr config retention show --registry {registry}

# Eliminación temporal (versión preliminar, todos los niveles): recuperar artefactos eliminados en un plazo de 1-90 días
az acr config soft-delete update --registry {registry} --status enabled --days 7
az acr repository list-deleted --name {registry}
az acr manifest restore --registry {registry} --name app:v1
```

## Caché de artefactos (caché de extracción)

Almacena en caché, dentro de tu registro, las imágenes de origen (Docker Hub, MCR, GHCR, quay.io, ECR Public); evita límites de solicitudes y centraliza la procedencia:

```bash
# Opcional: credenciales para el origen autenticado (los secretos se almacenan en Key Vault)
az acr credential-set create --registry {registry} --name dockerhub-creds \
  --login-server docker.io \
  --username-id https://{vault}.vault.azure.net/secrets/dh-user \
  --password-id https://{vault}.vault.azure.net/secrets/dh-pass

# Regla de caché: docker.io/library/* -> {registry}.azurecr.io/dockerhub/*
az acr cache create --registry {registry} --name dockerhub-cache \
  --source-repo "docker.io/library/*" --target-repo "dockerhub/*" \
  --cred-set dockerhub-creds

az acr cache list --registry {registry} --output table
```

Después, `docker pull {registry}.azurecr.io/dockerhub/nginx:1.27` obtiene la imagen a través de la caché.

## Uso de almacenamiento

```bash
# Almacenamiento consumido frente a cuota de la SKU (incluye Basic 10 GB / Standard 100 GB / Premium 500 GB)
az acr show-usage --name {registry} --output table
```

Las capas se deduplican y comparten entre repositorios; `show-usage` informa del almacenamiento facturable real.
