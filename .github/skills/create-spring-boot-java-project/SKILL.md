---
name: "create-spring-boot-java-project"
description: "Crea la estructura inicial de un proyecto Spring Boot (Java 21) mediante start.spring.io con Maven, springdoc-openapi y ArchUnit, lista para ejecutarse con Docker Compose. Úsala cuando la persona quiera iniciar un nuevo backend Spring Boot o generar un proyecto de partida. Se ajusta al stack Java 21 + Spring Boot 3.3 del kit."
---
# Crear un proyecto Java con Spring Boot

Crea una estructura nueva de backend Spring Boot 3.3 sobre Java 21, fijada al stack del kit (PostgreSQL 16, Maven, springdoc-openapi, ArchUnit, Testcontainers). Ejecuta todos los comandos desde el terminal integrado de VS Code, el único editor aprobado del kit. El prompt [`/create-spring-boot-java-project`](../../prompts/create-spring-boot-java-project.prompt.md) aplica los ajustes específicos del kit (módulo de destino y conjunto de dependencias).

> [!IMPORTANT]
> El kit usa **solo PostgreSQL 16**, sin Redis ni MongoDB. Genera la estructura en un módulo `backend/` nuevo; aún no existe (el equipo lo crea en la etapa 3). Nunca incluyas credenciales en commits; pásalas mediante variables de entorno.

## Cuándo invocar

- "Inicia un nuevo backend Spring Boot para el equipo."
- "Genera la estructura del módulo `backend/`."
- "Genera un proyecto inicial Spring Boot 3.3 sobre Java 21 con PostgreSQL."
- "Prepara la estructura del proyecto para que podamos empezar la etapa 3."

## Prerrequisitos

Confirma que estén instaladas las herramientas necesarias:

| Herramienta | Finalidad |
|---|---|
| Java 21 (JDK) | Compilar y ejecutar la aplicación |
| Docker + Docker Compose | Ejecutar PostgreSQL 16 localmente |
| VS Code | Editor aprobado del kit |

Para personalizar el nombre del artefacto o el paquete base, cambia `artifactId` y `packageName` en [Descargar la plantilla del proyecto Spring Boot](#descargar-la-plantilla-del-proyecto-spring-boot). Para cambiar la versión de Spring Boot, modifica `bootVersion` en el mismo paso; mantén la línea 3.3.x del kit.

## Comprobar la versión de Java

```shell
java -version
```

Confirma que la salida indique Java 21.

## Descargar la plantilla del proyecto Spring Boot

Descarga una estructura Maven + Java 21 de start.spring.io con el conjunto de dependencias del kit (sin Redis ni MongoDB):

```shell
curl https://start.spring.io/starter.zip \
  -d artifactId=${input:projectName:demo-java} \
  -d bootVersion=3.3.5 \
  -d dependencies=lombok,configuration-processor,web,data-jpa,postgresql,validation,testcontainers \
  -d javaVersion=21 \
  -d packageName=com.example \
  -d packaging=jar \
  -d type=maven-project \
  -o starter.zip
```

## Descomprimir y limpiar

```shell
unzip starter.zip -d ./${input:projectName:demo-java}
rm -f starter.zip
cd ${input:projectName:demo-java}
```

## Añadir springdoc-openapi y ArchUnit

Inserta las dependencias `springdoc-openapi-starter-webmvc-ui` y `archunit-junit5` en `pom.xml`:

```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>2.8.6</version>
</dependency>
<dependency>
  <groupId>com.tngtech.archunit</groupId>
  <artifactId>archunit-junit5</artifactId>
  <version>1.2.1</version>
  <scope>test</scope>
</dependency>
```

## Configurar SpringDoc y JPA

Añade la configuración de la interfaz de SpringDoc a `application.properties`:

```properties
springdoc.swagger-ui.doc-expansion=none
springdoc.swagger-ui.operations-sorter=alpha
springdoc.swagger-ui.tags-sorter=alpha
```

Añade la configuración del origen de datos PostgreSQL y de JPA. Lee la contraseña desde una variable de entorno; nunca la incrustes:

```properties
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=${POSTGRES_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

> [!NOTE]
> Usa `ddl-auto=validate` (no `update`) para que las migraciones versionadas de Flyway controlen el esquema, según [`database.instructions.md`](../../instructions/database.instructions.md). Define `POSTGRES_PASSWORD` en el shell o en un archivo `.env` local ignorado por Git; nunca en `application.properties`.

## Añadir Docker Compose (solo PostgreSQL 16)

Crea `compose.yaml` en la raíz del proyecto con un único servicio PostgreSQL 16:

```yaml
services:
  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - ./postgres_data:/var/lib/postgresql/data
```

Añade el directorio de datos a `.gitignore`:

```gitignore
postgres_data
```

## Verificar la compilación

Testcontainers proporciona un PostgreSQL 16 real para las pruebas, así que la compilación se ejecuta sin iniciar manualmente una base de datos:

```shell
./mvnw clean test
```

Para ejecutar la aplicación contra una base de datos local, inicia primero el servicio de Compose:

```shell
docker compose up -d
./mvnw spring-boot:run
docker compose down
```

## Plantilla de salida

```markdown
### Creado
- `backend/`: estructura Spring Boot 3.3 (Java 21, Maven)
- Dependencias: web, data-jpa, postgresql, validation, testcontainers, lombok, springdoc, archunit
- `compose.yaml`: únicamente el servicio PostgreSQL 16

### Compilación
`./mvnw clean test` -> BUILD SUCCESS
```

## Puerta de calidad

- [ ] La estructura es Spring Boot 3.3.x sobre Java 21, generada en un módulo `backend/` nuevo.
- [ ] El conjunto de dependencias es el del kit; no hay Redis, MongoDB ni starter de caché.
- [ ] Todo archivo Docker Compose define únicamente un servicio PostgreSQL 16.
- [ ] No hay credenciales incrustadas; la contraseña del origen de datos procede de `POSTGRES_PASSWORD`.
- [ ] `./mvnw clean test` pasa (BUILD SUCCESS) antes de entregar la estructura.
