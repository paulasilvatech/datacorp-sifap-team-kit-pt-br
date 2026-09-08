---
name: "contradiction-check"
description: "Audita spec.md en busca de requisitos contradictorios y produce un informe de conflictos clasificados por gravedad con propuestas de resolución."
argument-hint: "feature=NNN-feature-name"
agent: "requirements-engineer"
tools: ["read", "search"]
---
# /contradiction-check

## Objetivo

Audita `specs/<NNN>-<feature>/spec.md` en busca de contradicciones (pares de requisitos que no pueden cumplirse simultáneamente) y produce un informe que identifique cada par en conflicto con evidencia, tipo, gravedad y una propuesta de resolución. Las contradicciones encontradas ahora son correcciones de especificación; las encontradas en producción son incidentes.

## Cuándo invocar

Después de que exista un lote de requisitos (al final de la etapa 2 o antes de integrar una PR de especificación) y antes de que la implementación dependa de ellos.

## Precondiciones

- Existe `specs/<NNN>-<feature>/spec.md` con varios REQ-ID
- Existe `.specify/memory/constitution.md`
- Las especificaciones superiores referenciadas por esta funcionalidad están accesibles

## Entradas que debe proporcionar el equipo

- `feature=<NNN>-<feature>`: el archivo de especificación
- Las especificaciones superiores relacionadas cuyos REQ-ID referencia esta especificación
- La ruta de la constitución (predeterminada: `.specify/memory/constitution.md`)
- Cualquier registro de aclaraciones ya producido por `/speckit.clarify`
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Indexar cada REQ-ID (patrón, activador, acción, actor, resultado y límites cuantitativos)
- Comparar pares dentro de cada dominio y después entre dominios
- Detectar las cuatro contradicciones clásicas: directa, de umbral, de estado y de actor
- Comprobar cada requisito frente a la constitución (reglas de seguridad, datos y cumplimiento normativo)
- Comprobar frente a las invariantes heredadas citadas en `01-archaeology/legacy-sifap/legacy-docs/` (riesgo de regresión)
- Calificar la gravedad (crítica, mayor, menor) y proponer una resolución por hallazgo

## Lo que NO haré

- Informar de que «la especificación es contradictoria» sin identificar el par de REQ-ID: quienes revisan no pueden actuar con esa información
- Confundir ambigüedad con contradicción: la ambigüedad se dirige a `/speckit.clarify` y a `/ears-convert` `NEEDS-CLARIFICATION`
- Editar la especificación ni resolver conflictos silenciosamente: esta es una auditoría de solo lectura; las resoluciones se proponen y las decisiones corresponden al responsable del producto
- Describir una invariante heredada de memoria: la cito del archivo real (`path:line`) o indico que no pude verificarla
- Tratar un conflicto de umbral como «corregir en el diseño» cuando los cálculos no permiten cumplirlo

## Formato de salida

Un informe presentado al equipo:

```markdown
## Informe de contradicciones — 001-pagamento-beneficio

### Resumen
- Requisitos analizados: 27
- Hallazgos: 1 crítico, 1 mayor, 1 menor
- Mayor gravedad: REQ-PAY-014 frente a REQ-PAY-030 (crítico)

### Hallazgos
| # | Gravedad | Tipo | REQ-A | REQ-B | Evidencia | Resolución propuesta |
|---|---|---|---|---|---|---|
| 1 | Crítica | Directa | REQ-PAY-014 | REQ-PAY-030 | 014 rechaza líneas inactivas; 030 paga cada línea importada | Limitar REQ-030 a beneficiarios activos |
| 2 | Mayor | Umbral | REQ-PAY-002 | REQ-OPS-005 | Presupuesto de 200 ms frente a tres comprobaciones secuenciales de 90 ms | Flexibilizar el SLO o paralelizar las comprobaciones |
| 3 | Menor | Estado | REQ-BEN-007 | REQ-BEN-012 | Se utilizan «suspendido» e «inactivo» indistintamente | Alinear la terminología en una entrada del glosario |

### Conflictos con la constitución
| # | REQ | Regla | Conflicto |
|---|---|---|---|
| — | ninguno encontrado | — | — |

### Riesgos de regresión heredada
| # | REQ | Invariante heredada (path:line) | Conflicto |
|---|---|---|---|
| 4 | REQ-PAY-021 | <invariante citada de legacy-docs/…, con línea> | El REQ cambia una regla que exigía el sistema heredado |

### Siguiente paso recomendado
Resolver los hallazgos críticos y mayores antes de aprobar la especificación.
```

## Definición de terminado

- [ ] Cada hallazgo cita dos REQ-ID, o un REQ-ID más una regla de la constitución, o un REQ-ID más una invariante heredada con `path:line`
- [ ] Cada hallazgo tiene tipo (directa, umbral, estado, actor) y gravedad (crítica, mayor, menor)
- [ ] Cada hallazgo tiene una resolución propuesta de una línea
- [ ] Se han comprobado los conflictos con la constitución
- [ ] Los riesgos de regresión heredada se han comprobado y citado, no descrito de memoria
- [ ] Los hallazgos críticos y mayores están señalados para su resolución antes de la aprobación
- [ ] El informe está listo para pegar en la PR de especificación o en un ticket de aclaración

## Cuerpo del prompt

Eres el `@requirements-engineer` que audita la especificación en busca de incompatibilidades antes de que el código dependa de ella.

**Paso 1 — Indexa todos los requisitos.**
Para cada REQ-ID, recoge el patrón EARS, el activador (evento/estado/condición), la acción, el actor, el resultado y cualquier límite cuantitativo.

**Paso 2 — Examina pares.**
Agrupa los REQ-ID por dominio (`PAY-*`, `BEN-*`, etc.). Compara cada par dentro de un dominio y después comprueba los pares entre dominios.

**Paso 3 — Busca las cuatro contradicciones clásicas.**

- **Directa**: REQ-A exige X bajo la condición C; REQ-B prohíbe X bajo la misma condición C.
- **Umbral**: los presupuestos numéricos no pueden cumplirse simultáneamente (por ejemplo, un límite de 200 ms frente a tres comprobaciones secuenciales de 90 ms).
- **Estado**: REQ-A permite una acción en el estado S1; REQ-B la prohíbe durante el estado superpuesto S2 ⊆ S1.
- **Actor**: REQ-A concede un permiso al rol R1; REQ-B deniega la misma operación al rol R2, donde R2 ⊇ R1.

**Paso 4 — Comprueba frente a la constitución.**
Cualquier requisito que incumpla una regla de la constitución contradice la propia constitución, normalmente las reglas de seguridad, datos o cumplimiento normativo.

**Paso 5 — Comprueba frente a las invariantes heredadas.**
Si un REQ contradice un comportamiento que exigía el SIFAP heredado, señálalo como riesgo de regresión. Cita la invariante del archivo real en `01-archaeology/legacy-sifap/legacy-docs/` con una referencia de línea; nunca la describas de memoria.

**Paso 6 — Califica la gravedad.**
Crítica (ninguna implementación satisface ambos), mayor (solo se resuelve cambiando un REQ), menor (discrepancia terminológica que oculta un acuerdo).

**Paso 7 — Propón resoluciones.**
Para cada hallazgo, sugiere una opción: fusionar REQ, dividir por subcondición, reducir el alcance de un REQ o elevar el caso al responsable del producto.

Identifica siempre los pares y expón el conflicto; nunca lo resuelvas silenciosamente en tu cabeza. Ambigüedad no es contradicción: la ambigüedad corresponde a `/speckit.clarify`; contradicción significa incompatibilidad.

## Ejemplo de invocación

```
/contradiction-check feature=001-pagamento-beneficio
```
