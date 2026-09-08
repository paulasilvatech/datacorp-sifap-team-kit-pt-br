# Kits de personas

> **Ruta:** [Kit del equipo](../README.md) › **Personas**

**Guía de incorporación a las 10 personas de la inmersión.** Cada persona es un conjunto de herramientas de Copilot especializado en un rol del SDLC; cada integrante del equipo elige y estudia 2 personas de la misma pareja.

| Campo | Valor |
|---|---|
| **Público objetivo** | Todos los participantes de la inmersión |
| **Prerrequisitos** | [00-SETUP.md](../00-SETUP.md) completado |
| **Tiempo estimado** | 15 min |
| **Resultado esperado** | Dos personas identificadas, `.github/` validado y Copilot recargado |

![Descripción general de las parejas de personas en la inmersión SIFAP](../assets/personas-team.svg)

---

## Concepto

Una persona es un conjunto de herramientas de Copilot especializado en un rol específico del ciclo de vida del desarrollo. Cada kit incluye un agente configurado, prompts para tareas recurrentes, instrucciones y skills. La persona orienta cómo responde Copilot y qué atajos de productividad están disponibles.

En el contexto de SIFAP (Sistema de Fiscalización y Administración de Pagos), cada rol tiene responsabilidades directas sobre artefactos concretos: desde el catálogo de reglas Natural/Adabas hasta las pruebas de aceptación y el pipeline de CI. Al estudiar la persona, sabes qué producir, quién te proporciona las entradas y quién recibe tus salidas.

---

## Las 5 parejas

El equipo de la inmersión tiene 5 personas, cada una utiliza 2 personas de la misma pareja. Esto cubre todo el SDLC.

| **Pareja** | Personas | Kits |
|---|---|---|
| **1 · Visión** | Responsable de Producto + Especialista en Requisitos | `01-product-owner/` + `02-requirements-engineer/` |
| **2 · Arquitectura** | Arquitecto Empresarial + Arquitecto de Software | `03-enterprise-architect/` + `04-software-architect/` |
| **3 · Implementación** | Líder Técnico + Desarrollador | `05-technical-lead/` + `06-developer/` |
| **4 · Calidad** | DBA + Ingeniero de Calidad | `07-dba/` + `08-qa-engineer/` |
| **5 · Operaciones** | Ingeniero DevOps + Redactor Técnico | `09-devops-engineer/` + `10-tech-writer/` |

---

## Qué contiene cada kit

| **Artefacto** | Propósito |
|---|---|
| `PERSONA.md` | Perfil completo: responsabilidades, transiciones, prompts y criterios de evaluación |
| `README.md` | Inventario de artefactos de Copilot (rutas dentro de `.github/`) |
| `mcp.json` | Servidores MCP recomendados para el rol (cuando estén disponibles) |

Los artefactos activos están consolidados en el directorio `.github/` de la raíz:

| **Artefacto** | Ruta |
|---|---|
| Agente de Copilot adaptado al rol | `.github/agents/*.agent.md` |
| Prompts para tareas recurrentes | `.github/prompts/persona-*.prompt.md` |
| Skills reutilizables | `.github/skills/*/SKILL.md` |
| Reglas específicas por tipo de archivo | `.github/instructions/*.instructions.md` |

---

## Kits disponibles

| **#** | Kit | Rol en la inmersión |
|---|---|---|
| 01 | [Responsable de Producto](./01-product-owner/PERSONA.md) | Prioridad, alcance, valor y narrativa de la demo |
| 02 | [Especialista en Requisitos](./02-requirements-engineer/PERSONA.md) | Requisitos EARS, criterios de aceptación y trazabilidad |
| 03 | [Arquitecto Empresarial](./03-enterprise-architect/PERSONA.md) | Dependencias externas y decisiones de alcance |
| 04 | [Arquitecto de Software](./04-software-architect/PERSONA.md) | Plan técnico, límites de módulos y ADR cuando sean necesarios |
| 05 | [Líder Técnico](./05-technical-lead/PERSONA.md) | Estándares, coordinación técnica y revisiones de PR |
| 06 | [Desarrollador](./06-developer/PERSONA.md) | Código Java/TypeScript, pruebas e integración |
| 07 | [DBA](./07-dba/PERSONA.md) | Modelo PostgreSQL, migraciones y mapeo de DDM |
| 08 | [Ingeniero de Calidad](./08-qa-engineer/PERSONA.md) | Estrategia de pruebas, cobertura y puertas |
| 09 | [Ingeniero DevOps](./09-devops-engineer/PERSONA.md) | CI/CD, Terraform, secretos y despliegue |
| 10 | [Redactor Técnico](./10-tech-writer/PERSONA.md) | Glosario, claridad de los ADR, README y runbook |

---

## Cómo activar tu persona

![Cinco pasos para usar tu persona: leer PERSONA.md, revisar README, validar .github, copiar mcp.json si es necesario y recargar Copilot](../assets/persona-onboarding.svg)

> [!IMPORTANT]
> Completa [00-SETUP.md](../00-SETUP.md) antes de continuar.

- [ ] **Identifica tus dos personas.** Busca tu pareja en [00-TEAM-FLOW.md](../00-TEAM-FLOW.md).
- [ ] **Lee ambos perfiles.** Abre `05-personas/<role>/PERSONA.md` para cada rol de tu pareja.
- [ ] **Valida el `.github/` consolidado.** Confirma que contiene agentes, prompts, instrucciones y skills:

  ```bash
  ls .github/agents .github/prompts .github/instructions .github/skills
  ```

- [ ] **Copia la configuración MCP solo si es necesario.** La persona facilitadora te indicará cuándo:

  ```bash
  [ -f 05-personas/06-developer/mcp.json ] && \
    mkdir -p .vscode && \
    cp 05-personas/06-developer/mcp.json .vscode/mcp.json
  ```

- [ ] **Recarga Copilot.** Abre la paleta de comandos y ejecuta **Developer: Reload Window**.
- [ ] **Verifica los agentes y prompts.** Escribe `@` en el panel de Copilot y confirma los agentes. Escribe `/` y confirma los comandos de barra.

---

## Cómo estudiar un kit en 10 minutos

- [ ] **Lee primero `PERSONA.md`.** Misión, responsabilidades, transiciones y rúbricas de evaluación.
- [ ] **Abre el `README.md` del kit.** Inventario de agentes, prompts, skills y MCP.
- [ ] **Revisa los prompts disponibles.** Son atajos para tareas recurrentes, no sustitutos del criterio propio.
- [ ] **Revisa las skills e instrucciones.** Las skills contienen flujos de trabajo; las instrucciones aplican reglas por tipo de archivo.
- [ ] **Anota las transiciones.** Cada persona debe saber quién le proporciona las entradas y quién recibe sus salidas.

---

## Definición de terminado de la instalación

- [ ] Se leyeron ambos perfiles `PERSONA.md` de la pareja.
- [ ] El `.github/` consolidado contiene agentes, prompts, instrucciones y skills.
- [ ] `mcp.json` copiado a `.vscode/` cuando esté disponible.
- [ ] VS Code recargado.
- [ ] Los agentes aparecen al escribir `@` en Copilot Chat.
- [ ] Los prompts aparecen al escribir `/` en Copilot Chat.

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [CONFIGURACIÓN](../00-SETUP.md)<br/><sub>Configuración del portátil: Git, VS Code, Copilot, Spec-Kit y protección de ramas.</sub> | [DESCRIPCIÓN GENERAL de las 10 personas](OVERVIEW.md)<br/><sub>Tabla comparativa: pareja, liderazgo de etapa y opciones de emergencia.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
