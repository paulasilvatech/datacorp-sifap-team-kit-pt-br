# @WebMvcTest

Pruebas de controladores Spring MVC mediante pruebas segmentadas y enfocadas.

> [!IMPORTANT]
> Los ejemplos siguientes usan `MockMvcTester` y `@MockitoBean`, que corresponden a **Spring Boot 3.4+** y quedan **fuera del alcance del kit**. En Spring Boot 3.3 del kit, usa `MockMvc` clásico con `mockMvc.perform(...).andExpect(...)` y `@MockBean`; consulta [mockmvc-classic.md](mockmvc-classic.md).

## Estructura básica

```java
@WebMvcTest(OrderController.class)
class OrderControllerTest {

  @Autowired
  private MockMvcTester mvc;

  @MockitoBean
  private OrderService orderService;

  @MockitoBean
  private UserService userService;
}
```

## Qué se carga

- Los controladores especificados
- Infraestructura de Spring MVC (HandlerMapping, HandlerAdapter)
- ObjectMapper de Jackson (para JSON)
- Manejadores de excepciones (@ControllerAdvice)
- Filtros de Spring Security (si están en el classpath)
- Validación (si está en el classpath)

## Pruebas de puntos de conexión GET

```java
@Test
void shouldReturnOrder() {
  var order = new Order(1L, "PENDING", BigDecimal.valueOf(99.99));
  given(orderService.findById(1L)).willReturn(order);

  assertThat(mvc.get().uri("/orders/1"))
    .hasStatusOk()
    .hasContentType(MediaType.APPLICATION_JSON)
    .bodyJson()
    .extractingPath("$.status")
    .isEqualTo("PENDING");
}
```

## Pruebas de POST con cuerpo de solicitud

### Uso de bloques de texto (Java 21)

```java
@Test
void shouldCreateOrder() {
  given(orderService.create(any(OrderRequest.class))).willReturn(1L);

  var json = """
    {
      "product": "Product A",
      "quantity": 2
    }
    """;

  assertThat(mvc.post().uri("/orders")
    .contentType(MediaType.APPLICATION_JSON)
    .content(json))
    .hasStatus(HttpStatus.CREATED)
    .hasHeader("Location", "/orders/1");
}
```

### Uso de records

```java
record OrderRequest(String product, int quantity) {}

@Test
void shouldCreateOrderWithRecord() {
  var request = new OrderRequest("Product A", 2);
  given(orderService.create(any())).willReturn(1L);

  assertThat(mvc.post().uri("/orders")
    .contentType(MediaType.APPLICATION_JSON)
    .content(json.write(request).getJson()))
    .hasStatus(HttpStatus.CREATED);
}
```

## Pruebas de errores de validación

```java
@Test
void shouldRejectInvalidOrder() {
  var invalidJson = """
    {
      "product": "",
      "quantity": -1
    }
    """;

  assertThat(mvc.post().uri("/orders")
    .contentType(MediaType.APPLICATION_JSON)
    .content(invalidJson))
    .hasStatus(HttpStatus.BAD_REQUEST)
    .bodyJson()
    .hasPath("$.errors");
}
```

## Pruebas de parámetros de consulta

```java
@Test
void shouldFilterOrdersByStatus() {
  assertThat(mvc.get().uri("/orders?status=PENDING"))
    .hasStatusOk();

  verify(orderService).findByStatus(OrderStatus.PENDING);
}
```

## Pruebas de variables de ruta

```java
@Test
void shouldCancelOrder() {
  assertThat(mvc.put().uri("/orders/123/cancel"))
    .hasStatusOk();

  verify(orderService).cancel(123L);
}
```

## Pruebas con seguridad

```java
@Test
@WithMockUser(roles = "ADMIN")
void adminShouldDeleteOrder() {
  assertThat(mvc.delete().uri("/orders/1"))
    .hasStatus(HttpStatus.NO_CONTENT);
}

@Test
void anonymousUserShouldBeForbidden() {
  assertThat(mvc.delete().uri("/orders/1"))
    .hasStatus(HttpStatus.UNAUTHORIZED);
}
```

## Varios controladores

```java
@WebMvcTest({OrderController.class, ProductController.class})
class WebLayerTest {
  // Prueba varios controladores en un segmento
}
```

## Exclusión de la configuración automática

```java
@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false) // Omitir los filtros de seguridad
class OrderControllerWithoutSecurityTest {
  // Pruebas sin filtros de seguridad
}
```

## Puntos clave

1. En Spring Boot 3.3, simula colaboradores con `@MockBean` (`@MockitoBean` es el reemplazo en 3.4+)
2. En Spring Boot 3.3, usa `MockMvc` clásico (`perform(...).andExpect(...)`); `MockMvcTester` requiere 3.4+
3. Prueba la semántica HTTP (estado, encabezados, content-type)
4. Verifica las llamadas a métodos de servicio cuando importen sus efectos secundarios
5. No pruebes aquí la lógica de negocio; corresponde a las pruebas unitarias
6. Aprovecha los bloques de texto de Java 21 para cuerpos JSON
