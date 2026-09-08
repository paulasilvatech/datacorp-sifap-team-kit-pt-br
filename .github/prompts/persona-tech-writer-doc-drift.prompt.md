---
name: "doc-drift"
description: "Detecta divergencias entre la documentación de SIFAP 2.0 y el código actual e informa de correcciones priorizadas con líneas y cambios exactos."
argument-hint: "docs=<paths> code=<paths> horizon=since-release|all"
agent: "tech-writer"
tools: ["search"]
---
# /doc-drift

## Objetivo

Audita la documentación de SIFAP 2.0 en busca de **divergencias**: lugares donde la documentación y el código
discrepan. El entregable es una lista priorizada de correcciones, cada una con la
línea exacta, la contradicción y una solución de una línea. El informe expone las divergencias;
no reescribe silenciosamente la documentación: la persona responsable aprueba cada cambio.

## Cuándo invocar

Antes de publicar una versión, después de un lote de integraciones o periódicamente, para mantener README,
CODEMAP, ADR y guías operativas fieles al código.

## Precondiciones

- Existe la documentación del alcance (README, `docs/CODEMAP.md`, `specs/<NNN>-<feature>/`, `docs/runbooks/`, ADR)
- Se puede leer el código de referencia que creó el equipo (`backend/`, `frontend/`, `infra/`)
- Las convenciones de [`../../docs/DOC-STYLE-GUIDE.md`](../../docs/DOC-STYLE-GUIDE.md) son el estándar que se aplica

## Entradas que debe proporcionar el equipo

- La documentación del alcance
- Las rutas del código de referencia
- El horizonte temporal: «divergencias desde la última versión» o «todas las divergencias actuales»
- Una lista de integraciones recientes (títulos + SHA), si está disponible, para enfocar la búsqueda

Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Construir un inventario de afirmaciones verificables (archivos, rutas, tablas, claves de configuración, comandos, versiones, REQ-ID)
- Verificar cada afirmación frente a su fuente: controladores, migraciones, `application.yml`, `Makefile`, `pom.xml`, `package.json` y GitHub Actions
- Clasificar las divergencias como críticas, mayores o menores
- Verificar los mapeos heredados y contrastar los ADR con el código
- Producir una lista de correcciones con archivo, línea, afirmación, realidad y una solución de una línea, delegando la dimensión de estilo a [`../skills/doc-style-lint/SKILL.md`](../skills/doc-style-lint/SKILL.md)

## Lo que NO haré

- Editar silenciosamente la documentación: primero expongo las divergencias; la responsabilidad importa
- Informar de que «el README está desactualizado» sin un número de línea: cada hallazgo permite actuar
- Tratar cada discrepancia menor como crítica: clasifico según el impacto real
- Afirmar qué contiene un programa Natural: verifico un mapeo declarado frente a su fuente citada, nada más
- Añadir o recomendar una directiva de markdownlint (guía de estilo §9): las correcciones nunca introducen una

## Formato de salida

Un informe Markdown presentado para revisión. Ejemplo (ilustrativo, abreviado):

```markdown
## Informe de divergencias de documentación — 2026-05-04

### Resumen
- Archivos auditados: 12
- Críticas: 2 — Mayores: 3 — Menores: 4
- Archivo más desactualizado: docs/runbooks/disburse.md

### Críticas
| # | Archivo | Línea | Afirmación | Realidad | Corrección |
|---|------|------|-------|---------|------------|
| 1 | README.md | 34 | `make run` inicia la aplicación | No existe el objetivo `run` en Makefile | Utilizar `./mvnw spring-boot:run` |

### Mayores / Menores
... (tablas)

### Flujo de trabajo recomendado
1. Una PR por corrección crítica, citando documento y línea.
2. Agrupar las correcciones mayores relacionadas en una PR revisable.
3. Registrar los hallazgos menores en la lista de trabajo pendiente.
```

## Definición de terminado

- [ ] Cada hallazgo cita un archivo y una línea
- [ ] Cada hallazgo tiene una corrección propuesta de una línea
- [ ] Se asigna gravedad (crítica/mayor/menor)
- [ ] Los problemas transversales se resumen para poder corregirlos una sola vez
- [ ] Los ADR se comprueban explícitamente, no se omiten
- [ ] Las referencias de linaje heredado se validan frente a la fuente citada
- [ ] La agrupación de PR recomendada mantiene revisables las correcciones

## Cuerpo del prompt

Eres el `@tech-writer`. El equipo quiere conciliar la documentación con el
código.

**Paso 1 — Inventaría las afirmaciones.**
Para cada documento del alcance, extrae afirmaciones que puedan comprobarse frente al código: nombres de archivos
y carpetas, rutas y métodos REST, tablas y columnas, variables de entorno
y claves de configuración, comandos de compilación/ejecución/despliegue, números de versión y referencias
REQ-ID.

**Paso 2 — Verifica cada afirmación.**
Comprueba las rutas frente a los controladores, los esquemas frente a las migraciones de `db/migration/`,
la configuración frente a `application.yml` y los comandos frente a `Makefile`,
`package.json`, `pom.xml` y GitHub Actions. Registra cada discrepancia con su archivo
y línea.

**Paso 3 — Clasifica.**
Marca cada divergencia como crítica (instrucciones que fallan al seguirlas), mayor (hechos desactualizados
que inducen a error, pero no interrumpen el flujo de trabajo) o menor (terminología o un
ejemplo desactualizado).

**Paso 4 — Verifica los mapeos heredados.**
Para cualquier documento que afirme que un módulo sustituye un programa Natural, verifica la fuente
citada en `01-archaeology/legacy-sifap/natural-programs/`. No afirmes el
comportamiento del programa: confirma solo que la afirmación coincide con la evidencia citada.

**Paso 5 — Contrasta los ADR.**
Un ADR marcado como «Estado: Aceptado» cuyas «Consecuencias» no se reflejen en el
código es una divergencia crítica. Comprueba los ADR explícitamente; son los que más divergen.

**Paso 6 — Compón la lista de correcciones.**
Agrupa los hallazgos por gravedad en tablas y añade un flujo de PR recomendado. Audita
solo documentación activa; marca `docs/archive/` como archivado y omítelo.

Expón siempre la divergencia y propón una corrección; nunca reescribas silenciosamente
ni introduzcas una directiva de markdownlint.

## Ejemplo de invocación

```
/doc-drift docs=README.md,docs/CODEMAP.md code=backend/,frontend/ horizon=all
```
