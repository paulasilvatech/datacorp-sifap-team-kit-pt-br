---
name: "safe-migration"
description: "Úsala para planificar un cambio de esquema en línea, una migración sin interrupciones o la reversión de un despliegue que haya modificado una tabla. Los desencadenantes incluyen \"migración\", \"ALTER TABLE\", \"sin interrupciones\", \"expandir-contraer\" y \"relleno de datos históricos\"."
---
# Migración segura de esquemas

## Cuándo invocar

- "Planifica la migración para añadir la columna X."
- "¿Podemos renombrar esta columna sin interrumpir el servicio?"
- "¿Cómo eliminamos esta tabla de forma segura?"

## Patrón expandir / migrar / contraer

Todo cambio de esquema que afecte al tráfico en producción pasa por **tres despliegues**, nunca por uno solo.

1. **Expandir**: añade la nueva estructura junto a la antigua (nueva columna que admita nulos, nueva tabla, nuevo índice). Ninguna lectura ni escritura la utiliza todavía.
2. **Migrar**: escribe en ambas estructuras, rellena los registros históricos y cambia las lecturas a la nueva estructura mediante una bandera.
3. **Contraer**: elimina la estructura antigua solo después de que la nueva haya sido la fuente autoritativa durante al menos un ciclo de lanzamiento.

## Reglas prácticas

- **Los cambios aditivos siempre son seguros**: nueva columna que admita nulos, nuevo índice (CONCURRENTLY / ONLINE), nueva tabla.
- **Los cambios destructivos nunca se realizan en un único despliegue**: eliminar una columna, renombrarla, cambiar su tipo, eliminar una tabla o añadir NOT NULL.
- **El relleno de datos históricos se ejecuta por lotes** con LIMIT, pausas entre lotes e idempotencia. Nunca ejecutes `UPDATE whole_table SET …` de una sola vez.
- **Construcción de índices**: `CREATE INDEX CONCURRENTLY` (Postgres), `ONLINE=ON` (MySQL 8 / SQL Server). Vigila la escalada de bloqueos.
- **Renombrados**: NO cambies el nombre directamente. Añade una columna nueva → escribe en ambas → rellena los datos históricos → cambia las lecturas → elimina la columna antigua.

## Lista de verificación previa

- [ ] La migración tiene planes escritos de **avance** y **reversión**.
- [ ] La duración se estima sobre una **copia de producción** (nunca se estima en desarrollo).
- [ ] Se evalúa el impacto de los bloqueos (`pg_locks`, `SHOW ENGINE INNODB STATUS`, `sys.dm_tran_locks`).
- [ ] El tamaño de lote del relleno histórico se selecciona según el retraso de replicación admisible.
- [ ] Hay supervisión del retraso de las réplicas, las transacciones prolongadas y los interbloqueos.
- [ ] Se instala una bandera de funcionalidad o una ruta de doble lectura antes de la etapa de migración.

## Señales de alarma: no desplegar

- Un único `ALTER TABLE` que bloquea por completo una tabla grande.
- Una migración acoplada al despliegue de la aplicación que no puede revertirse de forma independiente.
- Un paso irreversible sin copia de seguridad.
- Un relleno histórico que reescribe todas las filas en una sola transacción.

## Plantilla de salida

```markdown
## Plan de migración - <cambio>

| Campo | Valor |
|---|---|
| Tipo de cambio | Aditivo / destructivo |
| Etapa del patrón | Expandir / Migrar / Contraer |
| Archivo de migración | backend/src/main/resources/db/migration/V<N>__<desc>.sql |
| Plan de avance | <DDL / relleno histórico> |
| Plan de reversión | <cómo revertir de forma independiente del despliegue de la aplicación> |
| Impacto de los bloqueos | <estimación a partir de una copia de producción> |

### Relleno de datos históricos
- Tamaño del lote <filas>, pausa <ms>, idempotente sí/no
```

## Puerta de calidad

- [ ] Los cambios destructivos se distribuyen entre despliegues de expansión, migración y contracción.
- [ ] Existen planes de avance y reversión, independientes del despliegue de la aplicación.
- [ ] Los índices se construyen con `CREATE INDEX CONCURRENTLY`; no se despliega ningún bloqueo de tabla completa.
- [ ] El relleno histórico se ejecuta en lotes acotados e idempotentes, dentro del retraso de replicación admisible.
- [ ] La duración y el impacto de los bloqueos se estiman sobre una copia con el tamaño de producción.

## Referencias

- [Braintree - PostgreSQL a escala: migraciones seguras](https://medium.com/paypal-tech/postgresql-at-scale-database-schema-changes-without-downtime-20d3749ed680)
- [GitHub - Migración de esquemas en línea con gh-ost](https://github.com/github/gh-ost)
- [Martin Fowler - Diseño evolutivo de bases de datos](https://martinfowler.com/articles/evodb.html)
