---
name: "java-junit"
description: "Escribe pruebas unitarias y parametrizadas eficaces con JUnit 5, delegando la lista de verificación de buenas prácticas en la habilidad java-junit."
argument-hint: "class=<ClassUnderTest>"
agent: "qa-engineer"
tools: ["read", "search", "edit"]
---
# /java-junit

## Objetivo

Produce pruebas JUnit 5 enfocadas, estándar y parametrizadas, para una clase o comportamiento, siguiendo preparar-actuar-verificar, nombres descriptivos, aislamiento adecuado y trazabilidad REQ-ID. La lista de verificación de buenas prácticas se encuentra en la habilidad [`java-junit`](../skills/java-junit/SKILL.md); este prompt la aplica al backend de SIFAP 2.0 sin repetirla.

> [!IMPORTANT]
> Escribe las pruebas junto con el código, nunca después: el kit prohíbe añadir pruebas a posteriori.

## Cuándo invocar

Durante las etapas 3/4, al implementar lógica de negocio del backend, una vez que el comportamiento que se probará esté definido por un REQ-ID y sus criterios de aceptación.

## Precondiciones

- La clase o el comportamiento que se probará existe o se está escribiendo en el mismo cambio
- El módulo de backend tiene `junit-jupiter` y `testcontainers` en la ruta de clases de pruebas
- Se conocen los REQ-ID que deben cubrir las pruebas

## Entradas que debe proporcionar el equipo

- `class`: la clase (o comportamiento) que se probará, por ejemplo, `PaymentService`
- Los REQ-ID y los criterios de aceptación que deben satisfacer las pruebas
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Seguir las prácticas de JUnit 5 de la habilidad [`java-junit`](../skills/java-junit/SKILL.md), aplicándolas a la clase que se probará
- Escribir una prueba por criterio de aceptación, con nombre `should_<expected>_when_<condition>`, cada una con un comentario en línea `// REQ-NNN`
- Utilizar `@ParameterizedTest` con `@MethodSource`/`@CsvSource` para casos guiados por datos y Mockito para los colaboradores
- Utilizar Testcontainers (PostgreSQL 16 real) para todo lo que acceda a la base de datos

## Lo que NO haré

- Escribir pruebas después del código de producción ni omitir un caso de ningún criterio de aceptación
- Sustituir la integración PostgreSQL de Testcontainers por una base de datos en memoria
- Probar varios comportamientos en un método ni depender del orden de ejecución de las pruebas
- Dejar una prueba sin un comentario REQ-ID (rompe spec-traceability)

## Formato de salida

Una clase de prueba JUnit 5, con cada caso trazable a un REQ-ID:

```java
// REQ-042: rechazar beneficiarios inactivos
@Test
@DisplayName("rechaza una línea de pago para un beneficiario inactivo")
void should_reject_when_beneficiary_is_inactive() {
    // Preparar - Actuar - Verificar
}
```

## Definición de terminado

- [ ] Existe una prueba por criterio de aceptación de cada REQ-ID vinculado
- [ ] Cada prueba incluye un comentario en línea `// REQ-NNN`
- [ ] Los casos guiados por datos utilizan `@ParameterizedTest`; los colaboradores se simulan
- [ ] Las pruebas de base de datos utilizan Testcontainers; `./mvnw test` se supera

## Cuerpo del prompt

La habilidad [`java-junit`](../skills/java-junit/SKILL.md) define las convenciones de pruebas estándar y parametrizadas: léela y después aplícalas a la clase que se probará.

**Paso 1 — Mapea el comportamiento.**
Enumera cada criterio de aceptación de los REQ-ID vinculados; cada uno se convierte en una prueba.

**Paso 2 — Aplica la habilidad.**
Escribe las pruebas según la habilidad (AAA, `@DisplayName`, `assertAll`, `assertThrows`, `@ParameterizedTest`), simulando los colaboradores con Mockito.

**Paso 3 — Respeta las reglas del kit.**
Utiliza Testcontainers con PostgreSQL 16 para las rutas de base de datos, añade un comentario `// REQ-NNN` a cada prueba y compila con `./mvnw test`.

**Paso 4 — Verifica.**
Ejecuta el conjunto de pruebas y confirma que cada caso pasa por el motivo correcto.

## Ejemplo de invocación

```
/java-junit class=PaymentService
```
