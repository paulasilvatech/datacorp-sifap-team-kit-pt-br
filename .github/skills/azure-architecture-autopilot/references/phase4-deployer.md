# Fase 4: Agente de despliegue

Este archivo contiene las instrucciones detalladas de la fase 4. Léelo y síguelo cuando la persona apruebe el despliegue después de completar la fase 3 (revisión de código).

---

**🚨🚨🚨 Orden obligatorio de ejecución de la fase 4: nunca omitir un paso 🚨🚨🚨**

Los 5 pasos siguientes deben ejecutarse **estrictamente en orden**. No se puede omitir ni saltar ningún paso.
Aunque la persona solicite el despliegue con "despliégalo", "adelante", "hazlo", etc., empieza siempre por el paso 1 y sigue el orden.

```
Paso 1: Verificar los prerrequisitos (az login, suscripción, grupo de recursos)
    ↓
Paso 2: Validación What-if (az deployment group what-if) ← Ejecución obligatoria
    ↓
Paso 3: Generar el diagrama de vista previa (02_arch_diagram_preview.html) ← Generación obligatoria
    ↓
Paso 4: Despliegue real tras la confirmación final de la persona (az deployment group create)
    ↓
Paso 5: Generar el diagrama del resultado del despliegue (03_arch_diagram_result.html)
```

**Nunca hagas lo siguiente:**

- Ejecutar `az deployment group create` directamente sin What-if
- Omitir la generación del diagrama de vista previa (`02_arch_diagram_preview.html`)
- Continuar con el despliegue sin mostrar los resultados What-if a la persona
- Limitarte a proporcionar comandos `az` para que la persona los ejecute manualmente

---

## Paso 1: Verificar los prerrequisitos

```powershell
# Verificar la instalación de az CLI y el inicio de sesión
az account show 2>&1
```

Si no hay una sesión iniciada, pide a la persona que ejecute `az login`.
El agente nunca debe introducir ni almacenar credenciales directamente.

Crea el grupo de recursos:

```powershell
az group create --name "<RG_NAME>" --location "<LOCATION>"  # Ubicación confirmada en la fase 1
```

→ Continúa con el siguiente paso después de confirmar el éxito

## Paso 2: Validate → Validación What-if: 🚨 obligatoria

**No omitas este paso. Ejecútalo siempre, por urgente que sea la solicitud de despliegue.**

**Paso 2-A: Ejecutar primero Validate (validación previa rápida)**

`what-if` puede **quedarse bloqueado indefinidamente sin mensajes de error** ante incumplimientos de políticas de Azure, errores de referencia a recursos, etc.
Para evitarlo, **ejecuta siempre `validate` primero**. Validate devuelve los errores rápidamente.

```powershell
# validate: detecta rápidamente incumplimientos de políticas, errores de esquema y problemas de parámetros
az deployment group validate `
  --resource-group "<RG_NAME>" `
  --parameters main.bicepparam
```

- **Validate se supera** → Pasar al paso 2-B (what-if)
- **Validate falla** → Analizar los mensajes de error, corregir Bicep, volver a compilar y validar
  - Incumplimiento de Azure Policy (`RequestDisallowedByPolicy`) → Reflejar los requisitos de la política en Bicep (por ejemplo, `azureADOnlyAuthentication: true`)
  - Error de esquema → Corregir la versión de API o las propiedades
  - Error de parámetros → Corregir el archivo de parámetros

**Paso 2-B: Ejecutar What-if**

Ejecuta what-if después de superar validate.

**Elige el método para pasar parámetros:**

- Si todos los parámetros `@secure()` tienen valores predeterminados → Usar `.bicepparam`
- Si los parámetros `@secure()` requieren datos de la persona → Usar `--template-file` + archivo de parámetros JSON

```powershell
# Método 1: usar .bicepparam (cuando todos los parámetros @secure() tienen valores predeterminados)
az deployment group what-if `
  --resource-group "<RG_NAME>" `
  --parameters main.bicepparam

# Método 2: usar un archivo de parámetros JSON (cuando los parámetros @secure() requieren datos de la persona)
az deployment group what-if `
  --resource-group "<RG_NAME>" `
  --template-file main.bicep `
  --parameters main.parameters.json `
  --parameters secureParam='value'
```

→ Resume los resultados What-if y preséntalos a la persona.

**⏱️ Método de ejecución de What-if y gestión del tiempo de espera:**

What-if valida los recursos en los servidores de Azure, por lo que puede tardar según el servicio y la región.
**Ejecuta siempre con `initial_wait: 300` (5 minutos).** Si no termina en 5 minutos, se agota automáticamente el tiempo de espera.

```powershell
# Establecer siempre initial_wait: 300 al invocar la herramienta powershell
# mode: "sync", initial_wait: 300
az deployment group what-if `
  --resource-group "<RG_NAME>" `
  --parameters main.bicepparam
```

**Termina en 5 minutos** → Continuar normalmente (resumir resultados → diagrama de vista previa → confirmación del despliegue)

**No termina en 5 minutos (tiempo de espera agotado)** → Detener inmediatamente con `stop_powershell` y ofrecer opciones:

```
ask_user({
  question: "La validación What-if no terminó en 5 minutos. La respuesta del servidor de Azure se está retrasando. ¿Cómo quieres continuar?",
  choices: [
    "Reintentar (Recomendado)",
    "Omitir What-if y desplegar directamente"
  ]
})
```

**Si se selecciona "Reintentar":** vuelve a ejecutar el mismo comando con `initial_wait: 300`. Reintenta un máximo de 2 veces.
**Si se selecciona "Omitir What-if y desplegar directamente":**

- Genera el diagrama de vista previa a partir del borrador de la fase 1
- Informa a la persona de los riesgos:
  > **⚠️ Se desplegará sin validación What-if.** Pueden producirse cambios inesperados en los recursos. Verifícalos en Azure Portal después del despliegue.

**Nunca hagas lo siguiente:**

- Ejecutar sin establecer `initial_wait` y provocar una espera indefinida
- Permitir que el agente decida arbitrariamente "what-if es opcional" y lo omita
- Pasar automáticamente al despliegue sin preguntar a la persona cuando se agote el tiempo de espera
- Omitir what-if por motivos como "desplegar es más rápido"

## Paso 3: Diagrama de vista previa basado en resultados What-if: 🚨 obligatorio

**No omitas este paso. Genera siempre el diagrama de vista previa cuando What-if se complete correctamente.**

Regenera el diagrama con los recursos reales que se desplegarán (nombres, tipos, ubicaciones y cantidades) según los resultados What-if.
Conserva el borrador de la fase 1 (`01_arch_diagram_draft.html`) sin cambios y genera la vista previa como `02_arch_diagram_preview.html`.
El borrador puede volver a abrirse en cualquier momento.

```
## Arquitectura que se desplegará (basada en What-if)

[Enlace al diagrama interactivo: 02_arch_diagram_preview.html]
(Borrador de diseño: 01_arch_diagram_draft.html)

Recursos que se crearán (N elementos):
[Tabla de resumen de resultados What-if]

¿Desplegar estos recursos? (Sí/No)
```

Pasa al paso 4 cuando la persona confirme. **No continúes con el despliegue sin el diagrama de vista previa.**

## Paso 4: Despliegue real

Ejecuta solo cuando la persona haya revisado el diagrama de vista previa y los resultados What-if, y haya aprobado el despliegue.
**Usa el mismo método para pasar parámetros que utilizaste en What-if.**

```powershell
$deployName = "deploy-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

# Método 1: usar .bicepparam
az deployment group create `
  --resource-group "<RG_NAME>" `
  --parameters main.bicepparam `
  --name $deployName `
  2>&1 | Tee-Object -FilePath deployment.log

# Método 2: usar un archivo de parámetros JSON
az deployment group create `
  --resource-group "<RG_NAME>" `
  --template-file main.bicep `
  --parameters main.parameters.json `
  --name $deployName `
  2>&1 | Tee-Object -FilePath deployment.log
```

Supervisa periódicamente el progreso durante el despliegue:

```powershell
az deployment group show `
  --resource-group "<RG_NAME>" `
  --name "<DEPLOYMENT_NAME>" `
  --query "{status:properties.provisioningState, duration:properties.duration}" `
  -o table
```

## Gestión de fallos de despliegue

Cuando falla el despliegue, algunos recursos pueden quedar en estado 'Failed'. Volver a desplegar en ese estado provoca errores como `AccountIsNotSucceeded`.

**⚠️ La eliminación de recursos es un comando destructivo. Explica siempre la situación y obtén aprobación antes de ejecutarlo.**

```
[Nombre del recurso] falló durante el despliegue.
Para volver a desplegar, primero deben eliminarse los recursos que fallaron.

¿Eliminar y volver a desplegar? (Sí/No)
```

Elimina los recursos que fallaron y vuelve a desplegar cuando la persona lo apruebe.

**🔹 Gestión de recursos con eliminación temporal (evitar el bloqueo de nuevos despliegues):**

Cuando se elimina un grupo de recursos después de un despliegue fallido, Cognitive Services (Foundry), Key Vault, etc. quedan en **estado de eliminación temporal**.
Volver a desplegar con el mismo nombre provoca errores `FlagMustBeSetForRestore` y `Conflict`.

**Comprueba siempre antes de volver a desplegar:**

```powershell
# Comprobar Cognitive Services con eliminación temporal
az cognitiveservices account list-deleted -o table

# Comprobar Key Vault con eliminación temporal
az keyvault list-deleted -o table
```

**Opciones de resolución (ofrecerlas a la persona):**

```
ask_user({
  question: "Se encontraron recursos con eliminación temporal de un despliegue anterior. ¿Cómo quieres proceder?",
  choices: [
    "Purgar y volver a desplegar (Recomendado): eliminar por completo y crear de nuevo",
    "Volver a desplegar en modo de restauración: recuperar los recursos existentes"
  ]
})
```

**Precaución: Key Vault con `enablePurgeProtection: true`:**

- No se puede purgar (hay que esperar a que termine el período de retención)
- No se puede volver a crear con el mismo nombre
- **Solución: cambiar el nombre de Key Vault** y volver a desplegar (por ejemplo, añadir una marca de tiempo a la semilla de `uniqueString()`)
- Explica la situación y orienta a la persona sobre el cambio de nombre

## Paso 5: Despliegue completado: generar el diagrama de recursos reales e informar

Una vez completado el despliegue, consulta los recursos realmente desplegados y genera el diagrama final de arquitectura.

**Paso 1: Consultar los recursos desplegados**

```powershell
az resource list --resource-group "<RG_NAME>" --output json
```

**Paso 2: Generar el diagrama a partir de los recursos reales**

Extrae los nombres, tipos, SKU y puntos de conexión de los recursos de los resultados de la consulta y genera el diagrama final con el motor integrado.
Ten cuidado con los nombres de archivo para no sobrescribir diagramas anteriores:

- `01_arch_diagram_draft.html`: borrador de diseño (conservar)
- `02_arch_diagram_preview.html`: vista previa What-if (conservar)
- `03_arch_diagram_result.html`: versión final del resultado del despliegue

Rellena el JSON de services del diagrama con la información real de los recursos desplegados:

- `name`: nombre real del recurso (por ejemplo, `foundry-duru57kxgqzxs`)
- `sku`: SKU real
- `details`: valores reales, como puntos de conexión, ubicación, etc.

**Paso 3: Informar**

```
## ¡Despliegue completado!

[Diagrama interactivo de arquitectura: 03_arch_diagram_result.html]
(Borrador de diseño: 01_arch_diagram_draft.html | Vista previa What-if: 02_arch_diagram_preview.html)

Recursos creados (N elementos):
[Nombres, tipos y puntos de conexión de recursos extraídos dinámicamente de los resultados reales del despliegue]

## Pasos siguientes
1. Verificar los recursos en Azure Portal
2. Comprobar el estado de conexión de los puntos de conexión privados
3. Ofrecer orientación de configuración adicional si es necesario

## Comando de limpieza (si es necesario)
az group delete --name <RG_NAME> --yes --no-wait
```

---

## Gestión de solicitudes de cambio de arquitectura después del despliegue

**Cuando la persona solicite añadir, cambiar o eliminar recursos después del despliegue, NO pases directamente a Bicep o al despliegue.**
Vuelve siempre a la fase 1 y actualiza primero la arquitectura.

**Proceso:**

1. **Confirma la intención de la persona**: pregunta primero si quiere añadir elementos a la arquitectura desplegada existente:

   ```
   ¿Quieres añadir una máquina virtual a la arquitectura actualmente desplegada?
   Configuración actual: [Resumen de los servicios desplegados]
   ```

2. **Vuelve a la fase 1: aplica la regla de confirmación de cambios**
   - Usa el resultado del despliegue existente (`03_arch_diagram_result.html`) como referencia del estado actual
   - Verifica los campos obligatorios de los servicios nuevos (SKU, red, disponibilidad regional, etc.)
   - Confirma los elementos pendientes mediante ask_user
   - Comprueba los hechos (consulta de MS Docs + contraste de información)

3. **Genera el diagrama de arquitectura actualizado**
   - Combina los recursos desplegados existentes y los nuevos en `04_arch_diagram_update_draft.html`
   - Muéstralo a la persona y obtén su confirmación:

   ```
   ## Arquitectura actualizada

   [Diagrama interactivo: 04_arch_diagram_update_draft.html]
   (Resultado del despliegue anterior: 03_arch_diagram_result.html)

   **Cambios:**
   - Añadido: [Lista de servicios nuevos]
   - Eliminado: [Lista de servicios eliminados] (si los hay)

   ¿Continuar con esta configuración?
   ```

4. **Después de confirmar, pasa por las fases 2 → 3 → 4 en orden**
   - Añade de forma incremental módulos de recursos nuevos al Bicep existente
   - Revisión → What-if → Despliegue (despliegue incremental)

**Nunca hagas lo siguiente:**

- Pasar directamente a generar Bicep sin actualizar el diagrama de arquitectura cuando se solicita un cambio después del despliegue
- Ignorar el estado del despliegue existente y crear recursos nuevos de forma aislada
- Continuar sin confirmar con la persona si desea añadir elementos a la arquitectura existente
