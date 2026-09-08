---
name: "azure-container-registry-cli"
description: "Úsala para trabajar con Azure Container Registry, ejecutar comandos az acr o enviar, importar, compilar o purgar imágenes de contenedor en Azure. Abarca registros, compilaciones en la nube, ACR Tasks, autenticación, tokens, replicación geográfica y redes. Los desencadenantes incluyen \"az acr\", \"enviar imagen a ACR\", \"compilar imagen en Azure\", \"autenticación de ACR\" y \"registro de contenedores\"."
---
# CLI de Azure Container Registry

Gestiona recursos de Azure Container Registry (ACR) con el grupo de comandos `az acr` de Azure CLI. `az acr` forma parte del núcleo de Azure CLI y no requiere ninguna extensión (la extensión `acrtransfer` solo es necesaria para canalizaciones de exportación e importación).

> [!NOTE]
> Esta skill requiere que la **CLI `az`** esté instalada y autenticada. En este kit, aprovisiona el propio registro con Terraform (`azurerm_container_registry`, con las etiquetas obligatorias `project`, `environment` y `owner`) bajo `infra/`. Usa `az acr` para tareas operativas, como compilar, importar, etiquetar y diagnosticar imágenes, no como fuente de verdad de la infraestructura.

## Cuándo invocar

- "Envía nuestra imagen de Spring Boot a Azure Container Registry."
- "Compila una imagen de contenedor en Azure sin un demonio local de Docker."
- "¿Cómo permito que AKS extraiga imágenes de este registro sin usar el usuario administrador?"
- "Limpia las etiquetas antiguas para reducir el costo de almacenamiento de ACR."

## Prerrequisitos

Instala Azure CLI, inicia sesión y selecciona una suscripción:

```bash
brew install azure-cli                                     # macOS
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash     # Linux
winget install Microsoft.AzureCLI                          # Windows
az login
az account set --subscription {subscription-id}
```

## Inicio rápido

```bash
az acr create --resource-group {rg} --name {registry} --sku Standard          # SKU: Basic | Standard | Premium
az acr login --name {registry}                                                # autenticar Docker/Podman
az acr build --registry {registry} --image app:v1 .                           # compilación en la nube, sin Docker local
az acr import --name {registry} --source mcr.microsoft.com/hello-world:latest  # copia en el servidor
az acr repository list --name {registry} --output table
az acr repository show-tags --name {registry} --repository app --orderby time_desc
az acr check-health --name {registry} --yes                                   # diagnosticar la conectividad
```

## Principios clave

- **Prefiere `az acr build` / ACR Tasks** a `docker build` + `docker push` locales: las compilaciones se ejecutan en Azure, funcionan sin un demonio local y se integran con desencadenantes.
- **Prefiere `az acr import`** para mover imágenes entre registros: se ejecuta en el servidor, es más rápido y no necesita almacenamiento local.
- **Nunca habilites el usuario administrador en producción.** Usa identidades de Microsoft Entra (roles RBAC `AcrPull`/`AcrPush`, o `Container Registry Repository Reader`/`Writer` en registros con ABAC habilitado), tokens con ámbito de repositorio o identidades administradas.
- **Funcionalidades exclusivas de Premium**: replicación geográfica, puntos de conexión privados, políticas de retención, registros conectados y grupos de agentes. Los tokens con ámbito de repositorio funcionan en todos los niveles; la redundancia de zona es automática en las regiones compatibles.

## Estructura de la CLI

```text
az acr
├── create / delete / list / show / update   Ciclo de vida del registro
├── login                  Asistente de credenciales de Docker (o --expose-token)
├── check-health / check-name / show-usage    Diagnóstico y cuota
├── build                  Compilación de imágenes en la nube (tarea rápida)
├── run                    Ejecutar una vez un comando o una tarea de varios pasos
├── task                   ACR Tasks (desencadenantes, temporizadores, registros, ejecuciones)
├── agentpool              Grupos de agentes dedicados a tareas (Premium)
├── import                 Copia de imágenes al registro desde el servidor
├── repository             Listar/mostrar/eliminar repositorios y etiquetas, quitar etiquetas y bloquear imágenes
├── manifest               Metadatos de manifiestos, eliminación y artefactos de referencia OCI
├── credential             Credenciales del usuario administrador (evitar en producción)
├── token / scope-map      Tokens con ámbito de repositorio (Premium)
├── replication            Replicación geográfica (Premium)
├── network-rule           Reglas de red por IP
├── private-endpoint-connection   Aprobaciones de Private Link
├── config                 content-trust, retention, soft-delete, ...
├── cache / credential-set Reglas de caché de artefactos (caché de extracción)
├── webhook                Webhooks de eventos de envío/eliminación
├── connected-registry     Registros conectados locales o de IoT
└── export-pipeline / import-pipeline / pipeline-run   Extensión acrtransfer
```

## Archivos de referencia

Lee el archivo de referencia pertinente para la tarea. Cada uno contiene la sintaxis completa de los comandos y ejemplos de su dominio.

| Archivo | Cuándo leerlo | Contenido |
|---|---|---|
| [references/auth-and-security.md](references/auth-and-security.md) | Fallos de inicio de sesión, permisos, CI/CD o acceso de extracción para AKS | `az acr login` (incluido `--expose-token`), roles RBAC de Entra, entidades de servicio, identidades administradas, `--attach-acr` para AKS, tokens y mapas de ámbito de repositorio, usuario administrador y confianza del contenido |
| [references/build-and-tasks.md](references/build-and-tasks.md) | Compilación de imágenes en Azure, automatización y desencadenantes de CI | `az acr build`, `az acr run`, YAML de tareas de varios pasos, `az acr task` (desencadenantes de Git, imagen base y temporizador; registros y ejecuciones), grupos de agentes |
| [references/images-and-artifacts.md](references/images-and-artifacts.md) | Gestión de repositorios, etiquetas, limpieza y costo de almacenamiento | `az acr import`, comandos de repositorios y manifiestos, quitar etiquetas frente a eliminar, purga (`acr purge`), bloqueo de imágenes, política de retención, eliminación temporal, caché de artefactos y `show-usage` |
| [references/networking-and-geo.md](references/networking-and-geo.md) | Varias regiones, acceso privado y escenarios de perímetro | Replicación geográfica, redundancia de zona, puntos de conexión privados, reglas de red, puntos de conexión de datos dedicados, registros conectados y canalizaciones de transferencia entre registros |

## Plantilla de salida

Entrega un plan de comandos ejecutables que haga explícito el modelo de identidad:

```bash
az acr create --resource-group rg-sifap --name sifapregistry --sku Standard
az acr build --registry sifapregistry --image sifap-backend:$(git rev-parse --short HEAD) .
az acr repository show-tags --name sifapregistry --repository sifap-backend --output table
az role assignment create \
  --assignee <aks-kubelet-identity-object-id> \
  --role AcrPull \
  --scope $(az acr show --name sifapregistry --query id --output tsv)
```

Resume lo realizado y el estado de la seguridad:

```text
Registro: sifapregistry (Standard) en rg-sifap
Imagen: sifap-backend:<git-sha> compilada en Azure (sin Docker local)
Acceso: AcrPull concedido a la identidad administrada del kubelet de AKS; usuario administrador deshabilitado
```

## Puerta de calidad

- [ ] La SKU del registro se ajusta a la necesidad (Premium solo cuando se requieran replicación geográfica, puntos de conexión privados o tokens con ámbito limitado).
- [ ] Las imágenes se compilan con `az acr build` / ACR Tasks en lugar de `docker build` + `docker push` locales cuando sea viable.
- [ ] El usuario administrador está deshabilitado; el acceso usa una identidad de Entra (`AcrPull`/`AcrPush`), una identidad administrada o un token con ámbito de repositorio.
- [ ] `az acr check-health --name {registry}` no informa de errores.
- [ ] Los movimientos de imágenes entre registros usan `az acr import` (en el servidor), no extracción y envío locales.
- [ ] El recurso del registro está definido en Terraform bajo `infra/` con las etiquetas obligatorias `project`, `environment` y `owner`.
