# Fuentes de orientación arquitectónica (para decisiones de diseño)

Registro de fuentes para usar las guías oficiales de arquitectura de Azure **solo para orientar las decisiones de diseño**.

> **Las URL de este documento son una lista de fuentes que indican "dónde consultar".**
> No conviertas el contenido de estas URL en hechos fijos.
> No las uses para decidir SKU, versiones de API, regiones, disponibilidad de modelos ni correspondencias de PE; esas decisiones se gestionan exclusivamente mediante `azure-dynamic-sources.md`.

---

## Separación de finalidades

| Finalidad | Documento que se debe usar | Aspectos que permite decidir |
|---------|----------------|-----------------|
| **Orientación de las decisiones de diseño** | Este documento (architecture-guidance-sources) | Patrones de arquitectura, buenas prácticas, orientación para combinar servicios y diseño de límites de seguridad |
| **Verificación de especificaciones de despliegue** | `azure-dynamic-sources.md` | Versión de API, SKU, región, disponibilidad de modelos, groupId de PE y valores reales de propiedades |

**Qué NO debe decidirse con este documento:**

- Versión de API
- Nombres y precios de SKU
- Disponibilidad regional
- Nombres, versiones y tipos de despliegue de modelos
- Correspondencias de groupId de PE y zonas DNS
- Valores concretos de propiedades de recursos

---

## Fuentes principales

Fuentes de consulta específica para orientar decisiones de diseño.

| ID | Documento | URL | Finalidad |
|----|----------|-----|---------|
| A1 | Azure Architecture Center | https://learn.microsoft.com/en-us/azure/architecture/ | Centro de referencia: punto de entrada para encontrar documentos específicos de cada dominio |
| A2 | Well-Architected Framework | https://learn.microsoft.com/en-us/azure/architecture/framework/ | Principios de seguridad, fiabilidad, rendimiento, costo y operaciones |
| A3 | Cloud Adoption Framework / Zona de aterrizaje | https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/ | Gobernanza empresarial, topología de red y estructura de suscripciones |
| A4 | Arquitectura de IA/ML en Azure | https://learn.microsoft.com/en-us/azure/architecture/ai-ml/ | Centro de arquitecturas de referencia para cargas de trabajo de IA/ML |
| A5 | Arquitectura de referencia básica de chat con Foundry | https://learn.microsoft.com/en-us/azure/architecture/ai-ml/architecture/basic-azure-ai-foundry-chat | Estructura básica de chatbot basado en Foundry |
| A6 | Arquitectura de referencia base de chat con AI Foundry | https://learn.microsoft.com/en-us/azure/architecture/ai-ml/architecture/baseline-openai-e2e-chat | Base empresarial de chatbot de Foundry (incluido el aislamiento de red) |
| A7 | Guía de diseño de soluciones RAG | https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide | Guía de diseño de patrones RAG |
| A8 | Descripción general de Microsoft Fabric | https://learn.microsoft.com/en-us/fabric/get-started/microsoft-fabric-overview | Visión general de la plataforma Fabric y comprensión de sus cargas de trabajo |
| A9 | Gobernanza y adopción de Fabric | https://learn.microsoft.com/en-us/power-bi/guidance/fabric-adoption-roadmap-governance | Gobernanza de Fabric y hoja de ruta de adopción |

## Fuentes secundarias (solo información complementaria)

No son destinos de consulta directa; se referencian únicamente para conocer cambios.

| Documento | URL | Notas |
|----------|-----|-------|
| Azure Updates | https://azure.microsoft.com/en-us/updates/ | Cambios de servicios y anuncios de nuevas funcionalidades. No es una fuente de consulta específica |

---

## Desencadenantes de consulta: cuándo consultar

Los documentos de orientación arquitectónica **no se consultan en cada solicitud**. Realiza consultas específicas solo cuando se apliquen los desencadenantes siguientes.

### Condiciones de activación

0. **Cuando se identifica el tipo de carga de trabajo en la fase 1 (automático)**
   - Consulta previamente la arquitectura de referencia de esa carga para ajustar la profundidad de las preguntas
   - Se activa automáticamente aunque la persona no mencione "buenas prácticas", etc.
   - Finalidad: incorporar a las preguntas decisiones de diseño basadas en arquitectura oficial, más allá de especificaciones de SKU o región
1. **Cuando la persona solicita justificar la orientación del diseño**
   - Palabras clave como "buenas prácticas", "arquitectura de referencia", "estructura recomendada", "base de referencia", "well-architected", "zona de aterrizaje", "patrón empresarial"
2. **Cuando los límites de arquitectura de una nueva combinación de servicios son ambiguos**
   - Relaciones entre servicios que no pueden determinarse con los archivos de referencia o service-gotchas existentes
3. **Cuando se necesita diseñar seguridad o gobernanza de nivel empresarial**
   - Estructura de suscripciones, topología de red y patrones de zonas de aterrizaje

### Cuando no se aplican los desencadenantes

- Creación sencilla de recursos (preguntas sobre SKU, versión de API o región) → Usar solo `azure-dynamic-sources.md`
- Combinaciones de servicios ya cubiertas en domain-packs → Priorizar los archivos de referencia
- Verificación de valores de propiedades Bicep → `service-gotchas.md` o referencia de Bicep en MS Docs

---

## Límite de consultas

| Escenario | Número máximo de consultas |
|----------|----------------|
| Predeterminado (cuando se activa un desencadenante) | **Hasta 2** documentos de orientación arquitectónica |
| Se permiten consultas adicionales cuando | Hay conflictos entre documentos / persiste incertidumbre esencial de diseño / la persona solicita explícitamente una justificación más profunda |
| Preguntas sencillas sobre especificaciones de despliegue | **0** (sin consultas de orientación arquitectónica) |

---

## Regla de decisión por tipo de pregunta

| Tipo de pregunta | Documentos que consultar | Decisiones de diseño que extraer | Documentos que NO consultar |
|--------------|-------------------|----------------------------------|----------------------|
| RAG / chatbot / aplicación Foundry | A5 o A6 + A7 | Nivel de aislamiento de red, método de autenticación (identidad administrada frente a clave), estrategia de indexación (push frente a pull), alcance de la supervisión | No recorrer todo Architecture Center |
| Seguridad empresarial / gobernanza / zona de aterrizaje | A2 + A3 | Estructura de suscripciones, topología de red (hub-spoke, etc.), modelo de identidad y gobernanza, límite de seguridad | No se necesitan documentos del dominio IA/ML |
| Plataforma de datos Fabric | A8 + A9 | Modelo de capacidad (criterios de selección de SKU), nivel de gobernanza, límite de datos (separación de áreas de trabajo, etc.) | No se necesitan documentos relacionados con IA |
| Combinación de servicios ambigua (patrón poco claro) | A1 (encontrar en el centro de referencia el documento de dominio más cercano) + ese documento | Decisiones de diseño principales identificadas en el documento | No recorrer todos los subdocumentos |
| Valores sencillos para crear recursos (SKU/API/región) | Sin consulta | — | Toda la orientación arquitectónica |
| Arquitectura general de IA/ML | A4 (centro de referencia) + arquitectura de referencia más cercana | Aislamiento de proceso, límite de datos, enfoque de servicio de modelos | No rastrear todo el contenido |

---

## Regla de alternativa para URL

1. Usa URL de Learn `en-us` de forma predeterminada
2. Si una URL concreta devuelve 404, redirige o está obsoleta → Recurre a la página del centro de referencia superior
   - Ejemplo: si A5 falla → Busca la palabra clave "foundry chat" en A4 (centro de IA/ML)
3. Si tampoco se encuentra allí → Busca una palabra clave del título en A1 (página principal de Architecture Center)
4. **No uses el contenido de una URL como reglas fijas solo porque la URL exista**

---

## Recorrido completo prohibido

- No rastrees de forma amplia los subdocumentos de Architecture Center
- Consulta específicamente solo 1–2 documentos relacionados, según la regla de decisión por tipo de pregunta
- Incluso dentro de los documentos consultados, usa solo las secciones pertinentes; no leas el documento completo
- Se prohíben las consultas ilimitadas, el seguimiento recursivo de enlaces y la enumeración de subpáginas
