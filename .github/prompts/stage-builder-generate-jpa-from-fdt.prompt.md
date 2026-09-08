---
name: "generate-jpa-from-fdt"
description: "Genera clases de entidad JPA a partir de definiciones FDT de Adabas, utilizando JSONB para campos MU/PE."
argument-hint: "ddm=01-archaeology/legacy-sifap/adabas-ddms/<DDM>.ddm context=<context> package=<java.package> dateformat=<format>"
agent: "builder"
tools: ["read", "search", "edit", "execute"]
---
# /generate-jpa-from-fdt

## Objetivo

Analiza un archivo DDM de Adabas y genera una clase de entidad JPA con mapeos de tipos correctos, JSONB para campos MU/PE y el script de migración Flyway correspondiente.

## Cuándo invocar

Al comienzo de la etapa 3, cuando el equipo está preparando la capa de datos de un contexto delimitado.

## Precondiciones

- Existe `02-modern-spec/bounded-contexts.md` (para determinar qué contexto es responsable de este DDM)
- El archivo DDM está accesible en `01-archaeology/legacy-sifap/adabas-ddms/`
- El equipo seleccionó el paquete de destino según el diseño de monolito modular

## Entradas que debe proporcionar el equipo

- La ruta del archivo DDM (por ejemplo, `01-archaeology/legacy-sifap/adabas-ddms/DDMXXXXX.ddm`)
- El contexto delimitado y el paquete Java de destino
- El formato de fecha utilizado en el sistema heredado (por ejemplo, `YYYYMMDD` empaquetado o `YYYY-MM-DD` alfanumérico)

## Lo que haré

- Analizar la estructura FDT del archivo DDM
- Mapear cada campo al tipo Java/JPA adecuado
- Tratar los campos MU como colecciones mapeadas con JSONB o `@ElementCollection`
- Tratar los grupos PE como entidades integradas `@OneToMany`
- Generar la migración Flyway que crea la tabla PostgreSQL
- Señalar nombres de campos crípticos con marcadores FIXME

## Lo que NO haré

- Inventar significado de negocio para nombres de campos crípticos: añado marcadores FIXME
- Suponer formatos de fecha: el equipo debe confirmarlos
- Crear procedimientos almacenados: toda la lógica de negocio permanece en Java
- Omitir campos MU/PE: son la parte más difícil y deben tratarse explícitamente

## Formato de salida

Dos archivos:

1. Entidad JPA en `src/main/java/[package]/domain/[EntityName].java`
2. Migración Flyway en `db/migration/V[NNN]__create_[table_name].sql`

## Definición de terminado

- [ ] La entidad compila sin errores
- [ ] Cada campo FDT tiene un campo Java correspondiente con el tipo correcto
- [ ] Los campos MU utilizan JSONB (`@JdbcTypeCode(SqlTypes.JSON)`) o `@ElementCollection`
- [ ] Los grupos PE utilizan `@OneToMany` con una clase de entidad separada
- [ ] La migración Flyway es DDL válido de PostgreSQL 16
- [ ] Los nombres de campos crípticos tienen comentarios en el idioma de la rama de destino (inglés en `main` y `develop`, portugués de Brasil en `portugues-br`, español en `espanol`): `// FIXME: confirmar semántica`
- [ ] Los campos crípticos se remiten para que una persona los registre como preguntas pendientes cuando sea necesario

## Cuerpo del prompt

Eres el `@builder`. El equipo necesita crear una entidad JPA a partir de un DDM de Adabas.

**Paso 1 — Analiza la FDT.**
Abre el archivo DDM especificado. Extrae cada definición de campo:

- Número de nivel (01 = nivel superior, 02+ = hijos)
- Nombre corto (nombre de Adabas de dos caracteres)
- Nombre largo (si está presente en comentarios o documentación)
- Formato: A (alfanumérico), N (numérico), P (empaquetado), B (binario), D (fecha), T (hora)
- Longitud
- Tipo de descriptor: DE (permite búsquedas), MU (valores múltiples), PE (grupo periódico), SU (superdescriptor)

Presenta la FDT analizada como tabla para que el equipo la revise antes de generar código.

**Paso 2 — Mapea los tipos.**
Aplica estas reglas de mapeo:

| Adabas | Java | JPA | Notas |
|--------|------|-----|-------|
| A(n) | `String` | `@Column(length = n)` | |
| N(n) sin decimales | `Long` o `Integer` | `@Column` | Utilizar `Long` para identificadores |
| N(n.m) | `BigDecimal` | `@Column(precision=n, scale=m)` | Utilizar siempre para dinero |
| P(n.m) | `BigDecimal` | `@Column(precision=n, scale=m)` | Decimal empaquetado |
| D | `LocalDate` | `@Column` | Solicitar al equipo el formato de origen |
| T | `LocalDateTime` | `@Column` | |
| B(n) | `byte[]` | `@Lob` | Poco habitual |
| Campo MU | `List<T>` | JSONB o `@ElementCollection` | El equipo elige |
| Grupo PE | `List<EmbeddedEntity>` | `@OneToMany` | Clase de entidad separada |

Para los campos MU, presenta ambas opciones:

1. **JSONB**: más sencillo, menor capacidad de consulta → `@JdbcTypeCode(SqlTypes.JSON) private List<String> fieldName;`
2. **@ElementCollection**: mayor capacidad de consulta, tabla separada → `@ElementCollection @CollectionTable(...)`

Deja que el equipo elija para cada campo.

**Paso 3 — Trata los grupos PE.**
Para cada grupo PE, crea una clase `@Entity` separada con:

- Su propia tabla
- Una referencia inversa `@ManyToOne` a la entidad padre
- Todos los campos del grupo PE mapeados como en el paso 2
- Un campo de índice que registre el número de ocurrencia

**Paso 4 — Trata los superdescriptores.**
Para cada superdescriptor, añade una anotación `@Index` compuesta a la entidad padre:

```java
@Table(indexes = @Index(columnList = "field_a, field_b"))
```

**Paso 5 — Señala nombres crípticos.**
Para cualquier campo cuyo nombre de Adabas de dos caracteres no tenga un equivalente claro en inglés:

```java
/** FIXME: confirmar con el equipo la semántica del campo XX de Adabas */
@Column(name = "xx_value", length = 20)
private String xxValue;
```

Si el campo todavía no está en `01-archaeology/mysteries-found.md`, indica al equipo
que una persona debe registrarlo como pregunta pendiente con evidencia `path:line`. No
describas una respuesta, confirmes una hipótesis ni cambies el estado del catálogo.

**Paso 6 — Genera la migración Flyway.**
Escribe un script DDL de PostgreSQL 16:

- Nombre de tabla derivado del nombre de la entidad (snake_case)
- Tipos de columna correspondientes a los mapeos JPA
- Columnas JSONB para campos MU (si se seleccionó JSONB)
- Tabla separada para grupos PE con una clave foránea
- Clave primaria e índices para descriptores
- Restricciones `CHECK` cuando sean evidentes en la FDT (por ejemplo, NOT NULL para campos obligatorios)

Numera la migración: `V[NNN]__create_[table_name].sql`.

**Paso 7 — Verifica la compilación.**
Asegúrate de que la clase de entidad compile. Informa de cualquier problema.

## Ejemplo de invocación

```
/generate-jpa-from-fdt ddm=01-archaeology/legacy-sifap/adabas-ddms/<DDM>.ddm context=<context> package=<java.package> dateformat=<format>
```
