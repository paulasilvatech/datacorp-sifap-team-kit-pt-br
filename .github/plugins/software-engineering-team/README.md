# software-engineering-team

Agente de diseño UX/UI del conjunto de agentes del equipo de ingeniería de software.

## Qué incluye este complemento

| Componente | Tipo | Ubicación |
|-----------|------|----------|
| `se-ux-ui-designer` | Agente | [`.github/agents/se-ux-ui-designer.agent.md`](../../agents/se-ux-ui-designer.agent.md) |

## Contenido relacionado del kit

La inmersión distribuye sus propios agentes de persona y de etapa en
[`.github/agents/`](../../agents/) (por ejemplo, `software-architect`,
`product-owner`, `tech-writer`, `qa-engineer`). Cubren las funciones que desempeñaban
los agentes `se-*` del proyecto de origen, por lo que dichos agentes no se presentan
aquí como sustitutos.

## Referencias del proyecto de origen no incluidas

- `se-gitops-ci-specialist`, `se-product-manager-advisor`,
  `se-responsible-ai-code`, `se-security-reviewer`,
  `se-system-architecture-reviewer`, `se-technical-writer` (agentes): no
  están presentes en este kit.

## Cómo se habilita

Copilot descubre de forma nativa el contenido de `.github/agents/` en este
repositorio, por lo que este agente funciona aquí sin instalar ningún complemento. La capa
de complementos lo agrupa en un paquete con nombre dentro del catálogo local `datacorp-mm-team-kit`
([`marketplace.json`](../marketplace.json)) y se declara en
[`.github/copilot/settings.json`](../../copilot/settings.json). Consulta el
[índice de complementos](../README.md) para conocer el mecanismo y sus limitaciones.
