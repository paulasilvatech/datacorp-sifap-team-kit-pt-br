# Lista de verificación del líder del equipo

![Lista de verificación](https://img.shields.io/badge/Type-Checklist-171717?style=flat-square)
![Persona Líder Técnico](https://img.shields.io/badge/Persona-Technical%20Lead-737373?style=flat-square)
![Duración: todo el día](https://img.shields.io/badge/Duration-All%20day-A3A3A3?style=flat-square)

> **Ruta:** [Kit del equipo](../README.md) › [Documentación](README.md) › **Lista de verificación del líder**

**Lista cronológica para el Líder Técnico** — desde la preparación previa a la inmersión hasta la demostración final.

| Campo | Valor |
|---|---|
| **Público objetivo** | Quien desempeña la persona Líder Técnico (Pareja 3) |
| **Prerrequisitos** | Leer [`00-TEAM-FLOW.md`](../00-TEAM-FLOW.md) |
| **Resultado esperado** | El equipo mantiene el ritmo, las transiciones ocurren a tiempo y se realiza la demo |

---

## Antes de que empiece la inmersión (D-1, la noche anterior)

- [ ] **Comprueba los portátiles** — los cinco tienen VS Code Insiders instalado.
- [ ] **Comprueba las cuentas de GitHub** — las cinco tienen acceso activo a Copilot (verificar en <https://github.com/settings/copilot>).
- [ ] **Comprueba el repositorio** — `workshop-team-XX` está creado y todos lo han clonado.
- [ ] **Valida las herramientas locales** — Git, Java 21, Node, Docker y Spec-Kit funcionan en al menos un portátil.
- [ ] **Protege la rama** — `develop` existe y está protegida.
- [ ] **Confirma la asistencia** — los cinco integrantes están confirmados (una pareja y dos personas por integrante).

---

## Puntos de control hora por hora

### 10:00–11:00 · Configuración y personas

- [ ] **10:15** — Todos los portátiles tienen el repositorio abierto en VS Code.
- [ ] **10:30** — Git, Java/Node, Docker y Spec-Kit están validados en todos los portátiles.
- [ ] **10:45** — Todos han leído sus dos archivos `PERSONA.md` y confirmado que `.github/` está consolidado.
- [ ] **10:55** — Todos han probado un comando de barra de su persona.

### 11:00–12:00 · Etapa 1 — Arqueología (parte 1)

- [ ] **11:00** — Todo el equipo ha seleccionado `@archaeologist` en el chat.
- [ ] **11:10** — Cada pareja sabe qué tres programas Natural leerá.
- [ ] **11:10** — Cada pareja sabe **qué cuatro misterios canónicos** le corresponden (`SIFAP-M-NN`; consulta [`mysteries-checklist.md`](../01-archaeology/mysteries-checklist.md)).
- [ ] **11:30** — Reunión breve de dos minutos: cada pareja comunica un hallazgo.
- [ ] **11:45** — Cada pareja ha registrado evidencia y preguntas de sus programas asignados.

> [!TIP]
> **Los misterios usan un denominador de 20** (cuatro por pareja). La clave de respuestas **no reside en este repositorio** porque es público; las personas facilitadoras la reciben por un canal privado. Nunca proyectes la clave de respuestas. Una pista no reduce la puntuación, pero una pareja bloqueada durante más de 40 minutos sí: proporciona la pista.

### 13:30–14:00 · Etapa 1 — Síntesis y transición H1

- [ ] **13:35** — El catálogo contiene fuentes de las reglas consideradas para el alcance.
- [ ] **13:40** — Puntuación de misterios consolidada: **≥16/20**, sin ninguna pareja por debajo de 2/4.
- [ ] **13:45** — El Responsable de Producto ha seleccionado una funcionalidad acotada y registrado los aplazamientos.
- [ ] **13:50** — La persona facilitadora ha validado `LEGACY-EXPLORATION-CHECKLIST.md`.
- [ ] **14:00** — **Transición H1**: la Pareja 1 entrega `discovery-report.md` a la Pareja 2.

> [!WARNING]
> Si alguna regla carece de `Programa de origen` a las 13:50, pausa todo y complétalo. La CI rechaza las pull requests sin este campo.

### 14:00–15:00 · Etapa 2 — Especificación moderna

- [ ] **14:05** — El equipo ha seleccionado `@architect`.
- [ ] **14:30** — El Responsable de Producto ha aprobado una funcionalidad acotada.
- [ ] **14:45** — `spec.md`, `plan.md` y `tasks.md` están en la carpeta de la funcionalidad.
- [ ] **15:00** — **Transición H2**: artefactos formales entregados a las Parejas 3 y 4.

> [!WARNING]
> Cualquier REQ-ID sin `source_legacy:` bloquea la pull request. Comprueba cada requisito antes de la transición.

### 15:00–16:10 · Etapa 3 — Implementación

- [ ] **15:05** — El equipo ha seleccionado `@builder`.
- [ ] **15:30** — La migración Flyway V2 está creada y se ejecuta localmente.
- [ ] **15:50** — Uno o más endpoints REST funcionan mediante Swagger.
- [ ] **16:00** — Al menos una prueba se aprueba.
- [ ] **16:10** — **Transición H3**: código integrado en `develop`, CI en verde.

> [!WARNING]
> Si la CI falla o la cobertura está por debajo del 70%, prioriza la corrección antes de añadir funcionalidades.

### 16:10–16:50 · Etapa 4 — Evolución con Agent

- [ ] **16:15** — El equipo ha seleccionado `@evolution`.
- [ ] **16:20** — Existe al menos una Issue bien escrita para Copilot Agent.
- [ ] **16:35** — Pull request disponible revisada; si no hay PR, el siguiente paso está registrado.
- [ ] **16:45** — Estado de CI/IaC registrado, sin crear infraestructura solo para cumplir una métrica.
- [ ] **16:50** — `agent-experience-report.md` completado.

### 16:50–17:00 · Preparación de la demo

- [ ] **Coordina los turnos de palabra** — cada pareja tiene un segmento definido de 30 segundos.
- [ ] **Prueba la ejecución** — ejecuta la demo una vez con el enfoque creado por el equipo.
- [ ] **Prepara el navegador** — Swagger, frontend y PR integrada están abiertos y listos.

### 17:00–17:30 · Demostraciones

- [ ] El Responsable de Producto presenta y controla el tiempo.
- [ ] Todo el equipo es visible en cámara.
- [ ] SIFAP 2.0 se demuestra en vivo.

---

## Tres preguntas que hace el Líder Técnico cada 30 minutos

```text
1. ¿Alguien lleva más de 20 minutos bloqueado?
2. ¿La CI está en verde?
3. ¿La siguiente transición (H1/H2/H3) sigue el cronograma?
```

Cualquier respuesta negativa requiere una intervención inmediata.

---

## Respuestas de emergencia

| Situación | Acción del Líder Técnico |
|---|---|
| Una pareja lleva 15 minutos sin rumbo | Siéntate con ella y pregunta: "¿Cuál es el objetivo ahora mismo?" |
| La CI lleva 30 minutos fallando | Detén el resto del trabajo y concentra al equipo en la corrección |
| El Responsable de Producto cambia el alcance después de H2 | Rechaza el cambio. El alcance se congela en H2. |
| El Desarrollador quiere refactorizar sin una prueba existente | Recházalo. Interrumpe la refactorización sin cobertura. |
| El agente genera una pull request de baja calidad | No la integres. Solicita cambios o implementa manualmente. |
| Quedan treinta minutos y la demo no funciona | Reduce el alcance de la demo en lugar de intentar corregir el problema. |
| Copilot no está disponible | Usa el Plan B de [troubleshooting.md](troubleshooting.md#plan-b--interrupción-de-copilot). |

---

## Objetivo del Líder Técnico

> El rol del Líder Técnico no es hacer el trabajo de todos, sino garantizar que nadie esté inactivo.

Contribuyes código en la misma proporción que los demás. Tu responsabilidad específica es mantener el **ritmo** y el **alcance**.

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Flujo del equipo](../00-TEAM-FLOW.md)<br/><sub>Cronograma completo del día.</sub> | [Lecciones aprendidas](lessons-learned.md)<br/><sub>Errores comunes de los equipos.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
