---
name: "terraform-azurerm-set-diff-analyzer"
description: "Úsala cuando un plan de Terraform para recursos AzureRM muestre muchos cambios, aunque solo se haya añadido o eliminado un elemento, para distinguir los diffs falsos positivos de ordenación de Set de los cambios reales. Abarca Application Gateway, Load Balancer, Firewall, Front Door y NSG. Los desencadenantes incluyen \"ruido en terraform plan\", \"diff de tipo Set\", \"todos los elementos cambiaron\", \"diff espurio\" y \"filtrar falsos positivos en CI\"."
---
# Analizador de diffs de Set de Terraform AzureRM

Identifica **diffs falsos positivos** en planes de Terraform causados por los atributos de tipo Set del proveedor AzureRM y distínguelos de los cambios reales. La IaC de este kit es Terraform (`azurerm ~> 3.x`), por lo que esta skill se aplica directamente al árbol `infra/` que desarrolla el equipo en la etapa 3.

## Cuándo invocar

- "`terraform plan` muestra decenas de cambios, pero solo añadí una regla NSG."
- "Mi plan de Application Gateway dice que todas las reglas de enrutamiento cambiaron; ¿es real?"
- "¿Cómo evito que el ruido de ordenación de Set bloquee la revisión de mi plan en CI?"
- "¿Cuáles de estos diffs de Load Balancer modificarán realmente el recurso?"

## Contexto

El tipo Set de Terraform compara los elementos por posición en lugar de por una clave estable, por lo que añadir o eliminar un elemento puede hacer que todos aparezcan como "modificados". Es un comportamiento general de Terraform, pero destaca en los recursos AzureRM que dependen mucho de atributos de tipo Set: Application Gateway, Load Balancer, Firewall, Front Door y NSG. Estos diffs falsos positivos no cambian el recurso desplegado, pero ocultan los cambios reales y facilitan los errores al revisar el plan.

## Prerrequisitos

- Python 3.8+ (solo biblioteca estándar, sin paquetes de terceros).

Si Python no está disponible, instálalo mediante tu gestor de paquetes (`brew install python3`, `apt install python3`) o desde [python.org](https://www.python.org/downloads/).

## Uso básico

```bash
terraform plan -out=plan.tfplan                 # 1. capturar el plan
terraform show -json plan.tfplan > plan.json    # 2. exportarlo como JSON
python scripts/analyze_plan.py plan.json        # 3. clasificar los diffs
```

El analizador lee el plan JSON, inspecciona los atributos de tipo Set de los recursos AzureRM compatibles e indica cuáles presentan solo cambios de orden (falsos positivos) y cuáles tienen adiciones, eliminaciones o modificaciones reales.

## Interpretación de resultados

| Indicio | Significado | Acción |
|---|---|---|
| Cambio solo de orden en un atributo Set | Falso positivo, sin cambio real | Se puede ignorar con seguridad; indícalo en la PR |
| Elemento añadido o eliminado | Cambio real | Revisar antes de aplicar |
| Valor de atributo modificado | Cambio real | Revisar antes de aplicar |
| Recurso fuera de la lista de compatibles | No analizado | Inspeccionar manualmente |

Los recursos compatibles y sus atributos de tipo Set se enumeran en [references/azurerm_set_attributes.md](references/azurerm_set_attributes.md). Las opciones completas de CLI, los formatos de salida, los códigos de salida y los ejemplos de CI/CD están en [scripts/README.md](scripts/README.md).

## Solución de problemas

| Problema | Solución |
|---|---|
| `python: command not found` | Usa `python3` o instala Python 3.8+ |
| `ModuleNotFoundError` | El script solo usa la biblioteca estándar; confirma que Python 3.8+ esté activo |
| Un recurso no se clasifica | Confirma que aparece en `references/azurerm_set_attributes.md`; en caso contrario, revísalo manualmente |

## Plantilla de salida

Presenta la clasificación en una tabla y añade un dictamen de una línea:

```markdown
## Análisis de diffs de Set: plan.json

| Recurso | Atributo Set | Dictamen | Cambios reales |
|---|---|---|---|
| azurerm_application_gateway.main | request_routing_rule | Falso positivo (solo orden) | 0 |
| azurerm_network_security_group.web | security_rule | Cambio real | +1 / -0 |

Total: 2 recursos analizados, 1 falso positivo y 1 con cambios reales.
Dictamen: revisar el cambio de la regla NSG antes de aplicar; el diff de la puerta de enlace se puede ignorar con seguridad.
```

## Puerta de calidad

- [ ] Se generó un plan JSON con `terraform show -json` antes del análisis.
- [ ] `scripts/analyze_plan.py` se ejecutó sobre el plan JSON con Python 3.8+.
- [ ] Cada recurso señalado se clasifica como falso positivo (solo orden) o cambio real.
- [ ] Los cambios reales se revisan antes de `terraform apply`; los falsos positivos se documentan como seguros de ignorar.
- [ ] Todo recurso fuera de la lista de compatibles se revisó manualmente.
