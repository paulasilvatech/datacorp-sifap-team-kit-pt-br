---
name: "design-modular-monolith"
description: "Registra en plan.md solo el diseño de monolito modular necesario para la funcionalidad seleccionada."
argument-hint: "feature=NNN-feature-name"
agent: "architect"
tools: ["read", "search", "edit"]
---
# /design-modular-monolith

## Objetivo

Registra en `specs/<NNN>-<feature>/plan.md` solo las decisiones de diseño que desbloquean la primera implementación. El prompt no crea una arquitectura genérica, puntos de conexión, contratos ni diagramas sin evidencia de la funcionalidad.

## Cuándo invocar

Después de que `/write-ears-spec` haya producido `specs/<NNN>-<feature>/spec.md` con `source_legacy:` en cada REQ-ID y el equipo haya expresado una pregunta concreta de diseño que bloquee la primera tarea, todavía en la rama `spec/<NNN>-<feature>`.

> [!NOTE]
> No lo invoques para diseñar todo el sistema, añadir módulos que ningún requisito necesita ni antes de que exista la especificación. Planifica la estructura mínima que requiere la primera tarea.

## Precondiciones

- Existe `specs/<NNN>-<feature>/spec.md` y cada REQ-ID tiene `source_legacy:`
- El equipo confirmó el alcance de la funcionalidad en la etapa 2
- Se ha expresado la pregunta de diseño que se resolverá

## Entradas que debe proporcionar el equipo

- `feature=<NNN>-<feature-name>`: la carpeta de `specs/` que ya contiene `spec.md` y recibe `plan.md`
- La pregunta concreta de diseño que bloquea la primera tarea (por ejemplo, qué módulo es responsable de los datos de un DDM)
- Cualquier restricción del equipo que acote el diseño (datos propios, punto de integración, contrato)

## Lo que haré

- Leer `spec.md`, cualquier `plan.md` existente y las decisiones de alcance de `02-modern-spec/scope-decisions.md`
- Solicitar evidencia para cualquier límite, integración o contrato que la funcionalidad no describa; registrar la pregunta en lugar de rellenar la laguna
- Describir en `plan.md` la estructura mínima de módulos, datos y comunicación que requiere la primera tarea
- Crear un diagrama Mermaid o un contrato solo cuando resuelva una pregunta concreta de implementación y referenciarlo desde `plan.md`
- Vincular cada decisión de diseño a REQ-ID existentes y a decisiones de apoyo pertinentes

## Lo que NO haré

- Sugerir microservicios: el destino es un monolito modular
- Escribir código de implementación
- Completar requisitos, puntos de conexión, esquemas ni decisiones que el equipo no haya confirmado
- Utilizar `02-modern-spec/` como ubicación de `spec.md`, `plan.md` o `tasks.md`
- Exigir un número fijo de módulos, diagramas o contratos: reduce el alcance si queda poco tiempo en la etapa 2

## Formato de salida

Escribe el diseño en `specs/<NNN>-<feature>/plan.md` con esta estructura inicial (los valores son ilustrativos):

```markdown
# Plan — <NNN>-<feature>

## Módulos (monolito modular)

<una fila por módulo — consulta la tabla siguiente>

## Preguntas de diseño pendientes

- Q: <pregunta que la evidencia de la funcionalidad aún no responde> — owner: <nombre>, status: open
```

Registra cada módulo en una tabla:

| Módulo | Responsabilidad | Datos propios (DDM) | Interfaz dentro del proceso | REQ-ID atendido |
|---|---|---|---|---|
| `<module>` | <de qué es responsable> | `<DDM>.ddm` | `<Interface>` | REQ-NNN |

> [!NOTE]
> Añade un `flowchart` de Mermaid solo cuando resuelva una pregunta concreta de implementación y después referéncialo desde `plan.md`.

## Definición de terminado

- [ ] `plan.md` describe solo el diseño necesario para la funcionalidad acotada
- [ ] Cada decisión tiene evidencia o una pregunta pendiente explícita
- [ ] Cada artefacto de apoyo está enlazado desde `plan.md`
- [ ] El plan permite a las parejas 3 y 4 comenzar la primera tarea sin crear alcance adicional

## Cuerpo del prompt

Eres el `@architect`. El equipo tiene un `spec.md` respaldado por evidencia y una pregunta de diseño que bloquea la primera tarea de implementación. Planificas la estructura mínima que la desbloquea, nada más.

**Paso 1 — Lee el estado actual.**
Abre `specs/<NNN>-<feature>/spec.md`, cualquier `plan.md` existente y `02-modern-spec/scope-decisions.md`. Confirma que cada REQ-ID al que afectarás incluye `source_legacy:`. Si alguno no lo tiene, detente y devuélvelo al equipo; no diseñes alrededor de un requisito sin fuente.

**Paso 2 — Expresa la pregunta de diseño.**
Escribe la pregunta concreta que necesita resolver la primera tarea (por ejemplo, «¿qué módulo es responsable de los datos PAYMENT y cómo los lee el módulo de prestaciones?»). Si la evidencia de la funcionalidad no describe un límite, integración o contrato del que dependa la pregunta, regístralo como pregunta de diseño pendiente en lugar de inventar una respuesta.

**Paso 3 — Diseña la estructura mínima.**
Describe solo los módulos, los datos propios y la comunicación que requiere la primera tarea:

- **Módulo**: un área delimitada del monolito modular, nombrada en lenguaje de negocio
- **Datos propios**: los DDM o tablas de los que ese módulo es responsable en exclusiva
- **Interfaz dentro del proceso**: el método o evento que utilizan otros módulos; la comunicación ocurre dentro del proceso, nunca por HTTP entre servicios
- **REQ-ID atendidos**: los requisitos que implementa esta estructura

**Paso 4 — Añade un diagrama o contrato solo si justifica su presencia.**
Crea un `flowchart` de Mermaid o un contrato de interfaz solo cuando resuelva una pregunta concreta de implementación y después referéncialo desde `plan.md`. No dibujes un diagrama de todo el sistema ni definas puntos de conexión que ningún requisito necesita.

**Paso 5 — Enlaza y escribe.**
Vincula cada decisión a sus REQ-ID y decisiones de apoyo, y después escribe en `specs/<NNN>-<feature>/plan.md`. Mantén `spec.md`, `plan.md` y `tasks.md` en `specs/<NNN>-<feature>/`, nunca en `02-modern-spec/`. El destino es un monolito modular, nunca microservicios. Si queda poco tiempo en la etapa 2, reduce el alcance en lugar de añadir estructuras especulativas.

## Ejemplo de invocación

```text
/design-modular-monolith feature=001-benefit-calculation
```

Espera un `specs/001-benefit-calculation/plan.md` que describa solo los módulos, datos propios e interfaces dentro del proceso que necesita la primera tarea, cada uno vinculado a un REQ-ID, con los elementos sin resolver enumerados como preguntas de diseño pendientes.
