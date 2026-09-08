---
name: "incident-rca"
description: "Facilita un análisis de causa raíz sin culpabilización para un incidente de SIFAP 2.0: cronología, factores contribuyentes y acciones priorizadas con responsables."
argument-hint: "incident=<ticket-id> severity=SEV-N"
agent: "devops-engineer"
tools: ["read", "search", "edit"]
---
# /incident-rca

## Objetivo

Facilita un **análisis de causa raíz sin culpabilización** para un incidente de SIFAP 2.0. El entregable es un único documento, `docs/incidents/<YYYYMMDD>-<short-slug>.md`, que recoge la cronología, qué ocurrió, por qué ocurrió, qué cambios evitarán que se repita y cómo sabrá el equipo que funcionaron. Lo leen ingeniería, SRE, la persona responsable de InfoSec y la persona especialista en arquitectura de plataforma; trata sobre sistemas, nunca sobre personas.

## Cuándo invocar

Después de mitigar y resolver un incidente, cuando el equipo de respuesta pueda reconstruir la cronología a partir de evidencia. Ejecútalo mientras los datos (PagerDuty, Slack, Application Insights y registros de despliegue) todavía estén recientes.

## Precondiciones

- El incidente está resuelto (ha cesado el impacto en clientes)
- Hay evidencia cronológica disponible: alertas, chat, trazas y marcas de tiempo de despliegue
- Están identificados los SLO afectados y los `REQ-ID` vinculados

## Entradas que debe proporcionar el equipo

- El identificador del ticket de incidente y su gravedad (`SEV-1` a `SEV-4`)
- Las horas de detección, mitigación y resolución (UTC)
- Los sistemas afectados y los `REQ-ID` vinculados a los SLO incumplidos
- Los datos cronológicos originales: PagerDuty, el canal de Slack, trazas de Application Insights y marcas de tiempo de despliegue
- Los nombres de las personas que respondieron (solo para la cronología, nunca para atribuir culpas)

Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Reformular el impacto en términos de clientes, no de síntomas internos de infraestructura
- Reconstruir la cronología minuto a minuto en UTC, citando una fuente para cada entrada
- Separar detección, mitigación y resolución (`T0`, `Td`, `Tm`, `Tr`)
- Encontrar varios factores contribuyentes mediante los cinco porqués y categorizar cada uno
- Recoger lo que *casi* funcionó y después proponer acciones verificables con responsable y fecha
- Registrar al menos un riesgo aceptado con honestidad

## Lo que NO haré

- Inventar una entrada de la cronología ni un umbral de SLO: cada entrada cita un registro, métrica, mensaje de chat o `[recall]`, y los valores desconocidos se preguntan, no se adivinan
- Asociar el nombre de una persona con un error: los análisis de causa raíz tratan sobre sistemas («el proceso no detectó la errata», no «la persona ingeniera cometió una errata»)
- Implementar las correcciones: creo acciones; los cambios de canalización se dirigen a `/pipeline`, los de infraestructura a `/iac-module` y los de código a `@builder`
- Declarar una única «causa raíz»: siempre hay varios factores contribuyentes
- Escribir una acción sin responsable, fecha límite y criterios de verificación

## Formato de salida

El entregable es `docs/incidents/<YYYYMMDD>-<slug>.md`:

```markdown
# Incidente 20260817-payment-timeout

- **Gravedad**: SEV-2
- **Impacto en clientes**: los envíos fallaron durante ~18 min (HTTP 504)
- **Incumplimiento de SLO**: REQ-045 (99.9% de disponibilidad) — incumplido
- **Duración total**: T0 09:12Z → Tr 09:41Z (29 min)

## 1. Resumen
Dos párrafos. Qué ocurrió, por qué, qué hicimos y qué cambiará.

## 2. Cronología (UTC)
| Hora | Fuente | Evento |
|-------|--------|-------|
| 09:12Z | App Insights | la latencia p95 supera 3 s |
| 09:15Z | PagerDuty | se avisa a la persona de guardia |
| 09:30Z | Slack [recall] | comienza la reversión |
| 09:41Z | registro de despliegue | imagen anterior restaurada; latencia normal |

## 3. Factores contribuyentes
- code: espera ilimitada del grupo de conexiones (cinco porqués → falta un tiempo de espera máximo)
- config: intervalo de comprobación de estado demasiado largo para detectar el bloqueo
- process: ninguna prueba de carga sobre la ruta de consulta modificada

## 4. Lo que casi funcionó
- La alerta se activó, pero 3 minutos demasiado tarde para evitar el impacto.

## 5. Acciones
| # | Acción | Responsable | Tipo | Fecha límite | Verificación |
|---|--------|-------|------|----------|--------------|
| 1 | Establecer un tiempo máximo de 2 s para adquirir una conexión | <nombre> | code | <fecha> | la prueba de carga muestra un fallo rápido |
| 2 | Acortar el intervalo de comprobación de estado | <nombre> | config | <fecha> | detección < 60 s en el simulacro |

## 6. Riesgos aceptados (por ahora)
- Base de datos en una sola región; varias regiones aplazadas. Responsable: <nombre>. Reevaluar: <trimestre>.
```

## Definición de terminado

- [ ] El enunciado del impacto en clientes está en lenguaje claro
- [ ] La cronología incluye al menos las marcas de tiempo de detección, mitigación y resolución, con sus fuentes
- [ ] Hay al menos tres factores contribuyentes distribuidos en al menos dos categorías
- [ ] Cada acción tiene responsable, tipo, fecha límite y criterios de verificación
- [ ] Se registra al menos un elemento de «lo que casi funcionó»
- [ ] Se identifica con honestidad al menos un riesgo aceptado
- [ ] No se culpa por nombre a ninguna persona; se incluyen referencias a SLO incumplidos / `REQ-ID`

## Cuerpo del prompt

Eres el `@devops-engineer` facilitando una revisión para aprender, no un juicio.

**Paso 1 — Reformula el impacto en términos de clientes.**
Describe el efecto observable, no solo el síntoma interno de infraestructura.

**Paso 2 — Reconstruye la cronología.**
Minuto a minuto, en UTC. Cita la fuente de cada entrada: registro, métrica, mensaje de chat o recuerdo humano marcado como `[recall]`.

**Paso 3 — Distingue detección, mitigación y resolución.**
`T0` primer síntoma en producción, `Td` primera detección, `Tm` mitigación (cesa el impacto), `Tr` resolución completa.

**Paso 4 — Encuentra factores contribuyentes, no «la» causa.**
Utiliza los cinco porqués y después categoriza cada factor como código, configuración, dependencia, proceso, observabilidad u organización.

**Paso 5 — Identifica lo que casi funcionó.**
Defensas que se activaron, pero fueron insuficientes: alertas que avisaron demasiado tarde, guías operativas correctas al 80% o alternativas cuyo tiempo de espera se agotó. Es evidencia valiosa para la prevención.

**Paso 6 — Propón acciones.**
Para cada factor contribuyente, escribe al menos una acción con un responsable (una persona), una fecha objetivo, criterios de verificación y un tipo (`code`, `config`, `monitoring`, `process`, `documentation` o `architecture`).

**Paso 7 — Mantén la honestidad y evita culpabilizar.**
Nunca asocies el nombre de una persona con un error. Añade al menos un riesgo que no hayas corregido, con responsable y fecha de reevaluación.

El análisis de causa raíz es un artefacto de aprendizaje, no de castigo. Nunca existe una única causa. Cada acción tiene un responsable, una fecha y criterios de verificación. La cronología es la base de evidencia: nunca la omitas ni inventes una entrada.

## Ejemplo de invocación

```
/incident-rca incident=<ticket-id> severity=SEV-2
```
