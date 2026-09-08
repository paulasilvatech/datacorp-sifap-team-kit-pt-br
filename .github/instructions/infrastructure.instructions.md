---
description: "Utiliza al crear o revisar infraestructura como código, Terraform, Bicep, definiciones de recursos de Azure y configuración de entornos."
applyTo: "infra/**,**/*.tf,**/*.bicep,compose*.yml,compose*.yaml,docker-compose*.yml,docker-compose*.yaml"
---

# Convenciones de infraestructura — Terraform y Compose

Este archivo se activa al editar archivos en `infra/`, cualquier `*.tf` o `*.bicep`, o un archivo YAML de `compose`/`docker-compose`. Enseña a aprovisionar Azure con Terraform (`azurerm ~> 3.x`, la herramienta principal) y a mantener de forma segura la equivalencia del entorno local de Compose. Prioriza Terraform; utiliza Bicep solo cuando un módulo realmente lo requiera. El equipo crea `infra/` en las etapas 3/4; no existe un conjunto de infraestructura heredado que copiar.

## Proveedor y versiones

Fija el proveedor y la versión mínima de Terraform. Mantén un único bloque `provider "azurerm"` por configuración.

```hcl
terraform {
  required_version = ">= 1.9.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}
```

## Organización de módulos

Un módulo por área de servicio de Azure, para mantener claros el alcance del impacto y la responsabilidad.

```text
infra/
├── networking/   # VNet, subredes, NSG
├── compute/      # App Service / Container Apps
├── database/     # PostgreSQL Flexible Server
└── monitoring/   # Log Analytics, alertas
```

## Etiquetas obligatorias en cada recurso

Cada recurso incluye `project`, `environment` y `owner` (añade `cost-center` cuando el equipo lo controle). Defínelos una sola vez en `locals` y reutilízalos.

```hcl
locals {
  common_tags = {
    project     = var.project
    environment = var.environment
    owner       = var.owner
  }
}

resource "azurerm_resource_group" "main" {
  name     = "${var.project}-${var.environment}-rg-${var.location_short}"
  location = var.location
  tags     = local.common_tags
}
```

## Secretos

> [!WARNING]
> Los secretos se encuentran únicamente en `azurerm_key_vault_secret`, nunca en `locals`, valores predeterminados de `variables`, `.tfvars` ni estados incluidos en commits. Marca las entradas secretas con `sensitive = true` e inyéctalas desde la sesión OIDC de la canalización.

```hcl
variable "db_password" {
  type      = string
  sensitive = true
}

resource "azurerm_key_vault_secret" "db_password" {
  name         = "db-password"
  value        = var.db_password
  key_vault_id = azurerm_key_vault.main.id
  tags         = local.common_tags
}
```

## Identidad administrada

La autenticación entre servicios utiliza identidades administradas (Managed Identity: `azurerm_user_assigned_identity` o una identidad asignada por el sistema), no cadenas de conexión con contraseñas incorporadas. Asigna la identidad y concédele acceso a Key Vault mediante una asignación de rol.

## Convención de nomenclatura

Los nombres de recursos siguen `{project}-{env}-{resource}-{region}`.

| Recurso | Ejemplo |
|---|---|
| Grupo de recursos | `sifap-prod-rg-brs` |
| Servidor PostgreSQL | `sifap-prod-psql-brs` |

## Puerta de formato y validación

La CI ejecuta `terraform fmt -check -recursive` y después, por módulo, `terraform init -backend=false` seguido de `terraform validate` (consulta [`ci.yml`](../workflows/ci.yml)). Antes de enviar cambios, ejecuta localmente `terraform fmt -recursive` y `terraform -chdir=<module> validate`. La habilidad [`iac-review`](../skills/iac-review/SKILL.md) se encarga de detectar divergencias y revisar los módulos en profundidad.

## Equivalencia con Docker Compose

Compose se utiliza solo para desarrollo local. Fija las imágenes por digest, mantén los secretos en un `.env` ignorado por Git y nunca incluyas credenciales reales en commits.

```yaml
services:
  db:
    image: postgres:16@sha256:<digest> # Fija el digest
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD} # Desde .env, nunca incorporada directamente
```

## Convenciones

| Regla | Justificación |
|---|---|
| `azurerm ~> 3.x`, `required_version` fijada | Planes reproducibles entre máquinas |
| Un módulo por área de servicio | Responsabilidad clara y alcance de impacto reducido |
| Etiquetas `project` + `environment` + `owner` en todos los recursos | Trazabilidad de costos, auditoría y limpieza |
| Secretos solo en `azurerm_key_vault_secret` | Sin credenciales en el código ni en el estado |
| Identidad administrada para la autenticación de servicios | Sin contraseñas almacenadas entre servicios |
| `fmt` + `validate` por módulo sin errores | Coincide con la puerta de infraestructura de la CI |

## Qué hacer / Qué no hacer

| Qué hacer | Qué no hacer |
|---|---|
| Aplicar `local.common_tags` a cada recurso | Entregar un recurso sin etiquetas |
| Marcar las variables secretas con `sensitive = true` | Poner un secreto en el valor predeterminado de una `variable` o en `.tfvars` |
| Fijar las imágenes de Compose por digest | Utilizar `postgres:latest` |
| Autenticarse mediante identidad administrada | Incorporar una contraseña en una cadena de conexión |

## Lista de verificación antes de abrir una PR

- [ ] El proveedor es `azurerm ~> 3.x` con `required_version` fijada
- [ ] Cada recurso incluye las etiquetas `project`, `environment` y `owner`
- [ ] Ningún secreto aparece fuera de `azurerm_key_vault_secret`; las variables secretas son `sensitive`
- [ ] La autenticación entre servicios utiliza identidades administradas
- [ ] `terraform fmt -check -recursive` y `validate` por módulo se superan localmente
- [ ] Los archivos de Compose fijan los digests de las imágenes y leen los secretos de un `.env` ignorado por Git
