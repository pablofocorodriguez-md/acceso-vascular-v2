const DL_WARNING = `Verificar antes de solicitar doble lumen:
1. ¿Las infusiones son realmente incompatibles?
2. ¿Deben administrarse simultáneamente?
3. ¿No existe alternativa viable?
El doble lumen no debe usarse por default.`;

const HEME_NOTE = 'En la versión 2.0 la lógica hematológica está simplificada en una sola rama. Los subgrupos específicos de MAGIC-ONC 2025 aún no se incorporan al cuestionario.';

const NPT_NOTE = 'NPT / osmolaridad extrema: requiere acceso central independientemente de la duración. Continuar evaluación por la lógica central del adulto general.';

const LONG_TERM_BRIDGE_NOTE = 'El acceso actual resuelve la urgencia, pero la duración prevista justifica planificar un acceso definitivo.';

function createResult() {
  return {
    main: null,
    servicio: null,
    alt: null,
    note: null,
    bridge: null,
    warnings: [],
    source: null,
    incluyePICC: false,
  };
}

function appendNote(result, text) {
  result.note = result.note ? `${result.note}\n\n${text}` : text;
}

function applyTransversalWarnings(result, input) {
  const { tipoCancer, incompatibles, nptOsmExtrema, urgenciaInicio } = input;

  if (result.incluyePICC && incompatibles) {
    result.warnings.push(DL_WARNING);
  }

  if (tipoCancer === 'ONC_H') {
    appendNote(result, HEME_NOTE);
    if (!incompatibles) {
      result.warnings.push('No usar doble lumen por default fuera de incompatibilidad demostrada.');
    }
  }

  if (nptOsmExtrema) {
    appendNote(result, NPT_NOTE);
    if (input.duracion === 'D1') {
      result.alt = result.alt
        ? `${result.alt}. PICC o CVC según disponibilidad; VVP y midline contraindicados.`
        : 'PICC o CVC según disponibilidad; VVP y midline contraindicados';
    }
    result.source = 'MAGIC 2015; ASPEN 2016';
  }

  if (urgenciaInicio === 'URG1' && result.alt && result.alt.toLowerCase().includes('port')) {
    result.warnings.push('En urgencia, no corresponde colocar Port en el momento inicial.');
  }
}

export function decidirOncologia(input) {
  const { duracion, tipoCancer, urgenciaInicio } = input;

  const result = createResult();

  if (!duracion || !tipoCancer) {
    return result;
  }

  // Cánceres hematológicos (rama simplificada v2.0)
  if (tipoCancer === 'ONC_H') {
    result.main = 'PICC doble lumen o catéter tunelizado';
    result.servicio = 'Angiografía / Cirugía';
    result.alt = 'Port solo en contexto no urgente';
    result.note = 'PIV y midline son inapropiados en prácticamente todos los escenarios hematológicos.';
    result.source = 'MAGIC-ONC 2025';
    result.incluyePICC = true;
    applyTransversalWarnings(result, input);
    return result;
  }

  // Tumores sólidos requieren urgencia definida
  if (!urgenciaInicio) {
    return result;
  }

  // Sólido, no urgente, largo plazo
  if (tipoCancer === 'ONC_S' && urgenciaInicio === 'URG0' && duracion === 'D4') {
    result.main = 'Port implantable';
    result.servicio = 'Cirugía';
    result.alt = 'Hickman, si se prefiere acceso externo';
    result.note = 'En tumores sólidos programables de largo plazo, el port se prefiere por menor riesgo de infección y mejor calidad de vida.';
    result.source = 'MAGIC-ONC 2025; MAGIC 2015';
    applyTransversalWarnings(result, input);
    return result;
  }

  // Sólido, no urgente, D3
  if (tipoCancer === 'ONC_S' && urgenciaInicio === 'URG0' && duracion === 'D3') {
    result.main = 'PICC';
    result.servicio = 'Angiografía';
    result.alt = 'Port, si se anticipa continuación > 3 meses';
    result.source = 'MAGIC-ONC 2025; MAGIC 2015';
    result.incluyePICC = true;
    applyTransversalWarnings(result, input);
    return result;
  }

  // Sólido, no urgente, D1/D2
  if (tipoCancer === 'ONC_S' && urgenciaInicio === 'URG0' && (duracion === 'D1' || duracion === 'D2')) {
    result.main = 'PICC';
    result.servicio = 'Angiografía';
    result.note = 'La quimioterapia requiere acceso central independientemente de la duración.';
    result.source = 'MAGIC-ONC 2025; MAGIC 2015';
    result.incluyePICC = true;
    applyTransversalWarnings(result, input);
    return result;
  }

  // Sólido, urgente, D1/D2/D3
  if (tipoCancer === 'ONC_S' && urgenciaInicio === 'URG1' && (duracion === 'D1' || duracion === 'D2' || duracion === 'D3')) {
    result.main = 'PICC';
    result.servicio = 'Angiografía';
    result.note = 'El PICC es apropiado por rapidez de colocación. El port no debe usarse en urgencia por demoras logísticas y riesgo en neutropenia/trombocitopenia.';
    result.source = 'MAGIC-ONC 2025';
    result.incluyePICC = true;
    applyTransversalWarnings(result, input);
    return result;
  }

  // Sólido, urgente, D4 con bridge
  if (tipoCancer === 'ONC_S' && urgenciaInicio === 'URG1' && duracion === 'D4') {
    result.main = 'PICC';
    result.servicio = 'Angiografía';
    result.bridge = {
      main: 'Port o Hickman',
      servicio: 'Cirugía',
      alt: null,
      note: 'Planificar acceso definitivo una vez resuelta la urgencia.',
      bridge: null,
      warnings: [],
      source: 'MAGIC-ONC 2025',
      incluyePICC: false,
    };
    result.source = 'MAGIC-ONC 2025';
    result.incluyePICC = true;
    appendNote(result, LONG_TERM_BRIDGE_NOTE);
    applyTransversalWarnings(result, input);
    return result;
  }

  return result;
}
