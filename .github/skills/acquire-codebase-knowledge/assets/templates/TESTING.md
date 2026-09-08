# Patrones de pruebas

## Secciones básicas (obligatorias)

### 1) Stack de pruebas y comandos

- Framework principal de pruebas: [NAME + VERSION]
- Herramientas de aserciones y simulación: [TOOLS]
- Comandos:

```bash
[ejecutar todas las pruebas]
[ejecutar pruebas unitarias]
[ejecutar pruebas de integración/e2e]
[obtener cobertura]
```

### 2) Organización de las pruebas

- Patrón de ubicación de archivos de prueba: [junto al código/carpeta de pruebas/etc.]
- Convención de nomenclatura: [patrón]
- Archivos de preparación y dónde se ejecutan: [rutas]

### 3) Matriz de alcance de las pruebas

| Alcance | ¿Cubierto? | Objetivo habitual | Notas |
|-------|----------|----------------|-------|
| Unitarias | [sí/no] | [módulos/servicios] | [notas] |
| Integración | [sí/no] | [límites de API/datos] | [notas] |
| E2E | [sí/no] | [flujos de usuario] | [notas] |

### 4) Estrategia de simulación y aislamiento

- Enfoque principal de simulación: [módulo/clase/red]
- Garantías de aislamiento: [qué se restablece y cuándo]
- Modo de fallo habitual en las pruebas: [nota breve]

### 5) Cobertura e indicadores de calidad

- Herramienta de cobertura + umbral: [valor o TODO]
- Cobertura actual informada: [valor o TODO]
- Carencias conocidas y áreas con fallos intermitentes: [lista]

### 6) Evidencia

- [path/to/test-config]
- [path/to/representative-test-file]
- [path/to/ci-or-coverage-config]

## Secciones ampliadas (opcionales)

Añade estas secciones solo cuando sean necesarias:

- Patrones de suites específicos del framework
- Procedimientos detallados de simulación por tipo de dependencia
- Catálogo histórico de pruebas inestables
- Cuellos de botella de rendimiento en las pruebas e ideas de optimización
