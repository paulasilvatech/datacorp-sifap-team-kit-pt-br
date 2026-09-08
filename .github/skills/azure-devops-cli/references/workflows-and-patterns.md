# Flujos de trabajo, buenas prácticas y patrones de scripting

## Índice

- [Flujos de trabajo habituales](#flujos-de-trabajo-habituales)
- [Buenas prácticas](#buenas-prácticas)
- [Gestión de errores y patrones de reintento](#gestión-de-errores-y-patrones-de-reintento)
- [Patrones de scripting para operaciones idempotentes](#patrones-de-scripting-para-operaciones-idempotentes)
- [Flujos de trabajo reales](#flujos-de-trabajo-reales)

---

## Flujos de trabajo habituales

### Crear una PR desde la rama actual

```bash
CURRENT_BRANCH=$(git branch --show-current)
az repos pr create \
  --source-branch $CURRENT_BRANCH \
  --target-branch main \
  --title "Feature: $(git log -1 --pretty=%B)" \
  --open
```

### Crear un elemento de trabajo cuando falle una canalización

```bash
az boards work-item create \
  --title "Build $BUILD_BUILDNUMBER failed" \
  --type bug \
  --org $SYSTEM_TEAMFOUNDATIONCOLLECTIONURI \
  --project $SYSTEM_TEAMPROJECT
```

### Descargar el artefacto más reciente de una canalización

```bash
RUN_ID=$(az pipelines runs list --pipeline {pipeline-id} --top 1 --query "[0].id" -o tsv)
az pipelines runs artifact download \
  --artifact-name 'webapp' \
  --path ./output \
  --run-id $RUN_ID
```

### Aprobar y completar una PR

```bash
# Votar a favor de la aprobación
az repos pr set-vote --id {pr-id} --vote approve

# Completar la PR
az repos pr update --id {pr-id} --status completed
```

### Crear una canalización desde un repositorio local

```bash
# Desde un repositorio Git local (detecta automáticamente el repositorio, la rama, etc.)
az pipelines create --name 'CI-Pipeline' --description 'Continuous Integration'
```

### Actualizar elementos de trabajo en bloque

```bash
# Consultar los elementos y actualizarlos en un bucle
for id in $(az boards query --wiql "SELECT ID FROM WorkItems WHERE State='New'" -o tsv); do
  az boards work-item update --id $id --state "Active"
done
```

## Buenas prácticas

### Autenticación y seguridad

```bash
# Usar un PAT desde una variable de entorno (opción más segura)
export AZURE_DEVOPS_EXT_PAT=$MY_PAT
az devops login --organization $ORG_URL

# Pasar el PAT por una tubería de forma segura (evita el historial del shell)
echo $MY_PAT | az devops login --organization $ORG_URL

# Establecer valores predeterminados para evitar repeticiones
az devops configure --defaults organization=$ORG_URL project=$PROJECT

# Limpiar las credenciales después de usarlas
az devops logout --organization $ORG_URL
```

### Operaciones idempotentes

```bash
# Usar siempre --detect para la detección automática
az devops configure --defaults organization=$ORG_URL project=$PROJECT

# Comprobar la existencia antes de crear
if ! az pipelines show --id $PIPELINE_ID 2>/dev/null; then
  az pipelines create --name "$PIPELINE_NAME" --yaml-path azure-pipelines.yml
fi

# Usar --output tsv para el análisis desde el shell
PIPELINE_ID=$(az pipelines list --query "[?name=='MyPipeline'].id" --output tsv)

# Usar --output json para el acceso programático
BUILD_STATUS=$(az pipelines build show --id $BUILD_ID --query "status" --output json)
```

### Salida adecuada para scripts

```bash
# Suprimir advertencias y errores
az pipelines list --only-show-errors

# Sin salida (útil para comandos que solo necesitan ejecutarse)
az pipelines run --name "$PIPELINE_NAME" --output none

# Formato TSV para scripts de shell (limpio, sin formato adicional)
az repos pr list --output tsv --query "[].{ID:pullRequestId,Title:title}"

# JSON con campos concretos
az pipelines list --output json --query "[].{Name:name, ID:id, URL:url}"
```

### Orquestación de canalizaciones

```bash
# Ejecutar la canalización y esperar a que termine
RUN_ID=$(az pipelines run --name "$PIPELINE_NAME" --query "id" -o tsv)

while true; do
  STATUS=$(az pipelines runs show --run-id $RUN_ID --query "status" -o tsv)
  if [[ "$STATUS" != "inProgress" && "$STATUS" != "notStarted" ]]; then
    break
  fi
  sleep 10
done

# Comprobar el resultado
RESULT=$(az pipelines runs show --run-id $RUN_ID --query "result" -o tsv)
if [[ "$RESULT" == "succeeded" ]]; then
  echo "Pipeline succeeded"
else
  echo "Pipeline failed with result: $RESULT"
  exit 1
fi
```

### Gestión de grupos de variables

```bash
# Crear un grupo de variables de forma idempotente
VG_NAME="production-variables"
VG_ID=$(az pipelines variable-group list --query "[?name=='$VG_NAME'].id" -o tsv)

if [[ -z "$VG_ID" ]]; then
  VG_ID=$(az pipelines variable-group create \
    --name "$VG_NAME" \
    --variables API_URL=$API_URL API_KEY=$API_KEY \
    --authorize true \
    --query "id" -o tsv)
  echo "Created variable group with ID: $VG_ID"
else
  echo "Variable group already exists with ID: $VG_ID"
fi
```

### Automatización de conexiones de servicio

```bash
# Crear una conexión de servicio mediante un archivo de configuración
cat > service-connection.json <<'EOF'
{
  "data": {
    "subscriptionId": "$SUBSCRIPTION_ID",
    "subscriptionName": "My Subscription",
    "creationMode": "Manual",
    "serviceEndpointId": "$SERVICE_ENDPOINT_ID"
  },
  "url": "https://management.azure.com/",
  "authorization": {
    "parameters": {
      "tenantid": "$TENANT_ID",
      "serviceprincipalid": "$SP_ID",
      "authenticationType": "spnKey",
      "serviceprincipalkey": "$SP_KEY"
    },
    "scheme": "ServicePrincipal"
  },
  "type": "azurerm",
  "isShared": false,
  "isReady": true
}
EOF

az devops service-endpoint create \
  --service-endpoint-configuration service-connection.json \
  --project "$PROJECT"
```

### Automatización de solicitudes de incorporación de cambios

```bash
# Crear una PR con elementos de trabajo y revisores
PR_ID=$(az repos pr create \
  --repository "$REPO_NAME" \
  --source-branch "$FEATURE_BRANCH" \
  --target-branch main \
  --title "Feature: $(git log -1 --pretty=%B)" \
  --description "$(git log -1 --pretty=%B)" \
  --work-items $WORK_ITEM_1 $WORK_ITEM_2 \
  --reviewers "$REVIEWER_1" "$REVIEWER_2" \
  --required-reviewers "$LEAD_EMAIL" \
  --labels "enhancement" "backlog" \
  --open \
  --query "pullRequestId" -o tsv)

# Configurar la finalización automática cuando se cumplan las políticas
az repos pr update --id $PR_ID --auto-complete true
```

## Gestión de errores y patrones de reintento

### Lógica de reintentos para fallos transitorios

```bash
# Función de reintento para operaciones de red
retry_command() {
  local max_attempts=3
  local attempt=1
  local delay=5

  while [[ $attempt -le $max_attempts ]]; do
    if "$@"; then
      return 0
    fi
    echo "Attempt $attempt failed. Retrying in ${delay}s..."
    sleep $delay
    ((attempt++))
    delay=$((delay * 2))
  done

  echo "All $max_attempts attempts failed"
  return 1
}

# Uso
retry_command az pipelines run --name "$PIPELINE_NAME"
```

### Comprobar y gestionar errores

```bash
# Comprobar si la canalización existe antes de las operaciones
PIPELINE_ID=$(az pipelines list --query "[?name=='$PIPELINE_NAME'].id" -o tsv)

if [[ -z "$PIPELINE_ID" ]]; then
  echo "Pipeline not found. Creating..."
  az pipelines create --name "$PIPELINE_NAME" --yaml-path azure-pipelines.yml
else
  echo "Pipeline exists with ID: $PIPELINE_ID"
fi
```

### Validar entradas

```bash
# Validar los parámetros obligatorios
if [[ -z "$PROJECT" || -z "$REPO" ]]; then
  echo "Error: PROJECT and REPO must be set"
  exit 1
fi

# Comprobar si la rama existe
if ! az repos ref list --repository "$REPO" --query "[?name=='refs/heads/$BRANCH']" -o tsv | grep -q .; then
  echo "Error: Branch $BRANCH does not exist"
  exit 1
fi
```

### Gestionar errores de permisos

```bash
# Intentar la operación y gestionar los errores de permisos
if az devops security permission update \
  --id "$USER_ID" \
  --namespace "GitRepositories" \
  --project "$PROJECT" \
  --token "repoV2/$PROJECT/$REPO_ID" \
  --allow-bit 2 \
  --deny-bit 0 2>&1 | grep -q "unauthorized"; then
  echo "Error: Insufficient permissions to update repository permissions"
  exit 1
fi
```

### Notificación de fallos de canalización

```bash
# Ejecutar la canalización y comprobar el resultado
RUN_ID=$(az pipelines run --name "$PIPELINE_NAME" --query "id" -o tsv)

# Esperar a que termine
while true; do
  STATUS=$(az pipelines runs show --run-id $RUN_ID --query "status" -o tsv)
  if [[ "$STATUS" != "inProgress" && "$STATUS" != "notStarted" ]]; then
    break
  fi
  sleep 10
done

# Comprobar el resultado y crear un elemento de trabajo si falla
RESULT=$(az pipelines runs show --run-id $RUN_ID --query "result" -o tsv)
if [[ "$RESULT" != "succeeded" ]]; then
  BUILD_NUMBER=$(az pipelines runs show --run-id $RUN_ID --query "buildNumber" -o tsv)

  az boards work-item create \
    --title "Build $BUILD_NUMBER failed" \
    --type Bug \
    --description "Pipeline run $RUN_ID failed with result: $RESULT\n\nURL: $ORG_URL/$PROJECT/_build/results?buildId=$RUN_ID"
fi
```

### Degradación controlada

```bash
# Intentar descargar el artefacto y recurrir a una fuente alternativa si falla
if ! az pipelines runs artifact download \
  --artifact-name 'webapp' \
  --path ./output \
  --run-id $RUN_ID 2>/dev/null; then
  echo "Warning: Failed to download from pipeline run. Falling back to backup source..."

  # Método de descarga alternativo
  curl -L "$BACKUP_URL" -o ./output/backup.zip
fi
```

## Patrones de scripting para operaciones idempotentes

### Patrón de creación o actualización

```bash
# Garantizar que la canalización exista y actualizarla si difiere
ensure_pipeline() {
  local name=$1
  local yaml_path=$2

  PIPELINE=$(az pipelines list --query "[?name=='$name']" -o json)

  if [[ -z "$PIPELINE" ]]; then
    echo "Creating pipeline: $name"
    az pipelines create --name "$name" --yaml-path "$yaml_path"
  else
    echo "Pipeline exists: $name"
  fi
}
```

### Garantizar la existencia de un grupo de variables

```bash
# Crear un grupo de variables con actualizaciones idempotentes
ensure_variable_group() {
  local vg_name=$1
  shift
  local variables=("$@")

  VG_ID=$(az pipelines variable-group list --query "[?name=='$vg_name'].id" -o tsv)

  if [[ -z "$VG_ID" ]]; then
    echo "Creating variable group: $vg_name"
    VG_ID=$(az pipelines variable-group create \
      --name "$vg_name" \
      --variables "${variables[@]}" \
      --authorize true \
      --query "id" -o tsv)
  else
    echo "Variable group exists: $vg_name (ID: $VG_ID)"
  fi

  echo "$VG_ID"
}
```

### Garantizar la existencia de una conexión de servicio

```bash
# Comprobar si la conexión de servicio existe y crearla si no existe
ensure_service_connection() {
  local name=$1
  local project=$2

  SC_ID=$(az devops service-endpoint list \
    --project "$project" \
    --query "[?name=='$name'].id" \
    -o tsv)

  if [[ -z "$SC_ID" ]]; then
    echo "Service connection not found. Creating..."
    # Lógica de creación aquí
  else
    echo "Service connection exists: $name"
    echo "$SC_ID"
  fi
}
```

### Creación idempotente de elementos de trabajo

```bash
# Crear un elemento de trabajo solo si no existe otro con el mismo título
create_work_item_if_new() {
  local title=$1
  local type=$2

  WI_ID=$(az boards query \
    --wiql "SELECT ID FROM WorkItems WHERE [System.WorkItemType]='$type' AND [System.Title]='$title'" \
    --query "[0].id" -o tsv)

  if [[ -z "$WI_ID" ]]; then
    echo "Creating work item: $title"
    WI_ID=$(az boards work-item create --title "$title" --type "$type" --query "id" -o tsv)
  else
    echo "Work item exists: $title (ID: $WI_ID)"
  fi

  echo "$WI_ID"
}
```

### Operaciones idempotentes en bloque

```bash
# Garantizar que existan varias canalizaciones
declare -a PIPELINES=(
  "ci-pipeline:azure-pipelines.yml"
  "deploy-pipeline:deploy.yml"
  "test-pipeline:test.yml"
)

for pipeline in "${PIPELINES[@]}"; do
  IFS=':' read -r name yaml <<< "$pipeline"
  ensure_pipeline "$name" "$yaml"
done
```

### Sincronización de configuración

```bash
# Sincronizar grupos de variables desde un archivo de configuración
sync_variable_groups() {
  local config_file=$1

  while IFS=',' read -r vg_name variables; do
    ensure_variable_group "$vg_name" "$variables"
  done < "$config_file"
}

# Formato de config.csv:
# prod-vars,API_URL=prod.com,API_KEY=secret123
# dev-vars,API_URL=dev.com,API_KEY=secret456
```

## Flujos de trabajo reales

### Configuración de una canalización CI/CD

```bash
# Configurar una canalización CI/CD completa
setup_cicd_pipeline() {
  local project=$1
  local repo=$2
  local branch=$3

  # Crear grupos de variables
  VG_DEV=$(ensure_variable_group "dev-vars" "ENV=dev API_URL=api-dev.com")
  VG_PROD=$(ensure_variable_group "prod-vars" "ENV=prod API_URL=api-prod.com")

  # Crear la canalización de CI
  az pipelines create \
    --name "$repo-CI" \
    --repository "$repo" \
    --branch "$branch" \
    --yaml-path .azure/pipelines/ci.yml \
    --skip-run true

  # Crear la canalización de CD
  az pipelines create \
    --name "$repo-CD" \
    --repository "$repo" \
    --branch "$branch" \
    --yaml-path .azure/pipelines/cd.yml \
    --skip-run true

  echo "CI/CD pipeline setup complete"
}
```

### Creación automatizada de PR

```bash
# Crear una PR automáticamente desde una rama de funcionalidad
create_automated_pr() {
  local branch=$1
  local title=$2

  # Obtener información de la rama
  LAST_COMMIT=$(git log -1 --pretty=%B "$branch")
  COMMIT_SHA=$(git rev-parse "$branch")

  # Encontrar elementos de trabajo relacionados
  WORK_ITEMS=$(az boards query \
    --wiql "SELECT ID FROM WorkItems WHERE [System.ChangedBy] = @Me AND [System.State] = 'Active'" \
    --query "[].id" -o tsv)

  # Crear la PR
  PR_ID=$(az repos pr create \
    --source-branch "$branch" \
    --target-branch main \
    --title "$title" \
    --description "$LAST_COMMIT" \
    --work-items $WORK_ITEMS \
    --auto-complete true \
    --query "pullRequestId" -o tsv)

  # Establecer revisores obligatorios
  az repos pr reviewer add \
    --id $PR_ID \
    --reviewers $(git log -1 --pretty=format:'%ae' "$branch") \
    --required true

  echo "Created PR #$PR_ID"
}
```

### Supervisión y alertas de canalizaciones

```bash
# Supervisar la canalización y alertar si falla
monitor_pipeline() {
  local pipeline_name=$1
  local slack_webhook=$2

  while true; do
    # Obtener la ejecución más reciente
    RUN_ID=$(az pipelines list --query "[?name=='$pipeline_name'] | [0].id" -o tsv)
    RUNS=$(az pipelines runs list --pipeline $RUN_ID --top 1)

    LATEST_RUN_ID=$(echo "$RUNS" | jq -r '.[0].id')
    RESULT=$(echo "$RUNS" | jq -r '.[0].result')

    # Comprobar si falló y aún no se procesó
    if [[ "$RESULT" == "failed" ]]; then
      # Enviar una alerta de Slack
      curl -X POST "$slack_webhook" \
        -H 'Content-Type: application/json' \
        -d "{\"text\": \"Pipeline $pipeline_name failed! Run ID: $LATEST_RUN_ID\"}"
    fi

    sleep 300 # Comprobar cada 5 minutos
  done
}
```

### Gestión de elementos de trabajo en bloque

```bash
# Actualizar elementos de trabajo en bloque a partir de una consulta
bulk_update_work_items() {
  local wiql=$1
  local updates=("$@")

  # Consultar elementos de trabajo
  WI_IDS=$(az boards query --wiql "$wiql" --query "[].id" -o tsv)

  # Actualizar cada elemento de trabajo
  for wi_id in $WI_IDS; do
    az boards work-item update --id $wi_id "${updates[@]}"
    echo "Updated work item: $wi_id"
  done
}

# Uso: bulk_update_work_items "SELECT ID FROM WorkItems WHERE State='New'" --state "Active" --assigned-to "user@example.com"
```

### Automatización de políticas de ramas

```bash
# Aplicar políticas de ramas a todos los repositorios
apply_branch_policies() {
  local branch=$1
  local project=$2

  # Obtener todos los repositorios
  REPOS=$(az repos list --project "$project" --query "[].id" -o tsv)

  for repo_id in $REPOS; do
    echo "Applying policies to repo: $repo_id"

    # Exigir un mínimo de aprobadores
    az repos policy approver-count create \
      --blocking true \
      --enabled true \
      --branch "$branch" \
      --repository-id "$repo_id" \
      --minimum-approver-count 2 \
      --creator-vote-counts true

    # Exigir la vinculación de elementos de trabajo
    az repos policy work-item-linking create \
      --blocking true \
      --branch "$branch" \
      --enabled true \
      --repository-id "$repo_id"

    # Exigir la validación de compilación
    BUILD_ID=$(az pipelines list --query "[?name=='CI'].id" -o tsv | head -1)
    az repos policy build create \
      --blocking true \
      --enabled true \
      --branch "$branch" \
      --repository-id "$repo_id" \
      --build-definition-id "$BUILD_ID" \
      --queue-on-source-update-only true
  done
}
```

### Despliegue en varios entornos

```bash
# Desplegar en varios entornos
deploy_to_environments() {
  local run_id=$1
  shift
  local environments=("$@")

  # Descargar artefactos
  ARTIFACT_NAME=$(az pipelines runs artifact list --run-id $run_id --query "[0].name" -o tsv)
  az pipelines runs artifact download \
    --artifact-name "$ARTIFACT_NAME" \
    --path ./artifacts \
    --run-id $run_id

  # Desplegar en cada entorno
  for env in "${environments[@]}"; do
    echo "Deploying to: $env"

    # Obtener variables específicas del entorno
    VG_ID=$(az pipelines variable-group list --query "[?name=='$env-vars'].id" -o tsv)

    # Ejecutar la canalización de despliegue
    DEPLOY_RUN_ID=$(az pipelines run \
      --name "Deploy-$env" \
      --variables ARTIFACT_PATH=./artifacts ENV="$env" \
      --query "id" -o tsv)

    # Esperar al despliegue
    while true; do
      STATUS=$(az pipelines runs show --run-id $DEPLOY_RUN_ID --query "status" -o tsv)
      if [[ "$STATUS" != "inProgress" ]]; then
        break
      fi
      sleep 10
    done
  done
}
```
