# Visión general del producto

## Problema que resuelve

Estandarizar y hacer explícita la selección de accesos vasculares mediante cuestionarios estructurados y reglas clínicas trazables.

## División por dominios clínicos

- **Adulto general**
  - Tronco clínico principal.
  - Reglas por duración, tipo de terapia, patrimonio venoso, estado hemodinámico y ERC.
- **Oncología**
  - Bloque especializado cuando hay quimioterapia.
  - Agrega variables de tipo de cáncer y urgencia de inicio.
- **Pediátrico**
  - Módulo independiente del adulto.
  - Reglas por grupo etario y exclusiones (p. ej., prematuridad).

## Estado de implementación (código actual)

- Adulto general: implementado.
- Oncología: implementado con reglas principales de v2.0 y ramas simplificadas.
- Pediátrico: implementado con ramas etarias y alcance acotado.

## Pendientes funcionales de alto nivel

- Mayor granularidad oncológica hematológica (subgrupos específicos).
- Mayor cobertura pediátrica (prematuros y cardiopatías complejas con algoritmo específico).
- Suite de tests automatizados para validación de regresión clínica.

## Relación entre documentos clínicos y app

- Los documentos clínicos v2.0 son la referencia primaria.
- El código implementa una selección de reglas por fase de producto.
- Cuando una regla clínica no está implementada aún, debe quedar documentada como pendiente o fuera de alcance.
