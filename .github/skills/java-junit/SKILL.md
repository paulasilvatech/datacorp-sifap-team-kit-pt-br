---
name: "java-junit"
description: "Buenas prácticas de pruebas unitarias con JUnit 5: estructura (Preparar-Actuar-Comprobar), ciclo de vida, pruebas parametrizadas o basadas en datos, aserciones, aislamiento con Mockito y organización. Úsala para escribir o revisar pruebas unitarias de JUnit 5 sin contexto de Spring para lógica de negocio Java. Para pruebas segmentadas o de integración de Spring Boot (@WebMvcTest, @DataJpaTest, Testcontainers), usa spring-boot-testing."
---
# Buenas prácticas de JUnit 5

Escribe pruebas unitarias enfocadas de JUnit 5 para la lógica de negocio del backend de SIFAP 2.0 (Java 21 + Spring Boot 3.3), tanto convencionales como basadas en datos, con aislamiento mediante Mockito y aserciones AssertJ. Para pruebas segmentadas o de integración de Spring Boot (`@WebMvcTest`, `@DataJpaTest`, Testcontainers), usa la skill [`spring-boot-testing`](../spring-boot-testing/SKILL.md); para el ritmo rojo-verde-refactorizar, consulta [`tdd-workflow`](../tdd-workflow/SKILL.md).

## Cuándo invocar

- "Escribe pruebas JUnit 5 para este servicio."
- "Añade una prueba parametrizada que cubra estos valores límite."
- "Revisa el aislamiento y la nomenclatura de estas pruebas unitarias."
- "Cubre las rutas de error de este método de negocio."

## Configuración del proyecto

- Usa la estructura estándar de Maven o Gradle y coloca las pruebas en `src/test/java`.
- `spring-boot-starter-test` ya incluye JUnit 5 (con `junit-jupiter-params`), Mockito y AssertJ en el stack del kit; no hace falta ninguna dependencia adicional de pruebas.
- Ejecuta las pruebas con `./mvnw test` (o `./gradlew test`).

## Estructura de las pruebas

- Las clases de prueba deben llevar el sufijo `Test`, por ejemplo, `CalculatorTest` para una clase `Calculator`.
- Usa `@Test` para los métodos de prueba.
- Sigue el patrón Preparar-Actuar-Comprobar (AAA).
- Nombra las pruebas con una convención descriptiva, como `methodName_should_expectedBehavior_when_scenario`.
- Usa `@BeforeEach` y `@AfterEach` para la preparación y limpieza de cada prueba.
- Usa `@BeforeAll` y `@AfterAll` para la preparación y limpieza de cada clase (deben ser métodos estáticos).
- Usa `@DisplayName` para proporcionar un nombre legible a las clases y métodos de prueba.
- Referencia el requisito bajo prueba con un comentario `// REQ-NNN`; el kit relaciona las pruebas con REQ-ID.

## Pruebas convencionales

- Mantén cada prueba centrada en un único comportamiento.
- Evita probar varias condiciones en un mismo método de prueba.
- Haz que las pruebas sean independientes e idempotentes (pueden ejecutarse en cualquier orden).
- Evita las dependencias entre pruebas.

## Pruebas basadas en datos (parametrizadas)

Marca el método con `@ParameterizedTest` en lugar de `@Test` y proporciona los argumentos con una anotación de origen:

| Origen | Uso |
|---|---|
| `@ValueSource` | Un parámetro con literales sencillos (cadenas, enteros int o long) |
| `@CsvSource` | Filas inline de valores separados por comas (varios parámetros) |
| `@CsvFileSource` | Filas cargadas desde un archivo CSV del classpath |
| `@MethodSource` | Argumentos construidos por un método fábrica que devuelve un `Stream` o una `Collection` |
| `@EnumSource` | Todas las constantes de una enumeración (o un subconjunto indicado por nombre) |

## Aserciones

- Prefiere el `assertThat(...)` fluido de AssertJ para obtener fallos legibles; ya está en el classpath del kit.
- Los métodos de JUnit `org.junit.jupiter.api.Assertions` (`assertEquals`, `assertTrue`, `assertNotNull`) siguen disponibles.
- Usa `assertThrows` (o `assertThatThrownBy` de AssertJ) para comprobar excepciones.
- Agrupa las aserciones relacionadas con `assertAll` para que todas se comprueben antes de que falle la prueba.
- Usa mensajes descriptivos en las aserciones para aclarar los fallos.

## Simulación y aislamiento

- Usa un framework de simulación como Mockito para crear objetos simulados de las dependencias.
- Usa las anotaciones `@Mock` y `@InjectMocks` de Mockito para simplificar la creación e inyección de simulaciones.
- Usa interfaces para facilitar la simulación.

## Organización de las pruebas

- Agrupa las pruebas por funcionalidad o componente mediante paquetes.
- Usa `@Tag` para clasificar las pruebas (por ejemplo, `@Tag("fast")`, `@Tag("integration")`).
- Usa `@TestMethodOrder(MethodOrderer.OrderAnnotation.class)` y `@Order` para controlar el orden de ejecución solo cuando sea estrictamente necesario.
- Usa `@Disabled` para omitir temporalmente un método o una clase de prueba, siempre indicando el motivo.
- Usa `@Nested` para agrupar pruebas relacionadas en una clase interna anidada.

## Plantilla de salida

```java
// REQ-042: el impuesto es cero para un cliente exento
@ExtendWith(MockitoExtension.class)
class TaxCalculatorTest {

    @Mock TaxRateProvider rateProvider;
    @InjectMocks TaxCalculator calculator;

    @Test
    @DisplayName("returns zero tax for a tax-exempt customer")
    void returnsZeroForTaxExemptCustomer() {
        // Preparar
        var customer = new Customer(Status.TAX_EXEMPT);
        // Actuar
        var tax = calculator.taxFor(customer);
        // Comprobar
        assertThat(tax).isEqualTo(Money.ZERO);
    }

    @ParameterizedTest(name = "income {0} -> tax {1}")
    @CsvSource({ "1000, 100", "2000, 200" })
    void appliesFlatRate(BigDecimal income, BigDecimal expected) {
        when(rateProvider.ratePercent()).thenReturn(new BigDecimal("10"));
        assertThat(calculator.taxFor(income)).isEqualByComparingTo(expected);
    }
}
```

## Puerta de calidad

- [ ] Cada prueba comprueba un comportamiento y se ejecuta independientemente de las demás (en cualquier orden).
- [ ] Los nombres de las pruebas describen el comportamiento y la clase incluye un comentario de trazabilidad `// REQ-NNN`.
- [ ] Se cubren las rutas límite y de error, no solo el flujo exitoso.
- [ ] Los colaboradores se aíslan con Mockito; no se usan bases de datos, relojes ni redes reales en una prueba unitaria.
- [ ] Las aserciones son significativas (`assertThat` de AssertJ), no se limitan a "no lanza una excepción".
- [ ] `./mvnw test` pasa localmente antes de abrir la PR.
