---
name: "write-github-issue"
description: "Escribe una incidencia de GitHub de alta calidad lista para Copilot Agent en la nube."
argument-hint: "feature=\"<scoped-work>\" context=<context> reqs=REQ-XXX"
agent: "evolution"
tools: ["read", "search", "edit", "github/*"]
---
# /write-github-issue

## Objetivo

Crea una incidencia de GitHub bien estructurada y optimizada para la ejecución autónoma de Copilot Agent (en la nube). La incidencia tiene criterios de aceptación claros, orientación sobre rutas de archivos y trazabilidad REQ-ID.

## Cuándo invocar

Al comienzo de la etapa 4, cuando el equipo identifica trabajo que puede delegarse a Copilot Agent.

## Precondiciones

- El equipo tiene un prototipo funcional de la etapa 3
- Existe `specs/<NNN>-<feature>/spec.md` con requisitos EARS
- El equipo identificó un trabajo específico que delegar

## Entradas que debe proporcionar el equipo

- Una descripción de la funcionalidad o corrección deseada
- Los REQ-ID relacionados (si existen)
- El contexto delimitado y los archivos probablemente afectados

## Lo que haré

- Estructurar la incidencia con cinco secciones obligatorias: Contexto, Criterios de aceptación, Archivos afectados, Enfoque de pruebas y Fuera del alcance
- Referenciar REQ-ID y criterios existentes sin inventar requisitos EARS ni comportamiento
- Sugerir etiquetas y una persona asignada

## Lo que NO haré

- Publicar la incidencia directamente: el equipo la revisa y publica manualmente
- Escribir incidencias vagas: cada una tiene criterios de aceptación específicos
- Crear incidencias para trabajo que debe hacer el propio equipo (decisiones arquitectónicas, correcciones de seguridad)
- Omitir la sección de enfoque de pruebas: Copilot Agent necesita saber cómo verificar su trabajo

## Formato de salida

Un archivo de borrador en `04-evolution/issues/<slug>.md`:

```markdown
# Incidencia: [Título]
## Contexto
## Criterios de aceptación
## Archivos probablemente afectados
## Enfoque de pruebas
## Fuera del alcance
## Etiquetas
## Requisitos relacionados
```

## Definición de terminado

- [ ] El borrador de incidencia tiene las cinco secciones de contenido
- [ ] Los criterios de aceptación son específicos y verificables
- [ ] Se referencia al menos un REQ-ID o se declara «comportamiento nuevo» con una justificación
- [ ] Los archivos probablemente afectados se enumeran con rutas relativas
- [ ] El enfoque de pruebas describe qué pruebas añadir o modificar
- [ ] La incidencia es suficientemente pequeña para una sola PR (si es demasiado grande, divídela)

## Cuerpo del prompt

Eres el `@evolution`. El equipo quiere delegar trabajo a Copilot Agent mediante una incidencia de GitHub.

**Paso 1 — Comprende la solicitud.**
Pregunta al equipo:

1. ¿Qué quieren que se haga? (1-2 frases)
2. ¿A qué contexto delimitado afecta?
3. ¿Esto implementa un `REQ-NNN` existente o comportamiento nuevo?
4. ¿Qué archivos probablemente están implicados?

**Paso 2 — Escribe la sección Contexto.**
Describe por qué este trabajo es necesario. Referencia el estado actual de la base de código (lo que existe) y el estado deseado (lo que debería existir después). Enlaza la especificación EARS si es pertinente.

**Paso 3 — Copia los criterios de aceptación.**
Copia de `spec.md` los criterios verificables de los REQ-ID proporcionados. Si
faltan, registra la laguna y no inventes una respuesta ya elaborada.

**Paso 4 — Enumera los archivos afectados.**
Según la información del equipo y una búsqueda en la base de código, enumera:

- Archivos que modificar (con rutas relativas)
- Archivos que crear (con rutas sugeridas según la estructura de paquetes)
- Archivos que referenciar, pero no modificar (por ejemplo, la especificación OpenAPI o interfaces existentes)

**Paso 5 — Define el enfoque de pruebas.**
Describe qué pruebas debería escribir Copilot Agent:

- Pruebas unitarias para métodos de servicio nuevos
- Pruebas de integración para puntos de conexión nuevos
- Pruebas existentes que puedan necesitar actualizaciones

Si el contexto delimitado ya tiene patrones de pruebas, referéncialos para que Copilot Agent siga el mismo estilo.

**Paso 6 — Marca lo que queda fuera del alcance.**
Expresa explícitamente lo que esta incidencia NO cubre. Esto evita la ampliación indebida del alcance en la PR generada por IA. Ejemplos:

- «No cambia el esquema de la base de datos»
- «No modifica el flujo de autenticación»
- «Los cambios de frontend se siguen en una incidencia separada»

**Paso 7 — Añade metadatos.**
Sugiere etiquetas: `enhancement` o `bug`, el nombre del contexto delimitado y `copilot-agent`.

**Paso 8 — Escribe el borrador.**
Genera la salida en `04-evolution/issues/<slug>.md`, donde `<slug>` es una versión del título en kebab-case. El equipo revisa este borrador antes de publicarlo como una incidencia real de GitHub.

Recuerda al equipo: esto es un borrador. Revísenlo, ajusten el alcance si es necesario y después publíquenlo manualmente mediante la interfaz de GitHub o `gh issue create`.

## Ejemplo de invocación

```
/write-github-issue feature="<scoped-work>" context=<context> reqs=REQ-XXX
```
