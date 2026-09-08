---
name: "doc-style-lint"
description: "Úsala para revisar el estilo, la claridad, el lenguaje inclusivo o el cumplimiento de las guías de estilo de Microsoft o Google en la documentación. Los desencadenantes incluyen \"revisión de documentación\", \"guía de estilo\", \"lenguaje claro\", \"lenguaje inclusivo\" y \"legibilidad\"."
---
# Revisión de estilo de la documentación

## Cuándo invocar

- "Comprueba este README con nuestra guía de estilo."
- "Reescribe esta documentación de API en lenguaje claro."
- "Busca términos excluyentes y jerga."

## Reglas

### Voz y tono

- **Voz activa**. "El sistema almacena el archivo", no "El archivo es almacenado por el sistema".
- **Tiempo presente**. "Devuelve una respuesta JSON", no "Devolverá una respuesta JSON".
- **Segunda persona** ("tú") para guías prácticas; **tercera persona** para documentación de referencia.
- **Títulos con mayúscula inicial solo en la primera palabra**, no en todas las palabras principales.

### Claridad

- Una idea por frase.
- Usa 25 palabras por frase como máximo práctico.
- No uses más de cinco frases por párrafo.
- Evita palabras que minimicen la dificultad ("solo", "simplemente", "fácilmente"). Inducen a error.
- No uses rayas. Usa comas, paréntesis o dos puntos.

### Lenguaje inclusivo

Sustituye:

- "master/slave" ("maestro/esclavo") -> "primario/réplica" o "líder/seguidor"
- "whitelist/blacklist" ("lista blanca/lista negra") -> "lista de permitidos/lista de bloqueados"
- "guys" ("chicos") -> "personas", "todo el mundo", "equipo"
- "crazy/insane" ("loco/demente", como intensificadores) -> "significativo", "inusual"
- "dummy" (en nombres de variables) -> "example", "sample"
- "sanity check" -> "comprobación rápida", "verificación"

### Estructura

- **Empieza por el resultado**, no por el contexto. Quien lee debe saber por qué continuar.
- **Indica al principio qué se aprenderá**.
- **Resume al final** de los documentos largos.
- **Usa títulos descriptivos** para facilitar la lectura rápida.

### Enlaces

- El texto del enlace describe el destino. Nunca uses "haz clic aquí" ni "este enlace".
- Usa URL absolutas para fuentes externas y relativas para contenido interno.
- Comprueba los enlaces en CI.

### Ejemplos de código

- Prueba todos los fragmentos ejecutables.
- Usa ejemplos realistas, no `foo/bar/baz`.
- Identifica claramente los marcadores de posición: `<YOUR-API-KEY>`.

### Números y unidades

- Usa cifras para 10 o más y palabras para los números de cero a nueve (estilo Microsoft).
- Usa unidades métricas e incluye conversiones para públicos diversos.
- Especifica siempre la unidad: "100 MB", no "100".

## Pasos de la revisión

1. **Lee una vez como el público destinatario**. ¿La extensión es adecuada? ¿Lo es el nivel de detalle?
2. **Ejecuta las comprobaciones automatizadas configuradas en el repositorio**, como Vale, Alex.js o markdownlint. Informa de las herramientas que falten sin instalarlas.
3. **Aplica las reglas de estilo** sección por sección.
4. **Prueba todos los ejemplos de código**.
5. **Pregúntate**: ¿una persona recién incorporada entendería esto el día 1?

## Antipatrones

- Revisar sin ejecutar primero los linters automatizados.
- Priorizar el estilo sobre el contenido.
- Reescribir la voz de quien redactó el texto en lugar de perfeccionarla.
- Ignorar la accesibilidad (texto alternativo, niveles de títulos, texto de enlaces).

## Plantilla de salida

```markdown
## Revisión de estilo - <Documento>

### Resumen
- Legibilidad (nivel Flesch-Kincaid): 11 (objetivo: <=12)
- Voz pasiva: 8% (objetivo: <10%)
- Problemas de lenguaje inclusivo: 2
- Enlaces rotos: 0
- Ejemplos de código sin probar: 3

### Recomendaciones (10 principales)
| ID | Ubicación | Problema | Corrección |
|----|----------|-------|-----|
| 01 | Sección de instalación | Voz pasiva | Reescribir en voz activa |
| 02 | Solución de problemas | "chicos" | Sustituir por "equipo" |
| 03 | Referencia de la API | "simplemente llama" | Eliminar "simplemente" |
```

## Puerta de calidad

- [ ] El documento supera los linters configurados en el repositorio (por ejemplo, Vale, Alex.js, markdownlint) antes de la revisión humana.
- [ ] El texto usa voz activa y tiempo presente, con mayúscula inicial solo en la primera palabra de los títulos.
- [ ] No quedan términos excluyentes; los términos señalados se sustituyen por alternativas inclusivas.
- [ ] Todos los ejemplos de código están probados y todos los enlaces se resuelven.
