const IRC_WARNING = "IRC avanzada, prediálisis o diálisis. Consultar Nefrología para preservar patrimonio venoso ante eventual fístula arteriovenosa.\n\nEn IRC \u2265 3B (eGFR < 45), la consulta nefrológica es apropiada antes de cualquier VAD, independientemente del dispositivo recomendado.";

const DL_WARNING = "Verificar antes de solicitar doble lumen:\n1. \u00bfLas soluciones son realmente incompatibles?\n2. \u00bfDeben administrarse simult\u00e1neamente?\n3. \u00bfNo es posible escalonar ni usar otro acceso?\nSolo justificado si no existe alternativa viable. Su uso innecesario aumenta el riesgo de trombosis.";

function setPICC(result, irc, doubleLumen) {
  result.incluyePICC = true;
  if (irc) result.warnings.push(IRC_WARNING);
  if (doubleLumen) result.warnings.push(DL_WARNING);
}

export function decidirAdulto({ duracion, terapias, venas, hemodinamico, irc, doubleLumen }) {
  const result = {
    main: null,
    servicio: null,
    alt: null,
    note: null,
    bridge: null,
    warnings: [],
    source: null,
    incluyePICC: false,
  };

  if (!duracion || !terapias || terapias.length === 0 || !venas) {
    return result;
  }

  // BLOQUE A — Prioridad máxima: hemodinámico
  if (hemodinamico) {
    result.main = "CVC no tunelizado \u2014 yugular";
    result.servicio = "Angiograf\u00eda";
    result.alt = "CVC subclavia (Cirug\u00eda) si hay contraindicaci\u00f3n yugular";
    result.source = "MAGIC 2015 \u2014 CVC en paciente cr\u00edtico";

    if (duracion === "D3" || duracion === "D4") {
      const bridgeResult = decidirAdulto({
        duracion,
        terapias,
        venas,
        hemodinamico: false,
        irc,
        doubleLumen,
      });
      result.bridge = bridgeResult;
      result.incluyePICC = bridgeResult.incluyePICC;
    }

    return result;
  }

  // NPT / pH extremo flag
  const requiereCentral = terapias.includes("npt") || terapias.includes("ph");

  // D1 + requiereCentral
  if (duracion === "D1" && requiereCentral) {
    result.main = "PICC o CVC no tunelizado";
    result.servicio = "Angiograf\u00eda";
    result.alt = "Midline y VVP contraindicados para NPT / pH extremo";
    result.source = "MAGIC 2015; ASPEN 2016";
    setPICC(result, irc, doubleLumen);
    return result;
  }

  // D2 + requiereCentral
  if (duracion === "D2" && requiereCentral) {
    result.main = "PICC";
    result.servicio = "Angiograf\u00eda";
    result.source = "MAGIC 2015; ASPEN 2016";
    setPICC(result, irc, doubleLumen);
    return result;
  }

  // D3 + requiereCentral
  if (duracion === "D3" && requiereCentral) {
    result.main = "PICC";
    result.servicio = "Angiograf\u00eda";
    result.source = "MAGIC 2015; ASPEN 2016";
    setPICC(result, irc, doubleLumen);
    return result;
  }

  // D4 + requiereCentral
  if (duracion === "D4" && requiereCentral) {
    result.main = "PICC o Hickman";
    result.servicio = "Angiograf\u00eda / Cirug\u00eda";
    result.alt = "Hickman preferible si duraci\u00f3n > 6 meses";
    result.source = "MAGIC 2015; ASPEN 2016";
    setPICC(result, irc, doubleLumen);
    return result;
  }

  // C0 — D1 + irritante
  if (duracion === "D1" && terapias.includes("irritante")) {
    result.main = "PICC";
    result.servicio = "Angiograf\u00eda";
    result.source = "MAGIC 2015 \u2014 irritante/vesicante indica PICC independientemente de la duraci\u00f3n";
    setPICC(result, irc, doubleLumen);
    return result;
  }

  // C1 — D1 + estándar + V1
  if (duracion === "D1" && terapias.includes("estandar") && venas === "V1") {
    result.main = "V\u00eda venosa perif\u00e9rica (VVP)";
    result.servicio = "Enfermer\u00eda";
    result.source = "MAGIC 2015";
    return result;
  }

  // C2 — D1 + venas dificultosas/agotadas
  if (duracion === "D1" && (venas === "V2" || venas === "V3")) {
    result.main = "Midline";
    result.servicio = "Angiograf\u00eda";
    result.alt = "Si se anticipa extensi\u00f3n, el midline puede mantenerse hasta ~28 d\u00edas con medicaci\u00f3n perif\u00e9ricamente compatible (Paje 2025). Considerar PICC si la duraci\u00f3n supera ese umbral o la medicaci\u00f3n no es compatible.";
    result.source = "MAGIC 2015; Paje et al., JAMA Intern Med 2025";
    return result;
  }

  // C4 — D2 + irritante (antes de C3 para que irritante siempre prevalezca)
  if (duracion === "D2" && terapias.includes("irritante")) {
    result.main = "PICC";
    result.servicio = "Angiograf\u00eda";
    result.source = "MAGIC 2015; INS 2021";
    setPICC(result, irc, doubleLumen);
    return result;
  }

  // C3 — D2 + estándar + V1/V2
  if (duracion === "D2" && terapias.includes("estandar") && (venas === "V1" || venas === "V2")) {
    result.main = "Midline";
    result.servicio = "Angiograf\u00eda";
    result.source = "MAGIC 2015";
    return result;
  }

  // C3b — D2 + estándar + V3
  if (duracion === "D2" && terapias.includes("estandar") && venas === "V3") {
    result.main = "Midline";
    result.servicio = "Angiograf\u00eda";
    result.alt = "PICC si el midline no es viable por agotamiento severo";
    result.source = "MAGIC 2015";
    return result;
  }

  // C5 — D3
  if (duracion === "D3") {
    result.main = "PICC";
    result.servicio = "Angiograf\u00eda";
    result.alt = "Midline si duraci\u00f3n \u2264 28 d\u00edas y medicaci\u00f3n perif\u00e9ricamente compatible";
    result.source = "MAGIC 2015; Paje et al., JAMA Intern Med 2025";
    result.note = "Paje et al. (2025): menor riesgo de complicaciones con midline vs. PICC en OPAT hasta 28 d\u00edas. Preferir PICC a partir de los 30 d\u00edas.";
    setPICC(result, irc, doubleLumen);
    return result;
  }

  // C6 — D4
  if (duracion === "D4") {
    result.main = "PICC o Hickman";
    result.servicio = "Angiograf\u00eda / Cirug\u00eda";
    result.alt = "Hickman preferible si duraci\u00f3n > 6 meses o acceso frecuente e intermitente";
    result.source = "MAGIC 2015";
    setPICC(result, irc, doubleLumen);
    return result;
  }

  return result;
}
