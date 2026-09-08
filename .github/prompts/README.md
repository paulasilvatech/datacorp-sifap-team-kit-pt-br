# Índice de prompts

Este directorio contiene los archivos de prompts de GitHub Copilot para la inmersión.

> Importante: mantén los archivos `*.prompt.md` directamente en `.github/prompts/`. La ubicación del espacio de trabajo documentada por Copilot es plana (`.github/prompts/*.prompt.md`). La organización por etapa y persona se representa mediante el prefijo del nombre de archivo y este índice.

## Convención de nomenclatura

| Prefijo | Uso |
| --- | --- |
| `stage-<agent>-<task>.prompt.md` | Prompts para agentes de etapa (`archaeologist`, `architect`, `builder`, `evolution`). |
| `persona-<persona>-<task>.prompt.md` | Prompts para kits de persona (`product-owner`, `developer`, `qa-engineer`, etc.). |

## Prompts de etapa

| Agente | Archivos |
| --- | --- |
| `archaeologist` | `stage-archaeologist-*.prompt.md` |
| `architect` | `stage-architect-*.prompt.md` |
| `builder` | `stage-builder-*.prompt.md` |
| `evolution` | `stage-evolution-*.prompt.md` |

## Prompts de persona

| Persona | Archivos |
| --- | --- |
| Responsable del producto | `persona-product-owner-*.prompt.md` |
| Especialista en requisitos | `persona-requirements-engineer-*.prompt.md` |
| Especialista en arquitectura empresarial | `persona-enterprise-architect-*.prompt.md` |
| Especialista en arquitectura de software | `persona-software-architect-*.prompt.md` |
| Responsable técnico | `persona-technical-lead-*.prompt.md` |
| Persona desarrolladora | `persona-developer-*.prompt.md` |
| DBA | `persona-dba-*.prompt.md` |
| Especialista en calidad | `persona-qa-engineer-*.prompt.md` |
| Especialista en DevOps | `persona-devops-engineer-*.prompt.md` |
| Especialista en redacción técnica | `persona-tech-writer-*.prompt.md` |

## Reglas de mantenimiento

- Cada prompt debe tener un frontmatter YAML válido.
- Prioriza campos explícitos `description`, `name`, `argument-hint` (cuando existan entradas), `agent` y `tools`.
- Evita el exceso de herramientas; utiliza el conjunto mínimo necesario para la tarea.
- Las herramientas definidas en el prompt sustituyen, no amplían, las herramientas del agente personalizado; declara todos los permisos necesarios en el propio prompt.
- Prioriza alias portables de VS Code (`read`, `search`, `edit`, `execute`, `agent`, `web`, `todo`) frente a identificadores específicos de implementación.
- No especifiques capacidad ni proveedor en el prompt. La persona usuaria decide cómo ejecutar la tarea.
- Al utilizar un agente personalizado, referencia su `name` de `.github/agents/` (por ejemplo, `archaeologist`, no el nombre visible en el cuerpo del archivo).
- Al añadir un prompt nuevo, utiliza uno de los prefijos anteriores para conservar la facilidad de descubrimiento y la organización.
