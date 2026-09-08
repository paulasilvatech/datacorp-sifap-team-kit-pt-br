# Ingeniero de Calidad — Kit de Copilot

> **Ruta:** [Kit del equipo](../../README.md) › [Personas](../OVERVIEW.md) › **Ingeniero de Calidad**

**Kit de referencia para la persona Ingeniero de Calidad en la inmersión de modernización de SIFAP.**

![Persona](https://img.shields.io/badge/Persona-QA%20Engineer-171717?style=flat-square) ![Pareja 4](https://img.shields.io/badge/Par-4%20%C2%B7%20Qualidade-404040?style=flat-square) ![Etapas 3 y 4](https://img.shields.io/badge/Est%C3%A1gios-3%20e%204-737373?style=flat-square)

| Campo | Valor |
|---|---|
| **Público objetivo** | Quien asume la persona Ingeniero de Calidad en la inmersión |
| **Enfoque** | Generar pruebas a partir de especificaciones EARS, cubrir comportamientos críticos y mantener el pipeline en verde |
| **Fase del SDLC** | Etapa 3 — Implementación; Etapa 4 — Evolución |
| **Resultado esperado** | Suite de pruebas aprobada, pipeline de CI en verde y trazabilidad garantizada de especificaciones a pruebas |

Lee primero: [PERSONA.md](PERSONA.md).

---

## Concepto

El Ingeniero de Calidad transforma los requisitos EARS en pruebas ejecutables. En la modernización de SIFAP (Sistema de Fiscalización y Administración de Pagos), esta persona valida la equivalencia funcional entre el comportamiento heredado de Natural y el código moderno Java 21, garantizando que cada REQ-ID tenga al menos una prueba verificable y que el pipeline de CI de GitHub Actions permanezca en verde.

Por qué importa: la ausencia o fragilidad de las pruebas impide al equipo detectar regresiones. En la modernización del legado, la equivalencia funcional entre el comportamiento antiguo y el nuevo solo puede demostrarse mediante pruebas trazables a los requisitos.

## Kit de la persona

Todos los artefactos activos residen en el directorio `.github/` de la raíz del repositorio. Esta carpeta es una referencia; edita los archivos de `.github/` cuando necesiten mantenimiento.

| Archivo | Tipo | Propósito |
|---|---|---|
| `PERSONA.md` | Perfil | Responsabilidades, etapas, prompts y rúbricas del Ingeniero de Calidad |
| `.github/agents/qa-engineer.agent.md` | Agente | Generación de pruebas, análisis de cobertura y puertas de calidad |
| `.github/prompts/persona-qa-engineer-create-tests.prompt.md` | Prompt | `/create-tests` |
| `.github/prompts/persona-qa-engineer-coverage-gaps.prompt.md` | Prompt | `/coverage-gaps` |
| `.github/prompts/persona-qa-engineer-test-strategy.prompt.md` | Prompt | `/test-strategy` |
| `.github/instructions/tests.instructions.md` | Instrucciones | Convenciones de pruebas |

> [!TIP]
> Si la persona facilitadora solicita una configuración MCP local y este kit tiene `mcp.json`, copia solo ese archivo a `.vscode/mcp.json`.

## Dónde residen los artefactos activos

- Agentes: `.github/agents/`
- Prompts: `.github/prompts/persona-*.prompt.md`
- Skills: `.github/skills/`
- Instrucciones: `.github/instructions/`

## Prácticas recomendadas

- [ ] **Sigue la pirámide de pruebas.** Prioriza más pruebas unitarias, un número moderado de pruebas de integración y menos pruebas de extremo a extremo.
- [ ] **Trata una prueba intermitente como un error.** Aíslala, corrígela o elimínala; nunca la ignores.
- [ ] **Garantiza que cada aserción demuestre un comportamiento.** La cobertura de líneas sin una aserción significativa no valida el dominio.
- [ ] **Traza las pruebas a los requisitos.** Cada prueba debe referenciar un REQ-ID en un comentario inline.

## Ejemplo de SIFAP

En la Etapa 2, el Ingeniero de Calidad valida que cada requisito EARS de `spec.md` tenga criterios de aceptación comprobables. En la Etapa 3, escribe pruebas JUnit 5 con Testcontainers para `POST /api/v1/beneficios`, verificando escenarios identificados en `SIFAP-BEN.NSN`: creación válida, entrada duplicada y ausencia de campos obligatorios. Añade `// REQ-012` a cada método de prueba.

## Referencias

- [Blog de pruebas de Google](https://testing.googleblog.com/)
- [xUnit Test Patterns — Gerard Meszaros](http://xunitpatterns.com/)
- [Pruebas de software ISTQB](https://www.istqb.org/)
- [Pruebas basadas en propiedades — jqwik/fast-check](https://jqwik.net/)

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [Descripción general de las personas](../OVERVIEW.md)<br/><sub>Tabla de las 10 personas y sus parejas.</sub> | [PERSONA.md](PERSONA.md)<br/><sub>Perfil completo de la persona Ingeniero de Calidad.</sub> |

<sub>[Volver al índice del kit](../../README.md)</sub>
