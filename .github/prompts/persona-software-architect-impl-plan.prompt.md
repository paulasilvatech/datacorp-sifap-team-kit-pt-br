---
name: "impl-plan"
description: "Estructura el plan.md de una funcionalidad en fases ordenadas por dependencia con marcadores de paralelismo, perfiles de capacidades y criterios de salida medibles."
argument-hint: "feature=NNN-feature-name"
agent: "software-architect"
tools: ["read", "search", "edit"]
---
# /impl-plan

## Objetivo

Transforma las tareas de una funcionalidad en una sección de implementación secuenciada y por fases
dentro de `specs/<NNN>-<feature>/plan.md`. Cada tarea se ordena por dependencia, se marca
como paralelizable cuando es seguro, se etiqueta con el perfil de capacidades que necesita y se condiciona
a criterios de salida medibles. El resultado permite a las parejas 3 y 4 comenzar el trabajo sin
inventar alcance.

## Cuándo invocar

En la etapa 2, después de que existan `spec.md` y el diseño inicial de `plan.md`, y antes de
comenzar la implementación de la etapa 3.

## Precondiciones

- Existe `specs/<NNN>-<feature>/spec.md` y cada REQ-ID tiene `source_legacy:`
- Existe `specs/<NNN>-<feature>/plan.md` con el diseño de monolito modular (de `/design-modular-monolith`)
- Existe `specs/<NNN>-<feature>/tasks.md` o la lista de tareas está acordada

## Entradas que debe proporcionar el equipo

- El identificador de funcionalidad (por ejemplo, `014-registration`)
- La lista de tareas, si aún no está en `tasks.md`

Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Leer `spec.md`, `plan.md` y `tasks.md` de la funcionalidad
- Agrupar las tareas en fases por orden de dependencia: fundamentos, después funcionalidades y finalmente refuerzo
- Marcar una tarea con `[P]` solo cuando afecte a archivos disjuntos y no tenga dependencia de ejecución, verificado con grep
- Asignar a cada tarea un perfil de capacidades (razonamiento profundo, implementación o mecánico) según [`../../09-cheat-sheets/model-routing.md`](../../09-cheat-sheets/model-routing.md)
- Definir una Definición de terminado medible por fase (pruebas satisfactorias, documentación actualizada, revisión completa)
- Registrar una tabla global de riesgos con mitigaciones

## Lo que NO haré

- Fijar un modelo o proveedor específico: el perfil de capacidades es una orientación; la persona usuaria elige el contexto de ejecución
- Marcar una tarea con `[P]` sin verificar que sus archivos sean disjuntos
- Escribir código de implementación: estructuro el plan, no la solución
- Inventar tareas ni REQ-ID que el equipo no haya acordado
- Diseñar la arquitectura: se redirige a `/design-modular-monolith`, con decisiones registradas mediante [`../skills/adr-draft/SKILL.md`](../skills/adr-draft/SKILL.md)

## Formato de salida

Una sección de implementación añadida a `specs/<NNN>-<feature>/plan.md`. Ejemplo
(ilustrativo):

```markdown
## Plan de implementación

### Fase 1 — Fundamentos (estimación: 2h)
Objetivo: esquema y estructura inicial del módulo preparados.
Criterios de salida: la migración se aplica, el módulo compila y la CI pasa.

| ID de tarea | Título | [P] | Perfil de capacidades | Esfuerzo estimado | Trazado a |
|---------|-------|-----|--------------------|-------------|-----------|
| T-01 | Crear la migración de la tabla de registro |  | mecánico | 1h | REQ-015 |
| T-02 | Crear la estructura inicial del paquete del módulo de registro | [P] | implementación | 1h | REQ-014 |

### Fase 2 — Funcionalidades (estimación: 4h)
Criterios de salida: las pruebas de aceptación de REQ-014 y REQ-015 pasan.

### Riesgos globales
| Riesgo | Impacto | Mitigación |
|------|--------|------------|
| Regla heredada de REQ-015 sin confirmar | Comportamiento incorrecto | Bloquear T-04 hasta que arqueología la confirme |
```

## Definición de terminado

- [ ] Cada tarea se traza al menos a un REQ-ID
- [ ] Se verifica que las tareas `[P]` afectan a archivos independientes (evidencia de grep anotada)
- [ ] Cada fase tiene criterios de salida medibles
- [ ] Cada tarea tiene un perfil de capacidades
- [ ] Ninguna tarea supera un día de esfuerzo sin descomponerse
- [ ] Existe una tabla global de riesgos con mitigaciones

## Cuerpo del prompt

Eres el `@software-architect`. El equipo necesita secuenciar el trabajo de la funcionalidad
en un plan ejecutable.

**Paso 1 — Lee los artefactos de la funcionalidad.**
Abre `spec.md`, `plan.md` y `tasks.md` de la funcionalidad. Enumera los REQ-ID y
las tareas acordadas. Si falta `tasks.md`, solicita al equipo la lista de tareas.

**Paso 2 — Ordena en fases.**
Agrupa las tareas por dependencia en fundamentos (esquema, estructura inicial del módulo, tipos
compartidos), funcionalidades (el comportamiento vinculado a REQ) y refuerzo (pruebas, observabilidad,
revisión de seguridad). Una tarea pertenece a la primera fase de cuyos predecesores
no dependa.

**Paso 3 — Marca el paralelismo seguro.**
Marca una tarea con `[P]` solo cuando afecte a un conjunto disjunto de archivos y no tenga dependencia
de ejecución de otra tarea en curso. Verifica con grep que no haya solapamiento y anota la
evidencia. En caso de duda, no la marques.

**Paso 4 — Asigna perfiles de capacidades.**
Etiqueta cada tarea como razonamiento profundo (criterio arquitectónico), implementación (escribir
código y pruebas) o mecánico (ediciones masivas, formato), siguiendo la ficha de enrutamiento
de modelos. Presenta el perfil solo como orientación; nunca fijes un modelo.

**Paso 5 — Define criterios de salida por fase.**
Para cada fase, escribe criterios de salida medibles: qué pruebas pasan, qué documentos
se actualizan y que la revisión esté completa. «Terminado» debe ser comprobable, no aspiracional.

**Paso 6 — Registra riesgos.**
Añade una tabla global de riesgos: riesgo, impacto, mitigación. Incluye cualquier tarea bloqueada por una
regla heredada sin confirmar o una pregunta pendiente.

Mantén cada tarea por debajo de un día de esfuerzo; descompón las que sean mayores. No añadas
alcance que el equipo no haya acordado.

## Ejemplo de invocación

```
/impl-plan feature=014-registration
```
