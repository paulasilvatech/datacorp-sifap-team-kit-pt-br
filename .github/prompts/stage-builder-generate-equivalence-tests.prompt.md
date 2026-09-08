---
name: "generate-equivalence-tests"
description: "Genera pruebas JUnit que validan si la implementación Java moderna produce las mismas salidas que el programa Natural original para las mismas entradas."
argument-hint: "class=<java.package>.<Service> method=<method>"
agent: "builder"
tools: ["read", "search", "edit", "execute"]
---
# /generate-equivalence-tests

## Objetivo

Genera pruebas parametrizadas JUnit 5 que verifiquen si un método Java traducido produce resultados de negocio equivalentes a los del programa Natural original para las mismas entradas.

## Cuándo invocar

Después de traducir un programa Natural a Java (`/translate-natural-to-java`), para verificar la equivalencia.

## Precondiciones

- La traducción Java existe y compila
- La fuente Natural original está accesible en `01-archaeology/legacy-sifap/`
- El Javadoc del código traducido referencia el archivo fuente Natural y sus líneas

## Entradas que debe proporcionar el equipo

- La clase y el método Java que se probarán
- La ruta del archivo Natural original (normalmente se encuentra en el Javadoc del método)
- Los datos de prueba o casos límite conocidos a partir del análisis del equipo en la etapa 1

## Lo que haré

- Leer el programa Natural original para identificar parámetros de entrada y salidas esperadas
- Identificar cada rama (IF/ELSE, DECIDE) para determinar los casos de prueba
- Generar pruebas parametrizadas JUnit 5 que cubran el caso satisfactorio, las ramas, los límites y los nulos
- Ejecutar las pruebas e informar de los resultados
- Enumerar cualquier rama sin cubrir

## Lo que NO haré

- Marcar un método como «equivalente» sin al menos una prueba por rama identificada
- Omitir condiciones límite de entradas numéricas
- Inventar valores esperados: cada valor esperado debe poder derivarse de la lógica del código Natural
- Ignorar rutas de error: las ramas de rechazo y error también reciben pruebas

## Formato de salida

Archivo de pruebas en `src/test/java/.../[ClassName]EquivalenceTest.java`

## Definición de terminado

- [ ] Al menos una prueba por rama identificada en el programa Natural
- [ ] Las pruebas parametrizadas cubren el caso satisfactorio, cada rama, valores límite y entradas nulas o vacías
- [ ] Las pruebas compilan y se ejecutan
- [ ] Se informa de los resultados satisfactorios y fallidos junto con la cobertura de ramas
- [ ] Las pruebas fallidas identifican qué rama divergió de la lógica Natural

## Cuerpo del prompt

Eres el `@builder`. El equipo tradujo un programa Natural a Java y necesita pruebas de equivalencia.

**Paso 1 — Localiza la fuente Natural.**
Lee el Javadoc del método Java especificado. Extrae la referencia al archivo Natural y el intervalo de líneas. Abre ese archivo Natural.

**Paso 2 — Identifica las ramas del código Natural.**
Para el intervalo de líneas referenciado, enumera cada rama condicional:

- Cada `IF...THEN...ELSE` crea 2+ rutas
- Cada valor de `DECIDE ON` crea N rutas
- Cada `AT BREAK` crea una ruta de ruptura de control

Para cada rama, anota:

- La condición (qué activa esta ruta)
- La acción o salida esperada
- Los valores de entrada que activarían esta ruta (derivados de la condición)

**Paso 3 — Deriva los casos de prueba.**
Para cada rama, crea al menos un caso de prueba:

```java
@ParameterizedTest
@CsvSource({
    "input1, input2, expectedOutput",  // Rama 1: [descripción]
    "input3, input4, expectedOutput",  // Rama 2: [descripción]
})
void should_produce_equivalent_output(Type param1, Type param2, Type expected) {
    // Preparar
    var service = new ServiceUnderTest(/* dependencias */);
    // Actuar
    var result = service.methodUnderTest(param1, param2);
    // Verificar
    assertThat(result).isEqualTo(expected);
}
```

Añade más pruebas para:

- **Valores límite**: mínimo y máximo de campos numéricos, cadenas vacías y cadenas de un carácter
- **Entradas nulas o vacías**: ¿qué ocurre cuando los parámetros opcionales son nulos?
- **Precisión de decimales empaquetados**: verificar que los cálculos con `BigDecimal` coincidan con la aritmética decimal empaquetada de Natural

**Paso 4 — Gestiona los casos límite.**
Si el código Natural tiene una rama que depende del estado de los datos (por ejemplo, «si el registro existe»), genera pruebas separadas con respuestas simuladas del repositorio:

- El registro existe → comportamiento esperado
- El registro no existe → error o alternativa esperados

**Paso 5 — Ejecuta las pruebas.**
Ejecuta el conjunto de pruebas utilizando la herramienta `runTests`. Informa de:

- Total de pruebas: N
- Satisfactorias: N
- Fallidas: N (con detalles de cada fallo)
- Estimación de cobertura de ramas (ramas con pruebas / total de ramas identificadas)

**Paso 6 — Documenta las ramas descubiertas.**
Si alguna rama identificada no tiene prueba (por lógica poco clara o falta de contexto), documéntala:

```java
@Test
@Disabled("MYSTERY: Rama en [nat-file:L73] — condición poco clara; no se puede derivar la salida esperada")
void should_handle_mystery_branch() {
    fail("Requiere investigación del equipo — consulta MYS-NNN");
}
```

## Ejemplo de invocación

```
/generate-equivalence-tests class=<java.package>.<Service> method=<method>
```
