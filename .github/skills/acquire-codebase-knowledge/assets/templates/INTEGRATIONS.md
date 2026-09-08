# Integraciones externas

## Secciones básicas (obligatorias)

### 1) Inventario de integraciones

| Sistema | Tipo (API/BD/cola/etc.) | Finalidad | Modelo de autenticación | Criticidad | Evidencia |
|--------|---------------------------|---------|------------|-------------|----------|
| [nombre] | [tipo] | [finalidad] | [autenticación] | [alta/media/baja] | [archivo] |

### 2) Almacenes de datos

| Almacén | Función | Capa de acceso | Riesgo principal | Evidencia |
|-------|------|--------------|----------|----------|
| [BD/caché/etc.] | [función] | [módulo] | [riesgo] | [archivo] |

### 3) Gestión de secretos y credenciales

- Fuentes de credenciales: [entorno/gestor de secretos/configuración]
- Comprobaciones de valores incrustados en el código: [resultado]
- Notas sobre rotación o ciclo de vida: [conocido/desconocido]

### 4) Fiabilidad y comportamiento ante fallos

- Comportamiento de reintentos y espera progresiva: [implementado/ninguno/parcial]
- Política de tiempos de espera: [dónde se configura]
- Comportamiento del disyuntor (circuit breaker) o del mecanismo alternativo: [si existe]

### 5) Observabilidad de las integraciones

- Registros de las llamadas externas: [sí/no + dónde]
- Cobertura de métricas y trazas: [sí/no + dónde]
- Carencias de visibilidad: [lista]

### 6) Evidencia

- [path/to/integration-wrapper]
- [path/to/config-or-env-template]
- [path/to/monitoring-or-logging-config]

## Secciones ampliadas (opcionales)

Añade estas secciones solo cuando sean necesarias:

- Catálogo detallado de puntos de conexión
- Diagramas de secuencia de los flujos de autenticación
- SLA/SLO por integración
- Notas sobre la topología de regiones y conmutación por error
