# Módulo Adulto general

## Propósito

Resolver recomendaciones de acceso vascular para pacientes adultos hospitalizados fuera del subdominio oncológico específico.

## Inputs del cuestionario (código actual)

- Duración de terapia IV (`D1..D4`)
- Tipo de terapia (estándar, irritante, NPT, pH/osm extrema)
- Patrimonio venoso (`V1..V3`)
- Estado hemodinámico (sí/no)
- ERC avanzada/prediálisis/diálisis (sí/no)
- Incompatibilidad simultánea (doble lumen) condicional

## Resumen del árbol de decisión

1. Prioridad máxima: estado hemodinámico → CVC no tunelizado yugular.
2. NPT/pH-osm extrema fuerza acceso central.
3. Reglas por duración y tipo de terapia.
4. Reglas por venas para escenarios periféricos/midline.

## Reglas de prioridad

- Orden secuencial por `early return`.
- La primera regla que matchea define el resultado.
- En hemodinámicos con duración prolongada se calcula bridge al estabilizar.

## Warnings

- ERC: preservación de patrimonio venoso / consulta nefrológica.
- Doble lumen: justificación de incompatibilidad real y simultaneidad.

## Bridge hemodinámico

Cuando hay hemodinamia comprometida y duración D3/D4, se recomienda acceso inmediato crítico y se calcula acceso definitivo con una segunda evaluación (`hemodinamico=false`).

## Casos manuales de prueba

- D1 estándar V1 → VVP
- D1 irritante → PICC
- D2 estándar V3 → Midline (alt PICC)
- D3 estándar → PICC
- D4 estándar → PICC o Hickman
- Hemodinámico D4 → CVC yugular + bridge definitivo

## Fuera de alcance actual

- Submódulos específicos oncológicos.
- Submódulos pediátricos.
- Integración con sistemas institucionales o EHR.
