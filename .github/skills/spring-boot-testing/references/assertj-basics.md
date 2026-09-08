# Fundamentos de AssertJ

Aserciones fluidas para pruebas legibles y mantenibles.

## Aserciones básicas

### Igualdad de objetos

```java
assertThat(order.getStatus()).isEqualTo("PENDING");
assertThat(order.getId()).isNotEqualTo(0);
assertThat(order).isEqualTo(expectedOrder);
assertThat(order).isNotNull();
assertThat(nullOrder).isNull();
```

### Aserciones de cadenas

```java
assertThat(order.getDescription())
  .isEqualTo("Test Order")
  .startsWith("Test")
  .endsWith("Order")
  .contains("Test")
  .hasSize(10)
  .matches("[A-Za-z ]+");
```

### Aserciones numéricas

```java
assertThat(order.getAmount())
  .isEqualTo(99.99)
  .isGreaterThan(50)
  .isLessThan(100)
  .isBetween(50, 100)
  .isPositive()
  .isNotZero();
```

### Aserciones booleanas

```java
assertThat(order.isActive()).isTrue();
assertThat(order.isDeleted()).isFalse();
```

## Aserciones de fecha y hora

```java
assertThat(order.getCreatedAt())
  .isEqualTo(LocalDateTime.of(2024, 1, 15, 10, 30))
  .isBefore(LocalDateTime.now())
  .isAfter(LocalDateTime.of(2024, 1, 1))
  .isCloseTo(LocalDateTime.now(), within(5, ChronoUnit.SECONDS));
```

## Aserciones de Optional

```java
Optional<Order> maybeOrder = orderService.findById(1L);

assertThat(maybeOrder)
  .isPresent()
  .hasValueSatisfying(order -> {
    assertThat(order.getId()).isEqualTo(1L);
  });

assertThat(orderService.findById(999L)).isEmpty();
```

## Aserciones de excepciones

### Gestión de excepciones con JUnit 5

```java
@Test
void shouldThrowException() {
  OrderService service = new OrderService();

  assertThatThrownBy(() -> service.findById(999L))
    .isInstanceOf(OrderNotFoundException.class)
    .hasMessage("Order 999 not found")
    .hasMessageContaining("999");
}
```

### Gestión de excepciones con AssertJ

```java
@Test
void shouldThrowExceptionWithCause() {
  assertThatExceptionOfType(OrderProcessingException.class)
    .isThrownBy(() -> service.processOrder(invalidOrder))
    .withCauseInstanceOf(ValidationException.class);
}
```

## Aserciones personalizadas

Crea aserciones específicas del dominio para reutilizar código de prueba:

```java
public class OrderAssert extends AbstractAssert<OrderAssert, Order> {

  public static OrderAssert assertThat(Order actual) {
    return new OrderAssert(actual);
  }

  private OrderAssert(Order actual) {
    super(actual, OrderAssert.class);
  }

  public OrderAssert isPending() {
    isNotNull();
    if (!"PENDING".equals(actual.getStatus())) {
      failWithMessage("Expected order status to be PENDING but was %s", actual.getStatus());
    }
    return this;
  }

  public OrderAssert hasTotal(BigDecimal expected) {
    isNotNull();
    if (!expected.equals(actual.getTotal())) {
      failWithMessage("Expected total %s but was %s", expected, actual.getTotal());
    }
    return this;
  }
}
```

Uso:

```java
OrderAssert.assertThat(order)
  .isPending()
  .hasTotal(new BigDecimal("99.99"));
```

## Aserciones acumulativas

Recopila varios fallos antes de hacer fallar la prueba:

```java
@Test
void shouldValidateOrder() {
  Order order = orderService.findById(1L);

  SoftAssertions.assertSoftly(softly -> {
    softly.assertThat(order.getId()).isEqualTo(1L);
    softly.assertThat(order.getStatus()).isEqualTo("PENDING");
    softly.assertThat(order.getItems()).isNotEmpty();
  });
}
```

## Patrón satisfies

```java
assertThat(order)
  .satisfies(o -> {
    assertThat(o.getId()).isPositive();
    assertThat(o.getStatus()).isNotBlank();
    assertThat(o.getCreatedAt()).isNotNull();
  });
```

## Uso con Spring

```java
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class OrderServiceTest {

  @Autowired
  private OrderService orderService;

  @Test
  void shouldCreateOrder() {
    Order order = orderService.create(new OrderRequest("Product", 2));

    assertThat(order)
      .isNotNull()
      .extracting(Order::getId, Order::getStatus)
      .containsExactly(1L, "PENDING");
  }
}
```

## Importación estática

Usa siempre importaciones estáticas para mantener las aserciones claras:

```java
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.catchThrowable;
```

## Ventajas principales

1. **Legibilidad**: estructura similar a una frase
2. **Seguridad de tipos**: funciona el autocompletado del IDE
3. **API amplia**: muchas aserciones integradas
4. **Extensibilidad**: aserciones personalizadas para tu dominio
5. **Mejores errores**: mensajes de fallo claros
