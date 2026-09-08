# Redactor Técnico — Kit de Copilot

> **Ruta:** [Kit del equipo](../../README.md) › [Personas](../OVERVIEW.md) › **Redactor Técnico**

**Kit de referencia para la persona Redactor Técnico en la inmersión de modernización de SIFAP.**

![Persona](https://img.shields.io/badge/Persona-Tech%20Writer-171717?style=flat-square) ![Pareja 5](https://img.shields.io/badge/Par-5%20%C2%B7%20Opera%C3%A7%C3%B5es-404040?style=flat-square) ![Transversal](https://img.shields.io/badge/Atua%C3%A7%C3%A3o-Transversal-737373?style=flat-square)

| Campo | Valor |
|---|---|
| **Público objetivo** | Quien asume la persona Redactor Técnico en la inmersión |
| **Enfoque** | Documentación de API, evolución del README, `CODEMAP.md`, ADR, registro de cambios y detección de desalineaciones |
| **Fase del SDLC** | Transversal a todas las etapas; lidera la Etapa 4 — Evolución (informe del agente) |
| **Resultado esperado** | README completo, ADR formalizados, glosario coherente e informe honesto de la Etapa 4 |

Lee primero: [PERSONA.md](PERSONA.md).

---

## Concepto

El Redactor Técnico transforma las decisiones y el código en la memoria duradera del proyecto. En la modernización de SIFAP (Sistema de Fiscalización y Administración de Pagos), esta persona mantiene el glosario de términos del legado Natural/Adabas, formaliza las decisiones de arquitectura como ADR (registros de decisiones de arquitectura) y garantiza que el README refleje el estado real de la aplicación en cada hora de la inmersión, no solo al final.

Por qué importa: sin una documentación deliberada, los ADR permanecen vacíos, el README sigue en "TODO: añadir instrucciones" y el conocimiento descubierto durante la inmersión desaparece después. El Redactor Técnico hace trazable el aprendizaje del equipo.

## Kit de la persona

Todos los artefactos activos residen en el directorio `.github/` de la raíz del repositorio. Esta carpeta es una referencia; edita los archivos de `.github/` cuando necesiten mantenimiento.

| Archivo | Tipo | Propósito |
|---|---|---|
| `PERSONA.md` | Perfil | Responsabilidades, etapas, prompts y rúbricas del Redactor Técnico |
| `.github/agents/tech-writer.agent.md` | Agente | Documentación de API, README, `CODEMAP.md`, registro de cambios y detección de desalineaciones |
| `.github/prompts/persona-tech-writer-generate-docs.prompt.md` | Prompt | `/generate-docs` |
| `.github/prompts/persona-tech-writer-update-codemap.prompt.md` | Prompt | `/update-codemap` |
| `.github/prompts/persona-tech-writer-doc-drift.prompt.md` | Prompt | `/doc-drift` |

> [!TIP]
> Si la persona facilitadora solicita una configuración MCP local y este kit tiene `mcp.json`, copia solo ese archivo a `.vscode/mcp.json`.

## Dónde residen los artefactos activos

- Agentes: `.github/agents/`
- Prompts: `.github/prompts/persona-*.prompt.md`
- Skills: `.github/skills/`
- Instrucciones: `.github/instructions/`

## Prácticas recomendadas

- [ ] **Trata la documentación como una funcionalidad.** Entrégala, versiónala y revísala junto con el código, no después.
- [ ] **Empieza por la respuesta y después aporta contexto.** Escribe para alguien que dispone de 30 segundos.
- [ ] **Usa Mermaid para los diagramas.** Los diagramas como código evolucionan junto con el sistema.
- [ ] **Incluye verificaciones de desalineación en la CI.** La documentación desactualizada es peor que no tenerla.

## Ejemplo de SIFAP

En la Etapa 1, el Redactor Técnico documenta `MU` (campo multivalor), `PE` (campo periódico) y `FDT` (tabla de definición de archivos) en el glosario para que todo el equipo use una terminología coherente. En la Etapa 3, actualiza `README.md` con los endpoints reales creados por el Desarrollador (`POST /api/v1/beneficios`, `GET /api/v1/fiscalizacoes/{id}`) y los comandos para iniciar el entorno local. En la Etapa 4, sigue al agente y escribe `agent-experience-report.md` en tiempo real.

## Referencias

- [Marco Diátaxis](https://diataxis.fr/)
- [Guía de estilo de documentación para desarrolladores de Google](https://developers.google.com/style)
- [Write the Docs](https://www.writethedocs.org/)
- [Mermaid — Diagramas como código](https://mermaid.js.org/)

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Descripción general de las personas](../OVERVIEW.md)<br/><sub>Tabla de las 10 personas y sus parejas.</sub> | [PERSONA.md](PERSONA.md)<br/><sub>Perfil completo de la persona Redactor Técnico.</sub> |

<sub>[Volver al índice del kit](../../README.md)</sub>
