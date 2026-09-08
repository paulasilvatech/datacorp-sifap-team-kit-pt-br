# Matriz persona-agente

![Tipo: referencia](https://img.shields.io/badge/Type-Reference-171717?style=flat-square)
![Uso: quién hace qué](https://img.shields.io/badge/Use-Who%20does%20what-737373?style=flat-square)

> **Ruta:** [Kit del equipo](../README.md) › [Documentación](README.md) › **Matriz persona-agente**

**Relaciona cada persona con cada agente de etapa** — muestra quién lidera, apoya u observa en cada momento del día.

| Campo | Valor |
|---|---|
| **Público objetivo** | Todo el equipo |
| **Cuándo consultarla** | Al inicio de cada etapa y al formar las parejas |
| **Resultado esperado** | Claridad sobre el nivel de participación esperado de cada persona |

---

## Cómo leer esta matriz

1. Encuentra la fila de tu persona.
2. Recorre la fila para ver tu nivel de intensidad en cada etapa.
3. Para las etapas en las que figuras como **Lidera** o **Apoya**, lee las orientaciones detalladas de abajo.
4. Abre el README del kit de agente de la etapa actual para ver el flujo completo.

---

## La matriz

| # | Persona | @archaeologist | @architect | @builder | @evolution |
|---|---|---|---|---|---|
| 01 | Responsable de Producto | Observa | Apoya | Observa | Apoya |
| 02 | Especialista en Requisitos | **Lidera** | Apoya | Observa | Observa |
| 03 | Arquitecto Empresarial | Apoya | Apoya | Observa | Observa |
| 04 | Arquitecto de Software | Observa | **Lidera** | Apoya | Observa |
| 05 | Líder Técnico | Observa | Apoya | Apoya | **Lidera** |
| 06 | Desarrollador | Observa | Observa | **Lidera** | Apoya |
| 07 | DBA | Apoya | Observa | Apoya | Observa |
| 08 | Ingeniero de Calidad | Observa | Observa | Apoya | Apoya |
| 09 | Ingeniero DevOps | Observa | Observa | Apoya | Apoya |
| 10 | Redactor Técnico | Apoya | Observa | Observa | Apoya |

**Lidera** — dirige el uso del agente y es responsable de los entregables de la etapa.
**Apoya** — contribuye activamente y trabaja con quien lidera.
**Observa** — sigue el chat y está listo para ayudar cuando se necesite su especialidad.

---

## Orientaciones por celda

### Etapa 1 — @archaeologist

| Persona | Qué haces |
|---|---|
| **Especialista en Requisitos (Lidera)** | Lidera la exploración. Abre cada programa Natural, pide al agente que ayude a interpretarlo y captura las reglas de negocio como borradores de requisitos. Es responsable de los borradores de reglas. |
| Redactor Técnico (Apoya) | Construye el glosario del dominio en tiempo real. Cada término nuevo —nombre de variable, etiqueta de campo o propósito de subrutina— entra en el glosario con una definición. |
| Arquitecto Empresarial (Apoya) | Se centra en la visión global: ¿a qué sistemas externos llama el código heredado? ¿De dónde proceden las entradas batch? Empieza a redactar el contexto del sistema. |
| DBA (Apoya) | Se centra en los DDM de Adabas (módulos de definición de datos). Documenta tipos de campos, descriptores, estructuras MU/PE y relaciones entre archivos para el mapa de datos. |
| Responsable de Producto (Observa) | Escucha y valida. Cuando el equipo propone una interpretación de una regla de negocio, la confirma o la cuestiona según el conocimiento del dominio. |
| Otras personas (Observan) | Siguen el chat. Contribuyen cuando alguien pregunta por un patrón de su área, como un Desarrollador que reconoce un cálculo. |

### Etapa 2 — @architect

| Persona | Qué haces |
|---|---|
| **Arquitecto de Software (Lidera)** | Lidera la definición de contextos delimitados. Usa el mapa de datos y el grafo de llamadas de la Etapa 1 para identificar límites naturales. Dibuja diagramas C4. Escribe los primeros ADR. |
| Especialista en Requisitos (Apoya) | Convierte las reglas de negocio de la Etapa 1 en requisitos EARS formales con ID `REQ-NNN`. Cada requisito necesita criterios de aceptación. Trabaja con el Arquitecto de Software para mapear los requisitos a contextos delimitados. |
| Arquitecto Empresarial (Apoya) | Valida el diagrama de contexto del sistema. Garantiza que se capturen los puntos de integración: entradas batch, API externas y autenticación. Revisa la coherencia arquitectónica de los ADR. |
| Responsable de Producto (Apoya) | Prioriza los requisitos. Con tiempo limitado, ayuda a decidir qué es obligatorio y qué es deseable. |
| Líder Técnico (Observa) | Empieza a considerar el orden de implementación. ¿Qué contexto delimitado debería construirse primero? ¿Cuáles son las dependencias? |
| Otras personas (Observan) | Revisan la especificación que va surgiendo y señalan incoherencias desde sus especialidades. |

### Etapa 3 — @builder

| Persona | Qué haces |
|---|---|
| **Desarrollador (Lidera)** | Escribe código. Usa el agente de implementación para generar entidades JPA, servicios Spring, controladores REST y páginas Next.js. Cada segmento de código es trazable a un `REQ-NNN`. |
| DBA (Apoya) | Es responsable de la capa de base de datos. Revisa los mapeos de entidades, escribe migraciones Flyway y valida que el esquema PostgreSQL represente correctamente el modelo de datos de la Etapa 2. |
| Ingeniero de Calidad (Apoya) | Escribe pruebas con el Desarrollador. Para cada servicio, produce al menos una prueba del flujo correcto y una del flujo de error. Supervisa la cobertura y señala lagunas. |
| Líder Técnico (Apoya) | Revisa el código a medida que se produce. Comprueba que no se infrinjan los estándares: sin `@Autowired` en campos, sin retornos `null` y sin `any` de TypeScript. Integra las pull requests. |
| Arquitecto de Software (Apoya) | Valida que la implementación coincida con el diseño. Señala pronto las desviaciones de los límites de contextos delimitados. |
| Otras personas (Observan) | Permanecen disponibles para preguntas. El Desarrollador puede necesitar aclaraciones del dominio que solo el Responsable de Producto o el Especialista en Requisitos pueden aportar. |

### Etapa 4 — @evolution

| Persona | Qué haces |
|---|---|
| **Líder Técnico (Lidera)** | Escribe GitHub Issues para Copilot Agent. Revisa las pull requests generadas por IA. Decide qué integrar y qué rechazar. Es responsable de la integración y de la preparación de la demo. |
| Ingeniero DevOps (Apoya) | Escribe el workflow de GitHub Actions y los módulos Terraform. Garantiza etiquetas, gestión de secretos y configuración de recursos correctas. |
| Ingeniero de Calidad (Apoya) | Valida que la CI incluya todas las puertas de calidad: lint, build y pruebas. Revisa los resultados de pruebas de las pull requests generadas por IA. |
| Desarrollador (Apoya) | Revisa la corrección del código generado por IA. Conoce la base de código y detecta errores lógicos que pueden escapar a las verificaciones automatizadas. |
| Redactor Técnico (Apoya) | Refina el README, documenta el guion de la demo y garantiza que las notas de retrospectiva registren el aprendizaje del equipo. |
| Responsable de Producto (Apoya) | Ayuda a priorizar lo que debe funcionar para la demo frente a lo que puede posponerse. Prepara la narrativa de la presentación. |
| Otras personas (Observan) | Aportan observaciones para la retrospectiva: qué les sorprendió y qué harían de otra manera. |

---

## Orden de lectura sugerido

- [ ] Lee el `PERSONA.md` de tu rol en [`05-personas/`](../05-personas/): comprende tus responsabilidades.
- [ ] Lee tu fila de esta matriz: comprende tu intensidad de participación en cada etapa.
- [ ] Al inicio de cada etapa, abre el README del kit de agente en [`06-stage-agents/`](../06-stage-agents/).
- [ ] Activa el agente de la etapa actual en Copilot Chat y empieza a trabajar.

## Referencias

- [Kits de agentes](../06-stage-agents/README.md)
- [Arquitectura de agentes](4-agents-explained.md)
- [Kits de personas consolidados](../05-personas/)

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Los cuatro agentes explicados](4-agents-explained.md)<br/><sub>Por qué hay cuatro agentes.</sub> | [Flujo del SDLC](sdlc-flow-guide.md)<br/><sub>Contratos entre parejas.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
