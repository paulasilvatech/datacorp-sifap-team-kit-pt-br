---
name: "coverage-gaps"
description: "Audita la cobertura de pruebas por REQ-ID e informa de requisitos sin probar, casos límite ausentes y lagunas entre especificación y pruebas, ordenados por riesgo."
argument-hint: "feature=<NNN>-<feature> scope=all|diff|REQ-COMP"
agent: "qa-engineer"
tools: ["read", "search", "execute"]
---
# /coverage-gaps

## Objetivo

Audita la cobertura de pruebas de SIFAP 2.0 y entrega una lista priorizada de **requisitos sin probar o insuficientemente probados**, no un porcentaje. La cobertura de líneas es una métrica de vanidad; la cobertura de requisitos es la verdad. El informe está listo para pegar en un ticket de planificación de sprint, con el mayor riesgo primero y una propuesta de prueba de una línea por cada laguna.

## Cuándo invocar

Antes de declarar terminado un contexto delimitado, durante una revisión de PR o antes de planificar un sprint: siempre que el equipo necesite saber qué requisitos están realmente verificados y cuáles simplemente se ejecutan.

## Precondiciones

- `specs/<NNN>-<feature>/spec.md` declara los `REQ-ID` del alcance
- Existen fuentes de implementación y pruebas en `backend/` y/o `frontend/`
- Hay disponible un informe de cobertura o puede generarse (XML de JaCoCo para backend, LCOV de Vitest para frontend)

## Entradas que debe proporcionar el equipo

- La carpeta de funcionalidad (`specs/<NNN>-<feature>/`) y las carpetas de implementación
- Un informe de cobertura reciente o permiso para generar uno
- El alcance: todos los `REQ-ID` de la carpeta, solo las diferencias de esta PR o solo el conjunto regulatorio `REQ-COMP-*`

Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Construir un inventario de requisitos a partir de `spec.md`, organizado por `REQ-ID` y patrón EARS
- Contrastar con la salida del trabajo `spec-traceability` de `.github/workflows/spec-quality.yml` para identificar los `REQ-ID` que la CI ya señala como no probados
- Vincular cada `REQ-ID` a sus pruebas y calificarlo como `MISSING`, `WEAK` u `OK`
- Inspeccionar las variantes EARS para encontrar casos negativos y de transición de estados ocultos
- Comprobar de forma general los casos límite derivados del sistema heredado frente a `01-archaeology/legacy-sifap/natural-programs/`
- Puntuar cada laguna por riesgo y entregar la lista priorizada

## Lo que NO haré

- Inventar comportamiento de SIFAP, un requisito ausente ni un caso límite heredado: referencio `01-archaeology/legacy-sifap/` de forma general y pregunto al equipo cuando se desconoce un valor
- Escribir las pruebas (`/create-tests`), implementar correcciones (`@builder`) ni editar la especificación (`@requirements-engineer`)
- Informar de un porcentaje de cobertura de líneas como si fuera cobertura de comportamiento
- Considerar suficientes las pruebas redundantes del caso satisfactorio ni tratar las instantáneas de interfaz como cobertura de requisitos UX
- Sugerir pruebas que verifiquen detalles de implementación (métodos privados, cadenas SQL)

## Formato de salida

Un informe Markdown devuelto directamente en la respuesta:

```markdown
## Informe de lagunas de cobertura — <feature>

### Resumen
- Requisitos del alcance: 12
- OK: 7 — WEAK: 3 — MISSING: 2
- Laguna de mayor riesgo: REQ-014 (no se rechaza un importe no positivo)

### Lagunas por riesgo

| REQ-ID | Patrón EARS | Estado | Riesgo (P×I) | Propuesta de prueba |
|--------|--------------|--------|-----------|--------|
| REQ-014 | No deseado | MISSING | 9 | añadir una prueba negativa para importe <= mínimo |
| REQ-021 | Guiado por estados | WEAK | 6 | añadir una prueba de transición de reentrada |
| REQ-015 | Guiado por eventos | WEAK | 4 | añadir una prueba negativa de «el evento no ocurrió» |

### Casos límite heredados aún sin cubrir
- Límite de un programa Natural en `01-archaeology/legacy-sifap/natural-programs/`: confirmar con el equipo y después vincular a REQ-014.

### Pruebas adicionales sugeridas
1. `AmountRuleTest#should_reject_when_amount_below_minimum`
2. `StatusMachineTest#should_allow_reentry_after_exit`
```

## Definición de terminado

- [ ] Cada `REQ-ID` del alcance aparece exactamente una vez en el informe
- [ ] Cada laguna tiene una puntuación de riesgo (probabilidad × impacto) y una propuesta de prueba de una línea
- [ ] Los requisitos negativos o de comportamiento no deseado sin prueba negativa están marcados como `WEAK` o `MISSING`
- [ ] Los casos límite heredados se comprueban explícitamente frente a `01-archaeology/legacy-sifap/natural-programs/`
- [ ] Las tres lagunas principales incluyen nombres de pruebas concretos listos para asignar
- [ ] La salida está lista para pegar en un ticket de planificación de sprint

## Cuerpo del prompt

Eres el `@qa-engineer` que audita si los requisitos están realmente verificados. Sigue la pirámide y la filosofía de cobertura de [`../skills/test-strategy/SKILL.md`](../skills/test-strategy/SKILL.md).

**Paso 1 — Construye el inventario de requisitos.**
Analiza `spec.md` y extrae cada `REQ-ID` con su patrón EARS y sus criterios de aceptación.

**Paso 2 — Encuentra pruebas por REQ-ID.**
Busca en las fuentes de pruebas `REQ-NNN`, `@Tag("REQ-NNN")`, `@implements REQ-NNN`, `describe('REQ-NNN', ...)` y convenciones de nombres como `Req014_*`. Contrasta con el trabajo `spec-traceability` de `.github/workflows/spec-quality.yml`, que ya enumera los `REQ-ID` declarados en `specs/` pero no referenciados por pruebas.

**Paso 3 — Vincula pruebas con requisitos.**
Para cada `REQ-ID`, enumera las pruebas que lo cubren y califícalo como `MISSING` (ninguna), `WEAK` (solo una prueba del caso satisfactorio) u `OK` (caso satisfactorio más al menos un caso de límite o error).

**Paso 4 — Inspecciona las variantes EARS en busca de casos ocultos.**
Los requisitos guiados por eventos y de comportamiento no deseado (`If ...`) casi siempre necesitan una prueba negativa. Los requisitos guiados por estados (`While ...`) necesitan una prueba de transición. Señala los que carezcan de ella.

**Paso 5 — Contrasta con el sistema heredado.**
Para los requisitos vinculados a un programa Natural de `01-archaeology/legacy-sifap/natural-programs/`, confirma que estén cubiertos los casos límite que el equipo identificó en la etapa 1. Referencia las rutas de forma general; no afirmes qué calcula un programa específico.

**Paso 6 — Puntúa por riesgo.**
Puntúa la probabilidad (con qué frecuencia se ejecuta en producción) y el impacto (financiero, regulatorio, de seguridad) en una escala de 1–3. Riesgo = probabilidad × impacto. Sitúa primero el mayor riesgo.

**Paso 7 — Entrega la lista priorizada de lagunas.**
Incluye una propuesta de una línea por laguna (la forma de la prueba ausente, no su código) y nombres concretos para las tres principales.

Informa de la cobertura de requisitos, nunca de una cifra aislada de cobertura de líneas. Un `REQ-ID` con cinco pruebas de «debería funcionar» y cero pruebas de «no debería» es `WEAK`. Cada laguna incluye una puntuación de riesgo. Nunca inventes un requisito ni un caso límite heredado: señala lo desconocido y pregunta al equipo.

## Ejemplo de invocación

```
/coverage-gaps feature=<NNN>-<feature> scope=all
```
