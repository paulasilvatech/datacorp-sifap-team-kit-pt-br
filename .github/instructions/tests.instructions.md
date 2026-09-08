---
description: "Utiliza al crear o revisar pruebas automatizadas, estrategias de pruebas, especificaciones, lagunas de cobertura, pruebas de regresión y puertas de calidad."
applyTo: "**/*.test.*,**/*.spec.*,**/tests/**"
---

# Convenciones de pruebas — JUnit, Vitest y trazabilidad

Este archivo se activa para cualquier archivo de prueba (`*.test.*`, `*.spec.*` o cualquier archivo en una ruta `tests/`), tanto de backend como de frontend. Enseña la estructura y nomenclatura de pruebas, las herramientas de backend (JUnit 5 + Testcontainers) y frontend (Vitest + Testing Library), la trazabilidad de REQ-ID y los objetivos de cobertura. Las pruebas se escriben **durante** la implementación, nunca se añaden después como un complemento.

## Pirámide de pruebas

| Capa | Herramientas | Proporción |
|---|---|---|
| Unitaria (servicios, lógica pura) | JUnit 5 / Vitest, sin E/S | La mayoría de las pruebas |
| Integración (repositorios, componentes) | Testcontainers / Testing Library | Menos |
| Extremo a extremo | Solo el flujo crítico | La menor cantidad |

La habilidad [`test-strategy`](../skills/test-strategy/SKILL.md) define la forma de la pirámide y las decisiones sobre objetivos de cobertura.

## Estructura: preparar, actuar y verificar

Cada prueba tiene tres fases visibles y verifica un comportamiento. Simula solo los límites externos, nunca la base de datos ni la clase que se está probando.

```java
@Test
void should_reject_duplicate_label() { // REQ-021
    resourceRepository.save(Resource.of("alpha", new BigDecimal("10.00"))); // Preparar
    var request = new CreateResourceRequest("alpha", new BigDecimal("5.00"));
    assertThatThrownBy(() -> resourceService.create(request))            // Actuar
        .isInstanceOf(ResourceConflictException.class);                  // Verificar
}
```

## Nomenclatura

Nombra las pruebas con `should_<expected behavior>_when_<condition>` (backend) o expresa la misma intención en un `it(...)` de Testing Library (frontend).

```text
should_return_409_when_identifier_already_exists
should_render_empty_state_when_no_resources
```

## Backend: JUnit 5 + Testcontainers

Las pruebas de repositorios y de integración se ejecutan contra un PostgreSQL 16 real en un contenedor, nunca H2, para que el comportamiento coincida con producción. Vincula el contenedor mediante `@ServiceConnection`.

```java
@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ResourceRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @Autowired
    ResourceRepository resourceRepository;

    @Test
    void should_find_resource_by_label_when_it_exists() { // REQ-021
        resourceRepository.save(Resource.of("alpha", new BigDecimal("10.00")));
        assertThat(resourceRepository.findByLabel("alpha")).isPresent();
    }
}
```

La lógica de negocio del backend debe incluir un caso satisfactorio, un fallo de validación y un fallo de autenticación o autorización.

## Frontend: Vitest + Testing Library

Busca por rol accesible o etiqueta, nunca por identificador de prueba cuando exista un rol, y realiza las interacciones con `user-event`. Evita pruebas basadas únicamente en instantáneas.

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ArchiveButton } from './ArchiveButton';

describe('ArchiveButton', () => {
  it('should call onArchive when clicked', async () => { // REQ-032
    const onArchive = vi.fn().mockResolvedValue(undefined);
    render(<ArchiveButton id="1" onArchive={onArchive} />);
    await userEvent.click(screen.getByRole('button', { name: /archive/i }));
    expect(onArchive).toHaveBeenCalledWith('1');
  });
});
```

## Trazabilidad de REQ-ID

Cada prueba que verifica un requisito indica su REQ-ID en un comentario en línea. Esto alimenta el informe no bloqueante `spec-traceability` (consulta [`requirements.instructions.md`](requirements.instructions.md)), que enumera los REQ-ID que aún no referencia ninguna prueba.

## Objetivos de cobertura

El mínimo del repositorio es **≥ 80% de líneas** y **≥ 70% de ramas**; las clases de servicios y lógica de negocio deben aspirar a más (~85% de líneas). La CI ejecuta Jacoco (backend) y Vitest `--coverage` (frontend) e informa de los valores; configura los umbrales en `pom.xml` y en la configuración de Vitest para que `verify`/`test` fallen por debajo del mínimo.

> [!NOTE]
> La cobertura es un mínimo, no una meta. Una rama sin aserciones no está probada aunque la línea esté «cubierta»: verifica el comportamiento, no solo la llamada.

## Convenciones

| Regla | Justificación |
|---|---|
| Preparar-actuar-verificar, un comportamiento por prueba | Facilita la lectura y aísla el fallo |
| Simular solo los límites externos | Una base de datos real mediante Testcontainers detecta errores reales |
| Nomenclatura `should_<behavior>_when_<condition>` | La intención resulta evidente en el informe |
| `// REQ-NNN` en línea en las pruebas de requisitos | Mantiene la trazabilidad especificación ↔ prueba |
| Escritas durante la implementación | No se integra código sin probar |

## Qué hacer / Qué no hacer

| Qué hacer | Qué no hacer |
|---|---|
| Utilizar PostgreSQL 16 con Testcontainers | Sustituirlo por H2 para las pruebas de integración |
| Buscar por rol o etiqueta | Buscar por `data-testid` cuando existe un rol |
| Verificar el comportamiento y las ramas de casos límite | Depender de cobertura basada solo en instantáneas o líneas |
| Escribir la prueba junto con el código | Añadir pruebas después de que la funcionalidad esté «terminada» |

## Lista de verificación antes de abrir una PR

- [ ] El nuevo comportamiento tiene pruebas unitarias; la persistencia tiene una prueba de integración con Testcontainers
- [ ] Las pruebas siguen preparar-actuar-verificar y la nomenclatura `should_..._when_...`
- [ ] Las pruebas guiadas por requisitos incluyen un comentario en línea `// REQ-NNN`
- [ ] La lógica de negocio cubre el caso satisfactorio, el fallo de validación y el fallo de autenticación o autorización
- [ ] La cobertura cumple el mínimo de ≥ 80% de líneas / ≥ 70% de ramas
- [ ] No se deja ningún límite externo sin simular ni se sustituye por una simulación ninguna dependencia real
