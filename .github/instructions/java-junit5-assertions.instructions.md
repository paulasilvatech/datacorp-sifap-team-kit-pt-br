---
description: "Utiliza al escribir o revisar aserciones JUnit 5 (Jupiter) en pruebas Java de backend: orden del valor esperado, mensajes Supplier diferidos, agrupación con assertAll, assertThrows y assertThrowsExactly, tiempos de espera y assertInstanceOf."
applyTo: "**/*Test.java,**/*IT.java,**/*Steps.java,**/*StepDefs.java"
---

# Aserciones JUnit 5 — Convenciones de aserciones de Jupiter

Este archivo se activa para los archivos de pruebas Java de backend (`*Test.java`, `*IT.java`, `*Steps.java`, `*StepDefs.java`). Enseña a utilizar correctamente y con precisión las aserciones integradas `org.junit.jupiter.api.Assertions` de JUnit Jupiter en Java 21: orden del valor esperado, mensajes de fallo diferidos, aserciones agrupadas, comprobaciones de excepciones y tipos, y tiempos de espera. Enseña cómo realizar aserciones; no decide la estrategia de pruebas, la selección de segmentos, la política de objetos simulados ni los objetivos de cobertura. La estructura de pruebas y la pirámide se encuentran en la habilidad [`java-junit`](../skills/java-junit/SKILL.md); las pruebas de segmentos de Spring y de integración, en [`spring-boot-testing`](../skills/spring-boot-testing/SKILL.md); y la trazabilidad y la cobertura, en [`tests.instructions.md`](tests.instructions.md).

> [!NOTE]
> Estas son las `Assertions` integradas de Jupiter. Para cadenas fluidas y comprobaciones detalladas de objetos o colecciones, el kit prioriza AssertJ (`assertThat(...)`), como se utiliza en [`tests.instructions.md`](tests.instructions.md) y en la habilidad [`spring-boot-testing`](../skills/spring-boot-testing/SKILL.md). Recurre a las aserciones de Jupiter siguientes para comprobaciones agrupadas, de excepciones, tiempos de espera y tipos exactos, así como de igualdad simple.

## Importaciones estáticas

Importa cada aserción de forma estática para que los métodos de prueba expresen la intención, no código repetitivo. Prioriza las importaciones explícitas frente al comodín, salvo que tu módulo ya lo utilice como estándar.

```java
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertAll;

assertEquals(expected, actual);
```

Importa siempre desde `org.junit.jupiter.api.Assertions`. Nunca lo mezcles con `org.junit.Assert` (JUnit 4): el orden de los argumentos difiere y las dos API no son intercambiables.

## El valor esperado primero

`expected` es siempre el **primer** argumento y `actual` el **segundo**, para que el registro de fallo muestre correctamente «expected X but was Y».

```java
// Evita esto: están invertidos; el mensaje de fallo resulta engañoso
assertEquals(resourceService.count(), 2);

// Prefiere esto
assertEquals(2, resourceService.count());

// Coma flotante inevitable (nunca dinero: para eso, BigDecimal): pasa un delta
assertEquals(0.3, 0.1 + 0.2, 1e-9);
```

> [!WARNING]
> `assertEquals` sobre `BigDecimal` utiliza `equals`, que distingue la escala: `new BigDecimal("10.0")` **no** es igual a `new BigDecimal("10.00")`. Para valores monetarios, compara por valor mediante `assertEquals(0, expected.compareTo(actual))` o utiliza `isEqualByComparingTo` de AssertJ.

## Mensajes de fallo: Supplier frente a String

Pasa el mensaje como `Supplier<String>` cuando construirlo resulte costoso, para que la cadena solo se construya en caso de fallo. Un literal constante puede mantenerse como un `String` simple.

```java
// Evita esto: el mensaje con formato se construye incluso si la aserción se supera
assertEquals(expected, actual, "expected %s but got %s".formatted(expected, actual));

// Prefiere esto: evaluación diferida, solo en caso de fallo
assertEquals(expected, actual,
    () -> "expected %s but got %s".formatted(expected, actual));

// Correcto: un literal constante no añade sobrecosto
assertTrue(account.isActive(), "account must be active");
```

## Agrupación con assertAll

Utiliza `assertAll` para comprobar varias propiedades de un resultado; todas las aserciones se ejecutan aunque falle una anterior, de modo que ves todas las discrepancias a la vez.

```java
record PaymentView(String beneficiary, BigDecimal amount, PaymentStatus status) {}

@Test
void should_map_all_fields_when_building_view() { // REQ-042
    PaymentView view = mapper.toView(payment);
    assertAll("payment view",
        () -> assertEquals("ACME LTDA", view.beneficiary()),
        () -> assertEquals(0, new BigDecimal("1500.00").compareTo(view.amount())),
        () -> assertEquals(PaymentStatus.APPROVED, view.status())
    );
}
```

No escribas manualmente una secuencia de aserciones aisladas para comprobar un objeto: el primer fallo oculta los demás.

## Excepciones: assertThrows frente a assertThrowsExactly

`assertThrows` devuelve la excepción lanzada para que puedas realizar aserciones sobre ella y acepta subtipos de la clase esperada. Utiliza `assertThrowsExactly` (JUnit 5.8+) cuando la clase exacta forme parte del contrato.

```java
@Test
void should_reject_duplicate_label_when_it_exists() { // REQ-021
    var request = new CreateResourceRequest("alpha", new BigDecimal("5.00"));
    ResourceConflictException ex = assertThrows(
        ResourceConflictException.class,
        () -> resourceService.create(request));
    assertEquals("alpha", ex.conflictingLabel());
}

// Se requiere el tipo exacto: una subclase NO debe satisfacer esta aserción
assertThrowsExactly(IllegalArgumentException.class, () -> ResourceLabel.of(""));
```

## assertDoesNotThrow

Utiliza `assertDoesNotThrow` solo cuando la ausencia de una excepción sea el contrato que se está probando; devuelve el valor para realizar más aserciones.

```java
BigDecimal total = assertDoesNotThrow(() -> invoiceService.total(batch));
assertEquals(0, new BigDecimal("2500.00").compareTo(total));
```

## Tiempos de espera

Utiliza `assertTimeout` para comprobar una duración sin interrumpir el trabajo. Utiliza `assertTimeoutPreemptively` solo cuando se requiera una interrupción forzada.

```java
assertTimeout(Duration.ofSeconds(1), () -> reportService.generate(batch));

assertTimeoutPreemptively(Duration.ofMillis(500), () -> validator.check(payload));
```

> [!WARNING]
> `assertTimeoutPreemptively` ejecuta el código en un **hilo separado**, por lo que el estado `ThreadLocal` no se propaga: el `EntityManager` vinculado a una prueba `@Transactional` y cualquier contexto de seguridad están ausentes en su interior. Nunca envuelvas una llamada de persistencia transaccional en esta aserción.

## Comprobaciones de tipo: assertInstanceOf

Prioriza `assertInstanceOf` (JUnit 5.8+) frente a `assertTrue(x instanceof T)`; falla con un mensaje útil y devuelve el valor ya convertido al tipo correspondiente, lo que encaja de forma natural con los tipos de resultado sellados del kit.

```java
sealed interface PaymentResult permits Approved, Rejected {}

Approved approved = assertInstanceOf(Approved.class, paymentService.process(request));
assertEquals(42L, approved.paymentId());
```

## Colecciones y matrices

Utiliza las aserciones específicas para que los fallos muestren las diferencias elemento por elemento en lugar de un `false` opaco.

```java
assertIterableEquals(List.of("alpha", "beta"), resourceService.labels()); // Comparación profunda y ordenada
assertArrayEquals(expectedBytes, actualBytes);
```

## Convenciones

| Regla | Justificación |
|---|---|
| `expected` primero y `actual` segundo en `assertEquals` | El registro de fallo muestra correctamente «expected X but was Y» |
| Comparar `BigDecimal` por valor, no con `equals` | `equals` distingue la escala y provoca fallos poco evidentes con dinero |
| Envolver los mensajes de fallo costosos en un `Supplier<String>` | El mensaje solo se construye cuando falla la aserción |
| Agrupar comprobaciones relacionadas con `assertAll` | Se informa de todas las propiedades, no solo de la primera discrepancia |
| `assertThrows` para una jerarquía, `assertThrowsExactly` para una clase precisa | Refleja el grado de exactitud con el que el tipo de excepción forma parte del contrato |
| `assertInstanceOf` en lugar de `assertTrue(... instanceof ...)` | Devuelve el valor convertido y falla con un mensaje útil |
| Importar solo desde `org.junit.jupiter.api.Assertions` | `org.junit.Assert` de JUnit 4 utiliza otros órdenes de argumentos |

## Qué hacer / Qué no hacer

| Qué hacer | Qué no hacer |
|---|---|
| Situar `expected` antes de `actual` | Invertirlos y obtener registros de fallo engañosos |
| Comparar dinero con `compareTo` o `isEqualByComparingTo` | Comprobar la igualdad de `BigDecimal` con `equals`, que distingue la escala |
| Utilizar `assertEquals(2, result)` para valores | Utilizar `assertTrue(result == 2)` y perder ambos valores en el registro |
| Comprobar el valor cuando sea posible | Conformarse con `assertNotNull` cuando se puede hacer una comprobación real |
| Utilizar un `Supplier` para mensajes costosos | Construir un mensaje con formato que se evalúa cada vez que se supera la prueba |
| Mantener `assertTimeoutPreemptively` fuera del código transaccional | Envolver una llamada de persistencia `@Transactional` y perder el `EntityManager` |
| Dejar que las aserciones fallen de forma visible | Capturar `AssertionError` para ocultar un fallo |

## Lista de verificación antes de abrir una PR

- [ ] Cada `assertEquals` sitúa `expected` primero y `actual` segundo
- [ ] Los valores `BigDecimal` y otros valores monetarios se comparan por valor, no mediante `equals`, que distingue la escala
- [ ] Las comprobaciones de varias propiedades utilizan `assertAll`; los mensajes costosos utilizan un `Supplier<String>`
- [ ] Las pruebas de excepciones eligen deliberadamente entre `assertThrows` y `assertThrowsExactly` y realizan aserciones sobre la excepción devuelta
- [ ] `assertTimeoutPreemptively` no envuelve código transaccional ni vinculado a `ThreadLocal`
- [ ] Las importaciones son exclusivamente de Jupiter; no se mezcla `org.junit.Assert` (JUnit 4)
- [ ] Las pruebas guiadas por requisitos conservan su comentario en línea `// REQ-NNN` (consulta [`tests.instructions.md`](tests.instructions.md))
