---
name: "postgresql-optimization"
description: "Optimiza consultas, índices y esquemas de PostgreSQL 16 con capacidades específicas de PostgreSQL, delegando el flujo de trabajo en la habilidad postgresql-optimization."
argument-hint: "selection=<sql-or-query>"
agent: "dba"
tools: ["read", "search", "execute"]
---
# /postgresql-optimization

## Objetivo

Optimiza una consulta lenta, un índice o un esquema de PostgreSQL utilizando capacidades específicas de PostgreSQL y respaldando cada recomendación con un `EXPLAIN ANALYZE` medido. El flujo de trabajo completo se encuentra en la habilidad [`postgresql-optimization`](../skills/postgresql-optimization/SKILL.md); este prompt lo aplica a la base de datos de SIFAP 2.0 (PostgreSQL 16 mediante JPA/Hibernate) sin repetirlo.

> [!IMPORTANT]
> No se entrega ninguna recomendación sin un `EXPLAIN ANALYZE` de antes y después; un plan es evidencia, no una opinión.

## Cuándo invocar

Durante las etapas 3/4, cuando una consulta sea lenta, un informe agote su tiempo de espera o un esquema necesite ajustes con cantidades de filas realistas.

## Precondiciones

- La consulta o el esquema que se optimizará está disponible
- Hay acceso a una instantánea de preproducción con cantidades de filas realistas para ejecutar `EXPLAIN ANALYZE`
- Se pueden enumerar los índices existentes de las tablas implicadas
- El destino es PostgreSQL 16

## Entradas que debe proporcionar el equipo

- `selection`: la consulta o el esquema que se optimizará
- Las tablas implicadas, sus índices y cantidades de filas realistas
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Aplicar a la selección el flujo de optimización de la habilidad [`postgresql-optimization`](../skills/postgresql-optimization/SKILL.md)
- Leer `EXPLAIN (ANALYZE, BUFFERS)` de arriba abajo e identificar el costo dominante
- Recomendar con evidencia el tipo de índice adecuado (GIN/GiST/parcial/de cobertura) o una reescritura de consulta
- Expresar los cambios de índices como migraciones seguras durante la operación y con reversión segura

## Lo que NO haré

- Recomendar un índice sin ponderar su costo de escritura ni añadir uno por cada consulta
- Confiar en `EXPLAIN` sin `ANALYZE` ni optimizar con volúmenes de datos propios de desarrollo
- Concatenar entradas de usuario en SQL ni desincronizar el mapeo JPA
- Aplicar un `CREATE INDEX` bloqueante sobre una tabla de uso intensivo (utilizo `CONCURRENTLY`)

## Formato de salida

```markdown
### Cuello de botella
Seq Scan sobre `payment` (4.0M filas) para un filtro selectivo de estado.

### Recomendación
CREATE INDEX CONCURRENTLY idx_payment_status ON payment (status) WHERE status <> 'CLOSED';

### EXPLAIN ANALYZE
Antes: Seq Scan, 820 ms. Después: Index Scan, 4 ms.
```

## Definición de terminado

- [ ] El cuello de botella dominante se identifica con evidencia del plan
- [ ] La recomendación está respaldada por un `EXPLAIN ANALYZE` de antes y después
- [ ] Cada índice es seguro durante la operación (`CONCURRENTLY`) y forma parte de una migración con reversión segura
- [ ] Las consultas permanecen parametrizadas y coherentes con el mapeo JPA

## Cuerpo del prompt

La habilidad [`postgresql-optimization`](../skills/postgresql-optimization/SKILL.md) define el flujo de diagnóstico, las heurísticas de índices y las capacidades de PostgreSQL: léela y después aplícala a la selección.

**Paso 1 — Mide.**
Ejecuta `EXPLAIN (ANALYZE, BUFFERS)` sobre una instantánea de preproducción y lee el plan de arriba abajo.

**Paso 2 — Aplica la habilidad.**
Utiliza la habilidad para elegir la corrección: tipo de índice, reescritura de consulta, operador de JSONB o matriz, función de ventana o particionamiento.

**Paso 3 — Respeta las reglas del kit.**
Utiliza PostgreSQL 16 como destino, mantén sincronizado el mapeo JPA y entrega los cambios de índices como migraciones `CONCURRENTLY` en `db/migration/`.

**Paso 4 — Demuéstralo.**
Vuelve a ejecutar `EXPLAIN ANALYZE` y pega los tiempos de antes y después.

## Ejemplo de invocación

```
/postgresql-optimization selection="SELECT * FROM payment WHERE status = 'OPEN'"
```
