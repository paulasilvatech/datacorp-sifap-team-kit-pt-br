---
name: "gen-specs-as-issues"
description: "Identifica lagunas entre el comportamiento heredado de SIFAP y la especificación moderna, priorízalas y abre incidencias de GitHub respaldadas por EARS con trazabilidad al sistema heredado."
argument-hint: "area=<focus-area> repo=<owner/name>"
agent: "requirements-engineer"
tools: ["read", "search", "edit", "execute"]
---
# /gen-specs-as-issues

## Objetivo

Encuentra comportamientos ausentes o insuficientemente especificados para la modernización de SIFAP 2.0, priorízalos y convierte los elementos principales en incidencias detalladas de GitHub. Cada incidencia es una especificación EARS con un REQ-ID único y una línea obligatoria `source_legacy:`, para que cada requisito mantenga su trazabilidad desde el código heredado Natural/Adabas hasta el sistema moderno.

> [!IMPORTANT]
> El trabajo de CI `legacy-traceability` rechaza cualquier requisito sin una línea `source_legacy:`. Cada incidencia que abre este comando debe citar un artefacto heredado o justificarse como `[GREENFIELD]`.

## Cuándo invocar

Durante la etapa 2 (especificación) o la etapa 4 (evolución), cuando el equipo necesita convertir las lagunas observadas en una lista priorizada de especificaciones con seguimiento.

## Precondiciones

- La pareja ha leído los programas heredados pertinentes: la PUERTA OBLIGATORIA de [`LEGACY-EXPLORATION-CHECKLIST.md`](../../01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md)
- La especificación moderna en `02-modern-spec/` (y cualquier `specs/`) está disponible para compararla
- El equipo está autenticado en el repositorio de GitHub de destino

## Entradas que debe proporcionar el equipo

- `area`: el área de enfoque o contexto delimitado que se analizará (por ejemplo, fiscalización de pagos)
- `repo`: el `owner/name` del repositorio de GitHub para las incidencias
- Los programas heredados pertinentes para el área, en `01-archaeology/legacy-sifap/`
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Comparar el comportamiento heredado del área de enfoque con la especificación moderna y enumerar las lagunas
- Puntuar cada laguna por impacto y riesgo y seleccionar los elementos prioritarios que se registrarán
- Escribir cada incidencia como requisito EARS siguiendo [`requirements.instructions.md`](../instructions/requirements.instructions.md)
- Asignar un REQ-ID único y una línea `source_legacy:` y después abrir las incidencias mediante la CLI `gh`

## Lo que NO haré

- Escribir un requisito sin una línea `source_legacy:` (o una justificación explícita `[GREENFIELD]`)
- Inventar comportamiento ausente tanto del sistema heredado como de la especificación moderna
- Abrir incidencias antes de que el equipo confirme la lista priorizada
- Asignar una rama `spec/` a trabajo de implementación: estas son incidencias de especificación de la etapa 2 en `spec/<NNN>-<feature>`

## Formato de salida

```markdown
### Análisis de lagunas — <area>
Lagunas encontradas: 6 · Seleccionadas para registrar: 3

### Incidencias que crear
- [SPEC][REQ-014] When un pago supera el límite diario, el sistema shall marcarlo para revisión
  source_legacy: 01-archaeology/legacy-sifap/natural-programs/SIFAP-P.NSP
  branch: spec/014-daily-limit-review
```

## Definición de terminado

- [ ] Cada laguna seleccionada está escrita en notación EARS con un REQ-ID único
- [ ] Cada incidencia incluye una línea `source_legacy:` (o una justificación `[GREENFIELD]`)
- [ ] Cada incidencia identifica una rama `spec/<NNN>-<feature>`
- [ ] Las incidencias se crean mediante `gh` solo después de que el equipo confirme la lista

## Cuerpo del prompt

Produces una lista priorizada y trazable de especificaciones pendientes. Las reglas de notación EARS y REQ-ID se encuentran en [`requirements.instructions.md`](../instructions/requirements.instructions.md); utiliza la habilidad [`ears-validate`](../skills/ears-validate/SKILL.md) para comprobar cada enunciado antes de registrarlo.

**Paso 1 — Establece la base de referencia.**
Lee los programas heredados de `area` en `01-archaeology/legacy-sifap/` y la especificación moderna en `02-modern-spec/`. Confirma que se cumple la puerta de lectura de la [lista de verificación](../../01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md).

**Paso 2 — Encuentra y puntúa las lagunas.**
Enumera el comportamiento presente en el sistema heredado, pero ausente o ambiguo en la especificación moderna. Puntúa por impacto y riesgo; selecciona los elementos prioritarios.

**Paso 3 — Escribe requisitos EARS.**
Para cada laguna seleccionada, escribe un enunciado EARS, asigna el siguiente REQ-ID y añade la línea `source_legacy:` que apunta al artefacto heredado. Valida con [`ears-validate`](../skills/ears-validate/SKILL.md).

**Paso 4 — Confirma y después registra.**
Presenta la lista con las ramas `spec/<NNN>-<feature>` propuestas. Tras la aprobación, abre las incidencias con `gh`.

## Ejemplo de invocación

```
/gen-specs-as-issues area="fiscalización de pagos" repo=my-org/sifap-2
```
