---
name: "java-springboot"
description: "Aplica buenas prácticas de Spring Boot al backend de SIFAP 2.0, delegando la lista de verificación detallada en la habilidad java-springboot."
argument-hint: "target=<file-or-module>"
agent: "implementer"
tools: ["read", "search", "edit"]
---
# /java-springboot

## Objetivo

Guía la construcción o revisión de una porción Spring Boot del backend de SIFAP 2.0: organización de paquetes por funcionalidad, inyección por constructor, DTO, un controlador global de excepciones, transacciones en la capa de servicios y pruebas por segmentos, para que el código se ajuste a las tecnologías fijas del kit. La lista de verificación detallada se encuentra en la habilidad [`java-springboot`](../skills/java-springboot/SKILL.md); este prompt la aplica sin repetirla.

> [!IMPORTANT]
> Las tecnologías son fijas: Java 21 + Spring Boot 3.3 + JPA/Hibernate + PostgreSQL 16. No ofrezcas otro marco ni otra base de datos como alternativa.

## Cuándo invocar

Durante las etapas 3/4, al construir o revisar un módulo de backend, una vez que se conozca el contexto delimitado al que pertenece el código.

## Precondiciones

- La estructura inicial del módulo `backend/` está creada (consulta `/create-spring-boot-java-project`)
- El contexto delimitado y su paquete están identificados (consulta [`modular-monolith.instructions.md`](../instructions/modular-monolith.instructions.md))
- Se conocen los REQ-ID que implementa el módulo

## Entradas que debe proporcionar el equipo

- `target`: el archivo o módulo que se construirá o revisará
- El contexto delimitado al que pertenece y los REQ-ID que satisface
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Seguir las buenas prácticas de la habilidad [`java-springboot`](../skills/java-springboot/SKILL.md), aplicándolas al destino
- Exigir inyección por constructor, campos `private final`, límites mediante DTO y registros de solicitud con `@Valid`
- Mantener `@Transactional` en la capa de servicios y dirigir el acceso a datos mediante Spring Data JPA
- Referenciar secretos mediante variables de entorno respaldadas por Azure Key Vault e identidades administradas (Managed Identity)

## Lo que NO haré

- Sustituir las tecnologías por Quarkus, Micronaut, MongoDB, Redis ni ningún componente ajeno al kit
- Recomendar HashiCorp Vault o AWS Secrets Manager (el kit utiliza Azure Key Vault)
- Exponer entidades JPA directamente desde un controlador ni devolver `null` desde un método público
- Poner `@Transactional` en un repositorio ni incorporar un secreto directamente en el código

## Formato de salida

El código construido o revisado, junto con una breve nota de conformidad:

```markdown
### Aplicado
- Inyección por constructor + `private final` en `PaymentService`
- Controlador `/api/v1/payments` con `@Valid PaymentRequest` y anotaciones OpenAPI
- `@Transactional` solo en el método de servicio

### Señalado
- `PaymentController` devolvía la entidad JPA → sustituida por un DTO `PaymentResponse`
```

## Definición de terminado

- [ ] El código está organizado por funcionalidad, con inyección por constructor y campos inmutables
- [ ] Las rutas REST utilizan `/api/v1/{resource}` y cada punto de conexión tiene anotaciones OpenAPI y `@Valid`
- [ ] `@Transactional` aparece solo en la capa de servicios; no se expone ninguna entidad
- [ ] Los secretos provienen del entorno (Azure Key Vault), nunca se incorporan directamente en el código

## Cuerpo del prompt

La habilidad [`java-springboot`](../skills/java-springboot/SKILL.md) define las buenas prácticas por capas: léela y después aplícalas al destino.

**Paso 1 — Ubica el código.**
Confirma el paquete de la funcionalidad y el contexto delimitado; organiza por dominio, no por capa.

**Paso 2 — Aplica la habilidad.**
Construye o revisa las capas web, de servicios y de datos según la habilidad: DTO en los límites, un controlador de excepciones `@ControllerAdvice`, `@ConfigurationProperties` para configuración tipada y registros parametrizados con SLF4J.

**Paso 3 — Respeta las reglas del kit.**
Mantén Java 21 + Spring Boot 3.3 + PostgreSQL 16, obtén los secretos de Azure Key Vault y valida cada entrada con `@Valid`.

**Paso 4 — Informa.**
Enumera las prácticas aplicadas y las infracciones que hayas corregido.

## Ejemplo de invocación

```
/java-springboot target=backend/src/main/java/com/sifap/payment
```
