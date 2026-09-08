---
name: "az-cost-optimize"
description: "Analiza los recursos de Azure y la IaC de Terraform para identificar ahorros y abre incidencias de seguimiento en GitHub, delegando el flujo de trabajo a la habilidad az-cost-optimize."
argument-hint: "rg=<resource-group> repo=<owner/name>"
agent: "devops-engineer"
tools: ["read", "search", "execute"]
---
# /az-cost-optimize

## Objetivo

Analizar los recursos de Azure implementados y su IaC de Terraform, elaborar recomendaciones de optimización de costos basadas en evidencias y abrir una incidencia de GitHub por oportunidad, además de una épica de coordinación (EPIC). El flujo de trabajo completo se encuentra en la habilidad [`az-cost-optimize`](../skills/az-cost-optimize/SKILL.md); este prompt lo aplica al kit SIFAP 2.0 sin repetirlo.

> [!IMPORTANT]
> La IaC del kit utiliza únicamente Terraform. Considera que las referencias a Bicep/ARM de la habilidad están fuera del alcance y nunca abras una incidencia sobre un ahorro que no puedas respaldar con precios validados.

## Cuándo invocar

Durante la etapa 4 (Evolución), una vez que el equipo haya aprovisionado recursos de Azure y quiera dar seguimiento a las reducciones de costos mediante incidencias de GitHub.

## Precondiciones

- El equipo está autenticado en Azure y en el repositorio de GitHub de destino
- Existe código de Terraform para el sistema moderno en `infra/` (creado por el equipo en las etapas 3/4)
- Se conocen el grupo de recursos y la suscripción de destino

## Entradas que debe proporcionar el equipo

- `rg` — el grupo de recursos de Azure de destino
- `repo` — el `owner/name` del repositorio de GitHub donde se crearán las incidencias
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Seguir el flujo de trabajo de descubrimiento, métricas y recomendaciones de la habilidad [`az-cost-optimize`](../skills/az-cost-optimize/SKILL.md)
- Leer únicamente el código de Terraform de `infra/` como fuente de verdad de la IaC
- Validar cada costo actual y objetivo con los precios de Azure antes de recomendar
- Abrir una incidencia de GitHub por optimización, además de una épica, mediante la CLI `gh`

## Lo que NO haré

- Analizar plantillas de Bicep o ARM: están fuera del alcance de este kit
- Inventar recursos o ahorros cuando no exista código de Terraform (lo informaré y me detendré)
- Abrir incidencias antes de que el equipo confirme el resumen
- Recomendar un cambio sin evidencias validadas y sin considerar cómo revertirlo

## Formato de salida

```markdown
### Resumen
Recursos analizados: 7 · Costo actual: $X/mes · Ahorro potencial: $Y/mes · Oportunidades: 4

### Incidencias por crear
- [COST-OPT] Plan de App Service S3 → B2 — $X/mes (Riesgo bajo)
- [EPIC] Optimización de costos de Azure — $Y/mes de ahorro potencial
```

## Definición de terminado

- [ ] Cada ahorro se valida con la SKU/el nivel del recurso y los precios de Azure
- [ ] Las recomendaciones hacen referencia al código de Terraform de `infra/`, no a Bicep/ARM
- [ ] Se crea una incidencia por oportunidad, además de una épica, mediante `gh` tras la confirmación
- [ ] Cada incidencia incluye evidencias, riesgos y pasos de validación

## Cuerpo del prompt

La habilidad [`az-cost-optimize`](../skills/az-cost-optimize/SKILL.md) define el procedimiento de descubrimiento, métricas, puntuación y uso de plantillas de incidencias: léela y aplícala al grupo de recursos de destino.

**Paso 1 — Descubrir.**
Enumera los recursos de `rg` y lee el código de Terraform de `infra/` como la configuración prevista.

**Paso 2 — Aplicar la habilidad.**
Recopila métricas de uso, valida los costos actuales y genera recomendaciones con puntuación según la habilidad.

**Paso 3 — Respetar las reglas del kit.**
Ignora Bicep/ARM; si no existe código de Terraform, informa de ello y detente. Mantén GitHub como fuente de verdad.

**Paso 4 — Confirmar y después crear.**
Presenta el resumen, espera la aprobación y abre las incidencias y la épica con `gh`.

## Ejemplo de invocación

```text
/az-cost-optimize rg=sifap-prod-rg repo=my-org/sifap-2
```
