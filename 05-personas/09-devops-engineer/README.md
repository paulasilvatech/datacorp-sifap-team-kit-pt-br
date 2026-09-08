# Ingeniero DevOps — Kit de Copilot

> **Ruta:** [Kit del equipo](../../README.md) › [Personas](../OVERVIEW.md) › **Ingeniero DevOps**

**Kit de referencia para la persona Ingeniero DevOps en la inmersión de modernización de SIFAP.**

![Persona](https://img.shields.io/badge/Persona-DevOps%20Engineer-171717?style=flat-square) ![Pareja 5](https://img.shields.io/badge/Par-5%20%C2%B7%20Opera%C3%A7%C3%B5es-404040?style=flat-square) ![Etapa 4](https://img.shields.io/badge/Est%C3%A1gio-4%20%C2%B7%20Evolu%C3%A7%C3%A3o-737373?style=flat-square)

| Campo | Valor |
|---|---|
| **Público objetivo** | Quien asume la persona Ingeniero DevOps en la inmersión |
| **Enfoque** | CI/CD con GitHub Actions, infraestructura como código con Terraform para Azure, observabilidad y respuesta a incidentes |
| **Fase del SDLC** | Transversal: Etapas 1 a 4; lidera la Etapa 4 — Evolución |
| **Resultado esperado** | Pipeline en verde, build reproducible, `terraform plan` válido y ejecución local documentada |

Lee primero: [PERSONA.md](PERSONA.md).

---

## Concepto

El Ingeniero DevOps es responsable del recorrido desde un commit de código hasta algo que funcione de manera confiable. En la inmersión de modernización de SIFAP (Sistema de Fiscalización y Administración de Pagos), esta persona garantiza que cualquier máquina del equipo pueda iniciar el entorno local, que GitHub Actions valide cada PR y que Terraform describa la topología de destino en Azure, aunque no se aplique durante la inmersión.

Por qué importa: sin un pipeline confiable, el Desarrollador no recibe retroalimentación rápida, el Ingeniero de Calidad no dispone de un entorno de pruebas estable y la demostración final corre el riesgo de fallar por el entorno, no por el código.

## Kit de la persona

Todos los artefactos activos residen en el directorio `.github/` de la raíz del repositorio. Esta carpeta es una referencia; edita los archivos de `.github/` cuando necesiten mantenimiento.

| Archivo | Tipo | Propósito |
|---|---|---|
| `PERSONA.md` | Perfil | Responsabilidades, etapas, prompts y rúbricas del Ingeniero DevOps |
| `.github/agents/devops-engineer.agent.md` | Agente | CI/CD, infraestructura como código, monitoreo e incidentes |
| `.github/prompts/persona-devops-engineer-pipeline.prompt.md` | Prompt | `/pipeline` |
| `.github/prompts/persona-devops-engineer-iac-module.prompt.md` | Prompt | `/iac-module` |
| `.github/prompts/persona-devops-engineer-incident-rca.prompt.md` | Prompt | `/incident-rca` |
| `.github/instructions/cicd.instructions.md` | Instrucciones | Convenciones de CI/CD |
| `.github/instructions/infrastructure.instructions.md` | Instrucciones | Convenciones de infraestructura |

> [!TIP]
> Si la persona facilitadora solicita una configuración MCP local y este kit tiene `mcp.json`, copia solo ese archivo a `.vscode/mcp.json`.

## Dónde residen los artefactos activos

- Agentes: `.github/agents/`
- Prompts: `.github/prompts/persona-*.prompt.md`
- Skills: `.github/skills/`
- Instrucciones: `.github/instructions/`

## Prácticas recomendadas

- [ ] **Trata todo como código.** La infraestructura, la configuración, las políticas y los runbooks deben estar versionados.
- [ ] **Mantén los pipelines por debajo de 10 minutos.** Los pipelines más largos se convierten en cuellos de botella; paraleliza o elimina pasos redundantes.
- [ ] **Guarda los secretos exclusivamente en un almacén de secretos.** Nunca uses un `.env` versionado, variables sueltas de CI ni código fuente.
- [ ] **Elige una estrategia de despliegue según el costo del rollback.** Blue/green y canary resuelven problemas diferentes.

## Ejemplo de SIFAP

En la Etapa 3, el Ingeniero DevOps crea `.github/workflows/ci.yml`, que se ejecuta con cada push, configura Java 21 con caché de Maven, ejecuta `mvn test`, construye la imagen Docker del backend y la publica en el registro. En paralelo, escribe los módulos Terraform `infra/networking/` e `infra/database/` que describen Azure Database for PostgreSQL y la VNet de destino. `terraform plan` se ejecuta correctamente aunque no se ejecute `apply` ese día.

## Referencias

- [Prácticas recomendadas de Terraform](https://developer.hashicorp.com/terraform/language/style)
- [Fortalecimiento de GitHub Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
- [Azure Verified Modules](https://azure.github.io/Azure-Verified-Modules/)
- [The DevOps Handbook — Gene Kim et al.](https://itrevolution.com/product/the-devops-handbook-second-edition/)

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Descripción general de las personas](../OVERVIEW.md)<br/><sub>Tabla de las 10 personas y sus parejas.</sub> | [PERSONA.md](PERSONA.md)<br/><sub>Perfil completo de la persona Ingeniero DevOps.</sub> |

<sub>[Volver al índice del kit](../../README.md)</sub>
