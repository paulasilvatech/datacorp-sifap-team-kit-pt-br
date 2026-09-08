# Arquitecto de Software — Kit de Copilot

> **Ruta:** [Kit del equipo](../../README.md) › [Personas](../OVERVIEW.md) › **Arquitecto de Software**

**Inventario del kit de Copilot para la persona Arquitecto de Software.** Enumera los artefactos activos, su ubicación dentro de `.github/` y las prácticas recomendadas específicas de este rol.

| Campo | Valor |
|---|---|
| **Público objetivo** | Quien desempeña el rol de Arquitecto de Software en la inmersión |
| **Pareja** | 2 · Arquitectura (con el Arquitecto Empresarial) |
| **Fase del SDLC** | Diseño → Supervisión de la implementación |
| **Prerrequisitos** | Haber leído [PERSONA.md](PERSONA.md) |
| **Resultado esperado** | Kit validado y prompts accesibles en Copilot Chat |

> [!IMPORTANT]
> Lee [PERSONA.md](PERSONA.md) antes de continuar. El perfil explica la misión, la transición y las rúbricas de evaluación.

---

## Concepto

El Arquitecto de Software es responsable de la estructura interna del sistema. Este rol define cómo se organizan los módulos, dónde empiezan y terminan los contextos delimitados (límites del diseño guiado por el dominio) y qué abstracciones se exponen. En SIFAP (Sistema de Fiscalización y Administración de Pagos), este rol elabora el plan técnico que seguirá el equipo de implementación: `CODEMAP.md`, la estructura de paquetes y los ADR de diseño interno.

---

## Kit de la persona

| **Artefacto** | Tipo | Propósito |
|---|---|---|
| `PERSONA.md` | Perfil | Responsabilidades, transición, prompts y rúbrica |
| `.github/agents/software-architect.agent.md` | Agente | Arquitectura de software |
| `.github/prompts/persona-software-architect-codemap.prompt.md` | Prompt | `/codemap` |
| `.github/prompts/persona-software-architect-impl-plan.prompt.md` | Prompt | `/impl-plan` |
| `.github/prompts/persona-software-architect-api-validate.prompt.md` | Prompt | `/api-validate` |
| `.github/instructions/backend.instructions.md` | Instrucciones | Convenciones de backend |
| `.github/instructions/frontend.instructions.md` | Instrucciones | Convenciones de frontend |

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

- Prefiere la composición a la herencia, los límites claros a las abstracciones genéricas y los datos claros al código ingenioso.
- Los contratos de API son un compromiso público; rómpelos solo con versionado y una guía de migración.
- Mantén las reglas de negocio fuera de la base de datos y del framework.
- Un directorio `util` que crece suele indicar que falta un contexto delimitado.

---

## Referencias

- [Arquitectura limpia — Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Diseño guiado por el dominio — Eric Evans](https://www.domainlanguage.com/ddd/)
- [Arquitectura hexagonal — Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Guías de arquitectura de Microsoft .NET](https://learn.microsoft.com/dotnet/architecture/)

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [DESCRIPCIÓN GENERAL](../OVERVIEW.md)<br/><sub>Tabla de las 10 personas.</sub> | [PERSONA.md](PERSONA.md)<br/><sub>Perfil de esta persona.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
