# Arquitecto Empresarial — Kit de Copilot

> **Ruta:** [Kit del equipo](../../README.md) › [Personas](../OVERVIEW.md) › **Arquitecto Empresarial**

**Inventario del kit de Copilot para la persona Arquitecto Empresarial.** Enumera los artefactos activos, su ubicación dentro de `.github/` y las prácticas recomendadas específicas de este rol.

| Campo | Valor |
|---|---|
| **Público objetivo** | Quien desempeña el rol de Arquitecto Empresarial en la inmersión |
| **Pareja** | 2 · Arquitectura (con el Arquitecto de Software) |
| **Fase del SDLC** | Arquitectura → Diseño → Seguridad |
| **Prerrequisitos** | Haber leído [PERSONA.md](PERSONA.md) |
| **Resultado esperado** | Kit validado y prompts accesibles en Copilot Chat |

> [!IMPORTANT]
> Lee [PERSONA.md](PERSONA.md) antes de continuar. El perfil explica la misión, la transición y las rúbricas de evaluación.

---

## Concepto

El Arquitecto Empresarial contempla el sistema dentro de su ecosistema. En SIFAP (Sistema de Fiscalización y Administración de Pagos), esto significa mapear dependencias externas —SIAFI, Banco do Brasil, INCRA, MDA— y garantizar que la arquitectura de destino respete los contratos existentes. El EA sabe dónde están los contratos, cuáles son frágiles y cuáles pueden cambiarse sin desencadenar una cadena de efectos imprevistos.

---

## Kit de la persona

| **Artefacto** | Tipo | Propósito |
|---|---|---|
| `PERSONA.md` | Perfil | Responsabilidades, transición, prompts y rúbrica |
| `.github/agents/enterprise-architect.agent.md` | Agente | Arquitectura y seguridad |
| `.github/prompts/persona-enterprise-architect-create-constitution.prompt.md` | Prompt | `/create-constitution` |
| `.github/prompts/persona-enterprise-architect-create-adr.prompt.md` | Prompt | `/create-adr` |
| `.github/prompts/persona-enterprise-architect-architecture-review.prompt.md` | Prompt | `/architecture-review` |
| `.github/instructions/security.instructions.md` | Instrucciones | Convenciones de seguridad |
| `.github/instructions/infrastructure.instructions.md` | Instrucciones | Convenciones de IaC |
| `hooks.json` | Hooks | Bloqueos de edición de `.specify/memory/constitution.md` |

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

- Usa C4 L1/L2 para la visión ejecutiva y L3/L4 para la implementación.
- Cada decisión de arquitectura necesita un ADR con contexto, decisión y consecuencias.
- Prefiere una arquitectura predecible y operable en producción.
- Usa los pilares de Azure Well-Architected como puertas de revisión, no como una lista de verificación tardía.

---

## Referencias

- [Modelo C4 — Simon Brown](https://c4model.com/)
- [Microsoft Azure Well-Architected Framework](https://learn.microsoft.com/azure/well-architected/)
- [Registros de decisiones de arquitectura](https://adr.github.io/)
- [Centro de arquitectura de Azure](https://learn.microsoft.com/azure/architecture/)

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [DESCRIPCIÓN GENERAL](../OVERVIEW.md)<br/><sub>Tabla de las 10 personas.</sub> | [PERSONA.md](PERSONA.md)<br/><sub>Perfil de esta persona.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
