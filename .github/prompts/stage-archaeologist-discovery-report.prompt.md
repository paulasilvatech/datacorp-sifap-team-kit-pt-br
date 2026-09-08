---
name: "discovery-report"
description: "Sintetiza los resultados de la etapa 1 en un único informe de descubrimiento listo para el traspaso a la etapa 2."
argument-hint: "team=\"Equipo 07\""
agent: "archaeologist"
tools: ["read", "search", "edit"]
---
# /discovery-report

## Objetivo

Reúne todos los artefactos de la etapa 1 en un único informe de descubrimiento que sirva como documento de traspaso a la etapa 2. El informe debe ser autosuficiente: quien lo lea debería comprender lo que encontró el equipo sin abrir los artefactos individuales.

## Cuándo invocar

Al final de la etapa 1, después de que el equipo complete el inventario, la extracción de reglas de negocio, el mapeo de dependencias y el catálogo de preguntas pendientes.

## Precondiciones

Deben existir los cuatro artefactos de la etapa 1:

- `01-archaeology/inventory.md` (de `/archaeology-kickoff`)
- `01-archaeology/business-rules-catalog.md` (de `/extract-business-rules`)
- `01-archaeology/dependency-map.md` (de `/map-dependencies`)
- `01-archaeology/mysteries-found.md` (de `/catalog-mysteries`)

Si falta algún artefacto o está vacío, el agente se negará a generar el informe y enumerará lo que falta.

## Entradas que debe proporcionar el equipo

- Confirmación de que los cuatro artefactos están completos (o reconocimiento de las lagunas)
- El nombre del equipo para el encabezado del informe

## Lo que haré

- Verificar que los cuatro artefactos de entrada existen y no están vacíos
- Escribir un resumen ejecutivo (máximo 5 frases) que cubra lo encontrado
- Organizar los hallazgos en categorías «confirmados» y «en riesgo»
- Proponer 3–5 hipótesis de límites de contextos delimitados basadas en agrupaciones de dependencias
- Enumerar las preguntas pendientes junto con las lagunas de mayor riesgo sin interpretarlas

## Lo que NO haré

- Generar el informe si falta algún artefacto de entrada: enumeraré lo necesario
- Decidir contextos delimitados: propongo hipótesis para que arquitectura las evalúe
- Rellenar lagunas adivinando: si el equipo no encontró algo, sigue siendo desconocido
- Añadir análisis nuevo más allá de lo que contienen los artefactos: sintetizo; no descubro

## Formato de salida

Un archivo Markdown en `01-archaeology/discovery-report.md`:

```markdown
# Informe de descubrimiento — Etapa 1
## Resumen ejecutivo (máximo 5 frases)
## Lo que sabemos (confirmado)
### Reglas de negocio (solo confirmadas)
### Dependencias (aristas verificadas)
### Estructuras de datos (DDM documentados)
## Lo que introduce riesgo
### Preguntas pendientes de validación humana
### Reglas con evidencia débil
## Hipótesis de límites recomendadas
### Hipótesis 1: [Nombre] — [justificación de una línea]
...
## Artefactos de origen
## Aprobación del equipo
```

## Definición de terminado

- [ ] El informe existe y ocupa menos de 3 páginas impresas
- [ ] El resumen ejecutivo tiene exactamente 5 frases o menos
- [ ] Cada afirmación de la sección «Lo que sabemos» referencia un artefacto de origen mediante una ruta relativa
- [ ] Las preguntas pendientes sin validación humana se enumeran con su evidencia `path:line` y su estado
- [ ] Se proponen 3–5 hipótesis de límites, cada una con nombre y justificación de una línea
- [ ] Las hipótesis están etiquetadas explícitamente como hipótesis, no decisiones

## Cuerpo del prompt

Eres el `@archaeologist`. La etapa 1 está terminando. El equipo necesita un único documento que recoja todo lo descubierto, listo para que `@architect` lo utilice en la etapa 2.

**Paso 1 — Verifica las entradas.**
Verifica que los cuatro artefactos obligatorios existan en `01-archaeology/`:

1. `inventory.md`
2. `business-rules-catalog.md`
3. `dependency-map.md`
4. `mysteries-found.md`

Si falta algún archivo o está vacío, detente inmediatamente. Enumera los artefactos ausentes e indica al equipo qué prompt ejecutar para crearlos. No continúes con un informe parcial.

**Paso 2 — Escribe el resumen ejecutivo.**
Lee los cuatro artefactos. Escribe exactamente 5 frases o menos que respondan:

1. ¿Qué tamaño tiene la base de código heredada? (programas, DDM, líneas de código si se contaron)
2. ¿Cuántas reglas de negocio confirmadas se encontraron?
3. ¿Qué grado de conexión tiene el sistema? (grafo de llamadas denso frente a programas aislados)
4. ¿Cuál es el mayor riesgo al entrar en la etapa 2? (la pregunta pendiente registrada de mayor impacto)
5. ¿Cuál es el nivel de confianza del equipo para la modernización? (alto/medio/bajo, basado en evidencia)

**Paso 3 — Construye la sección «Lo que sabemos».**
Del catálogo de reglas de negocio, extrae solo las clasificadas como «confirmadas». Enuméralas con sus propuestas de notación EARS y referencias de origen.

Del mapa de dependencias, enumera las aristas verificadas entre programas y entre programas y datos. Incluye los recuentos totales.

Del inventario, resume las estructuras DDM documentadas.

Cada afirmación debe citar su artefacto de origen: `[Consulta business-rules-catalog.md, regla #3](../../01-archaeology/business-rules-catalog.md)`.

**Paso 4 — Construye la sección «Lo que introduce riesgo».**
Del catálogo de preguntas pendientes, extrae solo las filas cuyo estado no registre
validación humana. Conserva la pregunta, la evidencia `path:line`, el impacto, la hipótesis
sin confirmar, el responsable y el estado. No añadas una respuesta, ruta de resolución ni
interpretación.

Del catálogo de reglas de negocio, extrae las clasificadas como «inferidas» (solo código, sin respaldo documental). No están confirmadas e introducen riesgo si se utilizan como base para requisitos.

**Paso 5 — Propón hipótesis de límites.**
Analiza el mapa de dependencias en busca de agrupaciones: grupos de programas muy conectados entre sí y poco conectados con otros grupos. Cada agrupación es un contexto delimitado candidato.

Para cada hipótesis, proporciona:

- Un nombre en lenguaje de negocio (no jerga técnica)
- Qué programas pertenecen a ella
- De qué DDM es responsable
- Una justificación de una línea que explique por qué este es un límite natural

Propón 3–5 hipótesis. Etiquétalas explícitamente como hipótesis, no decisiones. `@architect` las evaluará y decidirá en la etapa 2.

**Paso 6 — Enumera los artefactos de origen.**
Al final del informe, enumera los cuatro artefactos de origen con rutas relativas para que cualquiera pueda acceder a los detalles.

**Paso 7 — Añade la aprobación del equipo.**
Añade una sección de aprobación del equipo: «Revisado por: [nombres], Fecha: [fecha], Confianza: [alta/media/baja]». Déjala en blanco para que la complete el equipo.

Escribe el informe completo en `01-archaeology/discovery-report.md`. Debe ser autosuficiente y ocupar menos de 3 páginas impresas.

## Ejemplo de invocación

```
/discovery-report team="Equipo 07"
```
