# frontend-web-dev

Agente de frontend React y habilidad de generación de pruebas con Playwright.

## Qué incluye este complemento

| Componente | Tipo | Ubicación |
|-----------|------|----------|
| `expert-react-frontend-engineer` | Agente | [`.github/agents/expert-react-frontend-engineer.agent.md`](../../agents/expert-react-frontend-engineer.agent.md) |
| `playwright-generate-test` | Habilidad | [`.github/skills/playwright-generate-test/`](../../skills/playwright-generate-test/) |

## Referencias del proyecto de origen no incluidas

- `playwright-explore-website` (habilidad): no está presente en este kit.
- `electron-angular-native` (agente): no está presente en este kit.

## Cómo se habilita

Copilot descubre de forma nativa el contenido de `.github/skills/` y `.github/agents/`
en este repositorio, por lo que estos componentes funcionan aquí sin instalar
ningún complemento. La capa de complementos los agrupa en un paquete con nombre dentro del
catálogo local `datacorp-mm-team-kit` ([`marketplace.json`](../marketplace.json))
y se declara en
[`.github/copilot/settings.json`](../../copilot/settings.json). Consulta el
[índice de complementos](../README.md) para conocer el mecanismo y sus limitaciones.
