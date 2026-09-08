# Uso avanzado: salida, consultas y parámetros

## Índice

- [Formatos de salida](#formatos-de-salida)
- [Consultas JMESPath](#consultas-jmespath)
- [Consultas JMESPath avanzadas](#consultas-jmespath-avanzadas)
- [Argumentos globales](#argumentos-globales)
- [Parámetros habituales](#parámetros-habituales)
- [Alias de Git](#alias-de-git)
- [Obtener ayuda](#obtener-ayuda)

---

## Formatos de salida

Todos los comandos admiten varios formatos de salida:

```bash
# Formato de tabla (legible para personas)
az pipelines list --output table

# Formato JSON (predeterminado, legible por máquina)
az pipelines list --output json

# JSONC (JSON con colores)
az pipelines list --output jsonc

# Formato YAML
az pipelines list --output yaml

# YAMLC (YAML con colores)
az pipelines list --output yamlc

# Formato TSV (valores separados por tabuladores)
az pipelines list --output tsv

# None (sin salida)
az pipelines list --output none
```

## Consultas JMESPath

Filtra y transforma la salida:

```bash
# Filtrar por nombre
az pipelines list --query "[?name=='myPipeline']"

# Obtener campos concretos
az pipelines list --query "[].{Name:name, ID:id}"

# Encadenar consultas
az pipelines list --query "[?name.contains('CI')].{Name:name, ID:id}" --output table

# Obtener el primer resultado
az pipelines list --query "[0]"

# Obtener los primeros N
az pipelines list --query "[0:5]"
```

## Consultas JMESPath avanzadas

### Filtrado y ordenación

```bash
# Filtrar por varias condiciones
az pipelines list --query "[?name.contains('CI') && enabled==true]"

# Filtrar por estado y resultado
az pipelines runs list --query "[?status=='completed' && result=='succeeded']"

# Ordenar por fecha (descendente)
az pipelines runs list --query "sort_by([?status=='completed'], &finishTime | reverse(@))"

# Obtener los primeros N elementos después de filtrar
az pipelines runs list --query "[?result=='succeeded'] | [0:5]"
```

### Consultas anidadas

```bash
# Extraer propiedades anidadas
az pipelines show --id $PIPELINE_ID --query "{Name:name, Repo:repository.{Name:name, Type:type}, Folder:folder}"

# Consultar los detalles de la compilación
az pipelines build show --id $BUILD_ID --query "{ID:id, Number:buildNumber, Status:status, Result:result, Requested:requestedFor.displayName}"
```

### Filtrado complejo

```bash
# Encontrar canalizaciones con una ruta YAML concreta
az pipelines list --query "[?process.type.name=='yaml' && process.yamlFilename=='azure-pipelines.yml']"

# Encontrar PR de un revisor concreto
az repos pr list --query "[?contains(reviewers[?displayName=='John Doe'].displayName, 'John Doe')]"

# Encontrar elementos de trabajo con una iteración y estado concretos
az boards work-item show --id $WI_ID --query "{Title:fields['System.Title'], State:fields['System.State'], Iteration:fields['System.IterationPath']}"
```

### Agregación

```bash
# Contar elementos por estado
az pipelines runs list --query "groupBy([?status=='completed'], &[result]) | {Succeeded: [?key=='succeeded'][0].count, Failed: [?key=='failed'][0].count}"

# Obtener revisores únicos
az repos pr list --query "unique_by(reviewers[], &displayName)"

# Sumar valores
az pipelines runs list --query "[?result=='succeeded'] | [].{Duration:duration} | [0].Duration"
```

### Transformación condicional

```bash
# Dar formato a fechas
az pipelines runs list --query "[].{ID:id, Date:createdDate, Formatted:createdDate | format_datetime(@, 'yyyy-MM-dd HH:mm')}"

# Salida condicional
az pipelines list --query "[].{Name:name, Status:(enabled ? 'Enabled' : 'Disabled')}"

# Extraer con valores predeterminados
az pipelines show --id $PIPELINE_ID --query "{Name:name, Folder:folder || 'Root', Description:description || 'No description'}"
```

### Flujos de trabajo complejos

```bash
# Encontrar las compilaciones de mayor duración
az pipelines build list --query "sort_by([?result=='succeeded'], &queueTime) | reverse(@) | [0:3].{ID:id, Number:buildNumber, Duration:duration}"

# Obtener estadísticas de PR por revisor
az repos pr list --query "groupBy([], &reviewers[].displayName) | [].{Reviewer:@.key, Count:length(@)}"

# Encontrar elementos de trabajo con varios elementos secundarios
az boards work-item relation list --id $PARENT_ID --query "[?rel=='System.LinkTypes.Hierarchy-Forward'] | [].{ChildID:url | split('/', @) | [-1]}"
```

## Argumentos globales

Disponibles en todos los comandos:

| Parámetro | Descripción |
|---|---|
| `--help` / `-h` | Mostrar la ayuda del comando |
| `--output` / `-o` | Formato de salida (json, jsonc, none, table, tsv, yaml, yamlc) |
| `--query` | Cadena de consulta JMESPath para filtrar la salida |
| `--verbose` | Aumentar el detalle de los registros |
| `--debug` | Mostrar todos los registros de depuración |
| `--only-show-errors` | Mostrar solo errores y suprimir advertencias |
| `--subscription` | Nombre o ID de la suscripción |
| `--yes` / `-y` | Omitir las preguntas de confirmación |

## Parámetros habituales

| Parámetro | Descripción |
|---|---|
| `--org` / `--organization` | URL de la organización de Azure DevOps (por ejemplo, `https://dev.azure.com/{org}`) |
| `--project` / `-p` | Nombre o ID del proyecto |
| `--detect` | Detectar automáticamente la organización desde la configuración de Git |
| `--yes` / `-y` | Omitir las preguntas de confirmación |
| `--open` | Abrir el recurso en el navegador web |
| `--subscription` | Suscripción de Azure (para recursos de Azure) |

## Alias de Git

Después de habilitar los alias de Git:

```bash
# Habilitar alias de Git
az devops configure --use-git-aliases true

# Usar comandos de Git para operaciones de DevOps
git pr create --target-branch main
git pr list
git pr checkout 123
```

## Obtener ayuda

```bash
# Ayuda general
az devops --help

# Ayuda de un grupo de comandos concreto
az pipelines --help
az repos pr --help

# Ayuda de un comando concreto
az repos pr create --help

# Buscar ejemplos
az find "az repos pr create"
```
