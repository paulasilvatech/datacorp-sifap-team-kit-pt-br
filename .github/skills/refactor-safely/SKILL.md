---
name: "refactor-safely"
description: "Úsala para refactorizar código legado, extraer un servicio o realizar cambios que preserven el comportamiento. Los desencadenantes incluyen \"refactorizar\", \"código legado\", \"strangler fig\", \"prueba de caracterización\" y \"método Mikado\"."
---
# Refactorización segura

## Cuándo invocar

- Al trabajar en código sin suficientes pruebas.
- Al dividir un monolito o extraer un servicio.
- Cuando un cambio es de "una línea", pero afecta a una ruta de riesgo.

## Primera regla

**La refactorización preserva el comportamiento.** Si no puedes demostrar que el comportamiento se conservó, no es una refactorización, sino una reescritura. Establece primero pruebas de caracterización.

## Flujo de trabajo

1. **Caracteriza**: escribe pruebas que fijen el comportamiento actual, incluidas sus peculiaridades. Aún no corrijas errores; el objetivo es una red de seguridad, no una corrección.
2. **Da pasos pequeños y reversibles**: aplica una transformación que preserve el comportamiento a la vez. Haz un commit después de cada una.
3. **Mantén las pruebas en verde**: ejecútalas después de cada paso. Revierte de inmediato si pasan a rojo y no sabes por qué.
4. **Separa los commits de refactorización de los que cambian el comportamiento**: así quienes revisan pueden concentrarse y bisect sigue siendo útil.
5. **Integra con frecuencia**: las ramas de refactorización de larga duración se deterioran.

## Patrones

### Strangler Fig (para sistemas)

1. Coloca una fachada (proxy, enrutador o bandera de funcionalidad) delante del sistema antiguo.
2. Dirige una pequeña porción del tráfico a la nueva implementación.
3. Amplía la nueva implementación por partes mientras reduces la antigua.
4. Elimina la implementación antigua cuando su tráfico llegue a cero.

### Método Mikado (para código)

1. Anota el objetivo.
2. Intenta alcanzarlo directamente; registra lo que se rompa como **prerrequisitos**.
3. Revierte. Resuelve primero un prerrequisito. Repite el proceso de forma recursiva.
4. Completa primero las hojas del árbol; alcanza el objetivo original al final.

### Ramificación mediante abstracción (Branch by Abstraction)

Introduce una interfaz, migra quienes la invocan, intercambia las implementaciones y retira la antigua, todo ello sin una rama de larga duración.

## Cómo crear pruebas de caracterización

- Ejecuta el código con entradas representativas y registra la salida (archivos de referencia o pruebas de instantáneas).
- Prefiere observar desde fuera (HTTP, CLI, estado de la base de datos); este enfoque resiste las refactorizaciones internas.
- Cubre también los casos inusuales; son los que fallan.
- Acepta que algunos comportamientos son *errores que ahora estás preservando*. Márcalos y corrígelos una vez establecida la red de seguridad.

## Antipatrones

- PR de "refactorización" que también corrigen errores, cambian API y renombran archivos; imposibles de revisar y de revertir.
- Reescrituras completas de una sola vez, sin entregas durante meses.
- Eliminar código antiguo antes de que el nuevo gestione el 100% del tráfico.
- Refactorizar sin pruebas y depender de la comprobación manual del flujo exitoso.

## Plantilla de salida

```markdown
## Plan de refactorización - <objetivo>

| Campo | Valor |
|---|---|
| Objetivo | <cambio que preserva el comportamiento> |
| Red de seguridad | <ruta de la prueba de caracterización> |
| Patrón | Strangler Fig / Mikado / Branch by Abstraction |
| Pasos | <transformaciones ordenadas y reversibles> |

### Prerrequisitos (Mikado)
- <prerrequisito descubierto al intentar alcanzar el objetivo>

### Commits
- refactor: <un paso que preserva el comportamiento por commit>
```

## Puerta de calidad

- [ ] Las pruebas de caracterización capturan el comportamiento actual (incluidas sus peculiaridades) antes de cualquier cambio.
- [ ] Los commits de refactorización están separados de los commits que cambian el comportamiento.
- [ ] Las pruebas siguen pasando después de cada paso; un paso en rojo se revierte en lugar de forzar su continuación.
- [ ] El código antiguo se elimina solo cuando la nueva ruta gestiona todo el tráfico.

## Referencias

- [Martin Fowler - Refactoring (2.ª edición)](https://martinfowler.com/books/refactoring.html)
- [Michael Feathers - Working Effectively with Legacy Code (trabajo eficaz con código legado)](https://www.oreilly.com/library/view/working-effectively-with/0131177052/)
- [Método Mikado](https://mikadomethod.info/)
- [Fowler - Aplicación del patrón Strangler Fig](https://martinfowler.com/bliki/StranglerFigApplication.html)
