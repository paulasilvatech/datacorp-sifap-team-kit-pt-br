# Instrucciones de GitHub Copilot — Inmersión de modernización de sistemas heredados

> Estas instrucciones indican a Copilot qué está construyendo el equipo, qué tecnologías usar,
> qué convenciones seguir y qué NO hacer. Se aplican a todo el
> repositorio del equipo.

## Herramientas aprobadas — Solo estas

Esta inmersión utiliza una **cadena de herramientas fija**: VS Code, GitHub Copilot (modos Ask + Plan + Agent), GitHub Spec-Kit, GitHub, Docker / Docker Compose y Terraform. No se permiten otros asistentes de IA, IDE, interfaces de chat web ni marcos de SDD, porque mezclar herramientas rompe la trazabilidad especificación → código → prueba. Tabla completa: [`README.md`](../README.md).

## Contexto del proyecto

Modernización del sistema heredado Natural/Adabas **SIFAP** (Sistema de Fiscalización y Administración de Pagos), con 29 años de antigüedad, a Java 21 + Next.js 15. El código heredado está en [`01-archaeology/legacy-sifap/`](../01-archaeology/legacy-sifap/): 24 miembros Natural, 4 DDM `.ddm` y 1 listado FDT. El README de [`natural-programs/`](../01-archaeology/legacy-sifap/natural-programs/README.md) documenta la distribución de 15 asignados y 9 de apoyo.

El kit utiliza **dos capas de agentes** (un kit de persona por participante + un agente de etapa por equipo). Consulta los detalles en [`06-stage-agents/README.md`](../06-stage-agents/README.md).

Utiliza las habilidades de [`.github/skills/`](skills/) para los flujos de trabajo especializados. Copilot selecciona la habilidad pertinente a partir de su descripción; no dupliques flujos especializados en estas instrucciones globales.

## Idiomas del repositorio

- Mantén en inglés la documentación y toda la prosa de las primitivas de Copilot (agentes, prompts, instrucciones, habilidades y hooks) en `main` y `develop`; publica portugués de Brasil en `portugues-br` y español en `espanol`.
- Sigue el idioma de la rama de destino, no el de la conversación. Nunca integres el árbol de documentación traducida en `main` ni en `develop`.
- Conserva las rutas técnicas, los identificadores y las fuentes heredadas. Mantén el [selector de idioma](../README.md#idiomas-del-repositorio) enlazado a las ramas de idioma existentes y sus instrucciones.
- El portal de documentación en `site/` usa Astro + React, independientemente de la aplicación SIFAP. Sus diccionarios de interfaz traducida se permiten en `main`; la documentación del repositorio permanece en inglés. Consulta [ADR-0002](../docs/adr/0002-trilingual-documentation-portal.md).

## Tecnologías de destino

- **Backend:** Java 21 + Spring Boot 3.3 + JPA/Hibernate + PostgreSQL 16
- **Frontend:** Next.js 15 (App Router) + TypeScript 5 (modo `strict`) + Tailwind CSS + shadcn/ui
- **Contenedores:** Docker + Docker Compose creados por el equipo en las etapas 3/4 cuando sea necesario
- **IaC:** Terraform (proveedor de Azure ~> 3.x)
- **CI/CD:** GitHub Actions
- **Pruebas:** JUnit 5 + Testcontainers (backend); Vitest + Testing Library (frontend)

## Reglas transversales de implementación

Las reglas detalladas de Java, TypeScript, bases de datos, seguridad, infraestructura y pruebas se encuentran en [`.github/instructions/`](instructions/) y se cargan automáticamente para las rutas correspondientes.

- Utiliza nombres de clases y comentarios en inglés.
- Define las rutas de las API REST como `/api/v1/{resource}`.
- Valida las entradas en todos los límites del sistema.
- Nunca incorpores directamente secretos, claves de API ni credenciales en el código.
- Nunca expongas datos sensibles (CPF, importes de prestaciones) en los registros; enmascáralos.
- Configura CORS explícitamente; no utilices el comodín `*` en producción.
- Utiliza identidades administradas (Managed Identity) para la autenticación entre servicios de Azure.
- Escribe las pruebas durante la implementación, no después.

## Desarrollo guiado por especificaciones (Spec-Kit)

- Cada requisito utiliza la **notación EARS** (enfoque sencillo para la sintaxis de requisitos)
- Cada requisito tiene un **REQ-ID** único con el formato `REQ-NNN`
- **Cada requisito incluye una línea `source_legacy:`** que apunta a archivos heredados o contiene `[GREENFIELD] + justificación.`
  Utiliza `01-archaeology/legacy-sifap/natural-programs/*.{NSP,NSN,NSS,NSA,NSL,NSC,NSM,jcl}` o `01-archaeology/legacy-sifap/adabas-ddms/*.{NSD,ddm,txt}` para los requisitos fundamentados en el sistema heredado.
  El trabajo de CI `legacy-traceability` rechaza las PR que incumplen esta regla. Consulta [`01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md`](../01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md).
- Las pruebas se vinculan a los REQ-ID mediante comentarios en línea
- Estrategia de ramas: un prefijo por persona/etapa, siempre creado a partir de `develop` (nunca de `spec/*`) e integrado de vuelta en `develop` → `main`; no existe una rama `stage`.
  - `spec/<NNN>-<feature>` — RE + SA, etapa 2
  - `impl/<NNN>-<feature>` — Dev + DBA + QA, etapa 3
  - `infra/<component>` — DevOps, etapa 4
  - `docs/<topic>` — Redacción técnica
  - `agent/<issue-NN>` — Copilot Agent
  - No conviertas `impl/`, ni ningún otro prefijo, en `spec/`.
  - Tabla completa por persona: [`00-GIT-WORKFLOW.md`](../00-GIT-WORKFLOW.md)
- Antes de escribir requisitos EARS en la etapa 2, la pareja DEBE haber leído los programas Natural que tiene asignados (PUERTA OBLIGATORIA; consulta la lista de verificación anterior)

## Reglas estrictas — No hagas esto

- ❌ No supongas que existe un prototipo previo de la aplicación, una contenerización heredada ni infraestructura de la inmersión. `backend/`, `frontend/` e `infra/` todavía no existen; el equipo crea únicamente lo que requiere la porción seleccionada durante las etapas 3 y 4. El visor compartido de Natural/Adabas es externo y de solo lectura; nunca intentes aprovisionarlo ni administrarlo desde este repositorio.
- ❌ No escribas un requisito EARS sin `source_legacy:`; la CI rechazará la PR
- ❌ No añadas dependencias sin justificarlas en un ADR
- ❌ No escribas las pruebas después; escríbelas durante la implementación
- ❌ No expongas secretos en mensajes de commit, registros ni descripciones de PR
- ❌ No integres cambios en `main` sin al menos una revisión por pares
- ❌ No omitas las conversaciones guiadas de traspaso durante las transiciones entre etapas (consulta [`00-TEAM-FLOW.md`](../00-TEAM-FLOW.md))
- ❌ No crees un archivo `AGENTS.md`, `CLAUDE.md` ni `GEMINI.md` en la raíz. Este archivo es la única fuente de verdad para las instrucciones de agentes de todo el repositorio; toda superficie de Copilot que lee `AGENTS.md` también lee este archivo, y este tiene mayor precedencia. Un segundo archivo solo añade riesgo de divergencia. Consulta [`docs/adr/0001-agent-instructions-single-source-of-truth.md`](../docs/adr/0001-agent-instructions-single-source-of-truth.md).
- ❌ No añadas ni edites una primitiva de Copilot (agente, prompt, instrucción, habilidad o hook) que no siga [`PRIMITIVE-STANDARD.md`](PRIMITIVE-STANDARD.md); el trabajo de CI `copilot-primitives` exige su estructura.

## Referencias

- Cronograma + parejas: [`00-TEAM-FLOW.md`](../00-TEAM-FLOW.md)
- Flujo de trabajo Git: [`00-GIT-WORKFLOW.md`](../00-GIT-WORKFLOW.md)
- Los 3 modos de Copilot (Ask · Plan · Agent): [`09-cheat-sheets/copilot-3-modes.md`](../09-cheat-sheets/copilot-3-modes.md)
- Kits de persona (lee 2 por participante; los artefactos activos ya están consolidados en `.github/`): [`05-personas/`](../05-personas/)
- Agentes de etapa: [`06-stage-agents/`](../06-stage-agents/)
- Sistema heredado SIFAP: [`01-archaeology/legacy-sifap/`](../01-archaeology/legacy-sifap/)
- Visor del sistema heredado en funcionamiento: [`docs/legacy-system-access.md`](../docs/legacy-system-access.md)
- SDD con Spec-Kit: <https://github.com/github/spec-kit>
