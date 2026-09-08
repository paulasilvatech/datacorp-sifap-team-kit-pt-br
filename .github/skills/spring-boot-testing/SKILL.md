---
name: "spring-boot-testing"
description: "Selecciona la técnica de pruebas Spring Boot adecuada para cada escenario: pruebas segmentadas (@WebMvcTest, @DataJpaTest, @RestClientTest, @JsonTest, @SpringBootTest), Testcontainers, Mockito y AssertJ. Úsala para escribir o revisar pruebas de integración o segmentadas de Spring Boot. Se orienta a Spring Boot 3.3 + JUnit 5 del kit; las API más recientes de 3.4+/4.0 (MockMvcTester, @MockitoBean, RestTestClient) se señalan como fuera de su alcance."
---
# Pruebas de Spring Boot

Esta skill ayuda a elegir la técnica adecuada de pruebas Spring Boot para un escenario. Se orienta al stack **Spring Boot 3.3 + JUnit 5 + Testcontainers** del kit; algunas API más recientes de Spring Boot 3.4+/4.0 se muestran solo como referencia y están claramente marcadas como **fuera del alcance del kit**. Para pruebas unitarias de lógica de negocio sin contexto de Spring, usa [`java-junit`](../java-junit/SKILL.md).

## Cuándo invocar

- "¿Qué segmento de prueba debo usar para este controlador?"
- "Escribe una `@DataJpaTest` contra PostgreSQL real con Testcontainers."
- "Revisa si estas pruebas Spring Boot usan la capa y el alcance adecuados."
- "Configura Testcontainers para nuestras pruebas de integración."

## Principios fundamentales

1. **Pirámide de pruebas**: unitarias (rápidas) > segmentadas (enfocadas) > integración (completas)
2. **Herramienta adecuada**: usa el segmento más acotado que te proporcione confianza
3. **Estilo AssertJ**: aserciones fluidas y legibles en lugar de comparadores verbosos
4. **Stack del kit**: en Spring Boot 3.3 usa MockMvc clásico y `@MockBean`; las API más recientes MockMvcTester / `@MockitoBean` / RestTestClient (3.4+/4.0) quedan fuera del alcance

## ¿Qué segmento de prueba elegir?

| Escenario | Anotación | Referencia |
|----------|------------|-----------|
| Controlador + semántica HTTP | `@WebMvcTest` | [references/webmvctest.md](references/webmvctest.md) |
| Repositorio + consultas JPA | `@DataJpaTest` | [references/datajpatest.md](references/datajpatest.md) |
| Cliente REST + API externas | `@RestClientTest` | [references/restclienttest.md](references/restclienttest.md) |
| Serialización y deserialización JSON | `@JsonTest` | [references/test-slices-overview.md](references/test-slices-overview.md) |
| Aplicación completa | `@SpringBootTest` | [references/test-slices-overview.md](references/test-slices-overview.md) |

## Referencia de pruebas segmentadas

- [references/test-slices-overview.md](references/test-slices-overview.md): matriz de decisión y comparación
- [references/webmvctest.md](references/webmvctest.md): capa web con MockMvc
- [references/datajpatest.md](references/datajpatest.md): capa de datos con Testcontainers
- [references/restclienttest.md](references/restclienttest.md): pruebas de clientes REST

## Referencia de herramientas de pruebas

- [references/mockmvc-classic.md](references/mockmvc-classic.md): MockMvc clásico, predeterminado del kit en Spring Boot 3.3
- [references/mockmvc-tester.md](references/mockmvc-tester.md): MockMvc de estilo AssertJ (Spring Boot 3.4+, fuera del alcance)
- [references/mockitobean.md](references/mockitobean.md): simulación con `@MockitoBean` (Spring Boot 3.4+, fuera del alcance)
- [references/resttestclient.md](references/resttestclient.md): RestTestClient (Spring Boot 4.0, fuera del alcance)

## Bibliotecas de aserciones

- [references/assertj-basics.md](references/assertj-basics.md): escalares, cadenas, booleanos y fechas
- [references/assertj-collections.md](references/assertj-collections.md): listas, conjuntos, mapas y matrices

## Testcontainers

- [references/testcontainers-jdbc.md](references/testcontainers-jdbc.md): PostgreSQL 16 y otras bases de datos JDBC

## Generación de datos de prueba

- [references/instancio.md](references/instancio.md): generar objetos de prueba complejos (3 propiedades o más)

## Rendimiento y migración

- [references/context-caching.md](references/context-caching.md): acelerar las suites de pruebas
- [references/sb4-migration.md](references/sb4-migration.md): cambios de Spring Boot 4.0

## Árbol rápido de decisión

```
¿Pruebas de un punto de conexión de controlador?
  Sí → @WebMvcTest con MockMvc clásico (MockMvcTester requiere Spring Boot 3.4+)

¿Pruebas de consultas de repositorio?
  Sí → @DataJpaTest con Testcontainers (base de datos real)

¿Pruebas de lógica de negocio en un servicio?
  Sí → JUnit + Mockito sin contexto de Spring

¿Pruebas de un cliente de API externa?
  Sí → @RestClientTest con MockRestServiceServer

¿Pruebas de mapeo JSON?
  Sí → @JsonTest

¿Necesitas una prueba de integración completa?
  Sí → @SpringBootTest con configuración mínima del contexto
```

## API más recientes: fuera del alcance del kit (Spring Boot 3.4+/4.0)

El kit está fijado en **Spring Boot 3.3 + JUnit 5**. Las siguientes API más recientes se enumeran
solo con fines informativos; no las adoptes en el código del kit:

- **MockMvcTester**: aserciones MockMvc de estilo AssertJ (Spring Boot 3.4+). En 3.3, usa MockMvc clásico.
- **@MockitoBean**: reemplaza a `@MockBean` (Spring Boot 3.4+). En 3.3, usa `@MockBean`.
- **RestTestClient**: alternativa a `TestRestTemplate` (Spring Boot 4.0). En 3.3, usa `TestRestTemplate` o `RestClient`.
- **Starters de pruebas modulares** y **pausa del contexto** (Spring Boot 4.0 / Spring Framework 7).

Consulta [references/sb4-migration.md](references/sb4-migration.md) solo si el proyecto se actualiza realmente más allá de 3.3.

## Buenas prácticas de pruebas

### Evaluación de la complejidad del código

Cuando un método o clase es demasiado complejo para probarlo eficazmente:

1. **Analiza la complejidad**: si necesitas más de 5-7 casos de prueba para cubrir un único método, probablemente sea demasiado complejo
2. **Recomienda refactorizar**: sugiere dividir el código en funciones más pequeñas y enfocadas
3. **Decisión de la persona**: si acepta refactorizar, ayuda a identificar puntos de extracción
4. **Continúa si es necesario**: si decide seguir con el código complejo, implementa las pruebas a pesar de la dificultad

**Ejemplo de recomendación de refactorización:**

```java
// Antes: método complejo difícil de probar
public Order processOrder(OrderRequest request) {
  // Validación, cálculo de descuentos, pago, inventario, notificación...
  // Más de 50 líneas con responsabilidades mezcladas
}

// Después: refactorizado en unidades comprobables
public Order processOrder(OrderRequest request) {
  validateOrder(request);
  var order = createOrder(request);
  applyDiscount(order);
  processPayment(order);
  updateInventory(order);
  sendNotification(order);
  return order;
}
```

### Evitar la redundancia de código

Crea métodos auxiliares para los objetos de uso habitual y la preparación de simulaciones, a fin de mejorar la legibilidad y la mantenibilidad.

### Organización de pruebas con @DisplayName

Usa nombres de presentación descriptivos para aclarar la intención de las pruebas:

```java
@Test
@DisplayName("Debe calcular el descuento para un cliente VIP")
void shouldCalculateDiscountForVip() { }

@Test
@DisplayName("Debe rechazar el pedido cuando el cliente no tiene crédito suficiente")
void shouldRejectOrderForInsufficientCredit() { }
```

### Orden de cobertura de pruebas

Estructura siempre las pruebas en este orden:

1. **Escenario principal**: flujo exitoso y caso de uso más habitual
2. **Otras rutas**: escenarios válidos alternativos y casos límite
3. **Excepciones y errores**: entradas inválidas, condiciones de error y modos de fallo

### Probar escenarios de producción

Escribe pruebas pensando en escenarios reales de producción. Esto hace que resulten más comprensibles y ayuda a entender el comportamiento del código en casos reales.

### Objetivos de cobertura de pruebas

Busca una cobertura de código del 80% como equilibrio práctico entre calidad y esfuerzo. Una cobertura mayor es beneficiosa, pero no es el único objetivo.

Usa el plugin Maven de Jacoco para informar de la cobertura y dar seguimiento a ella.

**Reglas de cobertura:**

- Cobertura mínima del 80+%
- Céntrate en aserciones significativas, no solo en la ejecución

**Qué priorizar:**

1. Rutas críticas de negocio (procesamiento de pagos, validación de pedidos)
2. Algoritmos complejos (precios, cálculo de descuentos)
3. Gestión de errores (excepciones, casos límite)
4. Puntos de integración (API externas, bases de datos)

## Dependencias (Spring Boot 3.3)

`spring-boot-starter-test` ya incluye JUnit 5, Mockito, AssertJ y MockMvc. Añade el
módulo de soporte de Testcontainers para ejecutar `@DataJpaTest` / `@SpringBootTest` contra PostgreSQL 16 real.

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>

<!-- Soporte de Testcontainers (PostgreSQL real para @DataJpaTest / @SpringBootTest) -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-testcontainers</artifactId>
  <scope>test</scope>
</dependency>
<dependency>
  <groupId>org.testcontainers</groupId>
  <artifactId>postgresql</artifactId>
  <scope>test</scope>
</dependency>
```

## Plantilla de salida

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class PaymentRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @Autowired
    PaymentRepository repository;

    @Test
    void findsByStatus() {
        repository.save(new Payment("PENDING"));
        assertThat(repository.findByStatus("PENDING")).hasSize(1);
    }
}
```

## Puerta de calidad

- [ ] Se usa el segmento más acotado que proporciona confianza (unitarias -> segmentadas -> `@SpringBootTest`).
- [ ] Las pruebas de capa de datos e integración completa se ejecutan contra PostgreSQL 16 real mediante Testcontainers, no H2.
- [ ] En Spring Boot 3.3 se usan `MockMvc` clásico y `@MockBean`; no se adopta ninguna API 3.4+/4.0 (MockMvcTester, `@MockitoBean`, RestTestClient).
- [ ] Las aserciones usan `assertThat` de AssertJ; cada prueba se centra en un comportamiento.
- [ ] La suite reutiliza el contexto de Spring cuando es posible (consulta context-caching) para mantener la velocidad.
- [ ] `./mvnw test` pasa localmente antes de abrir la PR.
