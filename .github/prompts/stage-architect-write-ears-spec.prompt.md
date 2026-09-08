---
name: "write-ears-spec"
description: "Guía al equipo para registrar requisitos EARS confirmados en spec.md con trazabilidad obligatoria."
argument-hint: "feature=NNN-feature-name rules=01-archaeology/business-rules-catalog.md"
agent: "architect"
tools: ["read", "search", "edit"]
---
# /write-ears-spec

## Objetivo

Transforma solo reglas confirmadas de la etapa 1 en requisitos EARS formales en `specs/<NNN>-<feature>/spec.md`. Las preguntas pendientes siguen siendo preguntas; el prompt no completa requisitos, criterios de aceptación ni arquitectura mediante suposiciones.

## Cuándo invocar

Al inicio de la etapa 2, cuando la pareja 2 haya seleccionado la funcionalidad acotada y completado el traspaso H1, trabajando en la rama `spec/<NNN>-<feature>` creada a partir de `develop`.

> [!NOTE]
> No invoques este prompt para explorar el sistema heredado, catalogar preguntas pendientes (utiliza `/catalog-mysteries`) ni diseñar módulos (utiliza `/design-modular-monolith`). Registra requisitos que ya tienen evidencia confirmada, nada más.

## Precondiciones

- `01-archaeology/business-rules-catalog.md` contiene la evidencia del alcance
- El equipo identificó la carpeta `specs/<NNN>-<feature>/`
- El equipo leyó cada fuente heredada antes de redactar

## Entradas que debe proporcionar el equipo

- `feature=<NNN>-<feature-name>`: la carpeta de `specs/` que recibe `spec.md` (por ejemplo, `feature=001-benefit-calculation`)
- `rules=01-archaeology/business-rules-catalog.md`: el catálogo cuyas filas **Confirmadas** son las únicas candidatas a convertirse en requisitos
- El subconjunto de reglas confirmadas que el equipo acuerda que pertenecen a esta funcionalidad acotada
- Para cualquier capacidad sin equivalente heredado, la justificación `[GREENFIELD]` que respalda el equipo

## Lo que haré

- Confirmar con el equipo qué reglas del catálogo pertenecen a la funcionalidad acotada; registrar lo aplazado en `02-modern-spec/scope-decisions.md`
- Validar la fuente `.NSP`, `.NSN`, `.NSC`, `.NSA`, `.NSL`, `.jcl` o `.ddm` de cada regla confirmada antes de proponer un requisito EARS verificable
- Asignar un REQ-ID único y adjuntar `source_legacy:` con la ruta y, cuando esté disponible, el intervalo de líneas; utilizar `[GREENFIELD]` más la justificación del equipo cuando no exista equivalente heredado
- Registrar criterios Given/When/Then solo para comportamientos respaldados por la evidencia o por una decisión de alcance
- Conservar cada elemento aún no validado de `01-archaeology/mysteries-found.md` en «Preguntas pendientes», con su evidencia, impacto, hipótesis sin confirmar, responsable y estado
- Mantener una matriz de trazabilidad en `spec.md`

## Lo que NO haré

- Crear un requisito sin `source_legacy:` o un `[GREENFIELD]` justificado
- Convertir una hipótesis o pregunta pendiente en un requisito, responderla ni cambiar su estado
- Exigir un número fijo de requisitos, diagramas C4, ADR o puntos de conexión: reduce el alcance si queda poco tiempo en la etapa 2
- Escribir artefactos formales en `02-modern-spec/`: los artefactos de Spec-Kit se encuentran en `specs/<NNN>-<feature>/`
- Inventar hechos de negocio de SIFAP: registro solo lo que muestra la fuente heredada revisada

## Formato de salida

Añade cada requisito a `specs/<NNN>-<feature>/spec.md` con esta estructura (los valores son ilustrativos: utiliza la evidencia confirmada del equipo):

```markdown
### REQ-007 — Título imperativo breve del comportamiento

If <condición no deseada de la regla confirmada>, then el sistema shall <comportamiento requerido>.

- source_legacy: 01-archaeology/legacy-sifap/natural-programs/<PROGRAM>.NSN:Lstart-Lend
- Aceptación (Given/When/Then):
  - Given <precondición respaldada por la evidencia>
  - When <activador>
  - Then <resultado observable y verificable>
```

Mantén una matriz de trazabilidad en el mismo `spec.md`:

| REQ-ID | Patrón EARS | source_legacy | Regla de origen | Archivo de origen |
|---|---|---|---|---|
| REQ-007 | No deseado | `<PROGRAM>.NSN:Lstart-Lend` | Regla 4 | `business-rules-catalog.md` |

## Definición de terminado

- [ ] `specs/<NNN>-<feature>/spec.md` contiene solo los requisitos de la funcionalidad
- [ ] Cada requisito tiene redacción EARS, un criterio verificable y un `source_legacy:` válido o un `[GREENFIELD]` justificado
- [ ] Las preguntas pendientes permanecen fuera de los requisitos, sin cambios de estado
- [ ] La matriz de trazabilidad vincula cada REQ-ID con la evidencia revisada

## Cuerpo del prompt

Eres el `@architect`. El equipo está en la etapa 2 y necesita convertir reglas confirmadas de la etapa 1 en requisitos EARS formales. Transcribes evidencia en requisitos; nunca la inventas.

**Paso 1 — Confirma el alcance de la funcionalidad.**
Abre `01-archaeology/business-rules-catalog.md`. Enumera solo las filas clasificadas como **Confirmadas** que el equipo asigne a la funcionalidad `<NNN>-<feature>`. Para cada regla confirmada que el equipo aplace, regístrala en `02-modern-spec/scope-decisions.md` con un motivo de una línea. No incluyas filas **Inferidas** ni **Misterio**.

**Paso 2 — Valida cada fuente antes de escribir.**
Para cada regla candidata, abre el miembro heredado citado (`.NSP`, `.NSN`, `.NSC`, `.NSA`, `.NSL`, `.jcl` o un DDM `.ddm`) y confirma que el intervalo de líneas contiene realmente la lógica. Si la cita no se resuelve, detente y devuelve la regla al equipo como pregunta pendiente. Nunca cites un archivo `.NSD`: no existe ninguno en este conjunto de fuentes.

**Paso 3 — Escribe el requisito EARS.**
Para cada regla validada, asigna el siguiente `REQ-NNN` secuencial y escribe una frase EARS con el patrón correspondiente:

- Ubicuo — «El sistema shall...»
- Guiado por eventos — «When [evento], el sistema shall...»
- Guiado por estados — «While [estado], el sistema shall...»
- Opcional — «Where [funcionalidad], el sistema shall...»
- No deseado — «If [condición no deseada], then el sistema shall...»

Adjunta `source_legacy:` con la ruta y el intervalo de líneas. Para una capacidad sin equivalente heredado, escribe `[GREENFIELD]` seguido de la justificación proporcionada por el equipo, nunca una inventada por ti.

**Paso 4 — Registra criterios de aceptación.**
Añade criterios Given/When/Then solo para comportamientos respaldados por evidencia o una decisión de alcance registrada. No especifiques aceptación para algo que la fuente no muestre.

**Paso 5 — Traslada las preguntas pendientes sin alterarlas.**
Abre `01-archaeology/mysteries-found.md`. Para cada elemento aún no validado, cópialo en una sección «Preguntas pendientes» de `spec.md`, conservando su evidencia en formato `path:line`, impacto, hipótesis sin confirmar, responsable y estado. No lo respondas, propongas una respuesta ni cambies su estado. Una pregunta nunca es un requisito.

**Paso 6 — Construye la matriz de trazabilidad.**
Mantén una tabla `REQ-ID | Patrón EARS | source_legacy | Regla de origen | Archivo de origen` en `spec.md` con una fila por requisito.

**Paso 7 — Escribe la salida.**
Escribe todo en `specs/<NNN>-<feature>/spec.md`. No coloques `spec.md`, `plan.md` ni `tasks.md` en `02-modern-spec/`. No exijas un número fijo de requisitos; si queda poco tiempo en la etapa 2, reduce el alcance en lugar de rellenar la especificación. Registras evidencia confirmada en formato EARS: nunca rellenas lagunas con suposiciones ni inventas hechos de negocio de SIFAP.

## Ejemplo de invocación

```text
/write-ears-spec feature=001-benefit-calculation rules=01-archaeology/business-rules-catalog.md
```

Espera un `specs/001-benefit-calculation/spec.md` que contenga solo requisitos EARS respaldados por evidencia, cada uno con `source_legacy:`, además de una matriz de trazabilidad; las preguntas pendientes se copian sin alterarlas.
