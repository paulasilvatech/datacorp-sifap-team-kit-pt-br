# 07 — Conceptos fundamentales de la inmersión

> **Ruta:** [Kit del equipo](../README.md) › **Conceptos fundamentales**

**Este índice presenta los conceptos esenciales de la inmersión de modernización de SIFAP: qué aprenderás, en qué orden, cuánto tiempo lleva y cómo se conecta cada concepto con las cuatro etapas de trabajo.**

![Sección de conceptos](https://img.shields.io/badge/Section-07%20Concepts-171717?style=flat-square) ![Público: todos](https://img.shields.io/badge/Audience-Everyone-737373?style=flat-square) ![Leer antes de la Etapa 1](https://img.shields.io/badge/Read-Before%20Stage%201-A3A3A3?style=flat-square)

| Campo | Valor |
|---|---|
| **Público objetivo** | Cualquier integrante del equipo, incluidas las personas que no desarrollan software |
| **Prerrequisitos** | Ninguno: este es el punto de partida |
| **Tiempo estimado** | 60–90 min para leer todos los documentos |
| **Resultado esperado** | Vocabulario compartido antes de la Etapa 1 |

---

## Qué aprenderás

Cada archivo de esta carpeta explica un concepto técnico de forma directa, con ejemplos reales del dominio SIFAP (Sistema de Fiscalización y Administración de Pagos): pagos, beneficios y fiscalizaciones. Después de leerlos, podrás:

- Explicar el ciclo de Spec-Kit sin consultar la documentación
- Distinguir un kit de persona de un agente de etapa y saber cómo combinarlos en Copilot Chat
- Elegir el modo de Copilot adecuado (Ask, Plan o Agent) para cada situación
- Escribir o revisar un requisito EARS con `source_legacy:`
- Escribir o evaluar un registro de decisión de arquitectura (ADR)

---

## Ruta de aprendizaje

```mermaid
%%{init: {'theme':'neutral','themeVariables':{'fontFamily':'ui-sans-serif, system-ui, sans-serif','primaryColor':'#F5F5F5','primaryTextColor':'#171717','primaryBorderColor':'#171717','lineColor':'#525252','secondaryColor':'#FFFFFF','tertiaryColor':'#FAFAFA','background':'#FFFFFF'}}}%%
flowchart TD
    classDef step fill:#F5F5F5,stroke:#171717,color:#171717
    classDef tool fill:#FFFFFF,stroke:#525252,color:#171717
    classDef result fill:#FFFFFF,stroke:#171717,color:#171717,stroke-width:2px

    A["01 — Desarrollo guiado por especificaciones<br/><sub>Qué es Spec-Kit y por qué especificar antes de programar</sub>"]:::step
    B["02 — Agentes y personas<br/><sub>Dos capas de contexto en Copilot Chat</sub>"]:::step
    C["04 — Los 3 modos de Copilot<br/><sub>Ask · Plan · Agent y criterios de selección</sub>"]:::step
    D["03 — Glosario visual<br/><sub>Referencia de más de 30 términos: consulta según sea necesario</sub>"]:::tool
    E["05 — Notación EARS<br/><sub>Cómo escribir requisitos sin ambigüedades</sub>"]:::step
    F["06 — Registros de decisiones de arquitectura<br/><sub>Cómo registrar decisiones para el equipo del futuro</sub>"]:::step
    G["Etapa 1 — Arqueología"]:::result

    A --> B --> C --> E --> F --> G
    D -. "consultar en cualquier momento" .-> G
```

---

## Documentos de esta carpeta

| # | Documento | Concepto fundamental | Etapa principal |
|---|---|---|---|
| 01 | [Desarrollo guiado por especificaciones](01-spec-driven-development.md) | Ciclo de Spec-Kit: especificar → planificar → tareas → implementar | Etapa 2 |
| 02 | [Agentes y personas](02-agents-and-personas.md) | Kit de persona individual × agente de etapa compartido | Todas |
| 03 | [Glosario visual](03-visual-glossary.md) | Más de 30 términos con definición, ejemplo de SIFAP y referencia | Todas |
| 04 | [Los 3 modos de Copilot](04-3-copilot-modes.md) | Ask · Plan · Agent: criterios y antipatrones | Todas |
| 05 | [Notación EARS](05-ears-notation.md) | 6 patrones EARS (5 básicos + Complejo), REQ-ID y `source_legacy:` | Etapa 2 |
| 06 | [Registros de decisiones de arquitectura](06-architecture-decision-records.md) | Anatomía, cuándo escribir uno y ciclo de vida de los ADR | Etapa 2 |

---

## Conexión con las cuatro etapas

| Etapa | Documentos de referencia de esta carpeta |
|---|---|
| Etapa 1 — Arqueología | Glosario (términos del legado: Natural, DDM, MU, PE, BR-NNN) |
| Etapa 2 — Especificación | Spec-Kit, Agentes, EARS, ADR, Glosario (EARS, REQ-ID, source_legacy) |
| Etapa 3 — Implementación | Los 3 modos de Copilot, Glosario (JPA, Flyway, Testcontainers, Controller) |
| Etapa 4 — Evolución | Los 3 modos de Copilot (modo Agent), Glosario (IaC, Terraform, CI/CD) |

---

## Comprueba antes de continuar

Antes de iniciar la Etapa 1, confirma que puedes responder estas preguntas sin consultar la documentación:

- [ ] ¿Qué es Spec-Kit y para qué sirve el comando `/speckit.specify`?
- [ ] ¿Cuál es la diferencia entre un kit de persona (en `05-personas/`) y un agente de etapa (en `06-stage-agents/`)?
- [ ] ¿Cuándo deberías usar Ask en lugar de Agent en Copilot?
- [ ] ¿Qué es EARS y por qué es obligatorio el campo `source_legacy:`?
- [ ] ¿Qué es un ADR y en qué situación escribirías uno?

Si respondiste cuatro de cinco, continúa a [`../05-personas/`](../05-personas/) y lee tus dos archivos `PERSONA.md`.

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Kit del equipo](../README.md)<br/><sub>Centro principal de la inmersión.</sub> | [Desarrollo guiado por especificaciones](01-spec-driven-development.md)<br/><sub>Por qué especificar antes de programar y cómo estructura Spec-Kit el proceso.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
