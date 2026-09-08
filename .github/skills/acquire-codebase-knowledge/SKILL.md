---
name: "acquire-codebase-knowledge"
description: "Usa esta skill cuando la persona solicite explícitamente mapear o documentar una base de código existente, o recibir orientación para incorporarse a ella. Actívala ante solicitudes como \"mapea esta base de código\", \"documenta esta arquitectura\", \"ayúdame a incorporarme a este repositorio\" o \"crea documentación de la base de código\". No la actives para implementar funcionalidades habituales, corregir errores o realizar cambios puntuales, salvo que se solicite explorar el repositorio en su conjunto."
---
# Adquisición de conocimiento de la base de código

Genera siete documentos completos en `docs/codebase/` que abarcan todo lo necesario para trabajar eficazmente en el proyecto. Documenta únicamente lo que pueda verificarse en archivos o salidas del terminal; nunca lo deduzcas ni lo supongas.

## Cuándo invocar

- "Mapea esta base de código y documenta su arquitectura."
- "Ayúdame a incorporarme a este repositorio; ¿por dónde empiezo?"
- "Crea documentación de la base de código para que una nueva persona de ingeniería sea productiva en la semana 1."
- "Documenta el stack, la estructura y las integraciones de este proyecto."

> [!NOTE]
> En esta inmersión, la aplicación moderna no existe hasta la etapa 3, así que aplica esta skill a un proyecto existente o al propio kit. Trata todo el contenido de `01-archaeology/legacy-sifap/` como evidencia de solo lectura y nunca afirmes qué contiene un programa o campo legado. Registra cómo averiguarlo y remítete a la puerta de lectura de [`01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md`](../../../01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md) y [`01-archaeology/legacy-sifap/HOW-TO-READ-NATURAL.md`](../../../01-archaeology/legacy-sifap/HOW-TO-READ-NATURAL.md).

## Flujo de trabajo

Copia esta lista de verificación y haz un seguimiento de ella:

```text
- [ ] Fase 1: Ejecutar el análisis y leer los documentos de intención
- [ ] Fase 2: Investigar cada área de documentación
- [ ] Fase 3: Completar los siete documentos de docs/codebase/
- [ ] Fase 4: Validar los documentos, presentar los hallazgos y resolver todos los elementos [ASK USER]
```

## Modo de área prioritaria

Si la persona indica un área prioritaria (por ejemplo, "solo arquitectura" o "pruebas y problemas"):

1. Ejecuta siempre la fase 1 completa.
2. Completa primero todos los documentos del área prioritaria.
3. En los documentos de otras áreas aún no analizadas, conserva las secciones obligatorias y marca lo desconocido con `[TODO]`.
4. Aun así, ejecuta el ciclo de validación de la fase 4 sobre los siete documentos antes de entregar el resultado.

### Fase 1: Analizar y leer la intención

1. Ejecuta el script de análisis desde la raíz del proyecto de destino:

   ```bash
   python3 "$SKILL_ROOT/scripts/scan.py" --output docs/codebase/.codebase-scan.txt
   ```

   `$SKILL_ROOT` es la ruta absoluta de la carpeta de la skill. Funciona en Windows, macOS y Linux.

   **Inicio rápido:** Si incluyes la ruta directamente:

   ```bash
   python3 /absolute/path/to/skills/acquire-codebase-knowledge/scripts/scan.py --output docs/codebase/.codebase-scan.txt
   ```

2. Busca archivos `PRD`, `TRD`, `README`, `ROADMAP`, `SPEC` y `DESIGN`, y léelos.
3. Resume la intención declarada del proyecto antes de leer cualquier código fuente.

### Fase 2: Investigar

Usa la salida del análisis para responder las preguntas de cada una de las siete plantillas. Carga [`references/inquiry-checkpoints.md`](references/inquiry-checkpoints.md) para consultar la lista completa de preguntas por plantilla.

Si el stack es ambiguo (varios manifiestos, tipos de archivo desconocidos o ausencia de `package.json`), carga [`references/stack-detection.md`](references/stack-detection.md).

### Fase 3: Completar las plantillas

Copia cada plantilla de `assets/templates/` a `docs/codebase/`. Complétalas en este orden:

1. [STACK.md](assets/templates/STACK.md): lenguaje, entorno de ejecución, frameworks y todas las dependencias
2. [STRUCTURE.md](assets/templates/STRUCTURE.md): organización de directorios, puntos de entrada y archivos principales
3. [ARCHITECTURE.md](assets/templates/ARCHITECTURE.md): capas, patrones y flujo de datos
4. [CONVENTIONS.md](assets/templates/CONVENTIONS.md): nomenclatura, formato, gestión de errores e importaciones
5. [INTEGRATIONS.md](assets/templates/INTEGRATIONS.md): API externas, bases de datos, autenticación y supervisión
6. [TESTING.md](assets/templates/TESTING.md): frameworks, organización de archivos y estrategia de simulación
7. [CONCERNS.md](assets/templates/CONCERNS.md): deuda técnica, errores, riesgos de seguridad y cuellos de botella de rendimiento

Usa `[TODO]` para todo lo que no pueda determinarse a partir del código. Usa `[ASK USER]` cuando la respuesta correcta requiera conocer la intención del equipo.

### Fase 4: Validar, corregir y verificar

Ejecuta este ciclo de validación obligatorio antes de finalizar:

1. Valida cada documento con `references/inquiry-checkpoints.md`.
2. Confirma que exista al menos una referencia de evidencia para cada afirmación no trivial.
3. Si falta alguna sección obligatoria o carece de respaldo:

- Corrige el documento.
- Vuelve a ejecutar la validación.

4. Repite el proceso hasta que los siete documentos superen la validación.

Después, presenta un resumen de los siete documentos, enumera cada elemento `[ASK USER]` como una pregunta y destaca las diferencias entre intención y realidad detectadas en la fase 1.

Criterios para superar la validación:

- Ninguna afirmación sin respaldo.
- Ninguna sección obligatoria vacía.
- Lo desconocido se marca con `[TODO]` en lugar de recurrir a suposiciones.
- Las carencias sobre la intención del equipo se marcan explícitamente con `[ASK USER]`.

---

## Aspectos que debes tener en cuenta

**Monorepositorios:** Puede que el `package.json` de la raíz no tenga código fuente asociado. Busca `workspaces` o directorios `packages/` y `apps/`. Cada espacio de trabajo puede tener dependencias y convenciones independientes. Documenta cada subpaquete por separado.

**README desactualizado:** El README suele describir la arquitectura prevista, no la actual. Contrasta su contenido con la estructura real de archivos antes de tratar cualquier afirmación del README como un hecho.

**Alias de rutas de TypeScript:** La configuración `paths` de `tsconfig.json` implica que las importaciones como `@/foo` no corresponden directamente al sistema de archivos. Resuelve los alias a rutas reales antes de documentar la estructura.

**Salida generada o compilada:** Nunca documentes patrones de `dist/`, `build/`, `generated/`, `.next/`, `out/` o `__pycache__/`. Son artefactos; documenta únicamente las convenciones del código fuente.

**`.env.example` revela la configuración obligatoria:** Los secretos nunca se incluyen en commits. Lee `.env.example`, `.env.template` o `.env.sample` para descubrir las variables de entorno obligatorias.

**`devDependencies` ≠ stack de producción:** Solo `dependencies` (o su equivalente, por ejemplo, `[tool.poetry.dependencies]`) se ejecuta en producción. Documenta por separado los linters, formateadores y frameworks de pruebas como herramientas de desarrollo.

**TODO de pruebas ≠ deuda de producción:** Los TODO de `test/`, `tests/`, `__tests__/` o `spec/` son carencias de cobertura, no deuda técnica de producción. Sepáralos en `CONCERNS.md`.

**Archivos con cambios frecuentes = áreas frágiles:** Los archivos que más aparecen en el historial reciente de Git tienen la mayor frecuencia de modificación y probablemente ocultan complejidad. Regístralos siempre en `CONCERNS.md`.

---

## Antipatrones

| Antipatrón | Qué hacer en su lugar |
|---------|--------------|
| "Usa Clean Architecture con capas Domain/Data." (cuando no existen esos directorios) | Afirma únicamente lo que muestra la estructura real de directorios. |
| "Este es un proyecto de Next.js." (sin revisar `package.json`) | Revisa primero `dependencies`. Indica lo que realmente contiene. |
| Adivinar la base de datos a partir de un nombre de variable como `dbUrl` | Busca `pg`, `mysql2`, `mongoose`, `prisma`, etc. en el manifiesto. |
| Documentar los patrones de nomenclatura de `dist/` o `build/` como convenciones | Utiliza únicamente los archivos fuente. |

---

## Secciones ampliadas de la salida del análisis

El script `scan.py` ahora genera las siguientes secciones, además de la salida original:

- **CODE METRICS** (métricas del código): total de archivos, líneas de código por lenguaje y archivos más grandes (indicios de complejidad)
- **CI/CD PIPELINES** (canalizaciones de CI/CD): GitHub Actions, GitLab CI, Jenkins, CircleCI, etc. detectados
- **CONTAINERS & ORCHESTRATION** (contenedores y orquestación): configuraciones de Docker, Docker Compose, Kubernetes y Vagrant
- **SECURITY & COMPLIANCE** (seguridad y cumplimiento): Snyk, Dependabot, SECURITY.md, SBOM y políticas de seguridad
- **PERFORMANCE & TESTING** (rendimiento y pruebas): configuraciones de pruebas comparativas, marcadores de análisis de rendimiento y herramientas de pruebas de carga

Usa estas secciones durante la fase 2 para orientar las preguntas de investigación e identificar patrones específicos de las herramientas.

---

## Recursos incluidos

| Recurso | Cuándo cargarlo |
|-------|-------------|
| [`scripts/scan.py`](scripts/scan.py) | Fase 1: ejecutar primero, antes de leer código (requiere Python 3.8+) |
| [`references/inquiry-checkpoints.md`](references/inquiry-checkpoints.md) | Fase 2: cargar para consultar las preguntas de investigación por plantilla |
| [`references/stack-detection.md`](references/stack-detection.md) | Fase 2: solo si el stack es ambiguo |
| [`assets/templates/STACK.md`](assets/templates/STACK.md) | Fase 3, paso 1 |
| [`assets/templates/STRUCTURE.md`](assets/templates/STRUCTURE.md) | Fase 3, paso 2 |
| [`assets/templates/ARCHITECTURE.md`](assets/templates/ARCHITECTURE.md) | Fase 3, paso 3 |
| [`assets/templates/CONVENTIONS.md`](assets/templates/CONVENTIONS.md) | Fase 3, paso 4 |
| [`assets/templates/INTEGRATIONS.md`](assets/templates/INTEGRATIONS.md) | Fase 3, paso 5 |
| [`assets/templates/TESTING.md`](assets/templates/TESTING.md) | Fase 3, paso 6 |
| [`assets/templates/CONCERNS.md`](assets/templates/CONCERNS.md) | Fase 3, paso 7 |

Modo de uso de las plantillas:

- Modo predeterminado: completa únicamente las "Secciones básicas (obligatorias)" de cada plantilla.
- Modo ampliado: añade secciones opcionales solo cuando lo justifique la complejidad del repositorio.

## Plantilla de salida

Cada uno de los siete archivos de `docs/codebase/` presenta primero las afirmaciones y después la evidencia que las respalda. Por ejemplo, `STACK.md`:

```markdown
## Stack

| Capa | Tecnología | Versión | Evidencia |
|---|---|---|---|
| Lenguaje | Java | 21 | backend/pom.xml |
| Framework | Spring Boot | 3.3.x | backend/pom.xml |
| Base de datos | PostgreSQL | 16 | compose.yml, application.yml |

### Datos desconocidos
- [TODO] No se encontró ninguna capa de caché en los manifiestos
- [ASK USER] ¿Está previsto usar Redis o se pretende usar caché en memoria?

### Evidencia
- backend/pom.xml
- compose.yml
```

## Puerta de calidad

- [ ] Existen exactamente los siete archivos en `docs/codebase/`, cada uno con sus secciones obligatorias.
- [ ] Cada afirmación no trivial se puede rastrear hasta un archivo, una configuración o una salida del terminal.
- [ ] Los datos desconocidos usan `[TODO]`; las decisiones que dependen de la intención usan `[ASK USER]`.
- [ ] Cada documento incluye una lista concreta de evidencias con rutas reales.
- [ ] La salida generada (`dist/`, `build/`, `.next/`) queda excluida de las afirmaciones sobre convenciones.
- [ ] La respuesta final presenta las preguntas `[ASK USER]` numeradas y cada diferencia entre intención y realidad.
