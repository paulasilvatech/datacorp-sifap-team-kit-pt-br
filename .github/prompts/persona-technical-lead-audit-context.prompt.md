---
name: "audit-context"
description: "Audita la superficie de contexto de Copilot del repositorio (AGENTS.md, CODEMAP.md, instrucciones, prompts, agentes) y devuelve correcciones priorizadas."
argument-hint: "scope=.github"
agent: "tech-lead"
tools: ["read", "search"]
---
# /audit-context

## Objetivo

Audita la superficie de ingeniería de contexto del repositorio (`AGENTS.md`, `CODEMAP.md`,
`.github/instructions/*`, `.github/prompts/*`, `.github/agents/*`) y devuelve una
lista priorizada de correcciones concretas. Cada hallazgo es un problema real con una
solución específica, ordenado por gravedad.

## Cuándo invocar

Periódicamente, antes de un traspaso de etapa o después de cambiar varias primitivas, para detectar
divergencias, alcances ausentes y referencias obsoletas.

## Precondiciones

- El repositorio tiene una superficie de contexto `.github/` que auditar
- Los archivos de índice [`../instructions/README.md`](../instructions/README.md) y el [índice de prompts](README.md) son la referencia para los archivos y convenciones esperados

## Entradas que debe proporcionar el equipo

- El alcance que auditar, si es menor que toda la superficie `.github/` (opcional)

Pregunta a la persona usuaria solo si el alcance es ambiguo.

## Lo que haré

- Enumerar cada archivo de `.github/instructions/`, `.github/prompts/` y `.github/agents/` con su número de líneas
- Comprobar el alcance `applyTo:` de cada archivo de instrucciones y señalar `**` o un alcance ausente
- Leer `CODEMAP.md` y marcarlo como desactualizado si lleva 30+ días sin cambios o referencia archivos eliminados
- Comprobar que el frontmatter de cada prompt/agente tenga una `description` informativa, un `agent` que se resuelva a un agente real, herramientas mínimas y ningún modelo fijado
- Utilizar grep para encontrar referencias obsoletas a carpetas y enlaces relativos rotos
- Resumir los hallazgos en una tabla ordenada por gravedad, delegando el procedimiento de auditoría a [`../skills/context-audit/SKILL.md`](../skills/context-audit/SKILL.md)

## Lo que NO haré

- Señalar algo que no sea un problema real: sin falsos positivos
- Editar código ni archivos de contexto: audito y recomiendo; la persona responsable aplica las correcciones
- Sugerir fijar un modelo o proveedor: la persona usuaria elige el contexto de ejecución (consulta [`../../09-cheat-sheets/model-routing.md`](../../09-cheat-sheets/model-routing.md))
- Reescribir las primitivas por mi cuenta: el trabajo de reestructuración se redirige al prompt de la persona responsable

## Formato de salida

Una tabla Markdown ordenada por gravedad y un resumen de las 3 correcciones principales. Ejemplo (ilustrativo):

```markdown
## Auditoría de contexto — 2026-05-04

| Archivo | Problema | Gravedad | Corrección |
|------|-------|----------|------------|
| .github/instructions/frontend.instructions.md | applyTo: "**" demasiado amplio | Alta | Limitar el alcance a frontend/**/*.{ts,tsx} |
| .github/prompts/persona-dba-tune.prompt.md | description es "TBD" | Media | Escribir una descripción imperativa de una línea |
| CODEMAP.md | Sin actualizar en 62 días | Media | Ejecutar /update-codemap |

### Las 3 correcciones principales
1. Reducir el alcance de las instrucciones de frontend.
2. Actualizar CODEMAP.md.
3. Corregir la descripción del prompt del DBA.
```

## Definición de terminado

- [ ] Sin falsos positivos: cada elemento señalado es un problema real
- [ ] Cada elemento de gravedad alta tiene una corrección concreta, no una sugerencia vaga
- [ ] Se informa explícitamente de la vigencia de `CODEMAP.md`
- [ ] Se comprueban los alcances `applyTo` de cada archivo de instrucciones
- [ ] Los hallazgos se ordenan por gravedad con un resumen de los 3 principales
- [ ] Ninguna sugerencia modifica código de aplicación: solo archivos de contexto

## Cuerpo del prompt

Eres el `@tech-lead`. El equipo quiere mantener en buen estado la superficie de contexto.

**Paso 1 — Haz el inventario.**
Enumera cada archivo de `.github/instructions/`, `.github/prompts/` y
`.github/agents/`, con su número de líneas. Compara con los archivos de índice para detectar
cualquier elemento ausente o no documentado.

**Paso 2 — Comprueba los alcances de instrucciones.**
Abre cada `*.instructions.md` y lee su `applyTo:`. Señala cualquier archivo con
`applyTo: "**"` o alcance ausente como gravedad alta: los alcances amplios introducen contexto
en trabajos no relacionados.

**Paso 3 — Comprueba la vigencia de CODEMAP.**
Lee `CODEMAP.md`. Márcalo como desactualizado si lleva 30+ días sin cambios o referencia
archivos que ya no existen. Informa explícitamente de su vigencia, incluso cuando esté al día.

**Paso 4 — Comprueba la calidad del frontmatter.**
Para cada prompt y agente, verifica que la `description` sea informativa (no "TBD"), que el
`agent` se resuelva a un archivo real en `.github/agents/`, que el conjunto de herramientas sea mínimo y que
no haya ningún modelo ni proveedor fijado.

**Paso 5 — Encuentra referencias obsoletas y enlaces rotos.**
Busca con grep referencias a carpetas renombradas o eliminadas y enlaces relativos cuyo
destino esté ausente. Registra cada uno con su archivo y línea.

**Paso 6 — Prioriza.**
Resume los hallazgos en una tabla ordenada por gravedad (alta, media, baja), cada uno con una
corrección concreta, y termina con las tres correcciones principales.

Informa solo de problemas reales. No propongas editar código de aplicación: esta auditoría
cubre únicamente archivos de contexto.

## Ejemplo de invocación

```
/audit-context scope=.github
```
