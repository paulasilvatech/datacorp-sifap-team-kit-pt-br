# Líder Técnico — Kit de Copilot

> **Ruta:** [Kit del equipo](../../README.md) › [Personas](../OVERVIEW.md) › **Líder Técnico**

**Inventario del kit de Copilot para la persona Líder Técnico.** Enumera los artefactos activos, su ubicación dentro de `.github/` y las prácticas recomendadas específicas de este rol.

| Campo | Valor |
|---|---|
| **Público objetivo** | Quien desempeña el rol de Líder Técnico en la inmersión |
| **Pareja** | 3 · Implementación (con el Desarrollador) |
| **Fase del SDLC** | Todas las fases (coordinación técnica) |
| **Prerrequisitos** | Haber leído [PERSONA.md](PERSONA.md) |
| **Resultado esperado** | Kit validado y prompts accesibles en Copilot Chat |

> [!IMPORTANT]
> Lee [PERSONA.md](PERSONA.md) antes de continuar. El perfil explica la misión, la transición y las rúbricas de evaluación.

---

## Concepto

El Líder Técnico conecta la arquitectura con el código del día a día. Este rol define los estándares de implementación, desbloquea al equipo cuando alguien se atasca en un detalle técnico y garantiza que la aplicación creada por el equipo realmente funcione de extremo a extremo al finalizar la Etapa 3. En SIFAP (Sistema de Fiscalización y Administración de Pagos), el TL mantiene la velocidad de ejecución sin comprometer la calidad al elegir qué dificultades técnicas vale la pena abordar.

---

## Kit de la persona

| **Artefacto** | Tipo | Propósito |
|---|---|---|
| `PERSONA.md` | Perfil | Responsabilidades, transición, prompts y rúbrica |
| `.github/agents/tech-lead.agent.md` | Agente | Gobernanza técnica |
| `.github/prompts/persona-technical-lead-setup-project.prompt.md` | Prompt | `/setup-project` |
| `.github/prompts/persona-technical-lead-routing-table.prompt.md` | Prompt | `/routing-table` |
| `.github/prompts/persona-technical-lead-audit-context.prompt.md` | Prompt | `/audit-context` |
| `hooks.json` | Hooks | Alcance, lint y pruebas |

---

## Dónde residen los artefactos

Los artefactos activos están consolidados en el directorio `.github/` de la raíz:

| **Tipo** | Ruta |
|---|---|
| Agentes | `.github/agents/` |
| Prompts | `.github/prompts/persona-*.prompt.md` |
| Skills | `.github/skills/` |
| Instrucciones | `.github/instructions/` |

Usa este directorio como referencia. Los archivos activos residen solo en el directorio `.github/` de la raíz; edítalos allí cuando necesiten mantenimiento.

Si el kit incluye `mcp.json` y la persona facilitadora solicita MCP local, copia solo ese archivo a `.vscode/mcp.json`.

---

## Prácticas recomendadas

- Bloquea los cambios deficientes, no a las personas; revisa la PR y protege el tiempo de quienes revisan.
- `CODEMAP.md` es la memoria de trabajo del equipo; si está desactualizado, el equipo trabaja sin visibilidad.
- La selección de modelos importa: Opus para descubrimiento, Sonnet para implementación y Haiku para transformaciones mecánicas.
- El costo por funcionalidad es una métrica de ingeniería; hazle seguimiento junto con la cobertura.

---

## Referencias

- [Staff Engineer — Will Larson](https://staffeng.com/)
- [The Manager's Path — Camille Fournier](https://www.oreilly.com/library/view/the-managers-path/9781491973882/)
- [Accelerate — Forsgren, Humble, Kim](https://itrevolution.com/product/accelerate/)
- [Prácticas recomendadas de GitHub Copilot](https://docs.github.com/en/copilot)

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [DESCRIPCIÓN GENERAL](../OVERVIEW.md)<br/><sub>Tabla de las 10 personas.</sub> | [PERSONA.md](PERSONA.md)<br/><sub>Perfil de esta persona.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
