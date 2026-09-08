---
name: "azure-deployment-preflight"
description: "Úsala antes de desplegar Bicep/ARM en Azure para validar la sintaxis de las plantillas, ejecutar análisis what-if y comprobar permisos. Actívala cuando se mencione desplegar en Azure, validar archivos Bicep, comprobar permisos de despliegue, previsualizar cambios de infraestructura, ejecutar what-if o preparar azd provision. Los desencadenantes incluyen \"comprobaciones previas\", \"what-if\", \"validar despliegue\", \"azd provision --preview\" y \"permisos de despliegue\"."
---
# Validación previa al despliegue en Azure

Esta skill valida despliegues Bicep antes de ejecutarlos y admite flujos tanto de Azure CLI (`az`) como de Azure Developer CLI (`azd`).

> **Alcance del kit:** La IaC de este kit es **Terraform (proveedor de Azure `~> 3.x`)**. Bicep/ARM quedan **fuera del alcance** de los entregables; usa esta validación previa solo cuando un proyecto utilice realmente Bicep/ARM. Para Terraform, usa `terraform validate` / `terraform plan` y la skill `terraform-azurerm-set-diff-analyzer`.

## Cuándo invocar

- "Valida mi despliegue Bicep antes de ejecutarlo."
- "Muestra una vista previa de los cambios que hará `azd provision`."
- "Comprueba si tengo permisos para desplegar esta plantilla."
- "Ejecuta what-if sobre mi infraestructura antes de desplegar."

Momentos habituales: antes de desplegar infraestructura en Azure, al preparar o revisar archivos Bicep, para previsualizar cambios de un despliegue, verificar que los permisos sean suficientes o antes de ejecutar `azd up`, `azd provision` o `az deployment`.

## Proceso de validación

Sigue estos pasos en orden. Continúa con el siguiente aunque falle uno anterior; recopila todos los problemas en el informe final.

### Paso 1: Detectar el tipo de proyecto

Determina el flujo de despliegue comprobando los indicadores del proyecto:

1. **Comprobar si es un proyecto azd**: busca `azure.yaml` en la raíz
   - Si se encuentra → Usar el **flujo de azd**
   - Si no se encuentra → Usar el **flujo de az CLI**

2. **Localizar archivos Bicep**: encuentra todos los archivos `.bicep` que se validarán
   - Para proyectos azd: revisa primero `infra/` y después la raíz del proyecto
   - Para Bicep independiente: usa el archivo indicado por la persona o busca en ubicaciones habituales (`infra/`, `deploy/`, raíz del proyecto)

3. **Detectar automáticamente archivos de parámetros**: para cada archivo Bicep, busca archivos de parámetros correspondientes:
   - `<filename>.bicepparam` (parámetros Bicep, opción preferida)
   - `<filename>.parameters.json` (parámetros JSON)
   - `parameters.json` o `parameters/<env>.json` en el mismo directorio

### Paso 2: Validar la sintaxis de Bicep

Ejecuta la CLI de Bicep para comprobar la sintaxis de la plantilla antes de intentar validar el despliegue:

```bash
bicep build <bicep-file> --stdout
```

**Qué recopilar:**

- Errores de sintaxis con números de línea y columna
- Mensajes de advertencia
- Estado correcto o fallido de la compilación

**Si la CLI de Bicep no está instalada:**

- Anota el problema en el informe
- Continúa con el paso 3 (Azure validará la sintaxis durante what-if)

### Paso 3: Ejecutar la validación previa

Elige la validación adecuada según el tipo de proyecto detectado en el paso 1.

#### Para proyectos azd (existe azure.yaml)

Usa `azd provision --preview` para validar el despliegue:

```bash
azd provision --preview
```

Si se especifica un entorno o existen varios:

```bash
azd provision --preview --environment <env-name>
```

#### Para Bicep independiente (sin azure.yaml)

Determina el ámbito de despliegue a partir de la declaración `targetScope` del archivo Bicep:

| Ámbito de destino | Comando |
|--------------|---------|
| `resourceGroup` (predeterminado) | `az deployment group what-if` |
| `subscription` | `az deployment sub what-if` |
| `managementGroup` | `az deployment mg what-if` |
| `tenant` | `az deployment tenant what-if` |

**Ejecuta primero con el nivel de validación Provider.**

Ámbito de grupo de recursos (el más habitual):

```bash
az deployment group what-if \
  --resource-group <rg-name> \
  --template-file <bicep-file> \
  --parameters <param-file> \
  --validation-level Provider
```

Ámbito de suscripción:

```bash
az deployment sub what-if \
  --location <location> \
  --template-file <bicep-file> \
  --parameters <param-file> \
  --validation-level Provider
```

Ámbito de grupo de administración:

```bash
az deployment mg what-if \
  --location <location> \
  --management-group-id <mg-id> \
  --template-file <bicep-file> \
  --parameters <param-file> \
  --validation-level Provider
```

Ámbito de inquilino:

```bash
az deployment tenant what-if \
  --location <location> \
  --template-file <bicep-file> \
  --parameters <param-file> \
  --validation-level Provider
```

**Estrategia de alternativa:**

Si `--validation-level Provider` falla por errores de permisos (RBAC), reintenta con `ProviderNoRbac`:

```bash
az deployment group what-if \
  --resource-group <rg-name> \
  --template-file <bicep-file> \
  --validation-level ProviderNoRbac
```

Anota la alternativa utilizada en el informe; la persona podría no disponer de permisos completos de despliegue.

### Paso 4: Recopilar resultados What-If

Analiza la salida de what-if para clasificar los cambios de recursos:

| Tipo de cambio | Símbolo | Significado |
|-------------|--------|---------|
| Create | `+` | Se creará un recurso nuevo |
| Delete | `-` | Se eliminará el recurso |
| Modify | `~` | Cambiarán propiedades del recurso |
| NoChange | `=` | Recurso sin cambios |
| Ignore | `*` | Recurso no analizado (límites alcanzados) |
| Deploy | `!` | Se desplegará el recurso (cambios desconocidos) |

Para los recursos modificados, recopila los cambios concretos de propiedades.

### Paso 5: Generar el informe

Crea un informe Markdown en la **raíz del proyecto** con el nombre:

- `preflight-report.md`

Usa la estructura de plantilla de [references/REPORT-TEMPLATE.md](references/REPORT-TEMPLATE.md).

**Secciones del informe:**

1. **Resumen**: estado general, marca de tiempo, archivos validados y ámbito de destino
2. **Herramientas ejecutadas**: comandos ejecutados, versiones y niveles de validación utilizados
3. **Problemas**: todos los errores y advertencias con gravedad y medidas de corrección
4. **Resultados What-If**: recursos que se crearán, modificarán, eliminarán o permanecerán sin cambios
5. **Recomendaciones**: pasos siguientes concretos

## Información obligatoria

Antes de ejecutar la validación, recopila:

| Información | Necesaria para | Cómo obtenerla |
|-------------|--------------|---------------|
| Grupo de recursos | `az deployment group` | Preguntar a la persona o revisar la configuración existente de `.azure/` |
| Suscripción | Todos los despliegues | `az account show` o preguntar a la persona |
| Ubicación | Ámbitos de suscripción, grupo de administración o inquilino | Preguntar a la persona o usar el valor predeterminado de la configuración |
| Entorno | Proyectos azd | `azd env list` o preguntar a la persona |

Si falta información obligatoria, solicítala antes de continuar.

## Gestión de errores

Consulta las orientaciones detalladas de gestión de errores en [references/ERROR-HANDLING.md](references/ERROR-HANDLING.md).

**Principio clave:** Continúa la validación aunque se produzcan errores. Recopila todos los problemas en el informe final.

| Tipo de error | Acción |
|------------|--------|
| Sesión no iniciada | Anotar en el informe y sugerir `az login` o `azd auth login` |
| Permiso denegado | Recurrir a `ProviderNoRbac` y anotarlo en el informe |
| Error de sintaxis de Bicep | Incluir todos los errores y continuar con otros archivos |
| Herramienta no instalada | Anotar en el informe y omitir ese paso de validación |
| Grupo de recursos no encontrado | Anotar en el informe y sugerir crearlo |

## Herramientas necesarias

Esta skill usa las siguientes herramientas:

- **Azure CLI** (`az`): se recomienda la versión 2.76.0+ para `--validation-level`
- **Azure Developer CLI** (`azd`): para proyectos con `azure.yaml`
- **CLI de Bicep** (`bicep`): para validar la sintaxis
- **Herramientas Azure MCP**: para consultar documentación y buenas prácticas

Comprueba la disponibilidad de las herramientas antes de empezar:

```bash
az --version
azd version
bicep --version
```

## Flujo de ejemplo

1. Persona: "Valida mi despliegue Bicep antes de ejecutarlo"
2. El agente detecta `azure.yaml` → Proyecto azd
3. El agente encuentra `infra/main.bicep` e `infra/main.bicepparam`
4. El agente ejecuta `bicep build infra/main.bicep --stdout`
5. El agente ejecuta `azd provision --preview`
6. El agente genera `preflight-report.md` en la raíz del proyecto
7. El agente resume los hallazgos para la persona

## Plantilla de salida

La skill escribe `preflight-report.md` en la raíz del proyecto siguiendo [references/REPORT-TEMPLATE.md](references/REPORT-TEMPLATE.md). Bajo su título principal `Informe de comprobaciones previas al despliegue`, contiene:

```markdown
## Resumen

- Estado: PASS con advertencias
- Marca de tiempo: 2026-08-17T14:00:00Z
- Archivos validados: infra/main.bicep
- Ámbito de destino: resourceGroup (rg-sifap)

## Herramientas ejecutadas

| Herramienta | Versión | Resultado |
|---|---|---|
| bicep build | 0.30.3 | Correcto |
| az deployment group what-if | 2.76.0 (Provider) | Correcto |

## Problemas

| Gravedad | Ubicación | Hallazgo | Corrección |
|---|---|---|---|
| Advertencia | main.bicep:42 | Storage permite acceso público a blobs | Establecer allowBlobPublicAccess en false |

## Resultados what-if

| Cambio | Cantidad | Recursos |
|---|---|---|
| Crear (+) | 3 | storageAccount, appService, keyVault |
| Modificar (~) | 1 | appServicePlan (B1 -> S1) |
| Eliminar (-) | 0 | Ninguno |

## Recomendaciones

- Resuelve la advertencia de acceso público antes de desplegar.
- Vuelve a ejecutar con `--validation-level Provider` cuando se concedan los permisos RBAC.
```

## Puerta de calidad

- [ ] Se detectó el tipo de proyecto (azd o independiente) y se localizaron todos los archivos `.bicep`.
- [ ] Se validó la sintaxis de Bicep con `bicep build` o se anotó en el informe la herramienta que falta.
- [ ] What-if se ejecutó en el ámbito correcto; ante un fallo RBAC se recurrió a `ProviderNoRbac` y se dejó constancia.
- [ ] Se clasificó cada cambio de creación, modificación y eliminación, detallando las propiedades modificadas.
- [ ] Se escribió `preflight-report.md` en la raíz del proyecto con las cinco secciones completas.
- [ ] La validación continuó por todos los pasos y recopiló todos los problemas, en lugar de detenerse en el primer error.

## Documentación de referencia

- [Referencia de comandos de validación](references/VALIDATION-COMMANDS.md)
- [Plantilla del informe](references/REPORT-TEMPLATE.md)
- [Guía de gestión de errores](references/ERROR-HANDLING.md)
