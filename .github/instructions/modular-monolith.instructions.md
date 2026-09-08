---
description: "Utiliza al diseñar o revisar la arquitectura de monolito modular, los límites de paquetes por funcionalidad, el mapeo JPA y la migración Strangler Fig."
applyTo: "backend/src/main/java/**,backend/pom.xml,backend/build.gradle*"
---

# Guía de arquitectura de monolito modular

Este archivo se activa al trabajar en archivos fuente Java o configuraciones de compilación del backend. Enseña la arquitectura de destino: un **monolito modular**, no microservicios, con límites de paquetes por funcionalidad, contextos delimitados, mapeo de FDT de Adabas a JPA, convenciones arquitectónicas de Spring Boot 3.3 y estructura de migración Strangler Fig. **No** define los detalles de controladores, DTO, validación ni respuestas de error, que corresponden a [`backend.instructions.md`](backend.instructions.md); la seguridad corresponde a [`security.instructions.md`](security.instructions.md); las migraciones de esquema, a [`database.instructions.md`](database.instructions.md); y la lectura de fuentes heredadas, a [`natural-adabas.instructions.md`](natural-adabas.instructions.md).

## Principio central: una unidad desplegable, muchos módulos

El sistema de destino es una única aplicación Spring Boot con límites internos de módulos claros. Cada contexto delimitado es un módulo Maven (o paquete de nivel superior) que contiene sus propias capas de dominio, repositorio y servicio.

Por qué un monolito modular en lugar de microservicios:

- **Restricción de la inmersión**: 8 horas no bastan para gestionar sistemas distribuidos, descubrimiento de servicios y comunicación entre servicios.
- **Presupuesto de complejidad**: un monolito con límites de módulos sólidos ofrece el 80% de los beneficios de los microservicios (autonomía del equipo, responsabilidad clara) con el 20% del costo operativo.
- **Ruta de migración**: un monolito modular bien estructurado puede descomponerse más adelante en microservicios si es necesario. El camino inverso es mucho más difícil.

## Estructura de paquetes por funcionalidad

Organiza el código por capacidad de negocio, no por capa técnica:

```
src/main/java/com/example/app/
├── <feature>/                  # Contexto delimitado definido por el equipo
│   ├── <Feature>Controller.java
│   ├── <Feature>Service.java
│   ├── <Feature>Repository.java
│   ├── <Feature>.java
│   └── <Feature>Dto.java
├── shared/                     # Núcleo compartido
│   ├── audit/                  # Aspecto transversal: registro de auditoría
│   └── exception/              # Aspecto transversal: tratamiento de errores
└── Application.java            # Punto de entrada de Spring Boot
```

Reglas:

- Un módulo **NUNCA** DEBE importar directamente clases internas de otro módulo. Utiliza interfaces o eventos.
- El paquete `shared/` contiene solo aspectos transversales (auditoría, excepciones y entidades base).
- Cada módulo tiene sus propios `*Repository`, `*Service` y `*Controller`.

## Límites de contextos delimitados

Al decidir dónde establecer los límites de los módulos, pregunta:

1. **¿Quién es responsable de estos datos?** Si dos funcionalidades comparten la misma tabla, pueden pertenecer al mismo contexto.
2. **¿Qué cambia conjuntamente?** Las funcionalidades modificadas en el mismo sprint deben agruparse.
3. **¿Qué puede fallar de forma independiente?** Si un fallo de la funcionalidad A NO DEBE romper la funcionalidad B, pertenecen a contextos separados.

Un patrón habitual en la modernización de sistemas heredados Natural/Adabas es que cada archivo de Adabas (FNR) suele corresponder a un contexto delimitado, aunque algunos archivos contienen datos de referencia compartidos que pertenecen a un núcleo compartido.

## Mapeo JPA a partir de FDT de Adabas

### Campos simples

| Formato de Adabas | Tipo Java | Anotación JPA |
|---|---|---|
| `A` (alfanumérico) | `String` | `@Column(length = N)` |
| `N` (numérico, sin decimales) | `Long` o `Integer` | `@Column` |
| `N` (numérico, con decimales) | `BigDecimal` | `@Column(precision = P, scale = S)` |
| `P` (decimal empaquetado) | `BigDecimal` | `@Column(precision = P, scale = S)` |
| `D` (fecha) | `LocalDate` | `@Column` |
| `T` (hora/fecha y hora) | `LocalDateTime` | `@Column` |
| `B` (binario) | `byte[]` | `@Column` / `@Lob` |

### Campos MU (valores múltiples) → JSONB

```java
@Column(columnDefinition = "jsonb")
@JdbcTypeCode(SqlTypes.JSON)
private List<String> alternateNames;  // Era un campo MU en Adabas
```

O utiliza `@ElementCollection` si se necesita capacidad de consulta:

```java
@ElementCollection
@CollectionTable(name = "person_alternate_names")
private List<String> alternateNames;
```

### PE (grupos periódicos) → @OneToMany

```java
@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
@JoinColumn(name = "person_id")
private List<AddressHistory> addressHistory;  // Era un grupo PE
```

Donde `AddressHistory` es una `@Entity` con su propia tabla.

## Convenciones de Spring Boot 3.3

- **Inyección por constructor**: sin `@Autowired` a nivel de campo. Utiliza `@RequiredArgsConstructor` (Lombok) o constructores explícitos.
- **Registros para DTO**: `public record ResourceDto(Long id, String label) {}`
- **Validación en la capa de controladores**: `@Valid @RequestBody ResourceDto dto` con anotaciones de Bean Validation en el DTO.
- **@Transactional solo en la capa de servicios**: NUNCA en repositorios, NUNCA en controladores.
- **Optional para retornos que pueden estar ausentes**: `Optional<Resource> findById(Long id)`; NUNCA devuelvas `null` desde métodos públicos.
- **Interfaces selladas para uniones de tipos**: `sealed interface ResourceState permits StateA, StateB {}`

## Patrón de tratamiento de errores

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleNotFound(EntityNotFoundException ex) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND, ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(detail);
    }
}
```

Utiliza `ProblemDetail` (RFC 7807) para todas las respuestas de error.

## Patrón Strangler Fig

Cuando el sistema moderno deba coexistir con el sistema heredado:

1. **Fachada**: todas las solicitudes pasan por una capa de enrutamiento
2. **Ruta nueva**: los módulos Spring Boot gestionan las funcionalidades nuevas o migradas
3. **Ruta heredada**: las funcionalidades no migradas se redirigen al sistema heredado mediante un proxy
4. **Migración gradual**: a medida que se migra cada funcionalidad, su ruta cambia del sistema heredado al moderno

Este patrón se aplica incluso dentro del alcance de la inmersión: es posible que los equipos no migren todo y eso es aceptable. La arquitectura DEBE admitir una migración parcial sin problemas.

## Convenciones

| Regla | Justificación |
|---|---|
| Una unidad desplegable Spring Boot con muchos módulos internos | Conserva la rapidez de entrega de la inmersión y mantiene explícitos los límites |
| Paquetes por capacidad de negocio | Los módulos se corresponden con contextos delimitados en lugar de capas técnicas |
| Los detalles internos de los módulos permanecen privados; el acceso entre módulos utiliza interfaces o eventos | Evita el acoplamiento oculto entre contextos |
| Los tipos de FDT de Adabas se mapean deliberadamente a tipos Java/JPA | Evita truncamientos silenciosos, pérdida de precisión y relaciones incorrectas |
| `@Transactional` solo en servicios e inyección por constructor en todas partes | Mantiene explícitos los límites de persistencia y las dependencias |
| `ProblemDetail` para errores | Ofrece a cada módulo una única estructura de error legible por máquinas |

## Qué hacer / Qué no hacer

| Qué hacer | Qué no hacer |
|---|---|
| Mantener una única aplicación Spring Boot con módulos internos claros | Crear aplicaciones Spring Boot o microservicios separados para cada contexto |
| Situar la lógica de negocio en servicios Java | Trasladar la lógica de negocio a procedimientos almacenados o funciones de PostgreSQL |
| Utilizar JPA/JPQL o consultas derivadas de Spring Data | Concatenar cadenas para construir SQL |
| Utilizar inyección por constructor | Utilizar inyección de campos con `@Autowired` |
| Devolver `Optional` cuando un resultado pueda estar ausente | Devolver `null` desde métodos públicos |
| Admitir la migración parcial con una fachada Strangler Fig | Suponer que todo el sistema heredado se migra de una vez |

## Lista de verificación antes de abrir una PR

- [ ] El código nuevo está dentro de una única unidad desplegable Spring Boot y organizado por capacidad de negocio
- [ ] Ningún módulo importa directamente clases internas de otro módulo; las interfaces o los eventos definen el límite
- [ ] Los repositorios, servicios, controladores, entidades y DTO permanecen dentro del módulo responsable o del núcleo compartido
- [ ] Los campos de FDT de Adabas se han mapeado a tipos Java/JPA conservando la precisión y la semántica de MU, PE y descriptores
- [ ] `@Transactional` aparece solo en servicios, las dependencias utilizan inyección por constructor y los métodos públicos no devuelven `null`
- [ ] El diseño puede coexistir con rutas heredadas no migradas mediante el enrutamiento Strangler Fig
