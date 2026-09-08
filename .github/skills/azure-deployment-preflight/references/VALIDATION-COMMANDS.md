# Referencia de comandos de validación

Esta referencia documenta todos los comandos utilizados en la validación previa al despliegue en Azure.

## Azure Developer CLI (azd)

### azd provision --preview

Muestra una vista previa de los cambios de infraestructura de proyectos azd sin desplegar.

```bash
azd provision --preview [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--environment`, `-e` | Nombre del entorno que se utilizará |
| `--no-prompt` | Aceptar los valores predeterminados sin preguntar |
| `--debug` | Habilitar los registros de depuración |
| `--cwd` | Establecer el directorio de trabajo |

**Ejemplos:**

```bash
# Vista previa con el entorno predeterminado
azd provision --preview

# Vista previa de un entorno concreto
azd provision --preview --environment dev

# Vista previa sin preguntas (CI/CD)
azd provision --preview --no-prompt
```

**Salida:** Muestra los recursos que se crearán, modificarán o eliminarán.

### azd auth login

Autentica en Azure para las operaciones de azd.

```bash
azd auth login [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--check-status` | Comprobar el estado de inicio de sesión sin iniciar sesión |
| `--use-device-code` | Usar el flujo de código de dispositivo |
| `--tenant-id` | Especificar el inquilino |
| `--client-id` | ID de cliente de la entidad de servicio |

### azd env list

Enumera los entornos disponibles.

```bash
azd env list
```

---

## Azure CLI (az)

### az deployment group what-if

Muestra una vista previa de los cambios de despliegues en grupos de recursos.

```bash
az deployment group what-if \
  --resource-group <rg-name> \
  --template-file <bicep-file> \
  [options]
```

**Parámetros obligatorios:**

| Parámetro | Descripción |
|-----------|-------------|
| `--resource-group`, `-g` | Nombre del grupo de recursos de destino |
| `--template-file`, `-f` | Ruta del archivo Bicep |

**Parámetros opcionales:**

| Parámetro | Descripción |
|-----------|-------------|
| `--parameters`, `-p` | Archivo de parámetros o valores inline |
| `--validation-level` | `Provider` (predeterminado), `ProviderNoRbac` o `Template` |
| `--result-format` | `FullResourcePayloads` (predeterminado) o `ResourceIdOnly` |
| `--no-pretty-print` | Emitir JSON sin formato para su análisis |
| `--name`, `-n` | Nombre del despliegue |
| `--exclude-change-types` | Excluir determinados tipos de cambio de la salida |

**Niveles de validación:**

| Nivel | Descripción | Caso de uso |
|-------|-------------|----------|
| `Provider` | Validación completa con comprobaciones RBAC | Predeterminado, el más exhaustivo |
| `ProviderNoRbac` | Validación completa, solo permisos de lectura | Cuando no se dispone de permisos de despliegue |
| `Template` | Solo validación estática de sintaxis | Comprobación rápida de sintaxis |

**Ejemplos:**

```bash
# What-if básico
az deployment group what-if \
  --resource-group my-rg \
  --template-file main.bicep

# Con parámetros y validación completa
az deployment group what-if \
  --resource-group my-rg \
  --template-file main.bicep \
  --parameters main.bicepparam \
  --validation-level Provider

# Alternativa sin comprobaciones RBAC
az deployment group what-if \
  --resource-group my-rg \
  --template-file main.bicep \
  --validation-level ProviderNoRbac

# Salida JSON para su análisis
az deployment group what-if \
  --resource-group my-rg \
  --template-file main.bicep \
  --no-pretty-print
```

### az deployment sub what-if

Muestra una vista previa de los cambios de despliegues de ámbito de suscripción.

```bash
az deployment sub what-if \
  --location <location> \
  --template-file <bicep-file> \
  [options]
```

**Parámetros obligatorios:**

| Parámetro | Descripción |
|-----------|-------------|
| `--location`, `-l` | Ubicación de los metadatos del despliegue |
| `--template-file`, `-f` | Ruta del archivo Bicep |

**Ejemplos:**

```bash
az deployment sub what-if \
  --location eastus \
  --template-file main.bicep \
  --parameters main.bicepparam \
  --validation-level Provider
```

### az deployment mg what-if

Muestra una vista previa de los cambios de despliegues en grupos de administración.

```bash
az deployment mg what-if \
  --location <location> \
  --management-group-id <mg-id> \
  --template-file <bicep-file> \
  [options]
```

**Parámetros obligatorios:**

| Parámetro | Descripción |
|-----------|-------------|
| `--location`, `-l` | Ubicación de los metadatos del despliegue |
| `--management-group-id`, `-m` | ID del grupo de administración de destino |
| `--template-file`, `-f` | Ruta del archivo Bicep |

### az deployment tenant what-if

Muestra una vista previa de los cambios de despliegues de ámbito de inquilino.

```bash
az deployment tenant what-if \
  --location <location> \
  --template-file <bicep-file> \
  [options]
```

**Parámetros obligatorios:**

| Parámetro | Descripción |
|-----------|-------------|
| `--location`, `-l` | Ubicación de los metadatos del despliegue |
| `--template-file`, `-f` | Ruta del archivo Bicep |

### az login

Autentica en Azure CLI.

```bash
az login [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--tenant`, `-t` | ID o dominio del inquilino |
| `--use-device-code` | Usar el flujo de código de dispositivo |
| `--service-principal` | Iniciar sesión como entidad de servicio |

### az account show

Muestra el contexto de la suscripción actual.

```bash
az account show
```

### az group exists

Comprueba si existe el grupo de recursos.

```bash
az group exists --name <rg-name>
```

---

## CLI de Bicep

### bicep build

Compila Bicep a JSON de ARM y valida la sintaxis.

```bash
bicep build <bicep-file> [options]
```

**Opciones:**

| Opción | Descripción |
|--------|-------------|
| `--stdout` | Emitir por stdout en lugar de escribir en un archivo |
| `--outdir` | Directorio de salida |
| `--outfile` | Ruta del archivo de salida |
| `--no-restore` | Omitir la restauración de módulos |

**Ejemplos:**

```bash
# Validar la sintaxis (salida por stdout, sin crear archivos)
bicep build main.bicep --stdout > /dev/null

# Compilar en un directorio concreto
bicep build main.bicep --outdir ./build

# Validar varios archivos
for f in *.bicep; do bicep build "$f" --stdout; done
```

**Formato de salida de errores:**

```
/path/to/file.bicep(22,51) : Error BCP064: Found unexpected tokens in interpolated expression.
/path/to/file.bicep(22,51) : Error BCP004: The string at this location is not terminated.
```

Formato: `<file>(<line>,<column>) : <severity> <code>: <message>`

### bicep --version

Comprueba la versión de la CLI de Bicep.

```bash
bicep --version
```

---

## Detección de archivos de parámetros

### Parámetros Bicep (.bicepparam)

Archivos modernos de parámetros Bicep (recomendados):

```bicep
using './main.bicep'

param location = 'eastus'
param environment = 'dev'
param tags = {
  environment: 'dev'
  project: 'myapp'
}
```

**Patrón de detección:** `<template-name>.bicepparam`

### Parámetros JSON (.parameters.json)

Archivos tradicionales de parámetros ARM:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": { "value": "eastus" },
    "environment": { "value": "dev" }
  }
}
```

**Patrones de detección:**

- `<template-name>.parameters.json`
- `parameters.json`
- `parameters/<env>.json`

### Uso de parámetros con comandos

```bash
# Archivo de parámetros Bicep
az deployment group what-if \
  --resource-group my-rg \
  --template-file main.bicep \
  --parameters main.bicepparam

# Archivo de parámetros JSON
az deployment group what-if \
  --resource-group my-rg \
  --template-file main.bicep \
  --parameters @parameters.json

# Sobrescritura de parámetros inline
az deployment group what-if \
  --resource-group my-rg \
  --template-file main.bicep \
  --parameters main.bicepparam \
  --parameters location=westus
```

---

## Determinación del ámbito de despliegue

Comprueba la declaración `targetScope` del archivo Bicep:

```bicep
// Grupo de recursos (predeterminado si no se especifica)
targetScope = 'resourceGroup'

// Suscripción
targetScope = 'subscription'

// Grupo de administración
targetScope = 'managementGroup'

// Inquilino
targetScope = 'tenant'
```

**Correspondencia entre ámbito y comando:**

| targetScope | Comando | Parámetros obligatorios |
|-------------|---------|---------------------|
| `resourceGroup` | `az deployment group what-if` | `--resource-group` |
| `subscription` | `az deployment sub what-if` | `--location` |
| `managementGroup` | `az deployment mg what-if` | `--location`, `--management-group-id` |
| `tenant` | `az deployment tenant what-if` | `--location` |

---

## Requisitos de versión

| Herramienta | Versión mínima | Versión recomendada | Funcionalidades principales |
|------|-----------------|---------------------|--------------|
| Azure CLI | 2.14.0 | 2.76.0+ | Opción `--validation-level` |
| Azure Developer CLI | 1.0.0 | Más reciente | Opción `--preview` |
| Bicep CLI | 0.4.0 | Más reciente | Mejores mensajes de error |

**Comprobar versiones:**

```bash
az --version
azd version
bicep --version
```
