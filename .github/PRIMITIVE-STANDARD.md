# Estándar de primitivas de Copilot

`.github/` contiene las **primitivas** de Copilot de este kit: agentes, prompts, instrucciones, habilidades y hooks. Este archivo es el estándar escrito y citable que define cómo se estructura cada una, de modo que una nueva primitiva pueda ajustarse al conjunto existente sin tener que reconstruir sus reglas mediante ingeniería inversa. La referencia de excelencia que identifica el equipo es el agente de arqueología ([`archaeologist.agent.md`](agents/archaeologist.agent.md)); los patrones siguientes se derivan de él y de los demás agentes.

> [!IMPORTANT]
> La guía de estilo de documentación ([`../docs/DOC-STYLE-GUIDE.md`](../docs/DOC-STYLE-GUIDE.md), regla R4) rige deliberadamente **solo** `docs/` y las carpetas numeradas de las etapas, nunca `.github/`. Las primitivas de Copilot siguen *este* estándar, por lo que una revisión de documentación no debe reestructurar una primitiva como texto narrativo.

## El modelo de infraestructura de soporte

Una primitiva es una de las superficies de la infraestructura de soporte de agentes del repositorio. El modelo que utiliza este kit de equipo es:

```text
Infraestructura de soporte = Instrucciones + Restricciones + Retroalimentación + Memoria + Evaluación + Gobernanza
```

| Capa | Primitiva que la implementa |
|---|---|
| Instrucciones | `copilot-instructions.md`, `instructions/*.instructions.md` |
| Restricciones | `hooks/*.json` que bloquean una llamada a una herramienta; delimitación del alcance de instrucciones mediante `applyTo` |
| Retroalimentación | Prompts y agentes que ejecutan verificaciones e informan de sus resultados |
| Memoria | ADR, especificaciones, pruebas e historial de Git que pertenecen al equipo |
| Evaluación | `workflows/spec-quality.yml` junto con `scripts/validate-copilot-primitives.py` |
| Gobernanza | Este estándar, aplicado por el trabajo de CI `copilot-primitives` |

Prioriza actualizar una primitiva existente en lugar de añadir otra casi idéntica.

Los [metadatos de idioma](language.json) de la rama identifican su edición. El validador reconoce los encabezados estructurales equivalentes en español en `espanol`; traducir la prosa nunca cambia los esquemas del frontmatter ni los identificadores técnicos.

## Reglas aplicables a todas las primitivas

### Markdown y estilo

- [ ] Inglés en `main` y `develop`; portugués de Brasil en `portugues-br`; español en `espanol`, incluida la prosa de las primitivas. Sigue la [política de idiomas del repositorio](../README.md#idiomas-del-repositorio) y conserva rutas, identificadores y esquemas. El idioma de la conversación no cambia el de la rama; nunca integres el árbol de documentación traducida en `main` ni en `develop`. No utilices emojis; representa NOTE, TIP, IMPORTANT, WARNING y CAUTION mediante alertas GFM como `> [!NOTE]`.
- [ ] Exactamente un H1 (`#`) por archivo: el título del documento, debajo del frontmatter. El validador de primitivas lo exige; MD025 de markdownlint (varios encabezados de nivel superior) está deshabilitada.
- [ ] La línea en blanco entre el `---` de cierre y el H1 es opcional y ambas formas superan el lint: los agentes, prompts y habilidades la omiten, mientras que los archivos de instrucciones conservan una. MD022 no se activa en el límite del frontmatter y no se anula, por lo que debes seguir el patrón de los archivos del mismo directorio en lugar de forzar cambios sin valor.
- [ ] Nunca omitas un nivel de encabezado; utiliza `#`, después `##` y luego `###`.
- [ ] Cada bloque de código delimitado declara un lenguaje (por ejemplo, `java`, `json`, `text` o `bash`): una convención del proyecto que se comprueba durante la revisión, ya que MD040 de markdownlint está deshabilitada.
- [ ] Utiliza tablas GFM reales (con la fila separadora `|---|`) siempre que haya dos o más dimensiones, y listas `- [ ]` para todo lo que deba verificar quien lee.
- [ ] Termina con exactamente un salto de línea final. No utilices espacios al final de las líneas, tabuladores ni líneas en blanco consecutivas.
- [ ] Nunca deshabilites una regla de markdownlint en línea mediante una directiva en un comentario HTML (fallo #2). El archivo raíz [`../.markdownlint-cli2.jsonc`](../.markdownlint-cli2.jsonc) es la única configuración de lint; una directiva en línea la duplica y consume tokens de la ventana de contexto sin aportar ningún valor instructivo. Las directivas eliminadas de 158 archivos deshabilitaban exactamente las reglas que esa configuración ya deshabilita: pura redundancia que no cambiaba nada, pero consumía tokens.

### Contenido y precisión

- [ ] **Cita la fuente autorizada de cada convención**; no la repitas a partir del resumen de `copilot-instructions.md`. Los nombres de las ramas provienen de [`../00-GIT-WORKFLOW.md`](../00-GIT-WORKFLOW.md); las reglas de lectura del sistema heredado, de [`instructions/natural-adabas.instructions.md`](instructions/natural-adabas.instructions.md); EARS y `source_legacy`, de [`skills/ears-validate/SKILL.md`](skills/ears-validate/SKILL.md).
- [ ] **Prefijos de ramas** (tabla autorizada en [`../00-GIT-WORKFLOW.md`](../00-GIT-WORKFLOW.md)): `spec/<NNN>-<feature>`, `impl/<NNN>-<feature>`, `infra/<component>`, `docs/<topic>` y `agent/<issue-NN>`, todos creados a partir de `develop`. Nunca conviertas `impl/` en `spec/` (fallo #1).
- [ ] **Nunca inventes hechos sobre SIFAP.** Una primitiva enseña *cómo descubrir* el comportamiento heredado; nunca establece cuál es una regla de negocio. El conjunto de fuentes de `01-archaeology/legacy-sifap/` contiene 24 miembros Natural (12 `.NSP`, 5 `.NSN`, 2 `.NSC`, 2 `.NSA`, 1 `.NSL`, 2 `.jcl`), 4 DDM `.ddm` y 1 listado FDT `.txt`. No existe ningún archivo `.NSD`.
- [ ] **Solo la cadena de herramientas aprobada.** Nunca recomiendes, instales ni cambies a Cursor, Windsurf, Codex, Cline, Continue, Aider, Codeium, Tabnine, IntelliJ, Eclipse o Neovim; VS Code con GitHub Copilot es el único editor y asistente aprobado.
- [ ] Llama al evento inmersión, nunca `hackathon`.
- [ ] Utiliza únicamente las rutas actuales en inglés; la comprobación de rutas obsoletas del validador rechaza los nombres de directorio en portugués retirados (fallo #5). `backend/` y `frontend/` todavía **no** existen (el equipo los crea en la etapa 3); `infra/` **sí** existe.

## Frontmatter por tipo de primitiva

El frontmatter tiene un esquema cerrado por tipo: una clave desconocida, retirada o no válida **hace fallar la puerta `copilot-primitives`**. Las claves marcadas como específicas de una plataforma se ignoran sin aviso en otras superficies, por lo que es seguro conservarlas. Escribe entre comillas los valores de cadena de `name` y `description`: es la convención establecida del proyecto, que actualmente siguen todos los agentes, prompts, instrucciones y habilidades del kit.

### Frontmatter de agentes

Archivo: `agents/<id>.agent.md`.

| Clave | Notas |
|---|---|
| `name` | Identificador del agente; presente por convención. Cambiar el nombre de un agente rompe sin aviso todos los prompts que se vinculan a él mediante `agent:`. |
| `description` | La única clave que la puerta exige estrictamente. |
| `tools` | Por ejemplo, `[read, search, edit]`; añade `execute` o `"github/*"` solo cuando sea necesario. |
| `model` | Opcional. |
| `handoffs` | Solo para agentes de etapa (solo en VS Code). Los agentes de persona nunca la utilizan. |
| `target`, `user-invocable`, `disable-model-invocation`, `metadata`, `agents` | Opcionales. |
| `mcp-servers` | Solo en GitHub.com y la CLI. |
| `argument-hint` | Solo en VS Code. |

La clave `infer:` está retirada; elimínala.

> [!NOTE]
> Solo los agentes secuenciales de **etapa** incluyen `handoffs`, y únicamente cuando existe una etapa siguiente: `archaeologist -> architect -> builder` realiza cada uno el traspaso al siguiente, mientras que el agente terminal de la etapa 4 (`evolution`) no tiene ninguno. Ningún agente de persona tiene `handoffs`.

### Frontmatter de prompts

Archivo: `prompts/<name>.prompt.md`. El nombre del comando con barra deriva del nombre del archivo, salvo que `name:` lo sustituya. Claves válidas: `name`, `description`, `agent`, `model`, `tools`, `argument-hint`.

- `agent:` debe corresponder a un agente integrado (`ask`, `agent` o `plan`) o a un archivo en `agents/`.
- `mode:` está obsoleta (sintaxis antigua de modos de chat, sustituida por `agent:`); elimínala.
- `tested_with:` es inventada y no tiene ningún efecto; elimínala.

### Frontmatter de instrucciones

Archivo: `instructions/<name>.instructions.md`. Claves válidas: `applyTo`, `name`, `description`, `excludeAgent`.

- Delimita `applyTo` con patrones glob concretos. `applyTo: "**"` inserta el archivo en cada solicitud y **hace fallar la puerta**; muchos archivos que competían por una ruta como `**/*.tf` provocaron el fallo #6.

### Instrucciones de todo el repositorio (`copilot-instructions.md`)

Este archivo **no lleva frontmatter** y se inserta en cada solicitud de chat, agente y revisión de código en todas las superficies, por lo que cada línea supone un costo recurrente de tokens. Mantén su extensión **en 100 líneas o menos**.

- Incluye aquí únicamente contenido de **aplicación general**: contexto del proyecto, tecnologías de destino, reglas transversales y la lista estricta de prohibiciones. GitHub recomienda que las instrucciones sean «enunciados breves y autosuficientes».
- **No repitas reglas específicas de un lenguaje o una ruta.** Los archivos con alcance por ruta existen para «evitar sobrecargar las instrucciones de todo el repositorio»; los detalles de Java, TypeScript, Terraform, bases de datos y seguridad pertenecen a `instructions/*.instructions.md`, que se cargan automáticamente para las rutas correspondientes.
- Conserva aquí la **declaración de tecnologías**, aunque los archivos de alcance específico la repitan: no está documentado si `applyTo` coincide con un directorio que todavía no existe, y `backend/` y `frontend/` solo se crean en la etapa 3.
- Evita los antipatrones documentados: órdenes de ir a leer otro documento, enrutamiento a herramientas o extensiones, imposiciones de tono y límites de extensión de las respuestas.

### Frontmatter de habilidades

Archivo: `skills/<dir>/SKILL.md`. Solo son válidas `name` y `description`.

- `name` **debe coincidir exactamente con el nombre del directorio padre** (letras minúsculas, dígitos y guiones; máximo 64 caracteres); de lo contrario, la habilidad no se carga y no se muestra ningún aviso (fallo #4).
- `description` debe indicar **cuándo utilizar** la habilidad, porque dirige la carga automática semántica, y tiene un límite de 1024 caracteres.
- `license`, `allowed-tools`, `compatibility` y `metadata` **no** forman parte del esquema; elimínalas.

### Configuración de hooks

Un hook es un archivo JSON ubicado directamente en `hooks/<name>.json`. Un archivo anidado `<name>/hooks.json` **nunca se descubre** ni se ejecuta, sin que se muestre ningún aviso (fallo #3). El script del controlador se encuentra en `hooks/<name>/` y debe ser ejecutable.

- `version` debe ser `1`; `hooks` asocia un evento con una lista de controladores.
- Los eventos incluyen `sessionStart`, `sessionEnd`, `userPromptSubmitted`, `preToolUse` y `postToolUse`. El `type` de un controlador es `command`, `http` o `prompt`.

Un hook `preToolUse` bloquea una llamada a una herramienta escribiendo este objeto en stdout:

```json
{"permissionDecision":"deny","permissionDecisionReason":"..."}
```

## Secciones obligatorias del cuerpo

`scripts/validate-copilot-primitives.py` comprueba automáticamente la estructura de las secciones. Utiliza estos encabezados, en este orden.

| Primitiva | Secciones `##` obligatorias, en orden |
|---|---|
| Agente | `Misión`, `Personas líderes`, `Principios operativos`, `Lo que este agente sabe`, `Lo que este agente NO sabe`, `Prompts disponibles`, un encabezado que termine en `Definición de terminado`, `Antipatrones que este agente rechaza`, `Integración con Spec-Kit` |
| Prompt | `Objetivo`, `Cuándo invocar`, `Precondiciones`, `Entradas que debe proporcionar el equipo`, `Lo que haré`, `Lo que NO haré`, `Formato de salida`, opcionalmente `Reglas de <file>`, `Definición de terminado`, `Cuerpo del prompt`, `Ejemplo de invocación` |
| Instrucción | Secciones temáticas concretas y después `Convenciones`, `Qué hacer / Qué no hacer`, `Lista de verificación antes de abrir una PR` |
| Habilidad | `Cuándo invocar`, una sección de procedimiento sustancial, `Plantilla de salida`, `Puerta de calidad` |

## Estructuras iniciales

Copia una estructura inicial, conserva el frontmatter y el orden de las secciones y después sustituye todos los marcadores de posición entre corchetes angulares.

### Estructura inicial de un agente

````markdown
---
name: "<agent-id>"
description: "Asistente de <etapa N o persona> — una línea"
tools: [read, search, edit]
# handoffs:                 # Solo agentes de etapa, y únicamente si existe una etapa siguiente
#   - label: "Iniciar la etapa <N+1>"
#     agent: <next-agent-id>
#     prompt: "<qué hace el siguiente agente con los artefactos de esta etapa>"
#     send: false
---
# @<agent-id>-agent

## Misión

<Qué ayuda a hacer el agente al equipo y qué límite no cruzará.>

## Personas líderes

| Rol | Participación |
|------|-----------|
| **<Persona>** | LÍDER — <responsabilidad> |

## Principios operativos

- **<Principio>.** <Una o dos frases de criterio o enrutamiento.>

## Lo que este agente sabe

<Patrones generales y transferibles; nunca respuestas específicas del sistema.>

## Lo que este agente NO sabe

<Todo lo que debe surgir de la investigación del propio equipo.>

## Prompts disponibles

| Comando | Propósito |
|---------|---------|
| [`/<command>`](../prompts/<file>.prompt.md) | <propósito> |

## Definición de terminado

- [ ] <resultado verificable>

## Antipatrones que este agente rechaza

1. **<Antipatrón>.** <Por qué se rechaza y cuál es la alternativa indicada.>

## Integración con Spec-Kit

<Dónde se sitúa el agente dentro del flujo /speckit.*.>
````

Un agente de etapa puede anteponer su etapa al antepenúltimo encabezado, por ejemplo, `## Etapa 1 Definición de terminado`.

### Estructura inicial de un prompt

`## Cuerpo del prompt` es Markdown sin bloque de código, dirigido al agente en segunda persona. Comienza con una línea de rol como `Eres el @<agent-id>.` y después guía el trabajo mediante encabezados de pasos en negrita `**Paso 1 — ...**`, `**Paso 2 — ...**`, cada uno seguido de viñetas.

````markdown
---
name: "<slash-command>"
description: "<una línea>"
argument-hint: "<arg=... arg=...>"
agent: "<agent-id>"
tools: ["read", "search", "edit"]
---
# /<slash-command>

## Objetivo

<El único resultado que produce este prompt.>

## Cuándo invocar

## Precondiciones

## Entradas que debe proporcionar el equipo

## Lo que haré

## Lo que NO haré

## Formato de salida

```markdown
<la estructura exacta que añade o produce el prompt>
```

## Definición de terminado

- [ ] <resultado verificable>

## Cuerpo del prompt

Eres el `@<agent-id>`. <Encuadre de la tarea en una línea.>

**Paso 1 — <acción>**

- <instrucción>

**Paso 2 — <acción>**

- <instrucción>

## Ejemplo de invocación

```text
/<slash-command> arg=<value>
```
````

Cuando el prompt dependa de una instrucción o habilidad, añade una sección opcional `## Reglas de <file>` que incluya las reglas que aplicas, inmediatamente antes de `## Definición de terminado`.

### Estructura inicial de una instrucción

````markdown
---
description: "Utiliza cuando <situación que delimita el alcance de este archivo>."
applyTo: "<glob>,<glob>"
---

# <Tema> — Guía

<Un párrafo: qué activa este archivo, qué cubre y qué instrucción del mismo directorio se encarga del resto.>

## <Tema concreto>

<Orientaciones con ejemplos.>

## Convenciones

| Regla | Justificación |
|---|---|
| <regla> | <motivo> |

## Qué hacer / Qué no hacer

| Qué hacer | Qué no hacer |
|---|---|
| <qué hacer> | <qué no hacer> |

## Lista de verificación antes de abrir una PR

- [ ] <elemento verificable>
````

### Estructura inicial de una habilidad

`name` debe coincidir con el nombre del directorio `skills/<dir>/`.

````markdown
---
name: "<dir>"
description: "Utiliza cuando <condición de activación>. Los activadores incluyen \"<palabra clave>\", \"<palabra clave>\"."
---
# <Título de la habilidad>

## Cuándo invocar

- "<paráfrasis de una solicitud que debería cargar esta habilidad>"

## <Procedimiento sustancial>

<Una lista de verificación, una tabla o pasos numerados: el núcleo operativo.>

## Plantilla de salida

```markdown
<la estructura que produce la habilidad>
```

## Puerta de calidad

- [ ] <comprobación objetiva de aprobación o fallo>
````

### Estructura inicial de un hook

Archivo ubicado directamente en `hooks/<name>.json`, con el script referenciado en `hooks/<name>/` y marcado como ejecutable.

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "bash": ".github/hooks/<name>/<script>.sh",
        "cwd": ".",
        "env": { "MODE": "block" },
        "timeoutSec": 10
      }
    ]
  }
}
```

## Cómo se aplica el estándar

- El trabajo **`copilot-primitives`** de [`workflows/spec-quality.yml`](workflows/spec-quality.yml) ejecuta [`scripts/validate-copilot-primitives.py`](scripts/validate-copilot-primitives.py): esquemas de frontmatter, integridad de `prompt -> agent` y `handoff -> agent`, un H1, un único salto de línea final, resolución de enlaces relativos dentro de `.github/`, directivas prohibidas, herramientas prohibidas, rutas obsoletas y las secciones obligatorias del cuerpo indicadas anteriormente.
- El trabajo **`markdown-lint`** ejecuta el archivo raíz [`../.markdownlint-cli2.jsonc`](../.markdownlint-cli2.jsonc); **`spec-traceability`** y **`legacy-traceability`** exigen la cobertura de REQ-ID y `source_legacy`.
- Esa configuración deshabilita `MD025` y `MD040`, entre otras, así que no confundas las dos puertas: «exactamente un H1» hace fallar el validador de primitivas (nunca markdownlint), y «cada bloque de código delimitado declara un lenguaje» es una convención de revisión, no un fallo de lint.
- Cada error recurrente recibe una protección con nombre en el código o en la CI y, cuando modifica una decisión duradera, un ADR. Los análisis posteriores de facilitación y el material de respuestas permanecen fuera de este repositorio público.

Implementaciones de referencia de las que puedes partir: [`agents/archaeologist.agent.md`](agents/archaeologist.agent.md), [`prompts/stage-archaeologist-extract-business-rules.prompt.md`](prompts/stage-archaeologist-extract-business-rules.prompt.md), [`skills/ears-validate/SKILL.md`](skills/ears-validate/SKILL.md) e [`instructions/modular-monolith.instructions.md`](instructions/modular-monolith.instructions.md).

## Lista de verificación de autoría

- [ ] La primitiva está en la carpeta correcta y tiene el sufijo correcto (`.agent.md`, `.prompt.md`, `.instructions.md`, `SKILL.md` o un archivo ubicado directamente en `hooks/<name>.json`).
- [ ] El frontmatter utiliza únicamente claves válidas, sin claves retiradas (`infer`, `mode`) ni inventadas (`tested_with`), y el `name` de cada habilidad coincide con su directorio.
- [ ] Todas las secciones obligatorias del cuerpo están presentes, en orden.
- [ ] Exactamente un H1, sin omitir niveles de encabezado, cada bloque de código delimitado con lenguaje, un salto de línea final y ninguna directiva de markdownlint.
- [ ] Cada convención cita su documento autorizado; no hay hechos inventados sobre SIFAP ni herramientas prohibidas; el idioma corresponde a la rama de destino (inglés en `main` y `develop`, portugués de Brasil en `portugues-br`, español en `espanol`), sin emojis.
- [ ] Todos los enlaces relativos se resuelven en el disco.
- [ ] Tanto `python3 .github/scripts/validate-copilot-primitives.py` como `npx markdownlint-cli2 "<file>"` informan de cero problemas.
