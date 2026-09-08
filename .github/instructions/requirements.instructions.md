---
description: "Utiliza al escribir o revisar requisitos, especificaciones EARS, criterios de aceptación, trazabilidad y requisitos fundamentados en documentación."
applyTo: "docs/**/*.md,specs/**/*.md,02-modern-spec/**/*.md"
---

# Convenciones de requisitos — EARS y trazabilidad al sistema heredado

Este archivo se activa al escribir o revisar Markdown en `docs/`, `specs/` o `02-modern-spec/`. Enseña a redactar requisitos en notación EARS, asignar REQ-ID y añadir la línea obligatoria `source_legacy:` que exige la CI. Enseña la *forma* de un buen requisito; no decide *qué* exigir, pues eso proviene de la lectura del conjunto de fuentes heredadas que realiza el propio equipo.

> [!IMPORTANT]
> Antes de escribir requisitos EARS, la pareja DEBE haber leído los programas Natural que tiene asignados (puerta obligatoria; consulta [`LEGACY-EXPLORATION-CHECKLIST.md`](../../01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md) y [`natural-adabas.instructions.md`](natural-adabas.instructions.md)).

## Patrones EARS

Cada requisito formal utiliza una plantilla EARS y la palabra clave `SHALL` para el comportamiento obligatorio (`SHOULD` para recomendaciones).

| Patrón | Plantilla |
|---|---|
| Ubicuo | `El <sistema> SHALL <respuesta>.` |
| Guiado por eventos | `WHEN <activador>, el <sistema> SHALL <respuesta>.` |
| Guiado por estados | `WHILE <estado>, el <sistema> SHALL <respuesta>.` |
| Comportamiento no deseado | `IF <condición>, THEN el <sistema> SHALL <respuesta>.` |
| Funcionalidad opcional | `WHERE <la funcionalidad está presente>, el <sistema> SHALL <respuesta>.` |

La habilidad [`ears-validate`](../skills/ears-validate/SKILL.md) define la lista de verificación de calidad para estos enunciados.

## Anatomía de un requisito

```markdown
### REQ-021 — Rechazar el registro de recursos duplicados

WHEN se envía un recurso con un identificador que ya existe,
el sistema SHALL rechazar la solicitud y devolver HTTP 409.

- source_legacy: 01-archaeology/legacy-sifap/natural-programs/<PROGRAM>.NSP#L40-L88
- acceptance: Given un recurso existente, When se envía el mismo identificador,
  Then la respuesta es 409 y no se crea ningún registro nuevo.
```

## Formato de REQ-ID

Los identificadores son únicos y tienen la forma `REQ-NNN` (`REQ-021`) o `REQ-AREA-NNN` (`REQ-PAY-014`, `REQ-AUD-CORE-002`). La puerta de trazabilidad reconoce una declaración solo cuando el identificador es un encabezado (`### REQ-021 — …`) o aparece al principio de un elemento en negrita o de una lista (`- **REQ-021**:`, `REQ-021 - …`, `REQ-021:`). Las menciones aisladas en otras partes de la prosa cuentan como referencias, no como declaraciones.

## Línea obligatoria `source_legacy`

El trabajo `legacy-traceability` de [`spec-quality.yml`](../workflows/spec-quality.yml) **hace fallar la compilación** si algún REQ-ID declarado en `specs/` carece de una línea `source_legacy:` válida dentro de las 20 líneas siguientes a su declaración. Un valor es válido cuando es uno de los siguientes:

- Una ruta en `01-archaeology/legacy-sifap/natural-programs/` con extensión `.NSP`, `.NSN`, `.NSS`, `.NSA`, `.NSL`, `.NSC`, `.NSM` o `.jcl`.
- Una ruta en `01-archaeology/legacy-sifap/adabas-ddms/` con extensión `.NSD`, `.ddm` o `.txt`.
- `[GREENFIELD] <justificación en una línea>` (la justificación no debe estar vacía).

La ruta puede ir seguida de un ancla de línea opcional `#L<start>` o `#L<start>-L<end>` y el archivo **debe existir realmente en el disco**: la puerta lo lee. Las comillas son opcionales, pero deben estar equilibradas.

```markdown
- source_legacy: 01-archaeology/legacy-sifap/adabas-ddms/<DDM>.ddm#L12-L30
- source_legacy: "[GREENFIELD] no existe un registro de auditoría heredado; necesario para el cumplimiento normativo"
```

> [!WARNING]
> Un `source_legacy:` que apunta a un archivo inexistente, a un directorio incorrecto o a una extensión no enumerada hace fallar la puerta exactamente igual que una línea ausente.

## Criterios de aceptación

Escribe los criterios de aceptación en formato Given/When/Then, uno por comportamiento, cada uno verificable y vinculado a su REQ-ID. Numéralos secuencialmente dentro de la funcionalidad.

```markdown
- AC-021.1: Given un identificador único, When se envía, Then la respuesta es 201.
- AC-021.2: Given un identificador duplicado, When se envía, Then la respuesta es 409.
```

## Trazabilidad de pruebas

El trabajo no bloqueante `spec-traceability` informa de los REQ-ID que aún no referencia ninguna prueba. Cita el REQ-ID en un comentario de prueba para mantener vinculadas la implementación y la especificación (consulta [`tests.instructions.md`](tests.instructions.md)).

```java
// REQ-021: un identificador duplicado devuelve 409
@Test
void should_return_409_when_identifier_already_exists() { /* ... */ }
```

## Convenciones

| Regla | Justificación |
|---|---|
| Una plantilla EARS por requisito | Redacción inequívoca y verificable |
| `SHALL` = obligatorio, `SHOULD` = recomendado | Lenguaje de obligación coherente |
| Identificadores únicos `REQ-NNN` / `REQ-AREA-NNN` | Anclas estables para pruebas y trazabilidad |
| `source_legacy:` dentro de las 20 líneas siguientes al identificador | Supera la puerta bloqueante de trazabilidad heredada |
| Criterios de aceptación Given/When/Then | Convertibles directamente en pruebas |

## Qué hacer / Qué no hacer

| Qué hacer | Qué no hacer |
|---|---|
| Citar un archivo heredado real (o `[GREENFIELD]`) | Inventar una ruta u omitir `source_legacy:` |
| Referenciar la fuente mediante un intervalo de líneas `#L` | Afirmar de memoria qué hace el programa heredado |
| Mantener identificadores únicos declarados como encabezados o elementos de lista | Reutilizar un identificador o esconderlo en medio de una frase |
| Escribir criterios de aceptación como Given/When/Then | Dejar un requisito sin una comprobación verificable |

## Lista de verificación antes de abrir una PR

- [ ] Cada requisito utiliza una plantilla EARS con `SHALL`/`SHOULD`
- [ ] Cada REQ-ID es único y está declarado como encabezado o elemento de lista o en negrita
- [ ] Cada REQ-ID tiene una línea `source_legacy:` dentro de las 20 líneas siguientes, que apunta a un archivo real o a `[GREENFIELD]`
- [ ] Las rutas heredadas utilizan los directorios y extensiones permitidos, con intervalos `#L` opcionales
- [ ] Los criterios de aceptación siguen Given/When/Then y se vinculan al REQ-ID
- [ ] La pareja leyó los programas heredados citados antes de escribir los requisitos
