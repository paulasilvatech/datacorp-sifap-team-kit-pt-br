---
name: "copilot-sdk"
description: "Crea aplicaciones agénticas con GitHub Copilot SDK. Úsala para incorporar agentes de IA en aplicaciones, crear herramientas personalizadas, implementar respuestas en streaming, gestionar sesiones, conectarse a servidores MCP o crear agentes personalizados. Se activa con Copilot SDK, GitHub SDK, aplicación agéntica, incorporar Copilot, agente programable, servidor MCP y agente personalizado."
---
# GitHub Copilot SDK

Incorpora flujos agénticos de Copilot en cualquier aplicación con Python, TypeScript, Go o .NET.

| Área | Secciones |
|---|---|
| Preparación | Prerrequisitos, Instalación, Inicio rápido |
| Interacción | Respuestas en streaming, Asistente CLI interactivo, Patrones habituales |
| Ampliación del agente | Herramientas personalizadas, Integración con servidores MCP, Agentes personalizados, Mensaje de sistema |
| Configuración | Configuración del cliente, Configuración de sesiones, Persistencia de sesiones |
| Referencia | Tipos de eventos, Modelos disponibles, Buenas prácticas, Arquitectura |

## Descripción general

GitHub Copilot SDK expone el mismo motor que utiliza Copilot CLI: un entorno de ejecución de agentes probado en producción que puedes invocar mediante código. No necesitas crear tu propia orquestación: defines el comportamiento del agente y Copilot se encarga de la planificación, la invocación de herramientas, la edición de archivos y otras tareas.

## Cuándo invocar

- "Incorpora un agente de Copilot en nuestra aplicación con Copilot SDK."
- "Añade una herramienta personalizada que el agente pueda llamar durante una sesión."
- "Transmite la respuesta del modelo token a token en nuestra CLI."
- "Conecta el SDK a un servidor MCP y a un agente personalizado."

> [!NOTE]
> El SDK utiliza GitHub Copilot CLI, que debe instalarse y autenticarse primero (consulta Prerrequisitos). Está en versión preliminar técnica y puede introducir cambios incompatibles; fija las versiones y vuelve a probar al actualizar.

## Prerrequisitos

1. **GitHub Copilot CLI** instalada y autenticada ([Guía de instalación](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli))
2. **Entorno de ejecución del lenguaje**: Node.js 18+, Python 3.8+, Go 1.21+ o .NET 8.0+

Verifica la CLI: `copilot --version`

## Instalación

### Node.js/TypeScript

```bash
mkdir copilot-demo && cd copilot-demo
npm init -y --init-type module
npm install @github/copilot-sdk tsx
```

### Python: instalación

```bash
pip install github-copilot-sdk
```

### Go: instalación

```bash
mkdir copilot-demo && cd copilot-demo
go mod init copilot-demo
go get github.com/github/copilot-sdk/go
```

### .NET: instalación

```bash
dotnet new console -n CopilotDemo && cd CopilotDemo
dotnet add package GitHub.Copilot.SDK
```

## Inicio rápido

### TypeScript: inicio rápido

```typescript
import { CopilotClient, approveAll } from "@github/copilot-sdk";

const client = new CopilotClient();
const session = await client.createSession({
    onPermissionRequest: approveAll,
    model: "gpt-4.1",
});

const response = await session.sendAndWait({ prompt: "¿Cuánto es 2 + 2?" });
console.log(response?.data.content);

await client.stop();
process.exit(0);
```

Ejecuta: `npx tsx index.ts`

### Python: inicio rápido

```python
import asyncio
from copilot import CopilotClient, PermissionHandler

async def main():
    client = CopilotClient()
    await client.start()

    session = await client.create_session({
        "on_permission_request": PermissionHandler.approve_all,
        "model": "gpt-4.1",
    })
    response = await session.send_and_wait({"prompt": "¿Cuánto es 2 + 2?"})

    print(response.data.content)
    await client.stop()

asyncio.run(main())
```

### Go: inicio rápido

```go
package main

import (
    "fmt"
    "log"
    "os"
    copilot "github.com/github/copilot-sdk/go"
)

func main() {
    client := copilot.NewClient(nil)
    if err := client.Start(); err != nil {
        log.Fatal(err)
    }
    defer client.Stop()

    session, err := client.CreateSession(&copilot.SessionConfig{
        OnPermissionRequest: copilot.PermissionHandler.ApproveAll,
        Model:               "gpt-4.1",
    })
    if err != nil {
        log.Fatal(err)
    }

    response, err := session.SendAndWait(copilot.MessageOptions{Prompt: "¿Cuánto es 2 + 2?"}, 0)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println(*response.Data.Content)
    os.Exit(0)
}
```

### .NET (C#)

```csharp
using GitHub.Copilot.SDK;

await using var client = new CopilotClient();
await using var session = await client.CreateSessionAsync(new SessionConfig
{
    OnPermissionRequest = PermissionHandler.ApproveAll,
    Model = "gpt-4.1",
});

var response = await session.SendAndWaitAsync(new MessageOptions { Prompt = "¿Cuánto es 2 + 2?" });
Console.WriteLine(response?.Data.Content);
```

Ejecuta: `dotnet run`

## Respuestas en streaming

Habilita la salida en tiempo real para mejorar la experiencia de usuario:

### TypeScript: respuestas en streaming

```typescript
import { CopilotClient, approveAll, SessionEvent } from "@github/copilot-sdk";

const client = new CopilotClient();
const session = await client.createSession({
    onPermissionRequest: approveAll,
    model: "gpt-4.1",
    streaming: true,
});

session.on((event: SessionEvent) => {
    if (event.type === "assistant.message_delta") {
        process.stdout.write(event.data.deltaContent);
    }
    if (event.type === "session.idle") {
        console.log(); // Nueva línea al terminar
    }
});

await session.sendAndWait({ prompt: "Cuéntame un chiste corto" });

await client.stop();
process.exit(0);
```

### Python: respuestas en streaming

```python
import asyncio
import sys
from copilot import CopilotClient, PermissionHandler
from copilot.generated.session_events import SessionEventType

async def main():
    client = CopilotClient()
    await client.start()

    session = await client.create_session({
        "on_permission_request": PermissionHandler.approve_all,
        "model": "gpt-4.1",
        "streaming": True,
    })

    def handle_event(event):
        if event.type == SessionEventType.ASSISTANT_MESSAGE_DELTA:
            sys.stdout.write(event.data.delta_content)
            sys.stdout.flush()
        if event.type == SessionEventType.SESSION_IDLE:
            print()

    session.on(handle_event)
    await session.send_and_wait({"prompt": "Cuéntame un chiste corto"})
    await client.stop()

asyncio.run(main())
```

### Go: respuestas en streaming

```go
session, err := client.CreateSession(&copilot.SessionConfig{
 OnPermissionRequest: copilot.PermissionHandler.ApproveAll,
    Model:     "gpt-4.1",
    Streaming: true,
})

session.On(func(event copilot.SessionEvent) {
    if event.Type == "assistant.message_delta" {
        fmt.Print(*event.Data.DeltaContent)
    }
    if event.Type == "session.idle" {
        fmt.Println()
    }
})

_, err = session.SendAndWait(copilot.MessageOptions{Prompt: "Cuéntame un chiste corto"}, 0)
```

### .NET: respuestas en streaming

```csharp
await using var session = await client.CreateSessionAsync(new SessionConfig
{
    OnPermissionRequest = PermissionHandler.ApproveAll,
    Model = "gpt-4.1",
    Streaming = true,
});

session.On(ev =>
{
    if (ev is AssistantMessageDeltaEvent deltaEvent)
        Console.Write(deltaEvent.Data.DeltaContent);
    if (ev is SessionIdleEvent)
        Console.WriteLine();
});

await session.SendAndWaitAsync(new MessageOptions { Prompt = "Cuéntame un chiste corto" });
```

## Herramientas personalizadas

Define herramientas que Copilot pueda invocar durante el razonamiento. Al definir una herramienta, le indicas a Copilot:

1. **Qué hace la herramienta** (descripción)
2. **Qué parámetros necesita** (esquema)
3. **Qué código debe ejecutar** (manejador)

### TypeScript (JSON Schema)

```typescript
import { CopilotClient, approveAll, defineTool, SessionEvent } from "@github/copilot-sdk";

const getWeather = defineTool("get_weather", {
    description: "Obtiene el tiempo actual de una ciudad",
    parameters: {
        type: "object",
        properties: {
            city: { type: "string", description: "Nombre de la ciudad" },
        },
        required: ["city"],
    },
    handler: async (args: { city: string }) => {
        const { city } = args;
        // En una aplicación real, llamar aquí a una API meteorológica
        const conditions = ["sunny", "cloudy", "rainy", "partly cloudy"];
        const temp = Math.floor(Math.random() * 30) + 50;
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        return { city, temperature: `${temp}°F`, condition };
    },
});

const client = new CopilotClient();
const session = await client.createSession({
    onPermissionRequest: approveAll,
    model: "gpt-4.1",
    streaming: true,
    tools: [getWeather],
});

session.on((event: SessionEvent) => {
    if (event.type === "assistant.message_delta") {
        process.stdout.write(event.data.deltaContent);
    }
});

await session.sendAndWait({
    prompt: "¿Qué tiempo hace en Seattle y Tokyo?",
});

await client.stop();
process.exit(0);
```

### Python (Pydantic)

```python
import asyncio
import random
import sys
from copilot import CopilotClient, PermissionHandler
from copilot.tools import define_tool
from copilot.generated.session_events import SessionEventType
from pydantic import BaseModel, Field

class GetWeatherParams(BaseModel):
    city: str = Field(description="Nombre de la ciudad cuyo tiempo se quiere consultar")

@define_tool(description="Obtiene el tiempo actual de una ciudad")
async def get_weather(params: GetWeatherParams) -> dict:
    city = params.city
    conditions = ["sunny", "cloudy", "rainy", "partly cloudy"]
    temp = random.randint(50, 80)
    condition = random.choice(conditions)
    return {"city": city, "temperature": f"{temp}°F", "condition": condition}

async def main():
    client = CopilotClient()
    await client.start()

    session = await client.create_session({
        "on_permission_request": PermissionHandler.approve_all,
        "model": "gpt-4.1",
        "streaming": True,
        "tools": [get_weather],
    })

    def handle_event(event):
        if event.type == SessionEventType.ASSISTANT_MESSAGE_DELTA:
            sys.stdout.write(event.data.delta_content)
            sys.stdout.flush()

    session.on(handle_event)

    await session.send_and_wait({
        "prompt": "¿Qué tiempo hace en Seattle y Tokyo?"
    })

    await client.stop()

asyncio.run(main())
```

### Go: herramientas personalizadas

```go
type WeatherParams struct {
    City string `json:"city" jsonschema:"Nombre de la ciudad"`
}

type WeatherResult struct {
    City        string `json:"city"`
    Temperature string `json:"temperature"`
    Condition   string `json:"condition"`
}

getWeather := copilot.DefineTool(
    "get_weather",
    "Obtiene el tiempo actual de una ciudad",
    func(params WeatherParams, inv copilot.ToolInvocation) (WeatherResult, error) {
        conditions := []string{"sunny", "cloudy", "rainy", "partly cloudy"}
        temp := rand.Intn(30) + 50
        condition := conditions[rand.Intn(len(conditions))]
        return WeatherResult{
            City:        params.City,
            Temperature: fmt.Sprintf("%d°F", temp),
            Condition:   condition,
        }, nil
    },
)

session, _ := client.CreateSession(&copilot.SessionConfig{
 OnPermissionRequest: copilot.PermissionHandler.ApproveAll,
    Model:     "gpt-4.1",
    Streaming: true,
    Tools:     []copilot.Tool{getWeather},
})
```

### .NET (Microsoft.Extensions.AI)

```csharp
using GitHub.Copilot.SDK;
using Microsoft.Extensions.AI;
using System.ComponentModel;

var getWeather = AIFunctionFactory.Create(
    ([Description("Nombre de la ciudad")] string city) =>
    {
        var conditions = new[] { "sunny", "cloudy", "rainy", "partly cloudy" };
        var temp = Random.Shared.Next(50, 80);
        var condition = conditions[Random.Shared.Next(conditions.Length)];
        return new { city, temperature = $"{temp}°F", condition };
    },
    "get_weather",
    "Obtiene el tiempo actual de una ciudad"
);

await using var session = await client.CreateSessionAsync(new SessionConfig
{
    OnPermissionRequest = PermissionHandler.ApproveAll,
    Model = "gpt-4.1",
    Streaming = true,
    Tools = [getWeather],
});
```

## Cómo funcionan las herramientas

Cuando Copilot decide llamar a tu herramienta:

1. Copilot envía una solicitud de llamada a herramienta con los parámetros
2. El SDK ejecuta tu función manejadora
3. El resultado se devuelve a Copilot
4. Copilot incorpora el resultado a su respuesta

Copilot decide cuándo llamar a tu herramienta según la pregunta de la persona y la descripción de la herramienta.

## Asistente CLI interactivo

Crea un asistente interactivo completo:

### TypeScript: asistente CLI interactivo

```typescript
import { CopilotClient, approveAll, defineTool, SessionEvent } from "@github/copilot-sdk";
import * as readline from "readline";

const getWeather = defineTool("get_weather", {
    description: "Obtiene el tiempo actual de una ciudad",
    parameters: {
        type: "object",
        properties: {
            city: { type: "string", description: "Nombre de la ciudad" },
        },
        required: ["city"],
    },
    handler: async ({ city }) => {
        const conditions = ["sunny", "cloudy", "rainy", "partly cloudy"];
        const temp = Math.floor(Math.random() * 30) + 50;
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        return { city, temperature: `${temp}°F`, condition };
    },
});

const client = new CopilotClient();
const session = await client.createSession({
    onPermissionRequest: approveAll,
    model: "gpt-4.1",
    streaming: true,
    tools: [getWeather],
});

session.on((event: SessionEvent) => {
    if (event.type === "assistant.message_delta") {
        process.stdout.write(event.data.deltaContent);
    }
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("Weather Assistant (type 'exit' to quit)");
console.log("Prueba: '¿Qué tiempo hace en Paris?'\n");

const prompt = () => {
    rl.question("You: ", async (input) => {
        if (input.toLowerCase() === "exit") {
            await client.stop();
            rl.close();
            return;
        }

        process.stdout.write("Assistant: ");
        await session.sendAndWait({ prompt: input });
        console.log("\n");
        prompt();
    });
};

prompt();
```

### Python: asistente CLI interactivo

```python
import asyncio
import random
import sys
from copilot import CopilotClient, PermissionHandler
from copilot.tools import define_tool
from copilot.generated.session_events import SessionEventType
from pydantic import BaseModel, Field

class GetWeatherParams(BaseModel):
    city: str = Field(description="Nombre de la ciudad cuyo tiempo se quiere consultar")

@define_tool(description="Obtiene el tiempo actual de una ciudad")
async def get_weather(params: GetWeatherParams) -> dict:
    conditions = ["sunny", "cloudy", "rainy", "partly cloudy"]
    temp = random.randint(50, 80)
    condition = random.choice(conditions)
    return {"city": params.city, "temperature": f"{temp}°F", "condition": condition}

async def main():
    client = CopilotClient()
    await client.start()

    session = await client.create_session({
        "on_permission_request": PermissionHandler.approve_all,
        "model": "gpt-4.1",
        "streaming": True,
        "tools": [get_weather],
    })

    def handle_event(event):
        if event.type == SessionEventType.ASSISTANT_MESSAGE_DELTA:
            sys.stdout.write(event.data.delta_content)
            sys.stdout.flush()

    session.on(handle_event)

    print("Weather Assistant (type 'exit' to quit)")
    print("Prueba: '¿Qué tiempo hace en Paris?'\n")

    while True:
        try:
            user_input = input("You: ")
        except EOFError:
            break

        if user_input.lower() == "exit":
            break

        sys.stdout.write("Assistant: ")
        await session.send_and_wait({"prompt": user_input})
        print("\n")

    await client.stop()

asyncio.run(main())
```

## Integración con servidores MCP

Conéctate a servidores MCP (Model Context Protocol) para usar herramientas ya creadas. Conéctate al servidor MCP de GitHub para acceder a repositorios, incidencias y PR:

### TypeScript: integración con servidores MCP

```typescript
const session = await client.createSession({
    onPermissionRequest: approveAll,
    model: "gpt-4.1",
    mcpServers: {
        github: {
            type: "http",
            url: "https://api.githubcopilot.com/mcp/",
        },
    },
});
```

### Python: integración con servidores MCP

```python
session = await client.create_session({
    "on_permission_request": PermissionHandler.approve_all,
    "model": "gpt-4.1",
    "mcp_servers": {
        "github": {
            "type": "http",
            "url": "https://api.githubcopilot.com/mcp/",
        },
    },
})
```

### Go: integración con servidores MCP

```go
session, _ := client.CreateSession(&copilot.SessionConfig{
 OnPermissionRequest: copilot.PermissionHandler.ApproveAll,
    Model: "gpt-4.1",
    MCPServers: map[string]copilot.MCPServerConfig{
        "github": {
            "type": "http",
            "url": "https://api.githubcopilot.com/mcp/",
        },
    },
})
```

### .NET: integración con servidores MCP

```csharp
await using var session = await client.CreateSessionAsync(new SessionConfig
{
    OnPermissionRequest = PermissionHandler.ApproveAll,
    Model = "gpt-4.1",
    McpServers = new Dictionary<string, McpServerConfig>
    {
        ["github"] = new McpServerConfig
        {
            Type = "http",
            Url = "https://api.githubcopilot.com/mcp/",
        },
    },
});
```

## Agentes personalizados

Define perfiles especializados de IA para tareas concretas:

### TypeScript: agentes personalizados

```typescript
const session = await client.createSession({
    onPermissionRequest: approveAll,
    model: "gpt-4.1",
    customAgents: [{
        name: "pr-reviewer",
        displayName: "Revisor de PR",
        description: "Revisa las solicitudes de incorporación de cambios según buenas prácticas",
        prompt: "Eres especialista en revisión de código. Céntrate en la seguridad, el rendimiento y la mantenibilidad.",
    }],
});
```

### Python: agentes personalizados

```python
session = await client.create_session({
    "on_permission_request": PermissionHandler.approve_all,
    "model": "gpt-4.1",
    "custom_agents": [{
        "name": "pr-reviewer",
        "display_name": "Revisor de PR",
        "description": "Revisa las solicitudes de incorporación de cambios según buenas prácticas",
        "prompt": "Eres especialista en revisión de código. Céntrate en la seguridad, el rendimiento y la mantenibilidad.",
    }],
})
```

## Mensaje de sistema

Personaliza el comportamiento y la personalidad de la IA:

### TypeScript: mensaje de sistema

```typescript
const session = await client.createSession({
    onPermissionRequest: approveAll,
    model: "gpt-4.1",
    systemMessage: {
        content: "Eres un asistente que ayuda a nuestro equipo de ingeniería. Sé siempre conciso.",
    },
});
```

### Python: mensaje de sistema

```python
session = await client.create_session({
    "on_permission_request": PermissionHandler.approve_all,
    "model": "gpt-4.1",
    "system_message": {
        "content": "Eres un asistente que ayuda a nuestro equipo de ingeniería. Sé siempre conciso.",
    },
})
```

## Servidor CLI externo

Ejecuta la CLI por separado en modo servidor y conecta el SDK a ella. Resulta útil para depuración, recursos compartidos o entornos personalizados.

### Iniciar la CLI en modo servidor

```bash
copilot --server --port 4321
```

### Conectar el SDK a un servidor externo

#### TypeScript: conectar el SDK a un servidor externo

```typescript
const client = new CopilotClient({
    cliUrl: "localhost:4321"
});

const session = await client.createSession({
    onPermissionRequest: approveAll,
    model: "gpt-4.1",
});
```

#### Python: conectar el SDK a un servidor externo

```python
client = CopilotClient({
    "cli_url": "localhost:4321"
})
await client.start()

session = await client.create_session({
    "on_permission_request": PermissionHandler.approve_all,
    "model": "gpt-4.1",
})
```

#### Go: conectar el SDK a un servidor externo

```go
client := copilot.NewClient(&copilot.ClientOptions{
    CLIUrl: "localhost:4321",
})

if err := client.Start(); err != nil {
    log.Fatal(err)
}

session, _ := client.CreateSession(&copilot.SessionConfig{
 OnPermissionRequest: copilot.PermissionHandler.ApproveAll,
 Model:               "gpt-4.1",
})
```

#### .NET: conectar el SDK a un servidor externo

```csharp
using var client = new CopilotClient(new CopilotClientOptions
{
    CliUrl = "localhost:4321"
});

await using var session = await client.CreateSessionAsync(new SessionConfig
{
    OnPermissionRequest = PermissionHandler.ApproveAll,
    Model = "gpt-4.1",
});
```

**Nota:** Cuando se proporciona `cliUrl`, el SDK no inicia ni gestiona un proceso CLI; solo se conecta al servidor existente.

## Tipos de eventos

| Evento | Descripción |
|-------|-------------|
| `user.message` | Entrada de la persona añadida |
| `assistant.message` | Respuesta completa del modelo |
| `assistant.message_delta` | Fragmento de respuesta en streaming |
| `assistant.reasoning` | Razonamiento del modelo (depende del modelo) |
| `assistant.reasoning_delta` | Fragmento de razonamiento en streaming |
| `tool.execution_start` | Invocación de herramienta iniciada |
| `tool.execution_complete` | Ejecución de herramienta terminada |
| `session.idle` | Sin procesamiento activo |
| `session.error` | Se produjo un error |

## Configuración del cliente

| Opción | Descripción | Valor predeterminado |
|--------|-------------|---------|
| `cliPath` | Ruta del ejecutable de Copilot CLI | PATH del sistema |
| `cliUrl` | Conectar con un servidor existente (por ejemplo, "localhost:4321") | Ninguno |
| `port` | Puerto de comunicación del servidor | Aleatorio |
| `useStdio` | Usar transporte stdio en lugar de TCP | true |
| `logLevel` | Nivel de detalle de los registros | "info" |
| `autoStart` | Iniciar el servidor automáticamente | true |
| `autoRestart` | Reiniciar ante fallos | true |
| `cwd` | Directorio de trabajo del proceso CLI | Heredado |

## Configuración de sesiones

| Opción | Descripción |
|--------|-------------|
| `model` | LLM que se utilizará ("gpt-4.1", "claude-sonnet-4.5", etc.) |
| `sessionId` | Identificador de sesión personalizado |
| `tools` | Definiciones de herramientas personalizadas |
| `mcpServers` | Conexiones a servidores MCP |
| `customAgents` | Perfiles de agentes personalizados |
| `systemMessage` | Sobrescribir el prompt de sistema predeterminado |
| `streaming` | Habilitar fragmentos incrementales de respuesta |
| `availableTools` | Lista de herramientas permitidas |
| `excludedTools` | Lista de herramientas deshabilitadas |

## Persistencia de sesiones

Guarda y reanuda conversaciones entre reinicios:

### Crear con un ID personalizado

```typescript
const session = await client.createSession({
    onPermissionRequest: approveAll,
    sessionId: "user-123-conversation",
    model: "gpt-4.1"
});
```

### Reanudar una sesión

```typescript
const session = await client.resumeSession("user-123-conversation", { onPermissionRequest: approveAll });
await session.send({ prompt: "¿De qué hablamos antes?" });
```

### Enumerar y eliminar sesiones

```typescript
const sessions = await client.listSessions();
await client.deleteSession("old-session-id");
```

## Gestión de errores

```typescript
try {
    const client = new CopilotClient();
    const session = await client.createSession({
        onPermissionRequest: approveAll,
        model: "gpt-4.1",
    });
    const response = await session.sendAndWait(
        { prompt: "¡Hola!" },
        30000 // tiempo de espera en ms
    );
} catch (error) {
    if (error.code === "ENOENT") {
        console.error("Copilot CLI not installed");
    } else if (error.code === "ECONNREFUSED") {
        console.error("Cannot connect to Copilot server");
    } else {
        console.error("Error:", error.message);
    }
} finally {
    await client.stop();
}
```

## Apagado controlado

```typescript
process.on("SIGINT", async () => {
    console.log("Shutting down...");
    await client.stop();
    process.exit(0);
});
```

## Patrones habituales

### Conversación de varios turnos

```typescript
const session = await client.createSession({
    onPermissionRequest: approveAll,
    model: "gpt-4.1",
});

await session.sendAndWait({ prompt: "Me llamo Alice" });
await session.sendAndWait({ prompt: "¿Cómo me llamo?" });
// Respuesta: "Te llamas Alice"
```

### Archivos adjuntos

```typescript
await session.send({
    prompt: "Analiza este archivo",
    attachments: [{
        type: "file",
        path: "./data.csv",
        displayName: "Datos de ventas"
    }]
});
```

### Cancelar operaciones prolongadas

```typescript
const timeoutId = setTimeout(() => {
    session.abort();
}, 60000);

session.on((event) => {
    if (event.type === "session.idle") {
        clearTimeout(timeoutId);
    }
});
```

## Modelos disponibles

Consulta los modelos disponibles durante la ejecución:

```typescript
const models = await client.getModels();
// Devuelve: ["gpt-4.1", "gpt-4o", "claude-sonnet-4.5", ...]
```

## Buenas prácticas

1. **Limpia siempre los recursos**: usa `try-finally` o `defer` para garantizar la llamada a `client.stop()`
2. **Establece tiempos de espera**: usa `sendAndWait` con tiempo de espera para operaciones prolongadas
3. **Gestiona los eventos**: suscríbete a eventos de error para una gestión robusta
4. **Usa streaming**: habilítalo para mejorar la experiencia con respuestas largas
5. **Persiste las sesiones**: usa ID de sesión personalizados para conversaciones de varios turnos
6. **Define herramientas claras**: escribe nombres y descripciones de herramientas descriptivos

## Arquitectura

```text
Tu aplicación
       |
  Cliente SDK
       | JSON-RPC
  Copilot CLI (modo servidor)
       |
  GitHub (modelos, autenticación)
```

El SDK gestiona automáticamente el ciclo de vida del proceso CLI. Toda la comunicación se realiza mediante JSON-RPC sobre stdio o TCP.

## Plantilla de salida

Una integración entregada sigue esta estructura: cliente, sesión, herramientas opcionales, un bucle de ejecución y limpieza garantizada:

```typescript
import { CopilotClient, approveAll } from "@github/copilot-sdk";

// 1. Crear el cliente y una sesión (añadir herramientas personalizadas mediante `tools: [...]`).
const client = new CopilotClient();
const session = await client.createSession({
    onPermissionRequest: approveAll,
    model: "gpt-4.1",
    streaming: true,
});

// 2. Ejecutar el agente.
try {
    const response = await session.sendAndWait({ prompt: "..." }, 30000);
    console.log(response?.data.content);
} finally {
    // 3. Limpiar siempre los recursos.
    await client.stop();
}
```

Informa del lenguaje y entorno de ejecución, los modelos utilizados, las herramientas o servidores MCP conectados y cómo se realiza la limpieza del proceso.

## Puerta de calidad

- [ ] Copilot CLI está instalada y autenticada, y el entorno de ejecución elegido corresponde al SDK (Node.js 18+, Python 3.8+, Go 1.21+ o .NET 8.0+).
- [ ] Se garantiza `client.stop()` en todas las rutas (`try/finally`, `defer` o `await using`).
- [ ] Las llamadas prolongadas usan `sendAndWait` con tiempo de espera y se gestionan los errores y eventos `session.error`.
- [ ] Las herramientas personalizadas declaran un nombre, una descripción y un esquema de parámetros claros.
- [ ] Nunca se incrustan secretos ni tokens; los puntos de conexión MCP y los modelos permanecen en la configuración.
- [ ] La integración se ejecuta de extremo a extremo con el modelo de destino antes de considerarse terminada.

## Recursos

- **Repositorio de GitHub**: https://github.com/github/copilot-sdk
- **Tutorial de inicio**: https://github.com/github/copilot-sdk/blob/main/docs/tutorials/first-app.md
- **Servidor MCP de GitHub**: https://github.com/github/github-mcp-server
- **Directorio de servidores MCP**: https://github.com/modelcontextprotocol/servers
- **Recetario**: https://github.com/github/copilot-sdk/tree/main/cookbook
- **Ejemplos**: https://github.com/github/copilot-sdk/tree/main/samples

## Estado

Este SDK está en **versión preliminar técnica** y puede tener cambios incompatibles. Todavía no se recomienda para uso en producción.
