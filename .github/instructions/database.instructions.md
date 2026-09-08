---
description: "Utiliza al escribir repositorios de bases de datos, migraciones, cambios de esquema, consultas SQL, índices y cambios de datos que admitan una reversión segura."
applyTo: "backend/src/main/java/**/infrastructure/**,backend/src/main/resources/db/migration/**"
---

# Convenciones de bases de datos — Migraciones Flyway y repositorios

Este archivo se activa al editar código de persistencia en `backend/src/main/java/**/infrastructure/**` o migraciones Flyway en `backend/src/main/resources/db/migration/**`. Enseña buenas prácticas de migración, seguridad de consultas de repositorios, indexación y cambios de esquema con reversión segura en PostgreSQL 16. El mapeo de entidades y de FDT a JPA corresponde a [`modular-monolith.instructions.md`](modular-monolith.instructions.md); la lectura de la FDT de Adabas de la que deriva un esquema corresponde a [`natural-adabas.instructions.md`](natural-adabas.instructions.md).

## Migraciones Flyway

Las migraciones están versionadas, avanzan solo hacia adelante y son inmutables una vez integradas. Nómbralas `V<n>__<snake_case_description>.sql`. Un cambio lógico por archivo. Todos los identificadores utilizan `snake_case`.

```sql
-- V1__create_resource.sql
CREATE TABLE resource (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label       VARCHAR(120) NOT NULL,
    amount      NUMERIC(15, 2) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX ux_resource_label ON resource (label);
```

> [!WARNING]
> Nunca edites una migración que ya se haya ejecutado en una base de datos compartida: Flyway valida su suma de comprobación y fallará. Corrige hacia adelante con una nueva migración `V<n+1>__`.

## Dinero y precisión

Los campos monetarios y decimales empaquetados se mapean a `NUMERIC(precision, scale)` en PostgreSQL y a `BigDecimal` en Java. Nunca utilices `float`, `double`, `real` ni `money`.

```sql
amount NUMERIC(15, 2) NOT NULL -- Se mapea a BigDecimal con escala 2
```

## Repositorios

Los repositorios son interfaces de Spring Data. Utiliza métodos de consulta derivados o `@Query` con JPQL y **parámetros con nombre**, nunca concatenación de cadenas, que facilita la inyección SQL.

```java
interface ResourceRepository extends JpaRepository<Resource, UUID> {

    Optional<Resource> findByLabel(String label);

    @Query("select r from Resource r where r.amount >= :floor")
    List<Resource> findAllAtOrAbove(@Param("floor") BigDecimal floor);
}
```

- No utilices `@Transactional` en un repositorio: el servicio controla el límite de la transacción.
- Devuelve `Optional<T>` para búsquedas individuales, nunca `null`.
- En las consultas nativas, vincula también los parámetros (`:name` / `?1`); nunca interpoles cadenas.

## Índices y restricciones

Declara la unicidad, las claves foráneas y los índices en la migración, no en el código de la aplicación. Indexa las columnas que utilizan los repositorios para filtrar y combinar datos.

```sql
CREATE INDEX ix_payment_resource_id ON payment (resource_id);
ALTER TABLE payment
    ADD CONSTRAINT fk_payment_resource
    FOREIGN KEY (resource_id) REFERENCES resource (id);
```

## Cambios con reversión segura (expansión / contracción)

Nunca cambies el nombre de una columna ni la elimines en la misma versión que despliega el código que la utiliza. Distribuye cada cambio incompatible entre varias versiones para mantener segura la reversión.

| Fase | Migración | Versión |
|---|---|---|
| Expansión | Añade la nueva columna que admite nulos o la nueva tabla | N |
| Relleno de datos | Copia los datos por lotes; realiza escritura doble desde la aplicación | N |
| Contracción | Elimina la columna o restricción antigua cuando nada la utilice para leer | N+1 |

La habilidad [`safe-migration`](../skills/safe-migration/SKILL.md) define el procedimiento completo sin interrupciones y la lista de verificación del relleno de datos.

## Rendimiento de consultas

Evita las consultas N+1: recupera las asociaciones con `@EntityGraph` o un `join fetch` de JPQL y verifica un plan real con `EXPLAIN ANALYZE`. La habilidad [`query-optimization`](../skills/query-optimization/SKILL.md) se encarga del análisis de índices y planes.

```java
@EntityGraph(attributePaths = "payments")
List<Resource> findByLabelStartingWith(String prefix);
```

## Convenciones

| Regla | Justificación |
|---|---|
| `V<n>__snake_case.sql`, solo hacia adelante | Historial determinista validado mediante sumas de comprobación |
| Tablas y columnas en `snake_case` | Convención idiomática de PostgreSQL, estable entre herramientas |
| `NUMERIC` para dinero, `BigDecimal` en Java | Sin redondeo de coma flotante binaria en valores monetarios |
| JPQL / consultas derivadas con parámetros vinculados | Sin inyección SQL y con portabilidad entre dialectos |
| Índices y claves foráneas declarados en migraciones | El esquema se puede reproducir desde el control de versiones |
| Expansión y contracción para cambios incompatibles | Cada despliegue admite una reversión segura |

## Qué hacer / Qué no hacer

| Qué hacer | Qué no hacer |
|---|---|
| Añadir una nueva migración `V<n+1>__` para corregir el esquema | Editar una migración ya aplicada |
| Vincular todos los parámetros | Concatenar valores en SQL/JPQL |
| Mantener `@Transactional` en el servicio | Anotar los repositorios como transaccionales |
| Rellenar los datos por lotes y después contraer | Eliminar y recrear una tabla en uso |

## Lista de verificación antes de abrir una PR

- [ ] La migración sigue `V<n>__snake_case.sql` y realiza un único cambio
- [ ] No se ha editado ninguna migración aplicada previamente
- [ ] Los campos monetarios o empaquetados son `NUMERIC(p, s)` mapeados a `BigDecimal`
- [ ] Todas las consultas vinculan parámetros; no hay concatenación de cadenas en ningún lugar
- [ ] Las nuevas columnas de filtrado o combinación tienen índices; las claves foráneas están declaradas
- [ ] Los cambios incompatibles utilizan expansión → relleno de datos → contracción entre versiones
