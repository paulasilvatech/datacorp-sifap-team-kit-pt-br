# STATUS diario — Panel de progreso

> **Ruta:** [Kit del equipo](../README.md) › [Documentación](README.md) › **STATUS**

**Panel de seguimiento de la inmersión en tiempo real:** estado de las etapas, transiciones y métricas diarias.

![Panel](https://img.shields.io/badge/Dashboard-Daily%20status-171717?style=flat-square) ![Actualización](https://img.shields.io/badge/Update-every%2030%20min-737373?style=flat-square) ![Responsable](https://img.shields.io/badge/Owner-Technical%20Lead-A3A3A3?style=flat-square)

| Campo | Valor |
|---|---|
| **Público objetivo** | Líder Técnico (actualiza) y persona facilitadora (consulta de un vistazo) |
| **Frecuencia de actualización** | Cada 30 minutos o en cada transición de etapa |
| **Resultado esperado** | Vista de una página de lo que está listo, en curso y bloqueado |

---

## Estado general

| Indicador | Estado | Notas |
|---|---|---|
| Todo el equipo presente | — | Actualizar: OK o Parcial |
| Herramientas locales validadas en 5/5 portátiles | — | — |
| Rama `develop` protegida | — | — |
| CI en verde en `develop` | — | — |
| Demo ensayada | — | — |

---

## Progreso de las cuatro etapas

| Etapa | Estado | Responsable | Inicio | ¿DoD completa? | Notas |
|---|---|---|---|---|---|
| **1 — Arqueología** | No iniciada | Todas las parejas | — | No | — |
| **2 — Especificación** | Esperando la transición H1 | Pareja 2 | — | No | — |
| **3 — Implementación** | Esperando la transición H2 | Parejas 3 y 4 | — | No | — |
| **4 — Evolución** | Esperando la transición H3 | Pareja 5 | — | No | — |

**Leyenda de estados:** No iniciada · En curso · Completa · Retrasada · Bloqueada

---

## Transiciones de etapa

| Transición | Origen y destino | Cuándo | Estado |
|---|---|---|---|
| **H1** | Pareja 1 a Pareja 2 | Final de la Etapa 1 | No completada |
| **H2** | Pareja 2 a Parejas 3 y 4 | Final de la Etapa 2 | No completada |
| **H3** | Parejas 3 y 4 a Pareja 5 | Final de la Etapa 3 | No completada |

> [!NOTE]
> Cada transición es una conversación síncrona de cinco minutos entre las parejas que entregan y reciben. El cronograma detallado está en [`00-TEAM-FLOW.md`](../00-TEAM-FLOW.md).

---

## Métricas diarias

| Métrica | Meta | Actual |
|---|---|---|
| Fuentes del legado confirmadas para el alcance | Cada REQ-ID | — |
| Especificación formal (`spec.md`, `plan.md`, `tasks.md`) | Una funcionalidad completa | — |
| Decisiones de alcance registradas | Al menos una | — |
| Primer incremento implementado | Uno | — |
| Cobertura de pruebas del backend | Al menos 70% | — |
| Cobertura de pruebas del frontend | Al menos 60% | — |
| Issues creadas para el modo Agent | Al menos una | — |
| PR integradas en `develop` | — | — |

---

## Alertas activas

> [!WARNING]
> Añade una entrada a continuación cuando aparezca un bloqueo o riesgo. El Líder Técnico la lee en voz alta en la siguiente reunión breve.

- [ ] (sin alertas actuales)

---

## Hitos alcanzados

Marca cada hito a medida que se alcance:

- [ ] **Primera regla de negocio documentada con `Programa de origen`** — entrada de la Etapa 1 completada.
- [ ] **Primera especificación EARS escrita** con el campo `source_legacy:` completado.
- [ ] **Primera decisión de alcance registrada** y vinculada al plan.
- [ ] **CI en verde en la primera pull request** — pipeline de integración aprobado.
- [ ] **Primer endpoint REST funcional** y visible mediante Swagger.
- [ ] **Cobertura de pruebas del backend igual o superior al 70%**.
- [ ] **Primera pull request del modo Agent revisada e integrada**.
- [ ] **Plan de Terraform completado sin errores**.
- [ ] **Demostración final de SIFAP 2.0 completada correctamente**.

---

## Registro de reuniones breves (una frase por pareja en cada transición)

### H1 — Final de la Etapa 1

| Pareja | Persona | Registro |
|---|---|---|
| Pareja 1 | Visión (PO + RE) | ___ |
| Pareja 2 | Arquitectura (EA + SA) | ___ |
| Pareja 3 | Implementación (TL + Dev) | ___ |
| Pareja 4 | Calidad (DBA + QA) | ___ |
| Pareja 5 | Operaciones (DevOps + TW) | ___ |

### H2 — Final de la Etapa 2

| Pareja | Registro |
|---|---|
| Pareja 1 | ___ |
| Pareja 2 | ___ |
| Pareja 3 | ___ |
| Pareja 4 | ___ |
| Pareja 5 | ___ |

### H3 — Final de la Etapa 3

| Pareja | Registro |
|---|---|
| Pareja 1 | ___ |
| Pareja 2 | ___ |
| Pareja 3 | ___ |
| Pareja 4 | ___ |
| Pareja 5 | ___ |

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Guion de la demo](demo-script.md)<br/><sub>Guion para la demostración final de tres minutos.</sub> | [Lista de verificación del líder](CHECKLIST-LIDER.md)<br/><sub>Guía hora por hora para el Líder Técnico.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
