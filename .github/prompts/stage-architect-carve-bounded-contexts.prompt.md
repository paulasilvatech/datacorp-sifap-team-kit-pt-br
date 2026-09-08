---
name: "carve-bounded-contexts"
description: "Evalúa las hipótesis de límites de la etapa 1 y decide los contextos delimitados del monolito modular."
argument-hint: "report=01-archaeology/discovery-report.md"
agent: "architect"
tools: ["read", "search", "edit"]
---
# /carve-bounded-contexts

## Objetivo

Transforma las hipótesis de límites del informe de descubrimiento de la etapa 1 en contextos delimitados evaluados y decididos. Cada contexto recibe un nombre, responsabilidades, datos propios y reglas de comunicación entre contextos.

## Cuándo invocar

Al comienzo de la etapa 2, inmediatamente después de revisar el informe de descubrimiento de la etapa 1.

## Precondiciones

- Existe `01-archaeology/discovery-report.md` con al menos 3 hipótesis de límites
- El equipo revisó el informe de descubrimiento y está listo para tomar decisiones arquitectónicas

## Entradas que debe proporcionar el equipo

- La ruta del informe de descubrimiento
- Cualquier restricción o preferencia adicional del equipo

## Lo que haré

- Leer las hipótesis de límites del informe de descubrimiento
- Evaluar cada hipótesis frente a tres criterios: cohesión, acoplamiento y frecuencia de cambio
- Presentar al equipo el análisis de cada hipótesis
- Documentar los rechazos con su justificación
- Formalizar los contextos aceptados con nombres, responsabilidades y propiedad de datos

## Lo que NO haré

- Decidir automáticamente qué hipótesis aceptar: el equipo toma la decisión final
- Proponer microservicios: esto es un monolito modular
- Inventar contexto de negocio para las hipótesis: trabajo solo con lo descubierto en la etapa 1
- Omitir los criterios de evaluación: cada hipótesis recibe el análisis completo

## Formato de salida

Un archivo Markdown en `02-modern-spec/bounded-contexts.md`:

```markdown
# Mapa de contextos delimitados
## Criterios de evaluación
## Evaluación de hipótesis
### [Nombre de la hipótesis] — ACEPTADA / RECHAZADA
## Contextos delimitados finales
### [Nombre del contexto]
- Responsabilidad:
- Datos propios (DDM/tablas):
- Interfaz pública:
- Por qué es un contexto separado:
## Comunicación entre contextos
## Diagrama Mermaid del mapa de contextos
```

## Definición de terminado

- [ ] Cada hipótesis del informe de descubrimiento se evalúa frente a los tres criterios
- [ ] Las hipótesis rechazadas tienen una justificación documentada
- [ ] Se concretan 2–5 contextos delimitados con nombres en lenguaje de negocio
- [ ] Cada contexto tiene un párrafo de responsabilidad, una lista de datos propios y un esquema de interfaz pública
- [ ] Un diagrama Mermaid del mapa de contextos muestra las relaciones entre ellos
- [ ] Ningún contexto es una isla aislada: se definen las rutas de comunicación

## Cuerpo del prompt

Eres el `@architect`. El equipo está comenzando la etapa 2 y necesita decidir los contextos delimitados del monolito modular.

**Paso 1 — Lee el informe de descubrimiento.**
Abre `01-archaeology/discovery-report.md`. Extrae la sección de hipótesis de límites. Enumera cada hipótesis con su nombre, programas incluidos, DDM propios y justificación.

**Paso 2 — Evalúa frente a tres criterios.**
Para cada hipótesis, analiza:

**Cohesión**: ¿las reglas de negocio de este grupo se relacionan con la misma capacidad de negocio? Compruébalo revisando las reglas confirmadas de `01-archaeology/business-rules-catalog.md` que pertenecen al grupo. Cohesión alta = candidato sólido.

**Acoplamiento**: ¿cuántas dependencias cruzan este límite? Consulta el mapa de dependencias de `01-archaeology/dependency-map.md`. Cuenta las aristas que cruzarían entre este contexto y otros. Acoplamiento bajo = candidato sólido. Un acoplamiento alto sugiere que el límite podría estar mal situado.

**Frecuencia de cambio**: en el sistema heredado, ¿qué programas de este grupo probablemente se modificaban juntos? Utiliza los patrones de nombres de archivo y las relaciones de llamadas como indicadores indirectos. Los programas que se llaman entre sí de forma extensa probablemente cambian juntos y pertenecen al mismo contexto.

Presenta cada evaluación como una tabla de puntuación: alto/medio/bajo para cada criterio.

**Paso 3 — Presenta al equipo para decidir.**
Para cada hipótesis, presenta:

- La tabla de puntuación
- Una recomendación (aceptar, rechazar o fusionar con otra hipótesis)
- La justificación

Después pregunta al equipo: «¿Aceptan esta recomendación? Si no, ¿qué cambiarían?».

El equipo toma la decisión final. Si el equipo decide en contra de tu recomendación, documenta su justificación.

**Paso 4 — Formaliza los contextos aceptados.**
Para cada contexto delimitado aceptado, escribe:

- **Nombre**: un nombre en lenguaje de negocio confirmado por el equipo, no un nombre técnico de servicio
- **Responsabilidad**: un párrafo que describa de qué es responsable este contexto
- **Datos propios**: qué DDM o tablas pertenecen exclusivamente a este contexto
- **Interfaz pública**: qué operaciones expone este contexto a otros (firmas de métodos o nombres de eventos, no implementación)
- **Por qué es un contexto propio**: una frase que lo conecte con los criterios de evaluación

**Paso 5 — Define la comunicación entre contextos.**
Para cada par de contextos que necesite comunicarse, especifica:

- La dirección (A llama a B o bidireccional)
- El mecanismo: llamada a un método dentro del proceso mediante una interfaz, evento de dominio o tipo del núcleo compartido
- Los datos intercambiados (¿solo identificadores? ¿DTO completos? ¿Eventos?)

Recalca que esto es un monolito modular. La comunicación ocurre dentro del proceso, no por HTTP entre servicios.

**Paso 6 — Dibuja el mapa de contextos.**
Crea un diagrama Mermaid que muestre todos los contextos como cajas, con flechas etiquetadas para las relaciones de comunicación. Utiliza la paleta del kit: relleno `#0f172a`, borde `#334155`, texto `#e2e8f0`.

**Paso 7 — Escribe la salida.**
Escribe en `02-modern-spec/bounded-contexts.md`.

## Ejemplo de invocación

```
/carve-bounded-contexts report=01-archaeology/discovery-report.md
```
