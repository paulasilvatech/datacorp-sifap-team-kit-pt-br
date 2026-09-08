# Puntos de control de la investigación

Preguntas de investigación por plantilla para la fase 2 del flujo de trabajo de acquire-codebase-knowledge. Para cada área de la plantilla, busca primero las respuestas en la salida del análisis y luego lee los archivos fuente para cubrir las carencias.

---

## 1. STACK.md — Stack tecnológico

- ¿Cuál es el lenguaje principal y su versión exacta? (Revisa `.nvmrc`, `go.mod`, `pyproject.toml` y la línea `FROM` de Docker).
- ¿Qué gestor de paquetes se utiliza? (`npm`, `yarn`, `pnpm`, `go mod`, `pip`, `uv`).
- ¿Cuáles son los frameworks principales de ejecución? (Servidor web, ORM, contenedor de inyección de dependencias).
- ¿Qué contienen `dependencies` (producción) y `devDependencies` (herramientas de desarrollo)?
- ¿Existe una imagen de Docker y qué imagen base utiliza?
- ¿Cuáles son los scripts principales de `package.json` / `Makefile` / `pyproject.toml`?

## 2. STRUCTURE.md — Organización de directorios

- ¿Dónde se encuentra el código fuente? (Por lo general, en `src/`, `lib/` o la raíz del proyecto en Go).
- ¿Cuáles son los puntos de entrada? (Revisa `main` en `package.json`, `scripts.start`, `cmd/main.go`, `app.py`).
- ¿Cuál es la finalidad declarada de cada directorio del nivel superior?
- ¿Hay directorios cuya finalidad no sea evidente (por ejemplo, `eng/`, `platform/`, `infra/`)?
- ¿Hay directorios ocultos de configuración (`.github/`, `.vscode/`, `.husky/`)?
- ¿Qué convenciones de nomenclatura siguen los directorios? (camelCase, kebab-case, organización por dominio o por capa).

## 3. ARCHITECTURE.md — Patrones

- ¿El código está organizado por capas (controladores → servicios → repositorios) o por funcionalidad?
- ¿Cuál es el flujo principal de datos? Sigue una solicitud o un comando desde la entrada hasta el almacén de datos.
- ¿Hay singletons, patrones de inyección de dependencias o requisitos explícitos sobre el orden de inicialización?
- ¿Hay procesos en segundo plano, colas o componentes orientados a eventos?
- ¿Qué patrones de diseño aparecen de forma recurrente? (Factory, Repository, Decorator, Strategy).

## 4. CONVENTIONS.md — Estándares de código

- ¿Cuál es la convención de nomenclatura de archivos? (Revisa 10 o más archivos: camelCase, kebab-case, PascalCase).
- ¿Cuál es la convención de nomenclatura de funciones y variables?
- ¿Los métodos o campos privados llevan prefijos (por ejemplo, `_methodName`, `#field`)?
- ¿Qué linter y formateador están configurados? (Revisa `.eslintrc`, `.prettierrc`, `golangci.yml`).
- ¿Qué opciones de comprobación estricta utiliza TypeScript? (`strict`, `noImplicitAny`, etc.).
- ¿Cómo se gestionan los errores en cada capa? (Lanzar una excepción o devolver un error estructurado).
- ¿Qué biblioteca de registro se utiliza y cuál es el formato de los mensajes de registro?
- ¿Cómo se organizan las importaciones? (Exportaciones mediante archivos índice, alias de rutas y reglas de agrupación).

## 5. INTEGRATIONS.md — Servicios externos

- ¿A qué API externas se llama? (Busca `axios.`, `fetch(`, `http.Get(` y URL base en constantes).
- ¿Cómo se almacenan las credenciales y cómo se accede a ellas? (`.env`, gestor de secretos, variables de entorno).
- ¿A qué bases de datos se conecta el sistema? (Busca `pg`, `mongoose`, `prisma`, `typeorm`, `sqlalchemy` en el manifiesto).
- ¿Hay una puerta de enlace de API, una malla de servicios o un proxy entre la aplicación y los servicios externos?
- ¿Qué herramientas de supervisión u observabilidad se utilizan? (APM, Prometheus, canalización de registros).
- ¿Hay colas de mensajes o buses de eventos? (Kafka, RabbitMQ, SQS, Pub/Sub).

## 6. TESTING.md — Configuración de pruebas

- ¿Qué ejecutor de pruebas está configurado? (Revisa `scripts.test` en `package.json`, `pytest.ini`, `go test`).
- ¿Dónde se encuentran los archivos de prueba? (Junto al código fuente, en `tests/`, en `__tests__/`).
- ¿Qué biblioteca de aserciones se utiliza? (Jest expect, Chai, pytest assert).
- ¿Cómo se simulan las dependencias externas? (jest.mock, inyección de dependencias, fixtures).
- ¿Hay pruebas de integración que accedan a servicios reales, a diferencia de las pruebas unitarias con simulaciones?
- ¿Se exige un umbral de cobertura? (Revisa `jest.config.js`, `.nycrc`, `pyproject.toml`).

## 7. CONCERNS.md — Problemas conocidos

- ¿Cuántos TODO/FIXME/HACK hay en el código de producción? (Consulta la salida del análisis).
- ¿Qué archivos acumulan más cambios en Git en los últimos 90 días? (Consulta la salida del análisis).
- ¿Hay archivos de más de 500 líneas que mezclen varias responsabilidades?
- ¿Hay servicios que hagan llamadas secuenciales que podrían paralelizarse?
- ¿Hay valores incrustados en el código (URL, ID, números mágicos) que deberían formar parte de la configuración?
- ¿Qué riesgos de seguridad existen? (Falta de validación de entradas, mensajes de error sin filtrar expuestos a clientes, ausencia de comprobaciones de autenticación).
- ¿Hay patrones de rendimiento que no escalen? (Consultas N+1, cachés en memoria en configuraciones con varias instancias).
