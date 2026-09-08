---
name: "update-codemap"
description: "Genera o actualiza docs/CODEMAP.md: un índice revisado y navegable de la base de código de SIFAP 2.0 con módulos, responsables, puntos de entrada y pruebas."
argument-hint: "mode=update|rebuild root=<repo-root>"
agent: "tech-writer"
tools: ["search", "edit"]
---
# /update-codemap

## Objetivo

Produce o actualiza `docs/CODEMAP.md`, una guía de navegación de una página que una persona recién incorporada al equipo
pueda leer en diez minutos para encontrar cualquier módulo, su responsable, sus puntos de entrada y sus
pruebas. El mapa de código se mantiene con criterio, no se genera automáticamente; complementa `plan.md`
(arquitectura) y la especificación (requisitos).

## Cuándo invocar

En la etapa 3 o 4, después de añadir o renombrar módulos, siempre que el mapa y el código
hayan divergido.

## Precondiciones

- El equipo ha creado al menos un módulo en `backend/`, `frontend/` o `infra/`
- Se aplican las convenciones de [`../../docs/DOC-STYLE-GUIDE.md`](../../docs/DOC-STYLE-GUIDE.md)
- Los nombres de las personas responsables provienen de [`../../05-personas/`](../../05-personas/)

## Entradas que debe proporcionar el equipo

- La ruta raíz del repositorio
- Si se actualiza directamente (`update`) o se reconstruye (`rebuild`)
- Un `docs/CODEMAP.md` anterior, si existe

Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Enumerar las carpetas de servicios de nivel superior (paquetes de backend, rutas de frontend, módulos de infraestructura) creadas por el equipo
- Recoger cinco datos por módulo: propósito, puntos de entrada, estado persistente, intervalos de REQ-ID vinculados y persona responsable
- Enlazar cada módulo con sus pruebas
- Registrar el linaje heredado solo donde el equipo haya confirmado con evidencia un mapeo de programa Natural
- Señalar cualquier módulo que dependa de más de otros tres
- Ordenar los módulos por valor visible para el usuario y mantener el archivo por debajo de 200 líneas
- Aplicar la guía de estilo mediante [`../skills/doc-style-lint/SKILL.md`](../skills/doc-style-lint/SKILL.md)

## Lo que NO haré

- Generar el mapa a partir de `find . -type d`: un listado de directorios no es un mapa de código
- Afirmar qué contiene un programa Natural: el linaje registra solo evidencia confirmada por el equipo
- Enumerar cada archivo ni utilizar `*` para puntos de conexión: identifico módulos y rutas reales
- Utilizar equipos como responsables: la persona de guardia es la responsable
- Añadir emojis, Mermaid con colores saturados ni una directiva de markdownlint (guía de estilo §9)
- Mantener decisiones de arquitectura o requisitos: se redirigen a las personas de arquitectura y requisitos

## Formato de salida

`docs/CODEMAP.md` (o archivos secundarios enlazados). Ejemplo (ilustrativo, abreviado):

```markdown
# Mapa de código de SIFAP 2.0

> Última actualización: 2026-05-04. Responsables: consulta 05-personas.

## 1. Guía de lectura
- Rutas críticas: registro, desembolso.
- Consulta plan.md para arquitectura; spec.md para requisitos.

## 2. Servicios de backend

### registration — acepta y valida registros
- **Ruta**: `backend/src/main/java/app/registration/`
- **Pruebas**: `backend/src/test/java/app/registration/`
- **Puntos de entrada**: POST /api/v1/registrations
- **Estado**: tabla `registration`
- **REQ-IDs**: REQ-014, REQ-015
- **Responsable**: persona de arquitectura de software
- **Linaje heredado**: `<program>.NSP` (evidencia: business-rules-catalog.md #7)
- **Dependencias entre módulos**: shared/audit

## 3. Rutas de frontend · 4. Infraestructura · 5. Bibliotecas transversales · 6. Problemas observados

## 7. Cómo actualizar
Ejecuta /update-codemap después de añadir o renombrar cualquier módulo. Mantén con criterio; no generes automáticamente.
```

## Definición de terminado

- [ ] Se enumera cada servicio de backend, ruta de frontend y módulo de infraestructura
- [ ] Cada entrada tiene Propósito, Ruta, Pruebas, Puntos de entrada, Estado, REQ-ID y Responsable
- [ ] El linaje heredado se identifica solo donde el equipo haya confirmado un mapeo de programa Natural
- [ ] Las dependencias entre módulos están declaradas; los módulos con más de 3 están señalados
- [ ] El archivo se mantiene por debajo de 200 líneas (o se divide en archivos secundarios enlazados)
- [ ] La fecha de última actualización es hoy y está presente el pie de la sección 8
- [ ] Los nombres de las personas responsables coinciden con [`../../05-personas/`](../../05-personas/)

## Cuerpo del prompt

Eres el `@tech-writer`. El equipo necesita un mapa de código actual y navegable.

**Paso 1 — Elige el modo.**
Confirma `update` (incremental) o `rebuild`. Lee el `docs/CODEMAP.md` anterior,
si existe, para que una actualización conserve el trabajo de revisión manual.

**Paso 2 — Enumera módulos.**
Encuentra los servicios de backend en `backend/src/main/java/<pkg>/<service>/`, las rutas de frontend
en `frontend/app/<route>/` y los módulos de infraestructura en `infra/modules/<name>/` o en la
organización que creó el equipo.

**Paso 3 — Recoge cinco datos de cada uno.**
Para cada módulo, registra su propósito en una frase, puntos de entrada públicos, estado
persistente, intervalos de REQ-ID vinculados y persona responsable (según `05-personas/`).

**Paso 4 — Enlaza pruebas y linaje heredado.**
Enlaza cada módulo con su directorio de pruebas. Donde el equipo haya confirmado que un módulo sustituye
un programa Natural de `01-archaeology/legacy-sifap/natural-programs/`, cita el
archivo y la evidencia. Nunca adivines un mapeo.

**Paso 5 — Expón dependencias y ordena.**
Anota importaciones entre módulos, bibliotecas compartidas y servicios Azure externos. Señala cualquier
módulo que dependa de más de otros tres. Ordena los módulos por valor visible para el usuario:
primero los recorridos críticos y al final la infraestructura.

**Paso 6 — Representa y limita.**
Escribe un único archivo navegable de menos de 200 líneas. Si las supera, divídelo en
archivos secundarios por área y enlázalos. Establece la fecha de hoy y añade el pie
de la sección 8.

Mantén el mapa revisado con criterio. No lo generes automáticamente, no añadas emojis ni insertes una
directiva de markdownlint.

## Ejemplo de invocación

```
/update-codemap mode=update root=.
```
