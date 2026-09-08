---
name: "postgresql-code-review"
description: "Revisa SQL, esquemas y funciones existentes de PostgreSQL para evaluar antipatrones específicos, calidad y seguridad: operaciones JSONB, uso de matrices, tipos personalizados, diseño de esquemas, optimización de funciones y seguridad a nivel de fila (RLS). Úsala cuando la persona pida revisar, auditar o evaluar código PostgreSQL existente o una migración. Para desarrollar u optimizar nuevas funcionalidades de PostgreSQL, usa postgresql-optimization."
---
# Revisión de código PostgreSQL

Revisión experta de código PostgreSQL para `${selection}` (o para todo el proyecto si no hay ninguna selección). Se centra en buenas prácticas, antipatrones y estándares de calidad específicos de PostgreSQL, no en SQL genérico. Para desarrollar o ajustar nuevas funcionalidades de PostgreSQL en lugar de revisar las existentes, usa [`postgresql-optimization`](../postgresql-optimization/SKILL.md).

> [!IMPORTANT]
> El backend de SIFAP 2.0 accede a **PostgreSQL 16** mediante **JPA/Hibernate**. Las consultas de aplicación deben usar JPQL, consultas derivadas de Spring Data o parámetros enlazados en consultas nativas; nunca SQL construido por concatenación de cadenas. El esquema reside en migraciones Flyway bajo `backend/src/main/resources/db/migration/`. Cuando esta skill y [`database.instructions.md`](../../instructions/database.instructions.md) coincidan, el archivo de instrucciones es la fuente autoritativa.

## Cuándo invocar

- "Revisa esta migración en busca de antipatrones de PostgreSQL."
- "Audita nuestro uso de JSONB y matrices."
- "¿Este esquema usa los tipos adecuados de PostgreSQL?"
- "Comprueba esta función PL/pgSQL y la política RLS antes de integrarlas."

## Áreas de revisión específicas de PostgreSQL

### Buenas prácticas de JSONB

```sql
-- INCORRECTO: uso ineficiente de JSONB
SELECT * FROM orders WHERE data->>'status' = 'shipped';  -- Sin soporte de índice

-- CORRECTO: consultas JSONB indexables
CREATE INDEX idx_orders_status ON orders USING gin((data->'status'));
SELECT * FROM orders WHERE data @> '{"status": "shipped"}';

-- INCORRECTO: anidación profunda sin evaluar sus consecuencias
UPDATE orders SET data = data || '{"shipping":{"tracking":{"number":"123"}}}';

-- CORRECTO: JSONB estructurado con validación
ALTER TABLE orders ADD CONSTRAINT valid_status
CHECK (data->>'status' IN ('pending', 'shipped', 'delivered'));
```

### Revisión de operaciones con matrices

```sql
-- INCORRECTO: operaciones ineficientes con matrices
SELECT * FROM products WHERE 'electronics' = ANY(categories);  -- Sin índice

-- CORRECTO: consultas de matrices con índice GIN
CREATE INDEX idx_products_categories ON products USING gin(categories);
SELECT * FROM products WHERE categories @> ARRAY['electronics'];

-- INCORRECTO: concatenación de matrices en bucles
-- Esto sería ineficiente en una función o procedimiento

-- CORRECTO: operaciones masivas con matrices
UPDATE products SET categories = categories || ARRAY['new_category']
WHERE id IN (SELECT id FROM products WHERE condition);
```

### Revisión del diseño de esquemas PostgreSQL

```sql
-- INCORRECTO: no aprovechar las funcionalidades de PostgreSQL
CREATE TABLE users (
    id INTEGER,
    email VARCHAR(255),
    created_at TIMESTAMP
);

-- CORRECTO: esquema optimizado para PostgreSQL
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email CITEXT UNIQUE NOT NULL,  -- Correo sin distinción de mayúsculas y minúsculas
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Añadir un índice GIN de JSONB para las consultas de metadatos
CREATE INDEX idx_users_metadata ON users USING gin(metadata);
```

### Tipos y dominios personalizados

```sql
-- INCORRECTO: usar tipos genéricos para datos específicos
CREATE TABLE transactions (
    amount DECIMAL(10,2),
    currency VARCHAR(3),
    status VARCHAR(20)
);

-- CORRECTO: tipos personalizados de PostgreSQL
CREATE TYPE currency_code AS ENUM ('USD', 'EUR', 'GBP', 'JPY');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE DOMAIN positive_amount AS DECIMAL(10,2) CHECK (VALUE > 0);

CREATE TABLE transactions (
    amount positive_amount NOT NULL,
    currency currency_code NOT NULL,
    status transaction_status DEFAULT 'pending'
);
```

## Antipatrones específicos de PostgreSQL

### Antipatrones de rendimiento

- **Evitar índices específicos de PostgreSQL**: no usar GIN/GiST para los tipos de datos adecuados
- **Usar JSONB incorrectamente**: tratar JSONB como un simple campo de cadena
- **Ignorar los operadores de matrices**: usar operaciones ineficientes con matrices
- **Elegir mal la clave de partición**: no aprovechar eficazmente el particionamiento de PostgreSQL

### Problemas de diseño de esquemas

- **No usar tipos ENUM**: usar VARCHAR para conjuntos limitados de valores
- **Ignorar las restricciones**: carecer de restricciones CHECK para validar los datos
- **Tipos de datos incorrectos**: usar VARCHAR en lugar de TEXT o CITEXT
- **JSONB sin estructura**: JSONB desestructurado y sin validación

### Problemas de funciones y desencadenadores

```sql
-- INCORRECTO: función de desencadenador ineficiente
CREATE OR REPLACE FUNCTION update_modified_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();  -- Debería usar TIMESTAMPTZ
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CORRECTO: función de desencadenador optimizada
CREATE OR REPLACE FUNCTION update_modified_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Configurar el desencadenador para que se active solo cuando sea necesario
CREATE TRIGGER update_modified_time_trigger
    BEFORE UPDATE ON table_name
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE FUNCTION update_modified_time();
```

## Revisión del uso de extensiones de PostgreSQL

### Buenas prácticas de extensiones

```sql
-- Comprobar si la extensión existe antes de crearla
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Usar las extensiones adecuadamente
-- Generación de UUID
SELECT uuid_generate_v4();

-- Hash de contraseñas
SELECT crypt('password', gen_salt('bf'));

-- Coincidencia aproximada de texto
SELECT word_similarity('postgres', 'postgre');
```

## Revisión de seguridad de PostgreSQL

### Seguridad a nivel de fila (RLS)

```sql
-- CORRECTO: implementación de RLS
ALTER TABLE sensitive_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_data_policy ON sensitive_data
    FOR ALL TO application_role
    USING (user_id = current_setting('app.current_user_id')::INTEGER);
```

### Gestión de privilegios

```sql
-- INCORRECTO: permisos demasiado amplios
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;

-- CORRECTO: permisos granulares
GRANT SELECT, INSERT, UPDATE ON specific_table TO app_user;
GRANT USAGE ON SEQUENCE specific_table_id_seq TO app_user;
```

## Lista de verificación de calidad del código PostgreSQL

### Diseño de esquemas

- [ ] Usar tipos de datos adecuados de PostgreSQL (CITEXT, JSONB, matrices)
- [ ] Aprovechar tipos ENUM para valores restringidos
- [ ] Implementar restricciones CHECK adecuadas
- [ ] Usar TIMESTAMPTZ en lugar de TIMESTAMP
- [ ] Definir dominios personalizados para restricciones reutilizables

### Consideraciones de rendimiento

- [ ] Tipos de índice adecuados (GIN para JSONB y matrices, GiST para rangos)
- [ ] Consultas JSONB que usan operadores de contención (@>, ?)
- [ ] Operaciones con matrices que usan operadores específicos de PostgreSQL
- [ ] Uso adecuado de funciones de ventana y CTE
- [ ] Uso eficiente de funciones específicas de PostgreSQL

### Aprovechamiento de las funcionalidades de PostgreSQL

- [ ] Usar extensiones donde corresponda
- [ ] Implementar procedimientos almacenados en PL/pgSQL cuando resulte beneficioso
- [ ] Aprovechar las funcionalidades SQL avanzadas de PostgreSQL
- [ ] Usar técnicas de optimización específicas de PostgreSQL
- [ ] Implementar una gestión adecuada de errores en las funciones

### Seguridad y cumplimiento

- [ ] Implementar seguridad a nivel de fila (RLS) donde sea necesaria
- [ ] Gestionar adecuadamente roles y privilegios
- [ ] Usar las funciones de cifrado integradas de PostgreSQL
- [ ] Implementar registros de auditoría con funcionalidades de PostgreSQL

## Directrices de revisión específicas de PostgreSQL

1. **Optimización de tipos de datos**: garantiza el uso adecuado de los tipos específicos de PostgreSQL
2. **Estrategia de índices**: revisa los tipos de índice y garantiza que se aprovechen los específicos de PostgreSQL
3. **Estructura JSONB**: valida el diseño del esquema JSONB y los patrones de consulta
4. **Calidad de funciones**: revisa la eficiencia y las buenas prácticas de las funciones PL/pgSQL
5. **Uso de extensiones**: verifica el uso adecuado de las extensiones de PostgreSQL
6. **Funcionalidades de rendimiento**: comprueba el aprovechamiento de las funcionalidades avanzadas de PostgreSQL
7. **Implementación de seguridad**: revisa las funcionalidades de seguridad específicas de PostgreSQL

Céntrate en las capacidades propias de PostgreSQL y garantiza que el código aproveche lo que lo distingue, en lugar de tratarlo como una base de datos SQL genérica.

## Plantilla de salida

Entrega la revisión con un dictamen, una tabla de hallazgos y SQL corregido listo para pegar.

```markdown
## Revisión de PostgreSQL: <archivo o selección>

**Dictamen**: Aprobado | Requiere corrección | Rechazado

| # | Gravedad | Hallazgo | Evidencia | Corrección |
|---|---|---|---|---|
| 1 | Alta | Entrada de usuario concatenada en SQL | `... WHERE status = '` + input | Enlazar `:status` mediante JPQL o una consulta nativa parametrizada |
| 2 | Media | Consulta de contención JSONB sin índice GIN | Seq Scan sobre `orders` | `CREATE INDEX idx_orders_data ON orders USING gin(data)` |
| 3 | Baja | VARCHAR usado para correo sin distinción de mayúsculas | `email VARCHAR(255)` | Usar `CITEXT` con una restricción `CHECK` |

### SQL corregido
CREATE INDEX idx_orders_data ON orders USING gin(data);
-- La consulta del repositorio sigue parametrizada: WHERE data @> :filter
```

## Puerta de calidad

- [ ] Se indica un dictamen: Aprobado, Requiere corrección o Rechazado.
- [ ] Cada hallazgo incluye una gravedad y evidencia concreta (archivo y línea o fragmento de un plan).
- [ ] No se concatena ninguna entrada de usuario en SQL; todos los parámetros están enlazados (JPQL, consulta derivada o consulta nativa con parámetros enlazados).
- [ ] Se validan los tipos específicos de PostgreSQL, los tipos de índice (GIN/GiST/parciales) y las restricciones `CHECK`/`ENUM`/de dominio.
- [ ] La información personal, como CPF o importes de prestaciones, se enmascara en registros o se documenta mediante un `COMMENT` de columna.
- [ ] El SQL corregido está listo para pegar y cualquier cambio de esquema mantiene una reversión segura (consulta [`database.instructions.md`](../../instructions/database.instructions.md)).
