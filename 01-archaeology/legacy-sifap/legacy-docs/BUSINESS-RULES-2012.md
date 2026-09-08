---
title: "Reglas de negocio de SIFAP - Levantamiento parcial"
author: "Ana Cristina Barros - Analista de Negocio de SENARC"
date: "2012-08-14"
version: "1.0.0-DRAFT"
classification: "RESTRICTED"
status: "INCOMPLETE - Levantamiento interrumpido"
distribution: "SENARC/CGPB, SUPDE/DESIF, CGTI/MDAS"
revision_history:

- version: "0.1.0"
 date: "2012-06-04"
 author: "Ana Cristina Barros"
 description: "Inicio del levantamiento - módulo de registro"
- version: "0.5.0"
 date: "2012-07-10"
 author: "Ana Cristina Barros"
 description: "Inclusión parcial de los módulos de cálculo y descuentos"
- version: "1.0.0-DRAFT"
 date: "2012-08-14"
 author: "Ana Cristina Barros"
 description: "Última versión - levantamiento interrumpido"

---

> [!NOTE]
> Este es un documento histórico reconstruido para el ejercicio de arqueología de la inmersión SIFAP 2.0. Simula el levantamiento parcial de reglas de negocio realizado en 2012 por el equipo SENARC/CGPB. Se han conservado intencionalmente el lenguaje de la época, los nombres de las personas, las incertidumbres y las lagunas documentadas. **Este documento no debe utilizarse como especificación actual del sistema.** Las reglas marcadas como `[PENDING]`, los comentarios sobre incoherencias y los elementos no verificados forman parte del ejercicio: representan el verdadero desafío de extracción de conocimiento que el equipo debe abordar durante la arqueología.

<!-- ====================================================================== -->
<!-- REGLAS DE NEGOCIO DE SIFAP - LEVANTAMIENTO PARCIAL -->
<!-- Sistema de Fiscalización y Administración de Pagos -->
<!-- SENARC - Secretaría Nacional de Renta de Ciudadanía -->
<!-- En colaboración con SUPDE/DESIF (la organización) -->
<!-- ====================================================================== -->

# REGLAS DE NEGOCIO DE SIFAP - LEVANTAMIENTO PARCIAL

**SISTEMA DE FISCALIZACIÓN Y ADMINISTRACIÓN DE PAGOS**

---

|                        |                              |
| ---------------------- | ---------------------------- |
| **Documento:** | RN-SIFAP-2012-partial |
| **Clasificación:** | RESTRINGIDO |
| **Fecha de emisión:** | 14/08/2012 |
| **Estado:** | BORRADOR - INCOMPLETO |
| **Responsable:** | Ana Cristina Barros - SENARC |
| **Validación técnica:** | Pendiente |

---

> **DOCUMENTO EN ELABORACIÓN**
>
> Levantamiento iniciado en junio/2012 e interrumpido en agosto/2012 por falta de disponibilidad del equipo técnico. La jubilación del Sr. Roberto Carlos Meirelles (analista sénior, jubilado desde 2010) y el traslado de la Sra. Fernanda Oliveira (analista de negocio, jubilada en 2012) comprometieron significativamente la continuidad de este trabajo.
>
> Las reglas documentadas a continuación representan un **levantamiento parcial**, basado en:
>
> - Entrevistas con Marcos Antônio Ferreira (programador sénior de Natural);
> - Análisis parcial del código fuente de los programas CADBENEF, CALCBENF y VALELEG;
> - Documentación existente (Manual Técnico SIFAP v2.3.1, 2008);
> - Conocimiento institucional del equipo SENARC/CGPB.
>
> **Este documento NO ha sido validado por el equipo técnico de la organización y puede contener imprecisiones.**

---

## 1. Registro de beneficiarios

### 1.1. Reglas de alta

**RN-001** - Todo beneficiario debe tener un CPF válido (validación mediante dígito de control - subprograma VALCPF) y un NIS/NIT activo (validación mediante el subprograma VALNISN).

**RN-002** - No se permite dar de alta a un beneficiario cuyo CPF ya exista en el registro en estado activo (BN-CD-SIT = 'A'). Los beneficiarios dados de baja lógicamente (BN-CD-SIT = 'E') pueden volver a darse de alta mediante un nuevo registro.

**RN-003** - El beneficiario debe estar vinculado al menos a un programa social activo (campo BN-CD-PROG que referencia un registro válido en el DDM SOCPROG con PS-IN-ATIVO = 'S').

**RN-004** - El número máximo de dependientes por beneficiario es **3** (campo BN-QT-DEPEND, valores de 0 a 3). Para los programas que requieren un número mayor, se debe solicitar autorización a CGPB mediante el formulario FR-SIFAP-012.

<!-- NOTA: Verificar con Marcos Antônio: hay evidencia en el código de que
 el límite se cambió a 5 durante una actualización de mantenimiento reciente,
 pero no pudimos confirmarlo. El Manual Técnico v2.3 (2008) también registra 3. -->

**RN-005** - El campo de región (BN-CD-REGIAO) debe corresponder a una región válida según la tabla interna de SIFAP (valores 01 a 27, correspondientes a los estados brasileños y al Distrito Federal). El valor 99 está reservado para uso interno.

<!-- NOTA: El valor 99 en el campo BN-CD-REGIAO aparece en varios registros
 de la base de producción, pero no pudimos identificar su propósito.
 Marcos Antônio dijo que "es el bypass de Roberto", pero no pudo proporcionar
 detalles. Revisar el código de CADBENEF. -->

**RN-006** - La fecha de nacimiento (BN-DT-NASC) es un campo obligatorio. No se aceptan beneficiarios menores de 16 años en la fecha del alta, salvo como dependientes.

**RN-007** - Los datos bancarios (banco, sucursal, cuenta) son obligatorios para los beneficiarios activos. SIFAP valida el código del banco contra una tabla interna (última actualización: 2011).

### 1.2. Reglas de modificación

**RN-008** - [PENDING] - Reglas para modificar los datos bancarios. No fue posible acceder al código responsable durante el período del levantamiento. Verificar con el Sr. Roberto Carlos (jubilado desde 2010).

**RN-009** - La modificación del CPF de un beneficiario requiere autorización de nivel 2 (perfil SUPERVISOR en el GDA de sesión). El CPF anterior se conserva en el campo BN-NR-CPF-ANT para fines de auditoría.

**RN-010** - Cada modificación del registro genera registros automáticos de auditoría mediante el subprograma LOGAUDIT (campos: usuario, fecha/hora, campo modificado, valor anterior y valor nuevo).

### 1.3. Reglas de baja

**RN-011** - La baja de un beneficiario siempre es lógica (BN-CD-SIT cambia de 'A' a 'E'). No hay eliminación física de registros en el DDM BENEFIC, el archivo de beneficiarios.

**RN-012** - El sistema bloquea la baja de beneficiarios con pagos pendientes (PG-CD-STATUS = 'P'). El operador debe esperar la liquidación o cancelar los pagos antes de la baja.

---

## 2. Cálculo de beneficios

### 2.1. Fórmula de cálculo básica

**RN-013** - El importe mensual del beneficio se calcula mediante la siguiente fórmula:

```
VALOR-BENEFICIO = VALOR-BASE(program, bracket) + (ACRESCIMO-DEPEND * QT-DEPEND)
```

Donde:

- `VALOR-BASE` se obtiene del DDM SOCPROG según el tramo de ingresos declarado por el beneficiario;
- `ACRESCIMO-DEPEND` es el importe adicional por dependiente, definido por programa;
- `QT-DEPEND` es el número de dependientes activos vinculados al beneficiario titular.

**RN-014** - El importe del beneficio siempre se redondea hacia abajo a centavos (truncamiento, no redondeo matemático). Ejemplo: R$ 125,567 → R$ 125,56.

<!-- NOTA: La fórmula anterior es la fórmula BÁSICA. Marcos Antônio mencionó que
 hay "al menos 3 variaciones más" en el código de CALCBENF, incluido
 un cálculo especial para diciembre (13.er beneficio / bonificación de fin de año)
 y un multiplicador llamado "FACTOR-K" que no pudo explicar. No fue
 posible validarlo con el equipo.

 La regla de cálculo proporcional para beneficios que empiezan a mitad de mes
 (pro rata) tampoco está documentada. -->

### 2.2. Tramos de valores

**RN-017** - Los tramos de valores están parametrizados en el DDM SOCPROG mediante campos PE (grupo periódico) indexados por ejercicio fiscal. Cada programa social puede tener hasta 10 tramos de valores definidos.

**RN-018** - El tramo aplicable al beneficiario se determina por los ingresos familiares per cápita declarados (campo BN-VL-RENDA-PC). La asignación de tramo sigue el orden ascendente de ingresos y se aplica el primer tramo cuyo límite superior sea mayor o igual que los ingresos declarados.

### 2.3. Reajustes y correcciones

**RN-019** - El reajuste anual del beneficio se aplica en enero de cada año, según un índice definido por decreto presidencial. El índice se registra en la tabla interna del subprograma CALCIDX.

**RN-020** - El reajuste se aplica a VALOR-BASE, no al importe total del beneficio (incluido el incremento por dependiente). Revisar el código: no fue posible validarlo con el equipo.

---

## 3. Descuentos y deducciones

> **Nota:** Este módulo se implementó en 2015 (programa CALCDSCT) y no estaba incluido en la versión 2.3.1 del sistema cubierta por el Manual Técnico de 2008. Las reglas siguientes se recopilaron en una entrevista con Marcos Antônio Ferreira, quien implementó el módulo.

**RN-021** - El total de descuentos aplicables a un beneficio no puede superar el **30% del importe bruto**. Los descuentos que superan este límite se rechazan y el beneficio se procesa sin descuentos, generando un registro de auditoría.

<!-- NOTA: Marcos Antônio mencionó que existe una excepción para las retenciones
 ordenadas por un tribunal (órdenes de embargo o bloqueo), que pueden
 superar el límite del 30%. No se pudo confirmar en el código
 porque el acceso al programa CALCDSCT está restringido y el análisis no
 se completó durante el levantamiento. -->

**RN-022** - Los tipos de descuento previstos son:

| Código | Tipo de descuento | Nota |
| ------ | -------------------------------- | -------------------------------------------- |
| 01 | Descuento voluntario en nómina | Préstamo autorizado con descuento en nómina |
| 02 | Impuesto sobre la renta retenido en origen | Según la tabla vigente de la Receita Federal |
| 03 | Contribución a la seguridad social | Cuando corresponda |
| 04 | Reintegro al tesoro | Pago indebido identificado en una auditoría |
| 05 | [TO BE COMPLETED] | Marcos Antônio mencionó "2 o 3 tipos más" |

**RN-023** - El orden de aplicación de los descuentos sigue la prioridad numérica del código (primero 01, después 02, etc.). Cuando se alcanza el límite del 30%, se descartan los descuentos de menor prioridad.

---

## 4. Elegibilidad

### 4.1. Reglas básicas de elegibilidad

**RN-015** - [PENDING] - Reglas detalladas de elegibilidad por programa. El equipo SENARC/CGPB informó que las reglas varían significativamente entre programas y que una documentación completa requeriría entrevistas con los gestores de cada programa. El levantamiento no se realizó por falta de disponibilidad en la agenda.

**RN-016** - [PENDING] - Reglas de cruce con CadÚnico. La integración con CadÚnico se implementó de emergencia en 2006 y el programa responsable no figura en el inventario oficial de SIFAP. No se pudo localizar el código fuente durante la búsqueda.

### 4.2. Reglas documentadas (parciales)

Se identificaron las siguientes reglas de elegibilidad en el código del programa VALELEG:

- El beneficiario debe tener el registro en estado activo (BN-CD-SIT = 'A');
- El beneficiario debe tener datos bancarios válidos y completos;
- Los ingresos familiares per cápita declarados deben estar dentro de los tramos definidos para el programa;
- El beneficiario no puede estar inscrito en más de 2 programas sociales simultáneamente (campo BN-QT-PROG, máximo = 2);
- La fecha de la última actualización del registro no puede ser anterior a 24 meses (campo BN-DT-ULT-ATUAL);
- El beneficiario no puede tener una incidencia de auditoría sin resolver de tipo 'B' (bloqueo) en el DDM AUDIT.

> **Nota:** Las reglas anteriores se extrajeron mediante la lectura del código fuente de VALELEG y pueden no representar todas las verificaciones realizadas. El programa tiene aproximadamente 1,200 líneas de código con lógica condicional compleja.

<!-- NOTA: La regla de bypass de la región 99 no está documentada.
 Durante el análisis de VALELEG, se identificó un fragmento de código
 que omite toda la validación de elegibilidad cuando BN-CD-REGIAO = 99.
 Marcos Antônio no pudo explicar el origen de esta regla. Se sospecha
 que es un mecanismo de pruebas o un bypass administrativo implementado
 por el Sr. Roberto Carlos. Requiere investigación. -->

---

## 5. Procesamiento batch de pagos

### 5.1. Procesamiento mensual

El procesamiento batch mensual (programa BATCHPGT) sigue estas reglas:

- El procesamiento comienza el 1.er día hábil de cada mes, a las 10:00 p. m.;
- Se procesan todos los beneficiarios activos (BN-CD-SIT = 'A');
- El procesamiento se realiza en **orden estándar** (según el descriptor del archivo Adabas);
- Para cada beneficiario, se recalcula el importe del beneficio invocando CALCBENF;
- Después del cálculo, se aplican los descuentos invocando CALCDSCT (desde la versión 4.0);
- El registro de pago se guarda en el DDM PAYMENT con estado 'P' (pendiente);
- Al finalizar el procesamiento, se genera el archivo de remesa CNAB 240.

<!-- NOTA: El "orden predeterminado" mencionado anteriormente es, en la práctica,
 el orden alfabético por nombre del beneficiario (campo BN-NM-BENEF), que es el
 descriptor principal del archivo Adabas FNR 150. Este orden es un
 resultado del modelado original de 1997 y no tiene significado funcional.
 Sin embargo, cambiar el orden de procesamiento podría causar discrepancias
 en los totalizadores de control, ya que el programa utiliza acumuladores
 parciales por rango alfabético. -->

### 5.2. Manejo de errores

- Los errores de cálculo de un beneficiario individual no interrumpen el procesamiento;
- Los beneficiarios con errores se marcan con estado 'E' (error) en el DDM PAYMENT;
- Se genera un informe de errores al finalizar el procesamiento;
- Si el número de errores supera el parámetro MAX-ERROS (predeterminado: 100), el procesamiento se detiene con ABEND U4038;
- [TO BE COMPLETED] - Documentar el procedimiento de reprocesamiento de beneficiarios con errores.

---

## 6. Reglas pendientes de levantamiento

Las siguientes áreas de reglas de negocio **no se documentaron** en este levantamiento:

| Área | Motivo | Prioridad estimada |
| ------------------------------------------- | ------------------------------------------------------------ | ------------------- |
| Cálculo del 13.er beneficio (bonificación navideña) | No fue posible acceder a la rutina específica de CALCBENF | Alta |
| Factor K (multiplicador de cálculo) | Marcos Antônio no pudo explicarlo; se necesita analizar el código | Alta |
| Reglas de conciliación financiera (BATCHCON) | Patrícia Helena Moura (responsable) fue trasladada a DEGED | Media |
| Integración con CadÚnico | Programa no catalogado; código fuente no encontrado | Media |
| Reglas de auditoría (RELAUDIT) | Módulo fuera del alcance inicial de este levantamiento | Media |
| Cálculo proporcional (pro rata) | Mencionado por Marcos Antônio, sin detallar | Alta |
| Excepción judicial al límite de descuentos | Mencionada por Marcos Antônio, no confirmada en el código | Alta |
| Bypass de elegibilidad de la región 99 | Identificado en el código, sin explicación conocida | Alta |
| Reglas de desvinculación de dependientes | Sin documentar | Baja |
| Procedimientos de rollback y reprocesamiento | Remitidos al Manual ITSM-SIFAP vol. 3 (nunca completado) | Alta |

---

## 7. Matriz de reglas - Resumen

| ID | Módulo | Regla (resumen) | Estado | Nota |
| ------ | ------------- | ------------------------------------------- | ------------ | ---------------------------------------------- |
| RN-001 | Registro | CPF y NIS obligatorios y válidos | Documentada | - |
| RN-002 | Registro | CPF único para beneficiario activo | Documentada | - |
| RN-003 | Registro | Vínculo obligatorio con un programa social | Documentada | - |
| RN-004 | Registro | Máximo de 3 dependientes | Documentada | **Posiblemente desactualizada - verificar el código** |
| RN-005 | Registro | Región válida (01-27) + 99 reservado | Documentada | Significado de 99 desconocido |
| RN-006 | Registro | Edad mínima de 16 años | Documentada | - |
| RN-007 | Registro | Datos bancarios obligatorios | Documentada | Tabla de bancos desactualizada (2011) |
| RN-008 | Registro | Modificación de datos bancarios | **PENDING** | No investigada |
| RN-009 | Registro | Modificación del CPF - nivel SUPERVISOR | Documentada | - |
| RN-010 | Registro | Auditoría automática de modificaciones | Documentada | - |
| RN-011 | Registro | Baja siempre lógica | Documentada | - |
| RN-012 | Registro | Bloqueo de baja con pago pendiente | Documentada | - |
| RN-013 | Cálculo | Fórmula básica del beneficio | Documentada | **Fórmula parcial - faltan variaciones** |
| RN-014 | Cálculo | Redondeo por truncamiento | Documentada | - |
| RN-015 | Elegibilidad | Reglas detalladas por programa | **PENDING** | Falta de disponibilidad en la agenda de SENARC |
| RN-016 | Elegibilidad | Cruce con CadÚnico | **PENDING** | Programa no encontrado |
| RN-017 | Cálculo | Tramos de valores parametrizados | Documentada | - |
| RN-018 | Cálculo | Asignación de tramo por ingresos | Documentada | - |
| RN-019 | Cálculo | Reajuste anual en enero | Documentada | - |
| RN-020 | Cálculo | Reajuste sobre el valor base | Documentada | **Sin validar con el equipo técnico** |
| RN-021 | Descuentos | Límite del 30% del importe bruto | Documentada | **Excepción judicial sin documentar** |
| RN-022 | Descuentos | Tipos de descuento | Documentada | Lista incompleta |
| RN-023 | Descuentos | Orden de prioridad de los descuentos | Documentada | - |

---

## 8. Consideraciones finales

Este levantamiento se interrumpió prematuramente y representa, en el mejor de los casos, **aproximadamente el 25% de las reglas de negocio de SIFAP**. Las reglas más críticas y complejas —cálculo del 13.er beneficio, factor K, excepciones judiciales y bypass de elegibilidad— siguen **sin documentar** y existen solo en el código fuente Natural.

La continuidad de este trabajo depende de:

1. Disponibilidad de Marcos Antônio Ferreira (último analista con conocimiento completo del sistema) para sesiones de transferencia de conocimiento;
2. Acceso al código fuente de los programas CALCBENF, CALCDSCT y VALELEG en un entorno de homologación;
3. Apoyo de CGPB para validar las reglas con los gestores de los programas sociales;
4. Priorización formal por parte de CGTI/MDAS, ya que este levantamiento no está incluido en el plan de trabajo actual.

**Recomendación:** Si este levantamiento no se retoma a corto plazo, se sugiere que al menos las reglas marcadas con "Prioridad alta" en la sección 6 se investiguen directamente en el código fuente, antes de que el Sr. Marcos Antônio Ferreira sea trasladado o se jubile.

<!-- Esta recomendación no se atendió. Marcos Antônio fue trasladado
 a SUPDE/DESIN en 2017. -->

---

**Elaboración:** Ana Cristina Barros - Analista de Negocio - SENARC/CGPB

**Colaboración técnica:** Marcos Antônio Ferreira - Programador Sénior de Natural - SUPDE/DESIF

**Validación:** Pendiente

**Aprobación:** Pendiente

---

**Document internal to the organization/SENARC - Classification: RESTRICTED - Reproduction prohibited**

---

[Volver al escenario heredado](../README.md)
