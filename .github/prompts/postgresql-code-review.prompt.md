---
name: "postgresql-code-review"
description: "Revisa SQL y esquemas según las buenas prácticas y los antipatrones de PostgreSQL 16, delegando la lista de verificación en la habilidad postgresql-code-review."
argument-hint: "selection=<sql-or-schema>"
agent: "dba"
tools: ["read", "search"]
---
# /postgresql-code-review

## Objetivo

Revisa SQL, esquemas, funciones y capacidades de seguridad de PostgreSQL (JSONB, matrices, tipos personalizados, seguridad a nivel de fila) para una selección o todo el proyecto y devuelve un veredicto con correcciones concretas. La lista de verificación completa se encuentra en la habilidad [`postgresql-code-review`](../skills/postgresql-code-review/SKILL.md); este prompt la aplica a la base de datos de SIFAP 2.0 (PostgreSQL 16 mediante JPA/Hibernate) sin repetirla.

> [!IMPORTANT]
> Cualquier entrada de usuario concatenada en SQL es un defecto de inyección y provoca un rechazo automático: vincula todos los parámetros.

## Cuándo invocar

Durante la revisión de código de una migración, consulta, función o cambio de esquema en las etapas 3/4, antes de integrarlo en `develop`.

## Precondiciones

- El SQL o esquema que se revisará está disponible (una selección, un archivo de migración o el proyecto)
- Se conocen las tablas implicadas y sus índices existentes o se pueden consultar mediante `db/migration/`
- El destino es PostgreSQL 16

## Entradas que debe proporcionar el equipo

- `selection`: el SQL, esquema o migración que se revisará (de forma predeterminada, la selección actual o el proyecto)
- Las tablas implicadas y las columnas de PII que contengan
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Aplicar a la selección la lista de verificación de revisión de la habilidad [`postgresql-code-review`](../skills/postgresql-code-review/SKILL.md)
- Comprobar las elecciones de tipos de datos (CITEXT, TIMESTAMPTZ, ENUM, JSONB), tipos de índices (GIN/GiST/parcial) y restricciones
- Confirmar que cada consulta esté parametrizada y cada columna de PII esté enmascarada o comentada
- Emitir un veredicto (Aprobada / Requiere corrección / Rechazada) con el SQL corregido

## Lo que NO haré

- Aprobar SQL concatenado con cadenas ni parámetros sin vincular
- Reescribir aquí el mapeo de entidades JPA (los cambios de mapeo se redirigen al módulo responsable)
- Tratar JSONB como una cadena opaca ni ignorar operadores específicos de PostgreSQL
- Suponer si una columna contiene PII: señalo todo lo que no esté etiquetado

## Formato de salida

```markdown
### Veredicto
Requiere corrección: falta un índice GIN para una consulta de contención JSONB.

### Hallazgos
| # | Gravedad | Hallazgo | Evidencia |
|---|---|---|---|
| 1 | Alta | Filtro de estado sin parametrizar | `data->>'status' = '` + input |
| 2 | Media | Sin índice para `data @> ...` | Seq Scan sobre `orders` |

### SQL corregido
CREATE INDEX idx_orders_data ON orders USING gin(data);
SELECT id FROM orders WHERE data @> :filter;
```

## Definición de terminado

- [ ] Se expresa un veredicto: Aprobada / Requiere corrección / Rechazada
- [ ] Cada hallazgo tiene gravedad y evidencia (archivo/línea o un fragmento del plan)
- [ ] El SQL corregido está parametrizado y listo para pegar
- [ ] Cada columna de PII está enmascarada o incluye un `COMMENT`

## Cuerpo del prompt

La habilidad [`postgresql-code-review`](../skills/postgresql-code-review/SKILL.md) define los antipatrones específicos de PostgreSQL y la lista de verificación de calidad: léela y después aplícala a la selección.

**Paso 1 — Análisis estático.**
Rechaza entradas de usuario concatenadas; señala `SELECT *` sobre tablas anchas, tipos genéricos donde encajen tipos de PostgreSQL y restricciones ausentes.

**Paso 2 — Aplica la habilidad.**
Recorre las áreas de la habilidad: JSONB, matrices, tipos y dominios personalizados, diseño de esquemas, funciones y disparadores, extensiones y RLS.

**Paso 3 — Respeta las reglas del kit.**
Confirma las capacidades de PostgreSQL 16, el acceso parametrizado mediante JPA/Hibernate, migraciones con reversión segura en `backend/src/main/resources/db/migration/` y un `COMMENT` en cada columna de PII.

**Paso 4 — Veredicto.**
Indica Aprobada, Requiere corrección o Rechazada, con el SQL corregido y los motivos.

## Ejemplo de invocación

```
/postgresql-code-review selection=backend/src/main/resources/db/migration/V3__payment.sql
```
