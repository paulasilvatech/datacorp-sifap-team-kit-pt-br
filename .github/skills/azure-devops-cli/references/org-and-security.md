# Organización, seguridad y administración

## Índice

- [Proyectos](#proyectos)
- [Gestión de extensiones](#gestión-de-extensiones)
- [Puntos de conexión de servicio](#puntos-de-conexión-de-servicio)
- [Equipos](#equipos)
- [Usuarios](#usuarios)
- [Grupos de seguridad](#grupos-de-seguridad)
- [Permisos de seguridad](#permisos-de-seguridad)
- [Wikis](#wikis)
- [Administración](#administración)
- [Extensiones de DevOps](#extensiones-de-devops)

---

## Proyectos

### Enumerar proyectos

```bash
az devops project list --organization https://dev.azure.com/{org}
az devops project list --top 10 --output table
```

### Crear un proyecto

```bash
az devops project create \
  --name myNewProject \
  --organization https://dev.azure.com/{org} \
  --description "My new DevOps project" \
  --source-control git \
  --visibility private
```

### Mostrar los detalles de un proyecto

```bash
az devops project show --project {project-name} --org https://dev.azure.com/{org}
```

### Eliminar un proyecto

```bash
az devops project delete --id {project-id} --org https://dev.azure.com/{org} --yes
```

## Gestión de extensiones

### Enumerar extensiones

```bash
# Enumerar las extensiones disponibles
az extension list-available --output table

# Enumerar las extensiones instaladas
az extension list --output table
```

### Gestionar la extensión de Azure DevOps

```bash
# Instalar la extensión de Azure DevOps
az extension add --name azure-devops

# Actualizar la extensión de Azure DevOps
az extension update --name azure-devops

# Quitar la extensión
az extension remove --name azure-devops

# Instalar desde una ruta local
az extension add --source ~/extensions/azure-devops.whl
```

## Puntos de conexión de servicio

### Enumerar puntos de conexión de servicio

```bash
az devops service-endpoint list --project {project}
az devops service-endpoint list --project {project} --output table
```

### Mostrar un punto de conexión de servicio

```bash
az devops service-endpoint show --id {endpoint-id} --project {project}
```

### Crear un punto de conexión de servicio

```bash
# Usar un archivo de configuración
az devops service-endpoint create --service-endpoint-configuration endpoint.json --project {project}
```

### Eliminar un punto de conexión de servicio

```bash
az devops service-endpoint delete --id {endpoint-id} --project {project} --yes
```

## Equipos

### Enumerar equipos

```bash
az devops team list --project {project}
```

### Mostrar un equipo

```bash
az devops team show --team {team-name} --project {project}
```

### Crear un equipo

```bash
az devops team create \
  --name {team-name} \
  --description "Team description" \
  --project {project}
```

### Actualizar un equipo

```bash
az devops team update \
  --team {team-name} \
  --project {project} \
  --name "{new-team-name}" \
  --description "Updated description"
```

### Eliminar un equipo

```bash
az devops team delete --team {team-name} --project {project} --yes
```

### Mostrar los integrantes de un equipo

```bash
az devops team list-member --team {team-name} --project {project}
```

## Usuarios

### Enumerar usuarios

```bash
az devops user list --org https://dev.azure.com/{org}
az devops user list --top 10 --output table
```

### Mostrar un usuario

```bash
az devops user show --user {user-id-or-email} --org https://dev.azure.com/{org}
```

### Añadir un usuario

```bash
az devops user add \
  --email user@example.com \
  --license-type express \
  --org https://dev.azure.com/{org}
```

### Actualizar un usuario

```bash
az devops user update \
  --user {user-id-or-email} \
  --license-type advanced \
  --org https://dev.azure.com/{org}
```

### Quitar un usuario

```bash
az devops user remove --user {user-id-or-email} --org https://dev.azure.com/{org} --yes
```

## Grupos de seguridad

### Enumerar grupos

```bash
# Enumerar todos los grupos del proyecto
az devops security group list --project {project}

# Enumerar todos los grupos de la organización
az devops security group list --scope organization

# Enumerar con filtrado
az devops security group list --project {project} --subject-types vstsgroup
```

### Mostrar los detalles de un grupo

```bash
az devops security group show --group-id {group-id}
```

### Crear un grupo

```bash
az devops security group create \
  --name {group-name} \
  --description "Group description" \
  --project {project}
```

### Actualizar un grupo

```bash
az devops security group update \
  --group-id {group-id} \
  --name "{new-group-name}" \
  --description "Updated description"
```

### Eliminar un grupo

```bash
az devops security group delete --group-id {group-id} --yes
```

### Pertenencia a grupos

```bash
# Enumerar las pertenencias
az devops security group membership list --id {group-id}

# Añadir un integrante
az devops security group membership add \
  --group-id {group-id} \
  --member-id {member-id}

# Quitar un integrante
az devops security group membership remove \
  --group-id {group-id} \
  --member-id {member-id} --yes
```

## Permisos de seguridad

### Enumerar espacios de nombres

```bash
az devops security permission namespace list
```

### Mostrar los detalles de un espacio de nombres

```bash
# Mostrar los permisos disponibles en un espacio de nombres
az devops security permission namespace show --namespace "GitRepositories"
```

### Enumerar permisos

```bash
# Enumerar permisos para un usuario o grupo y un espacio de nombres
az devops security permission list \
  --id {user-or-group-id} \
  --namespace "GitRepositories" \
  --project {project}

# Enumerar para un token concreto (repositorio)
az devops security permission list \
  --id {user-or-group-id} \
  --namespace "GitRepositories" \
  --project {project} \
  --token "repoV2/{project}/{repository-id}"
```

### Mostrar permisos

```bash
az devops security permission show \
  --id {user-or-group-id} \
  --namespace "GitRepositories" \
  --project {project} \
  --token "repoV2/{project}/{repository-id}"
```

### Actualizar permisos

```bash
# Conceder un permiso
az devops security permission update \
  --id {user-or-group-id} \
  --namespace "GitRepositories" \
  --project {project} \
  --token "repoV2/{project}/{repository-id}" \
  --permission-mask "Pull,Contribute"

# Denegar un permiso
az devops security permission update \
  --id {user-or-group-id} \
  --namespace "GitRepositories" \
  --project {project} \
  --token "repoV2/{project}/{repository-id}" \
  --permission-mask 0
```

### Restablecer permisos

```bash
# Restablecer bits de permiso concretos
az devops security permission reset \
  --id {user-or-group-id} \
  --namespace "GitRepositories" \
  --project {project} \
  --token "repoV2/{project}/{repository-id}" \
  --permission-mask "Pull,Contribute"

# Restablecer todos los permisos
az devops security permission reset-all \
  --id {user-or-group-id} \
  --namespace "GitRepositories" \
  --project {project} \
  --token "repoV2/{project}/{repository-id}" --yes
```

## Wikis

### Enumerar wikis

```bash
# Enumerar todas las wikis del proyecto
az devops wiki list --project {project}

# Enumerar todas las wikis de la organización
az devops wiki list
```

### Mostrar una wiki

```bash
az devops wiki show --wiki {wiki-name} --project {project}
az devops wiki show --wiki {wiki-name} --project {project} --open
```

### Crear una wiki

```bash
# Crear una wiki de proyecto
az devops wiki create \
  --name {wiki-name} \
  --project {project} \
  --type projectWiki

# Crear una wiki de código desde un repositorio
az devops wiki create \
  --name {wiki-name} \
  --project {project} \
  --type codeWiki \
  --repository {repo-name} \
  --mapped-path /wiki
```

### Eliminar una wiki

```bash
az devops wiki delete --wiki {wiki-id} --project {project} --yes
```

### Páginas de wiki

```bash
# Enumerar páginas
az devops wiki page list --wiki {wiki-name} --project {project}

# Mostrar una página
az devops wiki page show \
  --wiki {wiki-name} \
  --path "/page-name" \
  --project {project}

# Crear una página
az devops wiki page create \
  --wiki {wiki-name} \
  --path "/new-page" \
  --content "# New Page\n\nPage content here..." \
  --project {project}

# Actualizar una página
az devops wiki page update \
  --wiki {wiki-name} \
  --path "/existing-page" \
  --content "# Updated Page\n\nNew content..." \
  --project {project}

# Eliminar una página
az devops wiki page delete \
  --wiki {wiki-name} \
  --path "/old-page" \
  --project {project} --yes
```

## Administración

### Gestión de avisos

```bash
# Enumerar avisos
az devops admin banner list

# Mostrar los detalles de un aviso
az devops admin banner show --id {banner-id}

# Añadir un aviso nuevo
az devops admin banner add \
  --message "System maintenance scheduled" \
  --level info  # info, warning, error

# Actualizar un aviso
az devops admin banner update \
  --id {banner-id} \
  --message "Updated message" \
  --level warning \
  --expiration-date "2025-12-31T23:59:59Z"

# Quitar un aviso
az devops admin banner remove --id {banner-id}
```

## Extensiones de DevOps

Gestiona las extensiones instaladas en una organización de Azure DevOps (distintas de las extensiones de la CLI).

```bash
# Enumerar las extensiones instaladas
az devops extension list --org https://dev.azure.com/{org}

# Buscar extensiones en el marketplace
az devops extension search --search-query "docker"

# Mostrar los detalles de una extensión
az devops extension show --ext-id {extension-id} --org https://dev.azure.com/{org}

# Instalar una extensión
az devops extension install \
  --ext-id {extension-id} \
  --org https://dev.azure.com/{org} \
  --publisher {publisher-id}

# Habilitar una extensión
az devops extension enable \
  --ext-id {extension-id} \
  --org https://dev.azure.com/{org}

# Deshabilitar una extensión
az devops extension disable \
  --ext-id {extension-id} \
  --org https://dev.azure.com/{org}

# Desinstalar una extensión
az devops extension uninstall \
  --ext-id {extension-id} \
  --org https://dev.azure.com/{org} --yes
```
