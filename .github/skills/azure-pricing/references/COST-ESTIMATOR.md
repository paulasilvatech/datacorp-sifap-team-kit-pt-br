# Referencia para estimar costos

Fórmulas y patrones para convertir precios unitarios de Azure en estimaciones de costos mensuales y anuales.

## Cálculos estándar basados en el tiempo

### Horas por mes

Azure usa **730 horas/mes** como período de facturación estándar (365 días × 24 horas / 12 meses).

```
Costo mensual = Precio unitario por hora × 730
Costo anual   = Costo mensual × 12
```

### Multiplicadores habituales

| Período | Horas | Cálculo |
|--------|-------|-------------|
| 1 hora | 1 | Precio unitario |
| 1 día | 24 | Precio unitario × 24 |
| 1 semana | 168 | Precio unitario × 168 |
| 1 mes | 730 | Precio unitario × 730 |
| 1 año | 8,760 | Precio unitario × 8,760 |

## Fórmulas específicas por servicio

### Máquinas virtuales (proceso)

```
Costo mensual = precio por hora × 730
```

Para máquinas virtuales que solo funcionan en horario laboral (8h/día, 22 días/mes):

```
Costo mensual = precio por hora × 176
```

### Azure Functions

```
Costo de ejecución = precio por ejecución × número de ejecuciones
Costo de proceso   = precio por GB-s × (memoria en GB × tiempo de ejecución en segundos × número de ejecuciones)
Total mensual     = Costo de ejecución + Costo de proceso
```

Asignación gratuita: 1M de ejecuciones y 400,000 GB-s al mes.

### Azure Blob Storage

```
Costo de almacenamiento = precio por GB × almacenamiento en GB
Costo de transacciones = precio por 10,000 operaciones × (operaciones / 10,000)
Costo de salida de datos = precio por GB × salida de datos en GB
Total mensual = Costo de almacenamiento + Costo de transacciones + Costo de salida de datos
```

### Azure Cosmos DB

#### Rendimiento aprovisionado

```
Costo mensual = (RU/s / 100) × precio por 100 RU/s × 730
```

#### Sin servidor

```
Costo mensual = (total de RU consumidas / 1,000,000) × precio por 1M de RU
```

### Azure SQL Database

#### Modelo DTU

```
Costo mensual = precio por DTU × DTU × 730
```

#### Modelo vCore

```
Costo mensual = precio de vCore × vCores × 730  +  precio de almacenamiento por GB × GB de almacenamiento
```

### Azure Kubernetes Service (AKS)

```
Costo mensual = precio de la máquina virtual del nodo × 730 × número de nodos
```

El plano de control es gratuito en el nivel estándar.

### Azure App Service

```
Costo mensual = precio del plan × 730 (para planes con precio por hora)
```

O un precio mensual fijo para planes de nivel fijo.

### Azure OpenAI

```
Costo mensual = (tokens de entrada / 1000) × precio de entrada por 1K de tokens
              + (tokens de salida / 1000) × precio de salida por 1K de tokens
```

## Comparación de reservas frente a pago por uso

Al presentar opciones de precios, muestra siempre la comparación:

```
| Modelo de precios | Costo mensual | Costo anual | Ahorro frente a PAYG |
|---------------|-------------|-------------|------------------|
| Pago por uso | $X | $Y | — |
| Reserva de 1 año | $A | $B | Z% |
| Reserva de 3 años | $C | $D | W% |
| Plan de ahorro (1 año) | $E | $F | V% |
| Plan de ahorro (3 años) | $G | $H | U% |
| Spot (si está disponible) | $I | N/A | T% |
```

Fórmula del porcentaje de ahorro:

```
Ahorro % = ((Precio PAYG - Precio reservado) / Precio PAYG) × 100
```

## Plantilla de tabla de resumen de costos

Presenta siempre los resultados con este formato:

```markdown
| Servicio | SKU | Región | Precio unitario | Unidad | Est. mensual | Est. anual |
|---------|-----|--------|-----------|------|-------------|-------------|
| Virtual Machines | Standard_D4s_v5 | East US | $0.192/hr | 1 hora | $140.16 | $1,681.92 |
```

## Consejos

- Aclara siempre el **patrón de uso** antes de estimar (24/7, horario laboral o uso esporádico).
- Para **almacenamiento**, pregunta por el volumen de datos esperado y los patrones de acceso.
- Para **bases de datos**, pregunta por los requisitos de rendimiento (RU/s, DTU o vCores).
- Para servicios **sin servidor**, pregunta por el número y la duración esperados de las invocaciones.
- Redondea a 2 decimales para la presentación.
- Indica que los precios están en **USD**, salvo que se especifique otra moneda.
