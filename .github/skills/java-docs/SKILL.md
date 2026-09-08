---
name: "java-docs"
description: "Aplica buenas prácticas de Javadoc para documentar correctamente tipos y miembros Java: frases de resumen, @param/@return/@throws, bloques {@code}, @since y documentación heredada. Úsala cuando la persona pida escribir, revisar o mejorar Javadoc o la documentación de API de código Java."
---
# Documentación de Java (Javadoc)

Escribe y revisa Javadoc para el backend de SIFAP 2.0 (Java 21 + Spring Boot 3.3) de modo que cada miembro público y protegido tenga un contrato correcto y coherente. Esta skill define las convenciones de Javadoc: enseña a documentar el comportamiento, no decide el diseño del código y nunca incluye valores reales regulados (CPF, importes de prestaciones) en los ejemplos.

## Cuándo invocar

- "Escribe Javadoc para esta clase de servicio."
- "Revisa el Javadoc de este paquete y completa lo que falte."
- "Documenta la API pública de este módulo antes de publicarlo."
- "Añade `@param`/`@return`/`@throws` a estos métodos."

## Qué documentar

| Visibilidad | Regla |
|---|---|
| `public`, `protected` | Javadoc es obligatorio; estos miembros forman el contrato de la API |
| package-private | Documenta cuando la intención no resulte evidente a partir del nombre |
| `private` | Documenta solo la lógica realmente compleja; prefiere código claro a comentarios |

> [!NOTE]
> Documenta el contrato (lo que puede dar por garantizado quien invoca), no la implementación. Nunca incluyas un CPF, importe de prestación, token u otro valor sensible real en un ejemplo de Javadoc; usa marcadores de posición claramente ficticios.

## Frase de resumen

- La primera frase es el resumen; termina en punto y consiste en una frase verbal breve ("Devuelve…", "Registra…").
- Empieza los resúmenes de métodos con un verbo en tercera persona ("Calcula el impuesto…"), no con "Este método…".
- Centra el resumen en el contrato; lleva los detalles a los párrafos siguientes.

## Etiquetas de bloque

| Etiqueta | Cuándo | Regla de formato |
|---|---|---|
| `@param name` | Cada parámetro de método o constructor | La descripción empieza en minúscula y no termina en punto |
| `@param <T>` | Cada parámetro de tipo de un tipo o método genérico | La misma regla de minúscula y ausencia de punto final |
| `@return` | Cada método que devuelve un valor (omitir para `void`) | Describe el valor, incluida la semántica de `Optional` |
| `@throws` / `@exception` | Cada excepción comprobada y cada excepción no comprobada documentada | Indica la condición que la desencadena |
| `@see` | Referencias cruzadas a tipos o miembros relacionados | Enlaza, no repitas |
| `@since` | Cuándo se introdujo el miembro | Usa la versión del proyecto o módulo |
| `@deprecated` | Un miembro cuya eliminación está prevista | Nombra el reemplazo y añade `@Deprecated` en el código |

Opcionales: `@author` y `@version`. Inclúyelas solo si lo exige la convención del equipo; muchas guías de estilo omiten `@author` y prefieren el historial de control de versiones.

> [!WARNING]
> Ordena las etiquetas: `@param` (en el orden de declaración), después `@return` y luego `@throws`. Un `@param` ausente o desordenado es el defecto más habitual en las revisiones de Javadoc.

## Etiquetas inline y código

- `{@code ...}` para identificadores, palabras clave y literales inline (`{@code null}`, `{@code Optional.empty()}`).
- `{@link Type#member}` para enlazar a otro elemento; `{@linkplain ...}` si quieres texto de enlace sin formato de código.
- `<pre>{@code ... }</pre>` para ejemplos de varias líneas, de modo que los genéricos y los corchetes angulares se representen literalmente.
- `{@inheritDoc}` para heredar el contrato de un supertipo; vuelve a documentar cualquier comportamiento que realmente difiera.

## Documentación de records de Java 21

El Javadoc de un record se coloca en el tipo; documenta cada componente con `@param`. No añadas métodos de acceso solo para colocar Javadoc en ellos.

## Plantilla de salida

```java
/**
 * Registra un recurso de pago y devuelve su representación almacenada.
 *
 * <p>La etiqueta debe ser única; los duplicados se rechazan en lugar de fusionarse.
 *
 * @param request la solicitud de creación validada; no debe ser {@code null}
 * @return el recurso persistido como DTO de respuesta
 * @throws ResourceConflictException si ya existe un recurso con la misma etiqueta
 * @since 1.0.0
 * @see ResourceService#getById(java.util.UUID)
 */
ResourceResponse create(CreateResourceRequest request);

/**
 * Solicitud de creación inmutable de un recurso de pago.
 *
 * @param label  una etiqueta única y legible (máximo 120 caracteres)
 * @param amount el importe monetario positivo que se registrará
 */
public record CreateResourceRequest(String label, BigDecimal amount) {}
```

## Puerta de calidad

- [ ] Cada miembro público y protegido tiene una frase de resumen Javadoc terminada en punto.
- [ ] Cada parámetro (incluidos los parámetros de tipo `<T>`) tiene un `@param`; cada método no `void` tiene un `@return`.
- [ ] Cada excepción documentada tiene un `@throws` que describe la condición que la desencadena.
- [ ] Los identificadores usan `{@code}` / `{@link}` en lugar de texto sin formato y las etiquetas de bloque están ordenadas correctamente.
- [ ] Ningún ejemplo incluye un CPF, importe de prestación u otro valor sensible real.
- [ ] `mvn javadoc:javadoc` (o la tarea `javadoc` de Gradle) genera la documentación sin advertencias.
