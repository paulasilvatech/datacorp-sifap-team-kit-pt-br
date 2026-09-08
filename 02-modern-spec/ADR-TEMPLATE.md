# ADR-XXX: título de la decisión

> **Ruta:** [Kit del equipo](../README.md) › [Etapa 2](README.md) › **Plantilla de ADR**

> [!NOTE]
> Este archivo es una plantilla de apoyo. Cópiala a `ADR-NNN-title.md` y complétala. No edites el original.
> Usa esta plantilla cuando una decisión de arquitectura bloquee el `plan.md` de la funcionalidad.

![Etapa 2](https://img.shields.io/badge/Stage-2%20%C2%B7%20Specification-171717?style=flat-square) ![Tipo: plantilla de ADR](https://img.shields.io/badge/Type-ADR%20Template-737373?style=flat-square)

| Campo | Valor |
|---|---|
| **Fecha** | `YYYY-MM-DD` |
| **Estado** | Propuesto / Aceptado / Rechazado / Sustituido por ADR-YYY |
| **Responsables de la decisión** | Nombres de los integrantes del equipo involucrados |
| **Funcionalidad relacionada** | `specs/<NNN>-<feature>/` |

---

## Concepto: ADR (registro de decisión de arquitectura)

Un ADR es el registro formal de una decisión de arquitectura significativa. Documenta el contexto que llevó a la decisión, las alternativas evaluadas, la opción seleccionada y las consecuencias esperadas.

**Por qué importa:** las decisiones técnicas tomadas verbalmente durante la inmersión se pierden. Un ADR de dos páginas garantiza que cualquier persona que revise una PR entienda por qué se diseñó el sistema de una manera determinada, sin tener que preguntar a quien tomó la decisión a las 14:30 de un día ajetreado.

**Regla de oro:** enumera siempre el "camino no elegido". Sin él, el ADR se convierte en una descripción de la implementación en lugar de un registro de decisión.

**Cuándo crear uno:** solo cuando la decisión bloquee `plan.md`. Si la decisión cabe en un comentario de commit, no necesita un ADR.

---

## Contexto

> Describe el problema o la necesidad que motivó esta decisión.
> Incluye las restricciones, los requisitos y la información relevantes.
> Sé específico: "necesitamos una base de datos" no basta.

<!-- completar -->

---

## Opciones consideradas

### Opción 1: <!-- nombre -->

| Aspecto | Evaluación |
|---|---|
| **Descripción** | Cómo funcionaría |
| **Ventajas** | Enumerarlas |
| **Desventajas** | Enumerarlas |

### Opción 2: <!-- nombre -->

| Aspecto | Evaluación |
|---|---|
| **Descripción** | Cómo funcionaría |
| **Ventajas** | Enumerarlas |
| **Desventajas** | Enumerarlas |

### Opción 3: <!-- nombre, opcional -->

| Aspecto | Evaluación |
|---|---|
| **Descripción** | Cómo funcionaría |
| **Ventajas** | Enumerarlas |
| **Desventajas** | Enumerarlas |

---

## Decisión

**Decidimos** <!-- acción u opción seleccionada -->.

---

## Justificación

> Explica por qué se seleccionó esta opción frente a las demás.
> Relaciónala con los requisitos, las restricciones y el contexto.

<!-- completar -->

---

## Consecuencias

### Positivas

- <!-- consecuencia positiva 1 -->

### Negativas

- <!-- consecuencia negativa 1 y cómo mitigarla -->

### Riesgos

- <!-- riesgo identificado y plan de contingencia -->

---

## Referencias

- <!-- enlace o documento relevante -->
- Requisito EARS relacionado: `REQ-XXX`

<details>
<summary><strong>Ejemplo completado — ADR-001: base de datos para SIFAP 2.0</strong></summary>

| Campo | Valor |
|---|---|
| **Fecha** | 2026-05-10 |
| **Estado** | Aceptado |
| **Responsables de la decisión** | Pareja 2 (Arquitectura Empresarial + Arquitectura de Software) |
| **Funcionalidad relacionada** | `specs/001-pagamento-beneficio/` |

**Contexto:** el SIFAP heredado (Sistema de Fiscalización y Administración de Pagos) usa Adabas, una base de datos navegacional. La modernización necesita una base de datos relacional compatible con JPA/Hibernate y respaldada por el equipo de operaciones.

**Opciones:**

- PostgreSQL 16: código abierto, compatibilidad con JSONB y Testcontainers disponible.
- MySQL 8: amplio soporte, pero menor adopción en entornos gubernamentales brasileños.

**Decisión:** PostgreSQL 16.

**Justificación:** adopción consolidada en sistemas del sector público, compatibilidad nativa con tipos avanzados (JSONB para campos DDM variables) e integración con Testcontainers sin licencia adicional.

**Consecuencias positivas:** Testcontainers simplifica las pruebas de integración. **Consecuencias negativas:** el equipo de DBA necesita familiarizarse con PostgreSQL.

</details>

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [GUÍA de la Etapa 2](GUIDE.md)<br/><sub>Instrucciones paso a paso de la etapa.</sub> | [GUÍA de la Etapa 2](GUIDE.md)<br/><sub>Lidera la decisión junto con el equipo.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
