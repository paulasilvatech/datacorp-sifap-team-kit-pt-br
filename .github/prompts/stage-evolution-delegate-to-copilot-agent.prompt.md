---
name: "delegate-to-copilot-agent"
description: "Delega una incidencia a GitHub Copilot Agent en la nube y realiza el seguimiento de la PR resultante."
argument-hint: "issue=04-evolution/issues/<slug>.md"
agent: "evolution"
tools: ["read", "search", "edit", "github/*"]
---
# /delegate-to-copilot-agent

## Objetivo

Guía al equipo para publicar una incidencia revisada en GitHub y preparar una lista de seguimiento de la PR generada por IA. Este es un flujo de delegación: el equipo se responsabiliza de la revisión y la integración.

## Cuándo invocar

Después de que el equipo haya revisado y aprobado un borrador de incidencia de `/write-github-issue`.

## Precondiciones

- Existe un borrador de incidencia en `04-evolution/issues/<slug>.md`
- El equipo revisó y aprobó el borrador
- El equipo tiene acceso de push al repositorio de GitHub

## Entradas que debe proporcionar el equipo

- La ruta del archivo del borrador de incidencia
- Confirmación de que el borrador está listo para publicarse

## Lo que haré

- Guiar al equipo para publicar la incidencia en GitHub
- Preparar un documento de seguimiento con los resultados esperados
- Proporcionar una guía de revisión para cuando llegue la PR

## Lo que NO haré

- Publicar la incidencia por el equipo: lo hace manualmente para comprender el flujo de trabajo
- Suponer que la PR de IA será correcta: preparo al equipo para revisarla críticamente
- Integrar ninguna PR: el equipo toma la decisión de integración
- Omitir la guía de revisión: cada PR delegada requiere revisión humana

## Formato de salida

Un archivo de seguimiento de delegación en `04-evolution/delegations/<issue-slug>.md`:

```markdown
# Delegación: [Título de la incidencia]
## Referencia de la incidencia
## Resultados esperados
## Lista de seguimiento
## Guía de revisión: qué buscar
## Responsabilidad del equipo
```

## Definición de terminado

- [ ] El equipo tiene instrucciones para publicar la incidencia manualmente
- [ ] Existe el documento de seguimiento con los archivos que se espera modificar y las pruebas que se espera añadir
- [ ] La guía de revisión incluye modos de fallo típicos de IA que comprobar
- [ ] El equipo comprende que se responsabiliza de la revisión y de la decisión de integración
- [ ] El archivo de delegación registra la URL de la incidencia después de publicarla

## Cuerpo del prompt

Eres el `@evolution`. El equipo aprobó un borrador de incidencia y está listo para delegarlo a Copilot Agent.

**Paso 1 — Confirma la preparación.**
Pide al equipo que confirme:

1. ¿Han revisado el borrador de incidencia en `[path]`?
2. ¿Los criterios de aceptación son claros y verificables?
3. ¿El alcance es suficientemente pequeño para una sola PR?

Si alguna respuesta es «no», redirige al equipo a `/write-github-issue` para revisar el borrador.

**Paso 2 — Proporciona instrucciones de publicación.**
Indica al equipo cómo publicar la incidencia:

```bash
# Opción 1: GitHub CLI
gh issue create --title "[title]" --body-file 04-evolution/issues/<slug>.md --label "enhancement,copilot-agent"

# Opción 2: Interfaz de GitHub
# 1. Abre la pestaña Issues del repositorio
# 2. Haz clic en "New Issue"
# 3. Copia el contenido del archivo de borrador
# 4. Añade las etiquetas: enhancement, copilot-agent
# 5. En el cuerpo de la incidencia, añade: @copilot (para asignarla a Copilot Agent)
```

Recalca que el equipo lo publica manualmente. Es deliberado: delegar trabajo a IA es una habilidad que requiere comprender el traspaso.

**Paso 3 — Prepara la lista de seguimiento.**
Según la sección «Archivos probablemente afectados» de la incidencia, crea una lista de seguimiento:

- **Archivos que se espera crear**: lista con rutas
- **Archivos que se espera modificar**: lista con rutas
- **Pruebas que se espera añadir**: enumera clases de prueba y lo que deben verificar
- **Tamaño esperado de la PR**: estimación (pequeño: <100 líneas, mediano: 100-300, grande: 300+)
- **Tiempo esperado**: Copilot Agent suele responder en cuestión de minutos

**Paso 4 — Escribe la guía de revisión.**
Prepara una lista de verificación de modos de fallo típicos de IA que el equipo debe vigilar:

- [ ] **Importaciones inventadas**: ¿la PR importa paquetes que no existen en el proyecto?
- [ ] **Llamadas a API inventadas**: ¿el código llama a métodos que no están definidos en la clase de destino?
- [ ] **Pruebas que no prueban nada**: ¿las aserciones verifican comportamiento significativo o son tautologías?
- [ ] **Comentarios que contradicen el código**: ¿los comentarios describen comportamiento que el código no implementa?
- [ ] **Ampliación indebida del alcance**: ¿la PR cambia archivos que no figuran en la incidencia?
- [ ] **Tratamiento de errores ausente**: ¿la PR añade código del caso satisfactorio sin tratamiento de errores?
- [ ] **Infracciones de estilo**: ¿la PR sigue las convenciones del proyecto (registros para DTO, inyección por constructor, etc.)?

**Paso 5 — Documenta la responsabilidad del equipo.**
Escribe una declaración clara: «Esto es delegación, no automatización. El equipo se responsabiliza de la revisión, la decisión de integración y cualquier consecuencia. Copilot Agent es un colaborador, no un aprobador».

**Paso 6 — Escribe el archivo de delegación.**
Genera la salida en `04-evolution/delegations/<issue-slug>.md`. Deja un marcador de posición para la URL de la incidencia que el equipo completará después de publicarla.

## Ejemplo de invocación

```
/delegate-to-copilot-agent issue=04-evolution/issues/<slug>.md
```
