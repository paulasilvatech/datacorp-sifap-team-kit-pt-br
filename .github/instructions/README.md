# Índice de instrucciones

Este directorio contiene las instrucciones de GitHub Copilot específicas por archivo para la inmersión.

> Importante: Copilot descubre archivos `*.instructions.md` en `.github/instructions/` y sus subdirectorios. Esta inmersión los mantiene directamente en este directorio para facilitar la revisión del índice y los alcances.

## Archivos de instrucciones

| Archivo | Descripción | Alcance de `applyTo` |
| --- | --- | --- |
| `agent-skills.instructions.md` | Utiliza al crear, revisar o depurar habilidades de agentes de GitHub Copilot: frontmatter de SKILL.md, regla de coincidencia entre nombre y directorio, ajuste de descripciones y divulgación progresiva. | `.github/skills/**/SKILL.md` |
| `backend.instructions.md` | Utiliza al implementar API de backend, servicios, controladores, validación de solicitudes, tratamiento de errores y límites de servicios de negocio. | `backend/src/main/java/**,backend/src/test/java/**` |
| `cicd.instructions.md` | Utiliza al crear o revisar GitHub Actions, flujos de trabajo de CI/CD, puertas de canalizaciones YAML, comprobaciones de compilación y automatización de despliegues. | `.github/workflows/**,.github/actions/**,**/action.yml,**/action.yaml` |
| `database.instructions.md` | Utiliza al escribir repositorios de bases de datos, migraciones, cambios de esquema, consultas SQL, índices y cambios de datos con reversión segura. | `backend/src/main/java/**/infrastructure/**,backend/src/main/resources/db/migration/**` |
| `draw-io.instructions.md` | Utiliza al crear, editar o revisar diagramas draw.io y XML mxGraph en archivos .drawio, .drawio.svg o .drawio.png. | `**/*.drawio,**/*.drawio.svg,**/*.drawio.png` |
| `frontend-spec.instructions.md` | Utiliza al implementar o revisar Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui y componentes de servidor en frontend/. | `frontend/app/**,frontend/components/**,frontend/src/app/**,frontend/src/components/**,frontend/**/*.ts,frontend/**/*.tsx` |
| `frontend.instructions.md` | Utiliza al construir componentes de interfaz de frontend, páginas, interacciones del cliente, estado de componentes, accesibilidad y flujos de uso. | `frontend/app/**,frontend/components/**,frontend/src/app/**,frontend/src/components/**` |
| `infrastructure.instructions.md` | Utiliza al crear o revisar infraestructura como código, Terraform, Bicep, definiciones de recursos de Azure y configuración de entornos. | `infra/**,**/*.tf,**/*.bicep,compose*.yml,compose*.yaml,docker-compose*.yml,docker-compose*.yaml` |
| `java-junit5-assertions.instructions.md` | Utiliza al escribir o revisar aserciones JUnit 5 (Jupiter) en pruebas Java de backend: orden del valor esperado, mensajes diferidos, assertAll, assertThrows/assertThrowsExactly, tiempos de espera y assertInstanceOf. | `**/*Test.java,**/*IT.java,**/*Steps.java,**/*StepDefs.java` |
| `modular-monolith.instructions.md` | Utiliza al diseñar o revisar la arquitectura de monolito modular, los límites de paquetes por funcionalidad, el mapeo JPA y la migración Strangler Fig. | `backend/src/main/java/**,backend/pom.xml,backend/build.gradle*` |
| `natural-adabas.instructions.md` | Utiliza al leer código heredado Natural/Adabas, patrones del lenguaje, estructura FDT, convenciones de nomenclatura y flujos por lotes. | `01-archaeology/legacy-sifap/**,**/*.NSP,**/*.nsp,**/*.NSN,**/*.nsn,**/*.NSS,**/*.nss,**/*.NSA,**/*.nsa,**/*.NSL,**/*.nsl,**/*.NSC,**/*.nsc,**/*.NSM,**/*.nsm,**/*.NSD,**/*.nsd,**/*.NAT,**/*.nat,**/*.CPY,**/*.cpy,**/*.DDM,**/*.ddm,**/*.jcl,**/*.JCL` |
| `requirements.instructions.md` | Utiliza al escribir o revisar requisitos, especificaciones EARS, criterios de aceptación, trazabilidad y requisitos fundamentados en documentación. | `docs/**/*.md,specs/**/*.md,02-modern-spec/**/*.md` |
| `security.instructions.md` | Utiliza al implementar o revisar autenticación, autorización, criptografía, configuración segura, gestión de secretos y código sensible para la seguridad. | `backend/src/main/java/**/auth/**,backend/src/main/java/**/security/**,backend/src/main/java/**/config/**,backend/src/main/resources/**,frontend/**/auth/**,frontend/**/middleware.ts` |
| `terraform.instructions.md` | Utiliza para buenas prácticas generales de Terraform (organización de archivos, variables, salidas, formato, validación, pruebas y estado); las reglas de Azure del kit están en infrastructure.instructions.md. | `**/*.tf` |
| `tests.instructions.md` | Utiliza al crear o revisar pruebas automatizadas, estrategias de pruebas, especificaciones, lagunas de cobertura, pruebas de regresión y puertas de calidad. | `**/*.test.*,**/*.spec.*,**/tests/**` |

## Regla de mantenimiento

- Cada archivo DEBE mantener un frontmatter YAML válido con exactamente los campos necesarios `description` y `applyTo`.
- `applyTo` es una única cadena entre comillas; los patrones glob múltiples se separan por comas sin espacios después de las comas.
- Evita `applyTo: "**"`; prioriza patrones glob específicos que coincidan con los archivos que realmente rige la instrucción.
- Mantén coherente el patrón del proyecto: párrafo introductorio -> secciones temáticas -> `## Convenciones` -> `## Qué hacer / Qué no hacer` -> `## Lista de verificación antes de abrir una PR`.
- Al crear una nueva área, añade un archivo `*.instructions.md` directamente en este directorio y actualiza este índice.
