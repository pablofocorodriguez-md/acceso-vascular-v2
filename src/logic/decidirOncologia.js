const DL_WARNING = `Verificar antes de solicitar doble lumen:
1. ¿Las infusiones son realmente incompatibles?
2. ¿Deben administrarse simultáneamente?
3. ¿No existe alternativa viable?
El doble lumen no debe usarse por default.`;

const HEME_NOTE = 'Lógica hematológica simplificada (v2.0). Importante: en MDS/MPN, MAGIC-ONC 2025 recomienda lumen simple (no doble). Verificar subgrupo antes de definir número de lúmenes.';

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
    result.source = result.source
      ? `${result.source}; MAGIC 2015; ASPEN 2016`
      : 'MAGIC 2015; ASPEN 2016';
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
    result.main = 'PICC o cat\u00e9ter tunelizado';
    result.servicio = 'Angiograf\u00eda / Cirug\u00eda';
    if (urgenciaInicio === 'URG1') {
      result.alt = 'Port es inapropiado en urgencia hematol\u00f3gica';
    } else {
      result.alt = 'Port solo en contexto no urgente';
    }
    result.note = 'PIV y midline son inapropiados en pr\u00e1cticamente todos los escenarios hematol\u00f3gicos.\n\nL\u00famenes: leucemias agudas y linfomas \u2192 doble lumen. MDS/MPN \u2192 simple lumen (MAGIC-ONC 2025, Fig 2 y 4). Verificar subgrupo.';
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
    result.alt = 'Port o tunelizado, si se anticipa continuación > 3 meses';
    result.source = 'MAGIC-ONC 2025; MAGIC 2015';
    result.incluyePICC = true;
    applyTransversalWarnings(result, input);
    return result;
  }

  // Sólido, no urgente, D1/D2
  if (tipoCancer === 'ONC_S' && urgenciaInicio === 'URG0' && (duracion === 'D1' || duracion === 'D2')) {
    result.main = 'PICC';
    result.servicio = 'Angiografía';
    result.alt = 'Port o tunelizado, si se anticipa tratamiento futuro';
    result.note = 'La quimioterapia requiere acceso central independientemente de la duración. Port y tunelizado son apropiados en todos los escenarios de tumor sólido (MAGIC-ONC 2025, Fig 3).';
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
