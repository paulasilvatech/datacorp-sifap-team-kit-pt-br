# Copilot Studio: tarifas de facturación y estimación

> Fuente: [Tarifas de facturación y administración](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management)
> Estimador: [Estimador de uso de agentes de Microsoft](https://microsoft.github.io/copilot-studio-estimator/)
> Guía de licencias: [Guía de licencias de Copilot Studio](https://go.microsoft.com/fwlink/?linkid=2320995)

## Costo por crédito de Copilot

**1 crédito de Copilot = $0.01 USD**

## Tarifas de facturación (instantánea en caché: última actualización en marzo de 2026)

**IMPORTANTE: Prefiere siempre consultar las tarifas vigentes en las URL de origen indicadas más abajo. Usa esta tabla solo como alternativa si no es posible consultar la web.**

| Funcionalidad | Tarifa | Unidad |
|---|---|---|
| Respuesta clásica | 1 | Por respuesta |
| Respuesta generativa | 2 | Por respuesta |
| Acción de agente | 5 | Por acción (desencadenantes, razonamiento profundo, transiciones de temas, uso del equipo) |
| Fundamentación con el grafo del inquilino | 10 | Por mensaje |
| Acciones de flujo de agente | 13 | Por 100 acciones de flujo |
| Herramientas de texto e IA generativa (básicas) | 1 | Por 10 respuestas |
| Herramientas de texto e IA generativa (estándar) | 15 | Por 10 respuestas |
| Herramientas de texto e IA generativa (premium) | 100 | Por 10 respuestas |
| Herramientas de procesamiento de contenido | 8 | Por página |

### Notas

- **Respuestas clásicas**: respuestas predefinidas y redactadas manualmente. Son estáticas; solo cambian si su creador las actualiza.
- **Respuestas generativas**: se generan dinámicamente con modelos de IA (GPT). Se adaptan según el contexto y las fuentes de conocimiento.
- **Fundamentación con el grafo del inquilino**: RAG sobre Microsoft Graph de todo el inquilino, incluidos datos externos mediante conectores. Opcional por agente.
- **Acciones de agente**: pasos como desencadenantes, razonamiento profundo y transiciones de temas visibles en el mapa de actividad. Incluyen agentes que usan el equipo.
- **Herramientas de texto e IA generativa**: herramientas de prompts integradas en agentes. Tres niveles (básico/estándar/premium) según el modelo de lenguaje subyacente.
- **Acciones de flujo de agente**: secuencias predefinidas de acciones de flujo ejecutadas sin razonamiento ni orquestación del agente en cada paso.

### Facturación de modelos de razonamiento

Al usar un modelo con capacidad de razonamiento:

```
Costo total = tarifa de la funcionalidad para la operación + herramientas de texto e IA generativa (premium) por 10 respuestas
```

Ejemplo: una respuesta generativa que usa un modelo de razonamiento cuesta **2 créditos** (respuesta generativa) **+ 10 créditos** (premium por respuesta, prorrateados a partir de 100/10).

## Fórmula de estimación

### Entradas

| Parámetro | Descripción |
|---|---|
| `users` | Número de usuarios finales |
| `interactions_per_month` | Promedio de interacciones por usuario al mes |
| `knowledge_pct` | Porcentaje de respuestas procedentes de fuentes de conocimiento (0-100) |
| `tenant_graph_pct` | Porcentaje de las respuestas de conocimiento que usan fundamentación con el grafo del inquilino (0-100) |
| `tool_prompt` | Promedio de llamadas a herramientas de prompts por sesión |
| `tool_agent_flow` | Promedio de llamadas a flujos de agente por sesión |
| `tool_computer_use` | Promedio de llamadas de uso del equipo por sesión |
| `tool_custom_connector` | Promedio de llamadas a conectores personalizados por sesión |
| `tool_mcp` | Promedio de llamadas MCP (Model Context Protocol) por sesión |
| `tool_rest_api` | Promedio de llamadas a API REST por sesión |
| `prompts_basic` | Promedio de usos de prompts de IA básicos por sesión |
| `prompts_standard` | Promedio de usos de prompts de IA estándar por sesión |
| `prompts_premium` | Promedio de usos de prompts de IA premium por sesión |

### Cálculo

```
total_sessions = users × interactions_per_month

── Créditos de conocimiento ──
tenant_graph_credits    = total_sessions × (knowledge_pct/100) × (tenant_graph_pct/100) × 10
generative_answer_credits = total_sessions × (knowledge_pct/100) × (1 - tenant_graph_pct/100) × 2
classic_answer_credits  = total_sessions × (1 - knowledge_pct/100) × 1

── Créditos de herramientas de agente ──
tool_calls = total_sessions × (prompt + computer_use + custom_connector + mcp + rest_api)
tool_credits = tool_calls × 5

── Créditos de flujos de agente ──
flow_calls = total_sessions × tool_agent_flow
flow_credits = ceil(flow_calls / 100) × 13

── Créditos del modificador de prompts ──
basic_credits    = ceil(total_sessions × prompts_basic / 10) × 1
standard_credits = ceil(total_sessions × prompts_standard / 10) × 15
premium_credits  = ceil(total_sessions × prompts_premium / 10) × 100

── Total ──
total_credits = knowledge + tools + flows + prompts
cost_usd = total_credits × 0.01
```

## Ejemplos de facturación (de Microsoft Docs)

### Agente de atención al cliente

- 4 respuestas clásicas + 2 respuestas generativas por sesión
- 900 clientes/día
- **Diario**: `[(4×1) + (2×2)] × 900 = 7,200 créditos`
- **Mensual (30d)**: ~216,000 créditos = **~$2,160**

### Agente de rendimiento de ventas (fundamentado con el grafo del inquilino)

- 4 respuestas generativas + 4 respuestas fundamentadas con el grafo del inquilino por sesión
- 100 usuarios sin licencia
- **Diario**: `[(4×2) + (4×10)] × 100 = 4,800 créditos`
- **Mensual (30d)**: ~144,000 créditos = **~$1,440**

### Agente de procesamiento de pedidos

- 4 llamadas a acciones por desencadenante (autónomo)
- **Por desencadenante**: `4 × 5 = 20 créditos`

## Tipos de agentes para empleados frente a clientes

| Tipo de agente | ¿Incluido con M365 Copilot? |
|---|---|
| Dirigido a empleados (BtoE) | Las respuestas clásicas, las generativas y la fundamentación con el grafo del inquilino se incluyen sin costo cuando el usuario tiene una licencia de Microsoft 365 Copilot |
| Dirigido a clientes o socios | Todo el uso se factura normalmente |

## Medidas al superar la capacidad

- Se activan al alcanzar el **125%** de la capacidad de prepago
- Se deshabilitan los agentes personalizados (las conversaciones en curso continúan)
- Se envía una notificación por correo al administrador del inquilino
- Resolución: reasignar capacidad, comprar más o habilitar el pago por uso

## URL de fuentes actualizadas

Para obtener las tarifas más recientes, consulta el contenido de estas páginas:

- [Tarifas de facturación y administración](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management)
- [Licencias de Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing)
- [Guía de licencias de Copilot Studio (PDF)](https://go.microsoft.com/fwlink/?linkid=2320995)
