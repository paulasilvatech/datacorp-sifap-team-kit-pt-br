# Estructura de la base de código

## Secciones básicas (obligatorias)

### 1) Mapa del nivel superior

Enumera únicamente los directorios y archivos relevantes del nivel superior.

| Ruta | Finalidad | Evidencia |
|------|---------|----------|
| [path/] | [finalidad] | [fuente] |

### 2) Puntos de entrada

- Punto de entrada principal de ejecución: [FILE]
- Puntos de entrada secundarios (worker/CLI/tareas): [FILES o NONE]
- Cómo se selecciona el punto de entrada (script/configuración): [NOTE]

### 3) Límites de los módulos

| Límite | Qué corresponde aquí | Qué no debe estar aquí |
|----------|-------------------|------------------------|
| [módulo/capa] | [responsabilidad] | [lógica no permitida] |

### 4) Reglas de nomenclatura y organización

- Patrón de nomenclatura de archivos: [kebab/camel/Pascal + ejemplos]
- Patrón de organización de directorios: [funcionalidad/capa/dominio]
- Convenciones de alias de importación o rutas: [RULE]

### 5) Evidencia

- [path/to/root-tree-source]
- [path/to/entry-config]
- [path/to/key-module]

## Secciones ampliadas (opcionales)

Añade estas secciones solo cuando lo exija la complejidad del repositorio:

- Mapas detallados de subdirectorios por funcionalidad o capa
- Detalles del orden del middleware y del arranque
- Límites de organización entre archivos generados y archivos fuente
- Mapas de estructura de los espacios de trabajo del monorepositorio
