---
title: "Manual técnico de SIFAP - Sistema de Fiscalización y Administración de Pagos"
author: "Fernanda Lucia de Oliveira - SUPDE/DESIF"
date: "2008-11-20"
version: "2.3.1"
classification: "RESTRICTED"
distribution: "SUPDE/DESIF, CGTI/MDAS, SENARC/CGPB"
revision_history:

- version: "1.0.0"
 date: "2006-03-10"
 author: "Fernanda Lucia de Oliveira"
 description: "Versión inicial - módulo de registro"
- version: "2.0.0"
 date: "2007-08-22"
 author: "Fernanda Lucia de Oliveira"
 description: "Inclusión de los módulos de cálculo y batch"
- version: "2.3.0"
 date: "2008-09-15"
 author: "Fernanda Lucia de Oliveira"
 description: "Revisión general, inclusión del módulo de auditoría"
- version: "2.3.1"
 date: "2008-11-20"
 author: "Fernanda Lucia de Oliveira"
 description: "Correcciones de texto e inclusión de contactos actualizados"
approval:
- name: "Roberto Carlos Meirelles"
 role: "Analista Sénior de Sistemas - SUPDE/DESIF"
 date: "2008-11-25"
- name: "Maria Helena Costa"
 role: "Coordinadora de DESIF"
 date: "2008-12-02"

---

> [!NOTE]
> Este es un documento histórico reconstruido para el ejercicio de arqueología de la inmersión SIFAP 2.0. Simula la versión 2.3.1 del Manual Técnico (2008), tal como la habría producido el equipo SUPDE/DESIF. Se conservaron intencionalmente el lenguaje de la época y los nombres de las personas, unidades y procedimientos. **Este documento no debe utilizarse como especificación actual del sistema.** Las secciones marcadas como `[TO BE COMPLETED]` y los comentarios internos sobre información desactualizada forman parte del ejercicio: representan lagunas reales de documentación que el equipo debe investigar.

<!-- ====================================================================== -->
<!-- MANUAL TECNICO DE SIFAP - VERSION 2.3 -->
<!-- Sistema de Fiscalización y Administración de Pagos -->
<!-- la organización - la organización federal de procesamiento de datos -->
<!-- Superintendencia de Desarrollo - SUPDE / DESIF -->
<!-- ====================================================================== -->

# MANUAL TÉCNICO DE SIFAP - VERSIÓN 2.3

**SISTEMA DE FISCALIZACIÓN Y ADMINISTRACIÓN DE PAGOS**

---

|                                |                                            |
| ------------------------------ | ------------------------------------------ |
| **Documento:** | MT-SIFAP-2008-v2.3.1 |
| **Clasificación:** | RESTRINGIDO |
| **Versión del sistema cubierta:** | 2.3.1 |
| **Fecha de emisión:** | 20/11/2008 |
| **Responsable:** | Fernanda Lucia de Oliveira - SUPDE/DESIF |
| **Aprobación técnica:** | Roberto Carlos Meirelles - Analista Sénior |
| **Aprobación de gerencia:** | Maria Helena Costa - Coord. DESIF |

---

> **ADVERTENCIA:** Este manual se refiere a la versión 2.3.1 de SIFAP. Para información sobre versiones posteriores, consulta los anexos publicados por SUPDE/DESIF o contacta con el equipo técnico responsable.

---

## 1. Introducción

### 1.1. Propósito del documento

Este manual tiene como objetivo documentar los aspectos técnicos de **SIFAP - Sistema de Fiscalización y Administración de Pagos**, para apoyar las actividades de mantenimiento, operación y soporte del sistema.

Este documento está dirigido a:

- Analistas de sistemas de SUPDE/DESIF asignados al proyecto SIFAP;
- Equipo de operación de mainframe de la organización - Regional de Brasília;
- Analistas de negocio de SENARC/CGPB, como referencia técnica;
- Equipo de DBA de Adabas responsable del entorno de producción.

### 1.2. Alcance

<!-- NOTA: Esta sección no se ha actualizado desde 2008 -->

Este manual cubre los siguientes aspectos de la versión 2.3.1 de SIFAP:

- Arquitectura general del sistema;
- Descripción de módulos y programas;
- Flujo de procesamiento mensual;
- Procedimientos de contingencia;
- Contactos del equipo técnico.

**Fuera del alcance de este documento:**

- Reglas de negocio detalladas (véase el Manual de Reglas de Negocio, en elaboración por SENARC);
- Procedimientos de copia de seguridad y recuperación de Adabas (véase el Manual de Operación del DBA - Cláudia Regina dos Santos, 2007);
- Manual operativo del usuario (véase el Manual ITSM-SIFAP vol. 2).

### 1.3. Documentos relacionados

| Código | Título | Autor | Estado |
| ----------------- | ----------------------------------- | -------------- | ------------- |
| MT-SIFAP-2008 | Este documento | F. L. Oliveira | Vigente |
| MO-SIFAP-DBA-2007 | Manual de Operación del DBA de Adabas | C.R. Santos | Vigente |
| MU-SIFAP-2006 | Manual del Usuario - Módulo de Registro | F. L. Oliveira | Vigente |
| ITSM-SIFAP-vol1 | Procedimientos ITSM - Incidentes | A. C. Ribeiro | Vigente |
| ITSM-SIFAP-vol2 | Procedimientos ITSM - Operación | A. C. Ribeiro | Vigente |
| ITSM-SIFAP-vol3 | Procedimientos ITSM - Cambios | [TO BE COMPLETED] | En elaboración |
| RN-SIFAP | Manual de Reglas de Negocio | SENARC/CGPB | No iniciado |

> **Nota:** El Manual ITSM-SIFAP vol. 3 (Procedimientos de Cambios) está en elaboración desde junio de 2008. Finalización prevista: marzo/2009.

---

## 2. Arquitectura del sistema

<!-- NOTA: Esta sección no se ha actualizado desde 2008 -->

### 2.1. Plataforma tecnológica

SIFAP se desarrolla y ejecuta en el entorno mainframe de la organización, usando la siguiente plataforma:

| Componente | Versión | Observaciones |
| -------------- | -------- | -------------------------------------------------------------------------------- |
| **Natural** | 6.3.12 | Lenguaje de desarrollo - actualizado en 2005 (migración desde v4.2) |
| **Adabas** | 7.4.3 | SGBD - actualizado en 2005 (migración desde v6.1) |
| **Com\*plete** | 6.3.1 | Monitor de teleprocesamiento para pantallas 3270 |
| **JES2** | z/OS 1.8 | Subsistema de entrada de trabajos batch |
| **CICS** | TS 3.1 | Usado solo para integrarse con la transacción de consulta de CPF (Receita Federal) |
| **z/OS** | 1.8 | Sistema operativo del mainframe |

### 2.2. Estructura de la biblioteca Natural

Los objetos de SIFAP están organizados en la biblioteca Natural **SIFAP**, de la siguiente forma:

```
Biblioteca SIFAP
├── Programas (programas ejecutables)
├── Subprogramas (rutinas llamadas por CALLNAT)
├── Copycodes (bloques de código incluidos mediante INCLUDE)
├── Mapas (pantallas 3270 - mapas de entrada/salida)
├── DDM (módulos de definición de datos - acceso a Adabas)
├── LDA (áreas de datos locales)
└── GDA (áreas de datos globales)
```

### 2.3. Modelo de datos

SIFAP usa **3 DDM principales** en Adabas:

| DDM | Archivo (FNR) | Descripción |
| --------------- | ------------- | -------------------------------- |
| BENEFICIARY | FNR 150 | Registro de beneficiarios |
| SOCIAL-PROGRAM | FNR 151 | Parámetros de los programas sociales |
| PAYMENT | FNR 152 | Registros de pagos |

<!-- NOTA: El DDM AUDIT (FNR 153), creado en 2005 durante la migración a
 Natural 6.3, no está incluido en esta sección porque se añadió después de la redacción
 inicial de este capítulo. Consultar con Roberto Carlos para actualizarlo. -->

> **Nota técnica:** La descripción detallada de los campos de cada DDM está en el Manual de Operación del DBA (MO-SIFAP-DBA-2007). Las FDT (tablas de definición de campos) son responsabilidad de la DBA Cláudia Regina dos Santos.

### 2.4. Diagrama de componentes

```mermaid
%%{init: {'theme':'neutral','themeVariables':{'fontFamily':'ui-sans-serif, system-ui, sans-serif','primaryColor':'#F5F5F5','primaryTextColor':'#171717','primaryBorderColor':'#171717','lineColor':'#525252','secondaryColor':'#FFFFFF','tertiaryColor':'#FAFAFA','background':'#FFFFFF'}}}%%
TB flowchart
    classDef step fill:#F5F5F5,stroke:#171717,color:#171717
    classDef artifact fill:#FAFAFA,stroke:#A3A3A3,color:#404040
    classDef external fill:#FFFFFF,stroke:#525252,color:#171717

    subgraph MAIN["Entorno mainframe — la organización"]
        NAT["Natural 6.3.12<br/>8 programas en línea"]:::step
        ADA["Adabas 7.4.3<br/>3 DDM"]:::step
        JES["JES2 / z/OS 1.8<br/>Trabajos batch"]:::step
        NAT <--> ADA
        JES --> ADA

        COMPLETE["Comp*plete<br/>Pantallas 3270"]:::step
        BATCH["BATCHPGT<br/>BATCHREL<br/>BATCHCON"]:::step
        NAT --> COMPLETE
        JES --> BATCH
    end

    TERM["Terminales 3270<br/>Operadores"]:::external
    EXTFILES["Archivos externos<br/>CNAB 240 / TXT<br/>BB / SIAFI"]:::external

    COMPLETE --> END
    BATCH --> EXTFILES
```

<!-- NOTA: Este diagrama no refleja los programas añadidos en 2005
 (RELAUDIT, CALCCORR) ni el DDM AUDIT. Solicitar la actualización
 al analista responsable. -->

---

## 3. Módulos del sistema

<!-- NOTA: Esta sección no se ha actualizado desde 2008 -->

### 3.1. Descripción general de programas

SIFAP se compone de **12 programas principales**, organizados en los siguientes módulos:

| N.º | Programa | Módulo | Tipo | Descripción |
| --- | --------- | --------- | ------------ | --------------------------------------------------------- |
| 01 | CADBENEF | Registro | En línea | Registro de beneficiarios - alta, modificación y baja |
| 02 | CADDEPEN | Registro | En línea | Registro de dependientes del beneficiario |
| 03 | CADPROG | Registro | En línea | Registro de programas sociales y parámetros |
| 04 | CALCBENF | Cálculo | Batch/En línea | Cálculo del importe del beneficio por tramo/programa |
| 05 | CALCCORR | Cálculo | Batch | Cálculo de correcciones y reajustes anuales |
| 06 | VALBENEF | Validación | En línea | Validación del registro (CPF, NIS y duplicidad) |
| 07 | VALELEG | Validación | En línea | Validación de elegibilidad según las reglas del programa |
| 08 | VALDOCS | Validación | En línea | Validación de documentación justificativa |
| 09 | BATCHPGT | Batch | Batch | Procesamiento mensual de la nómina |
| 10 | BATCHREL | Batch | Batch | Generación de informes batch |
| 11 | BATCHCON | Batch | Batch | Conciliación financiera con SIAFI |
| 12 | CONSBENF | Consulta | En línea | Consulta de beneficiarios - pantalla con filtros |

<!-- NOTA: Esta lista no incluye los programas CALCDSCT, RELPGT y RELAUDIT,
 que se añadieron al sistema después de la elaboración de este manual.
 CALCDSCT se incluyó en la versión 4.0 (2015).
 RELPGT y RELAUDIT se reestructuraron/incluyeron en la versión 3.0 (2005).
 Este manual solo cubre la versión 2.3.1 del sistema. -->

### 3.2. Módulo de registro

#### 3.2.1. CADBENEF - Registro de beneficiarios

**Descripción:** Programa en línea para mantener el registro de beneficiarios. Permite el alta, la modificación y la baja lógica de registros en el DDM BENEFIC, el archivo de beneficiarios.

**Transacción:** SF01 (alta), SF02 (modificación), SF03 (baja)

**Funcionalidades:**

- Alta de un nuevo beneficiario con validación de CPF (llamada al subprograma VALCPF);
- Modificación de datos de registro (dirección, datos bancarios y estado);
- Baja lógica (campo BN-CD-SIT cambiado a 'E');
- Registro de auditoría para todas las operaciones (llamada al subprograma LOGAUDIT);
- Vinculación al programa social (clave: BN-CD-PROG → PS-CD-PROG).

**Observaciones:**

- El campo BN-QT-DEPEND (número de dependientes) acepta valores de 0 a 3.
- [TO BE COMPLETED] - Detallar las reglas de validación para modificar datos bancarios.
- [TO BE COMPLETED] - Documentar el tratamiento de beneficiarios con varios programas.

<!-- NOTA: El límite de dependientes se cambió a 5 en algún momento entre
 2010 y 2015, a petición de SENARC. Este cambio no se refleja
 en este documento. Verificarlo en el código fuente de CADBENEF. -->

#### 3.2.2. CADDEPEN - Registro de dependientes

**Descripción:** Programa en línea para registrar dependientes vinculados al beneficiario titular.

**Transacción:** SF04

**Funcionalidades:**

- Alta de un dependiente con validación de CPF y fecha de nacimiento;
- Vinculación al beneficiario titular (clave: BN-NR-CPF);
- Verificación del límite de dependientes (máximo: 3 por titular);
- Control del tipo de dependiente (cónyuge, hijo, otro).

**Observaciones:**

- La validación de la edad mínima/máxima de los dependientes sigue las reglas del programa social. Consulta el código de CADBENEF para más detalles.
- [TO BE COMPLETED] - Documentar las reglas de desvinculación de dependientes.

#### 3.2.3. CADPROG - Registro de programas sociales

**Descripción:** Programa en línea para mantener los parámetros de los programas sociales.

**Transacción:** SF06

**Funcionalidades:**

- Alta y modificación de programas sociales;
- Parametrización de tramos de valores (campos MU del DDM SOCPROG);
- Definición de reglas de elegibilidad por programa;
- Control de vigencia (fecha de inicio/fin).

**Observaciones:**

- Acceso restringido al perfil ADMIN (verificación mediante el GDA de sesión).
- [TO BE COMPLETED] - Detallar el procedimiento de alta de un nuevo programa social.

### 3.3. Módulo de cálculo

#### 3.3.1. CALCBENF - Cálculo de beneficios

**Descripción:** Programa para calcular el importe del beneficio que se pagará al beneficiario, según los tramos y las reglas definidos en el DDM SOCPROG.

**Funcionalidades:**

- Cálculo del valor base según el tramo del programa;
- Aplicación de incrementos por dependiente;
- Cálculo proporcional para beneficios que empiezan a mitad de mes;
- [TO BE COMPLETED] - Reglas de cálculo del 13.er beneficio (bonificación navideña).

**Observaciones:**

- Este programa se invoca tanto en línea (simulación) como en batch (procesamiento mensual).
- La lógica de cálculo está íntegramente en el código Natural, sin parametrización externa.
- Consultar con el Sr. Roberto Carlos para detallar la fórmula de cálculo del tramo adicional.

#### 3.3.2. CALCCORR - Cálculo de correcciones

**Descripción:** Programa batch para aplicar índices de corrección y reajustes a los importes de los beneficios.

**Funcionalidades:**

- Lectura de la tabla interna de índices (subprograma CALCIDX);
- Aplicación del índice sobre el valor base;
- Generación de un log de reajustes para auditoría.

**Observaciones:**

- Se ejecuta anualmente en enero o cuando hay un decreto de reajuste.
- [TO BE COMPLETED] - Documentar el formato de la tabla de índices y el procedimiento de actualización.

### 3.4. Módulo de validación

[TO BE COMPLETED] - Sección pendiente de detalle. Los programas VALBENEF, VALELEG y VALDOCS tienen funcionalidades que se explican por sí mismas. Para más detalles, consulta el código fuente o contacta con Roberto Carlos Meirelles.

### 3.5. Módulo batch

#### 3.5.1. BATCHPGT - Procesamiento de pagos

**Descripción:** Programa batch principal de SIFAP. Responsable del procesamiento mensual de la nómina.

**Planificación:** 1.er día hábil del mes, 10:00 p. m. (hora de Brasília)

**Flujo de ejecución:**

1. Lectura secuencial del DDM BENEFIC, el archivo de beneficiarios (registros activos, BN-CD-SIT = 'A');
2. Para cada beneficiario, invocar CALCBENF para obtener el importe del beneficio;
3. Grabación del registro en el DDM PAYMENT con estado 'P' (pendiente);
4. Generación del archivo de remesa CNAB 240 para Banco do Brasil;
5. Totalización y grabación de logs de procesamiento.

**Parámetros JCL:**

```
//SIFAPPGT JOB (SIFAP,BATCH),'FOLHA MENSAL',
// CLASS=A,MSGCLASS=X,MSGLEVEL=(1,1)
//STEP01 EXEC NATBATCH,PROGRAM=BATCHPGT
//SYSIN DD *
 MES-REF=MMAAAA
 TIPO-PROC=NORMAL
 MAX-ERROS=100
/*
```

**Observaciones:**

- Tiempo medio de ejecución: 2h45min (referencia: oct/2008, ~3,200,000 registros).
- El procesamiento es **secuencial en orden alfabético** del nombre del beneficiario (campo BN-NM-BENEF). Este orden lo determina el descriptor Adabas configurado en FNR 150.
- En caso de ABEND, consulta el procedimiento de reinicio en la sección 5 de este manual.

<!-- NOTA: El tiempo de ejecución ha aumentado considerablemente desde 2008 debido
 al crecimiento de la base. En 2016, se informó de un incidente de tiempo de espera agotado
 al procesar 4.1 millones de registros. -->

#### 3.5.2. BATCHREL - Informes batch

**Descripción:** Generación de informes de totalización posteriores al procesamiento.

**Observaciones:**

- Se ejecuta después de que BATCHPGT termine correctamente.
- Genera informes en formato de texto (132 columnas) para impresora.
- [TO BE COMPLETED] - Enumerar los informes generados y sus destinatarios.

#### 3.5.3. BATCHCON - Conciliación financiera

**Descripción:** Programa de conciliación entre los pagos procesados por SIFAP y las confirmaciones recibidas de SIAFI y de los bancos pagadores.

**Observaciones:**

- Se ejecuta al recibir los archivos de retorno (D+2 después del envío).
- [TO BE COMPLETED] - Documentar el formato de los archivos de retorno y las reglas de conciliación.
- Para los procedimientos operativos, consulta el Manual ITSM-SIFAP vol. 3.

---

## 4. Flujo de procesamiento mensual

### 4.1. Calendario estándar

El ciclo mensual de procesamiento de SIFAP sigue este calendario:

| Día hábil | Actividad | Responsable | Sistema/Programa |
| --------- | ------------------------------------------------------ | ------------------------- | -------------------------- |
| D-5 | Actualización de tablas de parámetros (tramos, índices) | SENARC/CGPB | CADPROG (en línea) |
| D-3 | Cierre del registro - bloqueo de modificaciones | Operación de la organización | Procedimiento manual |
| D-2 | Validación batch de elegibilidad | Operación de la organización | VALELEG (batch) |
| D-1 | Comprobación de totalizadores - informe previo | CGPB | BATCHREL (modo previo) |
| D (1.er DU) | **Procesamiento de la nómina** | Operación de la organización | BATCHPGT |
| D+1 | Envío del archivo CNAB 240 a Banco do Brasil | Operación de la organización | Transferencia manual (FTP) |
| D+2 | Envío de órdenes bancarias a SIAFI | Operación de la organización | Procedimiento SIAFI |
| D+3 | Recepción del archivo de retorno bancario | Operación de la organización | Recepción FTP |
| D+4 | Conciliación financiera | Operación de la organización | BATCHCON |
| D+5 | Generación de informes finales | CGPB | BATCHREL |
| D+10 | Cierre del ciclo - archivo | CGPB | Procedimiento manual |

### 4.2. Diagrama de flujo

```mermaid
%%{init: {'theme':'neutral','themeVariables':{'fontFamily':'ui-sans-serif, system-ui, sans-serif','primaryColor':'#F5F5F5','primaryTextColor':'#171717','primaryBorderColor':'#171717','lineColor':'#525252','secondaryColor':'#FFFFFF','tertiaryColor':'#FAFAFA','background':'#FFFFFF'}}}%%
TB flowchart
    classDef step fill:#F5F5F5,stroke:#171717,color:#171717
    classDef artifact fill:#FAFAFA,stroke:#A3A3A3,color:#404040

    CADPROG["CADPROG<br/>(D-5)<br/>Actualización de parámetros"]:::step
    VALELEG_PRE["VALELEG<br/>(D-2)<br/>Validación de elegibilidad"]:::step
    BATCHREL_PRE["BATCHREL<br/>(D-1)<br/>Vista previa"]:::step
    BATCHPGT["BATCHPGT<br/>(D = 1.er DU)<br/>Nómina"]:::step
    CNAB["Archivo CNAB<br/>BB"]:::artifact
    DDM_PAGTO["DDM PAYMENT<br/>(Adabas)"]:::artifact
    LOG["Log de procesamiento"]:::artifact
    RETURN["Retorno bancario<br/>(D+3)"]:::artifact
    BATCHCON["BATCHCON<br/>(D+4)<br/>Conciliación"]:::step
    BATCHREL_POS["BATCHREL<br/>(D+5)<br/>Informes finales"]:::step

    CADPROG --> VALELEG_PRE --> BATCHREL_PRE --> BATCHPGT
    BATCHPGT --> CNAB
    BATCHPGT --> DDM_PAGTO
    BATCHPGT --> LOG
    CNAB --> RETURN
    RETURN --> BATCHCON
    BATCHCON --> BATCHREL_POS
```

### 4.3. Manejo de excepciones

<!-- NOTA: Esta sección no se ha actualizado desde 2008 -->

| Situación | Procedimiento | Responsable |
| ------------------------------ | ------------------------------------------------------------------------------ | ------------------------- |
| ABEND en BATCHPGT | Reiniciar desde el último checkpoint (véase la sección 5.2) | Operación de la organización |
| Archivo CNAB rechazado por BB | Corrección manual y reenvío. Contactar con Antônio Carlos Ribeiro. | Operación de la organización |
| Divergencia en la conciliación | Análisis manual por CGPB. Registrar el incidente en ITSM. | CGPB + la organización |
| Retraso en los retornos bancarios | Esperar hasta D+5. Si no se reciben, contactar con BB por el canal dedicado. | Operación de la organización |
| Solicitud de reprocesamiento | Aprobación de CGPB. Procedimiento de rollback según el Manual ITSM-SIFAP vol. 3. | CGPB |

> **IMPORTANTE:** Para procedimientos detallados de rollback y reprocesamiento, consulta el **Manual ITSM-SIFAP vol. 3** (en elaboración - previsión: marzo/2009).

---

## 5. Procedimientos de contingencia

### 5.1. Plan de contingencia - Descripción general

<!-- NOTA: Esta sección no se ha actualizado desde 2008 -->

El plan de contingencia de SIFAP cubre los siguientes escenarios:

| Escenario | Nivel | Procedimiento |
| ------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------ |
| Indisponibilidad del mainframe (< 4h) | 1 | Esperar la recuperación. Reprogramar el batch si es necesario. |
| Indisponibilidad del mainframe (> 4h) | 2 | Activar el procesamiento en el sitio de contingencia (la organización-RSA). Contactar con Antônio Carlos Ribeiro. |
| Corrupción de datos Adabas | 3 | Recuperar mediante ADASAV (última copia de seguridad válida). Contactar con Cláudia Regina dos Santos (DBA). |
| Fallo de integración con SIAFI | 2 | Procesamiento manual de órdenes bancarias por CGPB. Procedimiento descrito en el Manual ITSM-SIFAP vol. 2. |
| Fallo de transmisión CNAB | 1 | Retransmisión manual por un canal alternativo (SFTP). Contactar con operación de BB. |

### 5.2. Procedimiento de reinicio - BATCHPGT

En caso de ABEND durante la ejecución de BATCHPGT, sigue estos pasos:

1. Comprueba el código ABEND en el log de JES2 (JESMSGLG);
2. Identifica el último checkpoint registrado (campo CKPT-NR en SYSOUT);
3. Corrige la condición de error según la tabla de ABEND conocidos (véase la sección 5.3);
4. Reinicia el trabajo con el parámetro `RESTART=CKPT-nnn` (donde nnn = número del último checkpoint);
5. Supervisa la ejecución hasta su finalización normal (COND CODE = 0000);
6. Compara los totales finales con el informe previo (D-1).

### 5.3. Tabla de ABEND conocidos

| Código | Descripción | Causa probable | Acción |
| ----------- | ------------------------ | ------------------------------------------- | ---------------------------------------------------------------- |
| S0C7 | Excepción de datos | Campo numérico con valor no válido en Adabas | Identificar el registro corrupto mediante ADAORD. Corregirlo o eliminarlo. |
| S878 | Almacenamiento virtual excedido | Volumen de procesamiento superior al previsto | Aumentar REGION en el JCL. Contactar con operación. |
| S0C4 | Excepción de protección | Error de direccionamiento en un subprograma | Contactar con Roberto Carlos Meirelles para analizarlo. |
| U4038 | Error de ejecución de Natural | Error de desbordamiento en el cálculo | Comprobar los valores del DDM SOCPROG (tramos). |
| ADA-RSP 148 | Tiempo de espera agotado en Adabas | Tiempo de respuesta excedido | Comprobar la contención en Adabas. Contactar con el DBA. |

### 5.4. Procedimiento de rollback

[TO BE COMPLETED] - El procedimiento completo de rollback se documentará en el Manual ITSM-SIFAP vol. 3. Mientras tanto, contactar con Roberto Carlos Meirelles para recibir orientación.

---

## 6. Contactos del equipo técnico

<!-- NOTA: Esta sección no se ha actualizado desde 2008 -->
<!-- Es posible que varios de los contactos siguientes ya no sean válidos. -->
<!-- Comprobar la capacidad actual de los servidores en el sistema de RR. HH./organización. -->

### 6.1. Equipo de la organización - SUPDE/DESIF

| Nombre | Función | Extensión | Correo electrónico | Nota |
| -------------------------- | -------------------------------- | ----- | ------------------------------- | ----------------------------------------- |
| Roberto Carlos Meirelles | Analista Sénior / Coord. Técnico | 3411 | <roberto.meirelles@client.gov.br> | Arquitectura y decisiones técnicas |
| Fernanda Lucia de Oliveira | Analista de Negocio | 3415 | <fernanda.oliveira@client.gov.br> | Documentación y reglas de negocio |
| Marcos Antônio Ferreira | Programador Sénior de Natural | 3418 | <marcos.ferreira@client.gov.br> | Mantenimiento de código - módulos de cálculo |
| Cláudia Regina dos Santos | DBA de Adabas | 3422 | <claudia.santos@client.gov.br> | Administración de bases de datos |
| José Aparecido Lima | Programador de Natural | - | - | Jubilado desde 2005 |
| Patrícia Helena Moura | Analista de Sistemas | 3419 | <patricia.moura@client.gov.br> | Integración con SIAFI y auditoría |
| Antônio Carlos Ribeiro | Analista de Soporte/Operación | 3430 | <antonio.ribeiro@client.gov.br> | Operación y supervisión batch |

### 6.2. Equipo SENARC / CGPB

| Nombre | Función | Teléfono | Correo electrónico |
| --------------------- | --------------------------- | -------------- | ------------------------ |
| Ana Cristina Barros | Analista de Negocio de SENARC | (61) 2030-XXXX | <ana.barros@mds.gov.br> |
| Carlos Eduardo Mendes | Coord. CGPB | (61) 2030-XXXX | <carlos.mendes@mds.gov.br> |

### 6.3. Soporte de infraestructura

| Área | Contacto | Extensión | Responsabilidad |
| ----------------------------- | -------------------- | ----- | --------------------------------------- |
| Operación de Mainframe - Brasília | Centro de Operaciones | 3500 | Planificación y supervisión batch |
| DBA de Adabas - Equipo Central | Coordinación de DBA | 3510 | Soporte de incidentes Adabas |
| Red / Comunicación | NOC de la organización | 3600 | Conectividad y transmisión de archivos |

> **Nota:** Las extensiones y los correos electrónicos anteriores se refieren a la estructura organizativa vigente en noviembre de 2008. En caso de cambios, consulta el directorio telefónico interno de la organización (intranet: <http://intranet.client.gov.br/catalogo>).

---

## 7. Glosario

| Sigla | Significado |
| ------ | -------------------------------------------------------------- |
| CGPB | Coordinación General de Procesamiento de Beneficios |
| CNAB | Centro Nacional de Automatización Bancaria (estándar de archivos) |
| DDM | Módulo de definición de datos (definición de acceso a Adabas en Natural) |
| DESIF | División de Desarrollo de Sistemas Fiscales |
| FDT | Tabla de definición de campos (definición de campos Adabas) |
| FNR | Número de archivo (número de archivo Adabas) |
| GDA | Área de datos global |
| ITSM | Gestión de servicios de TI |
| JCL | Job Control Language |
| JES2 | Job Entry Subsystem 2 |
| LDA | Área de datos local |
| SENARC | Secretaría Nacional de Renta de Ciudadanía |
| SIAFI | Sistema Integrado de Administración Financiera |
| SIFAP | Sistema de Fiscalización y Administración de Pagos |
| SUPDE | Superintendencia de Desarrollo |

---

## 8. Historial de revisiones

| Versión | Fecha | Autor | Cambios |
| ------ | ---------- | -------------- | ------------------------------------------------------------ |
| 1.0.0 | 10/03/2006 | F. L. Oliveira | Versión inicial - solo módulo de registro |
| 1.1.0 | 15/07/2006 | F. L. Oliveira | Inclusión del módulo de validación |
| 2.0.0 | 22/08/2007 | F. L. Oliveira | Inclusión de los módulos batch y de cálculo |
| 2.1.0 | 10/01/2008 | F. L. Oliveira | Revisión de procedimientos de contingencia |
| 2.2.0 | 05/06/2008 | F. L. Oliveira | Inclusión del flujo de procesamiento mensual |
| 2.3.0 | 15/09/2008 | F. L. Oliveira | Revisión general; inclusión de la referencia al módulo de auditoría |
| 2.3.1 | 20/11/2008 | F. L. Oliveira | Correcciones de texto; actualización de contactos |

> **Nota:** No hubo revisiones de este documento después de noviembre de 2008.

---

## Anexo A - Mapa de transacciones

| Transacción | Programa | Descripción |
| --------- | ------------- | ------------------------------- |
| SF01 | CADBENEF | Alta de beneficiario |
| SF02 | CADBENEF | Modificación de beneficiario |
| SF03 | CADBENEF | Baja lógica de beneficiario |
| SF04 | CADDEPEN | Registro de dependientes |
| SF05 | CONSBENF | Consulta de beneficiarios |
| SF06 | CADPROG | Mantenimiento de programas sociales |
| SF10 | [TO BE COMPLETED] | Informe de auditoría (?) |
| SF11 | [TO BE COMPLETED] | [TO BE COMPLETED] |

<!-- NOTA: Las transacciones SF10 y SF11 se mencionaron en una reunión
 de septiembre/2008, pero no fue posible confirmarlas con el equipo técnico.
 Pendiente de verificación. -->

---

## Anexo B - Asuntos pendientes de este documento

Las siguientes secciones e información siguen pendientes de documentación:

1. Detalle de las reglas de validación de CADBENEF (sección 3.2.1)
2. Documentación completa del módulo de validación (sección 3.4)
3. Lista de informes BATCHREL (sección 3.5.2)
4. Reglas de conciliación de BATCHCON (sección 3.5.3)
5. Procedimiento completo de rollback (sección 5.4)
6. Mapa completo de transacciones (Anexo A)
7. Inclusión del DDM AUDIT en la sección del modelo de datos (sección 2.3)
8. Reglas de cálculo del 13.er beneficio - bonificación navideña (sección 3.3.1)

> **Actualización prevista:** 1.er trimestre de 2009 (sujeta a la disponibilidad del equipo).

<!-- Esta actualización nunca se realizó. -->

---

**Document internal to the organization - Classification: RESTRICTED - Reproduction prohibited**

**the organization - the federal data processing organization**
**Development Superintendence - SUPDE**
**Tax Systems Development Division - DESIF**

---

[Volver al escenario heredado](../README.md)
