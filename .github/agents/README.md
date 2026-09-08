# Índice de agentes

Este directorio contiene los agentes personalizados de GitHub Copilot para la inmersión: **17** en total, cada uno en su propio `<name>.agent.md`.

> [!NOTE]
> Copilot descubre archivos `*.agent.md` en `.github/agents/`. Invoca un agente por su `name` mediante `@<name>` (por ejemplo, `@archaeologist`). El `name` también vincula los prompts: un archivo `*.prompt.md` selecciona su agente mediante la clave `agent:` del frontmatter, por lo que el identificador de un agente es un contrato, no una etiqueta.

El kit utiliza **dos capas de agentes**: este es el modelo mental central, por lo que los agentes se agrupan por capa en lugar de enumerarse sin jerarquía:

- **Agentes de etapa (4)**: uno por etapa de la inmersión, utilizados secuencialmente a lo largo de la jornada.
- **Agentes de persona (10)**: uno por rol del equipo, utilizados por la pareja responsable de ese rol.

Otros tres **agentes especialistas** se sitúan fuera de ambas capas; aportan profundidad para trabajos específicos y se enumeran al final.

## Agentes de etapa

Cuatro agentes secuenciales, uno por etapa de la inmersión. Se encadenan mediante la clave `handoffs:` del frontmatter: en `archaeologist -> architect -> builder`, cada uno realiza el traspaso al siguiente; el agente terminal de la etapa 4 (`evolution`) no tiene ninguno.

| Etapa | Agente | Invocación | Prompts vinculados | Descripción |
| --- | --- | --- | --- | --- |
| Etapa 1 | [`archaeologist`](archaeologist.agent.md) | `@archaeologist` | 5 | Agente de la etapa 1: lee código heredado Natural/Adabas, extrae reglas de negocio, mapea dependencias y registra preguntas pendientes |
| Etapa 2 | [`architect`](architect.agent.md) | `@architect` | 4 | Agente de la etapa 2: define contextos delimitados, escribe especificaciones EARS, genera ADR y diseña una arquitectura de monolito modular |
| Etapa 3 | [`builder`](builder.agent.md) | `@builder` | 5 | Agente de la etapa 3: traduce Natural a Java, genera JPA a partir de FDT, escribe pruebas de equivalencia y construye REST + Next.js |
| Etapa 4 | [`evolution`](evolution.agent.md) | `@evolution` | 4 | Agente de la etapa 4: escribe incidencias de GitHub para Copilot Agent, revisa PR generadas por IA y configura CI/CD e IaC |

## Agentes de persona

Diez agentes, uno por rol del equipo. El agente [`implementer`](implementer.agent.md) atiende a la persona desarrolladora, por lo que sus prompts se llaman `persona-developer-*`, pero se vinculan a `agent: "implementer"`.

| Agente | Invocación | Prompts vinculados | Descripción |
| --- | --- | --- | --- |
| [`product-owner`](product-owner.agent.md) | `@product-owner` | 3 | Asistente del responsable del producto para escribir especificaciones, refinar la lista priorizada de trabajo y validar la aceptación con notación EARS y el flujo de SDD |
| [`requirements-engineer`](requirements-engineer.agent.md) | `@requirements-engineer` | 4 | Asistente de ingeniería de requisitos para notación EARS, validación de especificaciones y requisitos trazables al sistema heredado en el flujo de SDD |
| [`enterprise-architect`](enterprise-architect.agent.md) | `@enterprise-architect` | 3 | Asistente de arquitectura empresarial para la constitución de Spec-Kit, ADR, mapeo de integraciones externas y diseño transversal |
| [`software-architect`](software-architect.agent.md) | `@software-architect` | 3 | Asistente de arquitectura de software para CODEMAP, contextos delimitados, topología de módulos y contratos de API |
| [`tech-lead`](tech-lead.agent.md) | `@tech-lead` | 3 | Asistente de liderazgo técnico para mantener CODEMAP y contexto, orientar el uso de Copilot y definir estándares de revisión de código |
| [`implementer`](implementer.agent.md) | `@implementer` | 6 | Asistente de implementación para Java 21 y Next.js 15: TDD, corrección de errores y refactorización con trazabilidad REQ-ID |
| [`dba`](dba.agent.md) | `@dba` | 4 | Asistente de bases de datos para migraciones PostgreSQL, optimización de consultas, estrategia de indexación y auditoría de inyección SQL |
| [`qa-engineer`](qa-engineer.agent.md) | `@qa-engineer` | 5 | Asistente de aseguramiento de la calidad para generar pruebas a partir de especificaciones, analizar lagunas de cobertura y definir puertas de calidad de CI |
| [`devops-engineer`](devops-engineer.agent.md) | `@devops-engineer` | 5 | Asistente de DevOps para canalizaciones de GitHub Actions, IaC con Terraform, compilaciones de contenedores, observabilidad y análisis de incidentes |
| [`tech-writer`](tech-writer.agent.md) | `@tech-writer` | 5 | Asistente de redacción técnica para documentación de API, guías operativas, ADR, CODEMAP y contenido de estilo Diátaxis con detección de divergencias |

## Agentes especialistas

Tres especialistas avanzados que no encajan ni en la capa de etapa ni en la de persona. **Ninguno** tiene prompts propios; invócalos directamente mediante `@<name>`.

| Agente | Invocación | Prompts vinculados | Descripción |
| --- | --- | --- | --- |
| [`se-ux-ui-designer`](se-ux-ui-designer.agent.md) | `@se-ux-ui-designer` | 0 | Especialista en investigación UX/UI para la interfaz moderna de SIFAP: Jobs-to-be-Done, recorridos de usuario y especificaciones de accesibilidad que orientan la construcción del frontend. Utiliza para investigación e intención de diseño; utiliza @expert-react-frontend-engineer o @implementer para escribir el código Next.js. |
| [`expert-react-frontend-engineer`](expert-react-frontend-engineer.agent.md) | `@expert-react-frontend-engineer` | 0 | Especialista avanzado de frontend para la interfaz de SIFAP: React 19 + Next.js 15 App Router, límites servidor/cliente, acciones de servidor, interfaz optimista, accesibilidad y rendimiento. Utiliza para trabajo centrado en frontend; utiliza @implementer para un único elemento trazable de tasks.md o cualquier cambio de backend. |
| [`java-mcp-expert`](java-mcp-expert.agent.md) | `@java-mcp-expert` | 0 | Especialista en desarrollos desde cero para crear servidores Model Context Protocol (MCP) en Java con el SDK oficial MCP Java, Project Reactor y Spring Boot 3.3. Utiliza cuando un equipo amplíe la cadena de herramientas con un servidor MCP personalizado; la modernización del SIFAP heredado a Java corresponde a @archaeologist, @architect y @builder. |

## Responsabilidad sobre los prompts

Los 59 prompts de [`../prompts/`](../prompts/) se vinculan a un agente mediante su clave `agent:`:

- Los **59** se vinculan a uno de los **14** agentes con nombre anteriores (etapa + persona); ningún prompt permanece vinculado al agente integrado genérico `agent: "agent"`. Los recuentos por agente se encuentran en las columnas **Prompts vinculados** de las tablas.
- Los tres agentes especialistas (`se-ux-ui-designer`, `expert-react-frontend-engineer`, `java-mcp-expert`) tienen **0** prompts y se invocan directamente.

Regenera los recuentos con `grep -h '^agent:' ../prompts/*.prompt.md | sort | uniq -c`.

## Regla de mantenimiento

- Cambiar el nombre de un agente rompe sin aviso **todos** los prompts vinculados a él mediante `agent:`; cambia el nombre del agente y todos sus vínculos de prompts conjuntamente y después vuelve a ejecutar el validador.
- `description` es la única clave del frontmatter que la puerta exige estrictamente; `handoffs` es solo para agentes de etapa y únicamente cuando existe una etapa siguiente.
- Las secciones obligatorias del cuerpo (`Misión`, `Personas líderes`, `Principios operativos`, `Lo que este agente sabe`, `Lo que este agente NO sabe`, `Prompts disponibles`, un encabezado `Definición de terminado`, `Antipatrones que este agente rechaza`, `Integración con Spec-Kit`) y el esquema completo se definen en [`../PRIMITIVE-STANDARD.md`](../PRIMITIVE-STANDARD.md) y se exigen mediante [`../scripts/validate-copilot-primitives.py`](../scripts/validate-copilot-primitives.py).
- Cuando añadas un agente, incorpora su fila a la capa correcta anterior y, si un prompt debe invocarlo, establece el `agent:` de ese prompt en este `name`.
