# Descripción general de las pruebas segmentadas

Referencia rápida para seleccionar el segmento de prueba adecuado de Spring Boot.

## Matriz de decisión

| Anotación | Cuándo usarla | Qué carga | Velocidad |
| ---------- | -------- | ----- | ----- |
| **Ninguna** (JUnit sin contexto) | Probar lógica de negocio pura | Nada | La más rápida |
| `@WebMvcTest` | Controlador + capa HTTP | Controladores, MVC, Jackson | Rápida |
| `@DataJpaTest` | Consultas de repositorios | Repositorios, JPA, DataSource | Rápida |
| `@RestClientTest` | Código de clientes REST | RestTemplate/RestClient, Jackson | Rápida |
| `@JsonTest` | Serialización JSON | Solo ObjectMapper | El segmento más rápido |
| `@WebFluxTest` | Controladores reactivos | Controladores, WebFlux | Rápida |
| `@DataJdbcTest` | Repositorios JDBC | Repositorios, JDBC | Rápida |
| `@DataMongoTest` | Repositorios MongoDB | Repositorios, MongoDB | Rápida |
| `@DataRedisTest` | Repositorios Redis | Repositorios, Redis | Rápida |
| `@SpringBootTest` | Integración completa | Toda la aplicación | Lenta |

## Guía de selección

### No usar NINGUNA anotación (prueba unitaria simple)

```java
class PriceCalculatorTest {
  private PriceCalculator calculator = new PriceCalculator();

  @Test
  void shouldApplyDiscount() {
    var result = calculator.applyDiscount(100, 0.1);
    assertThat(result).isEqualTo(new BigDecimal("90.00"));
  }
}
```

**Cuándo**: lógica de negocio pura, sin dependencias o con dependencias sencillas que puedan simularse mediante inyección por constructor.

### Usar @WebMvcTest

```java
@WebMvcTest(OrderController.class)
class OrderControllerTest {
  @Autowired private MockMvcTester mvc;
  @MockitoBean private OrderService orderService;
}
```

**Cuándo**: probar el mapeo de solicitudes, la validación, el mapeo JSON, la seguridad y los filtros.

**Qué obtienes**: MockMvc, ObjectMapper, Spring Security (si está presente) y manejadores de excepciones.

### Usar @DataJpaTest

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class OrderRepositoryTest {
  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");
}
```

**Cuándo**: probar consultas JPA personalizadas, mapeos de entidades, comportamiento de transacciones y operaciones en cascada.

**Qué obtienes**: beans de repositorio, EntityManager, TestEntityManager y soporte de transacciones.

### Usar @RestClientTest

```java
@RestClientTest(WeatherService.class)
class WeatherServiceTest {
  @Autowired private WeatherService weatherService;
  @Autowired private MockRestServiceServer server;
}
```

**Cuándo**: probar clientes REST que llaman a API externas.

**Qué obtienes**: MockRestServiceServer para simular respuestas HTTP.

### Usar @JsonTest

```java
@JsonTest
class OrderJsonTest {
  @Autowired private JacksonTester<Order> json;
}
```

**Cuándo**: probar serializadores y deserializadores personalizados y mapeos JSON complejos.

### Usar @SpringBootTest

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureRestTestClient
class OrderIntegrationTest {
  @Autowired private RestTestClient restClient;
}
```

**Cuándo**: probar conjuntamente el flujo completo de solicitudes, los filtros de seguridad y las interacciones con la base de datos.

**Qué obtienes**: contexto completo de la aplicación, servidor integrado (opcional) y beans reales.

## Errores habituales

1. **Usar @SpringBootTest para todo**: ralentiza innecesariamente la suite de pruebas
2. **@WebMvcTest sin simular servicios**: provoca fallos al cargar el contexto
3. **@DataJpaTest con @MockBean**: contradice el objetivo (se buscan repositorios reales)
4. **Varios segmentos en una prueba**: cada segmento corresponde a una clase de prueba separada

## Funcionalidades de Java 21 en las pruebas

### Records para datos de prueba

```java
record OrderRequest(String product, int quantity) {}
record OrderResponse(Long id, String status, BigDecimal total) {}
```

### Coincidencia de patrones en pruebas

```java
@Test
void shouldHandleDifferentOrderTypes() {
  var order = orderService.create(new OrderRequest("Product", 2));

  switch (order) {
    case PhysicalOrder po -> assertThat(po.getShippingAddress()).isNotNull();
    case DigitalOrder do_ -> assertThat(do_.getDownloadLink()).isNotNull();
    default -> throw new IllegalStateException("Unknown order type");
  }
}
```

### Bloques de texto para JSON

```java
@Test
void shouldParseComplexJson() {
  var json = """
    {
      "id": 1,
      "status": "PENDING",
      "items": [
        {"product": "Laptop", "price": 999.99},
        {"product": "Mouse", "price": 29.99}
      ]
    }
    """;

  assertThat(mvc.post().uri("/orders")
    .contentType(APPLICATION_JSON)
    .content(json))
    .hasStatus(CREATED);
}
```

### Colecciones secuenciadas

```java
@Test
void shouldReturnOrdersInSequence() {
  var orders = orderRepository.findAll();

  assertThat(orders.getFirst().getStatus()).isEqualTo("NEW");
  assertThat(orders.getLast().getStatus()).isEqualTo("COMPLETED");
  assertThat(orders.reversed().getFirst().getStatus()).isEqualTo("COMPLETED");
}
```

## Dependencias por segmento

```xml
<!-- WebMvcTest -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-webmvc-test</artifactId>
  <scope>test</scope>
</dependency>

<!-- DataJpaTest -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- RestClientTest -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-restclient-test</artifactId>
  <scope>test</scope>
</dependency>

<!-- Testcontainers -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-testcontainers</artifactId>
  <scope>test</scope>
</dependency>
```
