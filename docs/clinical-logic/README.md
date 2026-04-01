# Lógica clínica: relación documento ↔ código

## Fuente clínica

La referencia clínica de este proyecto proviene de documentos v2.0 externos al código fuente.

- Adulto general: documento clínico adulto v2.0
- Oncología: documento oncológico v2.0 (MAGIC-ONC)
- Pediátrico: documento pediátrico v2.0 (miniMAGIC)

## Fuente técnica

La implementación viva está en:

- `src/logic/decidirAdulto.js`
- `src/logic/decidirOncologia.js`
- `src/logic/decidirPediatrico.js`

## Cobertura por fases

La app no garantiza cubrir el 100% de cada documento clínico en una sola versión.

Principio operativo:

- Si una regla no está implementada, debe declararse como pendiente, fuera de alcance o simplificación explícita.
- No se deben inferir reglas nuevas sin validación clínica.

## Alcance de este directorio

Este directorio documenta cómo mapear guías clínicas a código, no reproduce artículos completos ni bibliografía extensa.
