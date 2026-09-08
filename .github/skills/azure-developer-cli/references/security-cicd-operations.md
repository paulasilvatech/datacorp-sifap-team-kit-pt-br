# Seguridad, hooks, CI/CD y operaciones

## Gestión de identidades y secretos

Usa este orden de preferencia:

1. Identidad administrada con RBAC de privilegio mínimo.
2. Federación de identidades de cargas de trabajo para CI/CD.
3. Referencia a Key Vault mediante `azd env set-secret`.
4. Material secreto de corta duración solo cuando no exista una opción basada en identidades.

Nunca:

- Almacenes un secreto sin cifrar en `.azure/<environment>/.env`.
- Incluyas en commits archivos de entorno, credenciales, certificados ni estado de Terraform.
- Pongas secretos en las salidas de IaC.
- Imprimas indiscriminadamente valores de entorno en hooks o canalizaciones.
- Pases un secreto directamente por línea de comandos cuando el shell o el sistema CI pueda registrarlo.
- Concedas roles amplios de suscripción cuando baste con un ámbito de grupo de recursos o de recurso.

`azd env set-secret <name>` almacena una referencia a Key Vault en el entorno AZD. Resuélvela solo donde sea necesario:

- Mapéala a un parámetro Bicep `@secure()`.
- Usa un mapeo `secrets` de hook para el proceso de un hook.
- Elige entre una variable de canalización que contenga la referencia a Key Vault y un secreto de canalización que contenga el valor resuelto.

Prefiere el enfoque de referencia cuando la identidad de la canalización pueda leer Key Vault, porque la rotación no requiere volver a publicar un secreto resuelto en la canalización.

## Hooks

Usa hooks para validación, configuración de ejecución generada, preparación de datos, comprobaciones básicas de funcionamiento o coordinación del ciclo de vida que IaC y el comportamiento nativo de AZD no puedan expresar.

### Reglas de hooks

- Prefiere scripts externos a comandos inline largos.
- Almacena los scripts bajo `scripts/azd`.
- Establece `shell: sh` o `shell: pwsh` explícitamente.
- Proporciona implementaciones `windows` y `posix` cuando la sintaxis difiera.
- Usa rutas relativas al directorio de trabajo documentado del hook.
- Haz que los scripts sean idempotentes y seguros de volver a ejecutar.
- Mantén `continueOnError` en false, salvo que la operación sea únicamente de observabilidad o verdaderamente opcional.
- Usa comportamiento no interactivo en CI.
- No instales dependencias sin versión fijada en cada ejecución si una configuración reproducible de herramientas puede hacerlo una sola vez.
- No registres valores secretos ni todas las variables de entorno.
- Prueba con `azd hooks run <hook-name>` antes de vincular el hook a un despliegue completo.

Ejemplo:

```yaml
hooks:
  preprovision:
    windows:
      shell: pwsh
      run: ./scripts/azd/validate.ps1
      interactive: false
      continueOnError: false
    posix:
      shell: sh
      run: ./scripts/azd/validate.sh
      interactive: false
      continueOnError: false
```

Usa hooks de raíz para todo el proyecto. Coloca los hooks específicos de un servicio en su entrada de `azure.yaml`.

## Flujo de despliegue

El ciclo de vida habitual de AZD es:

1. Empaquetar artefactos de aplicación.
2. Aprovisionar o actualizar la infraestructura.
3. Desplegar artefactos de aplicación.

`azd up` es el flujo combinado práctico y resulta adecuado para el desarrollo habitual y los despliegues sencillos.

Usa comandos separados cuando:

- La revisión o aprobación de infraestructura deba ocurrir antes del despliegue.
- La aplicación se redespliegue con frecuencia sin cambios de infraestructura.
- La solución de problemas requiera aislar fallos de empaquetado, aprovisionamiento o despliegue.
- Una dependencia compleja exija un orden personalizado.

```text
azd package
azd provision -e <environment>
azd deploy -e <environment>
```

Personaliza `workflows.up.steps` solo cuando una dependencia real requiera otro orden, como aprovisionar antes de una compilación que necesite un punto de conexión generado. No personalices el flujo solo para imitar las convenciones de nombres de una canalización.

## Dependencias full-stack y entre servicios

- Mapea las dependencias de los servicios antes de implementar.
- Deja que Bicep o Terraform gestionen las dependencias unidireccionales de infraestructura.
- Usa salidas de aprovisionamiento para los puntos de conexión y nombres necesarios durante el despliegue.
- Usa configuración de ejecución, como Azure App Configuration o un archivo generado, cuando los ajustes deban cambiar sin recompilar.
- Evita dependencias circulares en tiempo de compilación entre servicios de frontend y backend.
- Usa hooks o un flujo personalizado solo cuando las salidas y la configuración de ejecución no puedan resolver la dependencia.
- Prueba la estrategia de forma independiente en entornos de desarrollo, pruebas y similares a producción.

## CI/CD

### Diseño de canalizaciones

Una canalización robusta separa:

1. Formato, lint, compilación y pruebas de la aplicación.
2. Formato y validación estática de IaC.
3. Revisión de what-if o del plan en el ámbito correcto.
4. Aprovisionamiento con un entorno AZD explícito.
5. Despliegue.
6. Verificación básica de funcionamiento o de estado.
7. Aprobación de producción y procedimientos de reversión y limpieza.

Usa:

- `--no-prompt` en automatización.
- Un `-e` o `--environment` fijo.
- Entornos protegidos y revisores obligatorios para producción.
- Controles de concurrencia para evitar escrituras simultáneas en un entorno.
- Identidades de privilegio mínimo limitadas al entorno de destino.
- Versiones fijadas de acciones y herramientas con un proceso de actualización gestionado.

### `azd pipeline config`

La documentación actual de Microsoft clasifica `azd pipeline config` como beta. Antes de ejecutarlo:

- Revisa la definición de canalización incluida en la plantilla.
- Confirma el repositorio, la organización, el entorno, la suscripción y el modo de autenticación.
- Prevé efectos secundarios en repositorios, identidades, variables, secretos, commits, pushes y canalizaciones.
- Revisa los cambios de flujo de trabajo y permisos generados antes de usarlos en producción.
- Vuelve a ejecutarlo cuando cambien `pipeline.variables` o `pipeline.secrets`.

Para GitHub Actions, AZD configura OIDC y credenciales federadas de forma predeterminada en escenarios compatibles. La documentación actual indica que el flujo de canalización Terraform de AZD no admite OIDC; evalúa explícitamente las ventajas e inconvenientes de autenticación en lugar de recurrir en silencio a una credencial de larga duración.

Para Terraform, configura un estado remoto protegido antes de preparar la canalización.

## Validación y vista previa

Ejecuta comprobaciones locales antes de comandos que modifiquen Azure:

### Bicep

```text
az bicep build --file infra/main.bicep
```

Usa what-if de despliegue de Azure en el ámbito declarado por la plantilla. No asumas un ámbito de grupo de recursos.

### Terraform

```text
terraform fmt -check -recursive
terraform init -backend=false
terraform validate
```

Usa `terraform plan` solo después de confirmar el backend, el espacio de trabajo o clave de estado, las variables y la identidad de Azure.

### AZD y aplicación

- Ejecuta las comprobaciones existentes de la aplicación.
- Ejecuta los hooks pertinentes de forma independiente.
- Ejecuta `azd package` para verificar las rutas de servicios y el empaquetado.
- Confirma que las salidas IaC coincidan con las variables consumidas durante el despliegue.
- Inspecciona el nombre del entorno antes de provision, deploy o down.

## Secuencia de solución de problemas

1. Identifica si el fallo está en package, provision, deploy, un hook, la autenticación o el descubrimiento de recursos.
2. Vuelve a ejecutar la fase mínima que falle en lugar de `azd up`.
3. Comprueba el entorno seleccionado y la suscripción, el inquilino y la región esperados.
4. Comprueba las rutas de `azure.yaml`, el proveedor, los nombres de servicios, los tipos de host y las etiquetas de descubrimiento de recursos.
5. Actualiza las salidas de entorno con `azd env refresh` cuando el estado de Azure haya cambiado desde otro lugar.
6. Para Terraform, verifica la autenticación tanto de AZD como de Azure CLI y el estado remoto correcto.
7. Para hooks, ejecuta el hook directamente y verifica su shell, directorio de trabajo y dependencias del entorno.
8. Usa registros de depuración solo cuando sea necesario y oculta los valores sensibles antes de compartirlos.

## Limpieza

- Confirma el entorno exacto antes de `azd down`.
- Explica que la limpieza puede eliminar recursos que contienen datos.
- Conserva los recursos compartidos o gestionados externamente.
- Para entornos efímeros, automatiza la limpieza e incluye una alternativa para ejecuciones fallidas de la canalización.
- Verifica la eliminación en lugar de asumir que el comando tuvo éxito.
