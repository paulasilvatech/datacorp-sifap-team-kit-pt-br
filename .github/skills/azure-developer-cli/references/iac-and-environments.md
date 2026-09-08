# Infraestructura como código y entornos

## Elige el proveedor de forma deliberada

### Bicep

Usa Bicep cuando:

- El proyecto sea exclusivo de Azure.
- Importen la cobertura nativa de recursos de Azure y el soporte inmediato de API.
- El equipo quiera un modelo de despliegue sin estado.
- Azure Verified Modules cubra los patrones habituales de recursos.

Bicep es el proveedor predeterminado de IaC de AZD.

### Terraform

Usa Terraform cuando:

- El repositorio ya utilice Terraform.
- El equipo tenga prácticas establecidas de módulos, estado, políticas y revisión de Terraform.
- La infraestructura entre varios proveedores sea un requisito real.

La documentación actual de Microsoft clasifica el soporte de Terraform en AZD como beta. Haz visible esta restricción y no migres un proyecto a Terraform solo por familiaridad.

## Estructura de Bicep

Mantén `main.bicep` como capa de orquestación:

```text
infra/
|-- main.bicep
|-- main.parameters.json
|-- modules/
|   |-- core/
|   |-- data/
|   |-- identity/
|   |-- observability/
|   |-- services/
```

### Prácticas de Bicep

- Declara el `targetScope` del despliegue de forma deliberada.
- Usa módulos para capacidades cohesionadas y patrones repetidos.
- Prefiere Azure Verified Modules cuando cumplan el requisito y el equipo acepte su modelo de versiones.
- Fija las versiones de los módulos; revisa las actualizaciones en lugar de adoptar versiones variables automáticamente.
- Añade descripciones y decoradores de validación a los parámetros.
- Pasa los parámetros a través de los módulos en lugar de leer variables de entorno AZD dentro de cada uno.
- Usa nombres deterministas que respeten las restricciones de longitud y caracteres de cada tipo de recurso.
- Usa `uniqueString` con entradas de ámbito estables cuando se requiera unicidad global.
- Aplica etiquetas coherentes de proyecto, entorno, responsable y costo cuando lo permita la política.
- Usa identidades administradas y asignaciones de roles con ámbitos limitados.
- Evita claves y cadenas de conexión cuando haya acceso basado en identidades.
- Expón los ID, nombres y puntos de conexión de recursos necesarios para las fases posteriores.
- Nunca expongas valores secretos. Las salidas de despliegue se copian al entorno AZD.

### Flujo de parámetros

Usa `main.parameters.json` para mapear los valores del entorno AZD a Bicep:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "environmentName": {
      "value": "${AZURE_ENV_NAME}"
    },
    "location": {
      "value": "${AZURE_LOCATION}"
    }
  }
}
```

Haz que esos valores se correspondan con el punto de entrada:

```bicep
@description('Nombre estable del entorno de despliegue de AZD.')
@minLength(1)
param environmentName string

@description('Región principal de Azure para este despliegue.')
param location string
```

Usa las salidas como contrato entre el aprovisionamiento y las fases posteriores de AZD:

```bicep
output SERVICE_API_ENDPOINT_URL string = api.outputs.endpoint
```

Elige nombres de salida estables, porque los servicios, hooks y canalizaciones pueden consumirlos como variables de entorno.

Al usar secretos de entorno de AZD con Bicep:

- Marca la entrada Bicep con `@secure()`.
- Mapea la referencia al secreto de AZD mediante `main.parameters.json`.
- No expongas el valor seguro como salida.
- Ten en cuenta que la documentación actual de AZD indica que los secretos de entorno no son compatibles con archivos `.bicepparam`.

## Estructura y estado de Terraform

### Prácticas de Terraform

- Establece `infra.provider: terraform` explícitamente en `azure.yaml`.
- Mantén todos los archivos `.tf` gestionados por AZD bajo la ruta de infraestructura configurada.
- Fija las versiones de Terraform y los proveedores e incluye el archivo de bloqueo de dependencias en el control de versiones.
- Usa módulos con entradas y salidas claras.
- Marca las variables y salidas sensibles como `sensitive`, pero recuerda que sus valores pueden seguir existiendo en el estado.
- No incluyas en commits `.tfstate`, archivos de plan, registros de fallos ni credenciales de proveedores.
- Evita dividir la responsabilidad del mismo recurso de Azure entre AZD y un módulo raíz de Terraform ajeno.

### Autenticación

El proveedor de Azure de Terraform utiliza autenticación de Azure CLI de forma predeterminada y no usa la caché de credenciales de AZD. Prefiere la configuración documentada de inicio de sesión único:

```text
azd config set auth.useAzCliAuth true
az login
```

En otro caso, se requieren tanto `azd auth login` como `az login`.

### Estado remoto

Configura un backend remoto protegido antes de `azd pipeline config` o de despliegues colaborativos:

- Usa una cuenta de almacenamiento dedicada y un contenedor privado donde corresponda.
- Restringe el acceso con RBAC y controles de red.
- Habilita protecciones de la plataforma, como versionado, eliminación temporal y bloqueos de recursos, según la política de la organización.
- Usa una clave de estado distinta por proyecto y entorno.
- Trata el estado como datos sensibles.
- No almacenes claves de acceso al backend en el control de versiones.

AZD lee la configuración del backend de Terraform desde `infra/provider.conf.json` cuando se configura según la integración oficial de Terraform.

## Estrategia de entornos

AZD almacena el estado local del entorno bajo:

```text
.azure/
|-- config.json
|-- <environment-name>/
    |-- .env
    |-- config.json
```

Todo el directorio `.azure` debe quedar fuera del control de versiones.

### Nomenclatura

Usa nombres que aclaren la responsabilidad y el ciclo de vida:

- Compartidos: `<project>-dev`, `<project>-test`, `<project>-prod`
- Personales: `<alias>-<purpose>` o `<alias>-dev`
- Efímeros: `<project>-pr-<number>` cuando la automatización también garantice la limpieza

Mantén el nombre lo suficientemente corto para admitir recursos con límites de nomenclatura restrictivos.

### Gestión

Usa comandos de AZD en lugar de editar archivos manualmente:

```text
azd env new <name>
azd env list
azd env select <name>
azd env set <key> <value>
azd env get-value <key>
azd env unset <key>
azd env refresh
```

En automatizaciones y operaciones potencialmente destructivas, especifica el entorno explícitamente:

```text
azd provision -e <environment> --no-prompt
azd deploy -e <environment> --no-prompt
```

### Reglas de configuración

- Mantén una sola base de código IaC y varía el comportamiento mediante parámetros.
- Mantén los valores predeterminados no secretos en configuración revisada o IaC, no en archivos `.azure` incluidos en commits.
- Usa `azd env set` para ajustes no secretos específicos del despliegue.
- Permite que las salidas IaC proporcionen los nombres calculados de recursos y puntos de conexión.
- Evita condicionales por nombre de entorno dispersos entre módulos. Prefiere parámetros explícitos de funcionalidad o SKU.
- Usa `azd env refresh` después de que otra persona o proceso cambie las salidas de despliegue.
- No asumas en los scripts cuál es el entorno seleccionado actualmente.

## Entornos compartidos y remotos

Configura `state.remote` cuando el equipo o la automatización necesiten un entorno AZD compartido:

```yaml
state:
  remote:
    backend: AzureBlobStorage
    config:
      accountName: <storage-account-name>
      containerName: <project-container-name>
```

El estado remoto de AZD sincroniza `.env` y `config.json` de AZD; es independiente del estado remoto de Terraform. Un proyecto Terraform con colaboración mediante AZD puede necesitar ambos:

- Estado remoto de AZD para la configuración del entorno.
- Estado remoto de Terraform para el estado de la infraestructura gestionada.

Protege ambos almacenes con RBAC de privilegio mínimo y ajustes adecuados de protección de datos.
