const PREMATURO_WARNING = "Neonato prematuro fuera del alcance del módulo pediátrico actual.";

const DL_WARNING = "Lumen único como default. El doble lumen solo está justificado con incompatibilidad de infusiones demostrada.";

const DL_DEFAULT_NOTE = "No usar doble lumen por default; justificar incompatibilidad real.";

const CHD_WARNING = "Cardiopatía congénita: el Port no debe recomendarse automáticamente. Requiere evaluación específica; el módulo actual no implementa miniMAGIC-CHD completo.";

const MIDLINE_NEONATE_WARNING = "Midline no recomendado en neonatos: evidencia insuficiente / incierta.";

const MIDLINE_INFANT_WARNING = "Midline en lactantes: evidencia limitada; no calificado como apropiado de forma general.";

const ORAL_SWITCH_NOTE = "Considerar transición precoz a vía oral cuando sea clínicamente posible para evitar acceso prolongado.";

const IM_SWITCH_NOTE = "Si queda ≤1 día de terapia IV y se pierde el acceso, considerar vía IM si la medicación lo permite.";

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
    flagsUI: {
      fueraDeAlcance: false,
      enRevision: true,
    },
  };
}

function duracionEsMayorA14(duracion) {
  return duracion === 'D3' || duracion === 'D4';
}

function duracionEsLargoPlazo(duracion) {
  return duracion === 'D4';
}

function aplicarWarningsTransversales(result, input) {
  const {
    grupo,
    incompatibles,
    cardiopatiaCongenita,
  } = input;

  if (result.incluyePICC) {
    if (incompatibles) {
      result.warnings.push(DL_WARNING);
    } else {
      result.warnings.push(DL_DEFAULT_NOTE);
    }
  }

  if (cardiopatiaCongenita) {
    result.warnings.push(CHD_WARNING);

    if (result.main && result.main.includes('Port')) {
      result.main = result.main.replace(', CVC tunelizado (TcCVAD) o Port', ' o CVC tunelizado (TcCVAD)');
      result.alt = result.alt
        ? `${result.alt}. Port descartado por cardiopatía congénita hasta evaluación específica.`
        : 'Port descartado por cardiopatía congénita hasta evaluación específica.';
    }
  }

  if (grupo === 'lactante') {
    result.warnings.push(MIDLINE_INFANT_WARNING);
  }

  if (grupo === 'neonato_termino') {
    result.warnings.push(MIDLINE_NEONATE_WARNING);
  }

  if (grupo === 'nino_adolescente' && input.tipoTerapia === 'estandar' && input.duracion === 'D1') {
    result.warnings.push(IM_SWITCH_NOTE);
  }

  if (duracionEsMayorA14(input.duracion)) {
    result.note = result.note
      ? `${result.note}\n\n${ORAL_SWITCH_NOTE}`
      : ORAL_SWITCH_NOTE;
  }
}

export function decidirPediatrico(input) {
  const {
    grupo,
    duracion,
    tipoTerapia,
    venas,
    prematuro,
  } = input;

  const result = createResult();

  if (!grupo || !duracion || !tipoTerapia || !venas) {
    return result;
  }

  // A. Exclusiones de alcance
  if (prematuro) {
    result.warnings.push(PREMATURO_WARNING);
    result.source = 'miniMAGIC pediátrico v2.0 — fuera de alcance';
    result.flagsUI.fueraDeAlcance = true;
    return result;
  }

  // F. Oncología hematológica pediátrica (prioridad alta por exclusión parcial)
  if (tipoTerapia === 'oncologia_hematologica') {
    result.main = 'PICC doble lumen o CVC tunelizado';
    result.servicio = 'Oncología pediátrica / acceso vascular';
    result.note = 'Escenario referido a oncología pediátrica; requiere desarrollo específico del módulo oncológico.';
    result.source = 'miniMAGIC 2020; MAGIC-ONC';
    result.incluyePICC = true;
    aplicarWarningsTransversales(result, input);
    return result;
  }

  // B. Emergencia tiene prioridad máxima
  if (tipoTerapia === 'emergencia') {
    result.main = 'CVC no tunelizado (NTCVAD) o intraóseo';
    result.servicio = 'Acceso vascular / unidad crítica / angiografía según institución';
    result.source = 'miniMAGIC 2020';
    aplicarWarningsTransversales(result, input);
    return result;
  }

  const requiereCentral = tipoTerapia === 'irritante_vesicante' || tipoTerapia === 'npt_osm_extrema';

  // C. Neonatos de término
  if (grupo === 'neonato_termino' && duracion === 'D0') {
    result.main = 'Catéter umbilical';
    result.servicio = 'Neonatología';
    result.source = 'miniMAGIC 2020';
    aplicarWarningsTransversales(result, input);
    return result;
  }

  if (grupo === 'neonato_termino' && requiereCentral) {
    result.main = 'PICC o CVC no tunelizado (NTCVAD)';
    result.servicio = 'Neonatología / acceso vascular';
    result.source = 'miniMAGIC 2020';
    result.incluyePICC = true;
    aplicarWarningsTransversales(result, input);
    return result;
  }

  if (grupo === 'neonato_termino' && tipoTerapia === 'estandar' && duracion === 'D1') {
    result.main = 'PIV';
    result.servicio = 'Enfermería';
    result.source = 'miniMAGIC 2020';
    aplicarWarningsTransversales(result, input);
    return result;
  }

  if (grupo === 'neonato_termino' && tipoTerapia === 'estandar' && duracionEsMayorA14(duracion)) {
    result.main = 'PICC';
    result.servicio = 'Acceso vascular / neonatología';
    result.alt = 'Desde 2 días de vida';
    result.source = 'miniMAGIC 2020';
    result.incluyePICC = true;
    aplicarWarningsTransversales(result, input);
    return result;
  }

  if (grupo === 'neonato_termino' && tipoTerapia === 'estandar' && duracion === 'D2') {
    result.main = 'PICC';
    result.servicio = 'Acceso vascular / neonatología';
    result.alt = 'Desde 2 días de vida';
    result.source = 'miniMAGIC 2020';
    result.incluyePICC = true;
    aplicarWarningsTransversales(result, input);
    return result;
  }

  // D. Lactantes
  if (grupo === 'lactante' && requiereCentral) {
    result.main = 'PICC o CVC no tunelizado (NTCVAD)';
    result.servicio = 'Acceso vascular / angiografía';
    result.source = 'miniMAGIC 2020';
    result.incluyePICC = true;
    aplicarWarningsTransversales(result, input);
    return result;
  }

  if (grupo === 'lactante' && tipoTerapia === 'estandar' && (duracion === 'D1' || duracion === 'D2')) {
    result.main = 'PIV';
    result.servicio = 'Enfermería';
    result.source = 'miniMAGIC 2020';
    aplicarWarningsTransversales(result, input);
    return result;
  }

  if (grupo === 'lactante' && duracionEsLargoPlazo(duracion)) {
    result.main = 'PICC o CVC tunelizado (TcCVAD)';
    result.servicio = 'Acceso vascular / cirugía';
    result.source = 'miniMAGIC 2020';
    result.incluyePICC = true;
    aplicarWarningsTransversales(result, input);
    return result;
  }

  if (grupo === 'lactante' && tipoTerapia === 'estandar' && duracionEsMayorA14(duracion)) {
    result.main = 'PICC';
    result.servicio = 'Acceso vascular / angiografía';
    result.source = 'miniMAGIC 2020';
    result.incluyePICC = true;
    aplicarWarningsTransversales(result, input);
    return result;
  }

  // E. Niños y adolescentes
  if (grupo === 'nino_adolescente' && requiereCentral) {
    result.main = 'PICC o CVC no tunelizado (NTCVAD)';
    result.servicio = 'Acceso vascular / angiografía';
    result.source = 'miniMAGIC 2020';
    result.incluyePICC = true;
    aplicarWarningsTransversales(result, input);
    return result;
  }

  if (grupo === 'nino_adolescente' && tipoTerapia === 'estandar' && duracion === 'D1' && venas === 'buenas') {
    result.main = 'PIV';
    result.servicio = 'Enfermería';
    result.source = 'miniMAGIC 2020';
    aplicarWarningsTransversales(result, input);
    return result;
  }

  if (grupo === 'nino_adolescente' && tipoTerapia === 'estandar' && duracion === 'D2') {
    result.main = 'PIV o Midline';
    result.servicio = 'Enfermería / acceso vascular';
    result.alt = 'Midline más factible en este grupo etario';
    result.source = 'miniMAGIC 2020';
    aplicarWarningsTransversales(result, input);
    return result;
  }

  if (grupo === 'nino_adolescente' && duracionEsLargoPlazo(duracion)) {
    result.main = 'PICC, CVC tunelizado (TcCVAD) o Port';
    result.servicio = 'Acceso vascular / cirugía';
    result.alt = 'Evitar Port si cardiopatía congénita';
    result.source = 'miniMAGIC 2020';
    result.incluyePICC = true;
    aplicarWarningsTransversales(result, input);
    return result;
  }

  if (grupo === 'nino_adolescente' && tipoTerapia === 'estandar' && duracionEsMayorA14(duracion)) {
    result.main = 'PICC';
    result.servicio = 'Acceso vascular / angiografía';
    result.source = 'miniMAGIC 2020';
    result.incluyePICC = true;
    aplicarWarningsTransversales(result, input);
    return result;
  }

  return result;
}
