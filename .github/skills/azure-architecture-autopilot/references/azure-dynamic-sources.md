# Registro de fuentes dinámicas de Azure

Este archivo gestiona **únicamente las fuentes (URL) de información que cambia con frecuencia**.
Los valores concretos (versión de API, SKU, región, etc.) no se registran aquí.
Consulta siempre las URL siguientes para verificar la información más reciente antes de generar Bicep.

---

## 1. Versión de API de Bicep (consulta siempre obligatoria)

Referencia de Bicep de MS Docs por servicio. Verifica la apiVersion estable más reciente en estas URL antes de usarla.

| Servicio | URL de MS Docs |
|---------|-------------|
| CognitiveServices (Foundry/OpenAI) | https://learn.microsoft.com/en-us/azure/templates/microsoft.cognitiveservices/accounts |
| AI Search | https://learn.microsoft.com/en-us/azure/templates/microsoft.search/searchservices |
| Cuenta de almacenamiento | https://learn.microsoft.com/en-us/azure/templates/microsoft.storage/storageaccounts |
| Key Vault | https://learn.microsoft.com/en-us/azure/templates/microsoft.keyvault/vaults |
| Red virtual | https://learn.microsoft.com/en-us/azure/templates/microsoft.network/virtualnetworks |
| Puntos de conexión privados | https://learn.microsoft.com/en-us/azure/templates/microsoft.network/privateendpoints |
| Zonas DNS privadas | https://learn.microsoft.com/en-us/azure/templates/microsoft.network/privatednszones |
| Fabric | https://learn.microsoft.com/en-us/azure/templates/microsoft.fabric/capacities |
| Data Factory | https://learn.microsoft.com/en-us/azure/templates/microsoft.datafactory/factories |
| Application Insights | https://learn.microsoft.com/en-us/azure/templates/microsoft.insights/components |
| Área de trabajo de ML (Hub) | https://learn.microsoft.com/en-us/azure/templates/microsoft.machinelearningservices/workspaces |

> **Verifica siempre también los recursos secundarios**: recursos como `accounts/projects`, `accounts/deployments` y `privateDnsZones/virtualNetworkLinks` pueden tener versiones de API distintas de las de su recurso principal. Sigue los enlaces a los recursos secundarios desde la página del principal para comprobarlo.

### Servicios no incluidos en la tabla anterior

La tabla anterior incluye únicamente los servicios del alcance de v1. Para otros servicios, construye la URL con este formato y consúltala:

```
https://learn.microsoft.com/en-us/azure/templates/microsoft.{provider}/{resourceType}
```

---

## 2. Disponibilidad de modelos (obligatoria al usar modelos de Foundry/OpenAI)

Verifica si el modelo indicado puede desplegarse en la región de destino. No te bases en conocimiento estático.

| Método de verificación | URL / Comando |
|--------------------|---------------|
| Disponibilidad de modelos en MS Docs | https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models |
| Azure CLI (recursos existentes) | `az cognitiveservices account list-models --name "<NAME>" --resource-group "<RG>" -o table` |

> Si el modelo no está disponible en la región de destino, informa a la persona y sugiere regiones disponibles o modelos alternativos. No lo sustituyas sin su aprobación.

---

## 3. Mapeo de puntos de conexión privados (al añadir servicios nuevos)

Azure puede cambiar las correspondencias entre groupId de los puntos de conexión privados (PE) y zonas DNS. Al añadir servicios nuevos o cuando sea necesario verificar:

| Método de verificación | URL |
|--------------------|-----|
| Documentación oficial de integración DNS de PE | https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns |

> Las correspondencias de los servicios principales en `service-gotchas.md` son estables, pero vuelve a verificarlas siempre en la URL anterior al añadir servicios nuevos.

---

## 4. Disponibilidad de servicios por región

Verifica si un servicio concreto está disponible en una región determinada:

| Método de verificación | URL |
|--------------------|-----|
| Disponibilidad de servicios de Azure por región | https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/ |

---

## 5. Azure Updates (información complementaria)

Las fuentes siguientes son **solo de referencia**. La fuente principal es siempre la documentación oficial de MS Docs.

| Fuente | URL | Finalidad |
|--------|-----|---------|
| Azure Updates | https://azure.microsoft.com/en-us/updates/ | Conocer los cambios de los servicios |
| Novedades de Azure | Páginas de novedades de cada servicio en Docs | Verificar cambios de funcionalidades |

---

## Regla de decisión: ¿cuándo consultar las fuentes?

| Tipo de información | ¿Consulta obligatoria? | Justificación |
|-----------------|-------------|-----------|
| Versión de API | **Consultar siempre** | Cambia con frecuencia; los valores incorrectos hacen fallar el despliegue |
| Disponibilidad de modelos (nombre, región) | **Consultar siempre** | Varía por región y cambia con frecuencia |
| Lista de SKU | **Consultar siempre** | Puede cambiar según el servicio |
| Disponibilidad regional | **Consultar siempre** | Las regiones admitidas por cada servicio cambian con frecuencia. Verifica siempre que la región indicada por la persona esté disponible para el servicio |
| groupId de PE y zona DNS | Se puede consultar `service-gotchas.md` para los servicios principales de v1; **la consulta externa es obligatoria para servicios nuevos o configuraciones complejas (Monitor, etc.)** | Las correspondencias de los servicios principales son estables, pero los servicios nuevos o complejos presentan riesgos |
| Patrones de propiedades obligatorias | Primero los archivos de referencia | Prácticamente inmutables (isHnsEnabled, etc.) |
