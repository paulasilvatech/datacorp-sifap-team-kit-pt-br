---
name: "azure-devops-cli"
description: "Úsala para gestionar recursos de Azure DevOps desde la CLI: proyectos, repositorios, canalizaciones, compilaciones, solicitudes de incorporación de cambios, elementos de trabajo, artefactos y puntos de conexión de servicio. Se aplica solo cuando un equipo se integra con una organización de Azure DevOps existente. Los desencadenantes incluyen \"az devops\", \"az pipelines\", \"az boards\", \"az repos\" y \"automatización de Azure DevOps\"."
---
# CLI de Azure DevOps

Gestiona recursos de Azure DevOps con Azure CLI y la extensión `azure-devops`.

> [!NOTE]
> La fuente de verdad de este kit para el trabajo, el código y la CI es **GitHub** (Issues, Pull Requests, Actions, Projects). Usa esta skill solo cuando un equipo también deba operar una organización de Azure DevOps existente. No migres el flujo de trabajo del kit a Azure DevOps.

## Cuándo invocar

- "Crea una solicitud de incorporación de cambios en nuestro repositorio de Azure DevOps desde la CLI."
- "Pon en cola una ejecución de canalización y supervisa su estado sin abrir el portal."
- "Actualiza elementos de trabajo en bloque desde un script."
- "Enumera las políticas de ramas de nuestro repositorio de Azure DevOps."

## Prerrequisitos

Instala Azure CLI y la extensión de Azure DevOps:

```bash
brew install azure-cli                                     # macOS
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash     # Linux
az extension add --name azure-devops
```

## Autenticación

Autentícate con un token de acceso personal (PAT) y después establece valores predeterminados para no repetir `--org`/`--project`:

```bash
export AZURE_DEVOPS_EXT_PAT="<your-pat>"
az devops login --organization https://dev.azure.com/{org}
az devops configure --defaults organization=https://dev.azure.com/{org} project={project}
az devops configure --list
```

> [!WARNING]
> Nunca incrustes un PAT en un script, commit o comando que vaya a registrarse. Pásalo mediante la variable de entorno `AZURE_DEVOPS_EXT_PAT` (o un almacén de secretos) y limítalo a los permisos mínimos necesarios.

> [!NOTE]
> La URL heredada `https://{org}.visualstudio.com` debe sustituirse por `https://dev.azure.com/{org}`.

## Estructura de la CLI

```text
az devops          Comandos principales de DevOps
├── admin          Administración (avisos)
├── extension      Gestión de extensiones
├── project        Proyectos de equipo
├── security       Operaciones de seguridad (group, permission)
├── service-endpoint   Conexiones de servicio
├── team           Equipos
├── user           Usuarios
├── wiki           Wikis
├── configure      Establecer valores predeterminados
├── invoke         Invocar la API REST
├── login / logout Autenticarse / limpiar credenciales

az pipelines       Azure Pipelines
├── agent / pool / queue   Agentes, grupos, colas
├── build          Compilaciones
├── folder         Carpetas de canalizaciones
├── release        Versiones
├── runs           Ejecuciones de canalizaciones
└── variable / variable-group   Variables y grupos

az boards          Azure Boards
├── area           Rutas de área
├── iteration      Iteraciones
└── work-item      Elementos de trabajo

az repos           Azure Repos
├── import         Importaciones de Git
├── policy         Políticas de ramas
├── pr             Solicitudes de incorporación de cambios
└── ref            Referencias de Git

az artifacts       Azure Artifacts
└── universal      Paquetes universales
```

## Archivos de referencia

Lee el archivo de referencia pertinente para la tarea. Cada uno contiene la sintaxis completa de los comandos y ejemplos de su dominio.

| Archivo | Cuándo leerlo | Contenido |
|---|---|---|
| [references/repos-and-prs.md](references/repos-and-prs.md) | Repositorios, ramas, solicitudes de incorporación de cambios y políticas de ramas | Repositorios, importación, PR (crear/enumerar/votar/revisores/políticas), referencias de Git y políticas de ramas |
| [references/pipelines-and-builds.md](references/pipelines-and-builds.md) | Canalizaciones, compilaciones, versiones y artefactos | CRUD de canalizaciones, ejecuciones, compilaciones, versiones y descarga/carga de artefactos |
| [references/boards-and-iterations.md](references/boards-and-iterations.md) | Elementos de trabajo, sprints y rutas de área | Elementos de trabajo (WIQL/crear/actualizar/relaciones), rutas de área, iteraciones e iteraciones de equipo |
| [references/variables-and-agents.md](references/variables-and-agents.md) | Variables de canalizaciones y grupos de agentes | Variables de canalizaciones, grupos de variables, carpetas de canalizaciones y grupos/colas de agentes |
| [references/org-and-security.md](references/org-and-security.md) | Proyectos, equipos, usuarios, permisos y wikis | Proyectos, extensiones, equipos, usuarios, grupos y permisos de seguridad, puntos de conexión de servicio, wikis y administración |
| [references/advanced-usage.md](references/advanced-usage.md) | Formato de salida y consultas JMESPath | Formatos de salida, consultas JMESPath, argumentos globales, parámetros habituales y alias de Git |
| [references/workflows-and-patterns.md](references/workflows-and-patterns.md) | Scripts de automatización, buenas prácticas y gestión de errores | Flujos de trabajo habituales, buenas prácticas, gestión de errores, patrones de scripting y ejemplos reales |
| [references/long-comments-on-windows.md](references/long-comments-on-windows.md) | Valores largos de `--discussion`, `--description` o `--content` que fallan en Windows | Límite de 8191 caracteres de `cmd.exe` sobre `az.cmd`, detección del shell y tres alternativas verificadas (`azps.ps1`, `--file-path` nativo, `az devops invoke --in-file`) |

## Plantilla de salida

Entrega una secuencia de comandos ejecutables y los identificadores que devuelve:

```bash
az repos pr create \
  --repository sifap \
  --source-branch feature/import-report \
  --target-branch main \
  --title "Add import report" \
  --description "Implements REQ-042" \
  --output table
az pipelines run --name sifap-ci --branch feature/import-report --output table
```

Resume el resultado:

```text
PR: !128 sifap feature/import-report -> main (active)
Canalización: ejecución #345 de sifap-ci en cola sobre feature/import-report
```

## Puerta de calidad

- [ ] `az devops configure --list` muestra la organización y el proyecto predeterminados previstos.
- [ ] El PAT se proporciona mediante `AZURE_DEVOPS_EXT_PAT` o un almacén de secretos, nunca incrustado ni registrado.
- [ ] Los comandos especifican `--output table`/`--output json` explícitamente para poder procesar los resultados.
- [ ] Los valores largos de `--description`/`--discussion` en Windows usan una de las alternativas documentadas.
- [ ] La acción se verificó (se devolvió el ID de PR, ejecución o elemento de trabajo), en lugar de dar por supuesto el éxito.
