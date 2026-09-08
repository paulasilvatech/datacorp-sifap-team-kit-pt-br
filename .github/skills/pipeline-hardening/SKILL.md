---
name: "pipeline-hardening"
description: "Úsala para reforzar una canalización de CI/CD, migrar a OIDC, firmar artefactos o cumplir los requisitos SLSA. Los desencadenantes incluyen \"SLSA\", \"cadena de suministro\", \"OIDC\", \"sigstore\", \"cosign\", \"seguridad de la canalización\" y \"fortalecimiento de GHA\"."
---
# Fortalecimiento de canalizaciones

## Cuándo invocar

- "Refuerza nuestra canalización de GitHub Actions / Azure DevOps / GitLab."
- "Migra de secretos de larga duración a OIDC."
- "Alcanza el nivel 2/3 de SLSA."
- "Firma nuestras imágenes de contenedor."

## Modelo de amenazas (lista breve)

1. **Robo de secretos** a través de los registros de la canalización o de un ejecutor comprometido.
2. **Dependencia maliciosa** publicada en el origen o mediante suplantación por nombres similares (typosquatting).
3. **Acción de GitHub de terceros o paso compartido comprometido**.
4. **Artefacto manipulado** entre la compilación y el despliegue.
5. **Escalada de privilegios** causada por permisos demasiado amplios en la canalización.

## Controles (ordenados por retorno de la inversión)

### Nivel 1: hacer primero

- [ ] **OIDC para la nube**: no almacenes credenciales de nube de larga duración como secretos. Usa una identidad federada con tokens de corta duración.
- [ ] **Fija las acciones de terceros por SHA**, no por etiqueta (`actions/checkout@<sha>` con un comentario que indique la versión).
- [ ] Un **bloque `permissions:`** en cada flujo de trabajo, con `contents: read` de forma predeterminada y elevación solo donde sea necesaria.
- [ ] **Protección de ramas**: revisiones obligatorias, comprobaciones de estado obligatorias, prohibición de pushes forzados y commits firmados en main.
- [ ] **Análisis de secretos + protección de push** habilitados en toda la organización.
- [ ] **Dependabot / Renovate** para dependencias y acciones.

### Nivel 2: integridad de la cadena de suministro

- [ ] **SBOM** generada en cada compilación (Syft / CycloneDX).
- [ ] **Firma de artefactos** con Cosign (preferiblemente sin claves mediante OIDC).
- [ ] **Procedencia** (atestación SLSA v1.0) publicada junto al artefacto.
- [ ] **Verificar las firmas durante el despliegue**: el job de despliegue rechaza los artefactos sin firma.
- [ ] **Análisis de vulnerabilidades** (Trivy / Grype) en la imagen; fallar ante hallazgos críticos o altos, salvo excepciones justificadas.

### Nivel 3: madurez

- [ ] **Compilaciones herméticas o reproducibles** cuando sea viable.
- [ ] **Revisión por dos personas** para las canalizaciones de lanzamiento.
- [ ] **Fortalecimiento de los ejecutores**: efímeros, con salida de red restringida y sin estado mutable compartido.

## Antipatrones

- Almacenar `AWS_ACCESS_KEY_ID` / `AZURE_CLIENT_SECRET` como secretos del repositorio cuando OIDC está disponible.
- `permissions: write-all`.
- Etiquetas móviles `@main` o `@v3` en acciones de terceros.
- Desplegar un artefacto compilado en otra canalización sin verificar su firma.
- Secretos impresos en los registros mediante expansión de shell sin comillas.

## Plantilla de salida

```markdown
## Informe de fortalecimiento de la canalización - <flujo de trabajo o repositorio>

| Control | Estado | Evidencia / carencia |
|---|---|---|
| OIDC para autenticación en la nube | Completado / pendiente | <enlace o nota> |
| Acciones fijadas por SHA | Completado / pendiente | <cantidad de etiquetas móviles> |
| Permisos de privilegio mínimo | Completado / pendiente | <flujos de trabajo sin el bloque> |
| SBOM + firma de artefactos | Completado / pendiente | <herramienta> |
| Procedencia (SLSA) | Nivel 0/1/2/3 | <enlace a la atestación> |

**Nivel SLSA objetivo**: <N>
**Carencias bloqueantes**: <cantidad>
```

## Puerta de calidad

- [ ] No quedan secretos de nube de larga duración; la autenticación en la nube utiliza federación OIDC.
- [ ] Cada acción de terceros está fijada por SHA de commit, no por una etiqueta móvil.
- [ ] Cada flujo de trabajo declara un bloque `permissions:` de privilegio mínimo (`contents: read` de forma predeterminada).
- [ ] Los artefactos de lanzamiento están firmados y sus firmas se verifican durante el despliegue.
- [ ] El análisis de secretos, la protección de push y las actualizaciones de dependencias están habilitados.

## Referencias

- [SLSA v1.0](https://slsa.dev/spec/v1.0/)
- [GitHub - Fortalecimiento de la seguridad de GHA](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Sigstore / Cosign](https://docs.sigstore.dev/)
- [OpenSSF Scorecard](https://scorecard.dev/)
