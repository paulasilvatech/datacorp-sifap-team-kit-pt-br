---
description: "Utiliza para buenas prácticas generales de Terraform (organización de archivos, variables, salidas, formato, validación, pruebas y estado). Las reglas autorizadas de Azure del kit están en infrastructure.instructions.md."
applyTo: "**/*.tf"
---

# Convenciones de Terraform — Buenas prácticas generales

Este archivo añade buenas prácticas del lenguaje Terraform a las reglas de infraestructura autorizadas del kit. **[`infrastructure.instructions.md`](infrastructure.instructions.md) es la referencia autorizada** para este kit: proveedor de Azure `azurerm ~> 3.x` (`required_version` fijada), etiquetas obligatorias `project`/`environment`/`owner`, secretos solo en `azurerm_key_vault_secret`, un módulo por área de servicio de Azure, identidades administradas y la puerta `terraform fmt` + `terraform validate`. Si algo de lo indicado aquí parece diferir, prevalecen las reglas de infraestructura. El equipo crea `infra/` en las etapas 3/4; no existe un conjunto de infraestructura heredado que copiar.

## Organización de archivos

Divide cada módulo por función para facilitar la navegación por los archivos:

- `main.tf`: recursos
- `variables.tf`: entradas tipadas
- `outputs.tf`: salidas
- `locals.tf`: valores calculados y expresiones repetidas
- `terraform.tf`: el bloque `terraform {}` y los requisitos de proveedores

Utiliza `snake_case` para los nombres de variables, valores locales, salidas y módulos.

## Variables y salidas

- Cada variable y salida declara un `type` explícito y una `description`.
- Proporciona valores predeterminados solo para entradas realmente opcionales; nunca definas un valor predeterminado para un secreto.
- Marca las entradas secretas y cualquier salida que contenga secretos con `sensitive = true` y, siempre que sea posible, evita emitir secretos en las salidas.
- Expón mediante `outputs` solo lo que realmente necesite otro módulo o quien realiza la llamada.

## Valores locales y orígenes de datos

- Traslada las expresiones repetidas a `locals` (por ejemplo, el mapa `common_tags`) para mantener coherentes los valores.
- Utiliza orígenes `data` para leer recursos existentes en lugar de incorporar sus identificadores directamente; evita consultar datos de recursos creados en la misma configuración y referéncialos directamente.

## Idempotencia

Escribe configuraciones que converjan: un segundo `terraform apply` sin cambios en las entradas debe informar de cero cambios. Evita efectos secundarios de `local-exec` / `null_resource` que vuelvan a ejecutarse en cada aplicación.

## Formato, validación y pruebas

- Ejecuta `terraform fmt -recursive` y `terraform validate` por módulo antes de cada commit (coincide con la puerta de infraestructura de la CI).
- Ejecuta `tflint` para detectar pronto los problemas específicos de proveedores.
- Escribe pruebas de módulos con el marco nativo `*.tftest.hcl` que cubran un caso positivo y uno negativo; mantenlas idempotentes.

## Estado

Almacena el estado en un backend remoto (Azure Storage) con bloqueo; nunca incluyas un archivo `*.tfstate` en un commit. Trata el estado y los módulos descargados en `.terraform/` como elementos de solo lectura; realiza todos los cambios mediante HCL y la CLI de Terraform.

## Convenciones

| Regla | Justificación |
|---|---|
| Un aspecto por archivo (`main`/`variables`/`outputs`/`locals`) | Módulos fáciles de recorrer |
| Nombres en `snake_case`, variables tipadas y descritas | HCL coherente y autodocumentado |
| `sensitive = true` en entradas y salidas secretas | Los secretos nunca aparecen en la salida del plan ni en el estado |
| `fmt` + `validate` por módulo + `tflint` sin errores | Coincide con la puerta de infraestructura de la CI |
| Estado remoto, nunca incluido en commits | Sin conflictos ni filtraciones de estado |

## Qué hacer / Qué no hacer

| Qué hacer | Qué no hacer |
|---|---|
| Seguir `infrastructure.instructions.md` para proveedor, etiquetas, secretos y módulos | Reinventar aquí las reglas de Azure del kit |
| Fijar versiones (base del kit: `azurerm ~> 3.x`) | Dejar proveedores sin fijar en «la más reciente» |
| Mantener el estado remoto y de solo lectura | Incluir `*.tfstate` en commits o editarlo manualmente |
| Cubrir los módulos con pruebas `*.tftest.hcl` | Entregar módulos sin probar |

## Lista de verificación antes de abrir una PR

- [ ] Los archivos están divididos en `main`/`variables`/`outputs`/`locals`; los nombres utilizan `snake_case`
- [ ] Cada variable y salida tiene un `type` y una `description`; los secretos están marcados como `sensitive`
- [ ] `terraform fmt -recursive`, `validate` por módulo y `tflint` se superan localmente
- [ ] Las versiones de los proveedores están fijadas a la base del kit (`azurerm ~> 3.x`)
- [ ] El estado permanece en el backend remoto; no se incluye ningún `*.tfstate` en commits
