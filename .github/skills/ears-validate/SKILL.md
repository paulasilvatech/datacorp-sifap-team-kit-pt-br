---
name: "ears-validate"
description: "Úsala para validar requisitos según los patrones de la notación EARS. Los desencadenantes incluyen \"EARS\", \"revisión de requisitos\", \"calidad de los requisitos\", \"enunciado con debe\" y \"REQ-ID\"."
---
# Validación EARS

## Cuándo invocar

- "Revisa si estos requisitos cumplen la notación EARS."
- "¿Se puede comprobar este requisito mediante pruebas?"
- "Clasifica este requisito por patrón EARS."

## Patrones EARS

| Patrón | Plantilla |
|---|---|
| Ubicuo | `El <sistema> debe <respuesta>.` |
| Orientado a eventos | `Cuando <desencadenante>, el <sistema> debe <respuesta>.` |
| Orientado a estados | `Mientras <estado>, el <sistema> debe <respuesta>.` |
| Opcional | `Donde <se incluya la funcionalidad>, el <sistema> debe <respuesta>.` |
| No deseado | `Si <condición no deseada>, entonces el <sistema> debe <mitigación>.` |
| Complejo | `Mientras <estado>, cuando <desencadenante>, el <sistema> debe <respuesta>.` |

## Lista de verificación de la validación

- [ ] Exactamente un patrón por requisito.
- [ ] Sujeto inequívoco ("el sistema", no "este").
- [ ] Respuesta observable y comprobable.
- [ ] Ninguna "y" oculta que combine dos requisitos en uno.
- [ ] Ningún detalle de implementación ("usar Redis"), solo comportamiento.
- [ ] Incluye un REQ-ID con el formato `REQ-NNN`.
- [ ] Incluye al menos un criterio de aceptación.
- [ ] **Incluye un `source_legacy:` no vacío que apunte a `01-archaeology/legacy-sifap/natural-programs/*.NSN`, `01-archaeology/legacy-sifap/adabas-ddms/*.ddm` o `[GREENFIELD] + justificación`.**

## Defectos habituales

| Defecto | Ejemplo | Corrección |
|---|---|---|
| Ambiguo | "El sistema debe ser rápido." | "Cuando una persona envíe un formulario, el sistema debe responder en un plazo de 500ms." |
| Compuesto | "Iniciar sesión y enviar un correo electrónico." | Dividirlo en dos requisitos. |
| No comprobable | "El sistema debe ser fácil de usar." | Sustituirlo por una métrica de UX medible. |
| Pasivo | "Se debe admitir el inicio de sesión." | "El sistema debe aceptar la autenticación mediante usuario y contraseña." |

## Plantilla de salida

```markdown
### REQ-NNN (<patrón>)
<Enunciado EARS>

source_legacy: 01-archaeology/legacy-sifap/natural-programs/<FILE>.NSN#L<start>-L<end>
_(o `[GREENFIELD] <justificación>` cuando no exista un equivalente legado)_

**Criterios de aceptación**
- <criterio 1>
- <criterio 2>

**Trazado desde**: US-NNN, ADR-NNN
**Prioridad**: P0 / P1 / P2
**Estado**: propuesto / aprobado / implementado / verificado
```

## Puerta de calidad

- [ ] Cada requisito tiene un REQ-ID único con el formato `REQ-NNN`.
- [ ] Cada requisito se clasifica bajo exactamente un patrón EARS.
- [ ] Cada requisito tiene al menos un criterio de aceptación comprobable.
- [ ] Cada requisito tiene una línea `source_legacy:` que apunta a un archivo legado real o a `[GREENFIELD] <justificación>`.
- [ ] El job `legacy-traceability` de `.github/workflows/spec-quality.yml` se supera para la PR.
