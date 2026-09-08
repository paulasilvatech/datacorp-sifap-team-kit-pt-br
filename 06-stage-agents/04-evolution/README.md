# @evolution — Etapa 4: evolución

> **Ruta:** [Kit del equipo](../../README.md) › [Agentes de etapa](../README.md) › **@evolution**

**El agente `@evolution` guía al equipo para convertir el trabajo local de la Etapa 3 en una entrega revisable: Issues bien escritas para el modo Agent de Copilot, revisión de PR, registros de CI/CD e informe de experiencia.**

| Campo | Valor |
|---|---|
| **Público objetivo** | Líder Técnico (lidera), Ingeniero DevOps, Redactor Técnico, Desarrollador e Ingeniero de Calidad |
| **Prerrequisitos** | Transición de la Etapa 3 con backend/frontend funcional y pruebas relevantes |
| **Tiempo estimado** | 16:10–16:50 |
| **Etapa** | Etapa 4 — Evolución |
| **Resultado esperado** | Issue creada o redactada, PR revisada o siguiente paso registrado, informe de experiencia completado |

![Etapa 4](https://img.shields.io/badge/Stage-4%20%C2%B7%20Evolution-171717?style=flat-square)
![Enfoque operativo](https://img.shields.io/badge/Approach-Operational-404040?style=flat-square)

---

## Cuándo usarlo

Usa este agente cuando exista el prototipo y el equipo necesite convertir el trabajo local en una entrega revisable: Issues, PR, CI/CD, IaC, runbook e informe final.

- **Lidera:** Líder Técnico
- **Apoyo principal:** Ingeniero DevOps, Redactor Técnico, Desarrollador e Ingeniero de Calidad
- **Prerrequisito de la puerta obligatoria:** prototipo con backend/frontend funcional y pruebas relevantes

---

## Lo que hace el agente

- Ayuda a estructurar Issues pequeñas y revisables para el modo Agent de Copilot
- Guía la revisión de PR con énfasis en errores, riesgos, regresiones y pruebas faltantes
- Crea workflows de GitHub Actions para build, pruebas y validación de Terraform
- Convierte comandos individuales en un runbook de operaciones
- Produce el informe de experiencia con el modo Agent (`agent-experience-report.md`)

---

## Lo que el agente NO hace

- No delega una Issue vaga al modo Agent; exige contexto, alcance y criterios de aceptación
- No aprueba una PR generada por IA sin revisión humana explícita
- No crea funcionalidades nuevas en la Etapa 4; las añade al backlog
- No oculta trabajo pendiente; documenta los riesgos y registra el siguiente paso

---

## Entradas

| Entrada | Ubicación |
|---|---|
| Backend/frontend de la Etapa 3 | `backend/`, `frontend/` |
| Trabajo pendiente conocido | Notas de la transición de la Etapa 3 |
| `spec.md` de la funcionalidad | `specs/<NNN>-<feature>/spec.md` |
| ADR y plan técnico | `02-modern-spec/` o `docs/adr/` |

---

## Salidas esperadas

| Artefacto | Ubicación |
|---|---|
| Issue para el modo Agent | GitHub Issues del repositorio |
| Revisión de PR (si está disponible) | GitHub Pull Requests |
| Workflow de CI/CD (si es relevante) | `.github/workflows/` |
| Runbook (si es relevante) | `docs/runbook/` |
| Informe de experiencia con el agente | `docs/agent-experience-report.md` |

---

## Cómo seleccionar el agente en Copilot Chat

- [ ] **Abre Copilot Chat** en VS Code (`Ctrl+Alt+I` / `Cmd+Alt+I`).
- [ ] **Selecciona `@evolution`** en el selector de agentes.
- [ ] **Abre la lista de trabajo pendiente de la Etapa 3** en el editor.
- [ ] **Pega el prompt de apertura** que aparece a continuación y pulsa Enter.

```text
Estoy comenzando la Etapa 4 — Evolución.
Tenemos un prototipo con backend, frontend y pruebas.
Ayuda a revisar una Issue pequeña para Copilot Agent y a registrar el resultado
de la delegación. No inventes requisitos, arquitectura ni criterios.
```

---

## Ejemplos de prompts

| Situación | Prompt útil |
|---|---|
| Issue para el modo Agent | "Escribe una Issue pequeña con contexto, archivos relevantes, criterios de aceptación y elementos fuera del alcance." |
| Revisión de PR | "Revisa esta PR, priorizando errores, riesgos, regresiones y pruebas faltantes." |
| CI/CD | "Crea un workflow de GitHub Actions para build, pruebas y validación de Terraform." |
| Runbook | "Convierte estos comandos en un runbook para un nuevo integrante del equipo de operaciones." |
| Informe final | "Escribe el `agent-experience-report` con lo que funcionó, lo que falló y lo que aprendimos." |

---

## Definición de terminado

- [ ] Se creó una Issue pequeña o se dejó como borrador revisable con contexto, alcance y criterios de aceptación.
- [ ] Una PR disponible recibió revisión humana; si no existe una PR, el siguiente paso está documentado.
- [ ] Se registró el estado de CI/IaC sin crear infraestructura solo para cumplir una meta.
- [ ] El informe de experiencia con el modo Agent está completo.

---

## Errores comunes

| Síntoma | Causa | Corrección |
|---|---|---|
| El modo Agent produce un resultado fuera del alcance | Issue vaga sin criterios explícitos | Reescribe la Issue con contexto, archivos relevantes y elementos fuera del alcance |
| PR generada por IA integrada sin revisión | Confianza excesiva en el resultado del agente | Revísala exactamente como una PR humana |
| Aparece una funcionalidad nueva al final | Control deficiente del alcance | Añádela al backlog; no la implementes en la Etapa 4 |
| Trabajo pendiente oculto para proteger la demo | Temor a ser juzgado | Documenta el riesgo y la solución provisional; el objetivo es la transparencia |

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [@builder](../03-builder/README.md)<br/><sub>Etapa 3: construir la implementación trazable.</sub> | [Agentes de etapa — descripción general](../README.md)<br/><sub>Descripción general de los 4 agentes y el cronograma de la inmersión.</sub> |

<sub>[Volver al índice del kit](../../README.md)</sub>
