# FAQ — Preguntas frecuentes

> **Ruta:** [Kit del equipo](../README.md) › [Documentación](README.md) › **FAQ**

**Respuestas directas a preguntas comunes sobre la inmersión de modernización de SIFAP.**

| Campo | Valor |
|---|---|
| **Público objetivo** | Todo el equipo |
| **Cómo usarlo** | Busca la pregunta con `Ctrl+F`. Si no está aquí, consulta [troubleshooting.md](troubleshooting.md) |
| **Tiempo estimado** | Lectura selectiva |

---

## Sobre la inmersión

<details>
<summary><strong>No programo. ¿Puedo participar?</strong></summary>

Sí. Las personas Responsable de Producto y Redactor Técnico, y parte de QA, no requieren programar. Lee primero [`07-concepts/`](../07-concepts/) para familiarizarte con los conceptos. Cada `PERSONA.md` incluye una sección de "opciones de emergencia".

</details>

<details>
<summary><strong>¿Cuánto dura?</strong></summary>

Ocho horas (10:00–18:00). El cronograma exacto está en [`00-TEAM-FLOW.md`](../00-TEAM-FLOW.md) §2.

</details>

<details>
<summary><strong>¿Cuántos integrantes tiene cada equipo?</strong></summary>

Cinco. Cada integrante asume dos personas (una pareja), cubriendo diez personas en total.

</details>

<details>
<summary><strong>¿Puedo elegir mis dos personas?</strong></summary>

Sí, pero coordínate con el equipo. Las Parejas 1, 4 y 5 admiten perfiles no técnicos. Las Parejas 2 y 3 requieren experiencia técnica.

</details>

<details>
<summary><strong>¿Qué es SIFAP?</strong></summary>

SIFAP (Sistema de Fiscalización y Administración de Pagos) es un sistema gubernamental de pagos de 29 años escrito en Natural/Adabas. La inmersión simula su modernización a Java 21 + Next.js 15. Consulta [`01-archaeology/legacy-sifap/README.md`](../01-archaeology/legacy-sifap/README.md).

</details>

---

## Sobre Copilot

<details>
<summary><strong>¿Qué modelo de Copilot debería usar?</strong></summary>

Sonnet 4.6 para la mayoría de las tareas. Haiku para tareas mecánicas y repetitivas. Opus para decisiones de arquitectura complejas. Consulta [`09-cheat-sheets/model-routing.md`](../09-cheat-sheets/model-routing.md).

</details>

<details>
<summary><strong>¿Cuándo debería usar Ask, Plan o Agent?</strong></summary>

- **Ask** — debatir y comprender.
- **Plan** — planificar un cambio en varios archivos.
- **Agent** — delegar una Issue completa.

Referencia: [`07-concepts/04-3-copilot-modes.md`](../07-concepts/04-3-copilot-modes.md).

</details>

<details>
<summary><strong>¿Puede Agent integrar los cambios por sí solo?</strong></summary>

No. Agent abre una pull request. Revísala con el mismo cuidado que aplicarías a una contribución humana.

</details>

<details>
<summary><strong>¿Puedo usar Cursor, Codeium u otro asistente?</strong></summary>

No. La cadena de herramientas es fija: usa solo GitHub Copilot. Consulta [`.github/copilot-instructions.md`](../.github/copilot-instructions.md).

</details>

---

## Sobre Spec-Kit y EARS

<details>
<summary><strong>¿Por qué cada requisito EARS necesita `source_legacy:`?</strong></summary>

Para garantizar que el equipo modernizó el sistema real, no solo el resumen del proyecto. La CI rechaza las pull requests sin este campo. Consulta [`01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md`](../01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md).

</details>

<details>
<summary><strong>¿Y si la funcionalidad es nueva y no tiene equivalente en el legado?</strong></summary>

Usa `source_legacy: "[GREENFIELD] <justificación en una línea>"`. Ejemplo: `"[GREENFIELD] OAuth2 no existía en un terminal 3270."`.

</details>

<details>
<summary><strong>¿Puedo omitir `/speckit.clarify`?</strong></summary>

No. Omitirlo significa que las ambigüedades se convertirán en errores de la Etapa 3, cuando corregirlos cuesta mucho más.

</details>

<details>
<summary><strong>`/speckit.analyze` informa de problemas. ¿Qué debo hacer?</strong></summary>

Resuélvelos antes de implementar. Cada hallazgo evita trabajo repetido más adelante.

</details>

---

## Sobre Git y las ramas

<details>
<summary><strong>¿Puedo crear commits directamente en `main`?</strong></summary>

No. Usa siempre una pull request. Consulta la regla 1 de [`00-GIT-WORKFLOW.md`](../00-GIT-WORKFLOW.md).

</details>

<details>
<summary><strong>¿Qué prefijo de rama debo usar?</strong></summary>

- `spec/<NNN>-<feature>` en la Etapa 2
- `impl/<NNN>-<feature>` en la Etapa 3
- `infra/<component>` para infraestructura

Ambas ramas de funcionalidad parten de `develop`. Consulta la tabla completa en [`00-GIT-WORKFLOW.md`](../00-GIT-WORKFLOW.md).

</details>

<details>
<summary><strong>¿Cómo se aprueba mi PR?</strong></summary>

CI en verde más una revisión de la pareja receptora. El flujo es Pareja 1 → Pareja 2 → Pareja 3 → Pareja 4 → Pareja 5 → Pareja 1.

</details>

<details>
<summary><strong>¿Puedo ejecutar `git push --force`?</strong></summary>

Solo en tu propia rama y únicamente con `--force-with-lease`. Nunca en `develop` ni en `main`.

</details>

---

## Sobre Terraform y Azure

<details>
<summary><strong>¿Puedo ejecutar `terraform apply`?</strong></summary>

> [!CAUTION]
> No. Durante la inmersión solo está autorizado `terraform plan`. Ejecutar `apply` crea recursos reales de Azure y genera costos.

</details>

<details>
<summary><strong>¿Dónde debo guardar los secretos?</strong></summary>

En Azure Key Vault. Nunca en `variables.tf` ni en archivos `.env` incluidos en commits. Al crear `infra/`, modela los secretos mediante Key Vault y Managed Identity.

</details>

---

## Sobre las etapas y las transiciones

<details>
<summary><strong>¿Qué son las "transiciones H1, H2 y H3"?</strong></summary>

Son puntos de transferencia de artefactos entre parejas al final de cada etapa. Cada transición es una conversación síncrona de cinco minutos. Los detalles están en [`00-TEAM-FLOW.md`](../00-TEAM-FLOW.md) §3.

</details>

<details>
<summary><strong>¿Puedo iniciar la Etapa 2 mientras la Etapa 1 sigue en curso?</strong></summary>

No. Sin completar la arqueología de la Etapa 1, los requisitos EARS carecerán de `source_legacy:` y la CI rechazará la pull request.

</details>

<details>
<summary><strong>¿Quién lidera cada etapa?</strong></summary>

Consulta [`05-personas/OVERVIEW.md`](../05-personas/OVERVIEW.md). Resumen:

- Etapa 1 — todas las parejas en paralelo
- Etapa 2 — Pareja 2
- Etapa 3 — Parejas 3 y 4
- Etapa 4 — Pareja 5

</details>

---

## Sobre los bloqueos

<details>
<summary><strong>No puedo avanzar. ¿Qué debo hacer?</strong></summary>

Usa la regla de los 20 minutos ([`00-TEAM-FLOW.md`](../00-TEAM-FLOW.md) §6):

| Tiempo sin avanzar | Acción |
|---|---|
| 5 min | Intenta resolverlo por tu cuenta |
| 10 min | Pide ayuda a tu pareja |
| 20 min | Plantéalo al equipo |
| 30 min | Pide ayuda a la persona facilitadora |

</details>

<details>
<summary><strong>¿Cómo pido ayuda de forma eficiente?</strong></summary>

Usa tres líneas: (1) Objetivo, (2) Qué intenté, (3) El bloqueo. Consulta el ejemplo de [`00-TEAM-FLOW.md`](../00-TEAM-FLOW.md) §6.

</details>

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Solución de problemas](troubleshooting.md)<br/><sub>Errores comunes y soluciones.</sub> | [Kit en español](../README.md)<br/><sub>Centro principal.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
