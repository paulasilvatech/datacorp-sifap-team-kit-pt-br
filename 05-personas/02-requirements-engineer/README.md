# Especialista en Requisitos — Kit de Copilot

> **Ruta:** [Kit del equipo](../../README.md) › [Personas](../OVERVIEW.md) › **Especialista en Requisitos**

**Inventario del kit de Copilot para la persona Especialista en Requisitos.** Enumera los artefactos activos, su ubicación dentro de `.github/` y las prácticas recomendadas específicas de este rol.

| Campo | Valor |
|---|---|
| **Público objetivo** | Quien desempeña el rol de Especialista en Requisitos en la inmersión |
| **Pareja** | 1 · Visión (con el Responsable de Producto) |
| **Fase del SDLC** | Requisitos → Especificación |
| **Prerrequisitos** | Haber leído [PERSONA.md](PERSONA.md) |
| **Resultado esperado** | Kit validado y prompts accesibles en Copilot Chat |

> [!IMPORTANT]
> Lee [PERSONA.md](PERSONA.md) antes de continuar. El perfil explica la misión, la transición y las rúbricas de evaluación.

---

## Concepto

El Especialista en Requisitos se encarga de transformar conversaciones y descubrimientos en requisitos formales y comprobables. En SIFAP (Sistema de Fiscalización y Administración de Pagos), las reglas de negocio están codificadas de forma tácita en Natural, sin documentación actualizada. El RE extrae esas reglas, las estructura con EARS (Easy Approach to Requirements Syntax) y garantiza la trazabilidad del sistema heredado al requisito moderno.

---

## Kit de la persona

| **Artefacto** | Tipo | Propósito |
|---|---|---|
| `PERSONA.md` | Perfil | Responsabilidades, transición, prompts y rúbrica |
| `.github/agents/requirements-engineer.agent.md` | Agente | Análisis de requisitos |
| `.github/prompts/persona-requirements-engineer-spec-sync.prompt.md` | Prompt | `/spec-sync` |
| `.github/prompts/persona-requirements-engineer-contradiction-check.prompt.md` | Prompt | `/contradiction-check` |
| `.github/prompts/persona-requirements-engineer-ears-convert.prompt.md` | Prompt | `/ears-convert` |
| `.github/instructions/requirements.instructions.md` | Instrucciones | Convenciones de documentación de requisitos |

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

- Usa exclusivamente patrones EARS; los requisitos vagos deben cuantificarse.
- Cada `REQ-ID` debe ser único, inmutable y trazable al menos a una prueba y una tarea.
- Realiza una revisión de contradicciones antes de aceptar nuevas especificaciones.
- Elimina o cuantifica términos ambiguos como "adecuado", "razonable" y "fácil de usar".

---

## Referencias

- [Notación EARS — Alistair Mavin](https://alistairmavin.com/ears/)
- [IEEE 29148 — Ingeniería de requisitos](https://www.iso.org/standard/72089.html)
- [ISO/IEC 25010 — Modelo de calidad](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010)
- [Cómo escribir buenos requisitos — INCOSE](https://www.incose.org/)

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [DESCRIPCIÓN GENERAL](../OVERVIEW.md)<br/><sub>Tabla de las 10 personas.</sub> | [PERSONA.md](PERSONA.md)<br/><sub>Perfil de esta persona.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
