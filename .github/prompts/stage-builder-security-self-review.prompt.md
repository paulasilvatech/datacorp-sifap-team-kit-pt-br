---
name: "security-self-review"
description: "Lista de verificación de autorrevisión de seguridad y problemas de OWASP Top 10 en una funcionalidad recién construida."
argument-hint: "context=<context> files=<Controller>.java,<Service>.java,<Entity>.java"
agent: "builder"
tools: ["read", "search", "edit"]
---
# /security-self-review

## Objetivo

Examina una funcionalidad recién construida en busca de problemas de seguridad comunes alineados con OWASP Top 10. La salida es un informe priorizado: el agente no corrige los problemas automáticamente; el equipo decide.

## Cuándo invocar

Después de implementar un contexto delimitado (entidades, servicios, controladores, pruebas) y antes de pasar a la etapa 4.

## Precondiciones

- El código de la funcionalidad existe y compila
- El equipo especifica qué controladores, servicios y entidades se revisarán

## Entradas que debe proporcionar el equipo

- El alcance de la funcionalidad: qué clases de controlador, servicio y entidad se revisarán
- El nombre del contexto delimitado

## Lo que haré

- Buscar secretos incorporados directamente en el código (cadenas que parezcan claves, contraseñas o tokens)
- Comprobar vectores de inyección SQL (concatenación de cadenas en consultas)
- Comprobar anotaciones de autenticación y autorización en puntos de conexión
- Comprobar la cobertura de validación de entradas
- Buscar datos sensibles en registros o respuestas de error
- Identificar límites de frecuencia ausentes en puntos de conexión de escritura
- Señalar áreas de dependencias donde deba ejecutarse un análisis de seguridad real

## Lo que NO haré

- Ejecutar un escáner de seguridad real (realizo análisis estático leyendo código)
- Corregir problemas automáticamente: el equipo revisa y decide qué corregir
- Inventar calificaciones de gravedad: cada calificación se justifica por el hallazgo
- Garantizar exhaustividad: es una autorrevisión, no una auditoría formal

## Formato de salida

Un informe Markdown en `03-implementation/security-review-[context].md`:

```markdown
# Autorrevisión de seguridad — [Contexto delimitado]
## Resumen
Hallazgos: N en total | Alta: N | Media: N | Baja: N
## Hallazgos
| # | Gravedad | Categoría | Archivo:Línea | Descripción | Corrección |
## Áreas que requieren análisis externo
## Aprobación
```

## Definición de terminado

- [ ] Se comprobaron las anotaciones de autenticación de cada punto de conexión de controlador
- [ ] Se comprobó cada consulta en busca de inyección SQL
- [ ] No se encontraron secretos incorporados directamente en el código (o todos están señalados)
- [ ] Se evalúa la cobertura de validación de entradas de cada punto de conexión
- [ ] El informe tiene calificaciones de gravedad justificadas por hallazgos
- [ ] Se identifica al menos un «área que requiere análisis externo»

## Cuerpo del prompt

Eres el `@builder` que realiza una autorrevisión de seguridad. No es una auditoría formal: es una comprobación rápida antes de que el equipo pase a la etapa 4.

**Paso 1 — Busca secretos incorporados directamente.**
Busca en los archivos especificados patrones que sugieran secretos incorporados directamente en el código:

- Cadenas que contengan "password", "secret", "key", "token" o "api_key" (sin distinguir mayúsculas y minúsculas)
- Cadenas que parezcan tokens codificados en Base64 (cadenas alfanuméricas largas)
- Propiedades o referencias a variables de entorno definidas con valores literales en lugar de `${ENV_VAR}`
- Archivos llamados `.env` incluidos en commits del repositorio

Para cada hallazgo: ruta del archivo, número de línea, patrón sospechoso (ocultado si parece un secreto real) y gravedad (alta).

**Paso 2 — Comprueba la inyección SQL.**
Busca:

- Concatenación de cadenas en consultas SQL (`"SELECT..." + variable`)
- Anotaciones `@Query` con interpolación de cadenas en lugar de parámetros con nombre
- Cualquier uso de `nativeQuery = true` (señalar para revisión manual; no rechazar automáticamente)
- Uso de `JdbcTemplate` con concatenación de cadenas

Para cada hallazgo: archivo, línea, patrón vulnerable y corrección (utilizar parámetros con nombre o consultas derivadas).

**Paso 3 — Comprueba autenticación y autorización.**
Para cada punto de conexión de `@RestController`:

- Comprueba si existe `@PreAuthorize`, `@Secured` o seguridad a nivel de método
- Comprueba si el controlador está bajo una ruta cubierta por las cadenas de filtros de Spring Security
- Señala cualquier punto de conexión accesible públicamente sin una justificación aparente

Para cada punto de conexión desprotegido: archivo, línea, método y ruta del punto de conexión, y gravedad (alta si modifica datos, media si es de solo lectura).

**Paso 4 — Comprueba la validación de entradas.**
Para cada punto de conexión que acepte un cuerpo de solicitud:

- Comprueba si el parámetro tiene `@Valid`
- Comprueba si el DTO de solicitud tiene anotaciones Bean Validation
- Busca campos `String` sin restricciones `@Size` o `@Pattern`

Para cada laguna: archivo, línea, campo sin validar y corrección.

**Paso 5 — Comprueba la exposición de datos sensibles.**
Busca:

- Sentencias de registro que puedan emitir campos sensibles (contraseñas, tokens, datos personales)
- Respuestas de error que expongan trazas de pila o detalles internos
- DTO de respuesta que incluyan campos como `password`, `token` o `ssn`

**Paso 6 — Identifica oportunidades de limitar la frecuencia.**
Señala cualquier punto de conexión de escritura (POST, PUT, DELETE) sin limitación de frecuencia. Nota: el equipo puede no implementar límites de frecuencia durante la inmersión, pero deben documentarse como una cuestión de producción.

**Paso 7 — Elabora el informe.**
Escribe en `03-implementation/security-review-[context].md`, con todos los hallazgos ordenados por gravedad (alta primero). Incluye un recuento resumido y una sección que enumere las áreas donde debería ejecutarse un escáner real (SAST/DAST).

Este informe no bloquea la etapa 4: es informativo. El equipo decide qué hallazgos corregir ahora y cuáles aplazar.

## Ejemplo de invocación

```
/security-self-review context=<context> files=<Controller>.java,<Service>.java,<Entity>.java
```
