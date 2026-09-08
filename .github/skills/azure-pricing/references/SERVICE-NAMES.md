# Referencia de nombres de servicios de Azure

El campo `serviceName` de la API Azure Retail Prices **distingue entre mayúsculas y minúsculas**. Usa esta referencia para encontrar el nombre exacto del servicio que debes utilizar en los filtros.

## Proceso

| Servicio | Valor de `serviceName` |
|---------|-------------------|
| Virtual Machines | `Virtual Machines` |
| Azure Functions | `Functions` |
| Azure App Service | `Azure App Service` |
| Azure Container Apps | `Azure Container Apps` |
| Azure Container Instances | `Container Instances` |
| Azure Kubernetes Service | `Azure Kubernetes Service` |
| Azure Batch | `Azure Batch` |
| Azure Spring Apps | `Azure Spring Apps` |
| Azure VMware Solution | `Azure VMware Solution` |

## Almacenamiento

| Servicio | Valor de `serviceName` |
|---------|-------------------|
| Azure Storage (Blob, Files, Queues, Tables) | `Storage` |
| Azure NetApp Files | `Azure NetApp Files` |
| Azure Backup | `Backup` |
| Azure Data Box | `Data Box` |

> **Nota**: Blob Storage, Files, Disk Storage y Data Lake Storage se agrupan bajo el único nombre de servicio `Storage`. Usa `meterName` o `productName` para distinguirlos (por ejemplo, `contains(meterName, 'Blob')`).

## Bases de datos

| Servicio | Valor de `serviceName` |
|---------|-------------------|
| Azure Cosmos DB | `Azure Cosmos DB` |
| Azure SQL Database | `SQL Database` |
| Azure SQL Managed Instance | `SQL Managed Instance` |
| Azure Database for PostgreSQL | `Azure Database for PostgreSQL` |
| Azure Database for MySQL | `Azure Database for MySQL` |
| Azure Cache for Redis | `Redis Cache` |

## IA y aprendizaje automático

| Servicio | Valor de `serviceName` |
|---------|-------------------|
| Azure AI Foundry Models (incluido OpenAI) | `Foundry Models` |
| Azure AI Foundry Tools | `Foundry Tools` |
| Azure Machine Learning | `Azure Machine Learning` |
| Azure Cognitive Search (AI Search) | `Azure Cognitive Search` |
| Azure Bot Service | `Azure Bot Service` |

> **Nota**: Los precios de Azure OpenAI ahora se encuentran bajo `Foundry Models`. Usa `contains(productName, 'OpenAI')` o `contains(meterName, 'GPT')` para filtrar los modelos específicos de OpenAI.

## Redes

| Servicio | Valor de `serviceName` |
|---------|-------------------|
| Azure Load Balancer | `Load Balancer` |
| Azure Application Gateway | `Application Gateway` |
| Azure Front Door | `Azure Front Door Service` |
| Azure CDN | `Azure CDN` |
| Azure DNS | `Azure DNS` |
| Azure Virtual Network | `Virtual Network` |
| Azure VPN Gateway | `VPN Gateway` |
| Azure ExpressRoute | `ExpressRoute` |
| Azure Firewall | `Azure Firewall` |

## Análisis

| Servicio | Valor de `serviceName` |
|---------|-------------------|
| Azure Synapse Analytics | `Azure Synapse Analytics` |
| Azure Data Factory | `Azure Data Factory v2` |
| Azure Stream Analytics | `Azure Stream Analytics` |
| Azure Databricks | `Azure Databricks` |
| Azure Event Hubs | `Event Hubs` |

## Integración

| Servicio | Valor de `serviceName` |
|---------|-------------------|
| Azure Service Bus | `Service Bus` |
| Azure Logic Apps | `Logic Apps` |
| Azure API Management | `API Management` |
| Azure Event Grid | `Event Grid` |

## Administración y supervisión

| Servicio | Valor de `serviceName` |
|---------|-------------------|
| Azure Monitor | `Azure Monitor` |
| Azure Log Analytics | `Log Analytics` |
| Azure Key Vault | `Key Vault` |
| Azure Backup | `Backup` |

## Web

| Servicio | Valor de `serviceName` |
|---------|-------------------|
| Azure Static Web Apps | `Azure Static Web Apps` |
| Azure SignalR | `Azure SignalR Service` |

## Consejos

- Si no tienes claro el nombre de un servicio, **filtra primero por `serviceFamily`** para descubrir los valores válidos de `serviceName` en la respuesta.
- Ejemplo: `serviceFamily eq 'Databases' and armRegionName eq 'eastus'` devolverá todos los nombres de servicios de bases de datos.
- Algunos servicios tienen varias entradas `serviceName` para distintos niveles o generaciones.
