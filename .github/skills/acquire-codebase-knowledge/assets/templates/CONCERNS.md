# Aspectos problemáticos de la base de código

## Secciones básicas (obligatorias)

### 1) Riesgos principales (priorizados)

| Gravedad | Problema | Evidencia | Impacto | Acción sugerida |
|----------|---------|----------|--------|------------------|
| [alta/media/baja] | [problema] | [archivo o salida del análisis] | [impacto] | [siguiente acción] |

### 2) Deuda técnica

Enumera únicamente los elementos de deuda más importantes.

| Elemento de deuda | Por qué existe | Dónde | Riesgo de ignorarlo | Corrección sugerida |
|-----------|---------------|-------|-----------------|---------------|
| [elemento] | [motivo] | [ruta] | [riesgo] | [corrección] |

### 3) Problemas de seguridad

| Riesgo | Categoría OWASP (si corresponde) | Evidencia | Mitigación actual | Carencia |
|------|--------------------------------|----------|--------------------|-----|
| [riesgo] | [A01/A03/etc. o N/A] | [ruta] | [lo que existe] | [lo que falta] |

### 4) Problemas de rendimiento y escalabilidad

| Problema | Evidencia | Síntoma actual | Riesgo al escalar | Mejora sugerida |
|---------|----------|-----------------|-------------|-----------------------|
| [problema] | [ruta/métrica] | [síntoma] | [riesgo] | [acción] |

### 5) Áreas frágiles o con cambios frecuentes

| Área | Motivo de su fragilidad | Indicio de cambios frecuentes | Estrategia de cambio seguro |
|------|-------------|-------------|----------------------|
| [ruta] | [motivo] | [evidencia de cambios recientes] | [enfoque] |

### 6) Preguntas `[ASK USER]`

Añade en una lista numerada las preguntas pendientes cuya respuesta dependa de la intención.

1. [ASK USER] [pregunta]

### 7) Evidencia

- [referencia a la sección de salida del análisis]
- [path/to/code-file]
- [path/to/config-or-history-evidence]

## Secciones ampliadas (opcionales)

Añade estas secciones solo cuando sean necesarias:

- Inventario completo de errores
- Hoja de ruta de corrección por componente
- Estimaciones de costo y esfuerzo por problema
- Mapa de riesgos de dependencias y responsables
