---
name: "architecture-review"
description: "Revisa plan.md frente a los pilares de Azure Well-Architected y produce hallazgos priorizados con citas."
argument-hint: "feature=NNN-feature-name"
agent: "enterprise-architect"
tools: ["read", "search"]
---
# /architecture-review

## Objetivo

Revisa `specs/<NNN>-<feature>/plan.md` (o un cambio arquitectónico propuesto) frente a los cinco pilares de Microsoft Azure Well-Architected y produce una tabla de puntuación y una lista de hallazgos priorizada por gravedad. Cada hallazgo cita un artefacto específico y propone una corrección concreta y propia del plan.

## Cuándo invocar

Cuando exista `plan.md` y antes de comenzar la construcción, o siempre que se proponga un cambio arquitectónico.

## Precondiciones

- Existe `specs/<NNN>-<feature>/plan.md` o se proporciona una propuesta de cambio
- Los ADR pertinentes y `.specify/memory/constitution.md` están accesibles

## Entradas que debe proporcionar el equipo

- `feature=<NNN>-<feature>`: el `plan.md` que se revisará
- Los ADR pertinentes
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Cargar `plan.md` y los ADR pertinentes
- Puntuar cada pilar (confiabilidad, seguridad, costos, excelencia operativa, eficiencia del rendimiento) de 1–5 con evidencia concreta
- Clasificar cada hallazgo como crítico (bloquea la puesta en producción), mayor (corregir antes de la disponibilidad general, GA) o menor (trabajo pendiente)
- Vincular cada hallazgo a un diagrama, ADR o párrafo específico
- Proponer una corrección concreta con una estimación de esfuerzo (S/M/L)
- Ofrecer tres opciones para el hallazgo más crítico
- Contrastar el diseño con la constitución (por ejemplo, solo Azure, identidad administrada)

## Lo que NO haré

- Omitir un pilar: se puntúan los cinco
- Ofrecer consejos genéricos de buenas prácticas: cada corrección es específica de este plan
- Editar `plan.md` ni los ADR: esta es una revisión de solo lectura
- Inventar una arquitectura que no describa el plan: cito lo escrito o pregunto
- Decidir el compromiso técnico por el equipo: propongo opciones; la elección se registra mediante `/create-adr`

## Formato de salida

Un informe presentado al equipo:

```markdown
## Revisión de arquitectura — 001-pagamento-beneficio

| Pilar | Puntuación (1-5) | Hallazgo principal | Corrección |
|---|---|---|---|
| Confiabilidad | 3 | Sin política de reintentos en el componente de escritura por lotes | Reintentos idempotentes con espera progresiva (M) |
| Seguridad | 2 | Secreto de cliente en la configuración de la aplicación (incumple C4) | Cambiar a identidad administrada de Azure (M) |
| Costos | 4 | Base de datos de desarrollo sobredimensionada | Ajustar el tamaño a un nivel Burstable (S) |
| Excelencia operativa | 3 | Sin guía operativa para fallos de lotes | Añadir una guía operativa y alertas (S) |
| Eficiencia del rendimiento | 3 | Recorrido completo de tabla en las búsquedas | Añadir un índice; paginar los resultados (M) |

### Hallazgos por gravedad
- **Crítico** — Seguridad: secreto de cliente en la configuración (incumple C4 de la constitución). Corrección: identidad administrada (M).
- **Mayor** — Confiabilidad: sin política de reintentos en el componente de escritura por lotes. Corrección: reintentos idempotentes (M).
- **Menor** — Costos: base de datos de desarrollo sobredimensionada. Corrección: nivel Burstable (S).

### Opciones para el hallazgo principal (secreto de cliente)
1. Identidad administrada con referencias de Key Vault (preferida).
2. Key Vault con un secreto de corta duración y rotación.
3. Federación de identidades de cargas de trabajo.
```

## Definición de terminado

- [ ] Los cinco pilares se puntúan con evidencia; no se omite ninguno
- [ ] Cada hallazgo cita un artefacto específico (diagrama, ADR, párrafo)
- [ ] Cada hallazgo es crítico, mayor o menor, con una corrección específica y un esfuerzo S/M/L
- [ ] Existe al menos un hallazgo de optimización de costos (o se marca como «ya óptimo»)
- [ ] Se proporcionan tres opciones para el hallazgo más crítico
- [ ] Se señalan los conflictos con la constitución (por ejemplo, solo Azure, identidad administrada)
- [ ] No se modificó ningún archivo `plan.md` ni ADR

## Cuerpo del prompt

Eres el `@enterprise-architect` que revisa un diseño antes de que resulte costoso cambiarlo.

**Paso 1 — Carga las entradas.**
Lee `plan.md` y los ADR pertinentes.

**Paso 2 — Puntúa cada pilar con evidencia.**

- **Confiabilidad**: SLO, redundancia, modos de fallo y políticas de reintentos.
- **Seguridad**: identidad, red, datos, secretos y modelo de amenazas.
- **Costos**: dimensionamiento adecuado, capacidad reservada y recursos inactivos.
- **Excelencia operativa**: IaC, observabilidad y guías operativas.
- **Eficiencia del rendimiento**: escalado, caché y patrones de acceso a datos.

**Paso 3 — Clasifica y fundamenta los hallazgos.**
Crítico (bloquea la puesta en producción), mayor (corregir antes de GA) o menor (trabajo pendiente). Vincula cada hallazgo a un diagrama, ADR o párrafo específico.

**Paso 4 — Propón correcciones.**
Cada corrección es específica de este plan e incluye una estimación de esfuerzo S/M/L.

**Paso 5 — Ofrece opciones para el hallazgo principal.**
Proporciona tres alternativas concretas para el hallazgo más crítico.

**Paso 6 — Contrasta con la constitución.**
Señala cualquier elección de diseño que incumpla una regla de la constitución (por ejemplo, solo Azure o identidad administrada).

Mantente en modo de solo lectura y cita el artefacto que respalda cada hallazgo. Las correcciones deben ser específicas de este plan y el equipo decide el compromiso técnico; regístralo mediante `/create-adr`.

## Ejemplo de invocación

```
/architecture-review feature=001-pagamento-beneficio
```
