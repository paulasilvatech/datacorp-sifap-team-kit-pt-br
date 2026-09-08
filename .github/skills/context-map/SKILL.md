---
name: "context-map"
description: "Genera un mapa de los archivos relevantes para una tarea, incluidos archivos que modificar, dependencias, pruebas relacionadas, patrones de referencia y riesgos, antes de escribir código. Úsala cuando la persona quiera delimitar el impacto, planificar cambios o comprender qué archivos afecta una tarea antes de implementarla."
---
# Mapa de contexto

Crea un mapa escrito de todo lo que afecta una tarea antes de escribir código. El mapa convierte un cambio abierto en un plan delimitado y revisable para que quien implemente edite los archivos correctos, actualice los componentes dependientes adecuados, escriba las pruebas pertinentes y conozca los riesgos desde el principio.

> [!IMPORTANT]
> No empieces la implementación hasta que el mapa de contexto esté escrito y revisado. El mapa es el artefacto que produce esta skill; la programación comienza solo después de acordarlo.

## Cuándo invocar

- "Delimita el impacto de añadir un campo de estado a la API de pagos antes de que lo programe."
- "¿Qué archivos afecta esta refactorización y qué pruebas los cubren?"
- "Mapea el alcance del impacto de cambiar esta interfaz de repositorio."
- "Planifica los cambios de archivos para esta funcionalidad de la etapa 3 antes de implementarla."

## Cómo construir el mapa

1. **Reformula la tarea en una frase.** Indica el resultado observable, no el detalle de implementación.
2. **Localiza los puntos de entrada.** Encuentra los archivos responsables del comportamiento: controladores, servicios, componentes o migraciones.
3. **Rastrea las dependencias directas.** Sigue las importaciones y exportaciones de cada archivo para descubrir qué falla si cambia una firma.
4. **Encuentra las pruebas.** Identifica las pruebas unitarias y de integración que ya cubren el código afectado y anota dónde falta cobertura.
5. **Recopila patrones de referencia.** Señala un archivo existente que ya resuelva un problema similar para reutilizar su estructura.
6. **Evalúa el riesgo.** Señala explícitamente los cambios de API públicas, migraciones de bases de datos y cambios de configuración o secretos.

> [!NOTE]
> En esta inmersión, `backend/` y `frontend/` no existen hasta la etapa 3, así que el mapa de una funcionalidad nueva enumera archivos que **crear**, no solo archivos que modificar. `infra/` ya existe. Trata todo el contenido de `01-archaeology/legacy-sifap/` como evidencia de solo lectura y nunca afirmes qué contiene un programa o campo legado; cita en su lugar la puerta de lectura de [`01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md`](../../../01-archaeology/LEGACY-EXPLORATION-CHECKLIST.md).

## Indicadores de alcance

| Indicador | Significado | Acción |
|---|---|---|
| El cambio afecta a un contrato público `/api/v1` | El impacto alcanza a todos sus consumidores | Enumera los consumidores y planifica una nota de compatibilidad de API |
| El cambio altera una entidad JPA o un esquema | Se requiere una migración | Añade una fila `db/migration` al mapa |
| Ninguna prueba cubre el código de destino | Riesgo de regresión | Añade una fila "prueba por escribir" antes de programar |
| Ya existe una funcionalidad similar | Oportunidad de reutilización | Regístrala como patrón de referencia que seguir |

## Plantilla de salida

```markdown
## Mapa de contexto: añadir un campo de estado a Payment

### Archivos que crear o modificar
| Archivo | Crear o modificar | Finalidad | Cambio |
|---|---|---|---|
| backend/src/main/java/com/sifap/payment/PaymentController.java | Modificar | Punto de entrada REST | Añadir PATCH `/api/v1/payments/{id}/status` |
| backend/src/main/java/com/sifap/payment/PaymentStatus.java | Crear | Enumeración de estados | Definir los valores y las transiciones permitidos |

### Dependencias que comprobar
| Archivo | Relación |
|---|---|
| backend/src/main/java/com/sifap/payment/PaymentService.java | Invoca el mapeo modificado del controlador |
| frontend/app/payments/page.tsx | Muestra el estado devuelto por la API |

### Pruebas
| Prueba | Estado | Cobertura |
|---|---|---|
| backend/src/test/java/com/sifap/payment/PaymentControllerTest.java | Existe | Ampliar para el nuevo punto de conexión |
| Prueba de transición de PaymentStatus | Por escribir | Nuevo comportamiento de la máquina de estados |

### Patrones de referencia
| Archivo | Patrón que seguir |
|---|---|
| backend/src/main/java/com/sifap/benefit/BenefitController.java | Estructura existente de PATCH con `@Valid` |

### Riesgos
- [ ] Cambio incompatible en un contrato público `/api/v1`
- [ ] Se requiere una migración de base de datos
- [ ] Se requiere un cambio de configuración o secretos
- [ ] El comportamiento legado debe confirmarse con la evidencia de solo lectura de `01-archaeology/legacy-sifap/`
```

## Puerta de calidad

- [ ] Cada archivo que afecta la tarea figura como archivo que crear o modificar, con el cambio concreto descrito.
- [ ] Se enumeran los componentes que dependen directamente de cada firma modificada.
- [ ] Se identifican las pruebas existentes y las que faltan se marcan como "por escribir".
- [ ] Se cita al menos un patrón de referencia o se declara su ausencia.
- [ ] Los riesgos de API públicas, migración y configuración se señalan antes de empezar a programar.
- [ ] Todo elemento derivado del legado cita evidencia de solo lectura y no afirma contenidos de los programas legados.
