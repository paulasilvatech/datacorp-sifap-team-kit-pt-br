# Caché de contextos

Optimiza el rendimiento de la suite de pruebas de Spring Boot mediante la caché de contextos.

## Cómo funciona la caché de contextos

TestContext Framework de Spring almacena en caché los contextos de aplicación según su "clave" de configuración. Las pruebas con configuraciones idénticas reutilizan el mismo contexto.

### Qué afecta a la clave de caché

- @ContextConfiguration
- @TestPropertySource
- @ActiveProfiles
- @WebAppConfiguration
- Definiciones de @MockitoBean
- Importaciones de @TestConfiguration

## Ejemplos de claves de caché

### Misma clave (contexto reutilizado)

```java
@WebMvcTest(OrderController.class)
class OrderControllerTest1 {
  @MockitoBean private OrderService orderService;
}

@WebMvcTest(OrderController.class)
class OrderControllerTest2 {
  @MockitoBean private OrderService orderService;
}
// Se reutiliza el mismo contexto
```

### Clave diferente (contexto nuevo)

```java
@WebMvcTest(OrderController.class)
@ActiveProfiles("test")
class OrderControllerTest1 { }

@WebMvcTest(OrderController.class)
@ActiveProfiles("integration")
class OrderControllerTest2 { }
// Se cargan contextos diferentes
```

## Consultar las estadísticas de caché

### Spring Boot Actuator

```yaml
management:
  endpoints:
    web:
      exposure:
        include: metrics
```

Acceso: `GET /actuator/metrics/spring.test.context.cache`

### Registros de depuración

```properties
logging.level.org.springframework.test.context.cache=DEBUG
```

## Optimizar la tasa de aciertos de caché

### Agrupar las pruebas por configuración

```
 tests/
   unit/           # Sin contexto
   web/            # @WebMvcTest
   repository/     # @DataJpaTest
   integration/    # @SpringBootTest
```

### Minimizar las variaciones de @TestPropertySource

**Incorrecto (varios contextos):**

```java
@TestPropertySource(properties = "app.feature-x=true")
class FeatureXTest { }

@TestPropertySource(properties = "app.feature-y=true")
class FeatureYTest { }
```

**Mejor (agrupado):**

```java
@TestPropertySource(properties = {"app.feature-x=true", "app.feature-y=true"})
class FeaturesTest { }
```

### Usar @DirtiesContext con moderación

Solo cuando cambie realmente el estado del contexto:

```java
@Test
@DirtiesContext // Fuerza la reconstrucción del contexto después de la prueba
void testThatModifiesBeanDefinitions() { }
```

## Buenas prácticas

1. **Agrupa por configuración**: mantén juntas las pruebas con la misma configuración
2. **Limita las variaciones de propiedades**: prefiere perfiles a propiedades individuales
3. **Evita @DirtiesContext**: prefiere limpiar los datos de prueba
4. **Usa segmentos acotados**: @WebMvcTest frente a @SpringBootTest
5. **Supervisa los aciertos de caché**: habilita ocasionalmente los registros de depuración
