# Los cuatro agentes del SDLC — Explicación

![Tipo: concepto](https://img.shields.io/badge/Type-Concept-171717?style=flat-square)
![Uso: comprender los kits de agentes](https://img.shields.io/badge/Use-Understand%20agent--kits-737373?style=flat-square)

> **Ruta:** [Kit del equipo](../README.md) › [Documentación](README.md) › **Los cuatro agentes explicados**

**Explica el razonamiento detrás de los cuatro agentes de etapa** — léelo cuando alguien pregunte: "¿Por qué tenemos agentes de etapa si cada persona ya tiene su propio kit?"

| Campo | Valor |
|---|---|
| **Público objetivo** | Todo el equipo, especialmente quienes usan Copilot en un contexto de equipo por primera vez |
| **Prerrequisitos** | Leer el `PERSONA.md` de tu rol |
| **Resultado esperado** | Comprender la diferencia entre un kit de persona y un kit de agente, y saber cuál usar en cada momento |

---

## Concepto

Un **kit de persona** responde: "¿Cuál es mi rol?"
Un **kit de agente** responde: "¿Cómo está trabajando el equipo ahora, en esta etapa?"

Ambos son necesarios y complementarios. Una persona puede asumir los roles de Desarrollador y Líder Técnico, pero en la Etapa 1 debe seguir usando `@archaeologist`, porque en ese momento todo el equipo está leyendo el sistema heredado.

---

## Por qué hay cuatro agentes

La inmersión tiene cuatro formas de trabajar. Cada una exige un comportamiento diferente de Copilot.

| Etapa | Forma de trabajar | Agente | Regla principal |
|---|---|---|---|
| 1 — Arqueología | Observar y catalogar | `@archaeologist` | No escribir código |
| 2 — Especificación moderna | Estructurar y decidir | `@architect` | No aceptar un requisito sin evidencia del legado |
| 3 — Implementación | Construir y verificar | `@builder` | No programar sin un REQ-ID y su prueba correspondiente |
| 4 — Evolución | Delegar y revisar | `@evolution` | No aceptar una pull request generada por IA sin revisión humana |

Un único agente tendría instrucciones contradictorias: en la Etapa 1 debe ser de solo lectura; en la Etapa 3 debe editar archivos y ejecutar pruebas. Separar los agentes por etapa hace que la experiencia sea más segura y fácil de comprender para quienes aprenden.

---

## Anatomía de un agente

![Anatomía de un agente: cinco capas (Agente + Instrucciones + Prompts + Skills + MCP)](../assets/agent-anatomy.svg)

| Capa | Propósito | Ejemplo |
|---|---|---|
| Agente | Define misión, herramientas y comportamiento | `@builder` sabe implementar y probar |
| Instrucciones | Reglas según el tipo de archivo | Natural/Adabas, Java, frontend |
| Prompts | Acciones reutilizables | `/translate-natural-to-java`, `/write-ears-spec` |
| Skills | Orientación detallada sobre una técnica | TDD, ADR, extracción de reglas de negocio |
| MCP | Conecta el agente con sistemas externos | GitHub, bases de datos y Azure cuando estén configurados |

---

## Cómo usar los agentes durante el día

- [ ] **Empieza por la etapa, no por la preferencia individual.** Consulta el cronograma en [`00-TEAM-FLOW.md`](../00-TEAM-FLOW.md).
- [ ] **Selecciona el agente de etapa en Copilot Chat.** Ejemplo: `@architect` en la Etapa 2.
- [ ] **Lee también tu `PERSONA.md`.** Describe lo que tú, como persona, debes observar durante esa etapa.
- [ ] **Usa los prompts de la etapa.** Convierten la conversación en un artefacto verificable.
- [ ] **Detente en la puerta.** Avanza solo cuando se cumpla la definición de terminado de la etapa.

---

## Flujo de interacción

Durante la Etapa 2, el Especialista en Requisitos puede presentar un hallazgo confirmado al Arquitecto de Software, quien coordina la etapa con `@architect`.

```text
@architect
Tenemos esta regla extraída del sistema heredado:
"<regla confirmada>"
Ayuda a estructurarla en EARS con un REQ-ID, criterios de aceptación y source_legacy.
```

El artefacto debe registrar solo la evidencia del equipo:

```yaml
REQ-XXX:
  pattern: <patrón EARS>
  text: "<requisito>"
  source_legacy: <file:lines o [GREENFIELD] + justificación>
  acceptance: "<escenario verificable>"
```

---

## Regla: no hay respuesta prefabricada sin evidencia

Los agentes enseñan el camino, pero no proporcionan una respuesta prefabricada sin evidencia. Esto protege el aprendizaje y evita alucinaciones.

| Si preguntas... | El agente responde... |
|---|---|
| "Dime los contextos delimitados" | "Muéstrame el catálogo de programas y el mapa de datos." |
| "Crea requisitos para todo" | "Empecemos por una regla que tenga una fuente en el legado." |
| "Implementa esta funcionalidad sin especificación" | "Faltan el REQ-ID, el criterio de aceptación y `source_legacy`." |

---

## Cómo saber que lo comprendes

Comprendes el modelo cuando puedes explicar estas tres afirmaciones a otra persona:

1. Un kit de persona define un rol; un kit de agente define una etapa.
2. El agente de etapa cambia a lo largo del día; tus dos personas siguen siendo las mismas.
3. Todo artefacto importante debe persistir fuera del chat en un archivo bajo control de versiones.

---

## Referencias

- [Kits de agentes](../06-stage-agents/README.md)
- [Matriz persona-agente](persona-agent-matrix.md)
- [Flujo completo del SDLC](sdlc-flow-guide.md)
- [Kits de personas](../05-personas/README.md)

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Matriz persona-agente](persona-agent-matrix.md)<br/><sub>Intensidad por persona y etapa.</sub> | [Flujo del SDLC](sdlc-flow-guide.md)<br/><sub>Contratos entre parejas.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
