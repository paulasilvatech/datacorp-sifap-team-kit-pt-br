---
name: "code-modernization"
description: "Úsala para modernizar un sistema legado con un flujo de trabajo disciplinado que preserve su comportamiento. Los desencadenantes incluyen \"modernizar\", \"código legado\", \"COBOL\", \"extracción de reglas de negocio\" y \"reescritura con preservación del comportamiento\"."
---
# Modernización de código

Usa esta skill para guiar la modernización de sistemas legados preservando su comportamiento. El flujo se divide deliberadamente en etapas para que el equipo comprenda el sistema antes de transformarlo.

## Cuándo invocar

- "Planifica la modernización de este módulo legado."
- "Evalúa esta base de código antes de que reescribamos nada."
- "Extrae las reglas de negocio ocultas en este programa."
- "Transforma este módulo preservando su comportamiento."

## Flujo de trabajo

1. **Delimitar**: define qué se moderniza, por qué ahora, las restricciones, los objetivos excluidos y los criterios de éxito.
2. **Evaluar**: inventaría lenguajes, módulos, integraciones, compilación, cobertura de pruebas, complejidad y riesgos.
3. **Extraer reglas**: convierte la lógica procedimental oculta en fichas de reglas de negocio con evidencia de la fuente.
4. **Mapear**: relaciona los módulos legados con los dominios, paquetes y servicios de destino, y con la secuencia de migración.
5. **Reimaginar**: diseña la API, el modelo de datos, el entorno de ejecución y el modelo operativo de destino.
6. **Transformar**: reescribe módulo por módulo en `backend/` y `frontend/`, con pruebas que fijen el comportamiento legado.
7. **Fortalecer**: revisa la seguridad, las pruebas, la gestión de errores, la observabilidad y la preparación para el despliegue.

## Primitivas de GitHub Copilot

| Necesidad | Primitiva |
| --- | --- |
| Exploración profunda del legado | Agente [`@archaeologist`](../../agents/archaeologist.agent.md) (etapa 1) |
| Extracción de reglas de negocio | Prompt [`/extract-business-rules`](../../prompts/stage-archaeologist-extract-business-rules.prompt.md) |
| Diseño de destino y ADR | Agente [`@architect`](../../agents/architect.agent.md) (etapa 2) |
| Traducción de módulos y pruebas | Agente [`@builder`](../../agents/builder.agent.md) (etapa 3) |
| Fortalecimiento de la seguridad y la entrega | Agente [`@evolution`](../../agents/evolution.agent.md) (etapa 4) |
| Lectura segura del código legado | Instrucciones [`natural-adabas`](../../instructions/natural-adabas.instructions.md) |

## Contrato de carpetas

- `01-archaeology/legacy-sifap/**`: evidencia del código fuente legado y su comportamiento. Solo lectura.
- `01-archaeology/**` y `specs/<NNN>-<feature>/`: resúmenes de alcance, evaluaciones, mapas, catálogos de reglas, especificaciones EARS e informes.
- `backend/**` y `frontend/**`: implementación transformada o de reemplazo y sus pruebas.

## Reglas

- No transformes código antes de evaluar y extraer las reglas de negocio.
- Cita los archivos fuente que respaldan los hallazgos. Si no dispones de números de línea, cita el archivo y explica el motivo.
- Distingue el comportamiento observado de la intención deducida.
- Prefiere varios artefactos enfocados a un único informe demasiado extenso.
- Usa pruebas de caracterización para preservar el comportamiento legado antes de introducir cambios intencionales de comportamiento.
- No inventes métricas de complejidad, costo, tiempo de ejecución o riesgo. Usa valores medidos o declara las suposiciones.

## Validación

- Ejecuta las herramientas de inventario disponibles, como `scc`, `cloc` o analizadores específicos del lenguaje, si existen.
- Ejecuta las suites de pruebas disponibles antes y después de la transformación.
- Para los módulos transformados, aporta evidencia de que las pruebas comparan o fijan el comportamiento legado.
- Para el fortalecimiento, informa de los hallazgos por gravedad y con medidas de corrección concretas.

## Plantilla de salida

Registra cada módulo modernizado como una nota de evaluación en `01-archaeology/`, enlazada a su destino en `backend/` o `frontend/`:

```markdown
## Registro de modernización - <módulo legado>

| Campo | Valor |
|---|---|
| Fuente legada | 01-archaeology/legacy-sifap/natural-programs/<FILE>.NSN |
| Módulo de destino | backend/src/main/java/<package>/ |
| Etapa alcanzada | Delimitar / Evaluar / Extraer / Mapear / Reimaginar / Transformar / Fortalecer |
| Evidencia del comportamiento | <ruta de la prueba de caracterización> |
| Trazabilidad a | REQ-NNN |

### Comportamiento observado
- <hecho extraído del código legado, con evidencia en formato ruta:línea>

### Preguntas abiertas
- <incógnita que necesita validación humana>
```

## Puerta de calidad

- [ ] La evaluación y la extracción de reglas de negocio se completan antes de cualquier transformación.
- [ ] Cada hallazgo cita un archivo fuente legado, con números de línea cuando estén disponibles.
- [ ] El comportamiento observado se distingue de la intención deducida.
- [ ] Las pruebas de caracterización fijan el comportamiento legado antes de los cambios intencionales.
- [ ] No hay métricas inventadas de complejidad, costo, tiempo de ejecución o riesgo; los valores se miden o se señalan como suposiciones.
