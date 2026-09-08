# ADR-0001: fuente única de verdad para las instrucciones de agentes (sin AGENTS.md en la raíz)

> **Ruta:** [Kit del equipo](../../README.md) › [Documentación](../README.md) › [ADR](README.md) › **ADR-0001**

| Campo | Valor |
|---|---|
| **Estado** | accepted |
| **Fecha** | 2026-08-17 |
| **Autores** | Auditoría del entorno de soporte |
| **Sustituye a** | N/A |

---

## Contexto

GitHub Copilot lee varios tipos de archivos de instrucciones personalizadas. Este repositorio ya incluye `.github/copilot-instructions.md` (para todo el repositorio) y los archivos `.github/instructions/*.instructions.md`, delimitados por ruta. **No** tiene un `AGENTS.md` en la raíz y surgió la duda de si debía añadir uno, porque tanto la convención abierta [agents.md](https://agents.md/) como Copilot CLI leen `AGENTS.md`.

El riesgo que debe evaluarse es la desalineación. Un segundo archivo de instrucciones para todo el repositorio puede divergir silenciosamente del primero, de modo que los agentes reciban indicaciones contradictorias según el archivo que cargue cada interfaz. Por ello, este kit aplica la regla de las indicaciones mínimas útiles: actualizar la fuente de verdad existente en lugar de añadir instrucciones duplicadas para todo el repositorio.

Dos hechos resuelven la decisión.

**1. Cobertura de interfaces — `AGENTS.md` no amplía el alcance aquí.** Toda interfaz de Copilot que lee `AGENTS.md` también lee `.github/copilot-instructions.md`:

| Interfaz | Lee `.github/copilot-instructions.md` | Lee `AGENTS.md` |
|---|---|---|
| Copilot CLI (herramienta opcional de terminal de este repositorio) | Sí | Sí |
| VS Code — Copilot Chat | Sí | Sí |
| VS Code — agente en la nube / revisión de código | Sí | Sí |
| GitHub.com — agente en la nube | Sí | Sí |
| GitHub.com — revisión de código | Sí | Sí |
| GitHub.com — Copilot Chat | Sí | No |

La propia salida de `/help` de Copilot CLI enumera tanto `AGENTS.md` como `.github/copilot-instructions.md` entre las ubicaciones que respeta. Copilot Chat de GitHub.com lee `.github/copilot-instructions.md`, pero **no** `AGENTS.md`, por lo que el archivo para todo el repositorio es el único respetado por todas las interfaces.

**2. Precedencia — el archivo para todo el repositorio ya tiene prioridad sobre `AGENTS.md`.** Cuando se aplica más de un archivo, todos se proporcionan a Copilot, pero, en caso de conflicto, el orden es (de mayor a menor prioridad): personal → específico de ruta `.github/instructions/**` → **para todo el repositorio `.github/copilot-instructions.md`** → **de agente `AGENTS.md`** → organización. Por tanto, un nuevo `AGENTS.md` nunca podría prevalecer en una discrepancia con el archivo existente; solo podría divergir de él. Se admiten archivos `AGENTS.md` anidados (prevalece el más cercano en el árbol), lo que multiplicaría los puntos susceptibles de desalineación en lugar de reducirlos.

## Decisión

**No** añadiremos un `AGENTS.md` en la raíz (ni `CLAUDE.md` / `GEMINI.md`). `.github/copilot-instructions.md` sigue siendo la fuente única de verdad para las instrucciones de agentes de todo el repositorio, complementada por `.github/instructions/*.instructions.md`, delimitadas por ruta. La sección "Reglas estrictas" de `.github/copilot-instructions.md` ahora prohíbe añadir un archivo de instrucciones competidor en la raíz, de modo que la regla se aplica justo donde un colaborador podría infringirla.

## Alternativas consideradas

| Alternativa | Por qué se rechazó |
|---|---|
| Añadir un `AGENTS.md` completo que replique las instrucciones | Duplicación pura de un archivo que ya leen todas las interfaces; dos fuentes de verdad para todo el repositorio divergen: exactamente la regresión que esta auditoría busca prevenir. |
| Añadir un `AGENTS.md` mínimo que solo apunte a `.github/copilot-instructions.md` | Añade un archivo que mantener a cambio de un beneficio casi nulo: toda interfaz que lo lee ya lee el destino, y el repositorio prohíbe los asistentes distintos de Copilot, eliminando el valor entre herramientas que constituye la principal ventaja de `AGENTS.md`. Sigue siendo un enlace que puede quedar obsoleto. |

## Consecuencias

- **Más fácil:** un solo lugar que editar; sin conciliación entre dos archivos para todo el repositorio; ninguna interfaz recibe indicaciones contradictorias.
- **Más difícil:** un colaborador que espere encontrar `AGENTS.md` debe aprender la convención. Se mitiga con la regla estricta explícita y este ADR.
- **Riesgos:** si GitHub convierte en el futuro `AGENTS.md` en el único archivo que lea una interfaz obligatoria, habrá que reconsiderar esta decisión.
- **Mitigaciones:** la regla estricta enlaza aquí; la verificación de desalineación de primitivas de Copilot (`.github/scripts/validate-copilot-primitives.py`, con seguimiento separado) es el lugar natural para comprobar que "no exista un `AGENTS.md` ajeno en la raíz" si más adelante se desea imponerlo activamente.

## Relaciones

- REQ-ID: N/A
- ADR: N/A
- Archivos de instrucciones: `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`

## Referencias

- Documentación de GitHub — Acerca de la personalización de respuestas de GitHub Copilot (precedencia de instrucciones personalizadas): <https://docs.github.com/en/copilot/concepts/response-customization>
- Documentación de GitHub — Compatibilidad con distintos tipos de instrucciones personalizadas (qué archivo lee cada interfaz): <https://docs.github.com/en/copilot/reference/custom-instructions-support>
- Documentación de GitHub — Añadir instrucciones personalizadas al repositorio (`AGENTS.md` anidados, prevalece el más cercano): <https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions>
- Convención abierta agents.md: <https://agents.md/>

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [ADR — Índice](README.md)<br/><sub>Índice de decisiones registradas.</sub> | [Documentación](../README.md)<br/><sub>Índice de recursos transversales del kit.</sub> |

<sub>[Volver al índice del kit](../../README.md)</sub>
