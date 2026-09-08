# Referencia de atributos de tipo Set de AzureRM

Este documento describe la finalidad y el mantenimiento de `azurerm_set_attributes.json`.

> **Última actualización**: 28 de enero de 2026

## Descripción general

`azurerm_set_attributes.json` define los atributos que el proveedor AzureRM trata como tipo Set.
El script `analyze_plan.py` lee este JSON para identificar "diffs falsos positivos" en los planes de Terraform.

### ¿Qué son los atributos de tipo Set?

El tipo Set de Terraform es una colección que **no garantiza el orden**.
Por tanto, al añadir o eliminar elementos, los que no cambiaron pueden aparecer como "modificados".
Esto se denomina un "diff falso positivo".

## Estructura del archivo JSON

### Formato básico

```json
{
  "resources": {
    "azurerm_resource_type": {
      "attribute_name": "key_attribute"
    }
  }
}
```

- **key_attribute**: el atributo que identifica de forma única los elementos del Set (por ejemplo, `name`, `id`)
- **null**: cuando no hay un atributo clave (se compara el elemento completo)

### Formato anidado

Cuando un atributo Set contiene otro atributo Set:

```json
{
  "rewrite_rule_set": {
    "_key": "name",
    "rewrite_rule": {
      "_key": "name",
      "condition": "variable",
      "request_header_configuration": "header_name"
    }
  }
}
```

- **`_key`**: el atributo clave para los elementos Set de ese nivel
- **Otras claves**: definiciones de atributos Set anidados

### Ejemplo: azurerm_application_gateway

```json
"azurerm_application_gateway": {
  "backend_address_pool": "name",           // Set simple (la clave es name)
  "rewrite_rule_set": {                     // Set anidado
    "_key": "name",
    "rewrite_rule": {
      "_key": "name",
      "condition": "variable"
    }
  }
}
```

## Mantenimiento

### Añadir atributos nuevos

1. **Consultar la documentación oficial**
   - Busca el recurso en [Terraform Registry](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
   - Verifica que el atributo aparezca como "Set of ..." (conjunto de...)
   - Algunos recursos, como `azurerm_application_gateway`, indican explícitamente sus atributos Set

2. **Consultar el código fuente (más fiable)**
   - Busca el recurso en [GitHub del proveedor AzureRM](https://github.com/hashicorp/terraform-provider-azurerm)
   - Confirma `Type: pluginsdk.TypeSet` en la definición del esquema
   - Identifica los atributos del `Schema` del Set que pueden servir como `_key`

3. **Añadir al JSON**

   ```json
   "azurerm_new_resource": {
     "set_attribute": "key_attribute"
   }
   ```

4. **Probar**

   ```bash
   # Verificar con un plan real
   python3 scripts/analyze_plan.py your_plan.json
   ```

### Identificar atributos clave

| Atributo clave habitual | Uso |
|---------------------|-------|
| `name` | Bloques con nombre (lo más habitual) |
| `id` | Referencia al ID del recurso |
| `location` | Ubicación geográfica |
| `address` | Dirección de red |
| `host_name` | Nombre de host |
| `null` | Cuando no existe una clave (se compara el elemento completo) |

## Herramientas relacionadas

### analyze_plan.py

Analiza el JSON de un plan de Terraform para identificar diffs falsos positivos.

```bash
# Uso básico
terraform show -json plan.tfplan | python3 scripts/analyze_plan.py

# Leer desde un archivo
python3 scripts/analyze_plan.py plan.json

# Usar un archivo de atributos personalizado
python3 scripts/analyze_plan.py plan.json --attributes /path/to/custom.json
```

## Recursos compatibles

Consulta directamente `azurerm_set_attributes.json` para conocer los recursos compatibles actualmente:

```bash
# Enumerar recursos
jq '.resources | keys' azurerm_set_attributes.json
```

Recursos principales:

- `azurerm_application_gateway`: grupos de backends, agentes de escucha, reglas, etc.
- `azurerm_firewall_policy_rule_collection_group`: colecciones de reglas
- `azurerm_frontdoor`: grupos de backends, enrutamiento
- `azurerm_network_security_group`: reglas de seguridad
- `azurerm_virtual_network_gateway`: configuración IP y del cliente VPN

## Notas

- El comportamiento de los atributos puede variar según la versión del proveedor o de la API
- Hay que añadir los recursos y atributos nuevos a medida que estén disponibles
- Definir todos los niveles de estructuras profundamente anidadas mejora la precisión
