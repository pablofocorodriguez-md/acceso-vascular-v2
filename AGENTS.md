# AGENTS.md

## Propósito del proyecto

Aplicación de soporte a la decisión clínica para selección de accesos vasculares con tres dominios desacoplados: Adulto general, Oncología y Pediátrico.

## Arquitectura esperada

- UI por módulo en `src/pages/`.
- Motores clínicos puros en `src/logic/`.
- Routing en `src/App.jsx`.
- Sin librerías de UI.
- Sin `localStorage`/`sessionStorage`.
- Texto de UI en español.

## Dónde vive la lógica clínica

- Adulto: `src/logic/decidirAdulto.js`
- Oncología: `src/logic/decidirOncologia.js`
- Pediátrico: `src/logic/decidirPediatrico.js`

Documentos clínicos v2.0 externos al repositorio son la referencia clínica primaria.

## Reglas de trabajo para agentes

1. Nunca mezclar lógica de módulos clínicos distintos en un mismo motor.
2. Adulto general, oncología y pediatría deben permanecer desacoplados.
3. No cambiar recomendaciones clínicas sin actualizar documentación.
4. No introducir nuevas preguntas clínicas sin justificar en docs.
5. Toda nueva regla debe tener al menos un caso manual de prueba documentado.
6. Si hay ambigüedad clínica, dejar TODO o nota explícita.
7. Priorizar simplicidad y legibilidad sobre abstracción excesiva.

## Qué no tocar sin validación

- Reglas clínicas de decisión existentes.
- Textos de advertencia clínica con implicancia asistencial.
- Alcance de módulos (onco/pediatría) sin documentación de cambio.

## Cómo agregar un módulo nuevo

1. Crear página en `src/pages/NuevoModulo.jsx`.
2. Crear motor puro en `src/logic/decidirNuevoModulo.js`.
3. Agregar ruta en `src/App.jsx`.
4. Exponer acceso desde `Landing.jsx`.
5. Documentar en `docs/modules/` + `docs/overview.md` + `docs/product/scope.md`.
6. Agregar casos manuales de prueba y límites de alcance.

## Cómo documentar cambios

- Actualizar archivo de módulo afectado en `docs/modules/`.
- Registrar resumen en `CHANGELOG.md`.
- Si cambia arquitectura, actualizar `docs/architecture.md`.
- Si cambia alcance, actualizar `docs/product/scope.md`.

## Manejo de ambigüedades clínicas

- No inventar reglas cuando los documentos están incompletos.
- Señalar explícitamente discrepancias código vs documento en la documentación del módulo.
- Escalar para revisión clínica antes de modificar conducta en código.
