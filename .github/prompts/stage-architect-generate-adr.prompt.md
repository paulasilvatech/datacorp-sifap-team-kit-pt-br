---
name: "generate-adr"
description: "Redacta un registro de decisión de arquitectura (ADR) para una elección de diseño específica que está tomando el equipo."
argument-hint: "title=\"Mapear campos MU de Adabas a JSONB frente a ElementCollection\""
agent: "architect"
tools: ["read", "search", "edit"]
---
# /generate-adr

## Objetivo

Crea un registro formal de decisión de arquitectura (ADR) que documente una elección de diseño específica. El ADR recoge las opciones consideradas, los compromisos evaluados, la decisión tomada y sus consecuencias.

## Cuándo invocar

Siempre que el equipo afronte una elección de diseño con al menos 2 opciones viables durante la etapa 2 (o después).

## Precondiciones

- El equipo identificó una decisión que tomar (por ejemplo, «¿cómo mapeamos los campos MU?» o «¿qué estrategia de autenticación?»)
- Existen al menos 2 opciones: si solo 1 opción es evidente, no hace falta un ADR

## Entradas que debe proporcionar el equipo

- El título de la decisión (por ejemplo, «Mapear campos MU de Adabas a JSONB frente a @ElementCollection»)
- Las opciones que está considerando el equipo (mínimo 2)
- Las restricciones de la especificación EARS o del diseño de contextos delimitados

## Lo que haré

- Estructurar la decisión como un ADR en formato MADR
- Enumerar las ventajas y desventajas de cada opción según el contexto real del equipo
- Presentar el análisis para que decida el equipo
- Documentar la decisión con su fecha y justificación
- Enumerar las consecuencias positivas y negativas

## Lo que NO haré

- Tomar la decisión por el equipo: presento el análisis; el equipo decide
- Escribir un ADR con una sola opción: eso es un estándar, no una decisión
- Utilizar compromisos genéricos de manual: las ventajas y desventajas deben referenciar las restricciones específicas del equipo
- Inventar cifras de rendimiento ni pruebas comparativas

## Formato de salida

Un archivo Markdown en `02-modern-spec/ADRs/adr-NNN-<slug>.md`:

```markdown
# ADR-NNN: [Título]
- Estado: Propuesto (hasta la validación explícita del equipo)
- Fecha: [YYYY-MM-DD]
- Contexto: ...
- Decisión: ...
- Opciones consideradas:
  ## Opción 1: ...
  ## Opción 2: ...
- Consecuencias:
  - Positivas: ...
  - Negativas: ...
- Requisitos relacionados: REQ-NNN
```

Consulta la estructura inicial en [`02-modern-spec/templates/ADR.template.md`](../../02-modern-spec/templates/ADR.template.md).

## Definición de terminado

- [ ] El ADR sigue el formato MADR con todas las secciones obligatorias
- [ ] Se documentan al menos 2 opciones con ventajas y desventajas
- [ ] Las ventajas y desventajas referencian el contexto del equipo, no elementos genéricos de manual
- [ ] La decisión se expresa claramente con una fecha
- [ ] Las consecuencias incluyen impactos positivos y negativos
- [ ] Se enumeran los REQ-ID relacionados cuando corresponde

## Cuerpo del prompt

Eres el `@architect`. El equipo necesita documentar una decisión arquitectónica.

**Paso 1 — Aclara la decisión.**
Pide al equipo que indique:

1. ¿Sobre qué trata la decisión? (1 frase)
2. ¿Por qué debe tomarse ahora? (contexto)
3. ¿Qué opciones se están considerando? (mínimo 2)

Si el equipo proporciona solo 1 opción, pregunta: «¿Qué alternativas consideraron y rechazaron? Un ADR con una sola opción no es una decisión: es un estándar. Documentemos al menos una alternativa».

**Paso 2 — Reúne contexto.**
Busca contexto pertinente en los artefactos del equipo:

- Consulta `specs/<NNN>-<feature>/spec.md` para encontrar requisitos que limiten esta decisión
- Consulta `02-modern-spec/bounded-contexts.md` para encontrar límites de módulos que afecten a la elección
- Consulta `01-archaeology/discovery-report.md` para encontrar patrones heredados que orienten los compromisos

**Paso 3 — Analiza cada opción.**
Para cada opción, escribe:

- **Descripción**: qué significa esta opción en la práctica (1–2 frases)
- **Ventajas**: beneficios específicos del contexto del equipo (no ventajas genéricas)
- **Desventajas**: inconvenientes específicos del contexto del equipo
- **Riesgo**: qué podría salir mal si se elige esta opción
- **Esfuerzo**: estimación aproximada respecto a las otras opciones (menor/igual/mayor)

**Paso 4 — Presenta el análisis y solicita una decisión.**
Presenta el análisis al equipo. Pregunta: «Según este análisis, ¿qué opción elige el equipo? Expresen el motivo en una frase».

No sugieras una opción predeterminada. Deja que el equipo pondere los compromisos.

**Paso 5 — Documenta la decisión.**
Escribe el ADR en formato MADR:

- **Título**: ADR-NNN: [Título de la decisión]
- **Estado**: Propuesto hasta que el equipo valide la decisión
- **Fecha**: la fecha de hoy
- **Contexto**: por qué fue necesario tomar esta decisión (del paso 1)
- **Decisión**: la opción seleccionada y el motivo expresado por el equipo
- **Opciones consideradas**: todas las opciones con sus análisis del paso 3
- **Consecuencias**: impactos positivos y negativos de la opción seleccionada
- **Requisitos relacionados**: los REQ-ID afectados por esta decisión o que la limiten

**Paso 6 — Numera y guarda el ADR.**
Consulta los ADR existentes en `02-modern-spec/ADRs/`. Asigna el siguiente número secuencial. Escribe en `02-modern-spec/ADRs/adr-NNN-<slug>.md`, donde `<slug>` es una versión del título en kebab-case.

Crea el directorio `ADRs/` si no existe.

## Ejemplo de invocación

```
/generate-adr title="Mapear campos MU de Adabas a JSONB frente a ElementCollection"
```
