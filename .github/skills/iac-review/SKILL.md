---
name: "iac-review"
description: "Úsala para revisar Terraform, Bicep o CloudFormation, comprobar desviaciones o reforzar código de infraestructura. Los desencadenantes incluyen \"revisar Terraform\", \"revisar Bicep\", \"revisión de IaC\", \"detección de desviaciones\" y \"archivo de estado\"."
---
# Revisión de IaC

## Cuándo invocar

- "Revisa este módulo de Terraform."
- "¿Por qué nuestro plan muestra desviaciones?"
- "¿Está este Bicep listo para producción?"

## Lista de verificación de la revisión

### Estructura

- [ ] Los módulos son **componibles** y tienen una única responsabilidad (un módulo = un stack lógico, no un recurso).
- [ ] **Ningún valor incrustado en el código**: parametriza todo con valores predeterminados razonables.
- [ ] **Entradas documentadas** (`description`, `type` y reglas de `validation`) y salidas documentadas.
- [ ] Un **README** en la raíz del módulo con un ejemplo de uso.

### Estado y backends

- [ ] **Estado remoto** con bloqueo (S3+DynamoDB, Azure Storage con un arrendamiento de blob, GCS).
- [ ] El estado **nunca se incluye en commits** de Git; `.gitignore` cubre `*.tfstate*`.
- [ ] El estado se separa por entorno, sin acoplamiento implícito entre entornos.
- [ ] IAM controla el acceso al estado, no las credenciales compartidas.

### Seguridad

- [ ] No hay secretos en el código ni en los valores predeterminados de variables. Usa Key Vault / Secrets Manager / SOPS.
- [ ] IAM aplica privilegio mínimo, sin `*:*` ni `Resource: "*"` salvo justificación.
- [ ] El cifrado en reposo y en tránsito está habilitado para todos los almacenes de datos.
- [ ] El acceso público se deniega explícitamente, salvo que sea intencional. Documenta el acceso intencional en el README del módulo.
- [ ] `tfsec` / `checkov` / `PSRule` no informan de hallazgos, o las excepciones están documentadas.

### Seguridad de los cambios

- [ ] `terraform plan` se incluye como comentario en las PR (Atlantis / tfcmt / GH Actions).
- [ ] `prevent_destroy` está configurado en los recursos con estado (bases de datos, KV, cuentas de almacenamiento).
- [ ] Las versiones de los proveedores están **fijadas** (`~>` con versiones principal y secundaria explícitas).
- [ ] Las versiones de los módulos están fijadas.
- [ ] Los diffs destructivos requieren una segunda persona aprobadora.

### Desviaciones

- [ ] Detección programada de desviaciones (`terraform plan -detailed-exitcode` a diario o Driftctl).
- [ ] Las desviaciones crean automáticamente un ticket y nunca pasan inadvertidas.
- [ ] No se realizan cambios manuales en la consola sin reflejarlos después en código.

## Hallazgos habituales

- **Uso de `count` para listas que pueden cambiar de orden** → usa `for_each` con claves estables.
- **`depends_on` por todas partes** → suele indicar que faltan dependencias implícitas; elimínalo salvo que sea realmente necesario.
- **Orígenes de datos usados para valores disponibles durante el plan** → llamadas innecesarias a API y CI inestable.
- **Diferencias entre entornos mediante interpolación de cadenas con `terraform.workspace`** → enfoque frágil; usa tfvars o stacks separados.

## Plantilla de salida

```markdown
## Revisión de IaC - <módulo o stack>

| Área | Hallazgo | Gravedad | Recomendación |
|---|---|---|---|
| Estado | Estado local, sin bloqueo | Alta | Pasar a un backend remoto con bloqueo |
| Seguridad | La cuenta de almacenamiento permite el acceso público | Alta | Configurar public_network_access_enabled = false |
| Seguridad de los cambios | Versión del proveedor sin fijar | Media | Fijar con ~> major.minor |

**Hallazgos bloqueantes**: <cantidad>
**Dictamen**: aprobar / solicitar cambios
```

## Puerta de calidad

- [ ] `terraform fmt` y `terraform validate` se superan, y el plan se adjunta a la PR.
- [ ] No hay secretos en el código, las variables ni el estado; los secretos usan Key Vault o Secrets Manager.
- [ ] Las versiones de proveedores y módulos están fijadas; los recursos con estado configuran `prevent_destroy`.
- [ ] `tfsec` o `checkov` no informan de hallazgos, o cada excepción está documentada.
- [ ] Cada recurso tiene las etiquetas `project`, `environment` y `owner`.

## Referencias

- [Guía de estilo de Terraform](https://developer.hashicorp.com/terraform/language/style)
- [Azure Verified Modules](https://azure.github.io/Azure-Verified-Modules/)
- [tfsec](https://aquasecurity.github.io/tfsec/), [checkov](https://www.checkov.io/)
