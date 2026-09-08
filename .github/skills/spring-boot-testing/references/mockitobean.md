# @MockitoBean

Simulación de dependencias en pruebas Spring Boot (reemplaza a @MockBean, obsoleto en Spring Boot 4+).

## Descripción general

`@MockitoBean` reemplaza a la anotación obsoleta `@MockBean` en Spring Boot 4.0+. Crea una simulación de Mockito y la registra en el contexto de Spring, reemplazando cualquier bean existente del mismo tipo.

## Uso básico

```java
@WebMvcTest(OrderController.class)
class OrderControllerTest {

  @MockitoBean
  private OrderService orderService;

  @MockitoBean
  private UserService userService;
}
```

## Segmentos de prueba compatibles

- `@WebMvcTest`: simular dependencias de servicios y repositorios
- `@WebFluxTest`: simular dependencias de servicios reactivos
- `@SpringBootTest`: reemplazar beans reales por simulaciones

## Configuración de respuestas de métodos

### Stub básico

```java
@Test
void shouldReturnOrder() {
  Order order = new Order(1L, "PENDING");
  given(orderService.findById(1L)).willReturn(order);

  // Código de prueba
}
```

### Varios valores de retorno

```java
given(orderService.findById(anyLong()))
  .willReturn(new Order(1L, "PENDING"))
  .willReturn(new Order(2L, "COMPLETED"));
```

### Lanzamiento de excepciones

```java
given(orderService.findById(999L))
  .willThrow(new OrderNotFoundException(999L));
```

### Coincidencia de argumentos

```java
given(orderService.create(argThat(req -> req.getQuantity() > 0)))
  .willReturn(1L);

given(orderService.findByStatus(eq("PENDING")))
  .willReturn(List.of(new Order()));
```

## Verificación de interacciones

### Comprobar que se invocó un método

```java
verify(orderService).findById(1L);
```

### Comprobar que nunca se invocó

```java
verify(orderService, never()).delete(any());
```

### Comprobar el número de invocaciones

```java
verify(orderService, times(2)).findById(anyLong());
verify(orderService, atLeastOnce()).findByStatus(anyString());
```

### Comprobar el orden

```java
InOrder inOrder = inOrder(orderService, userService);
inOrder.verify(orderService).findById(1L);
inOrder.verify(userService).getUser(any());
```

## Restablecer simulaciones

Las simulaciones se restablecen automáticamente entre pruebas. Para restablecerlas durante una prueba:

```java
Mockito.reset(orderService);
```

## @MockitoSpyBean para simulación parcial

Usa `@MockitoSpyBean` para envolver un bean real con Mockito.

```java
@SpringBootTest
class OrderServiceIntegrationTest {

  @MockitoSpyBean
  private PaymentGatewayClient paymentClient;

  @Test
  void shouldProcessOrder() {
    doReturn(true).when(paymentClient).processPayment(any());

    // Probar con el servicio real, pero con el cliente de pagos simulado
  }
}
```

## @TestBean para beans de prueba personalizados

Registra una instancia de bean personalizada en el contexto de prueba:

```java
@SpringBootTest
class OrderServiceTest {

  @TestBean
  private PaymentGatewayClient paymentClient() {
    return new FakePaymentClient();
  }
}
```

## Ámbitos: singleton frente a prototype

Spring Framework 7+ (Spring Boot 4+) permite simular beans que no son singleton:

```java
@Component
@Scope("prototype")
public class OrderProcessor {
  public String process() { return "real"; }
}

@SpringBootTest
class OrderServiceTest {
  @MockitoBean
  private OrderProcessor orderProcessor;

  @Test
  void shouldWorkWithPrototype() {
    given(orderProcessor.process()).willReturn("mocked");
    // Código de prueba
  }
}
```

## Patrones habituales

### Simular un repositorio en una prueba de servicio

```java
@SpringBootTest
class OrderServiceTest {
  @MockitoBean
  private OrderRepository orderRepository;

  @Autowired
  private OrderService orderService;

  @Test
  void shouldCreateOrder() {
    given(orderRepository.save(any())).willReturn(new Order(1L));

    Long id = orderService.createOrder(new OrderRequest());

    assertThat(id).isEqualTo(1L);
    verify(orderRepository).save(any(Order.class));
  }
}
```

### Varias simulaciones del mismo tipo

Usa los nombres de los beans:

```java
@MockitoBean(name = "primaryDataSource")
private DataSource primaryDataSource;

@MockitoBean(name = "secondaryDataSource")
private DataSource secondaryDataSource;
```

## Migración desde @MockBean

### Antes (obsoleto)

```java
@MockBean
private OrderService orderService;
```

### Después (Spring Boot 4+)

```java
@MockitoBean
private OrderService orderService;
```

## Diferencias principales respecto de @Mock de Mockito

| Funcionalidad | @MockitoBean | @Mock |
| ------- | ------------ | ----- |
| Integración con el contexto | Sí | No |
| Ciclo de vida de Spring | Participa | Ninguno |
| Funciona con @Autowired | Sí | No |
| Compatibilidad con pruebas segmentadas | Sí | Limitada |

## Buenas prácticas

1. Usa `@MockitoBean` solo cuando intervenga el contexto de Spring
2. Para pruebas unitarias puras, usa `@Mock` o `Mockito.mock()` de Mockito
3. Verifica siempre las interacciones que tengan efectos secundarios
4. No verifiques consultas sencillas (basta con configurar sus respuestas)
5. Restablece las simulaciones si la prueba modifica un estado simulado compartido
