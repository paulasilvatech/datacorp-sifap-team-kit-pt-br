---
name: "java-mcp-server-generator"
description: "Genera un proyecto completo de servidor Model Context Protocol (MCP) en Java con el MCP Java SDK oficial, Maven o Gradle e integración opcional con Spring Boot. Úsala cuando la persona quiera crear, estructurar o iniciar un servidor MCP basado en Java que exponga herramientas, recursos o prompts."
---
# Generador de servidores MCP en Java

Genera un servidor MCP (Model Context Protocol) completo y listo para producción en **Java 21**, con el MCP Java SDK oficial y Maven o Gradle. Los manejadores son reactivos (`Mono` de Project Reactor) y registran mediante SLF4J. Genera y ejecuta todo desde VS Code, el editor aprobado del kit.

## Cuándo invocar

- "Crea un servidor MCP en Java que exponga estas herramientas."
- "Genera la estructura de un proyecto de servidor MCP con Maven y el SDK oficial de Java."
- "Inicia un servidor MCP con herramientas, recursos y prompts."
- "Genera una estructura de servidor MCP en Java basada en Gradle."

## Qué genera esta skill

| Área | Archivos generados |
|---|---|
| Compilación | `pom.xml` o `build.gradle.kts` |
| Punto de entrada | `McpServerApplication.java` |
| Herramientas | `tools/ToolDefinitions.java`, `tools/ToolHandlers.java` |
| Recursos | `resources/ResourceDefinitions.java`, `resources/ResourceHandlers.java` |
| Prompts | `prompts/PromptDefinitions.java`, `prompts/PromptHandlers.java` |
| Pruebas | `McpServerTest.java` |
| Documentación | `README.md` |

## Generación del proyecto

Cuando se solicite crear un servidor MCP en Java, genera un proyecto completo con esta estructura:

```
my-mcp-server/
├── pom.xml (o build.gradle.kts)
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/mcp/
│   │   │       ├── McpServerApplication.java
│   │   │       ├── config/
│   │   │       │   └── ServerConfiguration.java
│   │   │       ├── tools/
│   │   │       │   ├── ToolDefinitions.java
│   │   │       │   └── ToolHandlers.java
│   │   │       ├── resources/
│   │   │       │   ├── ResourceDefinitions.java
│   │   │       │   └── ResourceHandlers.java
│   │   │       └── prompts/
│   │   │           ├── PromptDefinitions.java
│   │   │           └── PromptHandlers.java
│   │   └── resources/
│   │       └── application.properties (si se usa Spring)
│   └── test/
│       └── java/
│           └── com/example/mcp/
│               └── McpServerTest.java
└── README.md
```

## Plantilla de pom.xml para Maven

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>my-mcp-server</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>My MCP Server</name>
    <description>Implementación de un servidor Model Context Protocol</description>

    <properties>
        <java.version>21</java.version>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <mcp.version>0.14.1</mcp.version>
        <slf4j.version>2.0.9</slf4j.version>
        <logback.version>1.4.11</logback.version>
        <junit.version>5.10.0</junit.version>
    </properties>

    <dependencies>
        <!-- MCP Java SDK -->
        <dependency>
            <groupId>io.modelcontextprotocol.sdk</groupId>
            <artifactId>mcp</artifactId>
            <version>${mcp.version}</version>
        </dependency>

        <!-- Registros -->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>${slf4j.version}</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>${logback.version}</version>
        </dependency>

        <!-- Pruebas -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>io.projectreactor</groupId>
            <artifactId>reactor-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.1.2</version>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.5.0</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <transformers>
                                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                    <mainClass>com.example.mcp.McpServerApplication</mainClass>
                                </transformer>
                            </transformers>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

## Plantilla de build.gradle.kts para Gradle

```kotlin
plugins {
    id("java")
    id("application")
}

group = "com.example"
version = "1.0.0"

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

repositories {
    mavenCentral()
}

dependencies {
    // MCP Java SDK
    implementation("io.modelcontextprotocol.sdk:mcp:0.14.1")

    // Registros
    implementation("org.slf4j:slf4j-api:2.0.9")
    implementation("ch.qos.logback:logback-classic:1.4.11")

    // Pruebas
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
    testImplementation("io.projectreactor:reactor-test:3.5.0")
}

application {
    mainClass.set("com.example.mcp.McpServerApplication")
}

tasks.test {
    useJUnitPlatform()
}
```

## Plantilla de McpServerApplication.java

```java
package com.example.mcp;

import com.example.mcp.tools.ToolHandlers;
import com.example.mcp.resources.ResourceHandlers;
import com.example.mcp.prompts.PromptHandlers;
import io.mcp.server.McpServer;
import io.mcp.server.McpServerBuilder;
import io.mcp.server.transport.StdioServerTransport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.Disposable;

public class McpServerApplication {

    private static final Logger log = LoggerFactory.getLogger(McpServerApplication.class);

    public static void main(String[] args) {
        log.info("Starting MCP Server...");

        try {
            McpServer server = createServer();
            StdioServerTransport transport = new StdioServerTransport();

            // Iniciar el servidor
            Disposable serverDisposable = server.start(transport).subscribe();

            // Apagado controlado
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                log.info("Shutting down MCP server");
                serverDisposable.dispose();
                server.stop().block();
            }));

            log.info("MCP Server started successfully");

            // Mantener la ejecución
            Thread.currentThread().join();

        } catch (Exception e) {
            log.error("Failed to start MCP server", e);
            System.exit(1);
        }
    }

    private static McpServer createServer() {
        McpServer server = McpServerBuilder.builder()
            .serverInfo("my-mcp-server", "1.0.0")
            .capabilities(capabilities -> capabilities
                .tools(true)
                .resources(true)
                .prompts(true))
            .build();

        // Registrar los manejadores
        ToolHandlers.register(server);
        ResourceHandlers.register(server);
        PromptHandlers.register(server);

        return server;
    }
}
```

## Plantilla de ToolDefinitions.java

```java
package com.example.mcp.tools;

import io.mcp.json.JsonSchema;
import io.mcp.server.tool.Tool;

import java.util.List;

public class ToolDefinitions {

    public static List<Tool> getTools() {
        return List.of(
            createGreetTool(),
            createCalculateTool()
        );
    }

    private static Tool createGreetTool() {
        return Tool.builder()
            .name("greet")
            .description("Genera un mensaje de saludo")
            .inputSchema(JsonSchema.object()
                .property("name", JsonSchema.string()
                    .description("Nombre de la persona a quien saludar")
                    .required(true)))
            .build();
    }

    private static Tool createCalculateTool() {
        return Tool.builder()
            .name("calculate")
            .description("Realiza cálculos matemáticos")
            .inputSchema(JsonSchema.object()
                .property("operation", JsonSchema.string()
                    .description("Operación que se realizará")
                    .enumValues(List.of("add", "subtract", "multiply", "divide"))
                    .required(true))
                .property("a", JsonSchema.number()
                    .description("Primer operando")
                    .required(true))
                .property("b", JsonSchema.number()
                    .description("Segundo operando")
                    .required(true)))
            .build();
    }
}
```

## Plantilla de ToolHandlers.java

```java
package com.example.mcp.tools;

import com.fasterxml.jackson.databind.JsonNode;
import io.mcp.server.McpServer;
import io.mcp.server.tool.ToolResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;

public class ToolHandlers {

    private static final Logger log = LoggerFactory.getLogger(ToolHandlers.class);

    public static void register(McpServer server) {
        // Registrar el manejador de listado de herramientas
        server.addToolListHandler(() -> {
            log.debug("Listing available tools");
            return Mono.just(ToolDefinitions.getTools());
        });

        // Registrar el manejador de greet
        server.addToolHandler("greet", ToolHandlers::handleGreet);

        // Registrar el manejador de calculate
        server.addToolHandler("calculate", ToolHandlers::handleCalculate);
    }

    private static Mono<ToolResponse> handleGreet(JsonNode arguments) {
        log.info("Greet tool called");

        if (!arguments.has("name")) {
            return Mono.just(ToolResponse.error()
                .message("Missing 'name' parameter")
                .build());
        }

        String name = arguments.get("name").asText();
        String greeting = "Hello, " + name + "! Welcome to MCP.";

        log.debug("Generated greeting for: {}", name);

        return Mono.just(ToolResponse.success()
            .addTextContent(greeting)
            .build());
    }

    private static Mono<ToolResponse> handleCalculate(JsonNode arguments) {
        log.info("Calculate tool called");

        if (!arguments.has("operation") || !arguments.has("a") || !arguments.has("b")) {
            return Mono.just(ToolResponse.error()
                .message("Missing required parameters")
                .build());
        }

        String operation = arguments.get("operation").asText();
        double a = arguments.get("a").asDouble();
        double b = arguments.get("b").asDouble();

        double result;
        switch (operation) {
            case "add":
                result = a + b;
                break;
            case "subtract":
                result = a - b;
                break;
            case "multiply":
                result = a * b;
                break;
            case "divide":
                if (b == 0) {
                    return Mono.just(ToolResponse.error()
                        .message("Division by zero")
                        .build());
                }
                result = a / b;
                break;
            default:
                return Mono.just(ToolResponse.error()
                    .message("Unknown operation: " + operation)
                    .build());
        }

        log.debug("Calculation: {} {} {} = {}", a, operation, b, result);

        return Mono.just(ToolResponse.success()
            .addTextContent("Result: " + result)
            .build());
    }
}
```

## Plantilla de ResourceDefinitions.java

```java
package com.example.mcp.resources;

import io.mcp.server.resource.Resource;

import java.util.List;

public class ResourceDefinitions {

    public static List<Resource> getResources() {
        return List.of(
            Resource.builder()
                .name("Example Data")
                .uri("resource://data/example")
                .description("Datos de recurso de ejemplo")
                .mimeType("application/json")
                .build(),
            Resource.builder()
                .name("Configuration")
                .uri("resource://config")
                .description("Configuración del servidor")
                .mimeType("application/json")
                .build()
        );
    }
}
```

## Plantilla de ResourceHandlers.java

```java
package com.example.mcp.resources;

import io.mcp.server.McpServer;
import io.mcp.server.resource.ResourceContent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ResourceHandlers {

    private static final Logger log = LoggerFactory.getLogger(ResourceHandlers.class);
    private static final Map<String, Boolean> subscriptions = new ConcurrentHashMap<>();

    public static void register(McpServer server) {
        // Registrar el manejador de listado de recursos
        server.addResourceListHandler(() -> {
            log.debug("Listing available resources");
            return Mono.just(ResourceDefinitions.getResources());
        });

        // Registrar el manejador de lectura de recursos
        server.addResourceReadHandler(ResourceHandlers::handleRead);

        // Registrar el manejador de suscripción a recursos
        server.addResourceSubscribeHandler(ResourceHandlers::handleSubscribe);

        // Registrar el manejador de cancelación de suscripción a recursos
        server.addResourceUnsubscribeHandler(ResourceHandlers::handleUnsubscribe);
    }

    private static Mono<ResourceContent> handleRead(String uri) {
        log.info("Reading resource: {}", uri);

        switch (uri) {
            case "resource://data/example":
                String jsonData = String.format(
                    "{\"message\":\"Example resource data\",\"timestamp\":\"%s\"}",
                    Instant.now()
                );
                return Mono.just(ResourceContent.text(jsonData, uri, "application/json"));

            case "resource://config":
                String config = "{\"serverName\":\"my-mcp-server\",\"version\":\"1.0.0\"}";
                return Mono.just(ResourceContent.text(config, uri, "application/json"));

            default:
                log.warn("Unknown resource requested: {}", uri);
                return Mono.error(new IllegalArgumentException("Unknown resource URI: " + uri));
        }
    }

    private static Mono<Void> handleSubscribe(String uri) {
        log.info("Client subscribed to resource: {}", uri);
        subscriptions.put(uri, true);
        return Mono.empty();
    }

    private static Mono<Void> handleUnsubscribe(String uri) {
        log.info("Client unsubscribed from resource: {}", uri);
        subscriptions.remove(uri);
        return Mono.empty();
    }
}
```

## Plantilla de PromptDefinitions.java

```java
package com.example.mcp.prompts;

import io.mcp.server.prompt.Prompt;
import io.mcp.server.prompt.PromptArgument;

import java.util.List;

public class PromptDefinitions {

    public static List<Prompt> getPrompts() {
        return List.of(
            Prompt.builder()
                .name("code-review")
                .description("Genera un prompt de revisión de código")
                .argument(PromptArgument.builder()
                    .name("language")
                    .description("Lenguaje de programación")
                    .required(true)
                    .build())
                .argument(PromptArgument.builder()
                    .name("focus")
                    .description("Área de enfoque de la revisión")
                    .required(false)
                    .build())
                .build()
        );
    }
}
```

## Plantilla de PromptHandlers.java

```java
package com.example.mcp.prompts;

import io.mcp.server.McpServer;
import io.mcp.server.prompt.PromptMessage;
import io.mcp.server.prompt.PromptResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

public class PromptHandlers {

    private static final Logger log = LoggerFactory.getLogger(PromptHandlers.class);

    public static void register(McpServer server) {
        // Registrar el manejador de listado de prompts
        server.addPromptListHandler(() -> {
            log.debug("Listing available prompts");
            return Mono.just(PromptDefinitions.getPrompts());
        });

        // Registrar el manejador de obtención de prompts
        server.addPromptGetHandler(PromptHandlers::handleCodeReview);
    }

    private static Mono<PromptResult> handleCodeReview(String name, Map<String, String> arguments) {
        log.info("Getting prompt: {}", name);

        if (!name.equals("code-review")) {
            return Mono.error(new IllegalArgumentException("Unknown prompt: " + name));
        }

        String language = arguments.getOrDefault("language", "Java");
        String focus = arguments.getOrDefault("focus", "calidad general");

        String description = "Revisión de código en " + language + " con enfoque en " + focus;

        List<PromptMessage> messages = List.of(
            PromptMessage.user("Revisa este código en " + language + " con enfoque en " + focus + "."),
            PromptMessage.assistant("Revisaré el código centrándome en " + focus + ". Comparte el código."),
            PromptMessage.user("Este es el código que debe revisarse: [pega el código aquí]")
        );

        log.debug("Generated code review prompt for {} ({})", language, focus);

        return Mono.just(PromptResult.builder()
            .description(description)
            .messages(messages)
            .build());
    }
}
```

## Plantilla de McpServerTest.java

```java
package com.example.mcp;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.mcp.server.McpServer;
import io.mcp.server.McpSyncServer;
import io.mcp.server.tool.ToolResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class McpServerTest {

    private McpSyncServer syncServer;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        McpServer server = createTestServer();
        syncServer = server.toSyncServer();
        objectMapper = new ObjectMapper();
    }

    private McpServer createTestServer() {
        // La misma configuración que la aplicación principal
        McpServer server = McpServerBuilder.builder()
            .serverInfo("test-server", "1.0.0")
            .capabilities(cap -> cap.tools(true))
            .build();

        // Registrar los manejadores
        ToolHandlers.register(server);

        return server;
    }

    @Test
    void testGreetTool() {
        ObjectNode args = objectMapper.createObjectNode();
        args.put("name", "Java");

        ToolResponse response = syncServer.callTool("greet", args);

        assertFalse(response.isError());
        assertEquals(1, response.getContent().size());
        assertTrue(response.getContent().get(0).getText().contains("Java"));
    }

    @Test
    void testCalculateTool() {
        ObjectNode args = objectMapper.createObjectNode();
        args.put("operation", "add");
        args.put("a", 5);
        args.put("b", 3);

        ToolResponse response = syncServer.callTool("calculate", args);

        assertFalse(response.isError());
        assertTrue(response.getContent().get(0).getText().contains("8"));
    }

    @Test
    void testDivideByZero() {
        ObjectNode args = objectMapper.createObjectNode();
        args.put("operation", "divide");
        args.put("a", 10);
        args.put("b", 0);

        ToolResponse response = syncServer.callTool("calculate", args);

        assertTrue(response.isError());
    }
}
```

## Plantilla de README.md

````markdown
My MCP Server
=============

Un servidor Model Context Protocol construido con Java y el MCP Java SDK oficial.

## Funcionalidades

- Herramientas: greet, calculate
- Recursos: datos de ejemplo, configuración
- Prompts: code-review
- Reactive Streams con Project Reactor
- Registros estructurados con SLF4J
- Cobertura completa de pruebas

## Requisitos

- Java 21 o posterior
- Maven 3.6+ o Gradle 7+

## Compilación

### Maven
```bash
mvn clean package
```

### Gradle
```bash
./gradlew build
```

## Ejecución

### Maven
```bash
java -jar target/my-mcp-server-1.0.0.jar
```

### Gradle
```bash
./gradlew run
```

## Pruebas

### Maven
```bash
mvn test
```

### Gradle
```bash
./gradlew test
```

## Integración con VS Code

Añade el servidor a `.vscode/mcp.json` de VS Code:

```json
{
  "servers": {
    "my-mcp-server": {
      "command": "java",
      "args": ["-jar", "/path/to/my-mcp-server-1.0.0.jar"]
    }
  }
}
```

## Licencia

MIT
````

## Instrucciones de generación

1. **Pregunta por el nombre del proyecto y el paquete**
2. **Elige la herramienta de compilación** (Maven o Gradle)
3. **Genera todos los archivos** con una estructura de paquetes adecuada
4. **Usa Reactive Streams** para los manejadores asíncronos
5. **Incluye registros completos** con SLF4J
6. **Añade pruebas** para todos los manejadores
7. **Sigue las convenciones de Java** (camelCase, PascalCase)
8. **Incluye gestión de errores** con respuestas adecuadas
9. **Documenta las API públicas** con Javadoc
10. **Proporciona ejemplos síncronos y asíncronos**

## Plantilla de salida

```text
my-mcp-server/  (Java 21, Maven o Gradle)
├── pom.xml | build.gradle.kts
├── src/main/java/com/example/mcp/
│   ├── McpServerApplication.java
│   ├── tools/       ToolDefinitions.java, ToolHandlers.java
│   ├── resources/   ResourceDefinitions.java, ResourceHandlers.java
│   └── prompts/     PromptDefinitions.java, PromptHandlers.java
├── src/test/java/com/example/mcp/McpServerTest.java
└── README.md

capabilities: tools=greet,calculate | resources=example,config | prompts=code-review
build: mvn clean package   (o ./gradlew build)
run:   java -jar target/my-mcp-server-1.0.0.jar
```

## Puerta de calidad

- [ ] El proyecto compila sobre Java 21 con Maven (`mvn clean package`) o Gradle (`./gradlew build`).
- [ ] Cada herramienta, recurso y prompt tiene una definición y un manejador registrado.
- [ ] Los manejadores validan los argumentos y devuelven una respuesta de error en lugar de lanzar una excepción ante entradas incorrectas.
- [ ] Los manejadores asíncronos usan Project Reactor (`Mono`); los registros usan SLF4J (no `System.out`).
- [ ] `McpServerTest` cubre cada herramienta, incluida una ruta de error como la división por cero.
- [ ] El README documenta la compilación, la ejecución y la integración del cliente MCP mediante `.vscode/mcp.json` de VS Code.
