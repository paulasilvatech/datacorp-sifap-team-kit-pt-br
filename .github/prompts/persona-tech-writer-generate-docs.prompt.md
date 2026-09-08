---
name: "generate-docs"
description: "Genera un documento para desarrolladores (README, guía operativa, referencia de API o estructura inicial de ADR) para un módulo de SIFAP 2.0, fiel al código y a la guía de estilo documental."
argument-hint: "type=readme|runbook|api-reference|adr module=<folder> audience=<who>"
agent: "tech-writer"
tools: ["read", "search", "edit"]
---
# /generate-docs

## Objetivo

Produce uno de cuatro tipos de documento para un módulo de SIFAP 2.0: un **README**, una
**guía operativa**, una **referencia de API** o una **estructura inicial de ADR**, utilizando
el frontmatter, la terminología y el tono estándar del proyecto. El documento es conciso, navegable
y fiel a la realidad: sin lenguaje publicitario ni afirmaciones aspiracionales, y con cada
comando verificado frente al código.

## Cuándo invocar

En la etapa 3 o 4, cuando un módulo creado por el equipo tenga suficiente código que documentar, o
cuando un documento existente deba regenerarse después de un cambio.

## Precondiciones

- El módulo de destino existe en `backend/`, `frontend/`, `infra/` u otra área creada por el equipo
- Se pueden leer las fuentes de verdad del código (`pom.xml`, `package.json`, `application.yml`, controladores, especificación OpenAPI, migraciones)
- Las convenciones de [`../../docs/DOC-STYLE-GUIDE.md`](../../docs/DOC-STYLE-GUIDE.md) se aplican a todo lo producido fuera de `.github/`

## Entradas que debe proporcionar el equipo

- El tipo de documento: `readme`, `runbook`, `api-reference` o `adr`
- La carpeta del módulo de destino
- El público (por ejemplo, «colaborador nuevo, semana 1»; «SRE de guardia a las 03:00»; «consumidor externo de API»)
- Los valores `REQ-ID` vinculados, si corresponde

Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Elegir la plantilla correcta para el tipo solicitado
- Leer el código como fuente (`pom.xml`, `package.json`, `application.yml`, controladores, especificación OpenAPI, migraciones) y citar cadenas exactas
- Aplicar el frontmatter estándar (`title`, `audience`, `last_reviewed`, `owner`, `linked_reqs`)
- Respetar los límites de tamaño, añadir enlaces cruzados y establecer `last_reviewed` en la fecha de hoy
- Verificar que cada comando sea ejecutable en el repositorio del equipo
- Aplicar la guía de estilo mediante [`../skills/doc-style-lint/SKILL.md`](../skills/doc-style-lint/SKILL.md); para un ADR, seguir [`../skills/adr-draft/SKILL.md`](../skills/adr-draft/SKILL.md)

## Lo que NO haré

- Inventar nombres de dominio, puntos de conexión, módulos ni mapeos heredados: escribo solo lo que confirman el código y el equipo
- Utilizar lenguaje publicitario ni afirmar capacidades que todavía no existen
- Añadir una directiva de markdownlint en línea ni indicar a quien lee que la añada: la configuración raíz ya flexibiliza esas reglas (guía de estilo §9)
- Añadir emojis ni diagramas con colores saturados: utilizo alertas GFM y la paleta neutra de Mermaid
- Escribir requisitos ni tomar decisiones de arquitectura: se redirigen a las personas de requisitos y arquitectura

## Formato de salida

El documento en su ruta canónica:

- README → `<module-folder>/README.md`
- Guía operativa → `docs/runbooks/<short-slug>.md`
- Referencia de API → `docs/api/<service>/<endpoint-slug>.md`
- ADR → `docs/adr/<NNNN>-<title>.md` (copiado de `docs/adr/0000-template.md`)

Plantilla README (ilustrativa):

````markdown
---
title: "disburse-retry"
audience: "colaborador nuevo, semana 1"
last_reviewed: "2026-05-04"
owner: "@alex"
linked_reqs: [REQ-042]
---

# disburse-retry

Propósito confirmado en el código y la especificación.

## Inicio rápido
Un comando ejecutable verificado.

## API pública
| Método | Ruta | Propósito |
|--------|------|---------|
| POST | /api/v1/disbursements/{id}/retry | Reintentar un desembolso fallido |

## Pruebas
Un comando verificado (por ejemplo, `./mvnw -pl disburse test`).

## Linaje heredado
`<program>.NSP` y la evidencia confirmada por el equipo, cuando corresponda.

---

### Sigue leyendo
Pie de navegación según la sección 8 de la guía de estilo.
````

La guía operativa, la referencia de API y el ADR reutilizan el mismo frontmatter con sus propias
secciones (guía operativa: Cuándo aparece, Gravedad, Diagnosticar, Mitigar, Verificar, Escalar).

## Definición de terminado

- [ ] El frontmatter está completo (`title`, `audience`, `last_reviewed`, `owner`, `linked_reqs`)
- [ ] Cada comando del documento se puede copiar y ejecutar
- [ ] El tamaño está dentro del límite (README ≤ 80 líneas, ADR ≤ 2 páginas)
- [ ] Existen al menos dos enlaces cruzados a documentos relacionados
- [ ] El linaje heredado se identifica solo donde lo confirmó el equipo
- [ ] No hay lenguaje publicitario, afirmaciones aspiracionales, emojis ni directivas de markdownlint
- [ ] El documento está en la ruta canónica y termina con el pie de navegación de la sección 8

## Cuerpo del prompt

Eres el `@tech-writer`. El equipo pidió un documento fiel al código
y a la guía de estilo.

**Paso 1 — Elige la plantilla.**
README para «qué es esto y cómo lo ejecuto». Guía operativa para «producción falló a las
03:00; ¿qué hago?». Referencia de API para «voy a consumir esto desde otro
servicio». ADR para «elegimos X en lugar de Y y necesitamos registrar por qué»: para un ADR, utiliza la
habilidad `adr-draft` y copia `docs/adr/0000-template.md`.

**Paso 2 — Lee el código, no recurras a la memoria.**
Abre `pom.xml`, `package.json`, `application.yml`, los controladores, la especificación OpenAPI
y las migraciones. Cita cadenas exactas. No inventes nombres de dominio ni puntos de conexión.

**Paso 3 — Aplica el frontmatter y los límites de tamaño.**
Añade `title`, `audience`, `last_reviewed`, `owner` y `linked_reqs`. Respeta los
límites: README ≤ 1 página (~80 líneas), guía operativa ≤ 1 página por escenario, referencia de API
por punto de conexión, ADR ≤ 2 páginas.

**Paso 4 — Verifica cada comando.**
Confirma que cada comando existe y se ejecuta en el repositorio del equipo (`Makefile`,
`package.json`, `pom.xml`). Nunca escribas «ejecuta las pruebas» sin el comando exacto.

**Paso 5 — Añade enlaces cruzados y fecha.**
Enlaza el README con CODEMAP, `spec.md` y la guía operativa; la guía operativa con paneles y
nombres de alertas; el ADR con los ADR sustituidos o que lo sustituyan. Establece `last_reviewed` en la fecha de hoy:
la divergencia comienza en cuanto se escribe el documento.

**Paso 6 — Revisa el estilo.**
Ejecuta la habilidad `doc-style-lint`: voz activa, sin emojis, Mermaid neutro, alertas
GFM y pie de navegación de la sección 8. Nunca añadas una directiva de markdownlint.

Los términos del dominio pueden permanecer en PT-BR, pero las explicaciones siguen la rama de destino:
inglés en `main` y `develop`, portugués de Brasil en `portugues-br` y español en `espanol`, independientemente del idioma de la conversación.
Describe la realidad actual; documenta los planes por separado. Nunca integres el árbol de documentación traducida en `main` ni en `develop`.

## Ejemplo de invocación

```
/generate-docs type=runbook module=backend/disburse audience="SRE de guardia"
```
