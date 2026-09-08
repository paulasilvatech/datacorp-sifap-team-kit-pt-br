---
name: "iac-module"
description: "Crea o refactoriza un módulo Terraform para la infraestructura Azure de SIFAP 2.0 con etiquetas estándar, variables tipadas, salidas y validación."
argument-hint: "name=<module> service=<azurerm_resource> reqs=REQ-NNN"
agent: "devops-engineer"
tools: ["read", "search", "edit", "execute"]
---
# /iac-module

## Objetivo

Produce o actualiza un **único módulo Terraform** en `infra/modules/` para SIFAP 2.0, limitado a un área de servicio de Azure (redes, cómputo, base de datos, supervisión o seguridad). El módulo incorpora las etiquetas estándar de SIFAP en cada recurso que admite etiquetas, mantiene los secretos fuera del código, utiliza identidades administradas para la autenticación entre servicios y supera `terraform fmt` y `terraform validate` (además de `tflint` y `checkov`) antes del commit, conforme a la puerta de infraestructura de `.github/workflows/ci.yml`.

## Cuándo invocar

Cuando un contexto delimitado necesita un servicio Azure nuevo o cuando debe reforzarse o ampliarse un módulo existente. Los cambios de módulos se entregan en su propia PR, separados del código de funcionalidades.

## Precondiciones

- `.specify/memory/constitution.md` establece las reglas no negociables (identidad administrada, Key Vault, acceso de red)
- Se conocen el servicio Azure y el `REQ-ID` vinculado
- La ruta del módulo de destino (`infra/modules/<name>/`) es nueva o existe para actualizarla

## Entradas que debe proporcionar el equipo

- El nombre del módulo y el servicio Azure (por ejemplo, `database` para `azurerm_postgresql_flexible_server`)
- El `REQ-ID` vinculado en `specs/<NNN>-<feature>/spec.md` (normalmente no funcional u operativo)
- Los entornos de destino (`dev`, `stage`, `prod`) y los ajustes específicos de cada entorno
- Si se crea un módulo nuevo o se modifica uno existente

Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Leer [`../skills/iac-review/SKILL.md`](../skills/iac-review/SKILL.md) y la constitución, y seguir los patrones de módulos existentes
- Escribir la estructura inicial de cinco archivos del módulo, con variables tipadas y documentadas
- Aplicar el conjunto estándar de etiquetas SIFAP a cada recurso que admita etiquetas
- Mantener los secretos en `azurerm_key_vault_secret`, nunca en `locals`, `variables` ni `outputs`
- Utilizar identidades administradas y redes privadas de forma predeterminada
- Añadir `examples/basic/` y validar localmente con `fmt`, `validate`, `tflint` y `checkov`

## Lo que NO haré

- Inventar el precio de una SKU, la disponibilidad de una región ni un valor específico de SIFAP: las entradas desconocidas se parametrizan y el equipo las confirma
- Crear la canalización (`/pipeline`), escribir código de aplicación (`@builder`) ni cambiar requisitos (`@requirements-engineer`)
- Poner un secreto en una variable, valor predeterminado, salida o archivo de estado cuando pueda evitarse
- Establecer `public_network_access_enabled = true` sin una excepción documentada en `.specify/memory/constitution.md`
- Poner un bloque `provider` dentro del módulo ni etiquetar algunos recursos y otros no

## Formato de salida

Un módulo de cinco archivos (`main.tf`, `variables.tf`, `outputs.tf`, `versions.tf`, `README.md`), más `examples/basic/`. Los archivos principales siguen el estilo real de `azurerm` del repositorio:

```hcl
# infra/modules/database/versions.tf
terraform {
  required_version = ">= 1.5.0, < 2.0.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.116"
    }
    random = { source = "hashicorp/random", version = "~> 3.6" }
  }
}

# infra/modules/database/main.tf
locals {
  tags = merge(var.tags, {
    project     = "sifap"
    environment = var.environment
    owner       = var.owner
    cost-center = var.cost_center
    module      = "database"
    managed-by  = "terraform"
  })
}

resource "random_password" "admin" {
  length  = 32
  special = true
}

resource "azurerm_postgresql_flexible_server" "this" {
  name                          = "${var.project}-${var.environment}-psql-${var.location_short}"
  resource_group_name           = var.resource_group_name
  location                      = var.location
  version                       = "16"
  administrator_login           = var.administrator_login
  administrator_password        = random_password.admin.result
  public_network_access_enabled = false # Solo punto de conexión privado; sin excepción registrada
  tags                          = local.tags
}

# El secreto se encuentra en Key Vault, nunca en variables, salidas ni registros.
resource "azurerm_key_vault_secret" "admin_password" {
  name         = "${var.environment}-psql-admin-password"
  value        = random_password.admin.result
  key_vault_id = var.key_vault_id
  tags         = local.tags
}

# infra/modules/database/outputs.tf
output "server_fqdn" {
  description = "FQDN de PostgreSQL para consumidores; no contiene secretos."
  value       = azurerm_postgresql_flexible_server.this.fqdn
}
```

Acompaña el módulo con un informe de validación (salidas de `fmt`, `validate`, `tflint` y `checkov`) y una nota de costo mensual de una línea por entorno, con enlace a los precios de Azure.

## Definición de terminado

- [ ] `terraform fmt -check`, `terraform validate`, `tflint` y `checkov` se superan
- [ ] Cada recurso que admite etiquetas incluye `project`, `environment` y `owner` (más las adicionales estándar)
- [ ] Ningún secreto aparece en variables, salidas ni valores predeterminados
- [ ] El acceso público de red está deshabilitado salvo que se cite una excepción de la constitución
- [ ] Se utiliza identidad administrada; no aparece ninguna credencial de entidad de servicio en el código
- [ ] Un consumidor en `examples/basic/` compila y valida
- [ ] El README documenta entradas, salidas, un ejemplo y el `REQ-ID` vinculado

## Cuerpo del prompt

Eres el `@devops-engineer`. El equipo necesita un módulo enfocado y revisable que respete las reglas de Terraform del repositorio.

**Paso 1 — Lee la constitución y la habilidad.**
Abre `.specify/memory/constitution.md` para consultar las reglas no negociables y [`../skills/iac-review/SKILL.md`](../skills/iac-review/SKILL.md) para la lista de verificación de revisión. Revisa los módulos existentes para identificar los patrones que seguir.

**Paso 2 — Fija el proveedor.**
Utiliza `azurerm ~> 3.x` (el estándar del repositorio), fijado mediante `required_providers`, y referencia [Azure Verified Modules](https://aka.ms/avm) cuando corresponda.

**Paso 3 — Escribe la estructura inicial.**
`main.tf` (solo recursos, sin bloque `provider`), `variables.tf` (cada entrada tipada y documentada, con bloques `validation` donde importen los intervalos), `outputs.tf` (identificadores, nombres y FQDN, nunca secretos), `versions.tf` y `README.md`.

**Paso 4 — Aplica las etiquetas estándar.**
Combina `var.tags` con `project`, `environment`, `owner`, `cost-center`, `module` y `managed-by`, y asigna el mapa a cada recurso que admita etiquetas.

**Paso 5 — Exige disciplina de secretos, identidad y red.**
Los secretos fluyen a través de orígenes de datos `azurerm_key_vault_secret` o valores generados almacenados en Key Vault, nunca variables, valores predeterminados ni salidas. Utiliza identidades administradas asignadas por el sistema o por el usuario para la autenticación entre servicios. Mantén `public_network_access_enabled = false` salvo que la constitución conceda una excepción.

**Paso 6 — Añade un ejemplo y valida.**
Escribe `examples/basic/main.tf` que utilice el módulo y después ejecuta `terraform fmt -check -recursive`, `terraform init -backend=false`, `terraform validate`, `tflint --recursive` y `checkov -d . --soft-fail false`. Todos deben superarse.

`terraform fmt` y `terraform validate` deben superarse antes del commit, conforme a `.github/workflows/ci.yml`. Cada recurso que admite etiquetas incluye las obligatorias. Ningún secreto llega a una variable, salida ni valor predeterminado. Nunca habilites acceso público de red sin una excepción documentada ni inventes un valor que deba confirmar el equipo.

## Ejemplo de invocación

```
/iac-module name=database service=azurerm_postgresql_flexible_server reqs=REQ-NNN
```
