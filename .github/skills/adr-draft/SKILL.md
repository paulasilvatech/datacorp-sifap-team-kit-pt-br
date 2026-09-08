---
name: "adr-draft"
description: "Úsala para redactar registros de decisiones de arquitectura, evaluar alternativas o documentar ventajas e inconvenientes técnicos. Los desencadenantes incluyen \"ADR\", \"decisión de arquitectura\", \"ventajas e inconvenientes\", \"elegir entre\" y \"por qué elegimos\"."
---
# Redacción de ADR

## Cuándo invocar

- "Redacta un ADR sobre la elección de PostgreSQL en lugar de MongoDB."
- "Documenta nuestra decisión de adoptar una arquitectura orientada a eventos."
- "Revisa ADR-007: necesitamos reemplazarlo."

## Cuándo escribir un ADR

Escribe un ADR cuando una decisión:

- Sea difícil o costosa de revertir.
- Afecte a más de un equipo.
- Restrinja opciones futuras (dependencia de una tecnología).
- Probablemente se cuestione dentro de 6 meses.

No escribas un ADR para una refactorización local o un cambio de configuración reversible.

## Consejos de redacción

- Escribe en presente ("Usamos X").
- Incluye al menos 2 alternativas descartadas.
- Señala las consecuencias que sabes que serán difíciles de asumir. Tu yo del futuro te lo agradecerá.
- Reemplaza; nunca elimines. El historial aporta valor.

## Antipatrones

- ADR escritos a posteriori para justificar una decisión ya tomada.
- Un ADR que agrupa 5 decisiones sin relación entre sí.
- Ausencia de una sección de alternativas, señal de que no se analizaron las ventajas y los inconvenientes.
- Estado estancado en "propuesto" durante meses.

## Plantilla de salida

Guarda el ADR en `docs/adr/NNNN-<slug>.md`. La plantilla canónica del repositorio es [`docs/adr/0000-template.md`](../../../docs/adr/0000-template.md); este es su formato resumido:

```markdown
# ADR-NNN: <Título de la decisión en imperativo>

**Estado**: propuesto | aceptado | reemplazado por ADR-NNN | obsoleto
**Fecha**: YYYY-MM-DD
**Responsables de la decisión**: <nombres>
**Etiquetas de contexto**: seguridad, rendimiento, costo

## Contexto
2-4 párrafos. ¿Qué obliga a tomar la decisión? ¿Qué restricciones se aplican?

## Decisión
Un párrafo. "Vamos a <decisión>."

## Alternativas consideradas
- **Opción A**: <resumen>. Ventajas: ... Inconvenientes: ...
- **Opción B**: <resumen>. Ventajas: ... Inconvenientes: ...
- **Opción C (elegida)**: <resumen>. Ventajas: ... Inconvenientes: ...

## Consecuencias
### Positivas
- ...
### Negativas
- ...
### Neutrales
- ...

## Acciones de seguimiento
- [ ] Actualizar REQ-NNN
- [ ] Migrar <sistema>
- [ ] Revisar en Q<N>

## Referencias
- Fuente 1
- Fuente 2
```

## Puerta de calidad

- [ ] El ADR tiene secciones de Contexto, Decisión, Alternativas consideradas y Consecuencias.
- [ ] Se documentan al menos dos alternativas descartadas con sus ventajas e inconvenientes.
- [ ] El estado está definido (propuesto, aceptado, reemplazado u obsoleto), no en blanco.
- [ ] El archivo se guarda como `docs/adr/NNNN-<slug>.md` y se enlaza desde los REQ-ID afectados.
