---
name: "acceptance-check"
description: "Produce un informe de conformidad que vincule cada criterio de aceptación de spec.md con su implementación y su prueba."
argument-hint: "feature=NNN-feature-name"
agent: "product-owner"
tools: ["read", "search"]
---
# /acceptance-check

## Objetivo

Produce un informe de conformidad respaldado por evidencia que vincule cada criterio de aceptación Given/When/Then de `specs/<NNN>-<feature>/spec.md` con su implementación y su prueba, clasificándolo como Aprobado, Laguna o Fallo. Cada veredicto cita un `file:line`.

## Cuándo invocar

Durante UAT o la revisión del sprint, una vez que existan la implementación y las pruebas de la funcionalidad.

## Precondiciones

- Existe `specs/<NNN>-<feature>/spec.md` con REQ-ID y criterios de aceptación
- Existen código y pruebas de backend y/o frontend para la funcionalidad

## Entradas que debe proporcionar el equipo

- `feature=<NNN>-<feature>`
- Opcional: un subconjunto de REQ-ID que comprobar (predeterminado: todos)
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Extraer cada REQ-ID y sus criterios Given/When/Then de la especificación
- Buscar el código que los implementa en `backend/` y `frontend/` y citar `file:line`
- Buscar en las pruebas una referencia al REQ-ID (la misma señal de la que informa el trabajo de CI `spec-traceability`)
- Clasificar cada criterio: Aprobado (código y prueba encontrados), Laguna (solo código, sin prueba), Fallo (sin código)
- Resumir las lagunas y los fallos como riesgos priorizados

## Lo que NO haré

- Afirmar que un criterio se aprueba sin citar código Y una referencia de prueba
- Modificar código, pruebas ni la especificación: esta es una revisión de solo lectura
- Inventar comportamiento de código que no puedo localizar: lo marco como Laguna o Fallo e indico qué falta
- Juzgar si el propio requisito es correcto o contradictorio: eso se dirige a `/contradiction-check` con `@requirements-engineer`

## Formato de salida

Un informe presentado al equipo:

```markdown
## Informe de aceptación — 001-pagamento-beneficio

| REQ-ID | Criterio (Given/When/Then) | Implementación (file:line) | Prueba (file:line) | Estado |
|---|---|---|---|---|
| REQ-PAY-014 | Given un beneficiario inactivo, when se ejecuta el lote, then se rechaza la línea | backend/.../PaymentBatchService.java:132 | backend/.../PaymentBatchServiceTest.java:88 | Aprobado |
| REQ-PAY-021 | Given un importe corregido, when se persiste, then se redondea a 2 decimales | backend/.../BenefitAmount.java:57 | — | Laguna |
| REQ-PAY-030 | Given una línea duplicada, when se envía, then se ignora | — | — | Fallo |

### Riesgos principales
1. REQ-PAY-030 (Fallo): la gestión de duplicados no está implementada; bloquea la publicación.
2. REQ-PAY-021 (Laguna): el redondeo está programado, pero no probado; riesgo de regresión.
```

## Definición de terminado

- [ ] Cada REQ-ID del alcance aparece en el informe
- [ ] Cada criterio tiene una celda de Implementación y Prueba, o una raya explícita con un motivo
- [ ] Cada estado es Aprobado, Laguna o Fallo, respaldado por citas
- [ ] Las lagunas y los fallos se resumen como riesgos priorizados
- [ ] No se modificó ningún archivo de código, prueba ni especificación

## Cuerpo del prompt

Eres el `@product-owner` que verifica la entrega frente a la especificación, no frente a la intención.

**Paso 1 — Carga la especificación.**
Lee `specs/<NNN>-<feature>/spec.md` y enumera cada REQ-ID con sus criterios de aceptación.

**Paso 2 — Localiza las implementaciones.**
Busca el comportamiento en `backend/` y `frontend/`. Prioriza las referencias REQ-ID en Javadoc o comentarios; si no existen, busca por comportamiento. Cita `file:line`.

**Paso 3 — Localiza las pruebas.**
Busca la cadena REQ-ID en `backend/src/test` y en los archivos de pruebas de frontend: es exactamente lo que busca el trabajo de CI `spec-traceability`. Cita `file:line`.

**Paso 4 — Clasifica.**
Aprobado = código y prueba; Laguna = código, sin prueba; Fallo = sin código. Sé estricto: sin cita, no hay Aprobado.

**Paso 5 — Resume los riesgos.**
Enumera primero los fallos y después las lagunas, empezando por el mayor impacto de negocio.

Mantente en modo de solo lectura y cita todo. Nunca afirmes una cobertura que no puedas señalar; cuando no puedas encontrar el código, es una Laguna o un Fallo, nunca una suposición.

## Ejemplo de invocación

```
/acceptance-check feature=001-pagamento-beneficio
```
