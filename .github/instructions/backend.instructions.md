---
description: "Utiliza al implementar API de backend, servicios, controladores, validación de solicitudes, tratamiento de errores y límites de los servicios de negocio."
applyTo: "backend/src/main/java/**,backend/src/test/java/**"
---

# Convenciones de backend — Controladores, servicios y validación

Este archivo se activa al editar código fuente o pruebas Java en `backend/`. Enseña a estructurar los controladores, DTO, la capa de servicios, la validación de solicitudes y las respuestas de error para una aplicación Java 21 + Spring Boot 3.3. **No** decide los límites de los módulos ni el mapeo JPA/FDT, que corresponden a [`modular-monolith.instructions.md`](modular-monolith.instructions.md), y no cubre la autenticación, que corresponde a [`security.instructions.md`](security.instructions.md).

> [!NOTE]
> `backend/` todavía no existe. El equipo lo crea desde cero en la etapa 3. Considera las reglas siguientes como las convenciones que debe seguir el código desde el momento en que se escribe.

## Capas y límites

Las solicitudes fluyen en una sola dirección: `Controller → Service → Repository`. Mantén los controladores ligeros (solo mapeo HTTP) y sitúa todas las reglas de negocio en el servicio.

- `@Transactional` se utiliza **solo** en la capa de servicios, nunca en un controlador ni repositorio; las lecturas utilizan `@Transactional(readOnly = true)`.
- Los métodos públicos nunca devuelven `null`; representa la ausencia con `Optional`.
- Mantén los controladores y servicios con visibilidad de paquete dentro de su módulo para que ningún otro módulo importe detalles internos.

## Controladores y puntos de conexión REST

Las rutas siguen `/api/v1/{resource}` (en plural y con kebab-case para recursos de varias palabras). Cada punto de conexión incluye anotaciones OpenAPI y devuelve el código de estado correcto: `201` al crear, `204` al eliminar, `409` en caso de conflicto y `PATCH` para actualizaciones parciales.

```java
@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) // 201 al crear
    @Operation(summary = "Register a resource")
    @ApiResponse(responseCode = "201", description = "Created")
    @ApiResponse(responseCode = "409", description = "Duplicate resource")
    ResourceResponse create(@Valid @RequestBody CreateResourceRequest request) {
        return resourceService.create(request);
    }
}
```

## DTO y validación

Expón DTO de tipo `record` de Java 21, nunca entidades JPA. Valida en el límite del controlador mediante Bean Validation en el registro de solicitud.

```java
public record CreateResourceRequest(
    @NotBlank @Size(max = 120) String label,
    @NotNull @Positive BigDecimal amount) {}
```

## Capa de servicios

El servicio coordina la transacción, exige las invariantes y transforma los resultados de persistencia en DTO.

```java
@Service
@RequiredArgsConstructor
class ResourceService {

    private final ResourceRepository resourceRepository;

    @Transactional(readOnly = true)
    ResourceResponse getById(UUID id) {
        return resourceRepository.findById(id)
            .map(ResourceResponse::from)
            .orElseThrow(() -> new ResourceNotFoundException(id));
    }

    @Transactional
    ResourceResponse create(CreateResourceRequest request) {
        resourceRepository.findByLabel(request.label()).ifPresent(existing -> {
            throw new ResourceConflictException(request.label());
        });
        return ResourceResponse.from(resourceRepository.save(Resource.from(request)));
    }
}
```

## Tratamiento de errores

Devuelve `ProblemDetail` conforme a RFC 7807 desde un único `@RestControllerAdvice`, asigna `400` a los fallos de validación y añade un identificador de correlación para poder relacionar registros y respuestas.

```java
@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        return problem(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    private ProblemDetail problem(HttpStatus status, String detail) {
        ProblemDetail body = ProblemDetail.forStatusAndDetail(status, detail);
        body.setProperty("correlationId", MDC.get("correlationId"));
        return body;
    }
}
```

## Registros y datos sensibles

> [!WARNING]
> Nunca registres CPF, importes de prestaciones, tokens ni otros valores sensibles. Registra identificadores y el identificador de correlación en su lugar, y enmascara cualquier campo regulado antes de que llegue a un registro o mensaje de error.

```java
// Incorrecto: log.info("payment for CPF {} amount {}", cpf, amount);
log.info("payment processed correlationId={} resourceId={}", correlationId, id);
```

## Convenciones

| Regla | Justificación |
|---|---|
| Controladores en `PascalCase`; rutas `/api/v1/{resource}` en kebab-case | Superficie HTTP predecible y versionada |
| `@Transactional` solo en servicios | Los repositorios y controladores mantienen explícitos sus efectos secundarios |
| Registros para DTO de solicitud y respuesta | Contratos inmutables con límites explícitos |
| `@Valid` + Bean Validation en controladores | Rechaza entradas incorrectas antes de que lleguen a la lógica de negocio |
| `Optional` para resultados ausentes | Elimina `NullPointerException` de las API públicas |
| `ProblemDetail` (RFC 7807) para cada error | Una única estructura de error legible por máquinas |

## Qué hacer / Qué no hacer

| Qué hacer | Qué no hacer |
|---|---|
| Devolver `201`/`204`/`409` cuando corresponda | Devolver `200` para todos los resultados |
| Lanzar excepciones de dominio mapeadas en el advice | Devolver trazas de pila sin procesar o errores `Map<String,Object>` |
| Inyectar dependencias mediante el constructor | Utilizar `@Autowired` en campos |
| Enmascarar CPF e importes en los registros | Registrar entidades, cuerpos de solicitudes o tokens |

## Lista de verificación antes de abrir una PR

- [ ] Cada punto de conexión utiliza `/api/v1/{resource}`, el verbo correcto y el código de estado adecuado
- [ ] Cada punto de conexión tiene anotaciones OpenAPI y un cuerpo de solicitud `record` validado
- [ ] `@Transactional` aparece solo en servicios; ningún método público devuelve `null`
- [ ] Los errores pasan por `@RestControllerAdvice` como `ProblemDetail` con un identificador de correlación
- [ ] Ningún dato sensible (CPF, importes, tokens) llega a los registros ni a los cuerpos de error
- [ ] Las pruebas cubren el caso satisfactorio, un fallo de validación y un fallo de autenticación o autorización (consulta [`tests.instructions.md`](tests.instructions.md))
