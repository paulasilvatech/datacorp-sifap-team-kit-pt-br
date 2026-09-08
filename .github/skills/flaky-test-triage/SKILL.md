---
name: "flaky-test-triage"
description: "Úsala cuando una prueba falle de forma intermitente, la CI sea inestable o necesites poner una prueba inestable en cuarentena. Los desencadenantes incluyen \"prueba inestable\", \"cuarentena\", \"fallo intermitente\", \"inestabilidad de CI\" y \"panel de pruebas inestables\"."
---
# Diagnóstico y clasificación de pruebas inestables

## Cuándo invocar

- La CI falla y la siguiente ejecución pasa.
- "Esta prueba es inestable; ayúdame a corregirla."
- "Crea un proceso de cuarentena para pruebas inestables."

## Flujo de diagnóstico

1. **Reproduce el fallo**: ejecuta la prueba de forma aislada 50× con `--repeat-each 50` (Playwright) o `pytest --count=50`. Si falla <1×, probablemente dependa del orden de ejecución.
2. **Clasifica** la causa raíz de la inestabilidad:

- **Asincronía/temporización**: falta de await, condición de carrera, espera fija incrustada en el código
- **Dependencia del orden**: estado compartido, base de datos sin limpiar, singleton global
- **Dependencia externa**: red, reloj, sistema de archivos
- **No determinismo**: iteración sobre un mapa sin ordenar, semilla aleatoria
- **Contención de recursos**: puerto, bloqueo de archivo, colisión entre procesos paralelos

3. **Corrige la causa raíz**: sustituye las pausas fijas por esperas explícitas, aísla el estado, fija las semillas aleatorias y usa puertos limitados al ámbito de cada prueba.
4. **Ponla en cuarentena si no puede corregirse en <1 día**: asígnale una etiqueta `flaky/`, abre una incidencia de seguimiento y establece un SLA de 30 días para corregirla o eliminarla.

## Política de cuarentena

- Las pruebas en cuarentena se ejecutan, pero no hacen fallar la compilación.
- Elimina todo lo que lleve >30 días en cuarentena. Una prueba que no puede corregirse es peor que no tenerla.
- Panel: supervisa la tasa de fallos intermitentes de cada prueba durante 100 ejecuciones. Pon automáticamente en cuarentena cualquiera que supere el 5%.

## Antipatrones

- `sleep(1000)`: siempre es incorrecto.
- Repetir la aserción en un bucle: oculta errores de temporización.
- `@Retry(3)`: enmascara los fallos intermitentes y premia las pruebas deficientes.

## Plantilla de salida

Registra cada fallo intermitente investigado y la decisión tomada:

```markdown
## Diagnóstico de inestabilidad - <id de prueba>

| Campo | Valor |
|---|---|
| Prueba | <suite::nombre de prueba> |
| Tasa de fallos intermitentes | <N>% en <M> ejecuciones |
| Causa raíz | Asincronía-temporización / Dependencia del orden / Dependencia externa / No determinismo / Contención de recursos |
| Corrección o cuarentena | <enlace a la PR, o etiqueta `flaky/` + incidencia de seguimiento> |
| SLA | <fecha límite de 30 días para corregir o eliminar> |

### Evidencia
- <comando usado para reproducir el fallo, por ejemplo, pytest --count=50 path::test>
- <salida del fallo observado o condición de carrera>
```

## Puerta de calidad

- [ ] El fallo intermitente se reprodujo de forma aislada (50 o más ejecuciones) y se identificó su categoría.
- [ ] La corrección aborda la causa raíz; no se añadieron `sleep`, reintentos ni bucles de aserciones.
- [ ] Todo lo que no se corrija en un día se pone en cuarentena con una incidencia de seguimiento y un SLA de 30 días.
- [ ] Las pruebas en cuarentena siguen ejecutándose, pero no hacen fallar la compilación.

## Referencias

- [Google - Pruebas inestables en Google](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html)
- [Microsoft Research - Estudio empírico de pruebas inestables](https://www.microsoft.com/en-us/research/publication/an-empirical-analysis-of-flaky-tests/)
