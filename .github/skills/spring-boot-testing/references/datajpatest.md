# @DataJpaTest

Pruebas de repositorios JPA con un segmento aislado de la capa de datos.

## Estructura básica

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class OrderRepositoryTest {

  @Container
  @ServiceConnection
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private TestEntityManager entityManager;
}
```

## Qué se carga

- Beans de repositorio
- EntityManager / TestEntityManager
- DataSource
- Gestor de transacciones
- Sin capa web, servicios ni controladores

## Pruebas de consultas personalizadas

```java
@Test
void shouldFindOrdersByStatus() {
  // Dado: usar var para un código más claro
  var pending = new Order("PENDING");
  var completed = new Order("COMPLETED");
  entityManager.persist(pending);
  entityManager.persist(completed);
  entityManager.flush();

  // Cuando
  var pendingOrders = orderRepository.findByStatus("PENDING");

  // Entonces: usar métodos de colecciones secuenciadas
  assertThat(pendingOrders).hasSize(1);
  assertThat(pendingOrders.getFirst().getStatus()).isEqualTo("PENDING");
}
```

## Pruebas de consultas nativas

```java
@Test
void shouldExecuteNativeQuery() {
  entityManager.persist(new Order("PENDING", BigDecimal.valueOf(100)));
  entityManager.persist(new Order("PENDING", BigDecimal.valueOf(200)));
  entityManager.flush();

  var total = orderRepository.calculatePendingTotal();

  assertThat(total).isEqualTo(new BigDecimal("300.00"));
}
```

## Pruebas de paginación

```java
@Test
void shouldReturnPagedResults() {
  // Insertar 20 pedidos mediante IntStream
  IntStream.range(0, 20).forEach(i -> {
    entityManager.persist(new Order("PENDING"));
  });
  entityManager.flush();

  var page = orderRepository.findByStatus("PENDING", PageRequest.of(0, 10));

  assertThat(page.getContent()).hasSize(10);
  assertThat(page.getTotalElements()).isEqualTo(20);
  assertThat(page.getContent().getFirst().getStatus()).isEqualTo("PENDING");
}
```

## Pruebas de carga diferida

```java
@Test
void shouldLazyLoadOrderItems() {
  var order = new Order("PENDING");
  order.addItem(new OrderItem("Product", 2));
  entityManager.persist(order);
  entityManager.flush();
  entityManager.clear(); // Desvincular del contexto de persistencia

  var found = orderRepository.findById(order.getId());

  assertThat(found).isPresent();
  // Esto activará la carga diferida
  assertThat(found.get().getItems()).hasSize(1);
  assertThat(found.get().getItems().getFirst().getProduct()).isEqualTo("Product");
}
```

## Pruebas de operaciones en cascada

```java
@Test
void shouldCascadeDelete() {
  var order = new Order("PENDING");
  order.addItem(new OrderItem("Product", 2));
  entityManager.persist(order);
  entityManager.flush();

  orderRepository.delete(order);
  entityManager.flush();

  assertThat(entityManager.find(OrderItem.class, order.getItems().getFirst().getId()))
    .isNull();
}
```

## Pruebas de métodos @Query

```java
@Query("SELECT o FROM Order o WHERE o.createdAt > :date AND o.status = :status")
List<Order> findRecentByStatus(@Param("date") LocalDateTime date,
                               @Param("status") String status);

@Test
void shouldFindRecentOrders() {
  var old = new Order("PENDING");
  old.setCreatedAt(LocalDateTime.now().minusDays(10));
  var recent = new Order("PENDING");
  recent.setCreatedAt(LocalDateTime.now().minusHours(1));

  entityManager.persist(old);
  entityManager.persist(recent);
  entityManager.flush();

  var recentOrders = orderRepository.findRecentByStatus(
    LocalDateTime.now().minusDays(1), "PENDING");

  assertThat(recentOrders).hasSize(1);
  assertThat(recentOrders.getFirst().getId()).isEqualTo(recent.getId());
}
```

## Uso de H2 frente a una base de datos real

### H2 (predeterminado; no recomendado para paridad con producción)

```java
@DataJpaTest // Usa H2 integrado de forma predeterminada
class OrderRepositoryH2Test {
  // Rápido, pero puede pasar por alto problemas específicos de la base de datos
}
```

### Testcontainers (recomendado)

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class OrderRepositoryPostgresTest {
  @Container
  @ServiceConnection
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");
}
```

## Comportamiento de transacciones

Las pruebas son @Transactional de forma predeterminada y se revierten después de cada ejecución.

```java
@Test
@Rollback(false) // No revertir (rara vez es necesario)
void shouldPersistData() {
  orderRepository.save(new Order("PENDING"));
  // Los datos permanecerán en la base de datos después de la prueba
}
```

## Puntos clave

1. Usa TestEntityManager para preparar los datos
2. Ejecuta siempre flush() después de persist() para activar SQL
3. Ejecuta clear() en el gestor de entidades para probar la carga diferida
4. Usa una base de datos real (Testcontainers) para obtener resultados precisos
5. Prueba tanto los casos correctos como los fallidos
6. Aprovecha la palabra clave var de Java 21 para declaraciones de variables más claras
7. Usa métodos de colecciones secuenciadas (getFirst(), getLast(), reversed())
