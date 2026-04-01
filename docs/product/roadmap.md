# Roadmap

## Próximos pasos (prioridad alta)

1. Consolidar pruebas manuales por módulo en checklist ejecutable.
2. Agregar tests automatizados de motores (`src/logic/*`) con casos de regresión.
3. Revisión clínica formal de divergencias documentadas entre código y v2.0.

## Módulos/funcionalidades pendientes

- Mayor granularidad oncológica hematológica.
- Ramas pediátricas avanzadas (prematuros, cardiopatías complejas).
- Posibles módulos futuros (según documentos clínicos y validación local).

## Validaciones clínicas pendientes

- Confirmación institucional de warnings y textos UI.
- Confirmación de condiciones de bridge en escenarios urgentes.
- Revisión de fuentes mostradas cuando coexisten múltiples justificaciones clínicas.

## Refactors/documentación/testing futuros

- Homogeneizar forma de componer `note` y `warnings` entre motores.
- Añadir trazabilidad de reglas (ID interno por regla).
- Mantener CHANGELOG con cambios clínicos y técnicos por versión.
