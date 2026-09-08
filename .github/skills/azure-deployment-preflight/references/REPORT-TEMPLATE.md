# Plantilla del informe de comprobaciones previas

Usa esta estructura de plantilla al generar `preflight-report.md` en la raíz del proyecto.

---

## Plantilla

````markdown
# Informe de comprobaciones previas al despliegue en Azure

**Generado:** {timestamp}
**Estado:** {overall-status}

---

## Resumen

| Propiedad | Valor |
|----------|-------|
| **Archivos de plantilla** | {bicep-files} |
| **Archivos de parámetros** | {param-files-or-none} |
| **Tipo de proyecto** | {azd-project | standalone-bicep} |
| **Ámbito del despliegue** | {resourceGroup | subscription | managementGroup | tenant} |
| **Destino** | {resource-group-name | subscription-name | mg-id} |
| **Nivel de validación** | {Provider | ProviderNoRbac} |

### Resultados de validación

| Comprobación | Estado | Detalles |
|-------|--------|---------|
| Sintaxis de Bicep | {✅ Aprobado | ❌ Fallido | ⚠️ Advertencias | ⏭️ Omitido} | {details} |
| Análisis What-If | {✅ Aprobado | ❌ Fallido | ⏭️ Omitido} | {details} |
| Comprobación de permisos | {✅ Aprobado | ⚠️ Limitado | ❌ Fallido} | {details} |

---

## Herramientas ejecutadas

### Comandos ejecutados

| Paso | Comando | Código de salida | Duración |
|------|---------|-----------|----------|
| 1 | `{command}` | {0 | non-zero} | {duration} |
| 2 | `{command}` | {0 | non-zero} | {duration} |

### Versiones de herramientas

| Herramienta | Versión |
|------|---------|
| Azure CLI | {version} |
| Bicep CLI | {version} |
| Azure Developer CLI | {version-or-n/a} |

---

## Problemas

{if-no-issues}
✅ **No se encontraron problemas.** Se puede continuar con el despliegue.
{end-if}

{if-issues-exist}
### Errores

{for-each-error}
#### ❌ {error-title}

- **Gravedad:** Error
- **Origen:** {bicep-build | what-if | permissions}
- **Ubicación:** {file-path}:{line}:{column} (si corresponde)
- **Mensaje:** {error-message}
- **Corrección:** {suggested-fix}
- **Documentación:** {link-if-available}

{end-for-each}

### Advertencias

{for-each-warning}
#### ⚠️ {warning-title}

- **Gravedad:** Advertencia
- **Origen:** {source}
- **Mensaje:** {warning-message}
- **Recomendación:** {suggested-action}

{end-for-each}
{end-if}

---

## Resultados What-If

{if-what-if-succeeded}

### Resumen de cambios

| Tipo de cambio | Cantidad |
|-------------|-------|
| 🆕 Crear | {count} |
| 📝 Modificar | {count} |
| 🗑️ Eliminar | {count} |
| ✓ Sin cambios | {count} |
| ⚠️ Ignorar | {count} |

### Recursos que se crearán

{if-resources-to-create}
| Tipo de recurso | Nombre del recurso |
|---------------|---------------|
| {type} | {name} |
{end-if}

{if-no-resources-to-create}
*No se creará ningún recurso.*
{end-if}

### Recursos que se modificarán

{if-resources-to-modify}
#### {resource-type}/{resource-name}

| Propiedad | Valor actual | Valor nuevo |
|----------|---------------|-----------|
| {property-path} | {current} | {new} |

{end-if}

{if-no-resources-to-modify}
*No se modificará ningún recurso.*
{end-if}

### Recursos que se eliminarán

{if-resources-to-delete}
| Tipo de recurso | Nombre del recurso |
|---------------|---------------|
| {type} | {name} |

> ⚠️ **Advertencia:** Los recursos indicados para eliminación se borrarán de forma permanente.
{end-if}

{if-no-resources-to-delete}
*No se eliminará ningún recurso.*
{end-if}

{end-if-what-if-succeeded}

{if-what-if-failed}
### El análisis What-If falló

La operación what-if no pudo completarse. Consulta los detalles en la sección Problemas.
{end-if}

---

## Recomendaciones

{generate-based-on-findings}

1. {recommendation-1}
2. {recommendation-2}
3. {recommendation-3}

---

## Pasos siguientes

{if-all-passed}
La validación previa se superó. Puedes continuar con el despliegue:

**Para proyectos azd:**
```bash
azd provision
# o
azd up
```

**Para Bicep independiente:**
```bash
az deployment group create \
  --resource-group {rg-name} \
  --template-file {bicep-file} \
  --parameters {param-file}
```
{end-if}

{if-issues-exist}
Resuelve los problemas indicados antes de desplegar. Después de corregirlos:

1. Vuelve a ejecutar la validación previa para verificar las correcciones
2. Continúa con el despliegue cuando se superen todas las comprobaciones
{end-if}

---

*Informe generado por la skill de comprobaciones previas al despliegue en Azure*
````

---

## Valores de estado

### Estado general

| Estado | Significado | Indicador visual |
|--------|---------|--------|
| **Aprobado** | Todas las comprobaciones se superaron; es seguro desplegar | ✅ |
| **Aprobado con advertencias** | Las comprobaciones se superaron, pero hay que revisar las advertencias | ⚠️ |
| **Fallido** | Falló una o más comprobaciones | ❌ |

### Estado de cada comprobación

| Estado | Significado |
|--------|---------|
| ✅ Aprobado | La comprobación se completó correctamente |
| ❌ Fallido | La comprobación encontró errores |
| ⚠️ Advertencias | La comprobación se superó con advertencias |
| ⏭️ Omitido | Se omitió la comprobación (herramienta no disponible, etc.) |

---

## Informe de ejemplo

````markdown
# Informe de comprobaciones previas al despliegue en Azure

**Generado:** 2026-01-16T14:32:00Z
**Estado:** ⚠️ Aprobado con advertencias

---

## Resumen

| Propiedad | Valor |
|----------|-------|
| **Archivos de plantilla** | `infra/main.bicep` |
| **Archivos de parámetros** | `infra/main.bicepparam` |
| **Tipo de proyecto** | Proyecto azd |
| **Ámbito del despliegue** | subscription |
| **Destino** | my-subscription |
| **Nivel de validación** | Provider |

### Resultados de validación

| Comprobación | Estado | Detalles |
|-------|--------|---------|
| Sintaxis de Bicep | ✅ Aprobado | No se encontraron errores |
| Análisis What-If | ⚠️ Advertencias | 1 recurso ignorado debido a los límites de plantillas anidadas |
| Comprobación de permisos | ✅ Aprobado | Permisos completos de despliegue verificados |

---

## Herramientas ejecutadas

### Comandos ejecutados

| Paso | Comando | Código de salida | Duración |
|------|---------|-----------|----------|
| 1 | `bicep build infra/main.bicep --stdout` | 0 | 1.2s |
| 2 | `azd provision --preview --environment dev` | 0 | 8.4s |

### Versiones de herramientas

| Herramienta | Versión |
|------|---------|
| Azure CLI | 2.76.0 |
| Bicep CLI | 0.25.3 |
| Azure Developer CLI | 1.9.0 |

---

## Problemas

### Advertencias

#### ⚠️ Se alcanzó el límite de plantillas anidadas

- **Gravedad:** Advertencia
- **Origen:** what-if
- **Mensaje:** Se ignoró 1 recurso porque se alcanzaron los límites de expansión de plantillas anidadas
- **Recomendación:** Revisar manualmente el recurso ignorado después del despliegue

---

## Resultados What-If

### Resumen de cambios

| Tipo de cambio | Cantidad |
|-------------|-------|
| 🆕 Crear | 3 |
| 📝 Modificar | 1 |
| 🗑️ Eliminar | 0 |
| ✓ Sin cambios | 2 |
| ⚠️ Ignorar | 1 |

### Recursos que se crearán

| Tipo de recurso | Nombre del recurso |
|---------------|---------------|
| Microsoft.Resources/resourceGroups | rg-myapp-dev |
| Microsoft.Storage/storageAccounts | stmyappdev |
| Microsoft.Web/sites | app-myapp-dev |

### Recursos que se modificarán

#### Microsoft.KeyVault/vaults/kv-myapp-dev

| Propiedad | Valor actual | Valor nuevo |
|----------|---------------|-----------|
| properties.sku.name | standard | premium |
| tags.environment | staging | dev |

### Recursos que se eliminarán

*No se eliminará ningún recurso.*

---

## Recomendaciones

1. Revisa el nombre de la cuenta de almacenamiento `stmyappdev` para comprobar que cumple los requisitos de nomenclatura
2. Confirma que el cambio de SKU de Key Vault de standard a premium es intencional
3. El recurso de la plantilla anidada ignorado debe verificarse después del despliegue

---

## Pasos siguientes

La validación previa se superó con advertencias. Revisa las advertencias anteriores y después continúa:

```bash
azd provision --environment dev
```

---

*Informe generado por la skill de comprobaciones previas al despliegue en Azure*
````

---

## Directrices de formato

1. **Usa emojis de forma coherente** para facilitar la lectura visual
2. **Incluye números de línea** al hacer referencia a errores de Bicep
3. **Proporciona medidas de corrección concretas** para cada problema
4. **Enlaza a la documentación** cuando esté disponible
5. **Ordena los problemas por gravedad** (primero los errores, después las advertencias)
6. **Incluye ejemplos de comandos** en Pasos siguientes
