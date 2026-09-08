# Arquitectura

## Secciones básicas (obligatorias)

### 1) Estilo arquitectónico

- Estilo principal: [por capas/por funcionalidad/orientado a eventos/otro]
- Motivo de esta clasificación: [justificación breve respaldada por evidencia]
- Restricciones principales: [2-3 restricciones que condicionan el diseño]

### 2) Flujo del sistema

```text
[entrada] -> [procesamiento] -> [lógica de dominio] -> [datos/integración] -> [respuesta/salida]
```

Describe el flujo en 4-6 pasos con evidencia respaldada por archivos.

### 3) Responsabilidades de las capas y los módulos

| Capa o módulo | Es responsable de | No debe ser responsable de | Evidencia |
|-----------------|------|--------------|----------|
| [nombre] | [responsabilidad] | [responsabilidad ajena] | [archivo] |

### 4) Patrones reutilizados

| Patrón | Dónde se encuentra | Por qué existe |
|---------|-------------|---------------|
| [singleton/repositorio/adaptador/etc.] | [ruta] | [motivo] |

### 5) Riesgos arquitectónicos conocidos

- [Riesgo 1 + impacto]
- [Riesgo 2 + impacto]

### 6) Evidencia

- [path/to/entrypoint]
- [path/to/main-layer-files]
- [path/to/data-or-integration-layer]

## Secciones ampliadas (opcionales)

Añade estas secciones solo cuando sean necesarias:

- Detalles del orden de arranque o inicialización
- Diagramas de la topología asíncrona o de eventos
- Catálogo de antipatrones con alternativas de refactorización
- Análisis de modos de fallo y estado de la resiliencia
