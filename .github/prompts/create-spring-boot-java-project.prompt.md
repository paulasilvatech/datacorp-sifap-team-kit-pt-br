---
name: "create-spring-boot-java-project"
description: "Crea la estructura inicial del backend Spring Boot de SIFAP 2.0 (Java 21 + PostgreSQL 16), delegando el procedimiento en la habilidad create-spring-boot-java-project."
argument-hint: "projectName=<artifactId>"
agent: "implementer"
tools: ["read", "edit", "search", "execute"]
---
# /create-spring-boot-java-project

## Objetivo

Crea desde cero la estructura inicial de un backend Spring Boot para SIFAP 2.0 y conecta su configuración básica, fijada a las tecnologías del kit (Java 21 + Spring Boot 3.3 + PostgreSQL 16). El procedimiento paso a paso se encuentra en la habilidad [`create-spring-boot-java-project`](../skills/create-spring-boot-java-project/SKILL.md); este prompt lo aplica sin repetirlo y sustituye los valores predeterminados generales de la habilidad.

> [!IMPORTANT]
> `backend/` todavía no existe: este comando lo crea desde cero en la etapa 3. No supongas que existe un prototipo heredado.

## Cuándo invocar

Al inicio de la etapa 3, cuando el equipo crea el módulo `backend/` por primera vez.

## Precondiciones

- Java 21, Docker y Docker Compose están instalados
- El equipo ha acordado el nombre del artefacto y el paquete base
- Todavía no existe ningún módulo `backend/`

## Entradas que debe proporcionar el equipo

- `projectName`: el `artifactId` de Maven para el nuevo módulo
- El paquete base (por ejemplo, `com.sifap.<context>`)
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Seguir los pasos de creación de la estructura inicial de la habilidad [`create-spring-boot-java-project`](../skills/create-spring-boot-java-project/SKILL.md)
- Sustituir sus valores predeterminados para este kit: Spring Boot 3.3.x, PostgreSQL 16, sin Redis ni MongoDB
- Generar en `backend/` con los iniciadores `web, data-jpa, postgresql, validation, testcontainers`, además de `springdoc-openapi-starter-webmvc-ui`
- Ejecutar `./mvnw clean test` para confirmar que la estructura inicial compila

## Lo que NO haré

- Añadir `data-redis` o `data-mongodb`, ni sus bloques de configuración
- Crear la estructura inicial en la raíz del repositorio ni utilizar Spring Boot 3.4.x
- Crear servicios de Docker Compose distintos de PostgreSQL 16
- Incluir secretos en commits (las credenciales se encuentran en variables de entorno / Azure Key Vault)

## Formato de salida

```markdown
### Creado
- Estructura inicial Spring Boot 3.3 en `backend/` (Java 21, PostgreSQL 16)
- Dependencias: web, data-jpa, postgresql, validation, testcontainers, springdoc
- `docker-compose.yaml` (solo PostgreSQL 16): opcional

### Compilación
`./mvnw clean test` → BUILD SUCCESS
```

## Definición de terminado

- [ ] `backend/` contiene una estructura inicial Spring Boot 3.3 sobre Java 21
- [ ] Las dependencias son las del kit; no hay Redis ni MongoDB
- [ ] Cualquier Docker Compose contiene solo PostgreSQL 16
- [ ] `./mvnw clean test` se supera y no se incluye ningún secreto en commits

## Cuerpo del prompt

La habilidad [`create-spring-boot-java-project`](../skills/create-spring-boot-java-project/SKILL.md) define los pasos de descarga y configuración de start.spring.io: léela y después aplícala con los ajustes del kit siguientes.

**Paso 1 — Confirma las entradas.**
Acuerda el `artifactId` y el paquete base con el equipo; verifica que Java 21 esté disponible.

**Paso 2 — Aplica la habilidad.**
Genera el proyecto según la habilidad y después limita las dependencias a las tecnologías del kit y elimina Redis/MongoDB.

**Paso 3 — Respeta las reglas del kit.**
Utiliza Spring Boot 3.3.x y PostgreSQL 16 como destino, crea la estructura inicial en `backend/` y limita Docker Compose (si existe) exclusivamente a PostgreSQL 16.

**Paso 4 — Verifica.**
Ejecuta `./mvnw clean test` y confirma una compilación satisfactoria antes del traspaso.

## Ejemplo de invocación

```
/create-spring-boot-java-project projectName=sifap-backend
```
