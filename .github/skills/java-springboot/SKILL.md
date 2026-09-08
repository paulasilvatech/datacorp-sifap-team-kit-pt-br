---
name: "java-springboot"
description: "Buenas prácticas de aplicaciones Spring Boot: paquetes por funcionalidad, inyección por constructor, DTO y validación, transacciones en la capa de servicio, Spring Data JPA y gestión de configuración y secretos. Úsala para desarrollar o revisar código backend Spring Boot con una estructura y convenciones idiomáticas. Complementa el stack Java 21 + Spring Boot 3.3 del kit."
---
# Buenas prácticas de Spring Boot

Crea y revisa segmentos idiomáticos de Spring Boot 3.3 para el backend de SIFAP 2.0 (Java 21, PostgreSQL 16): paquetes por funcionalidad, inyección por constructor, DTO record, transacciones en la capa de servicio y Spring Data JPA. Esta skill es una lista rápida de buenas prácticas; las convenciones autoritativas, exigidas por CI, se encuentran en los archivos de instrucciones. Síguelas donde coincidan:

- [`backend.instructions.md`](../../instructions/backend.instructions.md): controladores, DTO, validación y gestión de errores.
- [`modular-monolith.instructions.md`](../../instructions/modular-monolith.instructions.md): límites de módulos y mapeo de FDT de Adabas a JPA.

## Cuándo invocar

- "Crea la estructura de un nuevo segmento funcional (controlador, servicio, repositorio) para este módulo."
- "Revisa la estructura y las convenciones de este código Spring Boot."
- "Conecta la configuración y los secretos de este servicio."
- "Convierte esta entidad JPA en un punto de conexión adecuado basado en DTO."

## Configuración y estructura del proyecto

- **Herramienta de compilación:** Usa Maven (`pom.xml`) o Gradle (`build.gradle`) para gestionar las dependencias.
- **Starters:** Usa starters de Spring Boot (por ejemplo, `spring-boot-starter-web`, `spring-boot-starter-data-jpa`) para simplificar la gestión de dependencias.
- **Estructura de paquetes:** Organiza el código por funcionalidad o dominio (por ejemplo, `com.example.app.order`, `com.example.app.user`) en lugar de por capa (por ejemplo, `com.example.app.controller`, `com.example.app.service`).

## Inyección de dependencias y componentes

- **Inyección por constructor:** Usa siempre inyección por constructor para las dependencias obligatorias. Facilita las pruebas de los componentes y hace explícitas las dependencias.
- **Inmutabilidad:** Declara los campos de dependencias como `private final`.
- **Estereotipos de componentes:** Usa adecuadamente las anotaciones `@Component`, `@Service`, `@Repository` y `@Controller`/`@RestController` para definir beans.

## Configuración

- **Configuración externa:** Usa `application.yml` (o `application.properties`) para la configuración. Se suele preferir YAML por su legibilidad y estructura jerárquica.
- **Propiedades con seguridad de tipos:** Usa `@ConfigurationProperties` para vincular la configuración a objetos Java fuertemente tipados.
- **Perfiles:** Usa Spring Profiles (`application-dev.yml`, `application-prod.yml`) para gestionar configuraciones específicas de cada entorno.
- **Gestión de secretos:** Nunca incrustes secretos en el código. Usa variables de entorno localmente y Azure Key Vault mediante identidad administrada en Azure; nunca `application.yml`, `locals` ni archivos fuente. Consulta [`security.instructions.md`](../../instructions/security.instructions.md).

## Capa web (controladores)

- **API RESTful:** Usa rutas `/api/v1/{resource}`, verbos y códigos de estado correctos (`201`/`204`/`409`) y anotaciones OpenAPI en cada punto de conexión.
- **DTO record:** Expón DTO `record` de Java 21 en el límite; nunca devuelvas entidades JPA al cliente.
- **Validación:** Aplica Bean Validation (`@Valid`, `@NotBlank`, `@Positive`, `@Size`) al record de solicitud en el límite del controlador.
- **Gestión de errores:** Centraliza los errores en un `@RestControllerAdvice` que devuelva `ProblemDetail` según RFC 7807. Consulta [`backend.instructions.md`](../../instructions/backend.instructions.md) para ver la estructura completa del controlador y los errores.

## Capa de servicio

- **Lógica de negocio:** Encapsula toda la lógica de negocio en clases `@Service`.
- **Ausencia de estado:** Los servicios no deben tener estado.
- **Gestión de transacciones:** Usa `@Transactional` solo en la capa de servicio, nunca en controladores ni repositorios; las lecturas usan `@Transactional(readOnly = true)`.
- **Sin retornos nulos:** Modela la ausencia con `Optional`; nunca devuelvas `null` desde un método público.
- **Uniones de tipos:** Usa una `sealed interface` con records para estados de dominio discriminados (Java 21).

## Capa de datos (repositorios)

- **Spring Data JPA:** Usa repositorios Spring Data JPA que extiendan `JpaRepository` o `CrudRepository` para las operaciones estándar de base de datos.
- **Consultas personalizadas:** Para consultas complejas, usa `@Query` o la API Criteria de JPA.
- **Proyecciones:** Usa proyecciones DTO para recuperar solo los datos necesarios de la base de datos.

## Registros

- **SLF4J:** Usa la API SLF4J para los registros.
- **Declaración del logger:** `private static final Logger logger = LoggerFactory.getLogger(MyClass.class);`
- **Registros parametrizados:** Usa mensajes parametrizados (`logger.info("Processing user {}...", userId);`) en lugar de concatenar cadenas para mejorar el rendimiento.

## Pruebas

- **Pruebas unitarias:** Prueba servicios y componentes con JUnit 5 + Mockito; consulta [`java-junit`](../java-junit/SKILL.md).
- **Pruebas segmentadas y de integración:** Usa `@WebMvcTest`, `@DataJpaTest` y `@SpringBootTest` con Testcontainers contra un PostgreSQL 16 real; consulta [`spring-boot-testing`](../spring-boot-testing/SKILL.md).

## Seguridad

- **Spring Security:** Usa Spring Security para autenticación y autorización (OAuth2/JWT).
- **Codificación de contraseñas:** Aplica siempre un hash con un algoritmo robusto como BCrypt.
- **Gestión de entradas:** Usa Spring Data JPA / JPQL (nunca SQL construido por concatenación de cadenas) y codifica la salida para prevenir XSS. Consulta [`security.instructions.md`](../../instructions/security.instructions.md).

## Plantilla de salida

```java
// com.sifap.payment: un contexto delimitado por paquete
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
class PaymentController {
    private final PaymentService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register a payment")
    PaymentResponse create(@Valid @RequestBody CreatePaymentRequest request) {
        return service.create(request);
    }
}

public record CreatePaymentRequest(@NotBlank String reference, @NotNull @Positive BigDecimal amount) {}

@Service
@RequiredArgsConstructor
class PaymentService {
    private final PaymentRepository repository;

    @Transactional
    PaymentResponse create(CreatePaymentRequest request) {
        return PaymentResponse.from(repository.save(Payment.from(request)));
    }
}

interface PaymentRepository extends JpaRepository<Payment, UUID> {}
```

## Puerta de calidad

- [ ] El código se organiza por funcionalidad o contexto delimitado; ningún módulo importa elementos internos de otro.
- [ ] Las dependencias usan inyección por constructor (`private final`); ningún campo usa `@Autowired`.
- [ ] Los puntos de conexión usan `/api/v1/{resource}`, códigos de estado correctos, anotaciones OpenAPI y DTO `record`.
- [ ] `@Transactional` aparece solo en servicios; ningún método público devuelve `null`.
- [ ] Los errores pasan por un único `@RestControllerAdvice` como `ProblemDetail`; no se registra ningún secreto ni valor sensible.
- [ ] Las pruebas unitarias (Mockito) y las pruebas segmentadas pertinentes pasan; consulta `java-junit` y `spring-boot-testing`.
