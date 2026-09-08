# Responsable de Producto — Kit de Copilot

> **Ruta:** [Kit del equipo](../../README.md) › [Personas](../OVERVIEW.md) › **Responsable de Producto**

**Inventario del kit de Copilot para la persona Responsable de Producto.** Enumera los artefactos activos, su ubicación dentro de `.github/` y las prácticas recomendadas específicas de este rol.

| Campo | Valor |
|---|---|
| **Público objetivo** | Quien desempeña el rol de Responsable de Producto en la inmersión |
| **Pareja** | 1 · Visión (con el Especialista en Requisitos) |
| **Fase del SDLC** | Descubrimiento → Especificación → Aceptación |
| **Prerrequisitos** | Haber leído [PERSONA.md](PERSONA.md) |
| **Resultado esperado** | Kit validado y prompts accesibles en Copilot Chat |

> [!IMPORTANT]
> Lee [PERSONA.md](PERSONA.md) antes de continuar. El perfil explica la misión, la transición y las rúbricas de evaluación.

---

## Concepto

El Responsable de Producto se encarga de traducir las necesidades de negocio en un alcance ejecutable. En un proceso de modernización de legado como SIFAP (Sistema de Fiscalización y Administración de Pagos), esta función es fundamental: los sistemas heredados acumulan reglas implícitas que solo tienen sentido cuando alguien conoce el "porqué" de su existencia. El PO conecta cada decisión técnica con evidencia de negocio.

---

## Kit de la persona

| **Artefacto** | Tipo | Propósito |
|---|---|---|
| `PERSONA.md` | Perfil | Responsabilidades, transición, prompts y rúbrica |
| `.github/agents/product-owner.agent.md` | Agente | Asistente del Responsable de Producto para especificación, backlog y aceptación |
| `.github/prompts/persona-product-owner-spec.prompt.md` | Prompt | `/spec` — escribe una sección de `specs/<NNN>-<feature>/spec.md` a partir de historias de usuario en EARS |
| `.github/prompts/persona-product-owner-update-spec.prompt.md` | Prompt | `/update-spec` — actualiza la especificación cuando cambia una funcionalidad |
| `.github/prompts/persona-product-owner-acceptance-check.prompt.md` | Prompt | `/acceptance-check` — comprueba si el código cumple los criterios de aceptación |
| `mcp.json` | MCP | Manifiesto de servidores GitHub + elementos de trabajo de Azure DevOps |

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

- Escribe los requisitos en EARS para que cada frase pueda probarse.
- Mantén cada historia de usuario vinculada a un resultado medible.
- Marca las suposiciones explícitamente: una suposición oculta se convierte en un error en producción.
- Trata `.specify/memory/constitution.md` como la fuente de verdad para los aspectos no negociables.

---

## Referencias

- [Notación EARS — Alistair Mavin](https://alistairmavin.com/ears/)
- [Desarrollo guiado por especificaciones (Spec-Kit)](https://github.com/github/spec-kit)
- [Mapeo de historias de usuario — Jeff Patton](https://www.jpattonassociates.com/user-story-mapping/)
- [GitHub Copilot para PM](https://docs.github.com/en/copilot)

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [DESCRIPCIÓN GENERAL](../OVERVIEW.md)<br/><sub>Tabla de las 10 personas.</sub> | [PERSONA.md](PERSONA.md)<br/><sub>Perfil de esta persona.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
