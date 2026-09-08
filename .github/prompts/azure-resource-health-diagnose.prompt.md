---
name: "azure-resource-health-diagnose"
description: "Diagnostica el estado de un recurso de Azure a partir de los registros y la telemetría y elabora un plan de corrección, delegando el flujo de trabajo a la habilidad azure-resource-health-diagnose."
argument-hint: "resource=<name> rg=<resource-group>"
agent: "devops-engineer"
tools: ["read", "search", "execute"]
---
# /azure-resource-health-diagnose

## Objetivo

Evaluar el estado de un recurso de Azure, diagnosticar problemas a partir de sus registros y su telemetría y elaborar un plan de corrección priorizado. El flujo de trabajo completo se encuentra en la habilidad [`azure-resource-health-diagnose`](../skills/azure-resource-health-diagnose/SKILL.md); este prompt lo aplica al kit SIFAP 2.0 sin repetirlo.

> [!NOTE]
> Diagnostica antes de hacer cambios: clasifica los problemas por gravedad y verifica cualquier corrección con el código de Terraform de `infra/`.

## Cuándo invocar

Durante la etapa 4 (Evolución), cuando un recurso de Azure implementado se comporta de forma inesperada y el equipo necesita un diagnóstico estructurado antes de actuar.

## Precondiciones

- El equipo está autenticado en Azure
- El recurso está implementado y genera registros/telemetría
- La configuración de diagnóstico envía los registros a un área de trabajo de Log Analytics accesible

## Entradas que debe proporcionar el equipo

- `resource` — el nombre del recurso (y, si se conocen, su grupo de recursos y su suscripción)
- El síntoma observado y cuándo comenzó
- Solicita a la persona usuaria cualquier información que falte.

## Lo que haré

- Seguir el flujo de trabajo de evaluación del estado y análisis de registros de la habilidad [`azure-resource-health-diagnose`](../skills/azure-resource-health-diagnose/SKILL.md)
- Centrarme primero en los tipos de recursos del kit: Azure Database for PostgreSQL 16 y servicios de Spring Boot en contenedores
- Clasificar los problemas por gravedad (Crítica/Alta/Media/Baja) y rastrear cada uno hasta su causa raíz
- Elaborar un plan de corrección por fases con pasos de validación y reversión

## Lo que NO haré

- Aplicar una corrección antes del diagnóstico y de la confirmación del equipo
- Recomendar un cambio manual que se desvíe del código de Terraform de `infra/`
- Ignorar las identidades administradas (Managed Identity): señalaré cualquier recurso que siga utilizando claves compartidas o cadenas de conexión
- Exagerar el grado de certeza cuando falten registros (señalaré la limitación)

## Formato de salida

```markdown
### Evaluación del estado — payment-db (Azure Database for PostgreSQL)
Estado: Advertencia · Analizado: <timestamp>

### Problemas
| Gravedad | Problema | Causa raíz |
|---|---|---|
| Alta | Fallos de conexión | Se alcanzó el número máximo de conexiones |

### Corrección (por fases)
1. Inmediata — aumentar el límite de conexiones / añadir un grupo de conexiones reutilizables
2. A corto plazo — ajustar el nivel de cómputo a las necesidades mediante Terraform
```

## Definición de terminado

- [ ] Se indica el estado del recurso con métricas que lo respaldan
- [ ] Los problemas se clasifican por gravedad y cada uno tiene una causa raíz
- [ ] El plan de corrección se organiza por fases, con validación y reversión
- [ ] Toda corrección se expresa en términos del código de Terraform de `infra/`

## Cuerpo del prompt

La habilidad [`azure-resource-health-diagnose`](../skills/azure-resource-health-diagnose/SKILL.md) define los diagnósticos y las consultas KQL específicos de cada tipo de recurso: léela y aplícala al recurso de destino.

**Paso 1 — Identificar.**
Localiza el recurso, su tipo y sus dependencias.

**Paso 2 — Aplicar la habilidad.**
Ejecuta las comprobaciones de estado y las consultas de registros/telemetría según la habilidad e identifica los patrones de fallo.

**Paso 3 — Respetar las reglas del kit.**
Prioriza PostgreSQL 16 y los servicios de Spring Boot, señala la autenticación que no utilice Managed Identity y vincula las correcciones al código de Terraform de `infra/`.

**Paso 4 — Planificar.**
Clasifica los problemas y elabora el plan de corrección por fases; espera la confirmación antes de actuar.

## Ejemplo de invocación

```text
/azure-resource-health-diagnose resource=payment-db rg=sifap-prod-rg
```
