---
name: "implement-rest-controller"
description: "Implementa un controlador REST de Spring a partir de una definición de punto de conexión OpenAPI y lo conecta con los servicios del contexto delimitado."
argument-hint: "endpoint=\"<METHOD /api/v1/resource>\" context=<context> service=<Service>"
agent: "builder"
tools: ["read", "search", "edit", "execute"]
---
# /implement-rest-controller

## Objetivo

Genera un controlador REST de Spring Boot a partir de una definición de punto de conexión OpenAPI. El controlador es un adaptador ligero: valida la entrada, delega a un servicio y devuelve la respuesta. No contiene lógica de negocio.

## Cuándo invocar

Después de que exista la capa de servicios de un contexto delimitado, cuando el equipo esté listo para exponerla como API REST.

## Precondiciones

- La definición OpenAPI creada por el equipo contiene el punto de conexión
- Existe la clase de servicio del contexto delimitado (o su interfaz)
- Los DTO de solicitud y respuesta están definidos (o se generarán como registros)

## Entradas que debe proporcionar el equipo

- El punto de conexión que se implementará (método + ruta de la definición OpenAPI)
- El contexto delimitado y el paquete de destino
- La clase de servicio a la que se delegará

## Lo que haré

- Leer la definición OpenAPI del punto de conexión especificado
- Generar una clase `@RestController` con las anotaciones adecuadas
- Crear DTO de solicitud y respuesta como registros con Jakarta Bean Validation
- Conectar el controlador al servicio mediante inyección por constructor
- Añadir tratamiento de errores con `@ControllerAdvice` si todavía no existe
- Ejecutar una compilación para verificar que el código compila

## Lo que NO haré

- Poner lógica de negocio en el controlador: delega en la capa de servicios
- Omitir validación de entradas: cada punto de conexión tiene `@Valid` en su cuerpo de solicitud
- Utilizar inyección de campos con `@Autowired`: utiliza solo inyección por constructor
- Incorporar mensajes de error directamente en el código: utiliza respuestas `ProblemDetail` de RFC 7807
- Inventar comportamiento de puntos de conexión que no esté definido en la especificación OpenAPI

## Formato de salida

Archivos Java:

1. Controlador en `src/main/java/[package]/api/[Name]Controller.java`
2. DTO de solicitud y respuesta en `src/main/java/[package]/api/dto/[Name]Request.java` y `[Name]Response.java`
3. Controlador global de excepciones en `src/main/java/[package]/shared/exception/GlobalExceptionHandler.java` (si no existe)

## Definición de terminado

- [ ] El controlador compila sin errores
- [ ] El Javadoc referencia el `operationId` de OpenAPI
- [ ] El DTO de solicitud tiene anotaciones Jakarta Bean Validation (`@NotNull`, `@Size`, etc.)
- [ ] La respuesta utiliza los códigos de estado HTTP correctos (201 para POST, 200 para GET, 204 para DELETE)
- [ ] El cuerpo del controlador no contiene lógica de negocio: solo validación, delegación y mapeo de respuestas
- [ ] Las respuestas de error utilizan `ProblemDetail` de RFC 7807
- [ ] Los REQ-ID relacionados están documentados en el Javadoc

## Cuerpo del prompt

Eres el `@builder`. El equipo necesita un controlador REST para un punto de conexión definido en la especificación OpenAPI.

**Paso 1 — Lee la definición OpenAPI.**
Abre la definición OpenAPI identificada por el equipo. Encuentra el punto de conexión especificado. Extrae:

- Método HTTP y ruta
- Identificador y resumen de la operación
- Esquema del cuerpo de solicitud (si existe)
- Esquema de respuesta
- Parámetros de ruta y consulta
- REQ-ID relacionados (de la descripción o las etiquetas)

**Paso 2 — Genera registros de solicitud y respuesta.**
Crea registros Java para la solicitud y la respuesta:

```java
public record [RequestName](
    @NotNull [FieldType] [requiredField],
    @Size(max = [maxLength]) String [optionalTextField]
) {}

public record [ResponseName](
    [FieldType] [field]
) {}
```

Utiliza anotaciones Jakarta Bean Validation basadas en los tipos de campos y las restricciones del esquema OpenAPI.

**Paso 3 — Genera el controlador.**
Crea la clase de controlador:

```java
@RestController
@RequestMapping("/api/v1/[context]")
@Tag(name = "[Context]", description = "[de OpenAPI]")
public class [Name]Controller {

    private final [Service] service;

    public [Name]Controller([Service] service) {
        this.service = service;
    }

    /**
    * [Resumen de la operación OpenAPI].
     *
     * <p>OpenAPI operationId: {@code [operationId]}</p>
    * <p>Implementa: REQ-NNN</p>
     */
    @PostMapping  // O @GetMapping, etc.
    @Operation(summary = "[summary]", operationId = "[operationId]")
    public ResponseEntity<[Response]> [methodName](@Valid @RequestBody [Request] request) {
        var result = service.[method](/* mapear solicitud al dominio */);
        return ResponseEntity.status(HttpStatus.CREATED).body(/* mapear dominio a respuesta */);
    }
}
```

**Paso 4 — Asegura que exista tratamiento de errores.**
Comprueba si existe `GlobalExceptionHandler` en el paquete compartido. Si no existe, genéralo con controladores para:

- `MethodArgumentNotValidException` → 400 con detalles de validación
- `EntityNotFoundException` → 404
- `IllegalStateException` → 409 (conflicto)
- `Exception` → 500 (captura general con un mensaje de error seguro y sin exponer la traza de pila)

Todas las respuestas de error utilizan `ProblemDetail` (RFC 7807).

**Paso 5 — Verifica la compilación.**
Ejecuta `mvn compile` (o el comando de compilación equivalente). Informa de los errores y corrígelos.

Si la interfaz del servicio todavía no existe, genera una interfaz mínima con la firma del método requerido y una implementación TODO. El equipo completará la lógica.

## Ejemplo de invocación

```
/implement-rest-controller endpoint="<METHOD /api/v1/resource>" context=<context> service=<Service>
```
