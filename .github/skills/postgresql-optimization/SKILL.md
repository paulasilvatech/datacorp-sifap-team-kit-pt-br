---
name: "postgresql-optimization"
description: "Desarrolla y optimiza PostgreSQL con sus funcionalidades avanzadas: JSONB, tipos de matriz, rango y geometría, tipos personalizados, búsqueda de texto completo, funciones de ventana, indexación y ecosistema de extensiones. Úsala cuando la persona quiera escribir, ajustar o acelerar consultas, esquemas o el rendimiento de PostgreSQL. Para revisar código PostgreSQL existente, usa postgresql-code-review."
---
# Desarrollo y optimización de PostgreSQL

Orientación experta sobre PostgreSQL para `${selection}` (o para todo el proyecto si no hay ninguna selección). Abarca funcionalidades y patrones de optimización específicos: JSONB, matrices, rangos, tipos geométricos, búsqueda de texto completo, funciones de ventana, indexación y ecosistema de extensiones. Para revisar código PostgreSQL existente en lugar de desarrollarlo, usa [`postgresql-code-review`](../postgresql-code-review/SKILL.md).

> [!IMPORTANT]
> El backend de SIFAP 2.0 usa **PostgreSQL 16** mediante **JPA/Hibernate**. Escribe las consultas de aplicación con JPQL, consultas derivadas de Spring Data o parámetros enlazados en consultas nativas; nunca SQL construido por concatenación de cadenas. Los cambios de esquema se entregan como migraciones Flyway solo hacia adelante bajo `backend/src/main/resources/db/migration/`. Para el análisis general de planes de ejecución e índices, consulta [`query-optimization`](../query-optimization/SKILL.md); para la seguridad de las migraciones, consulta [`database.instructions.md`](../../instructions/database.instructions.md). Esos archivos son autoritativos donde coincidan.

## Cuándo invocar

- "Escribe una consulta rápida de contención JSONB para esta tabla."
- "Acelera esta agregación; realiza una exploración secuencial."
- "Diseña el índice adecuado para este filtro y esta ordenación."
- "Modela esto con un tipo de rango y una restricción de exclusión."

## Funcionalidades específicas de PostgreSQL

### Operaciones JSONB

```sql
-- Consultas JSONB avanzadas
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice GIN para el rendimiento de JSONB
CREATE INDEX idx_events_data_gin ON events USING gin(data);

-- Consultas de contención y rutas JSONB
SELECT * FROM events
WHERE data @> '{"type": "login"}'
  AND data #>> '{user,role}' = 'admin';

-- Agregación JSONB
SELECT jsonb_agg(data) FROM events WHERE data ? 'user_id';
```

### Operaciones con matrices

```sql
-- Matrices de PostgreSQL
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    tags TEXT[],
    categories INTEGER[]
);

-- Consultas y operaciones con matrices
SELECT * FROM posts WHERE 'postgresql' = ANY(tags);
SELECT * FROM posts WHERE tags && ARRAY['database', 'sql'];
SELECT * FROM posts WHERE array_length(tags, 1) > 3;

-- Agregación de matrices
SELECT array_agg(DISTINCT category) FROM posts, unnest(categories) as category;
```

### Funciones de ventana y análisis

```sql
-- Funciones de ventana avanzadas
SELECT
    product_id,
    sale_date,
    amount,
    -- Totales acumulados
    SUM(amount) OVER (PARTITION BY product_id ORDER BY sale_date) as running_total,
    -- Promedios móviles
    AVG(amount) OVER (PARTITION BY product_id ORDER BY sale_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) as moving_avg,
    -- Clasificaciones
    DENSE_RANK() OVER (PARTITION BY EXTRACT(month FROM sale_date) ORDER BY amount DESC) as monthly_rank,
    -- Lag/Lead para comparaciones
    LAG(amount, 1) OVER (PARTITION BY product_id ORDER BY sale_date) as prev_amount
FROM sales;
```

### Búsqueda de texto completo

```sql
-- Búsqueda de texto completo de PostgreSQL
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT,
    search_vector tsvector
);

-- Actualizar el vector de búsqueda
UPDATE documents
SET search_vector = to_tsvector('english', title || ' ' || content);

-- Índice GIN para el rendimiento de la búsqueda
CREATE INDEX idx_documents_search ON documents USING gin(search_vector);

-- Consultas de búsqueda
SELECT * FROM documents
WHERE search_vector @@ plainto_tsquery('english', 'postgresql database');

-- Clasificación de resultados
SELECT *, ts_rank(search_vector, plainto_tsquery('postgresql')) as rank
FROM documents
WHERE search_vector @@ plainto_tsquery('postgresql')
ORDER BY rank DESC;
```

## Ajuste del rendimiento de PostgreSQL

### Optimización de consultas

```sql
-- EXPLAIN ANALYZE para analizar el rendimiento
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'::date
GROUP BY u.id, u.name;

-- Identificar consultas lentas en pg_stat_statements
SELECT query, calls, total_time, mean_time, rows,
       100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

### Estrategias de índices

```sql
-- Índices compuestos para consultas de varias columnas
CREATE INDEX idx_orders_user_date ON orders(user_id, order_date);

-- Índices parciales para consultas filtradas
CREATE INDEX idx_active_users ON users(created_at) WHERE status = 'active';

-- Índices de expresión para valores calculados
CREATE INDEX idx_users_lower_email ON users(lower(email));

-- Índices de cobertura para evitar accesos a la tabla
CREATE INDEX idx_orders_covering ON orders(user_id, status) INCLUDE (total, created_at);
```

### Gestión de conexiones y memoria

```sql
-- Comprobar el uso de conexiones
SELECT count(*) as connections, state
FROM pg_stat_activity
GROUP BY state;

-- Supervisar el uso de memoria
SELECT name, setting, unit
FROM pg_settings
WHERE name IN ('shared_buffers', 'work_mem', 'maintenance_work_mem');
```

## Tipos de datos avanzados de PostgreSQL

### Tipos y dominios personalizados

```sql
-- Crear tipos personalizados
CREATE TYPE address_type AS (
    street TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT
);

CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- Usar dominios para validar datos
CREATE DOMAIN email_address AS TEXT
CHECK (VALUE ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Tabla con tipos personalizados
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    email email_address NOT NULL,
    address address_type,
    status order_status DEFAULT 'pending'
);
```

### Tipos de rango

```sql
-- Tipos de rango de PostgreSQL
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    room_id INTEGER,
    reservation_period tstzrange,
    price_range numrange
);

-- Consultas de rangos
SELECT * FROM reservations
WHERE reservation_period && tstzrange('2024-07-20', '2024-07-25');

-- Excluir rangos superpuestos
ALTER TABLE reservations
ADD CONSTRAINT no_overlap
EXCLUDE USING gist (room_id WITH =, reservation_period WITH &&);
```

### Tipos geométricos

```sql
-- Tipos geométricos de PostgreSQL
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name TEXT,
    coordinates POINT,
    coverage CIRCLE,
    service_area POLYGON
);

-- Consultas geométricas
SELECT name FROM locations
WHERE coordinates <-> point(40.7128, -74.0060) < 10; -- A menos de 10 unidades

-- Índice GiST para datos geométricos
CREATE INDEX idx_locations_coords ON locations USING gist(coordinates);
```

## Extensiones y herramientas de PostgreSQL

### Extensiones útiles

```sql
-- Habilitar extensiones de uso habitual
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";    -- Generación de UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";     -- Funciones criptográficas
CREATE EXTENSION IF NOT EXISTS "unaccent";     -- Quitar acentos del texto
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- Coincidencia de trigramas
CREATE EXTENSION IF NOT EXISTS "btree_gin";    -- Índices GIN para tipos btree

-- Uso de extensiones
SELECT uuid_generate_v4();                     -- Generar UUID
SELECT crypt('password', gen_salt('bf'));      -- Aplicar hash a contraseñas
SELECT similarity('postgresql', 'postgersql'); -- Coincidencia aproximada
```

### Supervisión y mantenimiento

```sql
-- Tamaño y crecimiento de la base de datos
SELECT pg_size_pretty(pg_database_size(current_database())) as db_size;

-- Tamaños de tablas e índices
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Estadísticas de uso de índices
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0;  -- Índices sin uso
```

### Consejos de optimización específicos de PostgreSQL

- **Usa EXPLAIN (ANALYZE, BUFFERS)** para un análisis detallado de consultas
- **Configura postgresql.conf** para tu carga de trabajo (OLTP frente a OLAP)
- **Usa agrupación de conexiones** (pgbouncer) para aplicaciones con alta concurrencia
- **Ejecuta VACUUM y ANALYZE periódicamente** para un rendimiento óptimo
- **Particiona las tablas grandes** con el particionamiento declarativo de PostgreSQL 10+
- **Usa pg_stat_statements** para supervisar el rendimiento de consultas

## Supervisión y tareas de mantenimiento

### Supervisión del rendimiento de consultas

```sql
-- Identificar consultas lentas
SELECT query, calls, total_time, mean_time, rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Comprobar el uso de índices
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

### Mantenimiento de la base de datos

- **VACUUM y ANALYZE**: mantenimiento periódico para el rendimiento
- **Mantenimiento de índices**: supervisar y reconstruir índices fragmentados
- **Actualización de estadísticas**: mantener actualizadas las estadísticas del planificador de consultas
- **Análisis de registros**: revisión periódica de los registros de PostgreSQL

## Patrones habituales de consultas

### Paginación

```sql
-- INCORRECTO: OFFSET para conjuntos de datos grandes
SELECT * FROM products ORDER BY id OFFSET 10000 LIMIT 20;

-- CORRECTO: paginación basada en cursor
SELECT * FROM products
WHERE id > $last_id
ORDER BY id
LIMIT 20;
```

### Agregación

```sql
-- INCORRECTO: agrupación ineficiente
SELECT user_id, COUNT(*)
FROM orders
WHERE order_date >= '2024-01-01'
GROUP BY user_id;

-- CORRECTO: optimizado con un índice parcial
CREATE INDEX idx_orders_recent ON orders(user_id)
WHERE order_date >= '2024-01-01';

SELECT user_id, COUNT(*)
FROM orders
WHERE order_date >= '2024-01-01'
GROUP BY user_id;
```

### Consultas JSON

```sql
-- INCORRECTO: consulta JSON ineficiente
SELECT * FROM users WHERE data::text LIKE '%admin%';

-- CORRECTO: operadores JSONB e índice GIN
CREATE INDEX idx_users_data_gin ON users USING gin(data);

SELECT * FROM users WHERE data @> '{"role": "admin"}';
```

## Lista de verificación de optimización

### Análisis de consultas

- [ ] Ejecutar EXPLAIN ANALYZE para consultas costosas
- [ ] Comprobar si hay exploraciones secuenciales en tablas grandes
- [ ] Verificar que los algoritmos de unión sean adecuados
- [ ] Revisar la selectividad de la cláusula WHERE
- [ ] Analizar las operaciones de ordenación y agregación

### Estrategia de índices

- [ ] Crear índices para columnas consultadas con frecuencia
- [ ] Usar índices compuestos para búsquedas de varias columnas
- [ ] Considerar índices parciales para consultas filtradas
- [ ] Eliminar índices sin uso o duplicados
- [ ] Supervisar el espacio desperdiciado y la fragmentación de índices

### Revisión de seguridad

- [ ] Usar exclusivamente consultas parametrizadas
- [ ] Implementar controles de acceso adecuados
- [ ] Habilitar la seguridad a nivel de fila donde sea necesaria
- [ ] Auditar el acceso a datos sensibles
- [ ] Usar métodos de conexión seguros

### Supervisión del rendimiento

- [ ] Configurar la supervisión del rendimiento de consultas
- [ ] Configurar ajustes adecuados de registro
- [ ] Supervisar el uso del grupo de conexiones
- [ ] Dar seguimiento al crecimiento de la base de datos y sus necesidades de mantenimiento
- [ ] Configurar alertas de degradación del rendimiento

## Funcionalidades avanzadas de PostgreSQL

### Funciones de ventana

```sql
-- Totales acumulados y clasificaciones
SELECT
    product_id,
    order_date,
    amount,
    SUM(amount) OVER (PARTITION BY product_id ORDER BY order_date) as running_total,
    ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY amount DESC) as rank
FROM sales;
```

### Expresiones de tabla comunes (CTE)

```sql
-- Consultas recursivas para datos jerárquicos
WITH RECURSIVE category_tree AS (
    SELECT id, name, parent_id, 1 as level
    FROM categories
    WHERE parent_id IS NULL

    UNION ALL

    SELECT c.id, c.name, c.parent_id, ct.level + 1
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree ORDER BY level, name;
```

Céntrate en proporcionar optimizaciones concretas y aplicables de PostgreSQL que mejoren el rendimiento de las consultas, la seguridad y la mantenibilidad, aprovechando sus funcionalidades avanzadas.

## Plantilla de salida

Presenta cada optimización con un antes y un después, el cambio del plan y el DDL exacto.

```markdown
## Optimización de PostgreSQL: <consulta u objeto>

| Campo | Antes | Después |
|---|---|---|
| Latencia p95 | <ms> | <ms> |
| Plan | Seq Scan sobre `orders` | Index Scan sobre `idx_orders_data` |
| Filas examinadas | <n> | <n> |

**Cambio**: índice | reescritura | tipo/restricción | configuración
**DDL**: CREATE INDEX idx_orders_data ON orders USING gin(data);
**Validación**: una nueva ejecución de EXPLAIN (ANALYZE, BUFFERS) confirma el nuevo plan y la menor latencia
```

## Puerta de calidad

- [ ] Se capturaron el plan y la latencia de referencia con `EXPLAIN (ANALYZE, BUFFERS)` antes de cualquier cambio.
- [ ] La funcionalidad elegida de PostgreSQL (JSONB, matriz, rango, búsqueda de texto completo, función de ventana) se ajusta al patrón de acceso.
- [ ] Los índices se corresponden con los filtros, uniones y ordenaciones; cada índice nuevo se justifica frente a su costo de escritura.
- [ ] El acceso de la aplicación sigue parametrizado (JPQL, consulta derivada o nativa con parámetros enlazados), sin SQL construido con cadenas.
- [ ] Los cambios de esquema son migraciones Flyway solo hacia adelante y mantienen una reversión segura.
- [ ] `EXPLAIN (ANALYZE, BUFFERS)` confirma que cambió el plan y se redujo la latencia.
