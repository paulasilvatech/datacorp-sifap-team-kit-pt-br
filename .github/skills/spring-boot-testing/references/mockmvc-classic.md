# MockMvc clásico

API clásica de `MockMvc` para pruebas de controladores Spring MVC: el enfoque que usa el kit en **Spring Boot 3.3**.

## Cuándo usar esta referencia

- El proyecto usa Spring Boot 3.3 (el stack del kit) o cualquier versión < 3.4, donde `MockMvcTester` no está disponible
- Las pruebas existentes usan `mvc.perform(...)` y necesitas mantenerlas o ampliarlas
- Necesitas migrar pruebas clásicas de MockMvc a `MockMvcTester` (consulta la sección de migración más abajo)
- La persona pregunta explícitamente por `ResultActions`, `andExpect()` o aserciones web de estilo Hamcrest

`MockMvcTester` (de estilo AssertJ) requiere **Spring Boot 3.4+** y queda fuera del alcance del kit; consulta [mockmvc-tester.md](mockmvc-tester.md) solo si el proyecto se actualiza más allá de 3.3.

## Configuración

```java
@WebMvcTest(OrderController.class)
class OrderControllerTest {

  @Autowired
  private MockMvc mvc;

  @MockBean
  private OrderService orderService;
}
```

## Solicitud GET básica

```java
@Test
void shouldReturnOrder() throws Exception {
  given(orderService.findById(1L)).willReturn(new Order(1L, "PENDING", 99.99));

  mvc.perform(get("/orders/1"))
    .andExpect(status().isOk())
    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
    .andExpect(jsonPath("$.id").value(1))
    .andExpect(jsonPath("$.status").value("PENDING"))
    .andExpect(jsonPath("$.totalToPay").value(99.99));
}
```

## POST con cuerpo de solicitud

```java
@Test
void shouldCreateOrder() throws Exception {
  given(orderService.create(any(OrderRequest.class))).willReturn(1L);

  mvc.perform(post("/orders")
      .contentType(MediaType.APPLICATION_JSON)
      .content("{\"product\": \"Laptop\", \"quantity\": 2}"))
    .andExpect(status().isCreated())
    .andExpect(header().string("Location", "/orders/1"));
}
```

## Solicitud PUT

```java
@Test
void shouldUpdateOrder() throws Exception {
  mvc.perform(put("/orders/1")
      .contentType(MediaType.APPLICATION_JSON)
      .content("{\"status\": \"COMPLETED\"}"))
    .andExpect(status().isOk());
}
```

## Solicitud DELETE

```java
@Test
void shouldDeleteOrder() throws Exception {
  mvc.perform(delete("/orders/1"))
    .andExpect(status().isNoContent());
}
```

## Comparadores de estado

```java
.andExpect(status().isOk())           // 200
.andExpect(status().isCreated())      // 201
.andExpect(status().isNoContent())    // 204
.andExpect(status().isBadRequest())   // 400
.andExpect(status().isUnauthorized()) // 401
.andExpect(status().isForbidden())    // 403
.andExpect(status().isNotFound())     // 404
.andExpect(status().is(422))          // código arbitrario
```

## Aserciones de JSON Path

```java
// Valor exacto
.andExpect(jsonPath("$.status").value("PENDING"))

// Existencia
.andExpect(jsonPath("$.id").exists())
.andExpect(jsonPath("$.deletedAt").doesNotExist())

// Tamaño de la matriz
.andExpect(jsonPath("$.items").isArray())
.andExpect(jsonPath("$.items", hasSize(3)))

// Campo anidado
.andExpect(jsonPath("$.customer.name").value("John Doe"))
.andExpect(jsonPath("$.customer.address.city").value("Berlin"))

// Con comparadores Hamcrest
.andExpect(jsonPath("$.total", greaterThan(0.0)))
.andExpect(jsonPath("$.description", containsString("order")))
```

## Aserciones de contenido

```java
.andExpect(content().contentType(MediaType.APPLICATION_JSON))
.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
.andExpect(content().string(containsString("PENDING")))
.andExpect(content().json("{\"status\":\"PENDING\"}"))
```

## Aserciones de encabezados

```java
.andExpect(header().string("Location", "/orders/1"))
.andExpect(header().string("Content-Type", containsString("application/json")))
.andExpect(header().exists("X-Request-Id"))
.andExpect(header().doesNotExist("X-Deprecated"))
```

## Parámetros y encabezados de solicitud

```java
// Parámetros de consulta
mvc.perform(get("/orders").param("status", "PENDING").param("page", "0"))
  .andExpect(status().isOk());

// Variables de ruta
mvc.perform(get("/orders/{id}", 1L))
  .andExpect(status().isOk());

// Encabezados de solicitud
mvc.perform(get("/orders/1").header("X-Api-Key", "secret"))
  .andExpect(status().isOk());
```

## Captura de la respuesta

```java
@Test
void shouldReturnCreatedId() throws Exception {
  given(orderService.create(any())).willReturn(42L);

  MvcResult result = mvc.perform(post("/orders")
      .contentType(MediaType.APPLICATION_JSON)
      .content("{\"product\": \"Laptop\", \"quantity\": 1}"))
    .andExpect(status().isCreated())
    .andReturn();

  String location = result.getResponse().getHeader("Location");
  assertThat(location).isEqualTo("/orders/42");
}
```

## Encadenamiento con andDo

```java
mvc.perform(get("/orders/1"))
  .andDo(print())              // imprime la solicitud/respuesta en la consola (depuración)
  .andExpect(status().isOk());
```

## Importaciones estáticas

```java
import org.springframework.boot.test.mock.mockito.MockBean;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.hamcrest.Matchers.*;
```

## Migración a MockMvcTester

| MockMvc clásico | MockMvcTester (recomendado) |
| --- | --- |
| `@Autowired MockMvc mvc` | `@Autowired MockMvcTester mvc` |
| `mvc.perform(get("/orders/1"))` | `mvc.get().uri("/orders/1")` |
| `.andExpect(status().isOk())` | `.hasStatusOk()` |
| `.andExpect(jsonPath("$.status").value("X"))` | `.bodyJson().convertTo(T.class)` + AssertJ |
| `throws Exception` en cada método | Sin excepción comprobada |
| Comparadores Hamcrest | Aserciones fluidas de AssertJ |

Consulta [mockmvc-tester.md](mockmvc-tester.md) para conocer la API moderna completa.

## Puntos clave

1. **Cada método de prueba debe declarar `throws Exception`**: `perform()` lanza excepciones comprobadas
2. **Usa `andDo(print())` durante la depuración**: elimínalo antes de hacer commit
3. **Prefiere `jsonPath()` a `content().string()`**: aserciones más precisas por campo
4. **Las importaciones estáticas son necesarias**: el IDE puede añadirlas automáticamente
5. **Migra a MockMvcTester** al actualizar a Spring Boot 3.2+ para mejorar la legibilidad
