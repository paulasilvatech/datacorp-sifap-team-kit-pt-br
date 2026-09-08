# Registros de decisiones de arquitectura (ADR)

> **Ruta:** [Kit del equipo](../../README.md) › [Documentación](../README.md) › **ADR**

**Índice de registros de decisiones de arquitectura del equipo** — una decisión por archivo, con numeración secuencial.

| Campo | Valor |
|---|---|
| **Público objetivo** | Todo el equipo, especialmente el Arquitecto de Software y el Líder Técnico |
| **Cuándo crear uno** | Para cada decisión que sea difícil de reconsiderar después (más de una hora para revertirla) |
| **Resultado esperado** | Historial auditable de las decisiones tomadas bajo presión de tiempo |

---

## Por qué escribir ADR

Las decisiones tomadas bajo presión de tiempo se olvidan. Tu yo del futuro volverá a descubrir las mismas opciones y perderá horas. Escribir un ADR lleva cinco minutos ahora y ahorra 50 minutos después.

## Cuándo escribir un ADR

Escribe uno cuando:

- Una decisión sea difícil de reconsiderar después (más de una hora para revertirla).
- Dos o más integrantes del equipo elegirían naturalmente opciones diferentes.
- Una decisión afecte a más de un contexto delimitado o persona.

No escribas un ADR para nombres de variables, configuración de formato ni versiones menores de bibliotecas.

---

## Índice

| ADR | Título | Estado | Fecha |
|---|---|---|---|
| 0000 | [Plantilla](0000-template.md) | template | 2026-04-29 |
| 0001 | [Fuente única de verdad para las instrucciones de agentes](0001-agent-instructions-single-source-of-truth.md) | accepted | 2026-08-17 |
| 0002 | [Portal de documentación trilingüe con Astro](0002-trilingual-documentation-portal.md) | accepted | 2026-09-07 |

> [!NOTE]
> Añade los nuevos ADR a esta tabla a medida que se creen, primero con el estado `proposed` y después `accepted` tras el acuerdo del equipo.

---

## Cómo añadir un ADR

- [ ] **Abre una issue** usando la [plantilla de issue de ADR](../../.github/ISSUE_TEMPLATE/adr.yml).
- [ ] **Copia la plantilla** — `0000-template.md` → `NNNN-your-title.md` (siguiente número secuencial).
- [ ] **Completa cada sección** — contexto, decisión, alternativas, consecuencias y estado.
- [ ] **Abre una pull request** — exige al menos una revisión de una persona de arquitectura.
- [ ] **Integra con el estado `accepted`** — actualiza este índice.

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Documentación transversal](../README.md)<br/><sub>Glosario, flujo del SDLC, matriz persona-agente y runbook.</sub> | [Etapa 2 — Especificación moderna](../../02-modern-spec/GUIDE.md)<br/><sub>14:00–15:00 — Escribir EARS, ADR y diagramas C4.</sub> |

<sub>[Volver al índice del kit](../../README.md)</sub>
