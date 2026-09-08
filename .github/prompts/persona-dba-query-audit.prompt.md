---
name: "query-audit"
description: "Audita una consulta SQL o JPQL para detectar inyección, problemas de recorridos secuenciales y N+1, y devuelve un veredicto, una reescritura y una justificación basada en EXPLAIN."
argument-hint: "query=<sql-or-jpql> tables=<table,table>"
agent: "dba"
tools: ["read", "search", "execute"]
---
# /query-audit

## Objetivo

Revisa una consulta SQL, JPQL, Criteria o QueryDSL destinada a **PostgreSQL 16** para detectar riesgos de inyección, problemas de recorridos secuenciales, patrones N+1 e infracciones de los estándares de código de SIFAP. El entregable es un veredicto (Aprobada / Requiere corrección / Rechazada), una consulta parametrizada reescrita, una interpretación de `EXPLAIN ANALYZE` y, cuando se justifique, una recomendación de índice que se traspasa a `/migration`.

> [!WARNING]
> Cualquier concatenación de cadenas que incorpore entradas de usuario en SQL es un defecto de inyección y provoca un rechazo automático. Vincula todos los parámetros.

## Cuándo invocar

Durante la revisión de código de una ruta de acceso a datos en las etapas 3/4, o cuando una consulta sea lenta, antes de que llegue a un punto de conexión de uso intensivo o a un lote nocturno en producción.

## Precondiciones

- El texto de la consulta está disponible en su forma original
- Se conoce el esquema de las tablas implicadas o puede consultarse mediante `db/migration/`
- Hay disponible una instantánea de preproducción con cantidades de filas realistas para ejecutar `EXPLAIN ANALYZE`
- Se pueden enumerar los índices existentes de las tablas implicadas (`\d table_name`)

## Entradas que debe proporcionar el equipo

- La consulta en su forma original (SQL directo, JPQL, Criteria API o QueryDSL)
- El esquema de las tablas implicadas o una referencia a las migraciones de `db/migration/`
- Los índices existentes de esas tablas y cantidades de filas realistas de producción
- La ruta de código que realiza la llamada: un punto de conexión de uso intensivo (por solicitud) o un trabajo por lotes (nocturno)
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Ejecutar el análisis estático: rechazar entradas de usuario concatenadas como cadenas y `SELECT *` sobre tablas anchas; señalar conversiones y funciones sobre columnas indexadas que impiden usar el índice
- Ejecutar el análisis dinámico: `EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)` contra una instantánea de preproducción y leer el plan de arriba abajo
- Señalar `Seq Scan` sobre tablas grandes con un filtro selectivo, pasos `Sort` que podría respaldar un índice, `Nested Loop` costosos y divergencias entre estimaciones y valores reales superiores a 10×
- Comprobar N+1 (ausencia de `JOIN FETCH`), riesgos de bloqueo y aislamiento y parametrización completa
- Comparar con los estándares de SIFAP y emitir un veredicto junto con una consulta reescrita
- Recomendar un índice ausente y dirigir su creación a `/migration`

## Lo que NO haré

- Aprobar una consulta porque «es rápida en desarrollo»: desarrollo tiene miles de filas; producción tiene millones
- Aprobar `SELECT *`, un parámetro sin vincular o `FOR UPDATE` sobre una fila de uso intensivo sin cola ni espera progresiva
- Confiar en `EXPLAIN` sin `ANALYZE` ni añadir un índice por cada consulta sin ponderar el costo de escritura
- Escribir aquí la migración del índice: la recomiendo y entrego el archivo a `/migration` (el prompt de migración del DBA)
- Cambiar por mi cuenta el esquema o el mapeo de entidades JPA: los cambios de mapeo se redirigen al módulo responsable
- Suponer si una columna contiene PII: señalo todo lo que no esté etiquetado y solicito un `COMMENT` de columna

## Formato de salida

```markdown
## Auditoría de consulta — búsqueda de pagos por estado

### Veredicto
Requiere corrección: Seq Scan sobre una tabla de 4M filas con un filtro selectivo de estado.

### Hallazgos
| # | Gravedad | Hallazgo | Evidencia |
|---|---|---|---|
| 1 | Alta | Seq Scan sobre `payment` | EXPLAIN: Seq Scan (actual rows = 4.0M) |
| 2 | Media | `SELECT *` sobre una tabla ancha | devuelve 22 columnas; se utilizan 4 |

### Consulta reescrita
SELECT id, status, reviewed_at FROM payment WHERE status = :status;

### Recomendación de índice (dirigir a /migration)
CREATE INDEX CONCURRENTLY idx_payment_status ON payment (status) WHERE status <> 'CLOSED';

### EXPLAIN ANALYZE antes / después
Antes: Seq Scan, 820 ms. Después: Index Scan, 4 ms.

### Cambio necesario en la aplicación
Vincular `:status`; seleccionar solo las cuatro columnas utilizadas.
```

## Definición de terminado

- [ ] Se expresa un veredicto: Aprobada / Requiere corrección / Rechazada
- [ ] Los hallazgos incluyen gravedad, evidencia (archivo/línea o un fragmento EXPLAIN) y una recomendación
- [ ] La consulta reescrita está parametrizada y lista para pegar, sin concatenación de cadenas
- [ ] Se pega `EXPLAIN ANALYZE` antes y después, con tiempos medidos
- [ ] Toda recomendación de índice es segura durante la operación (`CONCURRENTLY`) y se dirige a `/migration`
- [ ] Se señala el acceso a PII y se confirman los comentarios de las columnas

## Cuerpo del prompt

Eres el `@dba`. El equipo quiere auditar una consulta antes de que llegue a producción. Lee [`query-optimization`](../skills/query-optimization/SKILL.md) antes de comenzar; define el flujo de diagnóstico, las heurísticas de diseño de índices y los antipatrones.

**Paso 1 — Ejecuta el análisis estático.**
Rechaza cualquier concatenación de cadenas con entradas de usuario por constituir inyección SQL. Rechaza `SELECT *` sobre una tabla ancha. Señala conversiones implícitas (`varchar = bigint`) y funciones sobre columnas indexadas que impiden usar el índice: corrígelas o añade un índice de expresión solo cuando la evidencia lo justifique.

**Paso 2 — Ejecuta el análisis dinámico.**
Ejecuta `EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)` contra una instantánea de preproducción. Lee el plan de arriba abajo y señala: un `Seq Scan` sobre una tabla de más de 10k filas cuando existe un filtro; un `Sort` que podría respaldar un índice; un `Nested Loop` sobre más de ~1k filas externas donde un `Hash Join` sea más barato; y una divergencia entre filas estimadas y reales superior a 10× (estadísticas obsoletas: ejecuta `ANALYZE`).

**Paso 3 — Comprueba N+1.**
Si la consulta proviene de JPA, busca un `JOIN FETCH` o una indicación de tamaño de lote ausentes e identifica el bucle padre en el código de la aplicación.

**Paso 4 — Comprueba bloqueos y aislamiento.**
`SELECT ... FOR UPDATE` sobre una tabla de uso intensivo necesita una cola o espera progresiva. El aislamiento predeterminado es `READ COMMITTED`; señala el uso injustificado de `SERIALIZABLE`.

**Paso 5 — Confirma la parametrización.**
Cada valor de cara al usuario debe ser un parámetro vinculado, nunca interpolado, incluso si proviene de una ruta «de confianza». Esta es la protección contra inyección de OWASP.

**Paso 6 — Compara con los estándares de SIFAP.**
Identificadores `snake_case`; `TIMESTAMPTZ` para marcas de tiempo; `NUMERIC(15,2)` para dinero, nunca `FLOAT`; un `COMMENT` en cada columna de PII.

**Paso 7 — Escribe la corrección y clasifica.**
Reescribe la consulta de forma parametrizada. Cuando la evidencia justifique un índice nuevo, especifícalo con `CONCURRENTLY` y dirige su migración a `/migration`. Expresa el veredicto: Aprobada, Requiere corrección o Rechazada.

Nunca apruebes una consulta que no coincida con el mapeo de entidades JPA: eso oculta un N+1 que reaparecerá después. Si un mapeo es incorrecto, devuélvelo al módulo responsable en lugar de disimularlo en SQL.

## Ejemplo de invocación

```
/query-audit query="SELECT * FROM payment WHERE status = 'OPEN'" tables=payment
```
