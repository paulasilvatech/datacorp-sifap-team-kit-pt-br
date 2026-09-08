# @builder — Etapa 3: implementación

> **Ruta:** [Kit del equipo](../../README.md) › [Agentes de etapa](../README.md) › **@builder**

**El agente `@builder` ejecuta la especificación de la Etapa 2, transformando los requisitos EARS en código Java 21 + Spring Boot + Next.js 15 con pruebas trazables y migraciones Flyway.**

| Campo | Valor |
|---|---|
| **Público objetivo** | Desarrollador (lidera), Líder Técnico, DBA e Ingeniero de Calidad durante la Etapa 3 |
| **Prerrequisitos** | Transición de la Etapa 2 con `spec.md`, `plan.md`, `tasks.md` y un primer incremento priorizado |
| **Tiempo estimado** | 15:00–16:10 |
| **Etapa** | Etapa 3 — Implementación |
| **Resultado esperado** | El backend y el frontend compilan, las pruebas se aprueban y los commits incluyen `Implements REQ-...` |

![Etapa 3](https://img.shields.io/badge/Stage-3%20%C2%B7%20Implementation-171717?style=flat-square)
![Enfoque constructivo](https://img.shields.io/badge/Approach-Constructive-404040?style=flat-square)

---

## Cuándo usarlo

Usa este agente cuando exista la especificación y el equipo necesite construir. `@builder` no reemplaza el diseño. Ejecuta `spec.md`, `plan.md` y `tasks.md` mediante código, pruebas y trazabilidad.

- **Lidera:** Desarrollador
- **Apoyo principal:** Líder Técnico, DBA, Ingeniero de Calidad y Arquitecto de Software
- **Prerrequisito de la puerta obligatoria:** existen `spec.md`, `plan.md` y `tasks.md`, y el primer incremento está priorizado

---

## Lo que hace el agente

- Traduce reglas Natural/Adabas a Java 21 con trazabilidad a REQ-ID
- Genera entidades JPA a partir de DDM de Adabas y explica cada mapeo
- Crea controladores REST `/api/v1/...` con DTO, Bean Validation y anotaciones OpenAPI
- Escribe pruebas JUnit 5 con Testcontainers para las reglas de negocio críticas
- Genera migraciones Flyway idempotentes
- Crea páginas de Next.js 15 App Router que consumen endpoints REST

---

## Lo que el agente NO hace

- No escribe código sin un REQ-ID referenciado en la especificación
- No crea una arquitectura nueva; sigue los ADR y el plan técnico de la Etapa 2
- No registra en logs CPF, importes de beneficios ni ningún dato sensible
- No omite las pruebas para avanzar más rápido; al menos la prueba mínima de la regla crítica es obligatoria

---

## Entradas

| Entrada | Ubicación |
|---|---|
| Especificación de la funcionalidad | `specs/<NNN>-<feature>/spec.md` |
| Plan técnico | `specs/<NNN>-<feature>/plan.md` |
| Lista de tareas | `specs/<NNN>-<feature>/tasks.md` |
| ADR de arquitectura | `02-modern-spec/` o `docs/adr/` |
| DDM mapeados | `01-archaeology/business-rules-catalog.md` |

---

## Salidas esperadas

| Artefacto | Ubicación |
|---|---|
| Código de backend Java 21 | `backend/src/main/java/` |
| Migraciones Flyway | `backend/src/main/resources/db/migration/` |
| Pruebas JUnit 5 | `backend/src/test/java/` |
| Código de frontend Next.js | `frontend/` |
| Commits trazables | Mensaje: `Implements REQ-NNN: <short description>` |

---

## Cómo seleccionar el agente en Copilot Chat

- [ ] **Abre Copilot Chat** en VS Code (`Ctrl+Alt+I` / `Cmd+Alt+I`).
- [ ] **Selecciona `@builder`** en el selector de agentes.
- [ ] **Abre `tasks.md`** e identifica la siguiente tarea que debes implementar.
- [ ] **Pega el prompt de apertura** que aparece a continuación y pulsa Enter.

```text
Estoy comenzando la Etapa 3 — Implementación.
Tenemos spec.md, plan.md, tasks.md, ADR y un modelo de datos.
Ayuda a implementar la siguiente tarea trazable con Java 21 + Spring Boot,
PostgreSQL/JPA y Next.js, empezando por las pruebas de las reglas de negocio.
```

---

## Ejemplos de prompts

| Situación | Prompt útil |
|---|---|
| Entidad JPA | "Genera la entidad a partir de este DDM y explica cada mapeo." |
| Regla Natural | "Traduce esta regla a Java con nombres claros y una prueba de equivalencia." |
| Controlador REST | "Crea un controlador `/api/v1/...` con DTO, validación y OpenAPI." |
| Frontend | "Crea una página de Next.js App Router que consuma este endpoint sin exponer secretos." |
| Pruebas | "Escribe una prueba JUnit para REQ-NNN y añade el comentario de trazabilidad." |

---

## Definición de terminado

- [ ] El backend compila y `mvn test` (o equivalente) se aprueba.
- [ ] El frontend compila y `npm test` (o equivalente) se aprueba cuando existe un frontend.
- [ ] El primer incremento de la funcionalidad funciona dentro del alcance seleccionado.
- [ ] Solo existe una interfaz o endpoint cuando el alcance lo requiere.
- [ ] Las migraciones Flyway se aplican sin errores a una base de datos limpia.
- [ ] Las pruebas citan REQ-ID en comentarios inline.
- [ ] Los commits que implementan comportamiento mencionan `Implements REQ-...`.

---

## Errores comunes

| Síntoma | Causa | Corrección |
|---|---|---|
| Código sin un REQ-ID | Se inició la tarea sin comprobar la especificación | Vuelve a `tasks.md` y encuentra el requisito correspondiente |
| Nueva decisión de arquitectura en la Etapa 3 | Llegó una especificación incompleta al agente de implementación | Detente, resuélvela en la Etapa 2 con `@architect` y después continúa |
| Prueba omitida por falta de tiempo | Presión por entregar | Escribe al menos la prueba mínima de la regla crítica antes de crear el commit |
| CPF o importe en los logs | Se pasó por alto la política de datos | Enmascara los logs; nunca registres `cpf`, `valor` ni `beneficio` directamente |

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [@architect](../02-architect/README.md)<br/><sub>Etapa 2: especificación moderna con Spec-Kit.</sub> | [@evolution](../04-evolution/README.md)<br/><sub>Etapa 4: delegar, revisar y registrar el resultado.</sub> |

<sub>[Volver al índice del kit](../../README.md)</sub>
