---
name: "azure-architecture-autopilot"
description: "Úsala cuando la persona quiera diseñar infraestructura de Azure mediante lenguaje natural o analizar un entorno existente y convertirlo en un diagrama interactivo de arquitectura, iterar sobre él y, opcionalmente, desplegarlo. Dirige un flujo de diseño, diagrama, revisión y despliegue con un motor de diagramas incluido que funciona sin conexión (605+ iconos de Azure). Los desencadenantes incluyen \"crear X en Azure\", \"diseñar una arquitectura RAG\", \"analizar mis recursos de Azure\" y \"dibujar un diagrama para rg-...\". Genera Bicep, que queda fuera del alcance del kit; expresa en Terraform cualquier diseño adoptado."
---
# Piloto automático de arquitectura de Azure

Un flujo de trabajo que diseña infraestructura de Azure a partir de lenguaje natural o analiza recursos existentes, visualiza la arquitectura como un diagrama interactivo y permite iterar mediante modificaciones y despliegues.

> [!WARNING]
> La IaC de este kit es **Terraform (proveedor de Azure `~> 3.x`)**. Esta skill genera **Bicep**, que queda **fuera del alcance** de los entregables del kit. Úsala solo para explorar, crear diagramas y consultar referencias, y expresa cualquier arquitectura adoptada en Terraform bajo `infra/` (que el equipo crea en la etapa 3), con las etiquetas obligatorias `project`, `environment` y `owner`.

> [!NOTE]
> Esta skill depende de un motor de diagramas Python incluido (`scripts/`, sin necesidad de instalación). Las fases de despliegue requieren además la CLI `az` y las herramientas Bicep. El agente principal comprueba los hechos en Microsoft Docs directamente con las herramientas `web_fetch` y `web_search`.

## Cuándo invocar

- "Crea una arquitectura RAG en Azure."
- "Analiza mi infraestructura actual de Azure y dibuja un diagrama de rg-sifap."
- "Foundry va lento; ¿cómo debería cambiar esta arquitectura?"
- "Quiero reducir el costo o reforzar la seguridad de este diseño."

## Motor de diagramas incluido

El motor de diagramas está integrado en la skill bajo `scripts/`. No se necesita `pip install`: los scripts Python incluidos generan diagramas HTML interactivos con más de 605 iconos oficiales de Azure, completamente sin conexión. El punto de entrada es [scripts/cli.py](scripts/cli.py), que importa [scripts/generator.py](scripts/generator.py) para generar HTML/SVG y [scripts/icons.py](scripts/icons.py) para los datos de iconos.

## Idioma del contenido dirigido a la persona

Detecta el idioma del primer mensaje de la persona y proporciona en ese idioma toda la salida dirigida a ella: preguntas, actualizaciones de progreso, informes y comentarios Bicep. Las instrucciones de la propia skill siguen el idioma de la edición: inglés en `main` y `develop`, portugués de Brasil en `portugues-br` y español en `espanol`. Adapta los ejemplos, no los copies literalmente.

## Uso de herramientas

| Necesidad | Herramienta | Notas |
|---|---|---|
| Obtener el contenido de una URL | `web_fetch` | Consultas a Microsoft Docs |
| Búsqueda web | `web_search` | Descubrimiento de URL |
| Preguntar a la persona | `ask_user` | `choices` debe ser una matriz de cadenas |
| Subagentes | `task` | explore / task / general-purpose |
| Ejecución de shell | Herramienta de shell | Localiza primero las rutas de `az` / `python` / `bicep` |

> [!NOTE]
> Los subagentes no pueden usar `web_fetch` ni `web_search`. Realiza las comprobaciones de hechos en Microsoft Docs directamente desde el agente principal.

## Localización de rutas

`az`, `python` y `bicep` a menudo no están en `PATH`. Localiza cada uno una vez antes de la fase y conserva el resultado; no repitas la búsqueda en cada llamada y prefiere buscar directamente en el sistema de archivos a usar alias del shell. Consulta la sección de generación de diagramas de [references/phase1-advisor.md](references/phase1-advisor.md) para la ruta de Python y la conexión del motor integrado.

## Actualizaciones de progreso

Informa del progreso mediante líneas de estado breves en el idioma de la persona, no con emojis. Usa una línea por acción:

```text
Acción: motivo
Completado: resultado
Advertencia: detalle que vigilar
Fallo: causa y siguiente paso
```

## Flujo de trabajo

Dos rutas, elegidas automáticamente a partir de la solicitud; si hay ambigüedad, pregunta a la persona cuál desea.

### Ruta A: diseño nuevo

Frases de activación: "crear", "configurar", "desplegar", "construir".

```text
Fase 1 (references/phase1-advisor.md)    Diseño interactivo + diagrama
  -> Fase 2 (references/bicep-generator.md)  Generación de Bicep (fuera del alcance del kit)
  -> Fase 3 (references/bicep-reviewer.md)    Revisión + comprobación de compilación
  -> Fase 4 (references/phase4-deployer.md)    validate -> what-if -> despliegue
```

### Ruta B: analizar y modificar

Frases de activación: "analizar", "recursos actuales", "examinar", "dibujar un diagrama".

```text
Fase 0 (references/phase0-scanner.md)    Análisis de recursos existentes + diagrama
  -> Conversación sobre modificaciones (solicitud de cambio en lenguaje natural)
  -> Fase 1 (references/phase1-advisor.md)   Confirmar cambios + actualizar el diagrama
  -> Fases 2-4 como en la ruta A
```

## Reglas de transición entre fases

- Cada fase sigue las instrucciones de su archivo `references/*.md`.
- Informa siempre a la persona del siguiente paso en cada transición.
- No omitas fases; en particular, nunca omitas what-if entre la fase 3 y la fase 4.
- Para pasar de la fase 1 a la fase 2 se requiere haber generado y mostrado `01_arch_diagram_draft.html`; nunca generes Bicep sin un diagrama confirmado.
- Una modificación posterior al despliegue vuelve a la fase 1, no a la fase 0.

## Cobertura de servicios

Servicios optimizados: Microsoft Foundry, Azure OpenAI, AI Search, ADLS Gen2, Key Vault, Microsoft Fabric, Azure Data Factory, VNet / Private Endpoint y AML / AI Hub. Los demás servicios de Azure se admiten con el mismo nivel de calidad mediante consultas a Microsoft Docs.

| Categoría | Tratamiento | Ejemplos |
|---|---|---|
| Estable | Primero los archivos de referencia | `isHnsEnabled`, conjuntos de tres componentes de puntos de conexión privados |
| Dinámica | Consultar siempre Microsoft Docs | Versión de API, disponibilidad de modelos, SKU, región |

## Archivos de referencia

| Archivo | Función |
|---|---|
| [references/phase0-scanner.md](references/phase0-scanner.md) | Análisis de recursos existentes, deducción de relaciones y diagrama |
| [references/phase1-advisor.md](references/phase1-advisor.md) | Diseño interactivo y comprobación de hechos |
| [references/bicep-generator.md](references/bicep-generator.md) | Reglas de generación de Bicep (fuera del alcance del kit) |
| [references/bicep-reviewer.md](references/bicep-reviewer.md) | Lista de verificación de revisión de código |
| [references/phase4-deployer.md](references/phase4-deployer.md) | validate -> what-if -> despliegue |
| [references/service-gotchas.md](references/service-gotchas.md) | Propiedades obligatorias y correspondencias de puntos de conexión privados |
| [references/azure-dynamic-sources.md](references/azure-dynamic-sources.md) | Registro de URL de Microsoft Docs |
| [references/azure-common-patterns.md](references/azure-common-patterns.md) | Patrones de puntos de conexión privados, seguridad y nomenclatura |
| [references/architecture-guidance-sources.md](references/architecture-guidance-sources.md) | Fuentes de orientación arquitectónica |
| [references/ai-data.md](references/ai-data.md) | Guía de servicios de IA y datos |

Ejemplos de salida: [assets/06-architecture-diagram.png](assets/06-architecture-diagram.png), [assets/07-azure-portal-resources.png](assets/07-azure-portal-resources.png) y [assets/08-deployment-succeeded.png](assets/08-deployment-succeeded.png).

## Plantilla de salida

La skill produce un diagrama HTML interactivo y un resumen del diseño. Registra el diseño adoptado para poder expresarlo en Terraform:

```text
Arquitectura: <nombre>
Ruta: A (diseño nuevo) | B (analizar + modificar)
Diagrama: 01_arch_diagram_draft.html (generado, mostrado a la persona, confirmado)
Servicios: Foundry, AI Search, ADLS Gen2, Key Vault (puntos de conexión privados)
Bicep: generado solo como referencia (fuera del alcance del kit)
Seguimiento del kit: expresar en Terraform bajo infra/ con etiquetas project/environment/owner
```

## Puerta de calidad

- [ ] Se eligió o confirmó con la persona la ruta (A: diseño nuevo; B: analizar y modificar).
- [ ] Se generó un diagrama (`01_arch_diagram_draft.html`) con el motor incluido y se mostró antes de generar Bicep.
- [ ] Las fases se ejecutaron en orden, sin omitir what-if entre la revisión y el despliegue.
- [ ] Los hechos dinámicos (versión de API, SKU, región y disponibilidad de modelos) se confirmaron en Microsoft Docs.
- [ ] La salida dirigida a la persona usó su idioma y la propia primitiva no contiene emojis.
- [ ] Toda arquitectura adoptada se señala para expresarla en Terraform bajo `infra/`, ya que Bicep queda fuera del alcance del kit.
