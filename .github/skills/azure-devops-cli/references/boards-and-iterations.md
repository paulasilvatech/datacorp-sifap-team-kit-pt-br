# Elementos de trabajo, rutas de área e iteraciones

## Índice

- [Elementos de trabajo (Boards)](#elementos-de-trabajo-boards)
- [Rutas de área](#rutas-de-área)
- [Iteraciones](#iteraciones)

---

## Elementos de trabajo (Boards)

### Consultar elementos de trabajo

```bash
# Consulta WIQL
az boards query \
  --wiql "SELECT [System.Id], [System.Title], [System.State] FROM WorkItems WHERE [System.AssignedTo] = @Me AND [System.State] = 'Active'"

# Consulta con formato de salida
az boards query --wiql "SELECT * FROM WorkItems" --output table
```

### Mostrar un elemento de trabajo

```bash
az boards work-item show --id {work-item-id}
az boards work-item show --id {work-item-id} --open
```

### Crear un elemento de trabajo

```bash
# Elemento de trabajo básico
az boards work-item create \
  --title "Fix login bug" \
  --type Bug \
  --assigned-to user@example.com \
  --description "Users cannot login with SSO"

# Con área e iteración
az boards work-item create \
  --title "New feature" \
  --type "User Story" \
  --area "Project\\Area1" \
  --iteration "Project\\Sprint 1"

# Con campos personalizados
az boards work-item create \
  --title "Task" \
  --type Task \
  --fields "Priority=1" "Severity=2"

# Con comentario de discusión
az boards work-item create \
  --title "Issue" \
  --type Bug \
  --discussion "Initial investigation completed"

# Para un cuerpo largo de --discussion en Windows, consulta references/long-comments-on-windows.md.
# En resumen: usa azps.ps1 en PowerShell o recurre a 'az devops invoke'
# con --in-file cuando no exista una opción nativa --file-path.

# Abrir en el navegador después de crear
az boards work-item create --title "Bug" --type Bug --open
```

### Actualizar un elemento de trabajo

```bash
# Actualizar el estado, el título y la persona asignada
az boards work-item update \
  --id {work-item-id} \
  --state "Active" \
  --title "Updated title" \
  --assigned-to user@example.com

# Mover a otra área
az boards work-item update \
  --id {work-item-id} \
  --area "{ProjectName}\\{Team}\\{Area}"

# Cambiar la iteración
az boards work-item update \
  --id {work-item-id} \
  --iteration "{ProjectName}\\Sprint 5"

# Añadir un comentario o una discusión
az boards work-item update \
  --id {work-item-id} \
  --discussion "Work in progress"

# Comentario largo en Windows: lee el cuerpo en una variable de PowerShell e invoca
# azps.ps1 en lugar de az.cmd, o recurre a 'az devops invoke' con --in-file.
# Orientaciones completas en references/long-comments-on-windows.md.
#
# Ejemplo de PowerShell:
#   $body = Get-Content -Raw .\comment.md
#   azps.ps1 boards work-item update --id 1234 --discussion $body

# Actualizar con campos personalizados
az boards work-item update \
  --id {work-item-id} \
  --fields "Priority=1" "StoryPoints=5"
```

### Eliminar un elemento de trabajo

```bash
# Eliminación temporal (se puede restaurar)
az boards work-item delete --id {work-item-id} --yes

# Eliminación permanente
az boards work-item delete --id {work-item-id} --destroy --yes
```

### Relaciones de elementos de trabajo

```bash
# Enumerar relaciones
az boards work-item relation list --id {work-item-id}

# Enumerar los tipos de relación admitidos
az boards work-item relation list-type

# Añadir una relación
az boards work-item relation add --id {work-item-id} --relation-type parent --target-id {parent-id}

# Eliminar una relación
az boards work-item relation remove --id {work-item-id} --relation-id {relation-id}
```

## Rutas de área

### Enumerar las áreas de un proyecto

```bash
az boards area project list --project {project}
az boards area project show --path "Project\\Area1" --project {project}
```

### Crear un área

```bash
az boards area project create --path "Project\\NewArea" --project {project}
```

### Actualizar un área

```bash
az boards area project update \
  --path "Project\\OldArea" \
  --new-path "Project\\UpdatedArea" \
  --project {project}
```

### Eliminar un área

```bash
az boards area project delete --path "Project\\AreaToDelete" --project {project} --yes
```

### Gestión de áreas del equipo

```bash
# Enumerar las áreas del equipo
az boards area team list --team {team-name} --project {project}

# Añadir un área al equipo
az boards area team add \
  --team {team-name} \
  --path "Project\\NewArea" \
  --project {project}

# Quitar un área del equipo
az boards area team remove \
  --team {team-name} \
  --path "Project\\AreaToRemove" \
  --project {project}

# Actualizar un área del equipo
az boards area team update \
  --team {team-name} \
  --path "Project\\Area" \
  --project {project} \
  --include-sub-areas true
```

## Iteraciones

### Enumerar las iteraciones de un proyecto

```bash
az boards iteration project list --project {project}
az boards iteration project show --path "Project\\Sprint 1" --project {project}
```

### Crear una iteración

```bash
az boards iteration project create --path "Project\\Sprint 1" --project {project}
```

### Actualizar una iteración

```bash
az boards iteration project update \
  --path "Project\\OldSprint" \
  --new-path "Project\\NewSprint" \
  --project {project}
```

### Eliminar una iteración

```bash
az boards iteration project delete --path "Project\\OldSprint" --project {project} --yes
```

### Iteraciones del equipo

```bash
# Enumerar las iteraciones del equipo
az boards iteration team list --team {team-name} --project {project}

# Añadir una iteración al equipo
az boards iteration team add \
  --team {team-name} \
  --path "Project\\Sprint 1" \
  --project {project}

# Quitar una iteración del equipo
az boards iteration team remove \
  --team {team-name} \
  --path "Project\\Sprint 1" \
  --project {project}

# Enumerar los elementos de trabajo de la iteración
az boards iteration team list-work-items \
  --team {team-name} \
  --path "Project\\Sprint 1" \
  --project {project}
```

### Iteraciones predeterminada y del backlog

```bash
# Establecer la iteración predeterminada del equipo
az boards iteration team set-default-iteration \
  --team {team-name} \
  --path "Project\\Sprint 1" \
  --project {project}

# Mostrar la iteración predeterminada
az boards iteration team show-default-iteration \
  --team {team-name} \
  --project {project}

# Establecer la iteración del backlog del equipo
az boards iteration team set-backlog-iteration \
  --team {team-name} \
  --path "Project\\Sprint 1" \
  --project {project}

# Mostrar la iteración del backlog
az boards iteration team show-backlog-iteration \
  --team {team-name} \
  --project {project}

# Mostrar la iteración actual
az boards iteration team show --team {team-name} --project {project} --timeframe current
```
