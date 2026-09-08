# Fase 1: Asesor de arquitectura

Este archivo contiene las instrucciones detalladas de la fase 1. Al entrar en la fase 1 desde SKILL.md, lee y sigue este archivo.
Se usa tanto en la ruta A (diseño nuevo) como en la ruta B (modificación después del análisis de la fase 0).

---

## Al entrar desde la ruta B (después de analizar los recursos existentes)

El diagrama de la arquitectura actual (00_arch_current.html), analizada en la fase 0, ya existe.
En este caso, omite la confirmación del nombre del proyecto y la lista de servicios de 1-1 e inicia directamente la conversación sobre modificaciones:

1. "¿Qué te gustaría cambiar aquí?": solicitud de la persona en lenguaje natural
2. Aplica la regla de confirmación de cambios: confirma los campos obligatorios pendientes de los cambios
3. Comprueba los hechos: contrasta la información con MS Docs
4. Genera el diagrama actualizado (01_arch_diagram_draft.html)
5. Pasa a la fase 2 después de la confirmación

---

**Objetivo de esta fase**: identificar con precisión lo que quiere la persona y definir juntos la arquitectura final.

### 1-1. Preparación del diagrama: recopilación de información obligatoria

Antes de dibujar el diagrama, pregunta a la persona hasta confirmar todos los elementos siguientes.
**Genera el diagrama solo después de confirmar todos los elementos.**

**Primero, confirma el nombre del proyecto:**

Ofrece un valor predeterminado como opción mediante `ask_user`. Si la persona solo pulsa Intro, se aplica ese valor; también puede escribir un nombre personalizado.
El valor predeterminado se deduce de la solicitud (por ejemplo, chatbot RAG → `rag-chatbot`, plataforma de datos → `data-platform`).

```
ask_user({
  question: "Elige un nombre de proyecto. Se usará para el nombre de la carpeta de Bicep, la ruta del diagrama y el nombre del despliegue.",
  choices: ["<inferred-default>", "azure-project"]
})
```

El nombre del proyecto se usa para el nombre de la carpeta de salida de Bicep, la ruta donde se guarda el diagrama, el nombre del despliegue, etc.

**🔹 Precarga paralela junto con la pregunta sobre el nombre del proyecto (obligatoria):**

Al preguntar el nombre del proyecto mediante `ask_user`, hay un tiempo de espera hasta que la persona responda.
Aprovéchalo para **precargar en paralelo la información necesaria para las preguntas posteriores y la generación de Bicep**.

**Herramientas que deben invocarse simultáneamente con ask_user:**

```
// Invocar ask_user y las herramientas siguientes simultáneamente en una sola respuesta
[1] ask_user: pregunta sobre el nombre del proyecto

[2] view: cargar archivos de referencia (obtener de antemano la información estable)
    - references/service-gotchas.md
    - references/ai-data.md
    - references/azure-dynamic-sources.md
    - references/architecture-guidance-sources.md

[3] web_fetch: consultar de antemano las guías de arquitectura (cuando se identifique el tipo de carga de trabajo)
    - Hasta 2 consultas específicas según las reglas de decisión de architecture-guidance-sources.md

[4] web_fetch: consultar MS Docs para los servicios mencionados por la persona (obtener de antemano la información dinámica)
    - Por ejemplo, Foundry → Versión de API, página de disponibilidad de modelos
    - Por ejemplo, AI Search → Página de la lista de SKU
    - Usar los patrones de URL de azure-dynamic-sources.md
```

**Ventajas**: mientras la persona escribe el nombre del proyecto, se carga toda la información,
de modo que las preguntas sobre SKU y región pueden presentar opciones precisas inmediatamente después de confirmar el nombre.
El tiempo de espera se reduce considerablemente respecto de la ejecución secuencial.

**Notas:**

- Solo se precarga información independiente del nombre del proyecto (nada depende del nombre)
- web_fetch se utiliza únicamente para los servicios mencionados en la solicitud inicial (sin conjeturas)
- La comprobación de Azure CLI (`az account show`) NO se realiza en este momento; se precarga al finalizar la arquitectura

**🔹 Uso de las guías de arquitectura (ajuste de la profundidad de las preguntas):**

Extrae **decisiones de diseño que deben abordarse** de las guías de arquitectura consultadas durante la precarga
e incorpóralas de forma natural a las preguntas posteriores.

**Finalidad**: no limitarse a preguntas de especificación, como SKU o región,
sino incorporar las **decisiones de diseño** recomendadas por las guías oficiales de arquitectura.

**Ejemplo: cuando se solicita un "chatbot RAG":**

- Consulta la arquitectura de referencia de chat de Foundry (A6)
- Extrae del documento las decisiones de diseño recomendadas:
  → Nivel de aislamiento de red (¿totalmente privado o híbrido?)
  → Método de autenticación (¿identidad administrada o clave de API?)
  → Estrategia de ingesta de datos (¿indexación push o pull?)
  → Alcance de la supervisión (¿se necesita Application Insights?)
- Incluye estos puntos de forma natural en las preguntas a la persona

**Notas:**

- De las guías de arquitectura se extraen **"aspectos sobre los que preguntar"**, no "respuestas"
- Las especificaciones de despliegue, como SKU, versión de API y región, se siguen determinando únicamente mediante `azure-dynamic-sources.md`
- Límite de consultas: máximo de 2 documentos. No recorrer toda la documentación

**Elementos de confirmación obligatoria:**

- [ ] Nombre del proyecto (predeterminado: `azure-project`)
- [ ] Lista de servicios (qué servicios de Azure se utilizarán)
- [ ] SKU o nivel de cada servicio
- [ ] Método de conexión de red (uso de puntos de conexión privados)
- [ ] Ubicación del despliegue (región)

**Principios para formular preguntas:**

- No vuelvas a preguntar por información que la persona ya haya mencionado
- No preguntes por detalles de implementación que no se representen directamente en el diagrama (método de indexación, volumen de consultas, etc.)
- No hagas demasiadas preguntas a la vez; pregunta de forma concisa solo por los elementos clave pendientes
- Para elementos con valores predeterminados evidentes (por ejemplo, PE habilitado), asúmelos y pide confirmación. Sin embargo, la ubicación SIEMPRE debe confirmarse con la persona
- **Al preguntar por SKU, modelos u opciones de servicio, muestra TODAS las opciones disponibles verificadas en MS Docs y proporciona también la URL de MS Docs.** Así la persona puede consultar la fuente y decidir por su cuenta. No muestres solo algunas opciones ni las filtres arbitrariamente

**🔹 Selección de SKU de máquinas virtuales y recursos: comprobación previa obligatoria de disponibilidad regional:**

**Antes** de preguntar por la SKU de una máquina virtual u otro recurso, DEBES consultar cuáles están realmente disponibles en la región de destino.
Si una SKU está bloqueada por restricciones de capacidad en una región, el despliegue fallará.

**Método de verificación de SKU de máquinas virtuales:**

```powershell
# Consultar solo SKU de máquinas virtuales disponibles sin restricciones en la región de destino
az vm list-skus --location "<LOCATION>" --size Standard_D2 --resource-type virtualMachines `
  --query "[?restrictions==``[]``].name" -o tsv
```

**Principios:**

- No incluyas SKU sin verificar entre las opciones
- No recomiendes "SKU habituales" de memoria; DEBES verificarlas mediante az cli o MS Docs
- Incluye únicamente SKU verificadas en las opciones de `ask_user`
- Incluso si la persona proporciona una SKU, verifica su disponibilidad antes de continuar

**Este principio se aplica no solo a las máquinas virtuales, sino a TODOS los recursos sujetos a restricciones de capacidad (Fabric Capacity, etc.).**

**🔹 Principio de exploración de opciones de servicio: prohibido "enumerar de memoria":**

Cuando la persona pregunte por una categoría de servicio ("¿Qué opciones de Spark hay?", "¿Qué opciones de colas de mensajes existen?") o necesites explorar servicios para una capacidad concreta:

**NUNCA hagas esto:**

- Consultar directamente las URL de solo 2-3 servicios que recuerdes y enumerarlos
- Afirmar de forma categórica "En Azure, X tiene A y B"

**DEBES hacer esto:**

1. **Explorar toda la categoría mediante web_search**: busca por categoría, por ejemplo, `"Azure managed Spark options site:learn.microsoft.com"`, para descubrir primero qué servicios existen
2. **Contrastar con el alcance de v1**: independientemente de los resultados, comprueba si los servicios del alcance de v1 (Foundry, Fabric, AI Search, ADLS Gen2, etc.) pertenecen a esa categoría. Por ejemplo: "Spark" → La carga de trabajo Data Engineering de Microsoft Fabric también proporciona Spark
3. **Consultar específicamente las opciones descubiertas**: consulta MS Docs para los servicios encontrados y recopila información precisa para compararlos
4. **Presentar todas las opciones a la persona**: ofrece una comparación completa de las opciones descubiertas, sin omitir ninguna

**Ejemplo: ante la pregunta "¿Qué instancias de Spark están disponibles?":**

```
Enfoque incorrecto: consultar solo la URL de Databricks y la de Synapse → Comparar solo 2
Enfoque correcto: web_search("Azure managed Spark options") → Descubrir Databricks, Synapse, Fabric Spark, HDInsight
            → Comprobar el alcance de v1: Fabric está incluido y proporciona Spark → DEBE incluirse
            → Consulta específica de MS Docs de cada servicio → Presentar la tabla comparativa completa
```

Este principio se aplica no solo al explorar categorías de servicios, sino siempre que la persona solicite "alternativas", "otras opciones", "comparación", etc.

**🔹 Herramienta ask_user: uso obligatorio:**

Para preguntas con opciones, DEBES usar la herramienta `ask_user`. Permite seleccionar cómodamente con las teclas de dirección y también escribir una respuesta personalizada.

**Reglas de uso de ask_user:**

- Las preguntas con 2 o más opciones **DEBEN** usar ask_user (no las enumeres como texto)
- **`choices` DEBE pasarse como una matriz de cadenas (`["A", "B"]`)**; pasarlo como una cadena (`"A, B"`) provoca un error
- Si hay una opción recomendada, colócala primero y añade `(Recomendado)` al final
- Incluye información de referencia en las opciones; por ejemplo, `"Standard S1 - Recomendado para producción. Ref: https://..."`
- **Solo 1 pregunta por llamada**: si necesitas preguntar por varios elementos, invoca ask_user de forma secuencial para cada uno
- Se permiten como máximo 4 opciones. Si hay 5 o más, incluye solo las 3-4 más habituales (la persona también puede escribir una respuesta personalizada)
- Si se necesitan varias selecciones, sepáralas en preguntas independientes

**Elementos que requieren ask_user:**

- Selección de la ubicación de despliegue (región)
- Selección de SKU o nivel
- Selección de modelos (de chat, de embeddings, etc.)
- Selección del método de conexión de red
- Selección de suscripción (fase 1, paso 2)
- Selección de grupo de recursos (fase 1, paso 3)
- Cualquier otra pregunta que requiera una elección de la persona

**Ejemplos de uso:**

```
// El nombre del proyecto es una entrada libre, por lo que no se usa ask_user (preguntar como texto)
// SKU, región, etc., con opciones definidas usan ask_user:

// 1. Pregunta sobre SKU
ask_user({
  question: "Selecciona la SKU de AI Search. Ref: https://learn.microsoft.com/en-us/azure/search/search-sku-tier",
  choices: [
    "Standard S1 - Recomendado para producción (Recomendado)",
    "Basic - Para desarrollo y pruebas, hasta 15 índices",
    "Standard S2 - Producción con mucho tráfico",
    "Free - Prueba gratuita, 50MB de almacenamiento"
  ]
})

// 2. Pregunta sobre la región (llamada independiente; solo 1 pregunta por llamada)
ask_user({
  question: "Selecciona la región de Azure para el despliegue. Ref: https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models",
  choices: [
    "Korea Central - Región de Corea, admite la mayoría de los servicios (Recomendado)",
    "East US - Este de Estados Unidos, admite todos los modelos de IA",
    "Japan East - Este de Japón, cerca de Corea"
  ]
})
```

> **Nota**: los valores de SKU y región de los ejemplos anteriores son únicamente ilustrativos. Al formular las preguntas reales, construye las opciones dinámicamente con la información más reciente consultando MS Docs mediante web_fetch. No las fijes en el código.

**Ejemplo: cuando la información proporcionada es insuficiente:**

```
Persona: "Quiero crear un chatbot RAG usando un modelo GPT en Foundry y AI Search."

→ Confirmado: Microsoft Foundry, Azure AI Search
→ Pendiente: nombre del proyecto, nombre concreto del modelo, modelo de embeddings, red (¿PE?), SKU, ubicación del despliegue

El agente confirma primero el nombre del proyecto mediante ask_user (predeterminado: rag-chatbot).
Después ofrece opciones para cada elemento pendiente mediante la herramienta ask_user.
Incluye URL de MS Docs en las opciones para que la persona pueda consultarlas directamente.
```

**🚨🚨🚨 [PUERTA OBLIGATORIA] Especificaciones recopiladas → Generación del diagrama obligatoria 🚨🚨🚨**

**Inmediatamente después de completar todos los elementos confirmados, DEBES realizar los pasos siguientes EN ORDEN. Omitir cualquier paso significa que la fase 1 está incompleta.**

1. Construye **el JSON de services y el JSON de connections** a partir de la lista de servicios confirmada
2. Usa el motor de diagramas integrado para generar **`<project-name>/01_arch_diagram_draft.html`**
3. Ábrelo automáticamente en el navegador mediante `Start-Process`
4. Muestra el diagrama a la persona con el **formato de informe** siguiente; DEBE incluir una **tabla de configuración detallada**
5. Pregunta a la persona: **"¿Quieres cambiar o añadir algo?"**
6. Si no hay cambios → Inicia la transición a la fase 2 (ask_user con orientación sobre el siguiente paso)

**NUNCA hagas esto:**

- ❌ No generar el diagrama y preguntar "La arquitectura está confirmada. ¿Pasamos al siguiente paso?"
- ❌ Posponer la generación del diagrama hasta la fase 2 o una fase posterior
- ❌ Decir "Crearé el diagrama más adelante"
- ❌ Declarar "arquitectura confirmada" solo porque se terminaron de recopilar las especificaciones
- ❌ Generar el diagrama, pero NO mostrar la tabla de configuración
- ❌ Omitir la pregunta "¿quieres cambiar algo?" y pasar directamente a la fase 2

**Condición de validación**: NO se permite entrar en la fase 2 si no se ha generado el archivo `01_arch_diagram_draft.html`.

**Formato del informe tras completar el diagrama (TODAS las secciones son OBLIGATORIAS):**

```
## Diagrama de arquitectura

[Enlace al diagrama interactivo, abierto automáticamente en el navegador]

### Configuración confirmada

| Servicio | Tipo | SKU/Nivel | Detalles |
|---------|------|----------|---------|
| [Nombre del servicio] | [Tipo de recurso de Azure] | [SKU] | [Configuración principal: modelo, capacidad, etc.] |
| ... | ... | ... | ... |

**Red**: [VNet + punto de conexión privado / Pública / etc.]
**Ubicación**: [región confirmada]
```

**Después de mostrar el informe, usa inmediatamente `ask_user` con opciones:**

```
ask_user({
  question: "El diagrama de arquitectura y la configuración están listos. ¿Qué quieres hacer?",
  choices: [
    "Está bien: continuar con la generación de código Bicep (Recomendado)",
    "Quiero modificar la arquitectura",
    "Añadir más servicios"
  ]
})
```

- Si elige "continuar" → Inicia la transición a la fase 2 (recopila información de suscripción y grupo de recursos)
- Si elige "modificar" o "añadir" → Aplica los cambios, regenera el diagrama y muestra de nuevo el informe

**🚨 La tabla de configuración NO es opcional.** La persona necesita verificar visualmente lo confirmado antes de continuar. Sin la tabla, no puede validar la arquitectura.

### 1-2. Generación de diagramas HTML interactivos

Usa el **motor de diagramas** integrado (scripts Python incluidos en la skill) para crear un diagrama HTML interactivo.
No se necesita `pip install`: los scripts están disponibles directamente en `scripts/`, sin conexión de red ni instalación de paquetes.
Incluye más de 605 iconos oficiales de Azure.

**Convención de nomenclatura de los archivos de diagrama:**

Todos los diagramas se generan dentro de la carpeta del proyecto Bicep (`<project-name>/`).
Se gestionan de forma sistemática mediante prefijos numerados por etapa, y nunca se sobrescriben los archivos de etapas anteriores.

| Etapa | Nombre del archivo | Cuándo se genera |
|-------|-----------|----------------|
| Borrador de diseño de la fase 1 | `01_arch_diagram_draft.html` | Al confirmar el diseño de arquitectura |
| Vista previa What-if de la fase 4 | `02_arch_diagram_preview.html` | Después de la validación What-if |
| Resultado del despliegue de la fase 4 | `03_arch_diagram_result.html` | Al terminar el despliegue real |

**Localización de la ruta del módulo integrado y la ruta de Python:**

**🚨 La ruta de Python y la del módulo integrado se verifican una sola vez durante la precarga de la fase 1 y se reutilizan en todas las generaciones posteriores de diagramas. NO vuelvas a buscarlas cada vez.**

```powershell
# ─── Paso 1: localizar la ruta de Python ───
# ⚠️ Get-Command python puede detectar el alias de Windows Store; por eso se busca primero en el sistema de archivos
$PythonCmd = $null

# Prioridad 1: búsqueda directa de la ruta real de instalación (la más fiable)
$PythonExe = Get-ChildItem -Path "$env:LOCALAPPDATA\Programs\Python" -Filter "python.exe" -Recurse -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notlike '*WindowsApps*' } |
  Select-Object -First 1 -ExpandProperty FullName
if ($PythonExe) { $PythonCmd = $PythonExe }

# Prioridad 2: búsqueda en Program Files
if (-not $PythonCmd) {
  $PythonExe = Get-ChildItem -Path "$env:ProgramFiles\Python*", "$env:ProgramFiles(x86)\Python*" -Filter "python.exe" -Recurse -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty FullName
  if ($PythonExe) { $PythonCmd = $PythonExe }
}

# Prioridad 3: buscar en PATH (solo si no es un alias de Windows Store)
if (-not $PythonCmd) {
  foreach ($cmd in @('python3', 'py')) {
    $found = Get-Command $cmd -ErrorAction SilentlyContinue
    if ($found -and $found.Source -notlike '*WindowsApps*') { $PythonCmd = $cmd; break }
  }
}

if (-not $PythonCmd) {
  Write-Host ""
  Write-Host "Python is not installed or not found in PATH." -ForegroundColor Red
  Write-Host ""
  Write-Host "Please install using one of the following methods:" -ForegroundColor Yellow
  Write-Host "  1. winget install Python.Python.3.12"
  Write-Host "  2. Download from https://www.python.org/downloads/"
  Write-Host "  3. Search for 'Python 3.12' in the Microsoft Store and install"
  Write-Host ""
  Write-Host "After installation, restart your terminal and try again."
  return
}

# ─── Paso 2: localizar los scripts integrados (no se necesita pip install) ───
# Prioridad 1: carpeta local de la skill en el proyecto
$ScriptsDir = Get-ChildItem -Path ".github\skills\azure-architecture-autopilot" -Filter "cli.py" -Recurse -ErrorAction SilentlyContinue |
  Where-Object { $_.Directory.Name -eq 'scripts' } |
  Select-Object -First 1 -ExpandProperty DirectoryName
# Prioridad 2: carpeta global de la skill
if (-not $ScriptsDir) {
  $ScriptsDir = Get-ChildItem -Path "$env:USERPROFILE\.copilot\skills\azure-architecture-autopilot" -Filter "cli.py" -Recurse -ErrorAction SilentlyContinue |
    Where-Object { $_.Directory.Name -eq 'scripts' } |
    Select-Object -First 1 -ExpandProperty DirectoryName
}

# ─── Paso 3: generar el diagrama (método CLI: ejecución directa del script) ───
$OutputFile = "<project-name>\01_arch_diagram_draft.html"

& $PythonCmd "$ScriptsDir\cli.py" `
  --services '<services_JSON>' `
  --connections '<connections_JSON>' `
  --title "Architecture Title" `
  --vnet-info "10.0.0.0/16 | pe-subnet: 10.0.1.0/24" `
  --output $OutputFile

# Abrir automáticamente en el navegador después de la generación
Start-Process $OutputFile
```

**También está disponible el método de la API de Python (alternativa):**

Cuando el JSON sea muy grande, puedes llamar directamente a la API de Python para evitar los límites de longitud de los argumentos de CLI.
Añade la carpeta de scripts a `sys.path` para importar el módulo integrado:

```python
import sys, os
# Añadir la carpeta de scripts a la ruta de Python (usar el módulo integrado sin pip install)
scripts_dir = r"<absolute path to scripts folder>"  # Valor de $ScriptsDir encontrado en el paso 2
sys.path.insert(0, scripts_dir)

from generator import generate_diagram

services = [...]   # JSON de services
connections = [...] # JSON de connections

html = generate_diagram(
    services=services,
    connections=connections,
    title="Architecture Title",
    vnet_info="10.0.0.0/16 | pe-subnet: 10.0.1.0/24",
    hierarchy=None  # Solo se usa para varias suscripciones o grupos de recursos
)

with open("<project-name>/01_arch_diagram_draft.html", "w", encoding="utf-8") as f:
    f.write(html)
```

**🔹 Criterios para elegir entre CLI y API de Python:**

| Escenario | Método | Motivo |
|----------|--------|--------|
| 10 servicios o menos | CLI (`python scripts/cli.py`) | Sencillo y rápido |
| Más de 10 servicios o uso de jerarquía | API de Python (añadir a sys.path) | Evita los límites de longitud de los argumentos de CLI |
| Diagramas con varias suscripciones o grupos de recursos | API de Python + parámetro `hierarchy` | Representación de la estructura jerárquica |

**Lista completa de tipos de servicio compatibles:**

Disponible en los archivos de referencia incluidos en la skill, en `references/`.
Los valores de tipos de servicio compatibles se enumeran más abajo, en la sección del formato JSON de services.

> **Orden de generación del diagrama**: (1) verificar la ruta de Python → (2) verificar la ruta del módulo integrado → (3) construir el JSON de services/connections → (4) ejecutar. Si Python no está instalado, guía a la persona para que lo instale antes de construir el JSON. Así evitas generar un JSON que no se pueda usar por falta de Python.

> **🚨 Apertura automática del diagrama (sin excepciones)**: cuando se genere un archivo HTML con el motor de diagramas integrado, **DEBE abrirse siempre** en el navegador, sea cual sea la situación. Sin excepción, cada vez que se genere o regenere un diagrama, ejecuta `Start-Process`. La generación y la apertura en el navegador se ejecutan siempre juntas en un único bloque de comandos PowerShell.
>
> **Cuándo se aplica (no solo en estos casos, sino SIEMPRE que se genere un diagrama HTML):**
>
> - Borrador de diseño de la fase 1 (`01_arch_diagram_draft.html`)
> - Regeneración del diagrama después de confirmar cambios
> - Vista previa What-if de la fase 4 (`02_arch_diagram_preview.html`)
> - Resultado del despliegue de la fase 4 (`03_arch_diagram_result.html`)
> - Cambios de arquitectura posteriores al despliegue (`04_arch_diagram_update_draft.html`)
> - Cualquier otro caso en que se regenere un diagrama por cualquier motivo

**Formato JSON de services:**

Se construye dinámicamente a partir de la lista de servicios confirmada por la persona. A continuación se describe la estructura JSON.

```json
[
  {"id": "uniqueID", "name": "Nombre visible del servicio", "type": "iconType", "sku": "SKU", "private": true/false,
   "details": ["Línea de detalle 1", "Línea de detalle 2"]}
]
```

| Campo | Obligatorio | Tipo | Descripción |
|-------|----------|------|-------------|
| `id` | Sí | string | Identificador único (kebab-case) |
| `name` | Sí | string | Nombre visible que aparece en el diagrama |
| `type` | Sí | string | Tipo de servicio (seleccionado de la lista siguiente) |
| `sku` | | string | Información de SKU o nivel |
| `private` | | boolean | Punto de conexión privado conectado (predeterminado: false) |
| `details` | | string[] | Información adicional mostrada en el panel lateral |
| `subscription` | | string | Nombre de la suscripción (obligatorio al usar jerarquía) |
| `resourceGroup` | | string | Nombre del grupo de recursos (obligatorio al usar jerarquía) |

**Tipo de servicio: referencia canónica:**

> ⚠️ **CRITICAL (crítico)**: usa siempre el **tipo canónico** de la tabla siguiente. NO uses nombres de recursos de Azure ARM (por ejemplo, `private_endpoints`, `storage_accounts`, `data_factories`). El generador normaliza las variantes habituales, pero los tipos canónicos garantizan la representación correcta de iconos, la detección de PE y la codificación por colores.

| Categoría | Tipo canónico | Recurso de Azure | Icono |
|----------|---------------|----------------|------|
| **IA** | `ai_foundry` | Microsoft.CognitiveServices/accounts (kind: AIServices) | AI Foundry |
| | `openai` | Microsoft.CognitiveServices/accounts (kind: OpenAI) | Azure OpenAI |
| | `ai_hub` | Proyecto de Foundry | AI Studio |
| | `search` | Microsoft.Search/searchServices | Cognitive Search |
| | `document_intelligence` | Microsoft.CognitiveServices/accounts (kind: FormRecognizer) | Form Recognizer |
| | `aml` | Microsoft.MachineLearningServices/workspaces | Machine Learning |
| **Datos** | `fabric` | Microsoft.Fabric/capacities | Microsoft Fabric |
| | `adf` | Microsoft.DataFactory/factories | Data Factory |
| | `storage` | Microsoft.Storage/storageAccounts | Storage Account |
| | `adls` | ADLS Gen2 (Storage con HNS) | Data Lake |
| | `cosmos_db` | Microsoft.DocumentDB/databaseAccounts | Cosmos DB |
| | `sql_database` | Microsoft.Sql/servers/databases | SQL Database |
| | `sql_server` | Microsoft.Sql/servers | SQL Server |
| | `databricks` | Microsoft.Databricks/workspaces | Databricks |
| | `synapse` | Microsoft.Synapse/workspaces | Synapse Analytics |
| | `redis` | Microsoft.Cache/redis | Redis Cache |
| | `stream_analytics` | Microsoft.StreamAnalytics/streamingjobs | Stream Analytics |
| | `postgresql` | Microsoft.DBforPostgreSQL/flexibleServers | PostgreSQL |
| | `mysql` | Microsoft.DBforMySQL/flexibleServers | MySQL |
| **Seguridad** | `keyvault` | Microsoft.KeyVault/vaults | Key Vault |
| | `sentinel` | Microsoft.SecurityInsights | Sentinel |
| **Proceso** | `appservice` | Microsoft.Web/sites | App Service |
| | `function_app` | Microsoft.Web/sites (kind: functionapp) | Function App |
| | `vm` | Microsoft.Compute/virtualMachines | Virtual Machine |
| | `aks` | Microsoft.ContainerService/managedClusters | AKS |
| | `acr` | Microsoft.ContainerRegistry/registries | Container Registry |
| | `container_apps` | Microsoft.App/containerApps | Container Apps |
| | `static_web_app` | Microsoft.Web/staticSites | Static Web App |
| | `spring_apps` | Microsoft.AppPlatform/Spring | Spring Apps |
| **Red** | `pe` | Microsoft.Network/privateEndpoints | Private Endpoint |
| | `vnet` | Microsoft.Network/virtualNetworks | VNet |
| | `nsg` | Microsoft.Network/networkSecurityGroups | NSG |
| | `firewall` | Microsoft.Network/azureFirewalls | Firewall |
| | `bastion` | Microsoft.Network/bastionHosts | Bastion |
| | `app_gateway` | Microsoft.Network/applicationGateways | App Gateway |
| | `front_door` | Microsoft.Cdn/profiles (Front Door) | Front Door |
| | `vpn` | Microsoft.Network/virtualNetworkGateways | VPN Gateway |
| | `load_balancer` | Microsoft.Network/loadBalancers | Load Balancer |
| | `nat_gateway` | Microsoft.Network/natGateways | NAT Gateway |
| | `cdn` | Microsoft.Cdn/profiles | CDN |
| **IoT** | `iot_hub` | Microsoft.Devices/IotHubs | IoT Hub |
| | `digital_twins` | Microsoft.DigitalTwins/digitalTwinsInstances | Digital Twins |
| **Integración** | `event_hub` | Microsoft.EventHub/namespaces | Event Hub |
| | `event_grid` | Microsoft.EventGrid/topics | Event Grid |
| | `apim` | Microsoft.ApiManagement/service | API Management |
| | `service_bus` | Microsoft.ServiceBus/namespaces | Service Bus |
| | `logic_apps` | Microsoft.Logic/workflows | Logic Apps |
| **Supervisión** | `log_analytics` | Microsoft.OperationalInsights/workspaces | Log Analytics |
| | `appinsights` | Microsoft.Insights/components | App Insights |
| | `monitor` | Azure Monitor | Monitor |
| **Otros** | `jumpbox`, `user`, `devops` | — | Especial |

**Al usar puntos de conexión privados: es obligatorio añadir nodos PE:**

Si la arquitectura incluye puntos de conexión privados, DEBE añadirse un nodo PE al JSON de services por cada servicio. connections también debe incluir los enlaces PE para que aparezcan en el diagrama.

```json
// Añadir el nodo PE correspondiente a cada servicio
{"id": "pe_serviceID", "name": "PE: ServiceName", "type": "pe", "details": ["groupId: correspondingGroupID"]}

// Añadir la conexión servicio → PE en connections
{"from": "serviceID", "to": "pe_serviceID", "label": "", "type": "private"}
```

**🚨🚨🚨 Las conexiones PE y las de lógica de negocio son distintas: DEBEN incluirse AMBAS 🚨🚨🚨**

Las conexiones PE (`"type": "private"`) representan el aislamiento de red. Pero por sí solas NO muestran en el diagrama el **flujo de datos ni las llamadas a API** reales entre servicios.

**DEBES incluir ambos tipos de conexiones:**

1. **Conexiones de lógica de negocio**: flujo real de datos entre servicios (tipos api, data, security)
2. **Conexiones PE**: aislamiento de red entre servicio ↔ PE (tipo private)

```json
// ✅ Ejemplo correcto: Function App → Foundry
// 1) Lógica de negocio: Function App llama a Foundry para chat y embeddings
{"from": "func_app", "to": "foundry", "label": "Chat RAG + Embeddings", "type": "api"}
// 2) Conexión PE: punto de conexión privado de Foundry
{"from": "foundry", "to": "pe_foundry", "label": "", "type": "private"}

// ❌ Ejemplo incorrecto: solo conexión PE, sin conexión de lógica de negocio
{"from": "foundry", "to": "pe_foundry", "label": "", "type": "private"}
// → No hay línea de conexión entre Function App y Foundry en el diagrama, por lo que no se ve el flujo de la arquitectura
```

**NUNCA hagas esto:**

- Crear solo conexiones PE y omitir las conexiones de lógica de negocio
- Conectar `from`/`to` de las conexiones de lógica de negocio a nodos PE (usa el **ID del servicio real**, no el del PE)
- Asumir "el PE está ahí, así que aparecerá la línea de conexión"

El groupId del PE varía según el servicio. Consulta la tabla de correspondencias de groupId de PE y zonas DNS en `references/service-gotchas.md`.

> **Convención de nombres de servicio**: DEBEN usarse los nombres oficiales más recientes de Azure. Si tienes dudas sobre un nombre, verifícalo en MS Docs.
> Para los tipos de recurso y las propiedades principales de cada servicio, consulta `references/ai-data.md`.

**Formato JSON de connections:**

```json
[
  {"from": "serviceA_ID", "to": "serviceB_ID", "label": "Descripción de la conexión", "type": "api|data|security|private"}
]
```

**Tipos de conexión:**

| type | Color | Estilo | Uso |
|------|-------|-------|---------|
| `api` | Azul | Continuo | Llamadas a API, consultas |
| `data` | Verde | Continuo | Flujo de datos, indexación |
| `security` | Naranja | Discontinuo | Secretos, autenticación |
| `private` | Morado | Discontinuo | Conexiones de puntos de conexión privados |
| `network` | Gris | Continuo | Enrutamiento de red |
| `default` | Gris | Continuo | Otros |

**🔹 Principio multilingüe de los diagramas:**

- `name` y `details` en services, y `label` en connections, se escriben en **el idioma de la persona**
- Ejemplo: `"label": "Búsqueda RAG"`, `"label": "Ingesta de datos"`
- Los nombres oficiales de los servicios de Azure (Microsoft Foundry, AI Search, etc.) permanecen siempre en inglés, independientemente del idioma

**🔹 Nodo VNet: NO añadir al JSON de services:**

- La VNet se muestra automáticamente como un **límite discontinuo morado** en el diagrama (cuando hay PE)
- Añadir un nodo VNet separado al JSON de services provoca confusión al duplicarlo con la línea de límite
- La información de la VNet (CIDR y subredes) queda suficientemente representada mediante la etiqueta del límite VNet en el panel lateral

Proporciona a la persona la ruta completa del archivo HTML generado.

### 1-3. Definición final de la arquitectura mediante conversación

La arquitectura se define de forma incremental conversando con la persona. Cuando solicite cambios, NO vuelvas a preguntar todo desde cero; **refleja únicamente los cambios solicitados a partir del estado confirmado actual** y regenera el diagrama.

**⚠️ Regla de confirmación de cambios: verificación obligatoria al añadir o cambiar servicios:**

Añadir o cambiar un servicio no es una "simple actualización": es un **evento que reabre los campos obligatorios pendientes de ese servicio**.

**Proceso:**

1. Compara el estado confirmado actual con la nueva solicitud
2. Identifica los campos obligatorios de los servicios recién añadidos (consulta `domain-packs` o MS Docs)
3. Consulta en MS Docs la disponibilidad regional y las opciones del servicio
4. Si queda algún campo obligatorio sin decidir, **pregunta primero a la persona mediante ask_user**
5. **Regenera el diagrama solo después de completar la confirmación**

**NUNCA hagas esto:**

- Dar por finalizada la actualización del diagrama cuando aún quedan campos obligatorios sin decidir
- Añadir arbitrariamente subcomponentes o cargas de trabajo que la persona no haya mencionado (por ejemplo, añadir automáticamente OneLake y una canalización de datos a una solicitud de Fabric)
- Asumir de forma imprecisa una SKU o un modelo, como "F SKU", sin confirmación

**No vuelvas a preguntar por la configuración de servicios ya confirmados.** Confirma solo los elementos pendientes de los servicios recién añadidos o modificados.

---

**🚨🚨🚨 [Principio de máxima prioridad] Comprobación inmediata de hechos durante la fase de diseño 🚨🚨🚨**

**La finalidad de la fase 1 es confirmar una "arquitectura viable".**
**Sea cual sea la solicitud, antes de reflejarla en el diagrama DEBES comprobar si es realmente posible consultando directamente MS Docs mediante web_fetch.**

**Orientación de diseño frente a especificaciones de despliegue: fuentes de información separadas:**

| Tipo de decisión | Ruta de referencia | Ejemplos |
|--------------|----------------|----------|
| **Orientación de diseño** (patrones de arquitectura, buenas prácticas, combinaciones de servicios) | `references/architecture-guidance-sources.md` → Consulta específica | "¿Cuál es la estructura RAG recomendada?", "¿Arquitectura de referencia empresarial?" |
| **Especificaciones de despliegue** (versión de API, SKU, región, modelo, mapeo de PE) | `references/azure-dynamic-sources.md` → Consulta de MS Docs | "¿Cuál es la versión de API?", "¿Está disponible este modelo en Korea Central?" |

- **La orientación de diseño procede de las guías de arquitectura; los valores reales de despliegue, de las fuentes dinámicas.** No mezcles estas dos vías.
- NO uses el contenido de las guías de arquitectura para determinar SKU, versión de API o región.
- **NO recorras todos los subdocumentos de Architecture Center en cada solicitud.** Realiza consultas específicas según el desencadenante, con un máximo de 2 documentos pertinentes.
- Para los desencadenantes, límites de consultas y reglas de decisión por tipo de pregunta, consulta `architecture-guidance-sources.md`.

**Este principio se aplica a TODAS las solicitudes sin excepción:**

- Añadir o cambiar un modelo → Verificar en MS Docs si existe y puede desplegarse en la región de destino
- Añadir o cambiar un servicio → Verificar en MS Docs si está disponible en la región de destino
- Cambiar una SKU → Verificar en MS Docs si es válida y admite las funcionalidades deseadas
- Solicitar una funcionalidad → Verificar en MS Docs si realmente está admitida
- Combinar servicios → Verificar en MS Docs si es posible integrarlos
- **Cualquier otra solicitud** → Comprobar los hechos en MS Docs

**Resultados de la verificación en MS Docs:**

- **Posible** → Reflejar en el diagrama
- **No es posible** → Explicar inmediatamente el motivo y sugerir alternativas disponibles

**Proceso de comprobación de hechos: contraste obligatorio:**

No consultes una sola vez y continúes sin más ante las solicitudes.
**SIEMPRE DEBES contrastar con otras páginas o fuentes de MS Docs.**

> **Restricción del entorno GHCP**: los subagentes (explore/task/general-purpose) NO disponen de herramientas `web_fetch`/`web_search`.
> Por tanto, **el agente principal DEBE realizar directamente** las verificaciones que requieran consultar MS Docs.

```
[Primera verificación] El agente principal consulta directamente MS Docs mediante web_fetch (página principal)
    ↓
[Segunda verificación] El agente principal consulta además otras páginas relacionadas de MS Docs mediante web_fetch para contrastar
    - Por ejemplo, disponibilidad de modelos → Primera: página de modelos / Segunda: disponibilidad regional o precios
    - Por ejemplo, versión de API → Primera: referencia de Bicep / Segunda: referencia de la API REST
    - Comparar los resultados de ambas verificaciones y señalar cualquier discrepancia
    ↓
[Consolidar resultados] Si ambas verificaciones coinciden, responder a la persona
    - Ante discrepancias: resolverlas con consultas adicionales o informar con honestidad de la incertidumbre
```

**Estándares de calidad de la comprobación de hechos: rigor, no superficialidad:**

- Al consultar una página de MS Docs, **revisa TODAS las secciones, pestañas y condiciones pertinentes sin omitir ninguna**
- Al comprobar la disponibilidad de modelos, revisa **TODOS los tipos de despliegue**, incluidos Global Standard, Standard, Provisioned, Data Zone, etc. NO concluyas "no admitido" basándote en un solo tipo
- Al comprobar SKU, verifica **por completo** la lista de funcionalidades admitidas
- Si la página es grande, consulta las secciones pertinentes **varias veces** para garantizar la precisión
- Si tienes dudas, consulta páginas adicionales. **NUNCA respondas con conjeturas**

**NUNCA hagas esto:**

- Añadir elementos al diagrama sin verificarlos
- Posponer la verificación diciendo "Lo comprobaré durante la generación de Bicep" o "Se validará durante el despliegue"
- Basarte solo en tu memoria y responder "debería funcionar"; **DEBES consultar directamente MS Docs**
- Consultar MS Docs, pero precipitarte a sacar conclusiones tras leer solo una parte
- Dar algo por definitivo a partir de una única consulta; **DEBES contrastar con otra fuente**

**🚫 Reglas de uso de subagentes:**

**Subagentes en GHCP = herramienta `task`:**

- `agent_type: "explore"`: tareas de solo lectura, como explorar la base de código o buscar archivos (**web_fetch/web_search NO disponibles**)
- `agent_type: "task"`: ejecución de comandos como az cli o bicep build
- `agent_type: "general-purpose"`: tareas de alto nivel, como generar Bicep complejo

> **⚠️ Restricción de herramientas de subagentes**: NINGÚN subagente (explore/task/general-purpose) puede usar `web_fetch` ni `web_search`.
> **El agente principal DEBE realizar directamente** las comprobaciones que requieran consultas a MS Docs, verificación de versiones de API, disponibilidad de modelos, etc.

**Criterios para elegir entre primer y segundo plano:**

- **Si los resultados son necesarios antes de pasar al siguiente paso → `mode: "sync"` (predeterminado)**
  - Por ejemplo, consultar las SKU antes de ofrecer opciones o verificar la disponibilidad de un modelo antes de reflejarlo en el diagrama
  - Ejecutar en segundo plano en estos casos dejaría a la persona esperando los resultados
- **Si hay trabajo independiente que pueda realizarse mientras se esperan los resultados → `mode: "background"`**
  - Por ejemplo, consultar simultáneamente varias páginas de MS Docs mediante web_fetch para contrastar
**La mayoría de las comprobaciones de hechos deben ejecutarse en primer plano (`mode: "sync"`)**, porque no puede formularse la siguiente pregunta sin sus resultados.

**Cómo contrastar información en paralelo:**

```
// Ejecutar la primera y segunda verificación simultáneamente (directamente por el agente principal)
[Simultáneamente] Consultar directamente la página principal de MS Docs mediante web_fetch (primera)
[Simultáneamente] Consultar además una página relacionada de MS Docs mediante web_fetch (segunda)
// Comparar ambos resultados para detectar discrepancias
// Por ejemplo, disponibilidad de modelos → Consulta paralela de la página de modelos y la de disponibilidad regional
```

**NUNCA hagas esto:**

- Ejecutar en segundo plano cuando se necesitan los resultados y después esperar sin hacer nada
- Delegar tareas que requieren web_fetch/web_search a subagentes (DEBE ejecutarlas directamente el agente principal)
- Intentar leer directamente archivos internos de los subagentes

---

**⚠️ Importante: NO ejecutes ningún comando de shell hasta que la persona apruebe explícitamente pasar al siguiente paso.**
Como excepción, se permite usar web_fetch para consultar MS Docs en las comprobaciones anteriores.

Una vez confirmada la arquitectura (la persona indicó que no hay cambios en el diagrama), pregunta si desea pasar al siguiente paso.

**🚨 Prerrequisitos para la transición a la fase 2: TODOS deben cumplirse antes de formular esta pregunta:**

1. Se ha **generado** `01_arch_diagram_draft.html` con el motor de diagramas integrado
2. El diagrama se ha **abierto en el navegador** y **mostrado a la persona** con el formato de informe y la **tabla de configuración**
3. Se preguntó **"¿Quieres cambiar o añadir algo?"** y la persona respondió **sin cambios**, o se reflejaron las modificaciones y se recibió la **confirmación final**

**Si NO se cumple CUALQUIERA de estas condiciones, NO pases a la fase 2.**
Si el diagrama aún no existe, **genéralo ahora mismo** siguiendo el procedimiento de la sección 1-2.
Si no se mostró la tabla de configuración, **muéstrala ahora mismo** antes de preguntar por cambios.

**Siguiendo el principio de precarga paralela, ejecuta `az account list` y `az group list` simultáneamente con ask_user para preparar de antemano las opciones de suscripción y grupo de recursos.**

```
// Invocar simultáneamente en la misma respuesta:
[1] ask_user: "¡La arquitectura está confirmada! ¿Pasamos al siguiente paso?"
[2] powershell: az account show 2>&1              (comprobar antes el estado de inicio de sesión)
[3] powershell: az account list --output json      (preparar las opciones de suscripción)
[4] powershell: az group list --output json        (preparar las opciones de grupos de recursos)
```

Formato de presentación de ask_user:

```
¡La arquitectura está confirmada! ¿Pasamos al siguiente paso?

✅ Arquitectura confirmada: [resumen]

Se realizarán los pasos siguientes:
1. [Generación de código Bicep]: la IA escribe automáticamente el código IaC
2. [Revisión de código]: revisión automatizada de seguridad y buenas prácticas
3. [Despliegue en Azure]: creación real de recursos (opcional)

¿Continuamos? (Si solo quieres el código sin despliegue, indícalo)
```

Una vez que la persona apruebe, recopila la información en el siguiente orden.
**Como `az account show`, `az account list` y `az group list` ya se ejecutaron durante la precarga, las opciones de suscripción y grupo de recursos pueden presentarse inmediatamente.**

**Paso 1: Verificación del inicio de sesión en Azure**

El resultado de `az account show` ya está disponible desde la precarga. No se necesita otra llamada.

- Si la sesión está iniciada → Pasar al paso 2
- Si no está iniciada → Orientar a la persona:

  ```
  Es necesario iniciar sesión en Azure CLI. Ejecuta este comando en tu terminal:
  az login
  Avísame cuando termine.
  ```

**Paso 2: Selección de suscripción**

El resultado de `az account list` ya está disponible desde la precarga. No se necesita otra llamada.

Ofrece hasta 4 suscripciones de los resultados como opciones de `ask_user`.
Si hay 5 o más, incluye las 3-4 más utilizadas (la persona también puede escribir una respuesta personalizada).
Una vez que seleccione, ejecuta `az account set --subscription "<ID>"`.

**Paso 3: Confirmación del grupo de recursos**

El resultado de `az group list` ya está disponible desde la precarga. No se necesita otra llamada.

Ofrece hasta 4 grupos de recursos existentes de la lista como opciones de `ask_user`.
Si la persona selecciona un grupo existente, úsalo tal cual; si escribe un nombre nuevo, créalo durante el despliegue de la fase 4.

**Elementos que deben quedar confirmados:**

- [ ] Lista de servicios y SKU
- [ ] Método de conexión de red (uso de puntos de conexión privados)
- [ ] ID de suscripción (confirmado en el paso 2)
- [ ] Nombre del grupo de recursos (confirmado en el paso 3)
- [ ] Ubicación (confirmada con la persona; disponibilidad regional de cada servicio verificada en MS Docs)

---

## 🚨 Lista de finalización de la fase 1: verificación obligatoria antes de entrar en la fase 2

Antes de salir de la fase 1, verifica **TODOS** los elementos siguientes. Si alguno está incompleto, NO pases a la fase 2.

| # | Elemento | Método de verificación |
|---|------|---------------------|
| 1 | Todas las especificaciones obligatorias confirmadas | Se confirmaron el nombre del proyecto, los servicios, las SKU, la región y el método de conexión de red |
| 2 | Comprobación de hechos completada | Se contrastó la información con MS Docs |
| 3 | **Diagrama generado** | Se generó `01_arch_diagram_draft.html` con el motor de diagramas integrado |
| 4 | **Tabla de configuración mostrada** | Se mostró la tabla detallada de Servicio/Tipo/SKU/Detalles con el formato de informe |
| 5 | **La persona revisó el diagrama** | Apertura automática del navegador + formato de informe + pregunta "¿quieres cambiar algo?" |
| 6 | Aprobación final de la persona | Confirmó que no había cambios y después seleccionó "pasar al siguiente paso" |

**⚠️ NO preguntes el elemento 6 mientras los elementos 3-5 estén incompletos.** El flujo debe ser: diagrama → tabla → preguntar por cambios → confirmar → siguiente paso.

---

## Transición a la fase 2: agente generador de Bicep

Una vez que la persona acepte continuar, lee las instrucciones de `references/bicep-generator.md` y genera la plantilla Bicep.
Como alternativa, puedes delegar esta tarea a un subagente independiente.

**Principio de gestión de información sensible (NUNCA incumplir):**

- NUNCA pidas contraseñas de máquinas virtuales, claves de API ni otros valores sensibles en el chat, y NUNCA los almacenes en archivos de parámetros
- Durante la revisión de código, si encuentras valores sensibles sin cifrar en `main.bicepparam`, elimínalos inmediatamente

**🔹 Valores sensibles introducidos por la persona, como contraseñas de máquinas virtuales: validación de complejidad obligatoria:**

Cuando la persona introduzca una contraseña de administrador de máquina virtual o similar, valida los requisitos de complejidad **antes** de enviarla a Azure.
Las máquinas virtuales de Azure deben cumplir TODAS las condiciones siguientes:

- 12 caracteres o más
- Contener al menos 3 de estos tipos: letras mayúsculas, letras minúsculas, números y caracteres especiales

**Si falla la validación:** NO intentes desplegar; pide inmediatamente que se vuelva a introducir:
> **⚠️ La contraseña no cumple los requisitos de complejidad de Azure.** Debe tener 12 caracteres o más e incluir al menos 3 de estos tipos: mayúsculas + minúsculas + números + caracteres especiales.

**NUNCA hagas esto:**

- Advertir "puede que no cumpla los requisitos" e intentar desplegar de todos modos; **DEBES bloquearlo**
- Enviar a Azure sin validar la complejidad, provocando un fallo de despliegue

**🚨 Principio de compatibilidad de parámetros `@secure()` y `.bicepparam`:**

Cuando un archivo `.bicepparam` contiene una directiva `using './main.bicep'`, NO se pueden usar opciones `--parameters` adicionales con `az deployment group what-if/create`.
Por tanto, la gestión de parámetros `@secure()` sigue estas reglas:

1. **Los parámetros `@secure()` DEBEN tener valores predeterminados**: usa funciones Bicep como `newGuid()`, `uniqueString()`

   ```bicep
   @secure()
   param sqlAdminPassword string = newGuid()  // Generado automáticamente al desplegar; guardar en Key Vault si es necesario
   ```

2. **Si hay parámetros `@secure()` que requieren valores indicados por la persona:**
   - NO uses un archivo `.bicepparam`; usa la combinación `--template-file` + `--parameters`
   - O genera un archivo JSON de parámetros independiente (`main.parameters.json`)

   ```powershell
   # Cuando no se pueda usar .bicepparam, sustituirlo por un archivo JSON de parámetros
   az deployment group what-if `
     --template-file main.bicep `
     --parameters main.parameters.json `
     --parameters sqlAdminPassword='user-input-value'
   ```

3. **NO uses `.bicepparam` y `--parameters` simultáneamente en un comando de despliegue**

   ```
   ❌ az deployment group create --parameters main.bicepparam --parameters key=value
   ✅ az deployment group create --parameters main.bicepparam
   ✅ az deployment group create --template-file main.bicep --parameters main.parameters.json --parameters key=value
   ```

**Criterios de decisión:**

- Todos los parámetros `@secure()` tienen valores predeterminados (newGuid, etc.) → Se puede usar `.bicepparam`
- Algún parámetro `@secure()` requiere una entrada de la persona → Usar un archivo JSON de parámetros en lugar de `.bicepparam`

**Cuando falla la consulta de MS Docs:**

- Si web_fetch falla por límites de solicitudes u otro motivo, DEBES informar a la persona:

  ```
  ⚠️ Falló la consulta de la versión de API en MS Docs. Se generará con la última versión estable conocida.
  Se recomienda verificar la versión más reciente real antes del despliegue.
  ¿Continuamos?
  ```

- NO continúes en silencio con una versión fijada sin la aprobación de la persona

**Archivos de referencia previos a la generación de Bicep:**

- `references/service-gotchas.md`: propiedades obligatorias, errores habituales y correspondencias de groupId de PE y zonas DNS
- `references/ai-data.md`: guía de configuración de servicios de IA y datos (dominio de v1)
- `references/azure-common-patterns.md`: patrones comunes de PE, seguridad y nomenclatura
- `references/azure-dynamic-sources.md`: registro de URL de MS Docs (para consultar versiones de API)
- Para servicios no incluidos en estos archivos, consulta directamente MS Docs para verificar los tipos de recurso, las propiedades y las correspondencias de PE

**Estructura de salida:**

```
<project-name>/
├── main.bicep              # Orquestación principal
├── main.bicepparam         # Parámetros (valores específicos del entorno)
└── modules/
    ├── network.bicep       # VNet, subred (incluida la subred de puntos de conexión privados)
    ├── ai.bicep            # Servicios de IA (según los requisitos de la persona)
    ├── storage.bicep       # ADLS Gen2 (isHnsEnabled: true)
    ├── fabric.bicep        # Microsoft Fabric (si es necesario)
    ├── keyvault.bicep      # Key Vault
    └── private-endpoints.bicep  # Todos los PE + zonas DNS
```

**Principios obligatorios de Bicep:**

- Parametriza todos los nombres de recursos: `param openAiName string = 'oai-${uniqueString(resourceGroup().id)}'`
- Los servicios privados DEBEN tener `publicNetworkAccess: 'Disabled'`
- Establece `privateEndpointNetworkPolicies: 'Disabled'` en pe-subnet
- Zona DNS privada + enlace VNet + grupo de zonas DNS: los 3 son obligatorios
- Al usar Microsoft Foundry, **DEBE crearse también un proyecto de Foundry (`accounts/projects`)**; sin él, el portal no puede utilizarse
- ADLS Gen2 DEBE tener `isHnsEnabled: true` (si se omite, se crea un Blob Storage convencional)
- Guarda los secretos en Key Vault y referéncialos mediante parámetros `@secure()`
- Añade comentarios que expliquen la finalidad de cada sección en el idioma de la edición: inglés en `main` y `develop`, portugués de Brasil en `portugues-br` y español en `espanol`

Pasa inmediatamente a la fase 3 cuando termine la generación.

---

## Transición a la fase 3: agente revisor de Bicep

Revisa conforme a las instrucciones de `references/bicep-reviewer.md`.

**⚠️ Punto clave: NO te limites a una inspección visual para decir "aprobado". DEBES ejecutar `az bicep build` y verificar los resultados reales de compilación.**

```powershell
az bicep build --file main.bicep 2>&1
```

1. Errores o advertencias de compilación → Corregir
2. Revisión de la lista de verificación → Corregir
3. Volver a compilar para confirmar
4. Informar de los resultados (incluidos los de compilación)

Para listas detalladas y procedimientos de corrección, consulta `references/bicep-reviewer.md`.

Al terminar la revisión, muestra los resultados antes de pasar a la fase 4 y **DEBES orientar a la persona sobre los pasos siguientes.**

**🚨 Formato de informe obligatorio al finalizar la fase 3:**

```
## Revisión del código Bicep completada

[Resumen de resultados de la revisión, con el formato del paso 6 de bicep-reviewer.md]

---

**Siguiente paso: fase 4 (despliegue en Azure)**

La revisión ha terminado. Se realizarán los pasos siguientes:
1. **Validación What-if**: vista previa de los recursos planificados sin realizar cambios reales
2. **Diagrama de vista previa**: visualización de la arquitectura a partir de los resultados What-if (02_arch_diagram_preview.html)
3. **Despliegue real**: creación de recursos en Azure tras la confirmación de la persona

¿Continuamos con el despliegue? (Si solo quieres el código sin despliegue, indícalo)
```

**NUNCA hagas esto:**

- Completar la fase 3 y proporcionar únicamente el comando `az deployment group create` sin más orientación
- Desplegar directamente sin validación What-if o indicar a la persona que ejecute los comandos por su cuenta
- Omitir los pasos de la fase 4 (What-if → Diagrama de vista previa → Despliegue)
