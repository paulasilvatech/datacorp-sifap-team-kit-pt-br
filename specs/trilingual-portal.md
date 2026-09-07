# Trilingual documentation portal

This is a greenfield delivery surface for the kit, not a change to SIFAP business behavior.

## Requirements

### REQ-PORTAL-001: Complete repository coverage

WHEN a production build resolves the language branches, the portal SHALL inventory every tracked file and provide a document, source view or original download for each file.
source_legacy: "[GREENFIELD] The repository delivery portal does not exist in the Natural/Adabas application."

### REQ-PORTAL-002: Three complete language editions

The portal SHALL provide English, Spanish and Brazilian Portuguese routes backed by `main`, `espanol` and `portugues-br`, without silently replacing missing translated documentation with English.
source_legacy: "[GREENFIELD] Trilingual documentation delivery is a new kit capability."

### REQ-PORTAL-003: Persistent language navigation

WHEN a reader changes the language of a document, the portal SHALL open the same logical source path in the selected edition.
source_legacy: "[GREENFIELD] Website language navigation has no legacy equivalent."

### REQ-PORTAL-004: Correct links and source provenance

WHEN the portal renders a repository link, it SHALL resolve the corresponding website document or asset and retain an explicit link to the original Git source and commit.
source_legacy: "[GREENFIELD] Web routing and source provenance belong to the new portal."

### REQ-PORTAL-005: Interactive discovery

WHEN a reader searches or filters the catalog, the portal SHALL show matching content in the active language and announce loading, empty and error states accessibly.
source_legacy: "[GREENFIELD] Browser-side documentation search is a new capability."

### REQ-PORTAL-006: Responsive and accessible interface

WHILE the viewport is narrow, the portal SHALL retain visible language navigation and keyboard-accessible controls without horizontal page overflow.
source_legacy: "[GREENFIELD] Responsive web navigation is independent of legacy application behavior."

### REQ-PORTAL-007: Motion and preferences

WHEN a reader selects a theme, marks reading progress or requests reduced motion, the portal SHALL apply the preference without hiding required content or changing repository data.
source_legacy: "[GREENFIELD] Local reading preferences and animation controls are new portal behavior."

### REQ-PORTAL-008: Preserve technical sources

The portal SHALL preserve original file bytes for downloads, render code as non-executable text and avoid traversing Git symlinks outside the repository.
source_legacy: "[GREENFIELD] Safe source-file delivery is a new repository publishing concern."

### REQ-PORTAL-009: Protect private instructor content

IF a source repository is private and Pages visibility is public or unknown, THEN the deployment SHALL stop before publishing its content.
source_legacy: "[GREENFIELD] Private Pages access control protects instructor material outside the legacy system."

### REQ-PORTAL-010: Reproducible release validation

WHEN a release is built, the portal SHALL record source commit IDs, language coverage and internal-link validation results and SHALL fail if a required check fails.
source_legacy: "[GREENFIELD] Reproducible documentation release validation is a new kit requirement."
