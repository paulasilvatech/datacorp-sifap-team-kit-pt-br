# Variables de canalizaciones, grupos de variables y agentes

## Índice

- [Variables de canalizaciones](#variables-de-canalizaciones)
- [Grupos de variables](#grupos-de-variables)
- [Carpetas de canalizaciones](#carpetas-de-canalizaciones)
- [Grupos de agentes](#grupos-de-agentes)
- [Colas de agentes](#colas-de-agentes)
- [Agentes](#agentes)

---

## Variables de canalizaciones

### Enumerar variables

```bash
az pipelines variable list --pipeline-id {pipeline-id}
```

### Crear una variable

```bash
# Variable no secreta
az pipelines variable create \
  --name {var-name} \
  --value {var-value} \
  --pipeline-id {pipeline-id}

# Variable secreta
az pipelines variable create \
  --name {var-name} \
  --secret true \
  --pipeline-id {pipeline-id}

# Secreto solicitado de forma interactiva
az pipelines variable create \
  --name {var-name} \
  --secret true \
  --prompt true \
  --pipeline-id {pipeline-id}
```

### Actualizar una variable

```bash
az pipelines variable update \
  --name {var-name} \
  --value {new-value} \
  --pipeline-id {pipeline-id}

# Actualizar una variable secreta
az pipelines variable update \
  --name {var-name} \
  --secret true \
  --value "{new-secret-value}" \
  --pipeline-id {pipeline-id}
```

### Eliminar una variable

```bash
az pipelines variable delete --name {var-name} --pipeline-id {pipeline-id} --yes
```

## Grupos de variables

### Enumerar grupos de variables

```bash
az pipelines variable-group list
az pipelines variable-group list --output table
```

### Mostrar un grupo de variables

```bash
az pipelines variable-group show --id {group-id}
```

### Crear un grupo de variables

```bash
az pipelines variable-group create \
  --name {group-name} \
  --variables key1=value1 key2=value2 \
  --authorize true
```

### Actualizar un grupo de variables

```bash
az pipelines variable-group update \
  --id {group-id} \
  --name {new-name} \
  --description "Updated description"
```

### Eliminar un grupo de variables

```bash
az pipelines variable-group delete --id {group-id} --yes
```

### Variables de un grupo de variables

```bash
# Enumerar variables
az pipelines variable-group variable list --group-id {group-id}

# Crear una variable no secreta
az pipelines variable-group variable create \
  --group-id {group-id} \
  --name {var-name} \
  --value {var-value}

# Crear una variable secreta (se solicitará el valor si no se proporciona)
az pipelines variable-group variable create \
  --group-id {group-id} \
  --name {var-name} \
  --secret true

# Crear un secreto mediante una variable de entorno
export AZURE_DEVOPS_EXT_PIPELINE_VAR_MySecret=secretvalue
az pipelines variable-group variable create \
  --group-id {group-id} \
  --name MySecret \
  --secret true

# Actualizar una variable
az pipelines variable-group variable update \
  --group-id {group-id} \
  --name {var-name} \
  --value {new-value} \
  --secret false

# Eliminar una variable
az pipelines variable-group variable delete \
  --group-id {group-id} \
  --name {var-name}
```

## Carpetas de canalizaciones

### Enumerar carpetas

```bash
az pipelines folder list
```

### Crear una carpeta

```bash
az pipelines folder create --path 'folder/subfolder' --description "My folder"
```

### Eliminar una carpeta

```bash
az pipelines folder delete --path 'folder/subfolder'
```

### Actualizar una carpeta

```bash
az pipelines folder update --path 'old-folder' --new-path 'new-folder'
```

## Grupos de agentes

### Enumerar grupos de agentes

```bash
az pipelines pool list
az pipelines pool list --pool-type automation
az pipelines pool list --pool-type deployment
```

### Mostrar un grupo de agentes

```bash
az pipelines pool show --pool-id {pool-id}
```

## Colas de agentes

### Enumerar colas de agentes

```bash
az pipelines queue list
az pipelines queue list --pool-name {pool-name}
```

### Mostrar una cola de agentes

```bash
az pipelines queue show --id {queue-id}
```

## Agentes

### Enumerar los agentes de un grupo

```bash
az pipelines agent list --pool-id {pool-id}
```

### Mostrar los detalles de un agente

```bash
az pipelines agent show --agent-id {agent-id} --pool-id {pool-id}
```
