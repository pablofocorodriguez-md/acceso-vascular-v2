# Módulo Oncología

## Propósito

Resolver recomendaciones de acceso vascular cuando la indicación principal es quimioterapia.

## Cuándo se activa

- Usuario selecciona módulo Oncología.
- Se asume contexto de quimioterapia (bloque especializado).

## Inputs clínicos

- Duración (`D1..D4`)
- Tipo de cáncer (`ONC_S`, `ONC_H`)
- Urgencia de inicio (`URG1`, `URG0`) solo en sólidos
- Flag NPT/pH-osm extrema
- Incompatibilidad simultánea (doble lumen)

## Reglas para tumores sólidos

- **No urgente + D4**: Port implantable (alt Hickman).
- **No urgente + D3**: PICC (alt Port si prolonga >3 meses).
- **No urgente + D1/D2**: PICC.
- **Urgente + D1/D2/D3**: PICC (evitar port en momento urgente).
- **Urgente + D4**: PICC + bridge a Port/Hickman.

## Reglas para hematológicos

- Rama simplificada única:
  - PICC doble lumen o catéter tunelizado.
  - Nota explícita de que PIV/midline son inapropiados en casi todos los escenarios.

## Bridge oncológico

- Solo codificado en sólido urgente D4:
  - acceso inmediato PICC
  - acceso definitivo planificado (Port/Hickman)

## Relación con lógica central de NPT/osmolaridad extrema

- Si NPT/osm extrema está activa, se agrega nota explícita de requerimiento central.
- No se habilitan recomendaciones periféricas por este flag.
- Se mantiene recomendación oncológica principal y se documenta continuidad con lógica central del adulto.

## Casos manuales de prueba

- Sólido no urgente D4 → Port
- Sólido no urgente D3 → PICC
- Sólido urgente D3 → PICC
- Sólido urgente D4 → PICC + bridge
- Hematológico D1/D4 → PICC DL o tunelizado
- Cualquier onco + NPT/osm extrema → nota de acceso central

## Pendientes y límites

- Sin subestratificación hematológica detallada (v2.0 simplificado).
- Sin estratificación trombótica por subtipo de tumor sólido.
- Sin CAR-T, plaquetas ni anticoagulación asociada a catéter.

## Discrepancias observadas código vs intención clínica

- En código actual, al activar NPT/osm extrema se pisa la `source` con `MAGIC 2015; ASPEN 2016`, aun cuando la recomendación principal venga de rama oncológica.
- En código actual, el warning de doble lumen se agrega cuando hay incompatibilidad, pero la nota de "lumen único por default" no está generalizada para todos los escenarios no incompatibles.
