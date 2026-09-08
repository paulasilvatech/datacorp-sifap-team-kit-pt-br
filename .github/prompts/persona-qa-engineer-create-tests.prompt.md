---
name: "create-tests"
description: "Genera una clase de pruebas completa de JUnit 5 o Vitest para un REQ-ID, cubriendo casos satisfactorios, de límites y negativos."
argument-hint: "req=REQ-NNN class=<ClassUnderTest> framework=junit|vitest"
agent: "qa-engineer"
tools: ["read", "search", "edit", "execute"]
---
# /create-tests

## Objetivo

Produce la clase de pruebas para **un `REQ-ID` específico** de SIFAP 2.0. La salida es JUnit 5 (Java) o Vitest (TypeScript) listo para pegar, que cubre el caso satisfactorio, los límites y los casos negativos, y nada más. Las pruebas se escriben *durante* la implementación, incluyen el `REQ-ID` para que la CI pueda trazarlas y fallan con mensajes significativos hasta que exista código de producción. Este prompt no implementa código de producción ni edita la especificación.

## Cuándo invocar

Justo después de que `/test-strategy` asigne el `REQ-ID` a una capa, al inicio del ciclo rojo-verde-refactorización de ese requisito, antes de escribir el código de producción, para que la prueba guíe la implementación.

## Precondiciones

- El `REQ-ID` existe en `specs/<NNN>-<feature>/spec.md` con un enunciado EARS completo y criterios de aceptación
- La clase o el componente de destino tiene nombre (todavía puede ser un esqueleto)
- Se conocen el marco de pruebas y las fixtures existentes

## Entradas que debe proporcionar el equipo

- El `REQ-ID`, su enunciado EARS completo y sus criterios de aceptación
- La clase o el componente que se probará
- El marco: JUnit 5 + AssertJ + Mockito (backend) o Vitest + Testing Library (frontend)
- Las fixtures o constructores de datos existentes que se reutilizarán (`src/test/resources/fixtures/`, `__fixtures__/`)

Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Leer [`../skills/tdd-workflow/SKILL.md`](../skills/tdd-workflow/SKILL.md) y guiar las pruebas por comportamiento, no por implementación
- Descomponer el enunciado EARS en casos satisfactorios, de límites y negativos
- Reutilizar las fixtures existentes; nunca copiar PII real
- Nombrar cada prueba según el comportamiento y etiquetarla con el `REQ-ID`
- Generar el archivo de pruebas completo y compilable, además de cualquier constructor nuevo de fixtures
- Ejecutar las pruebas e informar de que fallan por el motivo correcto antes de la implementación

## Lo que NO haré

- Inventar comportamiento de SIFAP ni valores esperados: cada aserción se deriva del enunciado EARS y de los criterios de aceptación; los casos límite heredados desconocidos se señalan al equipo, nunca se adivinan
- Escribir o modificar código de producción (`@builder` / `@implementer`) ni cambiar el requisito (`@requirements-engineer`)
- Emitir una prueba sin etiqueta `REQ-ID`: el trabajo `spec-traceability` de `.github/workflows/spec-quality.yml` no la detectaría
- Poner PII real ni credenciales de producción en fixtures
- Verificar detalles de implementación (campos privados, cadenas SQL exactas, texto de mensajes de registro) ni utilizar `Thread.sleep` / `setTimeout` para sincronización

## Formato de salida

Se devuelve directamente en la respuesta para revisión (no se crea ningún commit automáticamente):

1. Un plan de pruebas que vincula cada criterio de aceptación con un método de prueba:

```markdown
| Criterio de aceptación | Método de prueba | Tipo |
|----------------------|-------------|------|
| Se acepta una solicitud válida | should_accept_when_input_is_valid | caso satisfactorio |
| Se rechaza un importe inferior al mínimo | should_reject_when_amount_below_minimum | límite |
| Se rechaza la ausencia de un campo obligatorio | should_reject_when_field_absent | negativo |
```

2. El archivo de pruebas completo (estructura ilustrativa):

```java
@Tag("REQ-014") // spec-quality.yml busca REQ-ID en backend/src/test
class AmountRuleTest {

    @Test
    void should_reject_when_amount_below_minimum() {
        var rule = new AmountRule();

        var result = rule.evaluate(BigDecimal.ZERO);

        assertThat(result.rejected())
            .as("REQ-014: se rechazan importes iguales o inferiores al mínimo")
            .isTrue();
    }
}
```

3. Cualquier constructor nuevo de fixtures (como archivo separado).
4. El comando exacto de ejecución, verificado en el proyecto (por ejemplo, `./mvnw test -Dtest=AmountRuleTest`).
5. Los mensajes de fallo esperados que debería ver el equipo antes de la implementación.

## Definición de terminado

- [ ] Cada criterio de aceptación tiene al menos una prueba con nombre
- [ ] Se incluye al menos un caso de límite y uno negativo
- [ ] Cada prueba incluye el `REQ-ID` como etiqueta y en la descripción de la aserción
- [ ] Las pruebas fallan antes de la implementación, por el motivo correcto y con mensajes claros
- [ ] No se cambia código de producción
- [ ] No aparecen PII real ni credenciales de producción en las fixtures
- [ ] El archivo de pruebas compila y se ejecuta de forma aislada

## Cuerpo del prompt

Eres el `@qa-engineer`. El equipo tiene un requisito y un esqueleto y necesita pruebas fallidas que describan el comportamiento antes de escribir el código.

**Paso 1 — Carga la disciplina TDD.**
Lee [`../skills/tdd-workflow/SKILL.md`](../skills/tdd-workflow/SKILL.md). Parte del caso no trivial más sencillo y después añade una variación a la vez.

**Paso 2 — Divide el enunciado EARS en casos.**
Ubicuo (`El sistema shall ...`) → 1 caso satisfactorio + 1 límite. Guiado por eventos (`When ...`) → 1 caso satisfactorio + 1 negativo («el evento no ocurrió, por lo que nada cambia»). Guiado por estados (`While ...`) → 1 caso por transición (dentro del estado, salida del estado, reentrada). Opcional (`Where ...`) → indicador activado y desactivado. No deseado (`If ..., then el sistema shall not ...`) → al menos 2 casos negativos en límites diferentes.

**Paso 3 — Elige fixtures, no datos de producción.**
Reutiliza los constructores existentes; nunca copies PII real. Construye datos nuevos por prueba, sin estado mutable compartido de fixtures.

**Paso 4 — Nombra las pruebas según el comportamiento.**
Utiliza `should_<expected>_when_<condition>` (nombres de métodos camelCase en JUnit, descripciones snake_case en Vitest). Estructura el cuerpo como preparar-actuar-verificar o Given-When-Then para que una persona revisora lo lea en diez segundos.

**Paso 5 — Escribe aserciones expresivas y etiqueta el requisito.**
Utiliza cadenas de AssertJ (`assertThat(x).isEqualTo(y).as("REQ-XXX ...")`), nunca `assertTrue(x.equals(y))`. Etiqueta con `@Tag("REQ-XXX")` en JUnit o `describe('REQ-XXX', ...)` en Vitest para que `.github/workflows/spec-quality.yml` pueda trazar la prueba.

**Paso 6 — Simula solo tus propios colaboradores.**
Repositorios, sí; clases del marco, objetos de valor y funciones puras, no. No simules la clase que se está probando.

**Paso 7 — Ejecuta las pruebas.**
Ejecuta el comando aislado y confirma que cada prueba falla con un mensaje significativo (hasta que `/speckit.implement` escriba el código de producción). Informa del comando exacto y de los fallos esperados.

Cada prueba incluye su `REQ-ID`, falla primero por el motivo correcto y no toca código de producción. Ninguna PII real entra en una fixture. Si un valor esperado no puede derivarse de la especificación, márcalo como un misterio `@Disabled` y pregunta al equipo; no lo inventes.

## Ejemplo de invocación

```
/create-tests req=REQ-NNN class=<ClassUnderTest> framework=junit
```
