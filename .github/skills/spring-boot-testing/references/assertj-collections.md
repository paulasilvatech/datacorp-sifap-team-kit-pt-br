# Colecciones con AssertJ

Aserciones AssertJ para colecciones: `List`, `Set`, `Map`, matrices y streams.

## Cuándo usar esta referencia

- El valor bajo prueba es una `List`, un `Set`, un `Map`, una matriz o un `Stream`
- Necesitas comprobar varios elementos, su orden o campos concretos de ellos
- Usas `extracting()`, `filteredOn()`, `containsExactly()` u otros métodos similares de colecciones
- Para comprobar un único escalar u objeto, usa [assertj-basics.md](assertj-basics.md)

## Comprobaciones básicas de colecciones

```java
List<Order> orders = orderService.findAll();

assertThat(orders).isNotEmpty();
assertThat(orders).isEmpty();
assertThat(orders).hasSize(3);
assertThat(orders).hasSizeGreaterThan(0);
assertThat(orders).hasSizeLessThanOrEqualTo(10);
```

## Aserciones de pertenencia

```java
// Contiene los elementos (en cualquier orden, permite elementos adicionales)
assertThat(orders).contains(order1, order2);

// Contiene exactamente estos elementos en este orden (sin adicionales)
assertThat(statuses).containsExactly("NEW", "PENDING", "COMPLETED");

// Contiene exactamente estos elementos en cualquier orden (sin adicionales)
assertThat(statuses).containsExactlyInAnyOrder("COMPLETED", "NEW", "PENDING");

// Contiene alguno de estos elementos (requiere al menos una coincidencia)
assertThat(statuses).containsAnyOf("NEW", "CANCELLED");

// No contiene
assertThat(statuses).doesNotContain("DELETED");
```

## Extracción de campos

Extrae un campo de cada elemento antes de realizar la aserción:

```java
assertThat(orders)
  .extracting(Order::getStatus)
  .containsExactly("NEW", "PENDING", "COMPLETED");
```

Extrae varios campos como tuplas:

```java
assertThat(orders)
  .extracting(Order::getId, Order::getStatus)
  .containsExactly(
    tuple(1L, "NEW"),
    tuple(2L, "PENDING"),
    tuple(3L, "COMPLETED")
  );
```

## Filtrar antes de comprobar

```java
assertThat(orders)
  .filteredOn(order -> order.getStatus().equals("PENDING"))
  .hasSize(2)
  .extracting(Order::getId)
  .containsExactlyInAnyOrder(1L, 3L);

// Filtrar por el valor de un campo
assertThat(orders)
  .filteredOn("status", "PENDING")
  .hasSize(2);
```

## Comprobaciones mediante predicados

```java
assertThat(orders).allMatch(o -> o.getTotal().compareTo(BigDecimal.ZERO) > 0);
assertThat(orders).anyMatch(o -> o.getStatus().equals("COMPLETED"));
assertThat(orders).noneMatch(o -> o.getStatus().equals("DELETED"));

// Con descripción para los mensajes de fallo
assertThat(orders)
  .allSatisfy(o -> assertThat(o.getId()).isPositive());
```

## Aserciones ordenadas por elemento

Comprueba cada elemento en orden con condiciones individuales:

```java
assertThat(orders).satisfiesExactly(
  first  -> assertThat(first.getStatus()).isEqualTo("NEW"),
  second -> assertThat(second.getStatus()).isEqualTo("PENDING"),
  third  -> {
    assertThat(third.getStatus()).isEqualTo("COMPLETED");
    assertThat(third.getTotal()).isGreaterThan(BigDecimal.ZERO);
  }
);
```

## Colecciones anidadas y aplanadas

```java
// flatExtracting: aplanar un nivel de colecciones anidadas
assertThat(orders)
  .flatExtracting(Order::getItems)
  .extracting(OrderItem::getProduct)
  .contains("Laptop", "Mouse");
```

## Comparación recursiva de campos

Compara los elementos por sus campos en lugar de por identidad de objeto:

```java
assertThat(orders)
  .usingRecursiveFieldByFieldElementComparator()
  .containsExactlyInAnyOrder(expectedOrder1, expectedOrder2);

// Ignorar campos concretos (por ejemplo, ID generados o marcas de tiempo)
assertThat(orders)
  .usingRecursiveFieldByFieldElementComparatorIgnoringFields("id", "createdAt")
  .containsExactly(expectedOrder1, expectedOrder2);
```

## Aserciones de Map

```java
Map<String, Integer> stockByProduct = inventoryService.getStock();

assertThat(stockByProduct)
  .isNotEmpty()
  .hasSize(3)
  .containsKey("Laptop")
  .doesNotContainKey("Fax Machine")
  .containsEntry("Laptop", 10)
  .containsEntries(entry("Laptop", 10), entry("Mouse", 50));

assertThat(stockByProduct)
  .hasEntrySatisfying("Laptop", qty -> assertThat(qty).isGreaterThan(0));
```

## Aserciones de matrices

```java
String[] roles = user.getRoles();

assertThat(roles).hasSize(2);
assertThat(roles).contains("ADMIN");
assertThat(roles).containsExactlyInAnyOrder("USER", "ADMIN");
```

## Aserciones de Set

```java
Set<String> tags = product.getTags();

assertThat(tags).contains("electronics", "sale");
assertThat(tags).doesNotContain("expired");
assertThat(tags).hasSizeGreaterThanOrEqualTo(1);
```

## Importación estática

```java
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;
import static org.assertj.core.api.Assertions.entry;
```

## Puntos clave

1. **`containsExactly` frente a `containsExactlyInAnyOrder`**: usa el primero cuando importe el orden
2. **`extracting()` antes de comprobar la pertenencia**: evita implementar `equals()` en los objetos de dominio
3. **`filteredOn()` + `extracting()`**: combínalos para comprobar con precisión un subconjunto de una colección
4. **`satisfiesExactly()`**: úsalo cuando cada elemento necesite aserciones diferentes
5. **`usingRecursiveFieldByFieldElementComparator()`**: preferible a `equals()` para DTO y records
