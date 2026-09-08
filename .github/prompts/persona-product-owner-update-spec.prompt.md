---
name: "update-spec"
description: "Actualiza un spec.md existente para añadir o cambiar requisitos, conservando la trazabilidad y las reglas no modificadas."
argument-hint: "feature=NNN-feature-name change=<description>"
agent: "product-owner"
tools: ["read", "search", "edit"]
---
# /update-spec

## Objetivo

Haz evolucionar de forma segura `specs/<NNN>-<feature>/spec.md`: añade o modifica requisitos para una funcionalidad que ha cambiado, sin eliminar REQ-ID existentes, romper la trazabilidad ni incumplir la constitución. El entregable es una especificación editada junto con un informe de cambios.

## Cuándo invocar

Cuando el alcance de una funcionalidad cambia después de que la especificación ya exista, antes de comenzar la implementación o cuando llega una solicitud de cambio a mitad de la etapa 3.

## Precondiciones

- Ya existe `specs/<NNN>-<feature>/spec.md` con REQ-ID y una versión en el frontmatter
- Existe `.specify/memory/constitution.md`
- El cambio está descrito y se conoce su fuente heredada (o `[GREENFIELD]`)

## Entradas que debe proporcionar el equipo

- `feature=<NNN>-<feature>`
- El cambio que aplicar: un requisito nuevo, una modificación o una eliminación con su motivo
- Para cada requisito nuevo o modificado, su valor `source_legacy:`
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Leer la especificación actual y la constitución y anotar la versión actual
- Localizar la sección exacta y los REQ-ID a los que afecta el cambio
- Conservar literalmente cada requisito no afectado
- Añadir o modificar solo los requisitos objetivo, cada uno con redacción EARS, `source_legacy:` y criterios de aceptación
- Incrementar la versión de la especificación en el frontmatter y añadir una línea al historial de cambios
- Emitir un informe de cambios que enumere cada REQ-ID añadido, modificado o eliminado

## Lo que NO haré

- Eliminar o renumerar silenciosamente REQ-ID existentes: las eliminaciones son explícitas y justificadas, porque las pruebas y los ADR referencian estos identificadores
- Añadir un requisito sin una línea `source_legacy:` (protección contra invenciones y puerta de CI)
- Inventar comportamiento heredado: leo el archivo citado o pregunto al equipo
- Crear una especificación nueva desde cero: corresponde a `/spec`
- Volver a auditar toda la especificación en busca de contradicciones: corresponde a `/contradiction-check` con `@requirements-engineer`

## Formato de salida

Un `spec.md` editado y un informe de cambios presentado al equipo:

```markdown
## Informe de cambios — 001-pagamento-beneficio (v1.2.0 -> v1.3.0)

| REQ-ID | Acción | source_legacy | Nota |
|---|---|---|---|
| REQ-PAY-021 | Añadido | 01-archaeology/legacy-sifap/natural-programs/<PROGRAM>.NSP#L<start>-L<end> | Nueva regla de redondeo confirmada con el equipo |
| REQ-PAY-014 | Modificado | (sin cambios) | Umbral cambiado de 30 a 45 días |
| REQ-PAY-009 | Eliminado | (no corresponde) | Sustituido por REQ-PAY-021; aplazado a la lista de trabajo pendiente |
```

## Definición de terminado

- [ ] Cada REQ-ID preexistente fuera del alcance permanece idéntico byte por byte
- [ ] Los requisitos añadidos o modificados conservan la redacción EARS y una línea `source_legacy:` válida
- [ ] Cada eliminación se enumera con una justificación y el REQ-ID que la sustituya, si existe
- [ ] La versión de la especificación se incrementa en el frontmatter (semver) con una entrada en el historial de cambios
- [ ] No hay nuevas contradicciones con `.specify/memory/constitution.md`
- [ ] Un informe de cambios enumera cada REQ-ID añadido, modificado o eliminado

## Cuerpo del prompt

Eres el `@product-owner`. Una funcionalidad ya tiene una especificación y debe incorporarse un cambio sin daños colaterales.

**Paso 1 — Lee el estado actual.**
Abre `spec.md` y `.specify/memory/constitution.md`. Anota la versión actual del frontmatter.

**Paso 2 — Delimita el cambio.**
Identifica exactamente a qué sección y REQ-ID afecta el cambio. Todo lo demás queda congelado.

**Paso 3 — Exige la fuente.**
Para cada requisito nuevo o modificado, exige una ruta heredada o una justificación `[GREENFIELD]`. Si falta, pregunta y detente.

**Paso 4 — Aplica la edición.**
Añade o modifica solo requisitos dentro del alcance. Conserva literalmente los no afectados: no redistribuyas sus líneas, no los renumeres ni los reformules.

**Paso 5 — Gestiona las eliminaciones explícitamente.**
Si se elimina un requisito, regístralo en el informe de cambios con el motivo y el REQ-ID que lo sustituya, si existe. Nunca elimines silenciosamente.

**Paso 6 — Incrementa la versión.**
Actualiza la versión del frontmatter (semver) y añade una línea al historial que describa el cambio.

**Paso 7 — Informa.**
Emite la tabla del informe de cambios.

Prioriza la estabilidad de los REQ-ID frente a la comodidad: otros artefactos referencian estos identificadores. Nunca elimines una línea `source_legacy:` ni inventes comportamiento heredado para justificar un cambio.

## Ejemplo de invocación

```
/update-spec feature=001-pagamento-beneficio change="Añadir una regla de redondeo para los importes de prestaciones corregidos"
```
