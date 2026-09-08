---
description: "Utiliza al leer código heredado Natural/Adabas, patrones del lenguaje, estructura FDT, convenciones de nomenclatura y flujos por lotes."
applyTo: "01-archaeology/legacy-sifap/**,**/*.NSP,**/*.nsp,**/*.NSN,**/*.nsn,**/*.NSS,**/*.nss,**/*.NSA,**/*.nsa,**/*.NSL,**/*.nsl,**/*.NSC,**/*.nsc,**/*.NSM,**/*.nsm,**/*.NSD,**/*.nsd,**/*.NAT,**/*.nat,**/*.CPY,**/*.cpy,**/*.DDM,**/*.ddm,**/*.jcl,**/*.JCL"
---

# Código heredado Natural/Adabas — Guía de lectura

Este archivo se activa al abrir programas Natural, DDM de Adabas, JCL, códigos de copia o cualquier archivo del directorio `01-archaeology/legacy-sifap/`. Enseña a leer el código heredado de SIFAP (Sistema de Fiscalización y Administración de Pagos): estructura de programas Natural, dependencias CALLNAT e INCLUDE, FDT de Adabas, nomenclatura heredada, patrones por lotes, decimales empaquetados y estrategia de primera lectura. **No** decide los límites de módulos modernos ni los mapeos JPA, que corresponden a [`modular-monolith.instructions.md`](modular-monolith.instructions.md), ni escribe requisitos EARS o registros de trazabilidad, que corresponden a [`requirements.instructions.md`](requirements.instructions.md).

## Estructura de programas Natural

Un programa Natural sigue esta estructura inicial:

```
DEFINE DATA
  LOCAL
    01 #MY-VARIABLE  (A20)    /* A = alfanumérico, 20 caracteres */
    01 #COUNTER      (N5)     /* N = numérico, 5 dígitos */
    01 #AMOUNT       (P9.2)   /* P = decimal empaquetado, 9 dígitos enteros + 2 decimales */
    01 #RATES        (N3.4/1:27)  /* matriz: 27 ocurrencias de N3.4 */
  END-DEFINE

  /* Lógica principal aquí */

END
```

> **En este laboratorio, el separador decimal de una especificación de formato es un punto.**
> Natural Community Edition 9.3.3 compila `(P9.2)` y `(N3.4)`. Rechaza `(P9,2)` con `NAT0165`.
> Las instalaciones de Natural pueden variar según la configuración del carácter decimal; esta inmersión sigue la imagen de Community Edition.
> Esta regla se aplica solo a la *declaración*: **los literales siguen utilizando un punto**: `MOVE 1.3500 TO #FATOR`.
> En las matrices, el intervalo forma parte de la notación: `(A60/1:10)`, `(N3.4/1:27)`, `(N3.6/1:10,1:12)`.

Bloques clave que debes reconocer:

| Bloque | Propósito |
|-------|---------|
| `DEFINE DATA LOCAL` | Declaraciones de variables cuyo alcance se limita a este programa |
| `DEFINE DATA PARAMETER` | Variables de entrada/salida recibidas del programa que realiza la llamada |
| `DEFINE DATA GLOBAL` | Compartidas entre programas de una sesión (poco habitual, frágil) |
| `INPUT` | Lee del terminal (en línea) o de un archivo secuencial (por lotes) |
| `DISPLAY` / `WRITE` | Salida a una pantalla o informe |
| `MAP` | Definición de la distribución de pantalla (interfaz de terminal) |

## CALLNAT frente a PERFORM

- **`CALLNAT 'SUBPROG' parm1 parm2`**: llama a un subprograma externo (un archivo fuente separado). Los parámetros se pasan por referencia salvo que estén marcados con `(AD=O)` para uso exclusivo de salida.
- **`PERFORM subroutine-name`**: llama a una subrutina interna definida con `DEFINE SUBROUTINE ... END-SUBROUTINE` dentro del mismo programa.

Al mapear cadenas de llamadas, `CALLNAT` es el elemento importante: cruza los límites de los archivos.

## Códigos de copia con INCLUDE

`INCLUDE copycode-name` inserta un fragmento de código compartido durante la compilación, como un `#include` de C. Los códigos de copia suelen contener:

- Definiciones de áreas de datos compartidas (el equivalente a «struct» en Natural)
- Rutinas de validación comunes
- Bloques estándar de tratamiento de errores

Cuando veas `INCLUDE`, busca el código de copia correspondiente para comprender la estructura completa de los datos.

### Extensiones de miembros

Una biblioteca Natural es **plana**: no tiene subdirectorios y cada miembro se resuelve por nombre, no por ruta. La extensión indica el tipo:

| Extensión | Tipo | Invocado por |
|----------|------|-------------|
| `.NSN` | Programa o subprograma | Ejecutado por JCL o `CALLNAT` |
| `.NSA` | Área de datos de parámetros (PDA) | `PARAMETER USING` |
| `.NSL` | Área de datos locales (LDA) | `LOCAL USING` |
| `.NSC` | Código de copia | `INCLUDE` |
| `.NSM` | Mapa (distribución de pantalla 3270) | `INPUT USING MAP` |
| `.jcl` | Lenguaje de control de trabajos | Planificador por lotes |

`CALLNAT`, `INCLUDE`, `PARAMETER USING` y `LOCAL USING` **NO DEBEN ignorarse**: cada uno incorpora código o declaraciones de otro archivo. La lectura de un programa de forma aislada es incompleta.

Los nombres de miembros Natural tienen un límite de 8 caracteres. En este conjunto de fuentes, los nombres de DDM/miembros Natural son `BENEFIC`, `SOCPROG`, `PAYMENT` y `AUDIT`. El archivo de Adabas puede seguir describiéndose conceptualmente como archivo de beneficiarios o de programas sociales, y los campos del DDM conservan sus nombres largos.

## FDT de Adabas (tabla de definición de campos)

Cada archivo de Adabas tiene una FDT que define sus campos. Considérala como el esquema:

| Columna | Significado |
|--------|---------|
| Nivel | Profundidad jerárquica (01 = nivel superior, 02+ = hijos) |
| Nombre | Nombre corto de dos caracteres (AA, AB, AC...) |
| Formato | `A` = alfanumérico, `N` = numérico, `P` = empaquetado, `B` = binario, `D` = fecha, `T` = hora |
| Longitud | Tamaño del campo en bytes |
| Descriptor | `DE` = índice que permite búsquedas, `MU` = valores múltiples (matriz), `PE` = grupo periódico (grupo repetido) |

### Campos MU (valores múltiples)

Un campo marcado con `MU` puede contener varios valores (como una matriz). En Natural se accede a él por índice: `FIELD(1)`, `FIELD(2)`, etc. La FDT define el número máximo de ocurrencias.

**Mapeo moderno**: `@ElementCollection` en JPA o una columna JSONB en PostgreSQL.

### PE (grupos periódicos)

Un grupo `PE` es un grupo repetido de campos relacionados, como una fila de una tabla integrada. Por ejemplo, un historial de direcciones en el que cada ocurrencia contiene una calle, una ciudad y una fecha.

**Mapeo moderno**: una relación `@OneToMany` con una entidad integrada o una matriz JSONB.

### Superdescriptores

Un superdescriptor combina varios campos en una única clave que permite búsquedas (índice compuesto). Una notación como `SU = AA + AB(1-4)` significa «concatenar el campo AA con los primeros 4 bytes de AB».

**Mapeo moderno**: `@Index(columnList = "col_a, col_b")` en JPA.

## Convenciones de nomenclatura de la década de 1990

Las bases de código Natural heredadas utilizan nombres basados en prefijos. Algunos patrones comunes son:

| Patrón de prefijo | Significado habitual |
|---|---|
| `BN-` o `BATCH-` | Programa por lotes o variable relacionada con lotes |
| `PG-` o `PROG-` | Programa principal |
| `PS-` o `SUB-` | Subprograma (invocado mediante CALLNAT) |
| `AU-` o `AUT-` | Relacionado con autorización o auditoría |
| Prefijo `#` en variables | Variable local de trabajo (convención de Natural) |
| Prefijo `+` en variables | Variable de parámetro pasada por quien realiza la llamada |

Son convenciones, no reglas: verifícalas leyendo el código en lugar de suponerlas.

## Patrones de trabajos por lotes

Los programas Natural por lotes suelen seguir esta estructura:

```
READ WORK FILE 1 record
  /* Procesa cada registro */
  AT END OF DATA
    /* Totales finales / limpieza */
  END-ENDDATA
END-WORK
```

Los informes con rupturas de control utilizan:

```
READ logical-file BY descriptor
  AT BREAK OF descriptor
    /* Subtotal cuando cambia el valor del descriptor */
  BEFORE BREAK PROCESSING
    /* Línea de detalle para cada registro */
  END-BREAK
END-READ
```

## Tratamiento de decimales empaquetados

El decimal empaquetado (formato `P`) almacena los dígitos de forma eficiente: cada byte contiene dos dígitos y el último nibble representa el signo (C=positivo, D=negativo). Es habitual en cálculos financieros.

Al mapear a Java, utiliza SIEMPRE `BigDecimal`, NUNCA `double` ni `float`. Los campos empaquetados con formato `P9.2` representan 9 dígitos enteros y 2 posiciones decimales → `BigDecimal` con `scale(2)`.

**En el mainframe, el dinero utiliza formato empaquetado (`P`), no `N`.** Al leer el conjunto de fuentes, un valor monetario declarado como `N` es una señal de alerta: puede ser un descuido de la autoría original o una divergencia deliberada entre el programa y el DDM. Compara SIEMPRE el formato del programa con el del mismo campo en el `.ddm`: las discrepancias de tipo y tamaño son una fuente clásica de truncamientos silenciosos y desbordamientos.

## Estrategia de lectura

Al abordar un programa heredado por primera vez:

1. **Comienza por DEFINE DATA**: comprende las variables y sus tipos
2. **Busca el READ o FIND principal**: revela qué datos procesa el programa
3. **Rastrea las llamadas CALLNAT**: son las dependencias
4. **Busca los códigos de copia INCLUDE**: amplían las definiciones de datos
5. **Comprueba AT BREAK / AT END OF DATA**: revelan lógica de informes o procesamiento
6. **Anota cada ESCAPE u ON ERROR**: son rutas de tratamiento de errores
7. **Comprueba `IF NO RECORDS FOUND`**: el bloque `FIND ... IF NO RECORDS FOUND ... END-NOREC` define qué ocurre cuando la búsqueda no devuelve nada; aquí se ocultan los valores predeterminados silenciosos. Recuerda que los campos de vista tienen valores solo **dentro** del bloque `FIND`/`READ`.
8. **Contrasta `FIND ... WITH` con el DDM**: las búsquedas solo son posibles en campos marcados como descriptores (`D`, `S` o `H`) en el listado DDM. Una búsqueda sobre un campo que no es descriptor no compila.

## Convenciones

| Regla | Justificación |
|---|---|
| En este laboratorio, las declaraciones Natural utilizan notación decimal con punto, como `(P9.2)` | La notación con coma, como `(P9,2)`, falla con `NAT0165` en Natural CE 9.3.3 |
| Rastrear `CALLNAT`, `INCLUDE`, `PARAMETER USING` y `LOCAL USING` | La lectura de un miembro Natural de forma aislada es incompleta |
| Comparar los formatos de campos del programa con el DDM correspondiente | Las discrepancias de tipo y tamaño pueden causar truncamientos silenciosos o desbordamientos |
| Mapear los campos monetarios empaquetados a `BigDecimal` | `double` y `float` pierden precisión financiera |
| Verificar los descriptores antes de interpretar `FIND ... WITH` | Las búsquedas solo compilan sobre campos descriptores del DDM |
| Tratar los prefijos como pistas, no como pruebas | Las convenciones de nomenclatura heredadas varían y deben verificarse en el código |

## Qué hacer / Qué no hacer

| Qué hacer | Qué no hacer |
|---|---|
| Comenzar por `DEFINE DATA` para comprender las variables y los tipos | Interpretar reglas de negocio antes de conocer la estructura de los datos |
| Buscar el `READ` o `FIND` principal para identificar los datos procesados | Deducir el archivo principal del programa solo por su nombre |
| Rastrear cada dependencia `CALLNAT` y código de copia `INCLUDE` | Ignorar subprogramas externos, PDA, LDA, códigos de copia o mapas |
| Comprobar las rutas `AT BREAK`, `AT END OF DATA`, `ESCAPE` y `ON ERROR` | Leer solo el recorrido satisfactorio del programa |
| Comprobar `IF NO RECORDS FOUND` y el alcance de los campos de vista dentro de bloques `FIND`/`READ` | Suponer que los registros ausentes y los campos de vista se comportan como variables normales |
| Contrastar `FIND ... WITH` con los descriptores del DDM | Suponer que se puede buscar sobre un campo que no es descriptor |

## Lista de verificación antes de abrir una PR

- [ ] Se registraron las variables, matrices, parámetros y formatos relevantes de `DEFINE DATA` antes de resumir el comportamiento
- [ ] Se identificaron las rutas principales de `READ`, `FIND`, archivos de trabajo, informes y rupturas de control
- [ ] Se rastreó cada dependencia de `CALLNAT`, `INCLUDE`, `PARAMETER USING`, `LOCAL USING`, mapas y JCL, o se registró como pendiente
- [ ] Se compararon los formatos de campos del programa con el DDM en cuanto a tipo, tamaño y semántica de descriptores, MU, PE y superdescriptores
- [ ] Los valores decimales empaquetados y monetarios se mapearon o documentaron como candidatos a `BigDecimal`, nunca a valores de coma flotante
- [ ] Las reglas de negocio extraídas incluyen las rutas de error, escape, ausencia de registros, fin de datos y valores predeterminados silenciosos
