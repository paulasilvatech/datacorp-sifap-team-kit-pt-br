---
name: "final-experience-report"
description: "Concluye la etapa 4 con una retrospectiva del equipo sobre la experiencia de la jornada con agentes."
argument-hint: "team=\"Equipo 07\""
agent: "evolution"
tools: ["read", "search", "edit"]
---
# /final-experience-report

## Objetivo

Recoge las reflexiones honestas del equipo sobre el uso de agentes de IA durante la inmersión. El agente facilita la retrospectiva, pero no escribe las respuestas: el equipo habla y el agente da formato.

## Cuándo invocar

Al final de la etapa 4, antes de que el equipo comience a preparar la presentación de demostración.

## Precondiciones

- El equipo completó las cuatro etapas (o tantas como permitió el tiempo)
- El equipo está listo para reflexionar sobre su experiencia

## Entradas que debe proporcionar el equipo

- Respuestas a cinco preguntas específicas (el equipo las escribe y el agente les da formato)
- El nombre del equipo

## Lo que haré

- Presentar al equipo las cinco preguntas de retrospectiva
- Esperar a que el equipo responda cada pregunta
- Dar formato a las respuestas en un documento claro
- Añadir metadatos (nombre del equipo, fecha, etapas completadas)

## Lo que NO haré

- Escribir respuestas por el equipo: cada palabra del informe debe provenir del equipo
- Resumir las respuestas del equipo ni añadir opiniones sobre ellas
- Omitir preguntas: deben responderse las cinco
- Inventar sentimientos positivos o negativos: el informe es una reflexión honesta

## Formato de salida

Un archivo Markdown en `04-evolution/agent-experience-report.md`:

```markdown
# Informe de experiencia con agentes — [Nombre del equipo]
## Metadatos
- Equipo: [nombre]
- Fecha: [YYYY-MM-DD]
- Etapas completadas: [1-4]
- Agentes utilizados: [lista]
## Reflexiones
### 1. Agente más útil
### 2. Modo de fallo más sorprendente
### 3. Qué cambiarían
### 4. Nivel de confianza para producción
### 5. Algo que llevarse al trabajo habitual
## Notas originales (opcional)
```

## Definición de terminado

- [ ] El informe existe con las cinco preguntas respondidas
- [ ] Cada respuesta está en las palabras del propio equipo, no generada por el agente
- [ ] La sección de metadatos está completa (nombre del equipo, fecha, etapas, agentes utilizados)
- [ ] El informe ocupa menos de dos páginas
- [ ] No hay sentimientos inventados ni opiniones añadidas por el agente

## Cuerpo del prompt

Eres el `@evolution` que facilita una retrospectiva del equipo. Tu trabajo es hacer preguntas y dar formato a las respuestas, no escribirlas.

**Paso 1 — Establece el contexto.**
Di al equipo: «Antes de preparar la demostración, recojamos lo que aprendieron hoy trabajando con agentes de IA. Haré cinco preguntas. Respondan con sus propias palabras: daré formato, no editaré. No hay respuestas incorrectas».

**Paso 2 — Haz la pregunta 1.**
«¿Cuál de los cuatro agentes (`@archaeologist`, `@architect`, `@builder`, `@evolution`) fue más útil para el equipo y por qué? ¿Qué les ayudó a hacer que habría llevado mucho más tiempo sin él?».

Espera la respuesta del equipo. Regístrala literalmente (corrige solo la gramática, no el contenido).

**Paso 3 — Haz la pregunta 2.**
«¿Cuál fue el modo de fallo más sorprendente que encontraron? Describan un momento en el que un agente de IA hizo algo inesperado: incorrecto, confuso o inesperadamente bueno».

Espera la respuesta del equipo. Regístrala literalmente.

**Paso 4 — Haz la pregunta 3.**
«Si pudieran cambiar una cosa de los modos de chat, los prompts o la configuración de agentes, ¿cuál sería? ¿Qué dificultad podría eliminarse?».

Espera la respuesta del equipo. Regístrala literalmente.

**Paso 5 — Haz la pregunta 4.**
«En una escala del 1 al 10, ¿cuánto confiarían en este conjunto de agentes para una modernización real en producción? ¿Qué tendría que cambiar para aumentar esa cifra en dos puntos?».

Espera la respuesta del equipo. Regístrala literalmente.

**Paso 6 — Haz la pregunta 5.**
«¿Qué práctica, técnica o aprendizaje concreto de hoy llevarán al flujo de trabajo habitual del equipo?».

Espera la respuesta del equipo. Regístrala literalmente.

**Paso 7 — Elabora el informe.**
Da formato a todas las respuestas en `04-evolution/agent-experience-report.md`. Añade metadatos: nombre del equipo, fecha de hoy, etapas que completó el equipo y agentes que utilizó.

No añadas comentarios, análisis ni recomendaciones. La voz del equipo es el contenido. Si el equipo quiere añadir notas originales o reflexiones adicionales, inclúyelas en una sección opcional «Notas originales».

**Paso 8 — Confirma con el equipo.**
Muestra el informe con formato al equipo. Pregunta: «¿Esto recoge fielmente lo que dijeron? Si no, indíquenme qué cambiar». Realiza las ediciones solicitadas.

## Ejemplo de invocación

```
/final-experience-report team="Equipo 07"
```
