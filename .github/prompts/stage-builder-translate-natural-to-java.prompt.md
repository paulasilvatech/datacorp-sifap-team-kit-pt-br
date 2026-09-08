---
name: "translate-natural-to-java"
description: "Traduce un programa Natural a Java 21 idiomático + Spring Boot 3.3 conservando la semántica de negocio."
argument-hint: "file=01-archaeology/legacy-sifap/natural-programs/<PROGRAM>.NSN context=<context> package=<java.package>"
agent: "builder"
tools: ["read", "search", "edit", "execute"]
---
# /translate-natural-to-java

## Objetivo

Traduce un programa Natural a Java 21 idiomático + Spring Boot 3.3 conservando la semántica de negocio (no la sintaxis). La salida es Java compilable con Javadoc que permite trazarlo a la fuente Natural.

## Cuándo invocar

Al comienzo de la etapa 3, cuando el equipo empieza a implementar los contextos delimitados del diseño de la etapa 2.

## Precondiciones

- Existe `specs/<NNN>-<feature>/plan.md` con la estructura de paquetes requerida
- Existe `specs/<NNN>-<feature>/spec.md` con requisitos EARS
- Se conocen el contexto delimitado y el paquete de destino
- El archivo fuente Natural está accesible en `01-archaeology/legacy-sifap/`

## Entradas que debe proporcionar el equipo

- La ruta del archivo de programa Natural (por ejemplo, `01-archaeology/legacy-sifap/natural-programs/PGXXXXXX.NSN`)
- El contexto delimitado y el paquete Java de destino
- Los requisitos EARS relacionados (REQ-ID)

## Lo que haré

- Leer el programa Natural bloque por bloque
- Identificar el propósito de negocio de cada bloque procedimental
- Traducirlo a Java 21 idiomático (registros para DTO, interfaces selladas, inyección por constructor)
- Generar Javadoc que enlace al archivo fuente Natural y al intervalo de líneas
- Señalar lógica huérfana (código sin un requisito EARS correspondiente) para que decida el equipo
- Crear esqueletos de pruebas unitarias para cada método traducido

## Lo que NO haré

- Reproducir la sintaxis Natural línea por línea en Java («JOBOL»: Java que parece Natural)
- Fusionar silenciosamente varios conceptos Natural en una clase Java
- Inventar significado de negocio para código poco claro: la lógica huérfana se señala, no se interpreta
- Omitir la lectura previa de los requisitos EARS: cada bloque traducido debe corresponder a un REQ-ID

## Formato de salida

Archivos Java en el paquete adecuado de `src/main/java/`, más esqueletos de pruebas en `src/test/java/`. Cada archivo incluye Javadoc que cita la fuente Natural.

## Definición de terminado

- [ ] Los archivos Java compilan sin errores
- [ ] Cada método público tiene Javadoc que cita el archivo fuente Natural y el intervalo de líneas
- [ ] Cada regla de negocio de los requisitos EARS pertinentes tiene un método correspondiente
- [ ] La lógica huérfana (código sin REQ) se documenta con `// ORPHAN: [file:line] - Se requiere una decisión del equipo`
- [ ] Existen esqueletos de pruebas unitarias para cada método público
- [ ] No hay traslado de Natural línea por línea: la traducción utiliza patrones idiomáticos de Java 21

## Cuerpo del prompt

Eres el `@builder`. El equipo seleccionó un programa Natural para traducirlo a Java.

**Paso 1 — Lee primero los requisitos EARS.**
Antes de tocar el archivo Natural, lee `specs/<NNN>-<feature>/spec.md` e
identifica todos los requisitos pertinentes para este programa. Enuméralos. Estos
requisitos definen lo que el código Java *debe* hacer.

**Paso 2 — Lee el programa Natural.**
Abre el archivo especificado. Lee la sección `DEFINE DATA` para comprender el modelo de datos. Después lee la lógica principal bloque por bloque:

- Para cada `IF...THEN...ELSE...END-IF`, identifica la decisión de negocio
- Para cada `READ` o `FIND`, identifica el patrón de acceso a datos
- Para cada `CALLNAT`, anota la dependencia (pero no traduzcas el destino: corresponde a una invocación separada)
- Para cada `PERFORM`, identifica la subrutina interna

**Paso 3 — Vincula bloques con requisitos.**
Para cada bloque identificado, encuentra el requisito EARS que implementa. Si un bloque no tiene requisito correspondiente, márcalo como lógica huérfana:

```java
// ORPHAN: [natural-file.NSN:L42-58] - Sin REQ coincidente. Se requiere una decisión del equipo: ¿conservar, modificar o eliminar?
```

Pregunta al equipo qué hacer con la lógica huérfana antes de continuar.

**Paso 4 — Traduce a Java.**
Para cada bloque con un requisito correspondiente, escribe el equivalente Java:

- Variables `DEFINE DATA LOCAL` → parámetros de método o variables locales con tipos adecuados
- `IF...THEN...ELSE` → expresiones Java `if/else` o `switch` (coincidencia de patrones de Java 21 cuando corresponda)
- `READ LOGICAL BY` → método `findBy*` de Spring Data JPA
- `FIND WITH` → `@Query` de JPA con parámetros con nombre
- `CALLNAT` → llamada a un método de servicio (inyecta la dependencia)
- Cálculos decimales empaquetados → `BigDecimal` con escala y modo de redondeo explícitos
- Operaciones de cadenas → métodos Java `String`, teniendo en cuenta las diferencias de juegos de caracteres

Utiliza patrones idiomáticos de Java 21:

- Registros para DTO y objetos de valor
- Interfaces selladas para uniones discriminadas cuando lo requiera el dominio
- `Optional` para retornos que puedan estar ausentes
- Inyección por constructor (sin `@Autowired` a nivel de campo)
- `@Valid` para validar entradas en la capa de controladores
- `@Transactional` solo en métodos de servicio, nunca en repositorios

**Paso 5 — Genera Javadoc.**
Cada método público recibe Javadoc que incluye:

```java
/**
 * [Descripción de negocio].
 *
 * <p>Traducido de: {@code [natural-file.NSN#L42-L58]}</p>
 * <p>Implementa: REQ-NNN</p>
 */
```

**Paso 6 — Crea esqueletos de pruebas.**
Para cada método público, genera un esqueleto de prueba en `src/test/java/`:

```java
@Test
void should_[expected]_when_[condition]() {
    // Preparar: [describe la preparación según los parámetros de entrada Natural]
    // Actuar: [llama al método traducido]
    // Verificar: [comprueba frente a los criterios de aceptación EARS]
    fail("TODO: implementar — consulta los criterios de aceptación de REQ-NNN");
}
```

**Paso 7 — Verifica la compilación.**
Intenta compilar los archivos generados. Informa de los errores de compilación y corrígelos.

Si una construcción Natural no tiene un equivalente idiomático claro en Java, presenta dos alternativas al equipo y deja que elija. No elijas silenciosamente.

## Ejemplo de invocación

```
/translate-natural-to-java file=01-archaeology/legacy-sifap/natural-programs/<PROGRAM>.NSN context=<context> package=<java.package>
```
