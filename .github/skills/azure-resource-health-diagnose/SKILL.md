---
name: "azure-resource-health-diagnose"
description: "Úsala cuando la persona informe de que un recurso de Azure desplegado falla, está degradado, sufre limitaciones de solicitudes o no está en buen estado, o pida investigarlo. Diagnostica un recurso concreto mediante sus registros, métricas y telemetría y genera un plan de corrección priorizado. Requiere que el recurso esté desplegado y emita telemetría. Los desencadenantes incluyen \"recurso en mal estado\", \"solucionar problemas de Azure\", \"por qué está fallando\", \"diagnosticar limitaciones\" e \"investigar recurso degradado\"."
---
# Estado de recursos de Azure y diagnóstico de problemas

Este flujo analiza un recurso concreto de Azure para evaluar su estado, diagnosticar problemas con registros y telemetría y elaborar un plan de corrección para los problemas detectados.

> [!NOTE]
> Esta skill depende del **servidor Azure MCP** (o de la CLI `az`) y requiere que el recurso de destino esté desplegado y emita telemetría. Prefiere las herramientas Azure MCP (`azmcp-*`) al uso directo de Azure CLI cuando ambas estén disponibles.

## Cuándo invocar

- "Nuestro App Service devuelve errores 500; diagnostícalo."
- "Investiga por qué este Cosmos DB está limitando solicitudes."
- "La cuenta de almacenamiento parece degradada; encuentra la causa raíz."
- "Investiga los problemas de esta VM y dame un plan de corrección."

## Prerrequisitos

- Servidor Azure MCP configurado y autenticado.
- Recurso de Azure de destino identificado (nombre y, opcionalmente, grupo de recursos o suscripción).
- El recurso debe estar desplegado y en ejecución para generar registros y telemetría.

## Pasos del flujo de trabajo

### Paso 1: Obtener buenas prácticas de Azure

Obtén buenas prácticas de diagnóstico y solución de problemas con la herramienta de buenas prácticas de Azure. Céntrate en supervisión del estado, análisis de registros y patrones de resolución, y úsalos para orientar el diagnóstico y las recomendaciones de corrección.

### Paso 2: Descubrir e identificar el recurso

1. **Localiza el recurso**:
   - Si solo se proporciona un nombre, busca entre suscripciones (`azmcp-subscription-list` o `az resource list --name <resource-name>`).
   - Si se encuentran varias coincidencias, pide a la persona que especifique la suscripción o el grupo de recursos.
   - Recopila el tipo y estado del recurso, su ubicación, etiquetas, configuración y dependencias.
2. **Detecta el tipo de recurso** para elegir los diagnósticos adecuados:

| Tipo de recurso | Diagnósticos principales |
|---|---|
| Web Apps / Function Apps | Registros de aplicación, métricas de rendimiento y seguimiento de dependencias |
| Máquinas virtuales | Registros del sistema, contadores de rendimiento y diagnóstico de arranque |
| Cosmos DB | Métricas de solicitudes, limitación de solicitudes y estadísticas de particiones |
| Cuentas de almacenamiento | Registros de acceso, métricas de rendimiento y disponibilidad |
| SQL Database | Rendimiento de consultas, registros de conexiones y uso de recursos |
| Application Insights | Telemetría de aplicación, excepciones y dependencias |
| Key Vault | Registros de acceso, estado de certificados y uso de secretos |
| Service Bus | Métricas de mensajes, colas de mensajes no procesados y rendimiento |

### Paso 3: Evaluar el estado

1. **Comprobación básica de estado**: estado de aprovisionamiento y funcionamiento, disponibilidad del servicio, cambios recientes de despliegue o configuración y uso actual (CPU, memoria, almacenamiento).
2. **Indicadores específicos del servicio**:

| Tipo de recurso | Indicadores de estado |
|---|---|
| Web Apps | Códigos y tiempos de respuesta HTTP, tiempo de actividad |
| Bases de datos | Tasa de conexiones correctas, rendimiento de consultas e interbloqueos |
| Storage | Porcentaje de disponibilidad, tasa de solicitudes correctas y latencia |
| VM | Diagnóstico de arranque, métricas del sistema operativo invitado y conectividad de red |
| Functions | Tasa de ejecuciones correctas, duración y frecuencia de errores |

### Paso 4: Analizar registros y telemetría

1. **Encuentra fuentes de supervisión**: identifica áreas de trabajo de Log Analytics (`azmcp-monitor-workspace-list`), instancias asociadas de Application Insights y tablas de registros pertinentes (`azmcp-monitor-table-list`).
2. **Ejecuta consultas de diagnóstico** con `azmcp-monitor-log-query`, eligiendo KQL según el tipo de recurso.

Análisis general de errores:

```kql
union isfuzzy=true
    AzureDiagnostics,
    AppServiceHTTPLogs,
    AppServiceAppLogs,
    AzureActivity
| where TimeGenerated > ago(24h)
| where Level == "Error" or ResultType != "Success"
| summarize ErrorCount=count() by Resource, ResultType, bin(TimeGenerated, 1h)
| order by TimeGenerated desc
```

Análisis de rendimiento:

```kql
Perf
| where TimeGenerated > ago(7d)
| where ObjectName == "Processor" and CounterName == "% Processor Time"
| summarize avg(CounterValue) by Computer, bin(TimeGenerated, 1h)
| where avg_CounterValue > 80
```

Consultas específicas de la aplicación:

```kql
requests
| where timestamp > ago(24h)
| where success == false
| summarize FailureCount=count() by resultCode, bin(timestamp, 1h)
| order by timestamp desc
```

3. **Reconoce patrones**: errores o anomalías recurrentes, correlación con cambios de despliegue o configuración, tendencias de degradación del rendimiento y fallos de dependencias o servicios externos.

### Paso 5: Clasificar problemas y analizar sus causas raíz

1. **Clasifica la gravedad**:

| Gravedad | Significado |
|---|---|
| Crítica | Servicio no disponible, pérdida de datos o vulneración de seguridad |
| Alta | Degradación del rendimiento, fallos intermitentes o tasa de errores elevada |
| Media | Advertencias, configuración poco óptima o problemas menores de rendimiento |
| Baja | Alertas informativas u oportunidades de optimización |

2. **Determina la categoría de la causa raíz**: problema de configuración, limitación de recursos (CPU, memoria, disco o solicitudes), problema de red, problema de aplicación (error, fuga de memoria, consulta ineficiente), dependencia externa o problema de seguridad (fallo de autenticación, certificado caducado).
3. **Evalúa el impacto**: usuarios y sistemas afectados, consecuencias para la integridad y seguridad de los datos y prioridades de tiempo de recuperación.

### Paso 6: Generar un plan de corrección

1. **Acciones inmediatas** (gravedad crítica): correcciones de emergencia para restablecer la disponibilidad, soluciones temporales y procedimientos de escalamiento.
2. **Correcciones a corto plazo** (gravedad alta o media): ajustes de configuración, escalado de recursos, parches y mejoras de supervisión.
3. **Mejoras a largo plazo**: cambios de arquitectura para aumentar la resiliencia, medidas preventivas y documentación.
4. **Pasos de implementación**: elementos priorizados con comandos concretos de Azure CLI, pruebas y validación, planes de reversión y supervisión posterior al cambio.

### Paso 7: Confirmación de la persona y generación del informe

Presenta un resumen y condiciona las medidas de corrección a la aprobación de la persona:

```text
Evaluación del estado del recurso de Azure

Descripción general del recurso:
- Recurso: [Nombre] ([Tipo])
- Estado: [Correcto/Advertencia/Crítico]
- Ubicación: [Región]
- Último análisis: [Marca de tiempo]

Problemas identificados:
- Críticos: X problemas que requieren atención inmediata
- Altos: Y problemas que afectan al rendimiento o la fiabilidad
- Medios: Z problemas de optimización
- Bajos: N elementos informativos

Problemas principales:
1. [Tipo de problema]: [Descripción] - Impacto: [Alto/Medio/Bajo]

Plan de corrección:
- Acciones inmediatas: X elementos
- Correcciones a corto plazo: Y elementos
- Mejoras a largo plazo: Z elementos
- Tiempo estimado de resolución: [Plazo]

¿Continuar con el plan detallado de corrección? (y/n)
```

Tras la aprobación, genera el informe detallado con la plantilla de salida siguiente.

## Gestión de errores

| Situación | Acción |
|---|---|
| Recurso no encontrado | Solicitar el nombre y la ubicación exactos |
| Problemas de autenticación | Guiar a la persona en la configuración de autenticación de Azure |
| Permisos insuficientes | Enumerar los roles RBAC de solo lectura necesarios |
| No hay registros disponibles | Sugerir habilitar la configuración de diagnóstico y esperar a recibir datos |
| Consultas que agotan el tiempo de espera | Dividir el análisis en intervalos de tiempo más pequeños |
| Carencias específicas del servicio | Proporcionar una evaluación genérica del estado e indicar las limitaciones |

## Plantilla de salida

La skill escribe un informe de estado. Bajo su título H1 (`Informe de estado del recurso de Azure: <recurso>`), contiene:

````markdown
## Resumen ejecutivo

<visión general del estado y de los hallazgos principales>

## Métricas de estado

- Disponibilidad: X% en las últimas 24h
- Tasa de errores: X% en las últimas 24h
- Uso de recursos: porcentajes de CPU, memoria y almacenamiento

## Problemas identificados

### Problemas críticos

- <Problema>: causa raíz, impacto de negocio y acción inmediata

### Problemas de prioridad alta

- <Problema>: causa raíz, impacto en la fiabilidad y corrección recomendada

## Plan de corrección

### Fase 1: Acciones inmediatas (0-2 horas)

```bash
<comandos de Azure CLI para restablecer el servicio, con explicaciones>
```

### Fase 2: Correcciones a corto plazo (2-24 horas)

```bash
<comandos de Azure CLI para mejorar la fiabilidad>
```

### Fase 3: Mejoras a largo plazo (1-4 semanas)

```bash
<comandos de Azure CLI y cambios de configuración>
```

## Pasos de validación

- [ ] Verificar la resolución de los problemas mediante registros
- [ ] Confirmar las mejoras de rendimiento
- [ ] Probar la funcionalidad de la aplicación
- [ ] Actualizar la supervisión y las alertas
````

## Puerta de calidad

- [ ] El estado del recurso se evalúa con precisión a partir de registros, métricas y telemetría.
- [ ] Todos los problemas importantes se identifican y clasifican por gravedad.
- [ ] Se completa el análisis de causa raíz para cada hallazgo crítico o alto.
- [ ] El plan de corrección proporciona pasos específicos de Azure CLI con validación y reversión.
- [ ] Los problemas se priorizan por impacto de negocio, con recomendaciones de supervisión y prevención.
- [ ] Las acciones detalladas de corrección se realizan solo tras la confirmación explícita de la persona.
