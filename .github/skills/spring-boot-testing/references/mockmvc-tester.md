# MockMvcTester

Pruebas de estilo AssertJ para controladores Spring MVC (Spring Boot 3.2+).

## Descripción general

MockMvcTester proporciona aserciones fluidas de estilo AssertJ para probar la capa web. Ofrece mayor legibilidad y seguridad de tipos que MockMvc tradicional.

**Patrón recomendado**: convierte JSON a objetos reales y realiza las aserciones con AssertJ:

```java
assertThat(mvc.get().uri("/orders/1"))
  .hasStatus(HttpStatus.OK)
  .bodyJson()
  .convertTo(OrderResponse.class)
  .satisfies(response -> {
    assertThat(response.getTotalToPay()).isEqualTo(expectedAmount);
    assertThat(response.getItems()).isNotEmpty();
  });
```

## Uso básico

```java
@WebMvcTest(OrderController.class)
class OrderControllerTest {

  @Autowired
  private MockMvcTester mvc;

  @MockitoBean
  private OrderService orderService;
}
```

## Recomendado: patrón de conversión de objetos

### Respuesta de un único objeto

```java
@Test
void shouldGetOrder() {
  given(orderService.findById(1L)).willReturn(new Order(1L, "PENDING", 99.99));

  assertThat(mvc.get().uri("/orders/1"))
    .hasStatus(HttpStatus.OK)
    .bodyJson()
    .convertTo(OrderResponse.class)
    .satisfies(response -> {
      assertThat(response.getId()).isEqualTo(1L);
      assertThat(response.getStatus()).isEqualTo("PENDING");
      assertThat(response.getTotalToPay()).isEqualTo(new BigDecimal("99.99"));
    });
}
```

### Respuesta de lista

```java
@Test
void shouldGetAllOrders() {
  given(orderService.findAll()).willReturn(Arrays.asList(
    new Order(1L, "PENDING"),
    new Order(2L, "COMPLETED")
  ));

  assertThat(mvc.get().uri("/orders"))
    .hasStatus(HttpStatus.OK)
    .bodyJson()
    .convertTo(new TypeReference<List<OrderResponse>>() {})
    .satisfies(orders -> {
      assertThat(orders).hasSize(2);
      assertThat(orders.get(0).getStatus()).isEqualTo("PENDING");
      assertThat(orders.get(1).getStatus()).isEqualTo("COMPLETED");
    });
}
```

### Objetos anidados

```java
@Test
void shouldGetOrderWithCustomer() {
  assertThat(mvc.get().uri("/orders/1"))
    .hasStatus(HttpStatus.OK)
    .bodyJson()
    .convertTo(OrderResponse.class)
    .satisfies(response -> {
      assertThat(response.getCustomer()).isNotNull();
      assertThat(response.getCustomer().getName()).isEqualTo("John Doe");
      assertThat(response.getCustomer().getAddress().getCity()).isEqualTo("Berlin");
    });
}
```

### Aserciones complejas

```java
@Test
void shouldCalculateOrderTotal() {
  assertThat(mvc.get().uri("/orders/1/calculate"))
    .hasStatus(HttpStatus.OK)
    .bodyJson()
    .convertTo(CalculationResponse.class)
    .satisfies(calc -> {
      assertThat(calc.getSubtotal()).isEqualTo(new BigDecimal("100.00"));
      assertThat(calc.getTax()).isEqualTo(new BigDecimal("19.00"));
      assertThat(calc.getTotalToPay()).isEqualTo(new BigDecimal("119.00"));
      assertThat(calc.getItems()).allMatch(item -> item.getPrice().compareTo(BigDecimal.ZERO) > 0);
    });
}
```

## Métodos HTTP

### POST con cuerpo de solicitud

```java
@Test
void shouldCreateOrder() {
  given(orderService.create(any())).willReturn(1L);

  assertThat(mvc.post().uri("/orders")
    .contentType(MediaType.APPLICATION_JSON)
    .content("{\"product\": \"Laptop\", \"quantity\": 2}"))
    .hasStatus(HttpStatus.CREATED)
    .hasHeader("Location", "/orders/1");
}
```

### Solicitud PUT

```java
@Test
void shouldUpdateOrder() {
  assertThat(mvc.put().uri("/orders/1")
    .contentType(MediaType.APPLICATION_JSON)
    .content("{\"status\": \"COMPLETED\"}"))
    .hasStatus(HttpStatus.OK);
}
```

### Solicitud DELETE

```java
@Test
void shouldDeleteOrder() {
  assertThat(mvc.delete().uri("/orders/1"))
    .hasStatus(HttpStatus.NO_CONTENT);
}
```

## Aserciones de estado

```java
assertThat(mvc.get().uri("/orders/1"))
  .hasStatusOk()                    // 200
  .hasStatus(HttpStatus.OK)         // 200
  .hasStatus2xxSuccessful()         // 2xx
  .hasStatusBadRequest()            // 400
  .hasStatusNotFound()              // 404
  .hasStatusUnauthorized()          // 401
  .hasStatusForbidden()             // 403
  .hasStatus(HttpStatus.CREATED);   // 201
```

## Aserciones del tipo de contenido

```java
assertThat(mvc.get().uri("/orders/1"))
  .hasContentType(MediaType.APPLICATION_JSON)
  .hasContentTypeCompatibleWith(MediaType.APPLICATION_JSON);
```

## Aserciones de encabezados

```java
assertThat(mvc.post().uri("/orders"))
  .hasHeader("Location", "/orders/123")
  .hasHeader("X-Request-Id", matchesPattern("[a-z0-9-]+"));
```

## Alternativa: JSON Path (usar con moderación)

Úsalo solo cuando no puedas convertir a un objeto tipado:

```java
assertThat(mvc.get().uri("/orders/1"))
  .hasStatusOk()
  .bodyJson()
  .extractingPath("$.customer.address.city")
  .asString()
  .isEqualTo("Berlin");
```

## Parámetros de solicitud

```java
// Parámetros de consulta
assertThat(mvc.get().uri("/orders?status=PENDING&page=0"))
  .hasStatusOk();

// Parámetros de ruta
assertThat(mvc.get().uri("/orders/{id}", 1L))
  .hasStatusOk();

// Encabezados
assertThat(mvc.get().uri("/orders/1")
  .header("X-Api-Key", "secret"))
  .hasStatusOk();
```

## Cuerpo de solicitud con JacksonTester

```java
@Autowired
private JacksonTester<OrderRequest> json;

@Test
void shouldCreateOrder() {
  OrderRequest request = new OrderRequest("Laptop", 2);

  assertThat(mvc.post().uri("/orders")
    .contentType(MediaType.APPLICATION_JSON)
    .content(json.write(request).getJson()))
    .hasStatus(HttpStatus.CREATED);
}
```

## Respuestas de error

```java
@Test
void shouldReturnValidationErrors() {
  given(orderService.findById(999L))
    .willThrow(new OrderNotFoundException(999L));

  assertThat(mvc.get().uri("/orders/999"))
    .hasStatus(HttpStatus.NOT_FOUND)
    .bodyJson()
    .convertTo(ErrorResponse.class)
    .satisfies(error -> {
      assertThat(error.getMessage()).isEqualTo("Order 999 not found");
      assertThat(error.getCode()).isEqualTo("ORDER_NOT_FOUND");
    });
}
```

## Pruebas de errores de validación

```java
@Test
void shouldRejectInvalidOrder() {
  OrderRequest invalidRequest = new OrderRequest("", -1);

  assertThat(mvc.post().uri("/orders")
    .contentType(MediaType.APPLICATION_JSON)
    .content(json.write(invalidRequest).getJson()))
    .hasStatus(HttpStatus.BAD_REQUEST)
    .bodyJson()
    .convertTo(ValidationErrorResponse.class)
    .satisfies(errors -> {
      assertThat(errors.getFieldErrors()).hasSize(2);
      assertThat(errors.getFieldErrors())
        .extracting("field")
        .contains("product", "quantity");
    });
}
```

## Comparación: MockMvcTester frente a MockMvc clásico

| Característica | MockMvcTester | MockMvc clásico |
| ------- | ------------- | --------------- |
| Estilo | AssertJ fluido | Comparadores MockMvc |
| Legibilidad | Alta | Media |
| Seguridad de tipos | Mayor | Menor |
| Compatibilidad con IDE | Excelente | Buena |
| Conversión de objetos | Nativa | Manual |

## Migración desde MockMvc clásico

### Antes (clásico)

```java
mvc.perform(get("/orders/1"))
  .andExpect(status().isOk())
  .andExpect(jsonPath("$.status").value("PENDING"))
  .andExpect(jsonPath("$.totalToPay").value(99.99));
```

### Después (Tester con conversión de objetos)

```java
assertThat(mvc.get().uri("/orders/1"))
  .hasStatus(HttpStatus.OK)
  .bodyJson()
  .convertTo(OrderResponse.class)
  .satisfies(response -> {
    assertThat(response.getStatus()).isEqualTo("PENDING");
    assertThat(response.getTotalToPay()).isEqualTo(new BigDecimal("99.99"));
  });
```

## Puntos clave

1. **Prefiere `convertTo()` a `extractingPath()`**: seguridad de tipos y facilidad de refactorización
2. **Usa `satisfies()` para varias aserciones**: mantiene las pruebas legibles
3. **Importa estáticamente `org.assertj.core.api.Assertions.assertThat`**
4. **Funciona con genéricos mediante `TypeReference`**: para respuestas `List<T>`
5. **Facilita la refactorización desde el IDE**: al renombrar campos, el IDE actualiza las pruebas
