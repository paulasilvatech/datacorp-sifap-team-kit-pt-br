# Stack tecnológico

## Secciones básicas (obligatorias)

### 1) Resumen del entorno de ejecución

| Área | Valor | Evidencia |
|------|-------|----------|
| Lenguaje principal | [VALUE] | [FILE_PATH] |
| Entorno de ejecución + versión | [VALUE] | [FILE_PATH] |
| Gestor de paquetes | [VALUE] | [FILE_PATH] |
| Sistema de módulos/compilación | [VALUE] | [FILE_PATH] |

### 2) Frameworks y dependencias de producción

Enumera únicamente las dependencias de producción de alto impacto (frameworks, datos, transporte y autenticación).

| Dependencia | Versión | Función en el sistema | Evidencia |
|------------|---------|----------------|----------|
| [NAME] | [VERSION] | [ROLE] | [FILE_PATH] |

### 3) Cadena de herramientas de desarrollo

| Herramienta | Finalidad | Evidencia |
|------|---------|----------|
| [TOOL] | [LINT/FORMAT/TEST/BUILD] | [FILE_PATH] |

### 4) Comandos principales

```bash
[comando de instalación]
[comando de compilación]
[comando de pruebas]
[comando de lint]
```

### 5) Entorno y configuración

- Fuentes de configuración: [lista de archivos]
- Variables de entorno obligatorias: [VAR_1], [VAR_2], [TODO]
- Restricciones de despliegue y ejecución: [nota breve]

### 6) Evidencia

- [path/to/manifest]
- [path/to/runtime-config]
- [path/to/build-or-ci-config]

## Secciones ampliadas (opcionales)

Añade estas secciones solo cuando sean necesarias en repositorios complejos:

- Taxonomía completa de dependencias por categoría
- Opciones detalladas del compilador y del entorno de ejecución
- Matriz de entornos (dev/stage/prod)
- Detalles del gestor de procesos y del entorno de ejecución de contenedores
