---
name: "azure-pricing"
description: "Úsala cuando la persona pregunte por el costo de un servicio de Azure, quiera comparar precios de SKU o regiones, necesite datos de precios para una estimación o consulte los precios de Copilot Studio y el consumo de créditos de los agentes. Obtiene precios minoristas en tiempo real de la API pública Azure Retail Prices (sin autenticación) y estima créditos de Copilot Studio. Los desencadenantes incluyen \"precios de Azure\", \"cuánto cuesta\", \"comparar precio de SKU\", \"estimación de costo\" y \"créditos de Copilot Studio\". Para convertir una carga existente en incidencias de optimización de costos, usa az-cost-optimize."
---
# Precios de Azure

Obtén precios minoristas de Azure en tiempo real desde la API pública Azure Retail Prices. No se requiere autenticación, solo acceso HTTPS saliente a `prices.azure.com`.

> [!NOTE]
> Esta skill depende del acceso web saliente (la herramienta integrada `web_fetch` o equivalente) para acceder a `prices.azure.com`. Si no hay acceso web, indícalo y recurre a las tarifas almacenadas en los archivos de referencia.

## Cuándo invocar

- "¿Cuánto cuesta una VM Standard_D4s_v5 en East US?"
- "Compara los precios de Blob Storage entre regiones."
- "Dame una estimación mensual para esta arquitectura."
- "¿Cuántos créditos de Copilot consumirá nuestro agente al mes?"

## Punto de conexión de la API

```text
GET https://prices.azure.com/api/retail/prices?api-version=2023-01-01-preview
```

Añade `$filter` como parámetro de consulta con la sintaxis de filtros OData. Usa siempre `api-version=2023-01-01-preview` para incluir los datos de planes de ahorro.

## Paso a paso

Si algún aspecto de la solicitud no está claro, haz preguntas aclaratorias para identificar los campos y valores de filtro correctos antes de llamar a la API.

1. **Identifica los campos de filtro** de la solicitud (nombre del servicio, región, SKU y tipo de precio).
2. **Resuelve la región** a un `armRegionName`, en minúsculas y sin espacios (`East US` pasa a `eastus`, `West Europe` a `westeurope`). Consulta la lista completa en [references/REGIONS.md](references/REGIONS.md).
3. **Construye la cadena de filtro** con los campos siguientes y consulta la URL.
4. **Analiza la matriz `Items`** de la respuesta JSON; cada elemento contiene precio y metadatos.
5. **Sigue la paginación** mediante `NextPageLink` solo si necesitas más de los primeros 1000 resultados (rara vez es necesario).
6. **Calcula las estimaciones** con las fórmulas de [references/COST-ESTIMATOR.md](references/COST-ESTIMATOR.md) para obtener importes mensuales y anuales.
7. **Presenta los resultados** en una tabla de resumen con servicio, SKU, región, precio unitario y estimaciones mensuales y anuales.

## Campos que admiten filtros

| Campo | Tipo | Ejemplo |
|---|---|---|
| `serviceName` | string (exacto, distingue mayúsculas y minúsculas) | `'Functions'`, `'Virtual Machines'`, `'Storage'` |
| `serviceFamily` | string (exacto, distingue mayúsculas y minúsculas) | `'Compute'`, `'Storage'`, `'Databases'`, `'AI + Machine Learning'` |
| `armRegionName` | string (exacto, en minúsculas) | `'eastus'`, `'westeurope'`, `'southeastasia'` |
| `armSkuName` | string (exacto) | `'Standard_D4s_v5'`, `'Standard_LRS'` |
| `skuName` | string (admite contains) | `'D4s v5'` |
| `priceType` | string | `'Consumption'`, `'Reservation'`, `'DevTestConsumption'` |
| `meterName` | string (admite contains) | `'Spot'` |

Usa `eq` para igualdad, `and` para combinar condiciones y `contains(field, 'value')` para coincidencias parciales.

## Ejemplos de cadenas de filtro

| Finalidad | Valor de `$filter` |
|---|---|
| Precios de consumo de Functions en East US | `serviceName eq 'Functions' and armRegionName eq 'eastus' and priceType eq 'Consumption'` |
| VM D4s v5 en West Europe (consumo) | `armSkuName eq 'Standard_D4s_v5' and armRegionName eq 'westeurope' and priceType eq 'Consumption'` |
| Todos los precios de Storage en una región | `serviceName eq 'Storage' and armRegionName eq 'eastus'` |
| Precios Spot de una SKU concreta | `armSkuName eq 'Standard_D4s_v5' and contains(meterName, 'Spot') and armRegionName eq 'eastus'` |
| Precios de reserva de un año | `serviceName eq 'Virtual Machines' and priceType eq 'Reservation' and armRegionName eq 'eastus'` |
| Azure AI / OpenAI (Foundry Models) | `serviceName eq 'Foundry Models' and armRegionName eq 'eastus' and priceType eq 'Consumption'` |
| Azure Cosmos DB | `serviceName eq 'Azure Cosmos DB' and armRegionName eq 'eastus' and priceType eq 'Consumption'` |

## Ejemplo de URL completa de consulta

```text
https://prices.azure.com/api/retail/prices?api-version=2023-01-01-preview&$filter=serviceName eq 'Functions' and armRegionName eq 'eastus' and priceType eq 'Consumption'
```

Al construir la URL, codifica los espacios como `%20` y las comillas como `%27`.

## Campos principales de respuesta

```json
{
  "Items": [
    {
      "retailPrice": 0.000016,
      "unitPrice": 0.000016,
      "currencyCode": "USD",
      "unitOfMeasure": "1 Execution",
      "serviceName": "Functions",
      "skuName": "Premium",
      "armRegionName": "eastus",
      "meterName": "vCPU Duration",
      "productName": "Functions",
      "priceType": "Consumption",
      "isPrimaryMeterRegion": true,
      "savingsPlan": [
        { "unitPrice": 0.000012, "term": "1 Year" },
        { "unitPrice": 0.000010, "term": "3 Years" }
      ]
    }
  ],
  "NextPageLink": null,
  "Count": 1
}
```

Usa solo elementos donde `isPrimaryMeterRegion` sea `true`, salvo que la persona solicite específicamente medidores no primarios.

## Valores admitidos de serviceFamily

`Analytics`, `Compute`, `Containers`, `Data`, `Databases`, `Developer Tools`, `Integration`, `Internet of Things`, `Management and Governance`, `Networking`, `Security`, `Storage`, `Web`, `AI + Machine Learning`.

## Consejos

- Los valores de `serviceName` distinguen mayúsculas y minúsculas. Si tienes dudas, filtra primero por `serviceFamily` para descubrir valores válidos de `serviceName`.
- Si no hay resultados, amplía el filtro (elimina primero las restricciones de `priceType` o región).
- Los precios están en USD salvo que se establezca `currencyCode` en la solicitud.
- Para precios de planes de ahorro, busca la matriz `savingsPlan` de cada elemento (solo está presente con `2023-01-01-preview`).
- Consulta los nombres habituales de servicios y su uso correcto de mayúsculas en [references/SERVICE-NAMES.md](references/SERVICE-NAMES.md).

## Solución de problemas

| Problema | Solución |
|---|---|
| Resultados vacíos | Amplía el filtro; elimina primero `priceType` o `armRegionName` |
| Nombre de servicio incorrecto | Usa el filtro `serviceFamily` para descubrir valores válidos de `serviceName` |
| Faltan datos de planes de ahorro | Asegúrate de que la URL incluya `api-version=2023-01-01-preview` |
| Errores de URL | Comprueba la codificación: espacios como `%20`, comillas como `%27` |
| Demasiados resultados | Añade campos de filtro (región, SKU, priceType) para acotar la consulta |

## Estimación del uso de agentes de Copilot Studio

Usa esta sección cuando la persona pregunte por los precios de Copilot Studio, los créditos de Copilot o los costos de uso de agentes.

### Datos clave

- **1 crédito de Copilot = 0.01 USD.**
- Los créditos se comparten en todo el inquilino.
- Los agentes para empleados cuyos usuarios tienen licencia de M365 Copilot reciben respuestas clásicas, generativas y fundamentación con el grafo del inquilino sin costo.
- Las medidas por exceso de consumo se activan al alcanzar el 125% de la capacidad de prepago.

### Pasos de estimación

1. **Recopila las entradas**: tipo de agente (empleados/clientes), número de usuarios, interacciones al mes, porcentaje de conocimiento, porcentaje de grafo del inquilino y uso de herramientas por sesión.
2. **Consulta las tarifas de facturación vigentes** con la herramienta de consulta web para que la estimación use los precios actuales de Microsoft.
3. **Analiza el contenido consultado** para extraer la tabla actual de tarifas (créditos por tipo de funcionalidad).
4. **Calcula la estimación**:
   - `total_sessions = users * interactions_per_month`
   - Créditos de conocimiento: aplica las tarifas de fundamentación con el grafo del inquilino, respuestas generativas y respuestas clásicas.
   - Créditos de herramientas de agente: aplica la tarifa de acción de agente por llamada a herramienta.
   - Créditos de flujos de agente: aplica la tarifa de flujo por 100 acciones.
   - Créditos del modificador de prompts: aplica las tarifas básicas, estándar o premium por 10 respuestas.
5. **Presenta los resultados** en una tabla desglosada por categoría, con los créditos totales y el costo estimado en USD.

### URL de origen que consultar

| URL | Contenido |
|---|---|
| `https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management` | Tabla de tarifas, ejemplos de facturación y reglas de exceso de consumo |
| `https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing` | Opciones de licencia, prestaciones incluidas en M365 Copilot y prepago frente a pago por uso |

Consulta al menos la primera URL (tarifas de facturación) antes de calcular. En [references/COPILOT-STUDIO-RATES.md](references/COPILOT-STUDIO-RATES.md) hay una instantánea almacenada de tarifas, fórmulas y ejemplos (alternativa cuando no sea posible consultar la web).

## Plantilla de salida

Presenta los precios minoristas en una tabla e indica la fuente y las suposiciones:

```markdown
## Precios de Azure: Standard_D4s_v5, eastus

| Servicio | SKU | Región | Precio unitario | Unidad | Est. mensual |
|---|---|---|---|---|---|
| Virtual Machines | Standard_D4s_v5 | eastus | $0.192 | 1 hora | ~$140 (730 h) |
| Virtual Machines | Standard_D4s_v5 (plan de ahorro de 1 año) | eastus | $0.113 | 1 hora | ~$82 (730 h) |

Fuente: API Azure Retail Prices, api-version 2023-01-01-preview, consultada el 2026-08-17. Precios en USD; se asumen 730 h/mes y solo isPrimaryMeterRegion.
```

## Puerta de calidad

- [ ] La región se resuelve a un `armRegionName` válido en minúsculas.
- [ ] El filtro usa `serviceName`/`serviceFamily` exactos, respetando mayúsculas y minúsculas.
- [ ] Solo se usan elementos `isPrimaryMeterRegion == true`, salvo que se hayan solicitado medidores no primarios.
- [ ] Se usa `api-version=2023-01-01-preview` para disponer de datos de planes de ahorro cuando corresponda.
- [ ] Las estimaciones mensuales y anuales indican sus suposiciones (horas, cantidad) y citan la API y la fecha de consulta.
- [ ] Se indica la moneda (USD, salvo que la solicitud especifique otra).
- [ ] Las estimaciones de Copilot Studio usan tarifas recién consultadas o indican explícitamente la alternativa almacenada en caché.
