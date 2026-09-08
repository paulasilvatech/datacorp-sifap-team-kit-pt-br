# Compilaciones y ACR Tasks

## Índice

- [Compilación rápida (az acr build)](#compilación-rápida-az-acr-build)
- [Ejecutar una vez un comando o una tarea de varios pasos (az acr run)](#ejecutar-una-vez-un-comando-o-una-tarea-de-varios-pasos-az-acr-run)
- [ACR Tasks (az acr task)](#acr-tasks-az-acr-task)
- [Desencadenantes](#desencadenantes)
- [YAML de tareas de varios pasos](#yaml-de-tareas-de-varios-pasos)
- [Grupos de agentes](#grupos-de-agentes)

---

## Compilación rápida (az acr build)

Compila en Azure y envía al registro, sin necesidad de un demonio local de Docker:

```bash
# Compilar desde el directorio actual y enviar
az acr build --registry {registry} --image app:v1 .

# Dockerfile personalizado, argumentos de compilación y plataforma de destino
az acr build --registry {registry} --image app:v1 \
  --file docker/Dockerfile.prod \
  --build-arg VERSION=1.2.3 \
  --platform linux/amd64 .

# Multiplataforma: cada compilación produce UNA imagen de una sola arquitectura para la plataforma de destino
az acr build --registry {registry} --image app:v1-arm64 --platform linux/arm64 .
# Para una imagen realmente multiarquitectura, compilar una vez por plataforma con etiquetas específicas de cada arquitectura y después
# ensamblar y enviar una lista de manifiestos (docker manifest create/push, o docker buildx localmente)

# Compilar directamente desde un repositorio Git (sin clon local)
az acr build --registry {registry} --image app:v1 https://github.com/{org}/{repo}.git#{branch}:{folder}

# Compilar sin enviar (solo validación)
az acr build --registry {registry} --image app:test --no-push .
```

Notas:

- El contexto de compilación se carga; usa `.dockerignore` para mantenerlo pequeño.
- Etiqueta con un valor único por compilación (SHA de Git, ID de ejecución); evita depender de `latest`.

## Ejecutar una vez un comando o una tarea de varios pasos (az acr run)

```bash
# Ejecutar un comando de contenedor en el ejecutor de tareas del registro (contexto /dev/null = sin carga)
az acr run --registry {registry} --cmd '{registry}.azurecr.io/app:v1' /dev/null

# Ejecutar un archivo de tarea de varios pasos sobre el directorio actual
az acr run --registry {registry} --file acb.yaml .
```

## ACR Tasks (az acr task)

Definiciones de compilación persistentes que admiten desencadenantes:

```bash
# Crear una tarea que compile con cada commit en main
az acr task create --registry {registry} --name build-app \
  --image "app:{{.Run.ID}}" \
  --context https://github.com/{org}/{repo}.git#main \
  --file Dockerfile \
  --git-access-token {pat} \
  --commit-trigger-enabled true \
  --base-image-trigger-enabled true

# Activar manualmente, enumerar e inspeccionar
az acr task run --registry {registry} --name build-app
az acr task list --registry {registry} --output table
az acr task list-runs --registry {registry} --name build-app --output table
az acr task logs --registry {registry} --name build-app        # ejecución más reciente
az acr task logs --registry {registry} --run-id {run-id}

# Actualizar / deshabilitar / eliminar
az acr task update --registry {registry} --name build-app --image "app:{{.Run.ID}}"
az acr task update --registry {registry} --name build-app --status Disabled
az acr task delete --registry {registry} --name build-app --yes
```

Variables de ejecución útiles para `--image`: `{{.Run.ID}}`, `{{.Run.Commit}}`, `{{.Run.Branch}}`, `{{.Run.Date}}`.

⚠️ En **registros con ABAC habilitado** (`roleAssignmentMode` = `AbacRepositoryPermissions`), las tareas y compilaciones o ejecuciones rápidas no tienen acceso predeterminado al registro de origen. Pasa `--source-acr-auth-id [caller]` a `az acr build`/`az acr run`, y `--source-acr-auth-id [system]` (o el ID de recurso de una identidad asignada por el usuario) a `az acr task create`/`update`. Después, concede a esa identidad los roles `Container Registry Repository ...`. Asegúrate de que la tarea tenga realmente esa identidad: añade `--assign-identity [system]` al crearla o ejecuta `az acr task identity assign` en una tarea existente antes de referenciarla.

## Desencadenantes

```bash
# Desencadenante de temporizador (cron en UTC); por ejemplo, recompilación nocturna
az acr task timer add --registry {registry} --name build-app \
  --timer-name nightly --schedule "0 2 * * *"
az acr task timer list --registry {registry} --name build-app
az acr task timer remove --registry {registry} --name build-app --timer-name nightly
```

- **Desencadenante de commit**: recompilar al enviar cambios a la rama supervisada (`--commit-trigger-enabled`).
- **Desencadenante de imagen base**: recompilar automáticamente cuando se actualice la imagen base (por ejemplo, una imagen corregida de `mcr.microsoft.com`) (`--base-image-trigger-enabled`); es fundamental para aplicar parches al sistema operativo o framework.
- **Desencadenante de temporizador**: programaciones cron; también es la forma estándar de programar la limpieza con `acr purge` (consulta `images-and-artifacts.md`).

Las tareas que acceden a otros registros o recursos de Azure pueden usar una identidad:

```bash
az acr task identity assign --registry {registry} --name build-app   # asignada por el sistema
az acr task credential add --registry {registry} --name build-app \
  --login-server {other-registry}.azurecr.io --use-identity [system]
```

## YAML de tareas de varios pasos

`acb.yaml`: compilar, probar y enviar solo si todo se completa correctamente:

```yaml
version: v1.1.0
steps:
  - build: -t $Registry/app:{{.Run.ID}} -f Dockerfile .
  - cmd: $Registry/app:{{.Run.ID}} run-tests
  - push:
      - $Registry/app:{{.Run.ID}}
```

```bash
# Ejecutar una vez
az acr run --registry {registry} --file acb.yaml .

# O crear una tarea con desencadenante a partir del YAML
az acr task create --registry {registry} --name build-test-push \
  --file acb.yaml \
  --context https://github.com/{org}/{repo}.git#main \
  --git-access-token {pat}
```

## Grupos de agentes

SKU Premium. Recursos de proceso dedicados a tareas para disponer de más CPU o para usar una de las dos formas admitidas de ejecutar tareas contra un registro con restricciones de red (la otra combina servicios de confianza y la política de omisión de restricciones de red para tareas; consulta `networking-and-geo.md`):

```bash
az acr agentpool create --registry {registry} --name pool1 --tier S2   # S1/S2/S3/I6

# Para escenarios de firewall/VNet, el grupo DEBE estar conectado a una subred que pueda
# acceder al punto de conexión privado del registro; sin --subnet-id se ejecuta fuera de la VNet
az acr agentpool create --registry {registry} --name pool1 --tier S2 \
  --subnet-id /subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/{subnet}

az acr agentpool list --registry {registry} --output table

# Usar el grupo como destino
az acr build --registry {registry} --agent-pool pool1 --image app:v1 .
az acr task create --registry {registry} --name build-app --agent-pool pool1 ...
```
