# Cómo leer un programa Natural sin saber Natural

> **Ruta:** [Kit del equipo](../../README.md) › [Etapa 1](../README.md) › [SIFAP heredado](README.md) › **Cómo leer Natural**

**Tutorial de lectura orientado a reglas de negocio.** Aprende a extraer comportamientos relevantes de un archivo `.NSN` en 45 minutos, aunque no conozcas el lenguaje Natural.

| Campo | Valor |
|---|---|
| **Público** | PO, Redactor Técnico, analista de negocio, desarrollador júnior: cualquiera que abra un `.NSN` durante la Etapa 1 |
| **Prerrequisitos** | VS Code instalado; acceso a la carpeta `legacy-sifap/natural-programs/` |
| **Tiempo estimado** | 10 min para esta guía + 45 min por programa |
| **Etapa** | Etapa 1 — Arqueología |
| **Resultado esperado** | Al menos una regla catalogada con evidencia `file.NSN#L<start>-L<end>` |

> [!TIP]
> Solo necesitas leer cinco construcciones: comentarios con `*` al principio de la línea, `IF/END-IF`, `MOVE`, `COMPUTE` y el bloque `FIND`/`END-FIND`. El resto de la sintaxis es estructura técnica que puede ignorarse al leer reglas.

---

## 1. Anatomía visual de un programa Natural

```text
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *    <- CABECERA (comentarios)
* PROGRAM: CALCDSCT                                                   Cada línea con * es un comentario.
* SYSTEM:  SIFAP - SISTEMA DE FISCALIZACION Y ADMINISTRACION DE PAGOS  Lee aquí la historia del programa:
* AUTHOR:  ROBERTO MENDES JUNIOR                                      quién lo cambió y cuándo.
* DATE:    25/08/1999                                                 Pistas valiosas.
* CHANGED: 12/04/2007 - MARCIA HELENA - ANADIR DEDUCCION JUDICIAL
* PURPOSE: CALCULAR DEDUCCIONES DEL BENEFICIO
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

DEFINE DATA                                                          <- DECLARACIÓN DE DATOS
LOCAL USING LDASIFAP                                                   Primero las áreas externas
LOCAL                                                                  (LDA/PDA), luego los campos locales.
  1 PAYMENT-V VIEW OF PAYMENT                                      Puedes omitirlo: solo anota
    2 NUM-PAYMENT      (N15)                                         los campos que provienen de una tabla
    2 AMT-GROSS          (P9.2)                                        (VIEW OF = DDM).
    2 AMT-DISC-TOTAL (P7.2)
  1 #AMT-MAX-DISC        (P9.2)
END-DEFINE
*
MOVE *DATN TO #DT-TODAY                                                <- CUERPO DEL PROGRAMA
*                                                                       Aquí está la lógica.
* COMPROBAR TOPE DE DEDUCCIONES                                        CÉNTRATE AQUÍ.
IF #TYPE-DISC NE 'J'
  IF #AMT-TOTAL-DISC > (#AMT-GROSS * 0.30)
    COMPUTE #AMT-TOTAL-DISC = #AMT-GROSS * 0.30
  END-IF
END-IF
*
END
```

**Tres zonas:**

1. **Cabecera** (líneas con `*`): cuenta la historia del programa. Anota los autores y las fechas: indican cuándo se añadieron reglas.
2. **`DEFINE DATA` … `END-DEFINE`**: declara los datos. Empieza con áreas externas (`USING`) y termina con campos locales. Puedes omitirla o recorrerla para identificar qué campos DDM usa el programa.
3. **Cuerpo** (después de `END-DEFINE`): **aquí está la lógica de negocio**. Esto es lo que quieres extraer.

> [!NOTE]
> En los archivos fuente (`.NSP`, `.NSN`, `.NSA`, `.NSL`, `.NSC`, `.NSD`), los comentarios están en portugués **en mayúsculas y sin acentos**. Es intencional: el terminal 3270 del mainframe usa EBCDIC y no representa los caracteres acentuados de forma fiable. Esta documentación Markdown en español usa puntuación y mayúsculas normales.

---

## 2. Miembros de una biblioteca Natural

Un programa Natural casi nunca está aislado. SIFAP, el Sistema de Fiscalización y Administración de Pagos, tiene programas y también **áreas de datos, copycodes y subprogramas**. Puedes identificar cada tipo por su extensión de archivo.

| Extensión | Tipo de miembro | Propósito | Cómo entra en el programa |
|---|---|---|---|
| `.NSP` | Programa | Punto de entrada ejecutable: batch o en línea | Se ejecuta directamente (`EXEC PGM=NATBATCH` o introducido en el terminal) |
| `.NSN` | Subprograma | Lógica reutilizable con un contrato de parámetros | `CALLNAT '<name>'` |
| `.NSS` | Subrutina externa | Rutina compartida llamada por nombre | `PERFORM <subroutine>` |
| `.NSA` | PDA — *área de datos de parámetros* | Contrato de parámetros entre quien llama y quien recibe la llamada | `PARAMETER USING <pda>` en quien recibe; `LOCAL USING <pda>` en quien llama |
| `.NSL` | LDA — *área de datos local* | Campos y tablas compartidos por varios módulos | `LOCAL USING <lda>` |
| `.NSC` | Copycode | Fragmento de código insertado durante la compilación | `INCLUDE <copycode>` |
| `.NSM` | MAP | Diseño de pantalla 3270 | `INPUT USING MAP '<map>'` |
| `.NSD` | DDM — *módulo de definición de datos* | Cómo ve Natural un archivo Adabas | `VIEW OF <ddm>` en `DEFINE DATA` |
| `.jcl` | JCL z/OS | Cómo se ejecuta el batch en producción: trabajos, archivos y planificación | Fuera de Natural: `EXEC PGM=NATBATCH` |

> [!IMPORTANT]
> **La extensión identifica el tipo de miembro y el tipo determina cómo se invoca el módulo.** Confundir `.NSP` con `.NSN` es el error más común entre quienes empiezan con Natural: un programa no puede ser destino de `CALLNAT` y un subprograma no puede ejecutarse directamente. SIFAP tiene **12 programas** (`.NSP`) y **5 subprogramas** (`.NSN`).

### 2.1. Las cuatro líneas que crean dependencias

```natural
DEFINE DATA
PARAMETER USING PDAVALID    /* RECIBE PARAMETROS DE QUIEN LLAMA  (.NSA)
LOCAL USING LDASIFAP        /* USA EL AREA DE DATOS LOCAL COMPARTIDA (.NSL)
LOCAL
  1 #MSG               (A60)
END-DEFINE
*
CALLNAT 'SUBVALCP' #PV-TYPE-DOC #PV-CPF #PV-NIS
                   #PV-COD-RETURN #PV-MSG
                   #PV-IND-SPECIAL       /* LLAMA A OTRO MODULO (.NSN)
*
INCLUDE CCAUDIT             /* INSERTA AQUI UN BLOQUE DE CODIGO  (.NSC)
END
```

| Línea | Significado | Ubicación del miembro |
|---|---|---|
| `CALLNAT 'X'` | Llama al subprograma `X` y pasa parámetros | `X.NSN` |
| `... USING Y` | Usa el área de datos `Y` | `Y.NSA` (PDA) o `Y.NSL` (LDA) |
| `INCLUDE Z` | Inserta el copycode `Z` en este punto | `Z.NSC` |
| `PERFORM W` | Ejecuta una subrutina | Interna (`DEFINE SUBROUTINE W` en el mismo archivo) o externa `W.NSS` |

`PERFORM` normalmente permanece dentro del módulo. **`CALLNAT` cruza el límite del archivo**: eso es lo que importa para el mapa de dependencias.

> [!IMPORTANT]
> **Una biblioteca Natural es plana.** Todos los miembros residen en la misma biblioteca (`SIFAPPRD`) y se resuelven **por nombre**, nunca por ruta. `CALLNAT`, `INCLUDE` y `USING` no reciben una carpeta: por eso el kit mantiene todo en un único directorio `natural-programs/`. Los nombres de miembros se limitan a ocho caracteres, lo que explica abreviaturas como `CALCBENF` y `LDASIFAP`.

---

## 3. Construcciones importantes

### 3.1. Comentario — `*` al principio de la línea

Todo lo que empieza por `*` es texto libre. Lee siempre los comentarios: suelen explicar el "porqué" de una regla.

```natural
* COMPROBAR TOPE DE DEDUCCIONES
```

Significado: "Aquí el programa comprueba el tope de deducciones".

> [!TIP]
> Los comentarios suelen contener fechas e iniciales (`* 2007 MH - INC JUDICIAL`). Cada una es evidencia de que se añadió una regla en un momento concreto de la historia y de que puede seguir vigente.

### 3.2. Decisión — `IF` … `END-IF`

Esta es la construcción más importante. **Toda regla de negocio está dentro de un `IF`.**

```natural
IF #TYPE-DISC NE 'J'
  IF #AMT-TOTAL-DISC > (#AMT-GROSS * 0.30)
    COMPUTE #AMT-TOTAL-DISC = #AMT-GROSS * 0.30
  END-IF
END-IF
```

Lee en voz alta: "Si el tipo de deducción no es 'J' (judicial) y el total de deducciones supera el 30% del importe bruto, reduce el total al límite del 30%".

**Operadores comunes:**

| Natural | Significado |
|---|---|
| `EQ` o `=` | Igual |
| `NE` o `<>` | Distinto |
| `GT` o `>` | Mayor que |
| `LT` o `<` | Menor que |
| `GE` o `>=` | Mayor o igual que |
| `LE` o `<=` | Menor o igual que |
| `AND` | Y |
| `OR` | O |

Regla extraída del ejemplo: *"Las deducciones no judiciales (tipo distinto de J) tienen un tope del 30% del importe bruto".*

### 3.3. Asignación — `MOVE` y `COMPUTE`

`MOVE` copia un valor a una variable. `COMPUTE` realiza un cálculo.

```natural
MOVE *DATN TO #DT-TODAY               /* ASIGNA LA FECHA DE HOY A #DT-TODAY
MOVE 500.00 TO #BAND-CONTRIB(1)     /* ASIGNA 500 AL PRIMER TRAMO
COMPUTE #VLR-MAX = #AMT-GROSS * 0.30 /* CALCULA EL 30% DEL IMPORTE BRUTO
```

Todo lo que sigue a `/*` en la misma línea también es un comentario: la segunda forma de escribir comentarios en Natural, usada a menudo para anotar campos en `DEFINE DATA`.

> [!IMPORTANT]
> Los literales numéricos (`500.00`, `0.30`, `0.075`) casi siempre representan reglas: tramos, tasas o porcentajes. Registra cada uno que encuentres.

### 3.4. Llamada a otro módulo — `CALLNAT '<subprograma>'`

`CALLNAT` invoca un subprograma y equivale a una llamada de función. Los parámetros siguen el orden definido por el PDA y pueden ocupar varias líneas.

```natural
CALLNAT 'SUBVALCP' #PV-TYPE-DOC #PV-CPF #PV-NIS
                   #PV-COD-RETURN #PV-MSG
                   #PV-IND-SPECIAL
```

Significado: "Este módulo delega la validación de CPF al subprograma `SUBVALCP.NSN` y recibe el resultado en `#PV-COD-RETURN` y `#PV-MSG`".

Registra cada `CALLNAT`, `INCLUDE` y `USING` en [`dependency-map.md`](../dependency-map.md).

### 3.5. Acceso a datos — `FIND` … `END-FIND`

```natural
FIND BENEFICIARY-V WITH NUM-CPF = #CPF-STR
  IF NO RECORDS FOUND
    MOVE 'BENEFICIARY NOT FOUND' TO #MSG
    MOVE 2001 TO #COD-RETURNORNO
  END-NOREC
  MOVE BENEFICIARY-V.STAT-BENEFICIARY   TO #SIT
  MOVE BENEFICIARY-V.AMT-FAMILY-INCOME TO #INCOME
END-FIND
```

Lee en voz alta: "Busca el beneficiario con este CPF; si no se encuentra ninguno, registra el error; si se encuentra, copia el estado y los ingresos a variables de trabajo".

Tres puntos clave:

- **`IF NO RECORDS FOUND` … `END-NOREC` es la forma idiomática de manejar "no encontrado".** El bloque se ejecuta una vez cuando la búsqueda no devuelve registros.
- **Los campos de la vista (`BENEFICIARY-V.xxx`) solo son válidos dentro del bloque `FIND`.** Por eso el patrón habitual los copia a `#variables` antes de `END-FIND`.
- Los módulos más antiguos usan variaciones con la misma intención: `IF *NUMBER(BENEFICIARY-V) = 0` o una bandera lógica (`1 #FOUND-B (L)`) establecida dentro del `FIND` y comprobada después. Las diferencias de estilo suelen indicar distintos períodos de mantenimiento: anota la fecha de la cabecera.

---

## 4. Qué puedes ignorar sin riesgo

| Construcción | Qué es | Por qué omitirla |
|---|---|---|
| `READ … BY …` / `END-READ` | Bucle sobre registros Adabas | La regla está en el `IF` dentro del bucle |
| `WRITE` / `DISPLAY` / `PRINT` | Salida a pantalla o informe | Presentación, no una decisión |
| `FORMAT`, `WRITE TITLE`, `AT TOP OF PAGE`, `DEFINE PRINTER` | Formato de informes | Aspecto visual |
| `INPUT` | Lee desde un terminal 3270 | Se convertirá en un formulario web |
| `RESET INITIAL` | Inicializa una variable | Detalle técnico |
| `STORE` / `UPDATE` / `DELETE` | Persistencia Adabas | La regla es el `IF` anterior; `STORE` solo significa "guardar" |
| `END TRANSACTION` / `BACKOUT TRANSACTION` | Control de commits | Infraestructura de base de datos |
| `ON ERROR` / `END-ERROR` | Manejo de errores técnicos | No es una regla de negocio |
| `END-WORK` / `AT END OF DATA` | Fin del procesamiento | Estructura, no una regla |

> [!WARNING]
> `CALLNAT`, `INCLUDE` y `USING` **no** están en esta lista. Son dependencias y pertenecen al mapa.

---

## 5. Extraer una regla en cinco pasos

Usa `CALCDSCT.NSP` como ejemplo.

### Paso 1 — Lee la cabecera (1 min)

```natural
* PROGRAM: CALCDSCT
* PURPOSE: CALCULAR DEDUCCIONES DEL BENEFICIO
* CHANGED: 12/04/2007 - MARCIA HELENA - ANADIR DEDUCCION JUDICIAL
```

Registra en `business-rules-catalog.md`: "CALCDSCT calcula deducciones. Modificado en 2007 para añadir deducciones judiciales: posible regla especial".

### Paso 2 — Recorre `DEFINE DATA` (30 s)

Anota dos cosas: las líneas `USING` y `VIEW OF` (de dónde vienen los datos) y los nombres de variables que sugieren importes (`AMT-GROSS`, `TIPO-DSCT`).

### Paso 3 — Encuentra los `IF` (3–5 min)

Usa Ctrl+F en VS Code e introduce `IF`. Cada `IF` es una regla candidata.

| Línea | Condición | Posible regla |
|---|---|---|
| L142 | `IF #TYPE-DISC NE 'J'` | Tratamiento especial de las deducciones judiciales |
| L143 | `IF #AMT-TOTAL-DISC > (#AMT-GROSS * 0.30)` | Tope de deducciones del 30% |

### Paso 4 — Encuentra las constantes numéricas (2 min)

Usa Ctrl+F con `0.` para localizar `0.30`, `0.075` y valores similares. Cada constante sin explicar probablemente sea una tasa o porcentaje de una regla. Busca también `INIT <`: las tablas de parámetros cargan tramos y factores completos de una vez.

### Paso 5 — Confirma con Copilot Chat (2 min)

Selecciona un bloque de código en VS Code, abre Copilot Chat (modo Ask) y envía:

> "Explica este código Natural en español. Céntrate en la regla de negocio. Ignora la entrada y la salida."

Compara la explicación de Copilot con tu interpretación. Si coinciden, regístrala en el catálogo.

### De `.NSN` a una entrada del catálogo

Para cada condicional, describe solo el comportamiento confirmado por el equipo. Registra la evidencia sin inventar una intención que no esté explícita en el código:

| ID | Regla | Programa de origen | Riesgo |
|---|---|---|---|
| BR-XXX | Comportamiento confirmado | `file.NSN#L<start>-L<end>` | Evaluar |

Una condición ambigua debe registrarse como pregunta abierta en [`mysteries-found.md`](../mysteries-found.md), no convertirse en una regla.

---

## 6. Tipos y formatos de campos (DDM y variables)

> [!IMPORTANT]
> **En este laboratorio, el separador decimal de una especificación de formato en código fuente Natural es un punto.** Natural Community Edition 9.3.3 compila `(N9.2)` y `(P9.2)`. Rechaza las formas con coma, como `(N9,2)` y `(P9,2)`, con `NAT0165`.
>
> Las instalaciones de Natural pueden variar según la configuración del carácter decimal, y las instalaciones antiguas de mainframe solían usar una coma. Esta inmersión sigue la imagen Natural CE 9.3.3. `DC=,` no es una solución aquí porque entra en conflicto con el delimitador `ID` y produce `NAT0385`.
>
> Esta regla se aplica **solo a las declaraciones del código fuente**. En los valores literales del código, el separador sigue siendo un punto: `MOVE 1.3500 TO #FACTOR-ADJUST` y `COMPUTE #VLR = #BRUTO * 0.30`. Los listados DDM siguen mostrando las longitudes decimales con coma, por ejemplo, `P  9,2`.

### 6.1. Formatos que encontrarás

| Notación | Significado | En PostgreSQL |
|---|---|---|
| `(A60)` | Alfanumérico, 60 caracteres | `VARCHAR(60)` |
| `(A11)` | Alfanumérico, 11 caracteres: así se almacenan CPF y NIS (conserva los ceros iniciales) | `CHAR(11)` |
| `(N11)` | Numérico *no empaquetado*, 11 dígitos, sin decimales | `NUMERIC(11)` |
| `(N8)` | Fecha en formato `AAAAMMDD`: Natural no tiene aquí un tipo de fecha | `DATE` |
| `(N6)` | Período de referencia en formato `AAAAMM` u hora en formato `HHMMSS` | `INTEGER` (convertir) |
| `(N9.2)` | Numérico *no empaquetado*, 9 dígitos, 2 decimales | `NUMERIC(9,2)` |
| `(P9.2)` | *Decimal empaquetado*, 9 dígitos, 2 decimales | `NUMERIC(9,2)` |
| `(P13.2)` | *Decimal empaquetado*, 13 dígitos, 2 decimales: acumulador batch | `NUMERIC(13,2)` |
| `(N3.4)` | 3 dígitos, 4 decimales: típico de un factor o índice | `NUMERIC(3,4)` |
| `(L)` | Lógico (`TRUE` / `FALSE`) | `BOOLEAN` |

### 6.2. `P` (empaquetado) × `N` (no empaquetado): el dinero siempre es `P`

| | `N` — *no empaquetado* | `P` — *decimal empaquetado* |
|---|---|---|
| Almacenamiento | 1 dígito por byte | 2 dígitos por byte; el último *nibble* almacena el signo |
| Costo | Más espacio | Menos espacio, aritmética más rápida |
| Uso típico en SIFAP | Contadores, códigos, fechas `AAAAMMDD` e índices de bucles | **Valores monetarios y factores de cálculo** |

En el mainframe, el dinero está *empaquetado*. Eso es lo que indica el DDM —`CH AMT-FAMILY-INCOME P 9,2`— y lo que declaran los programas. Cuando encuentres `(P9.2)`, `(P7.2)` o `(P13.2)` en código Natural, estás viendo un campo de importe.

> [!TIP]
> Durante la modernización, los valores decimales `P` y `N` se convierten en `BigDecimal` en Java y `NUMERIC(p,s)` en PostgreSQL. **Nunca** uses `double` ni `float`: el sistema heredado calcula decimales exactos y las diferencias aparecen a nivel de centavos.

### 6.3. Arrays: el rango de índices es explícito

| Notación | Significado |
|---|---|
| `(A60/1:10)` | 10 ocurrencias de 60 caracteres |
| `(N3.4/1:27)` | 27 ocurrencias de 3 dígitos con 4 decimales |
| `(P9.2/1:5)` | 5 ocurrencias monetarias |
| `(N3.6/1:10,1:12)` | Array bidimensional, 10 × 12 |

Los límites forman parte de la notación: escribe `1:27`, no solo `27`. Los arrays suelen aparecer con `INIT <...>`: **cada número de esa lista es una regla candidata**. Las dimensiones cuentan una historia: 27 posiciones suelen indexar UF, mientras que 12 indexan meses.

### 6.4. Estructuras Adabas que no caben en una columna

| En el DDM | Significado | Consecuencia |
|---|---|---|
| Columna `T` = `M` (`MU`) | Campo multivalor: varios valores en un registro | **Se convierte en una tabla hija** |
| Columna `T` = `P` (`PE`) | Grupo periódico: subregistros repetidos | **Se convierte en una tabla hija** |

> [!WARNING]
> `MU` (valor múltiple) y `PE` (grupo periódico) son las únicas construcciones Adabas que no se mapean directamente a PostgreSQL. Cada vez que encuentres una, márcala en el mapa de dependencias: se convierten en tablas separadas en la Etapa 3.

---

## 7. Lectura de un listado DDM

Los archivos `.ddm` son listados de la utilidad `LISTDDM`: salida de máquina, no código fuente editable. La tabla principal siempre tiene las mismas columnas:

```text
 T L DB Name                     F Leng  S D Remark
 - - -- ------------------------ - ----  - - ---------------------------
   1 AB NUM-CPF                  A   11    U UNFORMATTED CPF
   1 CH AMT-FAMILY-INCOME       P  9,2  N   DECLARED INCOME
 P 1 DA GRP-DEPEND                        (1:10) PERIODIC GROUP
   2 DC NAME-DEPEND          A   60  N
 S   S2 SUPER-UF-STAT             A    3    S
        /* BG(1-2), CE(1-1)
```

| Columna | Interpretación |
|---|---|
| `T` | Tipo: *(vacío)* elemental · `G` grupo · `M` multivalor (`MU`) · `P` grupo periódico (`PE`) · `S` descriptor derivado |
| `L` | Nivel: `1` campo raíz · `2` campo dentro de un grupo o PE |
| `DB` | *Nombre corto* de 2 bytes: el nombre físico que conoce Adabas |
| `Name` | Nombre largo: el que aparece en las declaraciones `VIEW OF` de los programas |
| `F` | Formato: `A` alfanumérico · `N` numérico *no empaquetado* · `P` *decimal empaquetado* |
| `Leng` | Longitud en bytes; los decimales usan `digits,decimals` (`9,2`) |
| `S` | Almacenamiento: `N` *supresión de nulos* · `F` *almacenamiento fijo* |
| `D` | Índice: `D` descriptor · `U` único · `S` super · `H` hiper · `P` fonético · *(vacío)* no indexado |

La línea que empieza por `/*` inmediatamente debajo de un descriptor derivado enumera **los campos que lo componen**. En el ejemplo, `SUPER-UF-STAT` concatena los dos primeros bytes de `BG` (UF) con el primer byte de `CE` (estado): equivale a un índice compuesto.

### 7.1. `FIND ... WITH` solo es válido sobre un descriptor

`FIND` busca a través de un índice Adabas. Por tanto, `FIND <view> WITH <field>` **solo funciona si el campo tiene un valor en la columna `D`** (`D`, `U`, `S`, `H` o `P`). No se puede buscar un campo sin índice.

| Campo de `BENEFIC.ddm` | Columna `D` | ¿Es válido `FIND ... WITH`? |
|---|---|---|
| `AB NUM-CPF` | `U` | Sí |
| `CE STAT-BENEFICIARY` | `D` | Sí |
| `CH AMT-FAMILY-INCOME` | *(vacía)* | **No** |
| `AD MOTHER-NAME` | *(vacía)* | **No** |

Sin un descriptor, el programa necesita otra vía: normalmente `READ <view> BY <descriptor>` con un `IF` que filtre dentro del bucle.

**Cómo comprobarlo en 15 segundos:** abre el `.ddm`, usa Ctrl+F con el nombre del campo e inspecciona la columna inmediatamente anterior a `Remark`.

La leyenda completa de columnas está en el pie de cada `.ddm` y en el [README de los DDM](adabas-ddms/README.md).

---

## 8. Atajos de VS Code para ahorrar tiempo

<details>
<summary><strong>Tabla de atajos y consejos de uso de Copilot Chat</strong></summary>

| Atajo | Qué hace |
|---|---|
| Ctrl+F | Buscar dentro del archivo |
| Ctrl+Shift+F | Buscar en todos los archivos |
| Ctrl+G + número | Ir a la línea N |
| Seleccionar + Copilot Chat | Enviar un fragmento directamente para analizarlo |

> [!TIP]
> Selecciona todo el programa Natural, abre Copilot Chat y envía: "Enumera todas las reglas de negocio de este programa Natural. Para cada una, proporciona el rango de líneas, la condición en español y el nivel de riesgo (CRITICAL/HIGH/MEDIUM/LOW)." En 30 segundos, el 80% del trabajo está hecho. Confírmalo siempre inspeccionando el `IF` original.

</details>

---

## 9. Mapa de los 15 programas: guía de lectura

| Categoría | Programas | Qué esperar |
|---|---|---|
| Registro | `CADBENEF`, `CADDEPEN`, `CADPROG` | Pantallas de entrada. Validaciones de CPF, nombre y fecha. |
| Cálculo | `CALCBENF`, `CALCCORR`, `CALCDSCT` | Fórmulas y constantes. Aquí reside la mayoría de las reglas financieras. |
| Validación | `VALBENEF`, `VALDOCS`, `VALELEG` | Secuencias de instrucciones `IF`. Cada una se convierte en una prueba. |
| Batch | `BATCHPGT`, `BATCHREL`, `BATCHCON` | Muchas instrucciones `CALLNAT`. Revela el flujo de negocio. |
| Consultas e informes | `CONSBENF`, `RELPGT`, `RELAUDIT` | Muchas instrucciones `READ`/`WRITE`. Pocas reglas: lectura rápida. |

> [!NOTE]
> La carpeta `natural-programs/` también contiene **miembros de apoyo** (PDA, LDA, copycode, subprograma y JCL). Son infraestructura compartida: consúltalos cuando uno de tus tres programas use `USING`, `INCLUDE` o `CALLNAT`, pero **no son lectura asignada**. El inventario completo está en el [README de los programas Natural](natural-programs/README.md).

---

## 10. Errores de lectura comunes

| Error | Corrección |
|---|---|
| Intentar entender cada línea | Céntrate solo en `IF`, `COMPUTE` con constantes y comentarios. |
| Leer en el orden del archivo | Ve directamente a los `IF` usando Ctrl+F. |
| Confundir una variable (`#VLR`) con un campo DDM (`AMT-GROSS`) | `#` inicial = variable local. Sin `#` = campo de base de datos. |
| Suponer que cada `MOVE` es una regla | `MOVE` es una asignación. La regla es el `IF` que seleccionó el `MOVE`. |
| Copiar una forma con coma de un listado DDM (`P 9,2`) a la documentación del código fuente Natural | Las declaraciones de código fuente usan punto en este laboratorio: `(N9.2)`, `(P13.2)`. |
| Tratar `(P9.2)` como algo distinto de dinero | `P` es *decimal empaquetado*: el formato monetario del mainframe. |
| Registrar la lectura de un campo de vista fuera del bloque `FIND` | Comprueba si el valor se copió a una `#variable` antes de `END-FIND`. |
| Registrar una regla sin una cita de línea | Registra siempre `file.NSN#L<start>-L<end>`. La CI rechaza las entradas que no la incluyen. |

---

## 11. Cuándo pedir ayuda

Si no puedes extraer al menos una regla de un programa en 45 minutos:

1. Avisa a la persona facilitadora.
2. Muestra el programa que estás leyendo.
3. Pregunta: "¿Qué `IF` de aquí es una regla de negocio y cuál es solo técnico?"

---

### Sigue leyendo

| Anterior | Siguiente |
|---|---|
| [SIFAP heredado — descripción general](README.md)<br/><sub>Contexto del sistema e inventario completo.</sub> | [GUÍA de la Etapa 1](../GUIDE.md)<br/><sub>Recorrido de 90 minutos con horarios.</sub> |

<sub>[Volver al índice del kit](../README.md)</sub>
