---
name: "routing-table"
description: "Vincula las tareas de una funcionalidad con el modo de Copilot y el nivel de modelo adecuados, con justificación y nivel de costo, según las fichas de enrutamiento del kit."
argument-hint: "tasks=specs/<NNN>-<feature>/tasks.md"
agent: "tech-lead"
tools: ["read", "search"]
---
# /routing-table

## Objetivo

Produce una tabla de enrutamiento que vincule cada tarea de una funcionalidad con el modo de Copilot y
el nivel de modelo adecuados, con una justificación de una línea y un nivel de costo. Sigue las
orientaciones de enrutamiento del propio kit para que el equipo utilice el modelo y el modo
mínimos suficientes en cada tarea, nunca por prestigio del modelo.

## Cuándo invocar

Al inicio de una funcionalidad, cuando exista `tasks.md` (o una lista de trabajo pendiente), para que el equipo pueda
presupuestar el esfuerzo y elegir el modo y modelo adecuados antes de ejecutar.

## Precondiciones

- Existe `specs/<NNN>-<feature>/tasks.md` o una lista de tareas pendientes
- Las fichas de enrutamiento son la fuente de verdad: [`../../09-cheat-sheets/model-routing.md`](../../09-cheat-sheets/model-routing.md) y [`../../09-cheat-sheets/copilot-3-modes.md`](../../09-cheat-sheets/copilot-3-modes.md)

## Entradas que debe proporcionar el equipo

- La ruta de la lista de tareas (o la lista de trabajo pendiente que se distribuirá)

Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Categorizar cada tarea como descubrimiento, diseño, implementación, refactorización, revisión o mecánica
- Recomendar un modo de Copilot según la ficha de tres modos: Ask (explorar, debatir), Plan (diseño de varios archivos) o Agent (incidencia delegada hasta PR)
- Recomendar un nivel de modelo según la ficha de enrutamiento: Haiku 4.5 (mecánico), Sonnet 4.6 (predeterminado cotidiano) u Opus 4.6 (decisión de arquitectura)
- Dar una justificación de una línea específica para la tarea y un nivel de costo aproximado
- Señalar tareas para las que baste un nivel más económico sin comprometer la calidad

## Lo que NO haré

- Fijar un modelo en el frontmatter de ninguna primitiva: esta tabla orienta la elección manual de la persona en el selector de modelos, nada más (consulta el [índice de prompts](README.md))
- Inventar un modelo de enrutamiento: solo aplico las dos fichas citadas
- Asignar Opus de forma predeterminada a todas las tareas: justifico subir de nivel desde Sonnet
- Dar justificaciones genéricas: cada una referencia el contenido real de la tarea
- Decidir el propio alcance de la tarea: su definición se redirige a `/impl-plan`

## Formato de salida

Una tabla Markdown presentada para revisión. Ejemplo (ilustrativo):

```markdown
## Tabla de enrutamiento — 014-registration

| ID de tarea | Categoría | Modo de Copilot | Nivel de modelo | Justificación | Nivel de costo |
|---------|----------|--------------|------------|-----------|-----------|
| T-01 | Mecánica | Ask | Haiku 4.5 | Generar DDL de migración a partir de un esquema fijo | Bajo |
| T-02 | Implementación | Plan | Sonnet 4.6 | Estructura inicial de módulo en varios archivos con pruebas | Medio |
| T-05 | Diseño | Ask | Opus 4.6 | Elegir el límite del agregado: difícil de revertir | Alto |

Candidatos a un nivel más económico: T-01 (Haiku es suficiente).
```

## Definición de terminado

- [ ] Cada tarea tiene un modo de Copilot, un nivel de modelo y una justificación
- [ ] Se identifica al menos un candidato a un nivel más económico (o se anota «ninguno aplicable»)
- [ ] Los niveles de costo son coherentes: la misma categoría rara vez utiliza niveles distintos
- [ ] Cada justificación referencia el contenido de la tarea, no lenguaje genérico
- [ ] Las recomendaciones coinciden con las dos fichas de enrutamiento, sin niveles inventados

## Cuerpo del prompt

Eres el `@tech-lead`. El equipo quiere asignar su trabajo al modo y
modelo adecuados antes de dedicarle tiempo.

**Paso 1 — Lee las tareas.**
Abre `tasks.md` (o la lista de trabajo pendiente). Para cada tarea, anota a qué afecta y lo
ambigua o arriesgada que es.

**Paso 2 — Categoriza.**
Etiqueta cada tarea como descubrimiento, diseño, implementación, refactorización, revisión o mecánica
según su contenido.

**Paso 3 — Asigna un modo de Copilot.**
Utilizando la ficha de tres modos, elige Ask para exploración y debate, Plan para
cambios de varios archivos que necesitan un alcance revisado y Agent para una incidencia bien descrita
que pueda llegar a una PR sin supervisión.

**Paso 4 — Asigna un nivel de modelo.**
Utilizando la ficha de enrutamiento de modelos, elige Haiku 4.5 para generación mecánica, Sonnet 4.6
como predeterminado cotidiano para código y revisión, y Opus 4.6 solo para una decisión
arquitectónica, un compromiso técnico o un análisis de impacto. Subir de nivel desde Sonnet necesita un motivo.

**Paso 5 — Añade justificación y costo.**
Da a cada tarea una justificación de una línea vinculada a su contenido real y un nivel
de costo aproximado (bajo, medio, alto). Señala cualquier tarea para la que un nivel más económico no reduzca
la calidad.

Nunca fijes un modelo en una primitiva: esta tabla solo asesora a la persona en el
selector de modelos. No inventes niveles ni modos más allá de las dos fichas citadas.

## Ejemplo de invocación

```
/routing-table tasks=specs/014-registration/tasks.md
```
