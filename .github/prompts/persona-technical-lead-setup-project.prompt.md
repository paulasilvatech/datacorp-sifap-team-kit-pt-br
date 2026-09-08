---
name: "setup-project"
description: "Inicializa la estructura de ingeniería de contexto de Copilot de un proyecto: AGENTS.md, CODEMAP.md y la base de instrucciones, prompts y agentes de .github."
argument-hint: "root=<repo-root>"
agent: "tech-lead"
tools: ["read", "search", "edit", "execute"]
---
# /setup-project

## Objetivo

Inicializa la estructura de ingeniería de contexto de Copilot para un proyecto que no tenga una:
`AGENTS.md`, `CODEMAP.md`, `.github/copilot-instructions.md` y archivos básicos de
`.github/instructions/`, `.github/prompts/` y `.github/agents/`. El
resultado es específico de las tecnologías, tiene un alcance delimitado y está libre de secretos, listo para que el equipo lo amplíe.

## Cuándo invocar

Al inicio de un proyecto o cuando un proyecto existente carece de una superficie de contexto
de Copilot. En esta inmersión, el equipo crea `backend/`, `frontend/` e `infra/`
desde cero en la etapa 3; este prompt crea la estructura de archivos de contexto, nunca un
prototipo de aplicación.

## Precondiciones

- Una raíz de repositorio en la que el equipo pueda escribir
- Acuerdo de utilizar la cadena de herramientas aprobada en [`../copilot-instructions.md`](../copilot-instructions.md) (VS Code, GitHub Copilot Ask/Plan/Agent, Copilot CLI, Spec-Kit, GitHub, Docker Compose, Terraform)

## Entradas que debe proporcionar el equipo

- La ruta raíz del repositorio
- Las tecnologías principales, si no pueden detectarse a partir de los manifiestos

Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Detectar las tecnologías a partir de `package.json`, `pom.xml`, `requirements.txt` o `*.csproj`
- Crear `AGENTS.md` con un resumen de las tecnologías y los comandos verificados de compilación, pruebas y lint
- Crear una estructura inicial de `CODEMAP.md` con `## Módulos`, `## Flujo de datos` e `## Integraciones externas`
- Crear `.github/copilot-instructions.md` con el idioma de la rama de destino, el tono y las reglas de seguridad del equipo
- Añadir archivos básicos `.github/instructions/*.instructions.md`, cada uno con un alcance `applyTo:` específico
- Preparar los cambios en el área de staging sin crear un commit y mostrar los archivos creados
- Recomendar ejecutar después [`/audit-context`](persona-technical-lead-audit-context.prompt.md) y la habilidad [`../skills/context-audit/SKILL.md`](../skills/context-audit/SKILL.md)

## Lo que NO haré

- Crear un prototipo de aplicación, `backend/`, `frontend/` ni `infra/`: son trabajo del equipo en la etapa 3
- Escribir un `AGENTS.md` genérico: debe reflejar las tecnologías detectadas
- Utilizar `applyTo: "**"`: cada archivo de instrucciones recibe un patrón glob específico
- Crear commits ni escribir secretos, credenciales o marcadores de posición `TODO` en la estructura inicial
- Añadir una herramienta fuera de la cadena aprobada: una excepción se redirige a un ADR mediante [`../skills/adr-draft/SKILL.md`](../skills/adr-draft/SKILL.md)

## Formato de salida

Un informe de archivos creados mostrado después de preparar los cambios en staging. Ejemplo (ilustrativo):

```markdown
## Estructura inicial creada — 6 archivos preparados en staging

- /repo/AGENTS.md
- /repo/CODEMAP.md
- /repo/.github/copilot-instructions.md
- /repo/.github/instructions/backend.instructions.md   (applyTo: backend/**/*.java)
- /repo/.github/instructions/frontend.instructions.md  (applyTo: frontend/**/*.ts)
- /repo/.github/prompts/README.md

Primer commit sugerido: "chore: añadir estructura de ingeniería de contexto de Copilot"

Seguimiento (manual):
1. Completar CODEMAP.md cuando exista el primer módulo.
2. Ejecutar /audit-context para verificar los alcances.
3. Revisar con el equipo las reglas de seguridad de copilot-instructions.md.
```

## Definición de terminado

- [ ] `AGENTS.md` es específico de las tecnologías detectadas, no genérico
- [ ] Cada archivo de instrucciones tiene un alcance `applyTo:` específico (sin `**`)
- [ ] No hay secretos, credenciales ni marcadores de posición `TODO`
- [ ] `.gitignore` se actualiza si las carpetas nuevas necesitan reglas de seguimiento
- [ ] Los cambios están preparados en staging, pero no incluidos en un commit, y se muestra la lista de archivos
- [ ] Se incluyen un mensaje de commit sugerido y tres pasos manuales de seguimiento

## Cuerpo del prompt

Eres el `@tech-lead`. El equipo quiere una estructura limpia de contexto de Copilot sobre la que
construir.

**Paso 1 — Detecta las tecnologías.**
Inspecciona `package.json`, `pom.xml`, `requirements.txt` y `*.csproj` para identificar
lenguajes, marcos y comandos de compilación, pruebas y lint. Si no se puede detectar
nada, solicita al equipo las tecnologías principales.

**Paso 2 — Escribe AGENTS.md.**
Resume las tecnologías detectadas, las convenciones de código y los comandos verificados de compilación, pruebas y
lint. Mantén la especificidad: una persona recién incorporada debería conocer las tecnologías solo con este
archivo.

**Paso 3 — Escribe la estructura inicial de CODEMAP.md.**
Crea `CODEMAP.md` con `## Módulos`, `## Flujo de datos` e `## Integraciones
externas`. Deja la lista de módulos para que el equipo la complete mediante
[`/update-codemap`](persona-tech-writer-update-codemap.prompt.md) cuando existan módulos.

**Paso 4 — Escribe copilot-instructions.md.**
Registra el idioma por rama de destino (inglés en `main` y `develop`, portugués de Brasil en `portugues-br`, español en `espanol`), el tono y las reglas de seguridad del equipo y la cadena de herramientas aprobada.
El idioma de la conversación no cambia esta política; nunca integres el árbol de documentación traducida en `main` ni en `develop`.
No repitas todo el archivo global: enlázalo y añade solo lo específico del proyecto.

**Paso 5 — Añade archivos de instrucciones con alcance delimitado.**
Para cada área detectada, añade un archivo `*.instructions.md` con un patrón glob `applyTo:`
específico (por ejemplo, `backend/**/*.java`, `frontend/**/*.ts`). Sigue las
convenciones de [`../instructions/README.md`](../instructions/README.md). Nunca utilices
`applyTo: "**"`.

**Paso 6 — Prepara en staging e informa.**
Prepara los cambios con git, pero no crees un commit. Muestra las rutas absolutas de los archivos
creados, un mensaje sugerido para el primer commit y tres pasos manuales de seguimiento.

Nunca escribas un secreto ni un marcador de posición en la estructura inicial y nunca crees un
prototipo de aplicación: eso corresponde al equipo.

## Ejemplo de invocación

```
/setup-project root=.
```
