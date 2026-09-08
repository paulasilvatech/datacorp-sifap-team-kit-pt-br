# Canalizaciones, compilaciones y versiones

## Índice

- [Canalizaciones](#canalizaciones)
- [Ejecuciones de canalizaciones](#ejecuciones-de-canalizaciones)
- [Compilaciones](#compilaciones)
- [Definiciones de compilación](#definiciones-de-compilación)
- [Versiones](#versiones)
- [Definiciones de versión](#definiciones-de-versión)
- [Paquetes universales (Artifacts)](#paquetes-universales-artifacts)

---

## Canalizaciones

### Enumerar canalizaciones

```bash
az pipelines list --output table
az pipelines list --query "[?name=='myPipeline']"
az pipelines list --folder-path 'folder/subfolder'
```

### Crear una canalización

```bash
# Desde el contexto de un repositorio local (detecta los ajustes automáticamente)
az pipelines create --name 'ContosoBuild' --description 'Pipeline for contoso project'

# Con una rama y una ruta YAML concretas
az pipelines create \
  --name {pipeline-name} \
  --repository {repo} \
  --branch main \
  --yaml-path azure-pipelines.yml \
  --description "My CI/CD pipeline"

# Para un repositorio de GitHub
az pipelines create \
  --name 'GitHubPipeline' \
  --repository https://github.com/Org/Repo \
  --branch main \
  --repository-type github

# Omitir la primera ejecución
az pipelines create --name 'MyPipeline' --skip-run true
```

### Mostrar una canalización

```bash
az pipelines show --id {pipeline-id}
az pipelines show --name {pipeline-name}
```

### Actualizar una canalización

```bash
az pipelines update --id {pipeline-id} --name "New name" --description "Updated description"
```

### Eliminar una canalización

```bash
az pipelines delete --id {pipeline-id} --yes
```

### Ejecutar una canalización

```bash
# Ejecutar por nombre
az pipelines run --name {pipeline-name} --branch main

# Ejecutar por ID
az pipelines run --id {pipeline-id} --branch refs/heads/main

# Con parámetros
az pipelines run --name {pipeline-name} --parameters version=1.0.0 environment=prod

# Con variables
az pipelines run --name {pipeline-name} --variables buildId=123 configuration=release

# Abrir los resultados en el navegador
az pipelines run --name {pipeline-name} --open
```

## Ejecuciones de canalizaciones

### Enumerar ejecuciones

```bash
az pipelines runs list --pipeline {pipeline-id}
az pipelines runs list --name {pipeline-name} --top 10
az pipelines runs list --branch main --status completed
```

### Mostrar los detalles de una ejecución

```bash
az pipelines runs show --run-id {run-id}
az pipelines runs show --run-id {run-id} --open
```

### Artefactos de canalizaciones

```bash
# Enumerar los artefactos de una ejecución
az pipelines runs artifact list --run-id {run-id}

# Descargar un artefacto
az pipelines runs artifact download \
  --artifact-name '{artifact-name}' \
  --path {local-path} \
  --run-id {run-id}

# Cargar un artefacto
az pipelines runs artifact upload \
  --artifact-name '{artifact-name}' \
  --path {local-path} \
  --run-id {run-id}
```

### Etiquetas de ejecuciones de canalizaciones

```bash
# Añadir una etiqueta a una ejecución
az pipelines runs tag add --run-id {run-id} --tags production v1.0

# Enumerar las etiquetas de una ejecución
az pipelines runs tag list --run-id {run-id} --output table
```

## Compilaciones

### Enumerar compilaciones

```bash
az pipelines build list
az pipelines build list --definition {build-definition-id}
az pipelines build list --status completed --result succeeded
```

### Poner una compilación en cola

```bash
az pipelines build queue --definition {build-definition-id} --branch main
az pipelines build queue --definition {build-definition-id} --parameters version=1.0.0
```

### Mostrar los detalles de una compilación

```bash
az pipelines build show --id {build-id}
```

### Cancelar una compilación

```bash
az pipelines build cancel --id {build-id}
```

### Etiquetas de compilaciones

```bash
# Añadir una etiqueta a una compilación
az pipelines build tag add --build-id {build-id} --tags prod release

# Eliminar una etiqueta de una compilación
az pipelines build tag delete --build-id {build-id} --tag prod
```

## Definiciones de compilación

### Enumerar definiciones de compilación

```bash
az pipelines build definition list
az pipelines build definition list --name {definition-name}
```

### Mostrar una definición de compilación

```bash
az pipelines build definition show --id {definition-id}
```

## Versiones

### Enumerar versiones

```bash
az pipelines release list
az pipelines release list --definition {release-definition-id}
```

### Crear una versión

```bash
az pipelines release create --definition {release-definition-id}
az pipelines release create --definition {release-definition-id} --description "Release v1.0"
```

### Mostrar una versión

```bash
az pipelines release show --id {release-id}
```

## Definiciones de versión

### Enumerar definiciones de versión

```bash
az pipelines release definition list
```

### Mostrar una definición de versión

```bash
az pipelines release definition show --id {definition-id}
```

## Paquetes universales (Artifacts)

### Publicar un paquete

```bash
az artifacts universal publish \
  --feed {feed-name} \
  --name {package-name} \
  --version {version} \
  --path {package-path} \
  --project {project}
```

### Descargar un paquete

```bash
az artifacts universal download \
  --feed {feed-name} \
  --name {package-name} \
  --version {version} \
  --path {download-path} \
  --project {project}
```
