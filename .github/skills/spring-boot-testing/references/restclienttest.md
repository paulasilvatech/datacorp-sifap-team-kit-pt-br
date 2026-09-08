# @RestClientTest

Pruebas aisladas de clientes REST con MockRestServiceServer.

## Descripción general

`@RestClientTest` configura automáticamente:

- RestTemplate/RestClient con soporte de servidor simulado
- Jackson ObjectMapper
- MockRestServiceServer

## Configuración básica

```java
@RestClientTest(WeatherService.class)
class WeatherServiceTest {

  @Autowired
  private WeatherService weatherService;

  @Autowired
  private MockRestServiceServer server;
}
```

## Pruebas de RestTemplate

```java
@RestClientTest(WeatherService.class)
class WeatherServiceTest {

  @Autowired
  private WeatherService weatherService;

  @Autowired
  private MockRestServiceServer server;

  @Test
  void shouldFetchWeather() {
    // Dado
    server.expect(requestTo("https://api.weather.com/v1/current"))
      .andExpect(method(HttpMethod.GET))
      .andExpect(queryParam("city", "Berlin"))
      .andRespond(withSuccess()
        .contentType(MediaType.APPLICATION_JSON)
        .body("{\"temperature\": 22, \"condition\": \"Sunny\"}"));

    // Cuando
    Weather weather = weatherService.getCurrentWeather("Berlin");

    // Entonces
    assertThat(weather.getTemperature()).isEqualTo(22);
    assertThat(weather.getCondition()).isEqualTo("Sunny");
  }
}
```

## Pruebas de RestClient (Spring 6.1+)

```java
@RestClientTest(WeatherService.class)
class WeatherServiceTest {

  @Autowired
  private WeatherService weatherService;

  @Autowired
  private MockRestServiceServer server;

  @Test
  void shouldFetchWeatherWithRestClient() {
    server.expect(requestTo("https://api.weather.com/v1/current"))
      .andRespond(withSuccess()
        .body("{\"temperature\": 22}"));

    Weather weather = weatherService.getCurrentWeather("Berlin");

    assertThat(weather.getTemperature()).isEqualTo(22);
  }
}
```

## Coincidencia de solicitudes

### URL exacta

```java
server.expect(requestTo("https://api.example.com/users/1"))
  .andRespond(withSuccess());
```

### Patrón de URL

```java
server.expect(requestTo(matchesPattern("https://api.example.com/users/\\d+")))
  .andRespond(withSuccess());
```

### Método HTTP

```java
server.expect(ExpectedCount.once(),
  requestTo("https://api.example.com/users"))
  .andExpect(method(HttpMethod.POST))
  .andRespond(withCreatedEntity(URI.create("/users/1")));
```

### Cuerpo de solicitud

```java
server.expect(requestTo("https://api.example.com/users"))
  .andExpect(content().contentType(MediaType.APPLICATION_JSON))
  .andExpect(content().json("{\"name\": \"John\"}"))
  .andRespond(withSuccess());
```

### Encabezados

```java
server.expect(requestTo("https://api.example.com/users"))
  .andExpect(header("Authorization", "Bearer token123"))
  .andExpect(header("X-Api-Key", "secret"))
  .andRespond(withSuccess());
```

## Tipos de respuesta

### Respuesta correcta con cuerpo

```java
server.expect(requestTo("/users/1"))
  .andRespond(withSuccess()
    .contentType(MediaType.APPLICATION_JSON)
    .body("{\"id\": 1, \"name\": \"John\"}"));
```

### Respuesta correcta desde un recurso

```java
server.expect(requestTo("/users/1"))
  .andRespond(withSuccess()
    .body(new ClassPathResource("user-response.json")));
```

### Creado

```java
server.expect(requestTo("/users"))
  .andExpect(method(HttpMethod.POST))
  .andRespond(withCreatedEntity(URI.create("/users/1")));
```

### Respuesta de error

```java
server.expect(requestTo("/users/999"))
  .andRespond(withResourceNotFound());

server.expect(requestTo("/users"))
  .andRespond(withServerError()
    .body("Internal Server Error"));

server.expect(requestTo("/users"))
  .andRespond(withStatus(HttpStatus.BAD_REQUEST)
    .body("{\"error\": \"Invalid input\"}"));
```

## Verificación de solicitudes

```java
@Test
void shouldCallApi() {
  server.expect(ExpectedCount.once(),
    requestTo("https://api.example.com/data"))
    .andRespond(withSuccess());

  service.fetchData();

  server.verify(); // Verificar que se cumplan todas las expectativas
}
```

## Ignorar solicitudes adicionales

```java
@Test
void shouldHandleMultipleCalls() {
  server.expect(ExpectedCount.manyTimes(),
    requestTo(matchesPattern("/api/.*")))
    .andRespond(withSuccess());

  // Se permiten varias llamadas
  service.callApi();
  service.callApi();
  service.callApi();
}
```

## Restablecer entre pruebas

```java
@BeforeEach
void setUp() {
  server.reset();
}
```

## Pruebas de tiempos de espera

```java
server.expect(requestTo("/slow-endpoint"))
  .andRespond(withSuccess()
    .body("{\"data\": \"test\"}")
    .delay(100, TimeUnit.MILLISECONDS));

// Probar la gestión del tiempo de espera
```

## Buenas prácticas

1. Ejecuta siempre `server.verify()` al final de la prueba
2. Usa archivos de recursos para respuestas JSON grandes
3. Comprueba la coincidencia de un conjunto mínimo de atributos de la solicitud
4. Restablece el servidor en @BeforeEach
5. Prueba las respuestas de error, no solo las correctas
6. Verifica el cuerpo de la solicitud en llamadas POST/PUT
