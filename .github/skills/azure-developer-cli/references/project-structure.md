# Estructura del proyecto y `azure.yaml`

## Organización recomendada del repositorio

Usa esta organización como opción predeterminada, no como motivo para reorganizar un repositorio que ya sea coherente:

```text
.
|-- .azure/                         # Estado local generado del entorno AZD; ignorado
|-- .devcontainer/                  # Entorno de desarrollo reproducible opcional
|-- .github/
|   |-- workflows/
|       |-- azure-dev.yml           # Canalización opcional de GitHub Actions
|-- infra/
|   |-- main.bicep                  # Punto de entrada de la orquestación Bicep
|   |-- main.parameters.json        # Mapeo del entorno AZD a parámetros Bicep
|   |-- modules/
|       |-- core/                   # Recursos compartidos de plataforma
|       |-- app/                    # Recursos específicos de aplicación
|-- scripts/
|   |-- azd/                        # Scripts auxiliares de hooks y despliegue
|-- src/
|   |-- api/                        # Servicio desplegable de forma independiente
|   |-- web/                        # Servicio desplegable de forma independiente
|-- tests/
|-- .gitignore
|-- azure.yaml
|-- README.md
```

Para Terraform, usa una organización convencional de `infra`:

```text
infra/
|-- main.tf
|-- providers.tf
|-- variables.tf
|-- outputs.tf
|-- provider.conf.json              # Configuración del backend remoto de AZD, cuando se use
|-- modules/
```

### Reglas de estructura

- Coloca `azure.yaml` en la raíz del proyecto.
- Mantén el código fuente de la aplicación independiente de los recursos de despliegue.
- Mantén pequeño el punto de entrada de IaC; lleva los detalles de recursos a módulos.
- Organiza los módulos por responsabilidad o ciclo de vida, no con un archivo arbitrario por recurso.
- Mantén los scripts de hooks fuera de `infra`, salvo que pertenezcan exclusivamente a una capa de infraestructura.
- Evita incluir en commits árboles fuente específicos por entorno, como `infra/dev`, `infra/test` e `infra/prod`. Usa parámetros.
- Mantén las pruebas conforme a las convenciones habituales de su lenguaje; no las muevas solo para encajar en este ejemplo.
- Incluye `.devcontainer` solo si se mantiene y prueba.

## Configuración base de `azure.yaml`

Añade la directiva de esquema para la validación del editor:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/Azure/azure-dev/main/schemas/v1.0/azure.yaml.json
name: sample-app

infra:
  provider: bicep
  path: ./infra
  module: main

services:
  api:
    project: ./src/api
    language: ts
    host: appservice
  web:
    project: ./src/web
    dist: dist
    language: ts
    host: staticwebapp
```

El bloque `infra` explícito es útil cuando importa la claridad, aunque Bicep, `infra` y `main` sean los valores predeterminados.

## Lista de verificación del diseño del manifiesto

### Configuración de nivel superior

- `name` está en minúsculas, empieza y termina con un carácter alfanumérico y solo usa caracteres alfanuméricos y guiones.
- `metadata.template` identifica la plantilla de origen y su versión cuando el repositorio se distribuye como plantilla.
- `infra.provider`, `infra.path` e `infra.module` se corresponden con el repositorio real.
- Se usa `requiredVersions` cuando el proyecto depende de una versión mínima de AZD o de una extensión.
- `workflows` sobrescribe los valores predeterminados solo cuando el orden de despliegue lo requiere realmente.
- `state.remote` se configura en el ámbito del proyecto cuando los equipos comparten entornos AZD.

### Servicios

- Un servicio representa código de aplicación desplegable, no una base de datos, Key Vault u otro recurso compartido.
- Los nombres de servicio son breves, significativos y estables.
- `project` apunta a la raíz del servicio y usa una ruta relativa.
- `language`, `host`, `dist` y los ajustes de contenedor y compilación remota coinciden con la forma de compilar el servicio.
- Un servicio de Container Apps usa `project` o `image`, no ambos.
- `resourceName` se establece solo cuando el descubrimiento estándar de AZD mediante la etiqueta `azd-service-name` no está disponible o se omite de forma intencional.
- Las dependencias usan relaciones `uses` admitidas en lugar de suposiciones implícitas.
- Las variables de entorno usan sustituciones o salidas IaC en lugar de valores de entorno fijados en el código.

### Recursos e infraestructura

- Los recursos compartidos de Azure permanecen en IaC.
- Los módulos de servicio y los nombres de servicio de AZD se alinean para que el descubrimiento de recursos sea previsible.
- Los nombres personalizados de grupos de recursos incluyen la identidad del entorno y cumplen las restricciones de nomenclatura de Azure.
- Las capas de infraestructura se reservan para unidades aprovisionadas independientemente, ámbitos distintos o dependencias mediadas por hooks.
- Las dependencias entre capas se hacen explícitas con `dependsOn` cuando AZD no puede deducirlas.

### Canalizaciones y hooks

- `pipeline.variables` contiene configuración no secreta.
- `pipeline.secrets` se usa solo cuando la canalización debe almacenar el valor resuelto en lugar de una referencia a Key Vault.
- Los hooks de raíz gestionan el trabajo de todo el proyecto; los hooks de servicio gestionan un servicio.
- Los scripts de hooks usan shells explícitos y rutas portables.
- Los hooks no duplican pruebas de aplicación ni comportamiento declarativo de IaC.

## Requisitos del README de un proyecto AZD reutilizable

Documenta:

1. La arquitectura y los servicios de Azure desplegados.
2. Los prerrequisitos locales, incluidos AZD y las herramientas específicas del proveedor.
3. Los requisitos de autenticación.
4. Cómo crear o seleccionar un entorno.
5. Las variables no secretas obligatorias y cómo establecerlas.
6. Cómo se proporcionan los secretos sin exponer sus valores.
7. Cómo ejecutar, probar, aprovisionar, desplegar, supervisar y solucionar problemas.
8. Los recursos previstos que generan costos.
9. Cómo realizar la limpieza de forma segura.
10. Las dependencias beta o en versión preliminar, incluidas funcionalidades de Terraform o canalizaciones cuando corresponda.

No incluyas en documentación reutilizable ID reales de suscripción o inquilino, nombres de secretos que revelen sistemas sensibles ni puntos de conexión de producción.
