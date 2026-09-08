---
name: "context-audit"
description: "Úsala cuando una nueva persona de ingeniería se incorpore al equipo, durante la incorporación a una base de código desconocida o para auditar si el equipo comparte una comprensión común. Los desencadenantes incluyen \"incorporación\", \"contexto\", \"carencia de conocimiento\", \"factor de dependencia de personas\" y \"comprensión del equipo\"."
---
# Auditoría de contexto

## Cuándo invocar

- "Una nueva persona desarrolladora empieza el lunes. ¿Qué necesita saber en la semana 1?"
- "Audita si el equipo comprende realmente por qué elegimos X."
- "Nuestro factor de dependencia de personas es 1 para el módulo de facturación. Corrígelo."

## Objetivo

Mide la comprensión compartida del equipo, identifica el conocimiento concentrado en una sola persona y crea un itinerario de incorporación para la semana 1 de los nuevos integrantes.

## Preguntas de auditoría (pregunta a cada integrante del equipo en privado)

1. ¿Puedes dibujar la arquitectura del sistema en una pizarra en 5 minutos?
2. ¿Cuáles son los 3 invariantes más importantes que debe preservar este sistema?
3. ¿Dónde está el código de mayor riesgo? ¿Quién lo comprende mejor?
4. ¿Qué no cambiarías nunca sin una revisión sénior? ¿Por qué?
5. ¿Qué partes evitas cambiar personalmente? ¿Por qué?

Si las respuestas difieren de forma significativa, el equipo tiene una carencia de contexto.

## Antipatrones

- "La incorporación consiste solo en nuestros README." (Insuficiente porque los README omiten el conocimiento tácito).
- Un plan para la semana 1 sin programación ni operación del sistema.
- Ninguna mención de invariantes o modos de fallo.
- Conocimiento en manos únicamente de profesionales sénior, sin rastro documental.

## Plantilla de salida

### 1. Mapa compartido de arquitectura (1 página)

- Diagrama Mermaid de los servicios y el flujo de datos
- Lista de integraciones externas y sus responsables
- Lista de invariantes (reglas de negocio que deben permanecer intactas)

### 2. Mapa de calor de riesgos

```
| Módulo | Criticidad | Factor de dependencia de personas | Última refactorización | Responsable |
|----------|-------------|------------|----------------|-------|
| billing | Alta | 1 (Alex) | Hace 2 años | Alex |
| auth | Alta | 3 | Hace 6 meses | Equipo |
```

Cualquier fila con un factor de dependencia de personas de 1 para un módulo de alta criticidad exige una acción P0.

### 3. Guía operativa de la semana 1 para una nueva persona del equipo

- Día 1: lee estos 5 ADR y ejecuta el stack localmente.
- Día 2: trabaja en pareja con Alex en facturación y entrega una mejora de documentación.
- Día 3: acompaña a la persona de guardia.
- Día 4: toma un ticket "inicial" con revisión en pareja.
- Día 5: realiza una retrospectiva con la persona líder técnica. ¿Qué sigue sin estar claro?

## Puerta de calidad

- [ ] Existen el mapa compartido de arquitectura, el mapa de calor de riesgos y la guía operativa de la semana 1.
- [ ] Cada módulo de alta criticidad con un factor de dependencia de personas de 1 tiene una acción correctiva P0.
- [ ] La guía operativa incluye tareas de programación y operación del sistema, no solo lectura.
- [ ] Una nueva persona de ingeniería puede entregar un cambio de bajo riesgo al finalizar la semana 1, con revisión en pareja.
