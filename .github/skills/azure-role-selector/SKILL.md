---
name: "azure-role-selector"
description: "Úsala cuando la persona pregunte qué rol de Azure RBAC asignar a una identidad, cómo conceder permisos de privilegio mínimo o cómo crear un rol personalizado si ninguno de los integrados resulta adecuado. Recomienda el rol integrado más restrictivo y genera la asignación en Terraform (azurerm_role_assignment), la IaC del kit. Los desencadenantes incluyen \"qué rol de Azure\", \"privilegio mínimo\", \"asignación de rol\", \"definición de rol personalizado\" y \"conceder permisos\"."
---
# Selector de roles de Azure

Recomienda el rol de Azure RBAC de **privilegio mínimo** para una identidad según las acciones que deba realizar y expresa después la asignación en Terraform (`azurerm_role_assignment`), la IaC del kit. Prefiere siempre un rol integrado en el ámbito más limitado; crea una definición de rol personalizado solo cuando ninguno de los integrados resulte adecuado.

Esta skill enseña a elegir y aplicar un rol. No decide qué identidad o ámbito necesita la carga de trabajo; eso procede de la especificación y de la investigación del propio equipo.

> [!NOTE]
> Esta skill depende del **servidor Azure MCP** (o de la CLI `az`) para consultar definiciones de roles y generar comandos de asignación. Si ninguno está instalado, indícalo y recurre a la documentación pública de roles integrados de Azure.

## Cuándo invocar

- "¿Qué rol de Azure debo asignar a esta identidad administrada?"
- "Concede a esta entidad de servicio acceso de solo lectura a una cuenta de almacenamiento, con privilegio mínimo."
- "Ningún rol integrado resulta adecuado; ayúdame a escribir una definición de rol personalizado."
- "Da permiso a la identidad de la aplicación para leer secretos de Key Vault."

## Procedimiento de selección

1. **Recopila las acciones necesarias.** Enumera las operaciones exactas que debe realizar la identidad (por ejemplo, leer blobs, enumerar secretos, enviar a una cola). Separa `actions` del plano de control y `dataActions` del plano de datos.
2. **Elige el ámbito más limitado.** Asigna en el ámbito mínimo que satisfaga el requisito: recurso antes que grupo de recursos, grupo de recursos antes que suscripción y suscripción antes que grupo de administración.
3. **Busca un rol integrado adecuado.** Usa la herramienta de documentación de Azure MCP para encontrar el rol integrado cuyas `actions`/`dataActions` cubran el requisito con el menor exceso. Prefiere roles del plano de datos (por ejemplo, `Storage Blob Data Reader`) a roles amplios de administración (`Contributor`).
4. **Recurre a un rol personalizado solo si es necesario.** Cuando no haya un rol integrado adecuado, usa la herramienta `extension_cli_generate` de Azure MCP para redactar una definición que enumere únicamente las `actions`/`dataActions` necesarias y un `assignableScopes` explícito.
5. **Genera la asignación.** Usa la herramienta `extension_cli_generate` de Azure MCP para el comando `az role assignment create` y conviértelo después a Terraform para el entregable del kit.
6. **Prefiere identidades administradas.** Para autenticación entre servicios, asigna el rol a una identidad administrada; nunca distribuyas secretos, claves ni cadenas de conexión.

## Tabla de decisión de privilegio mínimo

| Situación | Elección |
|---|---|
| Un rol integrado coincide exactamente con las acciones | El rol integrado en el ámbito más limitado |
| Un rol integrado se aproxima, pero es ligeramente amplio | Preferir el rol integrado salvo que los permisos adicionales sean sensibles; documentar la diferencia |
| Ningún rol integrado cubre las acciones | Una definición de rol personalizado que contenga solo las acciones necesarias |
| Un servicio de Azure debe llamar a otro servicio de Azure | Una identidad administrada y una asignación de rol, nunca un secreto |
| La identidad solo lee datos | Un rol `... Data Reader` del plano de datos, no `Reader` ni `Contributor` |

> [!WARNING]
> Nunca asignes `Owner` ni `Contributor` en el ámbito de suscripción o grupo de administración a una identidad de carga de trabajo. Esos roles incluyen `Microsoft.Authorization/*`, que permite a la identidad concederse acceso adicional.

## Bicep y ARM: fuera del alcance

Un fragmento Bicep o ARM de asignación de roles (mediante las herramientas `bicepschema` y `get_bestpractices` de Azure MCP) es opcional y queda **fuera del alcance** de los entregables del kit. Genera Terraform; usa Bicep solo para explorar o comparar.

## Plantilla de salida

Entrega la recomendación y un fragmento Terraform listo para incluir en un commit. Las asignaciones y definiciones de roles no admiten `tags`, por lo que la regla de etiquetado del kit no se aplica a estos recursos.

```hcl
resource "azurerm_role_assignment" "app_blob_reader" {
  scope                = azurerm_storage_account.data.id
  role_definition_name = "Storage Blob Data Reader"
  principal_id         = azurerm_user_assigned_identity.app.principal_id
}
```

Cuando ningún rol integrado resulte adecuado, entrega una definición de rol personalizado junto con la asignación:

```hcl
resource "azurerm_role_definition" "read_one_container" {
  name        = "SIFAP Read Single Blob Container"
  scope       = azurerm_storage_account.data.id
  description = "Acceso de solo lectura a un único contenedor de blobs, con privilegio mínimo."

  permissions {
    actions      = ["Microsoft.Storage/storageAccounts/blobServices/containers/read"]
    data_actions = ["Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read"]
    not_actions  = []
  }

  assignable_scopes = [azurerm_storage_account.data.id]
}
```

Resume la elección en prosa:

```text
Rol recomendado: Storage Blob Data Reader (integrado)
Ámbito: cuenta de almacenamiento azurerm_storage_account.data (el mínimo que funciona)
Entidad de seguridad: identidad administrada app asignada por el usuario
Motivo: cubre la acción de lectura de blobs del plano de datos sin excesos; no se necesita un rol personalizado.
```

## Puerta de calidad

- [ ] El rol recomendado es el rol integrado más restrictivo que cubre todas las acciones necesarias.
- [ ] El ámbito de asignación es el mínimo que satisface el requisito.
- [ ] Se propone un rol personalizado solo cuando ninguno de los integrados resulta adecuado, y enumera únicamente las acciones necesarias con `assignable_scopes` explícito.
- [ ] La asignación se expresa como `azurerm_role_assignment` de Terraform (Bicep/ARM quedan fuera del alcance).
- [ ] La autenticación entre servicios usa una identidad administrada, nunca un secreto ni una cadena de conexión.
- [ ] No se asigna `Owner`/`Contributor` en el ámbito de suscripción o grupo de administración a una identidad de carga de trabajo.

## Licencia

El material incluido en esta skill se proporciona bajo la [licencia MIT](LICENSE.txt).
