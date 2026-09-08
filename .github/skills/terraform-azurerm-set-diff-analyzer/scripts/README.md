# Script analizador de diffs de Set de Terraform AzureRM

Script Python que analiza el JSON de planes de Terraform e identifica "diffs falsos positivos" en atributos de tipo Set de AzureRM.

## Descripción general

Los atributos de tipo Set del proveedor AzureRM (como `backend_address_pool`, `security_rule`, etc.) no garantizan el orden, por lo que al añadir o eliminar elementos todos aparecen como "modificados". Este script distingue esos "diffs falsos positivos" de los cambios reales.

### Casos de uso

- Como **skill de agente** (recomendado)
- Como **herramienta CLI** para ejecución manual
- Para análisis automatizado en **canalizaciones CI/CD**

## Prerrequisitos

- Python 3.8 o posterior
- No requiere paquetes adicionales (solo usa la biblioteca estándar)

## Uso

### Uso básico

```bash
# Leer desde un archivo
python analyze_plan.py plan.json

# Leer desde stdin
terraform show -json plan.tfplan | python analyze_plan.py
```

### Opciones

| Opción | Forma corta | Descripción | Valor predeterminado |
|--------|-------|-------------|---------|
| `--format` | `-f` | Formato de salida (markdown/json/summary) | markdown |
| `--exit-code` | `-e` | Devolver un código de salida según los cambios | false |
| `--quiet` | `-q` | Suprimir advertencias | false |
| `--verbose` | `-v` | Mostrar advertencias detalladas | false |
| `--ignore-case` | - | Comparar valores sin distinguir mayúsculas y minúsculas | false |
| `--attributes` | - | Ruta de un archivo personalizado de definición de atributos | (integrado) |
| `--include` | - | Filtrar los recursos que se analizarán (se pueden especificar varios) | (todos) |
| `--exclude` | - | Filtrar los recursos que se excluirán (se pueden especificar varios) | (ninguno) |

### Códigos de salida (con `--exit-code`)

| Código | Significado |
|------|---------|
| 0 | Sin cambios o solo cambios de orden |
| 1 | Cambios reales en atributos Set |
| 2 | Reemplazo de recursos (eliminar + crear) |
| 3 | Error |

## Formatos de salida

### Markdown (predeterminado)

Formato legible para comentarios de PR e informes.

```bash
python analyze_plan.py plan.json --format markdown
```

### JSON

Datos estructurados para procesamiento programático.

```bash
python analyze_plan.py plan.json --format json
```

Salida de ejemplo:

```json
{
  "summary": {
    "order_only_count": 3,
    "actual_set_changes_count": 1,
    "replace_count": 0
  },
  "has_real_changes": true,
  "resources": [...],
  "warnings": []
}
```

### Resumen

Resumen de una línea para registros de CI/CD.

```bash
python analyze_plan.py plan.json --format summary
```

Salida de ejemplo:

```
🟢 3 order-only | 🟡 1 set changes
```

## Uso en canalizaciones CI/CD

### GitHub Actions

```yaml
name: Análisis del plan Terraform

on:
  pull_request:
    paths:
      - '**.tf'

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configurar Terraform
        uses: hashicorp/setup-terraform@v3

      - name: Inicializar Terraform y generar el plan
        run: |
          terraform init
          terraform plan -out=plan.tfplan
          terraform show -json plan.tfplan > plan.json

      - name: Analizar diffs de Set
        run: |
          python path/to/analyze_plan.py plan.json --format markdown > analysis.md

      - name: Comentar la PR
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          path: analysis.md
```

### GitHub Actions (puerta con código de salida)

```yaml
      - name: Analizar y aplicar la puerta
        run: |
          python path/to/analyze_plan.py plan.json --exit-code --format summary
        # Fallar con el código de salida 2 (reemplazo de recursos)
        continue-on-error: false
```

### Azure Pipelines

```yaml
- task: TerraformCLI@0
  inputs:
    command: 'plan'
    commandOptions: '-out=plan.tfplan'

- script: |
    terraform show -json plan.tfplan > plan.json
    python scripts/analyze_plan.py plan.json --format markdown > $(Build.ArtifactStagingDirectory)/analysis.md
  displayName: 'Analizar el plan'

- task: PublishBuildArtifacts@1
  inputs:
    pathToPublish: '$(Build.ArtifactStagingDirectory)/analysis.md'
    artifactName: 'plan-analysis'
```

### Ejemplos de filtrado

Analizar solo recursos concretos:

```bash
python analyze_plan.py plan.json --include application_gateway --include load_balancer
```

Excluir recursos concretos:

```bash
python analyze_plan.py plan.json --exclude virtual_network
```

## Interpretación de resultados

| Categoría | Significado | Acción recomendada |
|----------|---------|-------------------|
| 🟢 Solo orden | Diff falso positivo, sin cambio real | Se puede ignorar con seguridad |
| 🟡 Cambio real | Elemento Set añadido, eliminado o modificado | Revisar el contenido; normalmente se actualiza en el lugar |
| 🔴 Reemplazo de recursos | Eliminar + crear | Comprobar el impacto de la interrupción del servicio |

## Definiciones de atributos personalizadas

De forma predeterminada, usa `references/azurerm_set_attributes.json`, pero puedes especificar un archivo de definición personalizado:

```bash
python analyze_plan.py plan.json --attributes /path/to/custom_attributes.json
```

Consulta el formato del archivo de definición en `references/azurerm_set_attributes.md`.

## Limitaciones

- Solo se admiten recursos AzureRM (`azurerm_*`)
- Algunos recursos o atributos pueden no estar admitidos
- Las comparaciones pueden ser incompletas para atributos que contengan `after_unknown` (valores determinados después de aplicar)
- Las comparaciones pueden ser incompletas para atributos sensibles (se enmascaran)

## Documentación relacionada

- [SKILL.md](../SKILL.md): uso como skill de agente
- [azurerm_set_attributes.md](../references/azurerm_set_attributes.md): referencia de definición de atributos
