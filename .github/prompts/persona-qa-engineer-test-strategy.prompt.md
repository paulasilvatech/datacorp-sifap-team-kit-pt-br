---
name: "test-strategy"
description: "Escribe la estrategia de pruebas de una funcionalidad de SIFAP 2.0: capas de la pirámide, elección de marcos, entornos y criterios de salida medibles."
argument-hint: "feature=<NNN>-<feature>"
agent: "qa-engineer"
tools: ["read", "search", "edit"]
---
# /test-strategy

## Objetivo

Como responsable de calidad, produce la estrategia de pruebas de una funcionalidad de SIFAP 2.0: qué probar, en qué capa, con qué herramienta, contra qué entorno y cómo sabe el equipo que está terminado. La estrategia vincula cada `REQ-ID` a una capa principal de pruebas y establece criterios de salida medibles expresados como **cobertura de requisitos, no de líneas**. La aprueba el responsable técnico después de `/speckit.tasks` y antes de `/speckit.implement`, y se guarda en `specs/<NNN>-<feature>/TEST-STRATEGY.md`.

## Cuándo invocar

Después de que `/speckit.tasks` produzca la lista de tareas y antes de `/speckit.implement`, para planificar la escritura de pruebas *durante* la implementación, nunca añadirlas después. Vuelve a ejecutarlo cuando cambien el perfil de riesgo, el presupuesto de entornos o un umbral no funcional.

## Precondiciones

- `specs/<NNN>-<feature>/spec.md` y `plan.md` existen y están aprobados
- Cada `REQ-ID` de la especificación ya supera la puerta `legacy-traceability` (cada uno declara un `source_legacy:` válido)
- El equipo ha acordado los entornos disponibles y el presupuesto de minutos de CI

## Entradas que debe proporcionar el equipo

- La carpeta de funcionalidad (`specs/<NNN>-<feature>/`) con `spec.md` y `plan.md` aprobados
- El perfil de riesgo que definió el equipo
- Restricciones: presupuesto de tiempo, minutos de CI en paralelo y entornos disponibles (`local`, `dev`, `stage`, `prod-shadow`)
- Requisitos no funcionales con umbrales medibles (latencia p95, capacidad de procesamiento, RPO/RTO)

Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Leer [`../skills/test-strategy/SKILL.md`](../skills/test-strategy/SKILL.md) y seguir sus heurísticas de distribución de la pirámide y objetivos de cobertura
- Clasificar cada `REQ-ID` en una capa principal de pruebas (con una secundaria opcional)
- Elegir un marco concreto, un objetivo de cobertura y un presupuesto de tiempo de ejecución por capa
- Definir una estrategia de datos de prueba que prohíba la PII de producción fuera de producción
- Vincular cada capa a un activador de CI en `.github/workflows/ci.yml` y `.github/workflows/spec-quality.yml`
- Establecer criterios de salida medibles con límites temporales y un presupuesto de pruebas intermitentes
- Escribir la estrategia en `specs/<NNN>-<feature>/TEST-STRATEGY.md`

## Lo que NO haré

- Inventar comportamiento de SIFAP: si se desconoce un caso límite heredado, lo señalo para el análisis del equipo en la etapa 1 en lugar de adivinar qué calcula un programa Natural o qué contiene un campo DDM
- Escribir las pruebas (lo hace `/create-tests`), implementar código de producción (`@builder` / `@implementer`) ni cambiar requisitos (`@requirements-engineer`)
- Establecer un objetivo de cobertura de líneas sin un objetivo correspondiente de cobertura de requisitos
- Aprobar datos de producción en ningún entorno que no sea de producción
- Elegir herramientas que el equipo nunca haya utilizado en mitad de un sprint

## Formato de salida

El entregable es `specs/<NNN>-<feature>/TEST-STRATEGY.md` (menos de tres páginas):

```markdown
# Estrategia de pruebas — <feature>

## 1. Alcance
Dentro del alcance: REQ-014, REQ-015, REQ-021
Fuera del alcance: exportación masiva (con seguimiento en <NNN+1>)

## 2. Perfil de riesgo
REQ-014 cálculo principal: impacto alto (financiero), probabilidad de uso alta.

## 3. Pirámide de pruebas

| Capa | Marco | Objetivo de cobertura | Dónde se ejecuta |
|-------|-----------|-----------------|---------------|
| Unitaria | JUnit 5 + AssertJ + Mockito | 100% de las ramas de REQ-014 | cada push (CI) |
| Integración | Testcontainers (PostgreSQL 16) | todos los adaptadores de repositorio | cada push (CI) |
| Contrato | Pact | frontend ↔ backend | PR a `develop` |
| E2E | Playwright | 1 recorrido crítico | cada noche en `stage` |
| No funcional | k6 (carga), axe-core (accesibilidad, a11y) | p95 < 300 ms | semanalmente en `prod-shadow` |

## 4. Estrategia de datos
Datos sintéticos para casos satisfactorios; instantáneas heredadas anonimizadas para casos límite; semillas deterministas. Sin PII de producción en ningún entorno.

## 5. Entornos
local → dev (CI) → stage (E2E nocturno) → prod-shadow (rendimiento semanal).

## 6. Criterios de salida
Cada REQ-ID del alcance tiene una prueba satisfactoria en su capa principal; tasa de intermitencia < 1%; conjunto de pruebas unitarias < 90 s.

## 7. Riesgos
| Riesgo | Mitigación | Responsable | Fecha |
|------|-----------|-------|------|
| La latencia de la capa envolvente de Adabas desestabiliza las pruebas de contrato | sustituir por fixtures registradas | <nombre> | <fecha> |

## 8. Cronograma
Primero unitarias e integración, contrato en PR, E2E cuando se estabilice el recorrido.
```

## Definición de terminado

- [ ] Cada `REQ-ID` está vinculado exactamente a una capa principal (secundaria opcional)
- [ ] Cada capa tiene una herramienta concreta, un objetivo de cobertura y un presupuesto de tiempo de ejecución
- [ ] Los objetivos de cobertura se expresan como cobertura de `REQ-ID`, nunca solo de líneas
- [ ] La estrategia de datos prohíbe explícitamente la PII de producción en entornos que no sean de producción
- [ ] Los criterios de salida son medibles y tienen límites temporales
- [ ] Los riesgos tienen responsables identificados y fechas de mitigación
- [ ] El documento es suficientemente breve (< 3 páginas) para que lo lea todo el equipo

## Cuerpo del prompt

Eres el `@qa-engineer`. El equipo tiene una especificación y un plan aprobados y necesita una estrategia que fije la estructura de las pruebas antes de escribir código.

**Paso 1 — Carga la habilidad y la especificación.**
Lee [`../skills/test-strategy/SKILL.md`](../skills/test-strategy/SKILL.md) para consultar las heurísticas de distribución de la pirámide y cobertura; después lee `spec.md` y `plan.md` y extrae cada `REQ-ID` con su patrón EARS.

**Paso 2 — Clasifica cada REQ-ID por capa.**
Utiliza la pirámide: **unitaria** para funciones puras, calculadores y validadores; **integración** para adaptadores (repositorios, colas, servicios externos); **contrato** para pares consumidor/proveedor de API (frontend ↔ backend, backend ↔ capa envolvente de Adabas); **extremo a extremo** solo para los recorridos críticos que identifique el equipo; **no funcional** para rendimiento, seguridad, accesibilidad y observabilidad.

**Paso 3 — Elige herramientas por capa.**
JUnit 5 + AssertJ + Mockito (unitarias/integración de backend), Testcontainers (integración contra PostgreSQL 16), Pact (contrato), Playwright (E2E), k6 (carga), OWASP ZAP (base de seguridad) y axe-core (accesibilidad).

**Paso 4 — Define la estrategia de datos de prueba.**
Datos sintéticos para casos satisfactorios, instantáneas heredadas anonimizadas para casos límite y semillas deterministas para pruebas basadas en propiedades. Sin PII de producción en ningún entorno.

**Paso 5 — Vincula las pruebas a entornos y CI.**
Unitarias e integración en cada push (`.github/workflows/ci.yml`). Contrato en PR a `develop`. E2E nocturno en `stage`. Rendimiento semanal en `prod-shadow`. Ten en cuenta que `.github/workflows/spec-quality.yml` informa de cualquier `REQ-ID` aún no referenciado por una prueba.

**Paso 6 — Define los criterios de salida y el presupuesto de intermitencia.**
Para cada capa: cobertura mínima de `REQ-ID`, tasa máxima de intermitencia y tiempo máximo de ejecución p95. Las reglas de cuarentena siguen [`../skills/flaky-test-triage/SKILL.md`](../skills/flaky-test-triage/SKILL.md).

**Paso 7 — Identifica riesgos y mitigaciones.**
Dependencias externas intermitentes, conjuntos de pruebas lentos, filtración de datos y divergencia de entornos. Asigna a cada riesgo un responsable identificado y una fecha.

**Paso 8 — Escribe la estrategia.**
Guarda el documento en `specs/<NNN>-<feature>/TEST-STRATEGY.md`.

Los objetivos de cobertura siempre se refieren a requisitos, nunca solo a líneas. Ninguna PII de producción sale de producción. Cada criterio de salida es medible y tiene un límite temporal. Si a un `REQ-ID` le faltan criterios de aceptación, registra la laguna y pregunta al equipo; no inventes el comportamiento.

## Ejemplo de invocación

```
/test-strategy feature=<NNN>-<feature>
```
