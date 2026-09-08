# Migración a Spring Boot 4.0

Cambios principales en las pruebas al migrar de Spring Boot 3.x a 4.0.

## Cambios en las dependencias

### Starters de pruebas modulares

Spring Boot 4.0 introduce starters de pruebas modulares:

**Antes (3.x):**

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
</dependency>
```

**Después (4.0): pruebas WebMvc:**

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-webmvc-test</artifactId>
  <scope>test</scope>
</dependency>
```

**Después (4.0): pruebas del cliente REST:**

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-restclient-test</artifactId>
  <scope>test</scope>
</dependency>
```

## Migración de anotaciones

### @MockBean → @MockitoBean

**Obsoleto (3.x):**

```java
@MockBean
private OrderService orderService;
```

**Nuevo (4.0):**

```java
@MockitoBean
private OrderService orderService;
```

### @SpyBean → @MockitoSpyBean

**Obsoleto (3.x):**

```java
@SpyBean
private PaymentGatewayClient paymentClient;
```

**Nuevo (4.0):**

```java
@MockitoSpyBean
private PaymentGatewayClient paymentClient;
```

## Nuevas funcionalidades de pruebas

### RestTestClient

Reemplaza a TestRestTemplate (obsoleto):

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureRestTestClient
class OrderIntegrationTest {

  @Autowired
  private RestTestClient restClient;

  @Test
  void shouldCreateOrder() {
    restClient
      .post()
      .uri("/orders")
      .body(new OrderRequest("Product", 2))
      .exchange()
      .expectStatus()
      .isCreated()
      .expectHeader()
      .location("/orders/1");
  }
}
```

## Compatibilidad con JUnit 6

Spring Boot 4.0 usa JUnit 6 de forma predeterminada:

- JUnit 4 está obsoleto (usa JUnit Vintage temporalmente)
- Todas las funcionalidades de JUnit 5 siguen funcionando
- Elimina las dependencias de JUnit 4 para una migración limpia

## Testcontainers 2.0

La nomenclatura de los módulos cambió:

**Antes (1.x):**

```xml
<artifactId>postgresql</artifactId>
```

**Después (2.0):**

```xml
<artifactId>testcontainers-postgresql</artifactId>
```

## Simulación de beans que no son singleton

Spring Framework 7 permite simular beans con ámbito prototype:

```java
@Component
@Scope("prototype")
public class OrderProcessor { }

@SpringBootTest
class OrderServiceTest {
  @MockitoBean
  private OrderProcessor orderProcessor; // Ahora funciona
}
```

## Cambios de contexto de SpringExtension

El contexto de la extensión ahora tiene, de forma predeterminada, el ámbito del método de prueba.

Si las pruebas fallan con clases @Nested:

```java
@SpringExtensionConfig(useTestClassScopedExtensionContext = true)
@SpringBootTest
class OrderTest {
  // Usar el comportamiento anterior
}
```

## Lista de verificación de la migración

- [ ] Sustituir @MockBean por @MockitoBean
- [ ] Sustituir @SpyBean por @MockitoSpyBean
- [ ] Actualizar las dependencias de Testcontainers a la nomenclatura de 2.0
- [ ] Añadir starters de pruebas modulares según sea necesario
- [ ] Migrar TestRestTemplate a RestTestClient
- [ ] Eliminar las dependencias de JUnit 4
- [ ] Actualizar las implementaciones personalizadas de TestExecutionListener
- [ ] Probar el comportamiento de las clases @Nested

## Compatibilidad con versiones anteriores

Usa starters "classic" para una migración gradual:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test-classic</artifactId>
  <scope>test</scope>
</dependency>
```

Esto proporciona el comportamiento anterior mientras migras de forma incremental.
