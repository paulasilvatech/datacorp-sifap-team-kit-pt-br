---
name: "tdd-workflow"
description: "Úsala para practicar el desarrollo guiado por pruebas, escribir primero una prueba que falle o guiar el ciclo rojo-verde-refactorizar. Los desencadenantes incluyen \"TDD\", \"rojo-verde-refactorizar\", \"primero la prueba\", \"prueba que falla\" y \"escribir una prueba\"."
---
# Flujo de trabajo TDD

## Cuándo invocar

- Al iniciar un comportamiento nuevo o la corrección de un error.
- Al programar en pareja o en grupo sobre código desconocido y necesitar una red de seguridad.
- Cuando los cambios siguen rompiendo cosas que nadie esperaba.

## El ciclo

```
ROJO → escribir la prueba mínima que falle y exprese el siguiente comportamiento
VERDE → escribir la menor cantidad de código que haga pasar la prueba
REFACTORIZAR → mejorar el diseño mientras las pruebas siguen pasando
```

Haz un commit en cada fase verde. Un comportamiento por ciclo.

## Reglas

1. **Nada de código de producción sin una prueba que falle.** Sin prueba no hay cambio.
2. **Una prueba que falle a la vez.** Nunca tengas dos pruebas en rojo.
3. **Da el paso mínimo que produzca un fallo.** Si la primera prueba es difícil de escribir, el diseño te está indicando algo.
4. **Los nombres de las pruebas describen el comportamiento**, no la implementación: `calculates_tax_for_tax_exempt_customer`, no `test_method1`.
5. Usa la estructura **Dado-Cuando-Entonces / Preparar-Actuar-Comprobar** en el cuerpo de la prueba.
6. **La fase de refactorización no es opcional**: en ella reside gran parte del valor.

## Elección de la siguiente prueba

Ordena las pruebas para guiar el diseño:

- Empieza por el caso no trivial más sencillo (el caso "0→1" o el flujo exitoso con una entrada).
- Después añade una sola variación (un límite, una bifurcación o un error).
- Evita escribir una prueba gigante que lo abarque todo.

## Uso de implementaciones falsas y stubs

- Usa un doble de prueba solo cuando el colaborador real sea lento, no determinista o aún no esté escrito.
- No simules tipos que no controlas; envuélvelos primero en una abstracción ligera.
- Una prueba que lo simula todo no prueba nada.

## Cuando TDD resulta difícil, el problema suele estar en el diseño

- Dificultad para construir el objeto bajo prueba → demasiados colaboradores, incumplimiento del principio de responsabilidad única (SRP).
- Imposibilidad de formular una aserción sin leer otros tres objetos → problema de encapsulación o de la ley de Demeter.
- Necesidad de simularlo todo → acoplamiento oculto; introduce una abstracción.

## Antipatrones

- Escribir el código y después la prueba (eso es verificación, no TDD).
- Omitir la fase de refactorización.
- Pruebas que duplican la implementación (detectores de cambios).
- Fixtures de prueba enormes compartidos entre archivos; son frágiles.
- Comprobar detalles de implementación (métodos privados, cadenas SQL exactas).

## Plantilla de salida

```java
// REQ-NNN: <comportamiento bajo prueba>
@Test
void calculatesTaxForTaxExemptCustomer() {
    // Preparar
    var customer = new Customer(TAX_EXEMPT);
    // Actuar
    var tax = calculator.taxFor(customer);
    // Comprobar
    assertThat(tax).isEqualTo(Money.ZERO);
}
```

Secuencia de commits por comportamiento: `red: añadir una prueba que falle` -> `green: hacer que pase` -> `refactor: <mejora>`.

## Puerta de calidad

- [ ] No se escribió código de producción sin una prueba que fallara primero.
- [ ] Solo hay una prueba en rojo a la vez y cada ciclo abarca un comportamiento.
- [ ] El paso de refactorización se realizó mientras las pruebas pasaban.
- [ ] Los nombres de las pruebas describen el comportamiento y hacen referencia a su REQ-ID en un comentario.

## Referencias

- [Kent Beck - Test Driven Development: By Example (desarrollo guiado por pruebas mediante ejemplos)](https://www.oreilly.com/library/view/test-driven-development/0321146530/)
- [GOOS - Growing Object-Oriented Software, Guided by Tests (desarrollo de software orientado a objetos guiado por pruebas)](http://www.growing-object-oriented-software.com/)
- [Martin Fowler - Los mocks no son stubs](https://martinfowler.com/articles/mocksArentStubs.html)
