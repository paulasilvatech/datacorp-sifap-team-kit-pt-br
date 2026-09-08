---
name: "azure-well-architected-review"
description: "Úsala cuando la persona solicite una revisión de Azure Well-Architected Framework, una evaluación de arquitectura o una auditoría de fiabilidad, seguridad, costo, rendimiento o excelencia operativa de una carga de Azure. Revisa los cinco pilares WAF frente a la IaC de la carga (Terraform en este kit; también puede leer Bicep/ARM) y los recursos desplegados, y abre incidencias de GitHub para los hallazgos. Los desencadenantes incluyen \"revisión WAF\", \"well-architected\", \"evaluación de arquitectura\", \"auditoría de fiabilidad\" y \"revisión de seguridad de Azure\"."
---
# Revisión de Azure Well-Architected

Este flujo realiza una revisión estructurada de Azure Well-Architected Framework (WAF) sobre los archivos IaC y la infraestructura desplegada de una carga de trabajo. Identifica riesgos en los cinco pilares WAF y crea incidencias de GitHub para dar seguimiento a su corrección.

> [!NOTE]
> La IaC de este kit es **Terraform (`azurerm ~> 3.x`)**. La revisión lee la IaC existente (Terraform, Bicep o ARM), pero los ejemplos de corrección se escriben en Terraform. Los fragmentos Bicep/ARM son solo ilustrativos y quedan fuera del alcance de los entregables del kit. Esta skill también requiere autenticación en la **CLI `az`** y el **servidor GitHub MCP** (o `gh`).

## Cuándo invocar

- "Realiza una revisión Well-Architected de nuestra carga de trabajo de Azure."
- "Audita esta arquitectura en busca de riesgos de fiabilidad y seguridad."
- "¿Seguimos las buenas prácticas de Azure en los cinco pilares?"
- "Abre incidencias de GitHub para las carencias WAF de nuestra infraestructura."

## Prerrequisitos

- Azure CLI (`az`) configurada y autenticada.
- Archivos IaC presentes en el repositorio (se prefiere Terraform; también pueden leerse Bicep o ARM).
- Servidor GitHub MCP (o `gh`) configurado y autenticado.

## Pasos del flujo de trabajo

### Paso 1: Cargar la referencia de Well-Architected Framework

Consulta las buenas prácticas actuales de Azure WAF:

- `https://learn.microsoft.com/en-us/azure/well-architected/`
- Guías de los servicios de Azure utilizados (`https://learn.microsoft.com/en-us/azure/well-architected/service-guides/`)
- Orientaciones específicas pertinentes para el tipo de carga de trabajo (SaaS, misión crítica, IA y similares)

Si está disponible el servidor MCP `microsoft.docs.mcp`, úsalo para consultar las listas de verificación de pilares y recomendaciones específicas de servicios más recientes.

### Paso 2: Descubrir la IaC y la arquitectura

Define el alcance de la revisión e inventaría tanto el código como el entorno activo:

1. **Confirma el alcance de Azure**: pregunta qué suscripciones y grupos de recursos están incluidos, o dedúcelos de los parámetros IaC y confírmalos.
2. **Busca archivos IaC en el repositorio**:
   - Terraform: `**/*.tf` (proveedores azurerm/azapi), la IaC principal del kit
   - Bicep: `**/*.bicep`, `bicepconfig.json`
   - Plantillas ARM: `**/azuredeploy*.json`, `**/*.template.json` y archivos cuyo `$schema` contenga `deploymentTemplate`
3. **Inventaría los recursos activos** (siempre, aunque exista IaC): `az resource list --resource-group <rg> --output json` (o para toda la suscripción), además de llamadas específicas `az <service> show` para obtener la configuración necesaria para las comprobaciones de pilares.
4. **Compara la IaC con el inventario activo**: señala las desviaciones, como recursos presentes en Azure pero ausentes de IaC (creados desde el portal), recursos definidos en IaC pero no desplegados y diferencias de configuración. Registra esos hallazgos para el paso 3 (suelen corresponder al pilar Excelencia operativa).

Identifica los servicios principales de Azure utilizados (proceso, datos, redes, seguridad, observabilidad) y genera un diagrama Mermaid de arquitectura.

### Paso 3: Revisión por pilar

#### Pilar 1: Fiabilidad

- [ ] Zonas de disponibilidad habilitadas para servicios zonales (VM, VMSS, grupos de nodos AKS, App Service, SQL, Storage ZRS)
- [ ] Las SKU de producción admiten el SLA requerido (sin niveles Basic/Free en rutas críticas)
- [ ] Copias de seguridad y restauración a un momento dado de Azure SQL / Cosmos DB configuradas con retención adecuada
- [ ] Redundancia geográfica configurada donde lo exige el RPO (almacenamiento GRS/RA-GRS, grupos de conmutación por error SQL, Cosmos DB multirregión)
- [ ] Reglas de escalado automático configuradas para planes App Service, VMSS y AKS (sin una única instancia fija en producción)
- [ ] Sondeos de estado configurados en los backends de Load Balancer / Application Gateway / Front Door
- [ ] Envío a colas de mensajes no procesados habilitado para colas y suscripciones de Service Bus y suscripciones de Event Grid
- [ ] Políticas de reintento con espera exponencial implementadas para gestionar fallos transitorios
- [ ] Plan de recuperación ante desastres definido (RTO/RPO documentados y conmutación por error probada)

#### Pilar 2: Seguridad

- [ ] Uso de identidades administradas en lugar de entidades de servicio con secretos o cadenas de conexión
- [ ] Sin credenciales, claves ni cadenas de conexión incrustadas en IaC o código
- [ ] Secretos almacenados en Azure Key Vault con autorización RBAC (no directivas de acceso)
- [ ] Las cuentas de almacenamiento deniegan el acceso público a blobs y no permiten acceso con claves compartidas cuando sea posible
- [ ] Puntos de conexión privados (o, como mínimo, puntos de conexión de servicio y reglas de firewall) para servicios de datos PaaS
- [ ] Los NSG restringen el tráfico entrante a los puertos y CIDR mínimos necesarios (sin reglas de permiso de `*` a `*`)
- [ ] TLS 1.2+ obligatorio en todos los puntos de conexión (`minimumTlsVersion`, `httpsOnly`)
- [ ] Azure RBAC sigue el privilegio mínimo (sin Owner/Contributor en ámbito de suscripción para identidades de cargas de trabajo)
- [ ] Microsoft Defender for Cloud habilitado en los tipos de recurso pertinentes (`az security pricing list`)
- [ ] Azure WAF (Application Gateway o Front Door) configurado para puntos de conexión web públicos
- [ ] La configuración de diagnóstico envía registros de seguridad a Log Analytics / Microsoft Sentinel

#### Pilar 3: Optimización de costos

- [ ] Reservas o planes de ahorro evaluados para cargas de proceso estables (VM, App Service, SQL)
- [ ] Políticas de ciclo de vida del almacenamiento que trasladan blobs a niveles de acceso esporádico o archivo
- [ ] SKU dimensionadas según el uso real (sin VM ni planes App Service sobredimensionados)
- [ ] Los entornos de desarrollo y pruebas usan apagado automático programado y precios Dev/Test cuando son elegibles
- [ ] Azure Budgets y alertas de costo configurados (`az consumption budget list`)
- [ ] Discos administrados sin conectar e IP públicas huérfanas identificados y eliminados
- [ ] Niveles de consumo o sin servidor para cargas con picos o poco volumen (Functions, Container Apps, SQL sin servidor)
- [ ] Retención y límites de datos de Log Analytics ajustados para evitar excesos de ingesta

#### Pilar 4: Excelencia operativa

- [ ] Toda la infraestructura definida como IaC (sin cambios manuales en el portal; asignaciones de denegación o políticas donde sea viable)
- [ ] Estrategia de etiquetado coherente en todos los recursos (responsable, entorno, centro de costos)
- [ ] Alertas de Azure Monitor definidas para las métricas principales y el estado del servicio
- [ ] Canalización de despliegue automatizada presente (GitHub Actions / Azure Pipelines, sin despliegues manuales)
- [ ] Azure Activity Log y la configuración de diagnóstico de recursos dirigidos a Log Analytics
- [ ] Application Insights (o un equivalente OpenTelemetry) instrumentado para las cargas de aplicación
- [ ] Asignaciones de Azure Policy que exigen los estándares de la organización (ubicaciones, SKU y etiquetas permitidas)
- [ ] Guías operativas o documentación de operaciones disponibles

#### Pilar 5: Eficiencia del rendimiento

- [ ] SKU de proceso dimensionadas adecuadamente y validadas frente a los requisitos de carga
- [ ] Caché implementada donde aporta beneficios (Azure Cache for Redis, caché de CDN/Front Door)
- [ ] Azure Front Door o CDN usado para distribución global de contenido estático
- [ ] Escalado automático basado en métricas de carga en lugar de números fijos de instancias
- [ ] Nivel de rendimiento de base de datos adecuado (DTU frente a vCore, grupos elásticos, escalado automático de RU de Cosmos DB)
- [ ] Almacenamiento Premium o con redundancia de zona para cargas de disco sensibles a la latencia
- [ ] Agrupación de conexiones y patrones asíncronos en clientes de bases de datos y HTTP

### Paso 4: Clasificar riesgos

Para cada hallazgo, clasifica:

| Riesgo | Significado |
|---|---|
| Alto | Vulnerabilidad de seguridad, punto único de fallo o ausencia de copias de seguridad y recuperación |
| Medio | Fiabilidad poco óptima, ineficiencia de costos o problema de rendimiento |
| Bajo | Desviación de buenas prácticas u oportunidad menor de optimización |

### Paso 5: Confirmación de la persona

Presenta el resumen y exige aprobación explícita antes de crear incidencias de GitHub:

```text
Resumen de la revisión Azure Well-Architected

Resultados de la revisión:
- Archivos IaC analizados: X
- Servicios de Azure identificados: Y
- Total de hallazgos: Z
  - Riesgo alto: A (requiere acción inmediata)
  - Riesgo medio: B (conviene atender pronto)
  - Riesgo bajo: C (mejora deseable)

Principales hallazgos de riesgo alto:
1. [Pilar]: [Hallazgo] - [Por qué importa]
2. [Pilar]: [Hallazgo] - [Por qué importa]

Esto creará Z incidencias individuales de GitHub y 1 épica.

¿Continuar con la creación de incidencias de GitHub? (y/n)
```

> [!IMPORTANT]
> Continúa con los pasos 6-7 solo si la persona da una respuesta afirmativa explícita (por ejemplo, "y", "yes"). Si la respuesta es negativa, ambigua o no existe, **no** crees incidencias de GitHub; muestra todos los hallazgos como Markdown con formato en la consola y detente.

### Paso 6: Crear incidencias individuales de hallazgos

Etiqueta con `well-architected` y el nombre del pilar (por ejemplo, `security`, `reliability`).

Título: `[WAF-<PILLAR>] <Hallazgo breve> - <Nivel de riesgo>`

Cuerpo:

````markdown
## Hallazgo Well-Architected: <Título breve>

**Pilar**: <Nombre> | **Nivel de riesgo**: <Alto/Medio/Bajo> | **Esfuerzo**: <Bajo/Medio/Alto>

### Descripción
<Explicación clara del hallazgo y de por qué importa>

### Corrección

Corrección IaC (opción preferida, Terraform, la IaC del kit):
```hcl
resource "azurerm_storage_account" "data" {
  name                            = "sifapdata"
  resource_group_name             = azurerm_resource_group.main.name
  location                        = azurerm_resource_group.main.location
  account_tier                    = "Standard"
  account_replication_type        = "ZRS"
  min_tls_version                 = "TLS1_2"
  allow_nested_items_to_be_public = false
  shared_access_key_enabled       = false

  tags = {
    project     = "sifap"
    environment = "prod"
    owner       = "platform-team"
  }
}
```

Alternativa con Azure CLI:
```bash
az storage account update --name <name> --resource-group <rg> \
  --min-tls-version TLS1_2 --allow-blob-public-access false --https-only true
```

### Referencia de Azure
- <enlace a la buena práctica WAF>
- <enlace a documentación de Microsoft Learn>

### Validación
- [ ] Cambio implementado en Terraform y aplicado
- [ ] Cumplimiento de Azure Policy aprobado (si corresponde)
- [ ] Recomendación de Microsoft Defender for Cloud resuelta (si corresponde)

**Recomendación Well-Architected**: <elemento de la lista WAF al que corresponde>
````

### Paso 7: Crear la épica de seguimiento

Etiqueta con `well-architected` y `epic`.

Título: `[EPIC] Revisión Azure Well-Architected - X hallazgos en 5 pilares`

Cuerpo: un resumen ejecutivo con una tabla desglosada por pilar (recuento de hallazgos por pilar y nivel de riesgo), un diagrama Mermaid de arquitectura, una lista priorizada con enlaces a todas las incidencias individuales (alto, medio y bajo) y criterios de éxito:

- Todos los hallazgos de riesgo alto resueltos
- Los hallazgos medios tienen planes de mitigación aceptados
- Sin regresiones en las alertas existentes de Azure Monitor ni en el cumplimiento de Azure Policy

## Gestión de errores

| Situación | Acción |
|---|---|
| No se encuentran archivos IaC | Limitar la revisión al descubrimiento de recursos activos con `az resource list` y anotar la carencia |
| Permisos insuficientes en Azure | Enumerar los roles de solo lectura necesarios (Reader, Security Reader) |
| Fallo al crear incidencias en GitHub | Mostrar todos los hallazgos como Markdown con formato en la consola |

## Plantilla de salida

Si se omite la creación de incidencias (o como resumen de consola), entrega los hallazgos en una tabla agrupada por pilar:

```markdown
## Revisión Well-Architected: <carga de trabajo>

| Pilar | Hallazgo | Riesgo | Corrección |
|---|---|---|---|
| Seguridad | Storage permite acceso público a blobs | Alto | Establecer allow_nested_items_to_be_public = false |
| Fiabilidad | App Service ejecuta una única instancia | Medio | Habilitar escalado automático con un mínimo de 2 instancias |
| Costo | Log Analytics no tiene límite de datos | Bajo | Establecer un límite diario y una política de retención |

Totales: Alto 1, Medio 1, Bajo 1 en 5 pilares.
Dictamen: resolver el hallazgo de seguridad de riesgo alto antes de la próxima versión.
```

## Puerta de calidad

- [ ] Los cinco pilares WAF se revisan frente a la IaC y la infraestructura activa.
- [ ] Cada hallazgo se clasifica por nivel de riesgo y se relaciona con un pilar.
- [ ] Cada hallazgo tiene una corrección aplicable en Terraform (Bicep/ARM solo como ilustración).
- [ ] Las desviaciones entre IaC y recursos desplegados se registran como hallazgos de Excelencia operativa.
- [ ] Las incidencias de GitHub se crean solo tras la aprobación explícita de la persona; en otro caso, los hallazgos se imprimen en la consola.
- [ ] Se incluyen un diagrama Mermaid de arquitectura y referencias de Microsoft Learn.
