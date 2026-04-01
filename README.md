# Selección de Acceso Vascular (v2.x)

Aplicación web React + Vite para soporte a la decisión clínica en selección de accesos vasculares intravenosos.

## Qué es este proyecto

Esta aplicación implementa cuestionarios clínicos estructurados y devuelve recomendaciones de dispositivo vascular según reglas clínicas documentadas (documentos v2.0 externos al código).

Dominios actuales:

1. Adulto general
2. Oncología
3. Pediátrico

## Para quién está hecho

- Médicos solicitantes
- Equipos de acceso vascular
- Revisores clínicos que validan lógica de recomendación
- Equipos técnicos que mantienen la app

## Estado actual

- **Adulto general**: implementado y operativo.
- **Oncología**: implementado como bloque especializado para quimioterapia, con simplificaciones explícitas.
- **Pediátrico**: implementado con ramas por grupo etario y exclusiones explícitas.

> Importante: implementación por fases. No asumir cobertura completa de toda la lógica clínica v2.0.

## Stack

- React
- Vite
- React Router
- ESLint
- Estilos inline (sin librerías UI)

## Cómo correr localmente

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
npm run preview
```

## Estructura general del repositorio

```text
src/
  App.jsx
  main.jsx
  pages/
    Landing.jsx
    Adulto.jsx
    Oncologia.jsx
    Pediatrico.jsx
  logic/
    decidirAdulto.js
    decidirOncologia.js
    decidirPediatrico.js
docs/
  overview.md
  architecture.md
  modules/
  clinical-logic/
  product/
AGENTS.md
CHANGELOG.md
```

## Módulos (resumen)

- **Adulto general**: tronco clínico principal para terapias no oncológicas en adultos.
- **Oncología**: módulo especializado para quimioterapia; complementa la lógica de acceso central.
- **Pediátrico**: módulo separado con reglas propias por edad y exclusiones de alcance.

## Advertencia clínica e institucional

Esta app es soporte a la decisión. **No reemplaza protocolos institucionales**, juicio clínico ni validaciones locales. Cualquier adopción asistencial requiere aprobación del equipo clínico responsable.

## Mapa de documentación (/docs)

- `docs/overview.md`: visión funcional del producto
- `docs/architecture.md`: arquitectura técnica y patrones
- `docs/modules/*.md`: detalle por módulo clínico
- `docs/clinical-logic/README.md`: relación entre documentos clínicos y código
- `docs/product/scope.md`: alcance actual
- `docs/product/roadmap.md`: próximos pasos

## Fuente de verdad

- **Fuente de verdad clínica**: documentos clínicos v2.0 externos al repositorio.
- **Fuente de verdad técnica**: implementación en `src/logic/*.js` (motores puros) + `src/pages/*.jsx` (UI).

Cuando exista diferencia entre documento clínico y código, debe documentarse explícitamente y resolverse por validación clínica.
