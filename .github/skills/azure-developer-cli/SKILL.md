---
name: "azure-developer-cli"
description: "Úsala para diseñar, crear, revisar, migrar o solucionar problemas de proyectos de Azure Developer CLI (azd) según las orientaciones actuales de Microsoft. Abarca azd, azure.yaml, plantillas AZD, Terraform (o Bicep) bajo infra, entornos y secretos de AZD, hooks, flujos de despliegue y CI/CD gestionada por azd. Los desencadenantes incluyen \"azd\", \"azure.yaml\", \"entorno azd\", \"canalización azd\" y \"azd up\"."
---
# Buenas prácticas de Azure Developer CLI

Usa esta skill para crear proyectos `azd` mantenibles, seguros y adaptados a sus entornos. Prefiere las convenciones del repositorio cuando ya sean coherentes y realiza el menor cambio completo que mejore el proyecto. Esta skill enseña a estructurar y operar un proyecto `azd`; no decide por ti la arquitectura de la carga de trabajo.

> [!NOTE]
> Esta skill presupone que la **CLI `azd`** está instalada y autenticada. Este kit utiliza **Terraform (`azurerm ~> 3.x`)** como estándar de IaC, así que considera Terraform como el proveedor bajo `infra/` y lee las orientaciones sobre Bicep únicamente como referencia.

## Cuándo invocar

- "Configura un proyecto azd nuevo para nuestros servicios de backend y frontend."
- "Revisa nuestro azure.yaml y la estructura de infra en busca de problemas."
- "Migra esta plantilla azd de Bicep a Terraform."
- "¿Por qué falla `azd provision` en nuestro entorno de preproducción?"

## Empieza por explorar el repositorio

Antes de editar:

1. Localiza `azure.yaml`, el `infra.path` configurado, los proyectos fuente, los scripts de despliegue, `.gitignore` y las definiciones de canalizaciones.
2. Lee `azure.yaml` antes de deducir los servicios o el proveedor de IaC.
3. Identifica si la tarea consiste en crear, migrar, revisar, desplegar o solucionar problemas.
4. Identifica el entorno activo solo cuando se requiera una operación específica de un entorno.
5. Lee la referencia pertinente:
   - Estructura del repositorio o `azure.yaml`: [references/project-structure.md](references/project-structure.md)
   - Bicep, Terraform, parámetros, salidas o entornos: [references/iac-and-environments.md](references/iac-and-environments.md)
   - Secretos, hooks, CI/CD, despliegue o solución de problemas: [references/security-cicd-operations.md](references/security-cicd-operations.md)
   - Detalles del producto que puedan haber cambiado: [references/official-docs.md](references/official-docs.md)

No supongas la ruta predeterminada `infra`, el proveedor predeterminado Bicep ni un único servicio cuando `azure.yaml` indique otra cosa.

## Aplica medidas de seguridad

- Nunca incluyas en commits `.azure`, archivos `.env` de entornos, credenciales, salidas de despliegue con secretos, estado local de Terraform ni artefactos de despliegue generados.
- Nunca escribas secretos literales en `azure.yaml`, archivos de parámetros IaC, hooks, control de versiones, argumentos de comandos que vayan a registrarse ni salidas IaC.
- Prefiere identidades administradas y RBAC. Usa referencias a Key Vault y `azd env set-secret` cuando un secreto sea inevitable.
- Antes de ejecutar un comando que pueda crear, modificar o eliminar recursos de Azure, confirma el entorno, la suscripción, el inquilino, la región y el alcance previsto.
- Considera una solicitud explícita de desplegar, aprovisionar, destruir o configurar una canalización como aprobación para esa acción concreta. En otro caso, pregunta antes de ejecutar `azd up`, `azd provision`, `azd deploy`, `azd down` o `azd pipeline config`.
- No sustituyas Bicep por Terraform, Terraform por Bicep ni un servicio de alojamiento establecido, salvo que la persona solicite ese cambio arquitectónico.
- Conserva los recursos y el estado gestionados fuera del proyecto `azd` actual.

## Usa estos valores predeterminados

| Aspecto | Opción predeterminada preferida |
| --- | --- |
| Manifiesto del proyecto | Un `azure.yaml` en la raíz del repositorio |
| Código de aplicación | `src/<service-name>` por servicio desplegable de forma independiente |
| Infraestructura | `infra` con un punto de entrada ligero y módulos reutilizables |
| Proveedor de IaC | Terraform en este kit; en otros casos, Bicep salvo que el repositorio o la persona elijan Terraform |
| Entornos de despliegue | Entornos con nombre separados para desarrollo, pruebas, preproducción y producción |
| Estado local de AZD | `.azure/<environment-name>`, excluido del control de versiones |
| Estado compartido del entorno | Entornos remotos de AZD respaldados por Azure Blob Storage |
| Secretos | Primero identidad administrada/RBAC, después referencias a Key Vault |
| Scripts de automatización | Scripts breves e idempotentes bajo `scripts/azd` |
| Autenticación de CI | Federación de identidades de cargas de trabajo/OIDC donde se admita |
| Desarrollo habitual | `azd up` para flujos sencillos; fases separadas para flujos controlados |

## Flujo de implementación

### 1. Modelar la aplicación

- Define una entrada `services` para cada componente desplegable de forma independiente.
- Mantén estables las claves de servicio, porque intervienen en el descubrimiento de recursos y el despliegue.
- Asocia cada servicio con sus valores reales de `project`, `language` y `host`.
- Mantén la infraestructura compartida en IaC en lugar de inventar un servicio desplegable ficticio.
- Declara las dependencias con campos admitidos por `azure.yaml` en lugar de depender del orden del archivo.

### 2. Modelar la infraestructura

- Mantén `main.bicep` o `main.tf` como punto de entrada de la orquestación.
- Divide en módulos la infraestructura reutilizable o comprensible de forma independiente.
- Parametriza los valores específicos de cada entorno; no dupliques el árbol de IaC por entorno.
- Expón solo valores estables y no secretos que necesiten el despliegue o la configuración de la aplicación.
- Usa nombres deterministas y etiquetas coherentes que incluyan el proyecto y el entorno.
- Añade asignaciones de roles a las identidades en lugar de distribuir claves de servicio.
- Usa capas de infraestructura solo cuando lo justifiquen ámbitos separados o dependencias de ciclo de vida.

### 3. Modelar los entornos

- Usa nombres previsibles, como `<project>-dev` para entornos compartidos y `<alias>-dev` para entornos personales.
- Usa `azd env set`, `azd env unset` y `azd env set-secret` en lugar de editar `.env` directamente.
- Usa `-e` o `--environment` en scripts y automatizaciones para que el destino sea explícito.
- Usa `azd env refresh` para sincronizar las salidas de despliegue después de que otra persona o proceso cambie un entorno.
- Configura el estado remoto de AZD cuando un equipo comparta el estado de un entorno.

### 4. Añadir hooks solo para cubrir carencias del ciclo de vida

- Prefiere IaC declarativa y configuración nativa del servicio a hooks.
- Usa hooks de raíz para el comportamiento de todo el proyecto y hooks de servicio para el comportamiento específico de cada servicio.
- Mantén la lógica no trivial de los hooks en scripts versionados bajo `scripts/azd`.
- Establece `shell` explícitamente. Proporciona variantes `windows` y `posix` cuando sea necesario.
- Haz que los hooks sean idempotentes, no interactivos en CI y que fallen ante errores, salvo que se haya decidido expresamente que el fallo no bloquee.
- Prueba un hook de forma independiente con `azd hooks run <hook-name>`.

### 5. Construir CI/CD de forma deliberada

- Mantén la definición de la canalización junto a la plantilla y revisa los cambios generados por `azd pipeline config`.
- Usa credenciales federadas de corta duración donde el proveedor las admita.
- Ejecuta las pruebas y la validación de IaC antes de aprovisionar.
- Usa entornos explícitos y `--no-prompt` en la automatización.
- Añade entornos de producción protegidos y puertas de aprobación.
- Para Terraform, configura un estado remoto protegido antes de configurar la canalización y ten en cuenta las limitaciones actuales de autenticación de AZD.

## Valida antes de terminar

Ejecuta únicamente las comprobaciones aplicables al repositorio:

```text
Aplicación: formateador, linter, comprobación de tipos, compilación y pruebas existentes
Bicep:      az bicep build --file infra/main.bicep
Terraform:  terraform fmt -check -recursive
            terraform init -backend=false
            terraform validate
Hooks AZD:  azd hooks run <hook-name>
Empaquetado: azd package
```

Para un what-if de Bicep o un plan de Terraform, elige el ámbito de despliegue y el entorno correctos. Estas comprobaciones pueden autenticarse en Azure o leer el estado remoto, por lo que debes respetar las medidas de seguridad.

Verifica que:

- Las rutas de `azure.yaml` existan y la configuración de los servicios coincida con los proyectos fuente.
- El punto de entrada y el proveedor de IaC concuerden con `azure.yaml`.
- Las salidas de despliegue necesarias coincidan con las variables consumidas por servicios, hooks y canalizaciones.
- `.gitignore` excluya `.azure`, secretos, estado local y artefactos generados.
- No aparezca ningún secreto en contenido bajo control de versiones ni en la salida de comandos.
- La documentación explique los prerrequisitos, la creación de entornos, el despliegue, la verificación y la limpieza.

## Informa del resultado

Indica:

- Los archivos y comportamientos modificados.
- El proveedor de IaC y las suposiciones sobre el entorno.
- Las comprobaciones realizadas.
- Los comandos que modificarían la nube y que deliberadamente no se ejecutaron.
- Las funcionalidades beta o en versión preliminar de las que dependa la solución.

No afirmes que el despliegue tuvo éxito si el entorno de destino no se desplegó y verificó realmente.

## Plantilla de salida

Informa del cambio mediante un bloque de estado breve:

```text
Revisión del proyecto azd: sifap-modern
Modificado: azure.yaml (servicio web añadido), infra/main.tf (módulo de almacenamiento añadido)
Proveedor de IaC: Terraform (azurerm ~> 3.x); entorno: sifap-dev
Comprobaciones ejecutadas: terraform fmt -check, terraform validate, azd package
No ejecutado: azd provision (modificaría Azure); requiere aprobación explícita
Funcionalidades en versión preliminar: ninguna
```

## Puerta de calidad

- [ ] Las rutas de servicios de `azure.yaml` existen y la configuración coincide con los proyectos fuente.
- [ ] El punto de entrada y el proveedor de IaC concuerdan con `azure.yaml` (Terraform en este kit).
- [ ] Las salidas de despliegue necesarias coinciden con las variables consumidas por servicios, hooks y canalizaciones.
- [ ] `.gitignore` excluye `.azure`, secretos, estado local y artefactos generados.
- [ ] No aparece ningún secreto en contenido bajo control de versiones ni en la salida de comandos; los secretos usan identidad administrada o referencias a Key Vault.
- [ ] Se superan las comprobaciones aplicables (`terraform fmt -check`, `terraform validate` y el formateador, linter y pruebas del proyecto).
- [ ] No se ejecutó ningún comando que modifique la nube sin aprobación explícita y solo se afirma el éxito tras una verificación real.
