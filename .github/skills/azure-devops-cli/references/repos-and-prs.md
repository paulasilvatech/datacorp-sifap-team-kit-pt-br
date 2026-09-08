# Repositorios y solicitudes de incorporación de cambios

## Índice

- [Repositorios](#repositorios)
- [Importación de repositorios](#importación-de-repositorios)
- [Solicitudes de incorporación de cambios](#solicitudes-de-incorporación-de-cambios)
- [Referencias de Git](#referencias-de-git)
- [Políticas de repositorios](#políticas-de-repositorios)

---

## Repositorios

### Enumerar repositorios

```bash
az repos list --org https://dev.azure.com/{org} --project {project}
az repos list --output table
```

### Mostrar los detalles de un repositorio

```bash
az repos show --repository {repo-name} --project {project}
```

### Crear un repositorio

```bash
az repos create --name {repo-name} --project {project}
```

### Eliminar un repositorio

```bash
az repos delete --id {repo-id} --project {project} --yes
```

### Actualizar un repositorio

```bash
az repos update --id {repo-id} --name {new-name} --project {project}
```

## Importación de repositorios

### Importar un repositorio Git

```bash
# Importar desde un repositorio Git público
az repos import create \
  --git-source-url https://github.com/user/repo \
  --repository {repo-name}

# Importar con autenticación
az repos import create \
  --git-source-url https://github.com/user/private-repo \
  --repository {repo-name} \
  --user {username} \
  --password {password-or-pat}
```

## Solicitudes de incorporación de cambios

### Crear una solicitud de incorporación de cambios

```bash
# Creación básica de una PR
az repos pr create \
  --repository {repo} \
  --source-branch {source-branch} \
  --target-branch {target-branch} \
  --title "PR Title" \
  --description "PR description" \
  --open

# PR con elementos de trabajo
az repos pr create \
  --repository {repo} \
  --source-branch {source-branch} \
  --work-items 63 64

# PR en borrador con revisores
az repos pr create \
  --repository {repo} \
  --source-branch feature/new-feature \
  --target-branch main \
  --title "Feature: New functionality" \
  --draft true \
  --reviewers user1@example.com user2@example.com \
  --required-reviewers lead@example.com \
  --labels "enhancement" "backlog"
```

### Enumerar solicitudes de incorporación de cambios

```bash
# Todas las PR
az repos pr list --repository {repo}

# Filtrar por estado
az repos pr list --repository {repo} --status active

# Filtrar por creador
az repos pr list --repository {repo} --creator {email}

# Salida en forma de tabla
az repos pr list --repository {repo} --output table
```

### Mostrar los detalles de una PR

```bash
az repos pr show --id {pr-id}
az repos pr show --id {pr-id} --open  # Abrir en el navegador
```

### Actualizar una PR (completar/abandonar/borrador)

```bash
# Completar la PR
az repos pr update --id {pr-id} --status completed

# Abandonar la PR
az repos pr update --id {pr-id} --status abandoned

# Establecer como borrador
az repos pr update --id {pr-id} --draft true

# Publicar la PR en borrador
az repos pr update --id {pr-id} --draft false

# Completar automáticamente cuando se cumplan las políticas
az repos pr update --id {pr-id} --auto-complete true

# Establecer el título y la descripción
az repos pr update --id {pr-id} --title "New title" --description "New description"
```

### Cambiar localmente a la rama de una PR

```bash
# Cambiar a la rama de la PR
az repos pr checkout --id {pr-id}

# Cambiar a la rama usando un remoto concreto
az repos pr checkout --id {pr-id} --remote-name upstream
```

### Votar en una PR

```bash
az repos pr set-vote --id {pr-id} --vote approve
az repos pr set-vote --id {pr-id} --vote approve-with-suggestions
az repos pr set-vote --id {pr-id} --vote reject
az repos pr set-vote --id {pr-id} --vote wait-for-author
az repos pr set-vote --id {pr-id} --vote reset
```

### Revisores de PR

```bash
# Añadir revisores
az repos pr reviewer add --id {pr-id} --reviewers user1@example.com user2@example.com

# Enumerar revisores
az repos pr reviewer list --id {pr-id}

# Quitar revisores
az repos pr reviewer remove --id {pr-id} --reviewers user1@example.com
```

### Elementos de trabajo de PR

```bash
# Añadir elementos de trabajo a una PR
az repos pr work-item add --id {pr-id} --work-items {id1} {id2}

# Enumerar los elementos de trabajo de una PR
az repos pr work-item list --id {pr-id}

# Quitar elementos de trabajo de una PR
az repos pr work-item remove --id {pr-id} --work-items {id1}
```

### Políticas de PR

```bash
# Enumerar las políticas de una PR
az repos pr policy list --id {pr-id}

# Poner en cola la evaluación de políticas de una PR
az repos pr policy queue --id {pr-id} --evaluation-id {evaluation-id}
```

## Referencias de Git

### Enumerar referencias (ramas)

```bash
az repos ref list --repository {repo}
az repos ref list --repository {repo} --query "[?name=='refs/heads/main']"
```

### Crear una referencia (rama)

```bash
az repos ref create --name refs/heads/new-branch --object-type commit --object {commit-sha}
```

### Eliminar una referencia (rama)

```bash
az repos ref delete --name refs/heads/old-branch --repository {repo} --project {project}
```

### Bloquear o desbloquear una rama

```bash
az repos ref lock --name refs/heads/main --repository {repo} --project {project}
az repos ref unlock --name refs/heads/main --repository {repo} --project {project}
```

## Políticas de repositorios

### Enumerar todas las políticas

```bash
az repos policy list --repository {repo-id} --branch main
```

### Crear, actualizar o eliminar una política

```bash
# Crear desde un archivo de configuración
az repos policy create --config policy.json

# Actualizar
az repos policy update --id {policy-id} --config updated-policy.json

# Eliminar
az repos policy delete --id {policy-id} --yes
```

### Política de número de aprobadores

```bash
az repos policy approver-count create \
  --blocking true \
  --enabled true \
  --branch main \
  --repository-id {repo-id} \
  --minimum-approver-count 2 \
  --creator-vote-counts true
```

### Política de compilación

```bash
az repos policy build create \
  --blocking true \
  --enabled true \
  --branch main \
  --repository-id {repo-id} \
  --build-definition-id {definition-id} \
  --queue-on-source-update-only true \
  --valid-duration 720
```

### Política de vinculación de elementos de trabajo

```bash
az repos policy work-item-linking create \
  --blocking true \
  --branch main \
  --enabled true \
  --repository-id {repo-id}
```

### Política de revisores obligatorios

```bash
az repos policy required-reviewer create \
  --blocking true \
  --enabled true \
  --branch main \
  --repository-id {repo-id} \
  --required-reviewers user@example.com
```

### Política de estrategia de integración

```bash
az repos policy merge-strategy create \
  --blocking true \
  --enabled true \
  --branch main \
  --repository-id {repo-id} \
  --allow-squash true \
  --allow-rebase true \
  --allow-no-fast-forward true
```

### Política de cumplimiento de mayúsculas y minúsculas

```bash
az repos policy case-enforcement create \
  --blocking true \
  --enabled true \
  --branch main \
  --repository-id {repo-id}
```

### Política de comentarios obligatorios

```bash
az repos policy comment-required create \
  --blocking true \
  --enabled true \
  --branch main \
  --repository-id {repo-id}
```

### Política de tamaño de archivos

```bash
az repos policy file-size create \
  --blocking true \
  --enabled true \
  --branch main \
  --repository-id {repo-id} \
  --maximum-file-size 10485760  # 10MB en bytes
```
