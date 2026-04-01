# Arquitectura técnica

## Estructura de carpetas

- `src/pages/`: páginas de UI por módulo.
- `src/logic/`: motores de decisión clínicos (funciones puras).
- `src/App.jsx`: routing principal.
- `src/main.jsx`: bootstrap de React.

## Routing

Rutas vigentes:

- `/` → Landing
- `/adulto` → Módulo Adulto general
- `/oncologia` → Módulo Oncología
- `/pediatrico` → Módulo Pediátrico

## Separación UI vs lógica clínica

Patrón esperado:

1. Página React recolecta inputs del cuestionario.
2. Página llama un motor puro (`decidirX`) con esos inputs.
3. Página renderiza resultado estructurado.

No debe haber reglas clínicas de negocio distribuidas en múltiples componentes de UI.

## Patrón de motores puros

Cada motor devuelve una estructura consistente:

```js
{
  main,
  servicio,
  alt,
  note,
  bridge,
  warnings,
  source,
  incluyePICC
}
```

Características:

- Sin side effects.
- Sin dependencia de React.
- Reglas evaluadas en orden con `early return`.

## Preguntas condicionales

- Se resuelven en la capa de UI (mostrar/ocultar campos según contexto).
- Ejemplos:
  - Oncología: urgencia solo para tumor sólido.
  - Adulto: doble lumen condicional según recomendación con PICC.

## Render de resultado

Panel derecho por módulo:

- recomendación principal (`main`, `servicio`)
- alternativa (`alt`)
- nota (`note`)
- advertencias (`warnings`)
- bridge cuando aplica (`bridge`)
- tabla de dispositivos

## Restricciones arquitectónicas

- No usar librerías de UI.
- No usar localStorage/sessionStorage.
- UI en español.
- Mantener módulos clínicos desacoplados.
- Priorizar legibilidad y trazabilidad clínica.
