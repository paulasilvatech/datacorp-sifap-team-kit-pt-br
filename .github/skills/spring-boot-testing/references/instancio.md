# Instancio

Genera automáticamente objetos de prueba complejos. Úsalo cuando las entidades o DTO tengan 3 o más propiedades.

## Cuándo usar

- Objetos con **3 o más propiedades**
- Preparación de datos de prueba para repositorios
- Creación de DTO para pruebas de controladores
- Evitar llamadas repetitivas a builders o setters

## Dependencia

```xml
<dependency>
  <groupId>org.instancio</groupId>
  <artifactId>instancio-junit</artifactId>
  <version>5.5.1</version>
  <scope>test</scope>
</dependency>
```

## Uso básico

### Objeto sencillo

```java
final var order = Instancio.create(Order.class);
// Todos los campos se rellenan con datos aleatorios
```

### Lista de objetos

```java
final var orders = Instancio.ofList(Order.class).size(5).create();
// 5 pedidos con datos aleatorios
```

## Personalización de valores

### Establecer campos concretos

```java
final var order = Instancio.of(Order.class)
  .set(field(Order::getStatus), "PENDING")
  .set(field(Order::getTotal), new BigDecimal("99.99"))
  .create();
```

### Proporcionar valores generados

```java
final var order = Instancio.of(Order.class)
  .supply(field(Order::getEmail), () -> "user" + UUID.randomUUID() + "@test.com")
  .create();
```

### Ignorar campos

```java
final var order = Instancio.of(Order.class)
  .ignore(field(Order::getId)) // Dejar que la BD lo genere
  .create();
```

## Objetos complejos

### Objetos anidados

```java
final var order = Instancio.of(Order.class)
  .set(field(Order::getCustomer), Instancio.create(Customer.class))
  .set(field(Order::getItems), Instancio.ofList(OrderItem.class).size(3).create())
  .create();
```

### Todos los campos aleatorios

```java
// Cuando se necesitan datos completamente aleatorios, pero válidos
final var randomOrder = Instancio.create(Order.class);
// Cliente, elementos y direcciones: todo queda rellenado
```

## Integración con Spring Boot

### Preparación de pruebas de repositorio

```java
@DataJpaTest
@AutoConfigureTestDatabase
@Testcontainers
class OrderRepositoryTest {

  @Container
  @ServiceConnection
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

  @Autowired
  private OrderRepository orderRepository;

  @Test
  void shouldFindOrdersByStatus() {
    // Dado: crear 10 pedidos aleatorios con estado PENDING
    final var orders = Instancio.ofList(Order.class)
      .size(10)
      .set(field(Order::getStatus), "PENDING")
      .create();

    orderRepository.saveAll(orders);

    // Cuando
    final var found = orderRepository.findByStatus("PENDING");

    // Entonces
    assertThat(found).hasSize(10);
  }
}
```

### Preparación de pruebas de controlador

```java
@WebMvcTest(OrderController.class)
class OrderControllerTest {

  @Autowired
  private MockMvcTester mvc;

  @MockitoBean
  private OrderService orderService;

  @Test
  void shouldReturnOrder() {
    // Dado: pedido aleatorio con un ID concreto
    Order order = Instancio.of(Order.class)
      .set(field(Order::getId), 1L)
      .create();

    given(orderService.findById(1L)).willReturn(order);

    // Cuando/Entonces
    assertThat(mvc.get().uri("/orders/1"))
      .hasStatus(HttpStatus.OK)
      .bodyJson()
      .convertTo(OrderResponse.class)
      .satisfies(response -> {
        assertThat(response.getId()).isEqualTo(1L);
      });
  }
}
```

## Patrones

### Alternativa al patrón Builder

```java
// En lugar de:
Order order = Order.builder()
  .id(1L)
  .status("PENDING")
  .customer(Customer.builder().name("John").build())
  .items(List.of(
    OrderItem.builder().product("A").price(10).build(),
    OrderItem.builder().product("B").price(20).build()
  ))
  .build();

// Usa:
Order order = Instancio.of(Order.class)
  .set(field(Order::getId), 1L)
  .set(field(Order::getStatus), "PENDING")
  .create();
// Cliente y elementos generados automáticamente
```

### Datos con semilla

```java
// Datos "aleatorios" coherentes para pruebas reproducibles
Order order = Instancio.of(Order.class)
  .withSeed(12345L)
  .create();
// Los mismos datos en cada ejecución de prueba con la semilla 12345
```

## Patrones habituales

### Generación de correos electrónicos

```java
String email = Instancio.gen().net().email();
```

### Generación de fechas

```java
LocalDateTime createdAt = Instancio.gen().temporal()
  .localDateTime()
  .past()
  .create();
```

### Patrones de cadenas

```java
String phone = Instancio.gen().text().pattern("+1-###-###-####");
```

## Comparación

| Enfoque | Líneas de código | Mantenibilidad |
| -------- | ------------- | --------------- |
| Setters manuales | 10-20 | Baja |
| Patrón Builder | 5-10 | Media |
| **Instancio** | 2-5 | **Alta** |

## Buenas prácticas

1. **Úsalo para objetos con 3 o más propiedades**: no merece la pena para objetos sencillos
2. **Establece solo lo relevante**: deja que Instancio rellene el resto
3. **Úsalo con Testcontainers**: resulta útil para poblar bases de datos
4. **Establece los ID explícitamente**: al probar escenarios concretos
5. **Ignora los campos generados automáticamente**: como createdAt y updatedAt

## Enlaces

- [Documentación de Instancio](https://www.instancio.org/)
- [Extensión de JUnit 5](https://www.instancio.org/user-guide/#junit-integration)
