# @architect — Etapa 2: especificación

> **Ruta:** [Kit del equipo](../../README.md) › [Agentes de etapa](../README.md) › **@architect**

**El agente `@architect` transforma la evidencia recopilada en la Etapa 1 en una especificación moderna trazable, usando GitHub Spec-Kit para producir `spec.md`, `plan.md` y `tasks.md`.**

| Campo | Valor |
|---|---|
| **Público objetivo** | Pareja de Arquitectura (Arquitecto Empresarial + Arquitecto de Software) durante la Etapa 2 |
| **Prerrequisitos** | Transición de la Etapa 1 con un catálogo de reglas y entradas `source_legacy:` disponibles |
| **Tiempo estimado** | 14:00–15:00 |
| **Etapa** | Etapa 2 — Especificación |
| **Resultado esperado** | `spec.md`, `plan.md` y `tasks.md` en `specs/<NNN>-<feature>/`, aprobados por el Responsable de Producto |

![Etapa 2](https://img.shields.io/badge/Stage-2%20%C2%B7%20Specification-171717?style=flat-square)
![Enfoque analítico](https://img.shields.io/badge/Approach-Analytical-404040?style=flat-square)

---

## Cuándo usarlo

Usa este agente después de que el equipo tenga descubrimientos del legado y necesite transformarlos en una especificación moderna. `@architect` ayuda a definir contextos delimitados, escribir requisitos EARS, registrar ADR y preparar la implementación.

- **Lidera:** Arquitecto de Software
- **Apoyo principal:** Especialista en Requisitos, Arquitecto Empresarial, Responsable de Producto y Líder Técnico
- **Prerrequisito de la puerta obligatoria:** evidencia de la Etapa 1 con `source_legacy:` para cada regla

---

## Lo que hace el agente

- Transforma reglas de negocio catalogadas en requisitos EARS con `source_legacy:`
- Compara alternativas de contextos delimitados e identifica ventajas y desventajas
- Genera ADR con contexto, opciones, decisión, consecuencias y riesgos
- Ejecuta `/speckit.specify`, `/speckit.clarify` y `/speckit.plan` guiándose por la especificación
- Identifica lagunas de la especificación antes de implementar

---

## Lo que el agente NO hace

- No acepta un requisito sin evidencia del legado o una justificación `[GREENFIELD]`
- No escribe código de implementación (esa es la función de `@builder`)
- No completa campos o flujos ambiguos sin una resolución explícita
- No decide el alcance sin la validación del Responsable de Producto

---

## Entradas

| Entrada | Ubicación |
|---|---|
| Catálogo de reglas de la Etapa 1 | `01-archaeology/business-rules-catalog.md` |
| Mapa de dependencias | En el catálogo o en un archivo Mermaid separado |
| Preguntas abiertas | Sección del catálogo |
| Lista de verificación de exploración del legado | `01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md` |

---

## Salidas esperadas

| Artefacto | Ubicación |
|---|---|
| Especificación de la funcionalidad | `specs/<NNN>-<feature>/spec.md` |
| Plan técnico | `specs/<NNN>-<feature>/plan.md` |
| Lista de tareas implementables | `specs/<NNN>-<feature>/tasks.md` |
| Decisiones de alcance de apoyo | `02-modern-spec/` (solo apoyo, no una segunda ubicación de especificaciones) |

---

## Cómo seleccionar el agente en Copilot Chat

- [ ] **Abre Copilot Chat** en VS Code (`Ctrl+Alt+I` / `Cmd+Alt+I`).
- [ ] **Selecciona `@architect`** en el selector de agentes.
- [ ] **Abre el catálogo de reglas de la Etapa 1** en el editor.
- [ ] **Pega el prompt de apertura** que aparece a continuación y pulsa Enter.

```text
Estoy comenzando la Etapa 2 — Especificación.
Tenemos un informe de descubrimiento, catálogo de reglas, glosario, DDM y mapa de dependencias.
Ayuda a transformar la evidencia confirmada en `spec.md`, `plan.md` y
`tasks.md` para una funcionalidad acotada. No completes requisitos ni arquitectura
sin una fuente y registra las preguntas abiertas por separado.
```

---

## Ejemplos de prompts

| Situación | Prompt útil |
|---|---|
| Regla de negocio sin estructurar | "Confirma la fuente de esta regla antes de proponer un requisito EARS con `source_legacy:`." |
| Límite de contexto delimitado incierto | "Compara 2 o 3 posibles contextos delimitados y muestra ventajas y desventajas." |
| Decisión de arquitectura | "Genera un ADR con contexto, opciones, decisión, consecuencias y riesgos." |
| Plan técnico | "Prepara `/speckit.plan` considerando un Monolito Modular, JPA y PostgreSQL." |

---

## Definición de terminado

- [ ] Existen `spec.md`, `plan.md` y `tasks.md` en `specs/<NNN>-<feature>/`.
- [ ] Cada requisito tiene `source_legacy:` apuntando a `.NSN` o `.ddm`, o `[GREENFIELD]` con una justificación.
- [ ] Las decisiones de alcance de apoyo están en `02-modern-spec/`.
- [ ] El Responsable de Producto revisó y aprobó el alcance durante la transición de las 15:00.

---

## Errores comunes

| Síntoma | Causa | Corrección |
|---|---|---|
| Requisito sin `source_legacy:` | Regla inferida sin evidencia del legado | Vuelve al catálogo de la Etapa 1 y encuentra la referencia de línea |
| Arquitectura demasiado compleja para el tiempo disponible | La ambición supera el alcance de la inmersión | Prefiere decisiones sencillas y comprobables que puedan implementarse en una hora |
| ADR mezclado con opiniones sin estructurar | El registro carece de estructura | Usa la plantilla: contexto, opciones, decisión y consecuencias |
| Especificación sin criterio de aceptación | El requisito no es comprobable | Cada requisito necesita al menos un escenario verificable |

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [@archaeologist](../01-archaeologist/README.md)<br/><sub>Etapa 1: leer el sistema heredado Natural/Adabas.</sub> | [@builder](../03-builder/README.md)<br/><sub>Etapa 3: construir la implementación trazable.</sub> |

<sub>[Volver al índice del kit](../../README.md)</sub>
