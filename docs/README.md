# Documentación

> **Ruta:** [Kit del equipo](../README.md) › **Documentación**

**Idioma:** español (`espanol`). Usa el [selector de idiomas](../README.md#idiomas-del-repositorio) para consultar también las ediciones en inglés (`main`) y portugués de Brasil (`portugues-br`), junto con las instrucciones de Copilot específicas de cada rama.

**Índice de la documentación transversal de la inmersión** — recursos que se usan en cualquier etapa del día.

| Campo | Valor |
|---|---|
| **Público objetivo** | Todo el equipo, especialmente el Redactor Técnico y el Líder Técnico |
| **Prerrequisitos** | Leer [`00-TEAM-FLOW.md`](../00-TEAM-FLOW.md) |
| **Tiempo estimado** | 5 min |
| **Resultado esperado** | Saber dónde encontrar cada recurso transversal |

---

## Cómo usar esta carpeta

- [ ] **Antes de empezar el día** — lee [sdlc-flow-guide.md](sdlc-flow-guide.md) para comprender el mapa completo.
- [ ] **Al elegir tus personas** — lee [persona-agent-matrix.md](persona-agent-matrix.md) para saber cuándo lideras, apoyas u observas.
- [ ] **Durante la Etapa 1** — actualiza el [glosario de la Etapa 1](../01-archaeology/glossary.md) y registra términos con una fuente del legado.
- [ ] **Para cada decisión técnica** — crea un ADR en [adr/](adr/).
- [ ] **Al final del día** — revisa [runbook.md](runbook.md) para que otra persona pueda ejecutar y operar el sistema.

## Estructura

| Ruta | Propósito |
|---|---|
| [`adr/`](adr/) | Registros de decisiones de arquitectura (un archivo por decisión) |
| [`../01-archaeology/glossary.md`](../01-archaeology/glossary.md) | Glosario del dominio — se completa durante la Etapa 1 |
| [`legacy-system-access.md`](legacy-system-access.md) | Acceso de solo observación al sistema Natural/Adabas compartido |
| [`4-agents-explained.md`](4-agents-explained.md) | Explicación de los cuatro agentes de etapa y su relación con los kits de personas |
| [`persona-agent-matrix.md`](persona-agent-matrix.md) | Matriz que muestra quién lidera, apoya u observa en cada etapa |
| [`sdlc-flow-guide.md`](sdlc-flow-guide.md) | Flujo completo del día, transiciones y entregables |
| `api.md` _(creado por el equipo)_ | Descripción general de OpenAPI y resumen de endpoints |
| [`runbook.md`](runbook.md) | Cómo ejecutar el sistema localmente, en CI y en Azure |

## Convenciones

- Usa un ADR por decisión. Numéralos secuencialmente: `0001-title.md`, `0002-title.md`.
- Mantén los términos del glosario en orden alfabético, con citas del programa heredado del que proviene cada término.
- Cada README de una subcarpeta sigue [`.github/copilot-instructions.md`](../.github/copilot-instructions.md).
- Cada decisión importante se convierte en un ADR. Una conversación de chat no es un registro suficiente.
- Cada término del glosario que provenga del sistema heredado necesita una fuente (`.NSN`, `.ddm` o documento histórico).

## Definición de terminado de la documentación

- [ ] El glosario incluye fuentes del legado.
- [ ] Los ADR incluyen contexto, opciones, decisión y consecuencias.
- [ ] El runbook incluye comandos de ejecución, validación y solución de problemas.
- [ ] Los enlaces internos apuntan a los archivos correctos.
- [ ] Los documentos explican el motivo antes del procedimiento.

## Enlaces rápidos

- [Flujo del equipo](../00-TEAM-FLOW.md)
- [Kits de personas consolidados](../05-personas/) — lee `PERSONA.md` dentro del kit de tu rol
- [Guías de etapa](../01-archaeology/GUIDE.md)

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Fichas de referencia](../09-cheat-sheets/README.md)<br/><sub>Tres fichas de una página: Copilot, Spec-Kit y modelos.</sub> | [Glosario visual](../07-concepts/03-visual-glossary.md)<br/><sub>Más de 30 términos técnicos del dominio SIFAP.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
