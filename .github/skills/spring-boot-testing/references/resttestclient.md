# RestTestClient

Pruebas modernas de clientes REST con Spring Boot 4+ (reemplaza a TestRestTemplate).

## Descripción general

RestTestClient es la alternativa moderna a TestRestTemplate en Spring Boot 4.0+. Proporciona una API fluida y reactiva para probar puntos de conexión REST.

## Configuración

### Dependencia (Spring Boot 4+)

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-restclient-test</artifactId>
  <scope>test</scope>
</dependency>
```

### Configuración básica

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureRestTestClient
class OrderIntegrationTest {

  @Autowired
  private RestTestClient restClient;
}
```

## Métodos HTTP

### Solicitud GET

```java
@Test
void shouldGetOrder() {
  restClient
    .get()
    .uri("/orders/1")
    .exchange()
    .expectStatus()
    .isOk()
    .expectBody(Order.class)
    .value(order -> {
      assertThat(order.getId()).isEqualTo(1L);
      assertThat(order.getStatus()).isEqualTo("PENDING");
    });
}
```

### Solicitud POST

```java
@Test
void shouldCreateOrder() {
  OrderRequest request = new OrderRequest("Laptop", 2);

  restClient
    .post()
    .uri("/orders")
    .contentType(MediaType.APPLICATION_JSON)
    .body(request)
    .exchange()
    .expectStatus()
    .isCreated()
    .expectHeader()
    .location("/orders/1")
    .expectBody(Long.class)
    .isEqualTo(1L);
}
```

### Solicitud PUT

```java
@Test
void shouldUpdateOrder() {
  restClient
    .put()
    .uri("/orders/1")
    .body(new OrderUpdate("COMPLETED"))
    .exchange()
    .expectStatus()
    .isOk();
}
```

### Solicitud DELETE

```java
@Test
void shouldDeleteOrder() {
  restClient
    .delete()
    .uri("/orders/1")
    .exchange()
    .expectStatus()
    .isNoContent();
}
```

## Aserciones de respuesta

### Códigos de estado

```java
restClient
  .get()
  .uri("/orders/1")
  .exchange()
  .expectStatus()
  .isOk()           // 200
  .isCreated()      // 201
  .isNoContent()    // 204
  .isBadRequest()   // 400
  .isNotFound()     // 404
  .is5xxServerError() // 5xx
  .isEqualTo(200);  // Código concreto
```

### Encabezados de respuesta

```java
restClient
  .post()
  .uri("/orders")
  .exchange()
  .expectHeader()
  .location("/orders/1")
  .contentType(MediaType.APPLICATION_JSON)
  .exists("X-Request-Id")
  .valueEquals("X-Api-Version", "v1");
```

### Aserciones sobre el cuerpo

```java
restClient
  .get()
  .uri("/orders/1")
  .exchange()
  .expectBody(Order.class)
  .value(order -> assertThat(order.getId()).isEqualTo(1L))
  .returnResult();
```

### JSON Path

```java
restClient
  .get()
  .uri("/orders")
  .exchange()
  .expectBody()
  .jsonPath("$.content[0].id").isEqualTo(1)
  .jsonPath("$.content[0].status").isEqualTo("PENDING")
  .jsonPath("$.totalElements").isNumber();
```

## Configuración de solicitudes

### Encabezados de solicitud

```java
restClient
  .get()
  .uri("/orders/1")
  .header("Authorization", "Bearer token")
  .header("X-Api-Key", "secret")
  .exchange();
```

### Parámetros de consulta

```java
restClient
  .get()
  .uri(uriBuilder -> uriBuilder
    .path("/orders")
    .queryParam("status", "PENDING")
    .queryParam("page", 0)
    .queryParam("size", 10)
    .build())
  .exchange();
```

### Variables de ruta

```java
restClient
  .get()
  .uri("/orders/{id}", 1L)
  .exchange();
```

## Con MockMvc

RestTestClient también puede funcionar con MockMvc (sin iniciar un servidor):

```java
@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureRestTestClient
class OrderMockMvcTest {

  @Autowired
  private RestTestClient restClient;

  @Test
  void shouldWorkWithMockMvc() {
    // Usa MockMvc internamente, sin iniciar un servidor
    restClient
      .get()
      .uri("/orders/1")
      .exchange()
      .expectStatus()
      .isOk();
  }
}
```

## Comparación: RestTestClient frente a TestRestTemplate

| Característica | RestTestClient | TestRestTemplate |
| ------- | -------------- | ---------------- |
| Estilo | Fluido/reactivo | Imperativo |
| Spring Boot | 4.0+ | Todas las versiones (obsoleto en 4) |
| Aserciones | Integradas | Manuales |
| Compatibilidad con MockMvc | Sí | No |
| Asincronía | Nativa | Requiere gestión adicional |

## Migración desde TestRestTemplate

### Antes (obsoleto)

```java
@Autowired
private TestRestTemplate restTemplate;

@Test
void shouldGetOrder() {
  ResponseEntity<Order> response = restTemplate
    .getForEntity("/orders/1", Order.class);

  assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
  assertThat(response.getBody().getId()).isEqualTo(1L);
}
```

### Después (RestTestClient)

```java
@Autowired
private RestTestClient restClient;

@Test
void shouldGetOrder() {
  restClient
    .get()
    .uri("/orders/1")
    .exchange()
    .expectStatus()
    .isOk()
    .expectBody(Order.class)
    .value(order -> assertThat(order.getId()).isEqualTo(1L));
}
```

## Buenas prácticas

1. Úsalo con @SpringBootTest(WebEnvironment.RANDOM_PORT) para HTTP real
2. Úsalo con @AutoConfigureMockMvc para pruebas más rápidas sin servidor
3. Aprovecha las aserciones fluidas para mejorar la legibilidad
4. Prueba tanto los escenarios correctos como los de error
5. Verifica los encabezados de seguridad y versionado de API
