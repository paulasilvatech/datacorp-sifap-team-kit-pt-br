# Testcontainers JDBC

Pruebas de repositorios JPA con bases de datos reales mediante Testcontainers.

## Descripción general

Testcontainers proporciona instancias reales de bases de datos en contenedores Docker para pruebas de integración. Es más fiable que H2 para mantener la paridad con producción.

## Configuración de PostgreSQL

### Dependencias

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-testcontainers</artifactId>
  <scope>test</scope>
</dependency>
<dependency>
  <groupId>org.testcontainers</groupId>
  <artifactId>testcontainers-postgresql</artifactId>
  <scope>test</scope>
</dependency>
```

### Prueba básica

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class OrderRepositoryPostgresTest {

  @Container
  @ServiceConnection
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private TestEntityManager entityManager;
}
```

## Configuración de MySQL

```xml
<dependency>
  <groupId>org.testcontainers</groupId>
  <artifactId>testcontainers-mysql</artifactId>
  <scope>test</scope>
</dependency>
```

```java
@Container
@ServiceConnection
static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.4");
```

## Varias bases de datos

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class MultiDatabaseTest {

  @Container
  @ServiceConnection(name = "primary")
  static PostgreSQLContainer<?> primaryDb = new PostgreSQLContainer<>("postgres:16");

  @Container
  @ServiceConnection(name = "analytics")
  static PostgreSQLContainer<?> analyticsDb = new PostgreSQLContainer<>("postgres:16");
}
```

## Reutilización de contenedores (optimización de velocidad)

Añade a `~/.testcontainers.properties`:

```properties
testcontainers.reuse.enable=true
```

Después habilita la reutilización en el código:

```java
@Container
@ServiceConnection
static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
  .withReuse(true);
```

## Inicialización de la base de datos

### Con scripts SQL

```java
@Container
@ServiceConnection
static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
  .withInitScript("schema.sql");
```

### Con Flyway

```java
@SpringBootTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class MigrationTest {

  @Container
  @ServiceConnection
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

  @Autowired
  private Flyway flyway;

  @Test
  void shouldApplyMigrations() {
    flyway.migrate();
    // Código de prueba
  }
}
```

## Configuración avanzada

### Base de datos o esquema personalizados

```java
@Container
@ServiceConnection
static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
  .withDatabaseName("testdb")
  .withUsername("testuser")
  .withPassword("testpass")
  .withInitScript("init-schema.sql");
```

### Estrategias de espera

```java
@Container
static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
  .waitingFor(Wait.forLogMessage(".*database system is ready.*", 1));
```

## Ejemplo de prueba

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

  @Test
  void shouldFindOrdersByStatus() {
    // Dado
    entityManager.persist(new Order("PENDING"));
    entityManager.persist(new Order("COMPLETED"));
    entityManager.flush();

    // Cuando
    List<Order> pending = orderRepository.findByStatus("PENDING");

    // Entonces
    assertThat(pending).hasSize(1);
    assertThat(pending.get(0).getStatus()).isEqualTo("PENDING");
  }

  @Test
  void shouldSupportPostgresSpecificFeatures() {
    // Se pueden usar funcionalidades específicas de Postgres, como:
    // - Columnas JSONB
    // - Tipos de matriz
    // - Búsqueda de texto completo
  }
}
```

## Alternativa con @DynamicPropertySource

Si no se usa @ServiceConnection:

```java
@SpringBootTest
@Testcontainers
class OrderServiceTest {

  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

  @DynamicPropertySource
  static void configureProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", postgres::getJdbcUrl);
    registry.add("spring.datasource.username", postgres::getUsername);
    registry.add("spring.datasource.password", postgres::getPassword);
  }
}
```

## Bases de datos compatibles

| Base de datos | Clase de contenedor | Artefacto Maven |
| -------- | --------------- | -------------- |
| PostgreSQL | PostgreSQLContainer | testcontainers-postgresql |
| MySQL | MySQLContainer | testcontainers-mysql |
| MariaDB | MariaDBContainer | testcontainers-mariadb |
| SQL Server | MSSQLServerContainer | testcontainers-mssqlserver |
| Oracle | OracleContainer | testcontainers-oracle-free |
| MongoDB | MongoDBContainer | testcontainers-mongodb |

## Buenas prácticas

1. Usa @ServiceConnection cuando sea posible (Spring Boot 3.1+)
2. Habilita la reutilización de contenedores para acelerar las compilaciones locales
3. Usa versiones concretas (postgres:16), no latest
4. Mantén la configuración del contenedor en un campo estático
5. Usa @DataJpaTest con AutoConfigureTestDatabase.Replace.NONE
