# @archaeologist — Etapa 1: arqueología

> **Ruta:** [Kit del equipo](../../README.md) › [Agentes de etapa](../README.md) › **@archaeologist**

**El agente `@archaeologist` guía al equipo en una lectura sistemática del código heredado Natural/Adabas, extrayendo reglas de negocio trazables y mapeando dependencias para definir el alcance de la Etapa 2.**

| Campo | Valor |
|---|---|
| **Público objetivo** | Todo el equipo durante la Etapa 1, con todas las parejas trabajando en paralelo |
| **Prerrequisitos** | `01-archaeology/legacy-sifap/` disponible en el espacio de trabajo |
| **Tiempo estimado** | 11:00–12:00 + 13:30–14:00 |
| **Etapa** | Etapa 1 — Arqueología |
| **Resultado esperado** | Catálogo de reglas con fuentes, DDM mapeados, preguntas abiertas y alcance de la funcionalidad definido |

![Etapa 1](https://img.shields.io/badge/Stage-1%20%C2%B7%20Archaeology-171717?style=flat-square)
![Enfoque investigativo](https://img.shields.io/badge/Approach-Investigative-404040?style=flat-square)

---

## Cuándo usarlo

Usa este agente mientras el equipo lee código heredado. `@archaeologist` ayuda al equipo a observar, catalogar y formular preguntas. No escribe código moderno ni inventa reglas de negocio.

- **Lidera:** Especialista en Requisitos
- **Apoyo principal:** Redactor Técnico, Arquitecto Empresarial y DBA
- **Prerrequisito de la puerta obligatoria:** leer los programas Natural asignados antes de escribir cualquier especificación

---

## Lo que hace el agente

- Guía la lectura línea por línea de programas `.NSN` y estructuras DDM de Adabas
- Identifica entradas, procesamiento, salidas y reglas de negocio de cada programa
- Mapea dependencias entre programas mediante `CALLNAT`
- Sugiere mapeos de campos DDM a PostgreSQL (MU, PE, DE)
- Registra evidencia con rutas de archivos y referencias a líneas
- Identifica preguntas abiertas sin inventar respuestas

---

## Lo que el agente NO hace

- No lee código heredado a menos que el equipo abra el archivo
- No convierte una hipótesis en un requisito confirmado
- No sugiere arquitectura moderna (esa es la función de `@architect` en la Etapa 2)
- No edita archivos de `01-archaeology/legacy-sifap/` (solo lectura)

---

## Entradas

| Entrada | Ubicación |
|---|---|
| Programas Natural asignados | `01-archaeology/legacy-sifap/natural-programs/*.NSN` |
| DDM de Adabas | `01-archaeology/legacy-sifap/adabas-ddms/*.ddm` |
| Lista de verificación de exploración | `01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md` |

---

## Salidas esperadas

| Artefacto | Ubicación |
|---|---|
| Catálogo de reglas de negocio | `01-archaeology/business-rules-catalog.md` |
| Mapa de dependencias (Mermaid) | En el catálogo o en un archivo separado |
| Lista de preguntas abiertas | Sección dedicada del catálogo |
| Alcance de la funcionalidad seleccionada | Registrado antes de la transición de las 14:00 |

---

## Cómo seleccionar el agente en Copilot Chat

- [ ] **Abre Copilot Chat** en VS Code (`Ctrl+Alt+I` / `Cmd+Alt+I`).
- [ ] **Selecciona `@archaeologist`** en el selector de agentes.
- [ ] **Abre el primer programa Natural asignado** en el editor antes de enviar el primer prompt.
- [ ] **Pega el prompt de apertura** que aparece a continuación y pulsa Enter.

```text
Estoy comenzando la Etapa 1 — Arqueología.
Tenemos código Natural/Adabas en 01-archaeology/legacy-sifap/.
Ayuda al equipo a examinar los programas asignados y a registrar solo evidencia
y preguntas abiertas para el alcance que seleccionaremos. No infieras respuestas.
```

---

## Ejemplos de prompts

| Situación | Prompt útil |
|---|---|
| Programa Natural desconocido | "Lee este programa conmigo y separa entradas, procesamiento, salidas y reglas de negocio". |
| DDM de Adabas | "Explica estos campos, identifica MU/PE/DE y sugiere un mapeo a PostgreSQL". |
| Regla ambigua | "No inventes una respuesta. Regístrala como un misterio con hipótesis, evidencia e impacto". |
| CALLNAT | "Mapea quién llama a quién y genera un diagrama Mermaid sencillo". |

---

## Definición de terminado

- [ ] La pareja leyó íntegramente cada programa Natural asignado.
- [ ] Cada regla considerada para el alcance tiene `source_legacy:` con un archivo y una línea.
- [ ] El equipo consultó los DDM y las dependencias cuando afectan a la funcionalidad seleccionada.
- [ ] Las preguntas abiertas están registradas sin respuestas inventadas.
- [ ] El informe de descubrimiento está listo para la transición de las 14:00.

---

## Errores comunes

| Síntoma | Causa | Corrección |
|---|---|---|
| Copilot ofrece generalizaciones vagas | No hay ningún archivo abierto en el editor | Abre el archivo `.NSN` y cita la sección específica en el prompt |
| La regla de negocio no tiene fuente | El equipo aceptó una hipótesis como un hecho | Márcala como misterio hasta que exista evidencia en el código |
| Se pierde tiempo detallando áreas fuera del alcance | No se tomó una decisión de alcance | Selecciona la funcionalidad acotada antes de las 12:00 y limita la lectura a ella |
| Se editan archivos del legado | Confusión sobre la función de la etapa | `01-archaeology/legacy-sifap/` es de solo lectura |

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Agentes de etapa — descripción general](../README.md)<br/><sub>Los 4 agentes, el cronograma y la matriz de responsabilidades.</sub> | [@architect](../02-architect/README.md)<br/><sub>Etapa 2: transformar evidencia en una especificación moderna.</sub> |

<sub>[Volver al índice del kit](../../README.md)</sub>
