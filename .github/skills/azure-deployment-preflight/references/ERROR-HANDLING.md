# Guía de gestión de errores

Esta referencia documenta errores habituales durante la validación previa y cómo gestionarlos.

## Principio central

**Continuar ante los fallos.** Recopila todos los problemas en el informe final en lugar de detenerte en el primer error. Así la persona obtiene una visión completa de lo que debe corregirse.

---

## Errores de autenticación

### Sesión no iniciada (Azure CLI)

**Detección:**

```
ERROR: Please run 'az login' to setup account.
ERROR: AADSTS700082: The refresh token has expired
```

**Códigos de salida:** Distintos de cero

**Tratamiento:**

1. Anota el error en el informe
2. Incluye pasos de corrección
3. Omite los comandos restantes de Azure CLI
4. Continúa con otros pasos de validación si es posible

**Entrada del informe:**

```markdown
#### ❌ Se requiere autenticación en Azure CLI

- **Gravedad:** Error
- **Origen:** az cli
- **Mensaje:** No se ha iniciado sesión en Azure CLI
- **Corrección:** Ejecutar `az login` para autenticarse y después repetir la validación previa
- **Documentación:** https://learn.microsoft.com/en-us/cli/azure/authenticate-azure-cli
```

### Sesión no iniciada (azd)

**Detección:**

```
ERROR: not logged in, run `azd auth login` to login
```

**Tratamiento:**

1. Anota el error en el informe
2. Omite los comandos azd
3. Sugiere `azd auth login`

**Entrada del informe:**

```markdown
#### ❌ Se requiere autenticación en Azure Developer CLI

- **Gravedad:** Error
- **Origen:** azd
- **Mensaje:** No se ha iniciado sesión en Azure Developer CLI
- **Corrección:** Ejecutar `azd auth login` para autenticarse y después repetir la validación previa
```

### Token caducado

**Detección:**

```
AADSTS700024: Client assertion is not within its valid time range
AADSTS50173: The provided grant has expired
```

**Tratamiento:**

1. Anota el error
2. Sugiere autenticarse de nuevo
3. Omite las operaciones de Azure

---

## Errores de permisos

### Permisos RBAC insuficientes

**Detección:**

```
AuthorizationFailed: The client '...' with object id '...' does not have authorization
to perform action '...' over scope '...'
```

**Tratamiento:**

1. **Primer intento:** Reintenta con `--validation-level ProviderNoRbac`
2. Anota la limitación de permisos en el informe
3. Si ProviderNoRbac también falla, informa del permiso concreto que falta

**Entrada del informe:**

```markdown
#### ⚠️ Validación con permisos limitados

- **Gravedad:** Advertencia
- **Origen:** what-if
- **Mensaje:** Falló la validación RBAC completa; se usa validación de solo lectura
- **Detalle:** Falta el permiso `Microsoft.Resources/deployments/write` en el ámbito `/subscriptions/xxx`
- **Recomendación:** Solicitar el rol Contributor en el grupo de recursos de destino o verificar los permisos de despliegue con la persona administradora
```

### Grupo de recursos no encontrado

**Detección:**

```
ResourceGroupNotFound: Resource group 'xxx' could not be found.
```

**Tratamiento:**

1. Anótalo en el informe
2. Sugiere crear el grupo de recursos
3. Omite what-if para este ámbito

**Entrada del informe:**

```markdown
#### ❌ El grupo de recursos no existe

- **Gravedad:** Error
- **Origen:** what-if
- **Mensaje:** El grupo de recursos 'my-rg' no existe
- **Corrección:** Crear el grupo de recursos antes del despliegue:
  ```bash
  az group create --name my-rg --location eastus
  ```

```

### Acceso denegado a la suscripción

**Detección:**
```

SubscriptionNotFound: The subscription 'xxx' could not be found.
InvalidSubscriptionId: Subscription '...' is not valid

```

**Tratamiento:**
1. Anótalo en el informe
2. Sugiere comprobar el ID de la suscripción
3. Enumera las suscripciones disponibles

---

## Errores de sintaxis de Bicep

### Errores de compilación

**Detección:**
```

/path/main.bicep(22,51) : Error BCP064: Found unexpected tokens
/path/main.bicep(10,5) : Error BCP018: Expected the "=" character at this location

```

**Tratamiento:**
1. Analiza la salida de errores para obtener los números de línea y columna
2. Incluye todos los errores en el informe (no te detengas en el primero)
3. Continúa con what-if (puede aportar contexto adicional)

**Entrada del informe:**
```markdown
#### ❌ Error de sintaxis de Bicep

- **Gravedad:** Error
- **Origen:** bicep build
- **Ubicación:** `main.bicep:22:51`
- **Código:** BCP064
- **Mensaje:** Se encontraron tokens inesperados en una expresión interpolada
- **Corrección:** Comprobar la sintaxis de interpolación de cadenas en la línea 22
- **Documentación:** https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/diagnostics/bcp064
```

### Módulo no encontrado

**Detección:**

```
Error BCP091: An error occurred reading file. Could not find file '...'
Error BCP190: The module is not valid
```

**Tratamiento:**

1. Anota el módulo que falta
2. Comprueba si se necesita `bicep restore`
3. Verifica la ruta del módulo

### Problemas de archivos de parámetros

**Detección:**

```
Error BCP032: The value must be a compile-time constant
Error BCP035: The specified object is missing required properties
```

**Tratamiento:**

1. Anota los problemas de parámetros
2. Indica qué parámetros presentan problemas
3. Sugiere correcciones

---

## Herramienta no instalada

### Azure CLI no encontrada

**Detección:**

```
'az' is not recognized as an internal or external command
az: command not found
```

**Tratamiento:**

1. Anótalo en el informe
2. Proporciona instrucciones de instalación.

- Si está disponible, usa la herramienta `extension_cli_install` de Azure MCP para obtener instrucciones de instalación.
- En otro caso, busca las instrucciones en https://learn.microsoft.com/en-us/cli/azure/install-azure-cli.

3. Omite los comandos az

**Entrada del informe:**

```markdown
#### ⏭️ Azure CLI no instalada

- **Gravedad:** Advertencia
- **Origen:** Entorno
- **Mensaje:** Azure CLI (az) no está instalada o no está en PATH
- **Corrección:** Instalar Azure CLI <AÑADIR AQUÍ LAS INSTRUCCIONES DE INSTALACIÓN>
- **Impacto:** Se omitió la validación what-if mediante comandos az
```

### CLI de Bicep no encontrada

**Detección:**

```
'bicep' is not recognized as an internal or external command
bicep: command not found
```

**Tratamiento:**

1. Anótalo en el informe
2. Azure CLI puede tener Bicep integrado; prueba `az bicep build`
3. Proporciona el enlace de instalación

**Entrada del informe:**

```markdown
#### ⏭️ CLI de Bicep no instalada

- **Gravedad:** Advertencia
- **Origen:** Entorno
- **Mensaje:** La CLI de Bicep no está instalada
- **Corrección:** Instalar la CLI de Bicep: https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/install
- **Impacto:** Se omitió la validación de sintaxis; Azure validará durante what-if
```

### Azure Developer CLI no encontrada

**Detección:**

```
'azd' is not recognized as an internal or external command
azd: command not found
```

**Tratamiento:**

1. Si existe `azure.yaml`, esta herramienta es obligatoria
2. Recurre a comandos de az CLI si es posible
3. Anótalo en el informe

---

## Errores específicos de What-If

### Límites de plantillas anidadas

**Detección:**

```
The deployment exceeded the nested template limit of 500
```

**Tratamiento:**

1. Anótalo como advertencia (no como error)
2. Explica que los recursos afectados aparecen como "Ignore"
3. Sugiere una revisión manual

### Enlace de plantilla no compatible

**Detección:**

```
templateLink references in nested deployments won't be visible in what-if
```

**Tratamiento:**

1. Anótalo como advertencia
2. Explica la limitación
3. Los recursos se verificarán durante el despliegue real

### Expresiones sin evaluar

**Detección:** Propiedades que muestran nombres de funciones como `[utcNow()]` en lugar de valores

**Tratamiento:**

1. Anótalo como información
2. Explica que se evalúan durante el despliegue
3. No es un error

---

## Errores de red

### Tiempo de espera agotado

**Detección:**

```
Connection timed out
Request timed out
```

**Tratamiento:**

1. Sugiere reintentar
2. Comprueba la conectividad de red
3. Puede indicar problemas en los servicios de Azure

### Errores SSL/TLS

**Detección:**

```
SSL: CERTIFICATE_VERIFY_FAILED
unable to get local issuer certificate
```

**Tratamiento:**

1. Anótalo en el informe
2. Puede indicar la presencia de un proxy o firewall corporativo
3. Sugiere comprobar la configuración SSL

---

## Estrategia de alternativas

Cuando falle la validación principal, intenta las alternativas en orden:

```
Provider (validación RBAC completa)
    ↓ falla con un error de permisos
ProviderNoRbac (validación sin comprobar permisos de escritura)
    ↓ falla
Template (solo sintaxis estática)
    ↓ falla
Informar de todos los fallos y omitir el análisis what-if
```

**Continúa siempre hasta generar el informe**, aunque fallen todos los pasos de validación.

---

## Agrupación de errores en el informe

Cuando se produzcan varios errores, agrúpalos de forma lógica:

1. **Agrupa por origen** (bicep, what-if, permisos)
2. **Ordena por gravedad** (errores antes que advertencias)
3. **Elimina duplicados** de errores similares
4. **Proporciona un recuento resumido** al principio

Ejemplo:

```markdown
## Problemas

Se encontraron **3 errores** y **2 advertencias**

### Errores (3)

1. [Error de sintaxis de Bicep - main.bicep:22:51](#error-1)
2. [Error de sintaxis de Bicep - main.bicep:45:10](#error-2)
3. [Grupo de recursos no encontrado](#error-3)

### Advertencias (2)

1. [Validación con permisos limitados](#warning-1)
2. [Límite de plantillas anidadas alcanzado](#warning-2)
```

---

## Referencia de códigos de salida

| Herramienta | Código de salida | Significado |
|------|-----------|---------|
| az | 0 | Correcto |
| az | 1 | Error general |
| az | 2 | Comando no encontrado |
| az | 3 | Falta un argumento obligatorio |
| azd | 0 | Correcto |
| azd | 1 | Error |
| bicep | 0 | Compilación correcta |
| bicep | 1 | Compilación fallida (errores) |
| bicep | 2 | Compilación correcta con advertencias |
