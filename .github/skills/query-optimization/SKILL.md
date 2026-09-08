---
name: "query-optimization"
description: "Úsala para investigar consultas lentas, diseñar índices o revisar planes de ejecución. Los desencadenantes incluyen \"consulta lenta\", \"plan de ejecución\", \"índice\", \"ajuste de consultas\", \"N+1\" y \"exploración de tablas\"."
---
# Optimización de consultas

## Cuándo invocar

- "Esta consulta es lenta."
- "¿Por qué no está usando el índice?"
- "¿Debería añadir un índice en...?"
- "Revisa esta salida de EXPLAIN."

## Flujo de diagnóstico

1. **Mide antes de optimizar**: captura una referencia (latencia p50/p95, filas examinadas, filas devueltas y lecturas lógicas).
2. **Obtén el plan**: `EXPLAIN (ANALYZE, BUFFERS)` en PostgreSQL, `EXPLAIN ANALYZE FORMAT=JSON` en MySQL 8 o `SET STATISTICS IO, TIME ON` en SQL Server.
3. **Busca los problemas habituales**:

- **Seq Scan / Table Scan** sobre una tabla grande con un predicado selectivo → Falta un índice
- **Estimación de filas desviada en >10×** → Estadísticas desactualizadas; ejecuta `ANALYZE`
- **Nested Loop con muchas filas externas** → Debería ser una unión Hash/Merge
- **Ordenación que se desborda a disco** → `work_mem` es demasiado bajo o falta un índice para ORDER BY
- **Filtro después de la unión** en lugar de aplicarlo antes → Reescribe la consulta o añade un índice con predicado

4. **Propón el cambio mínimo**: un índice, una reescritura, una actualización de estadísticas o un ajuste de parámetros.
5. **Valida**: ejecuta ANALYZE de nuevo, confirma que el plan cambió y verifica que la latencia disminuyó. Nunca "despliegues y esperes que funcione".

## Criterios orientativos de diseño de índices

- **Primero las columnas de igualdad**, después las de rango y luego las de ordenación (regla ESR).
- Un **índice de cobertura** (columnas INCLUDE) evita accesos al heap en consultas con muchas lecturas.
- Un **índice parcial** permite filtros muy selectivos sobre datos con distribución desigual (`WHERE status = 'pending'`).
- Cada índice añade costo de escritura. Justifica cada uno.

## Antipatrones

- `SELECT *` en rutas de uso intensivo: obliga a acceder al heap e impide aprovechar los índices de cobertura.
- `WHERE func(col) = x`: impide usar el índice; almacena una columna calculada o usa un índice de expresión.
- N+1 del ORM: corrígelo en el ORM (carga anticipada), no con un índice.
- "Añadir un índice a cada columna": desperdicia almacenamiento y ralentiza las escrituras.

## Plantilla de salida

```markdown
## Optimización de consultas - <id de consulta>

| Campo | Antes | Después |
|---|---|---|
| Latencia p95 | <ms> | <ms> |
| Filas examinadas | <n> | <n> |
| Plan | Seq Scan | Index Scan sobre <index> |

**Cambio**: índice / reescritura / ANALYZE / parámetro
**DDL**: CREATE INDEX CONCURRENTLY <name> ON <table> (<cols>)
**Validación**: una nueva ejecución de EXPLAIN (ANALYZE, BUFFERS) confirma el nuevo plan
```

## Puerta de calidad

- [ ] Se capturó una referencia (p50/p95, filas examinadas, plan) antes de cualquier cambio.
- [ ] El cambio propuesto es el mínimo que resuelve el cuello de botella.
- [ ] `EXPLAIN (ANALYZE, BUFFERS)` confirma que cambió el plan y se redujo la latencia.
- [ ] Cada índice nuevo está justificado frente a su costo de escritura.

## Referencias

- [Use The Index, Luke!](https://use-the-index-luke.com/)
- [PostgreSQL - Consejos de rendimiento](https://www.postgresql.org/docs/current/performance-tips.html)
- [SQL Server - Query Store](https://learn.microsoft.com/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store)
