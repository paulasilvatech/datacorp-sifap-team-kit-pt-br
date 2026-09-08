---
name: "test-strategy"
description: "Úsala para diseñar una estrategia de pruebas, elegir la forma de la pirámide de pruebas, definir objetivos de cobertura o evaluar la inversión en pruebas unitarias, de integración y E2E. Los desencadenantes incluyen \"estrategia de pruebas\", \"pirámide de pruebas\", \"objetivo de cobertura\", \"E2E frente a integración\" e \"inversión en pruebas\"."
---
# Estrategia de pruebas

## Cuándo invocar

- "Diseña una estrategia de pruebas para…"
- "¿Qué proporción de pruebas unitarias, de integración y E2E conviene?"
- "¿Cuál es el objetivo de cobertura adecuado?"
- "Audita nuestra pirámide de pruebas."

## Flujo de trabajo

1. **Inventaría** el código bajo prueba: módulos, API públicas, integraciones externas y rutas críticas.
2. **Clasifica el riesgo** por módulo (P0 / P1 / P2) según el alcance del impacto si falla.
3. **Distribuye la pirámide**: parte de un objetivo de 70% de pruebas unitarias, 20% de integración y 10% E2E; justifica las desviaciones.
4. **Define los objetivos de cobertura**: una base de 80% de cobertura de líneas y 90% para los módulos P0, con seguimiento separado de la cobertura de ramas.
5. **Define el límite de inestabilidad de las pruebas**: una tasa máxima de fallos intermitentes del 1%; cualquier valor superior activa la cuarentena.
6. **Elige las herramientas por nivel**: unitarias (Vitest/JUnit/pytest), integración (Testcontainers), E2E (Playwright).
7. **Salida**: un documento de estrategia de una página con objetivos por nivel, herramientas, umbrales de cobertura y reglas de cuarentena.

## Criterios orientativos

- Si una prueba E2E puede reescribirse como una prueba de integración y de contrato, hazlo; las pruebas E2E son costosas e inestables.
- Las pruebas de contrato son mejores que las simulaciones para todo lo que cruza el límite de un servicio.
- Las pruebas de mutación (Stryker, PIT) son la única forma honesta de detectar pruebas que no demuestran nada.

## Antipatrones

- Pirámide invertida: muchas pruebas E2E lentas apoyadas sobre pocas pruebas unitarias.
- Una única cifra global de cobertura, sin un objetivo más alto para los módulos P0.
- Límites de servicio simulados que nunca detectan una rotura real de integración.
- Tratar la cobertura como un objetivo en lugar de como un indicador de confianza.

## Plantilla de salida

```markdown
## Estrategia de pruebas - <sistema o módulo>

| Nivel | Distribución objetivo | Herramientas | Objetivo de cobertura |
|---|---|---|---|
| Unitarias | 70% | JUnit 5 / Vitest | 80% de líneas (90% para P0) |
| Integración | 20% | Testcontainers | Rutas críticas |
| E2E | 10% | Playwright | Recorridos principales de usuario |

**Límite de inestabilidad de las pruebas**: <=1% (cuarentena si se supera)
**Clasificación de riesgo**: P0 <módulos> / P1 <módulos> / P2 <módulos>
```

## Puerta de calidad

- [ ] Cada módulo tiene una clasificación de riesgo (P0/P1/P2) y un objetivo de cobertura.
- [ ] La distribución de la pirámide se define por nivel y se justifican las desviaciones respecto de 70/20/10.
- [ ] Cada nivel indica su herramienta y su umbral.
- [ ] Se definen un límite de inestabilidad de las pruebas y una regla de cuarentena.

## Referencias

- [Google Testing Blog - Tamaños de las pruebas](https://testing.googleblog.com/2010/12/test-sizes.html)
- [Programa de nivel básico de ISTQB](https://www.istqb.org/certifications/certified-tester-foundation-level)
- [Martin Fowler - Pirámide práctica de pruebas](https://martinfowler.com/articles/practical-test-pyramid.html)
