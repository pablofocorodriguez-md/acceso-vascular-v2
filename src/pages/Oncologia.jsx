import { useMemo, useState, useEffect } from 'react';
import { decidirOncologia } from '../logic/decidirOncologia';
import { s, MOBILE_BREAKPOINT } from '../styles/shared';
import Header from '../components/Header';
import ResultSection from '../components/ResultSection';
import DeviceTable from '../components/DeviceTable';
import { QuestionCard, OptionButton, ToggleButtons, ResetButton } from '../components/FormWidgets';

const APP_VERSION = 'v2.0';
const LOGICA_VERSION = 'v2.0-onc';

const DISPOSITIVOS = [
  { nombre: 'PICC', servicio: 'Angiografía', match: ['picc'] },
  { nombre: 'Port', servicio: 'Cirugía', match: ['port'] },
  { nombre: 'Hickman / catéter tunelizado', servicio: 'Cirugía / angiografía', match: ['hickman', 'tunelizado'] },
  { nombre: 'CVC no tunelizado', servicio: 'Unidad crítica / angiografía', match: ['cvc no tunelizado'] },
  { nombre: 'PIV', servicio: 'Enfermería', match: ['piv'] },
  { nombre: 'Midline', servicio: 'Acceso vascular', match: ['midline'] },
];

const DURACION_OPTIONS = [
  { value: 'D1', label: '≤ 5 días' },
  { value: 'D2', label: '6–14 días' },
  { value: 'D3', label: '15 días – 3 meses' },
  { value: 'D4', label: '> 3 meses' },
];

const CANCER_OPTIONS = [
  { value: 'ONC_S', label: 'Tumor sólido' },
  { value: 'ONC_H', label: 'Cáncer hematológico' },
];

export default function Oncologia() {
  const [duracion, setDuracion] = useState(null);
  const [tipoCancer, setTipoCancer] = useState(null);
  const [urgenciaInicio, setUrgenciaInicio] = useState(null);
  const [nptOsmExtrema, setNptOsmExtrema] = useState(null);
  const [incompatibles, setIncompatibles] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const showUrgencia = tipoCancer === 'ONC_S';
  const totalQuestions = showUrgencia ? 5 : 4;

  const completedCount = [
    duracion !== null,
    tipoCancer !== null,
    !showUrgencia || urgenciaInicio !== null,
    nptOsmExtrema !== null,
    incompatibles !== null,
  ].filter(Boolean).length;

  const allAnswered = completedCount === totalQuestions;

  const resultado = useMemo(() => {
    if (!allAnswered) return null;
    return decidirOncologia({
      duracion,
      tipoCancer,
      urgenciaInicio: showUrgencia ? (urgenciaInicio ? 'URG1' : 'URG0') : null,
      nptOsmExtrema: nptOsmExtrema === true,
      incompatibles: incompatibles === true,
    });
  }, [allAnswered, duracion, tipoCancer, urgenciaInicio, showUrgencia, nptOsmExtrema, incompatibles]);

  const reset = () => {
    setDuracion(null);
    setTipoCancer(null);
    setUrgenciaInicio(null);
    setNptOsmExtrema(null);
    setIncompatibles(null);
  };

  const hemeExtraWarning = tipoCancer === 'ONC_H'
    ? ['En escenarios hematológicos, PIV y midline se consideran inapropiados como acceso principal para quimioterapia.']
    : [];

  const layoutStyle = isMobile
    ? { ...s.layout, gridTemplateColumns: '1fr', maxWidth: '480px' }
    : s.layout;

  return (
    <div style={s.page}>
      <Header title="Oncología" reference="MAGIC-ONC 2025" appVersion={APP_VERSION} logicaVersion={LOGICA_VERSION} />

      <div style={layoutStyle}>
        {/* Cuestionario */}
        <div style={s.col}>
          <QuestionCard label="P1" title="Duración de la terapia">
            <div style={s.optionRow}>
              {DURACION_OPTIONS.map(opt => (
                <OptionButton key={opt.value} selected={duracion === opt.value} label={opt.label} onClick={() => setDuracion(opt.value)} />
              ))}
            </div>
          </QuestionCard>

          <QuestionCard label="P2" title="Tipo de cáncer">
            <div style={s.optionRow}>
              {CANCER_OPTIONS.map(opt => (
                <OptionButton key={opt.value} selected={tipoCancer === opt.value} label={opt.label} onClick={() => { setTipoCancer(opt.value); if (opt.value === 'ONC_H') setUrgenciaInicio(null); }} />
              ))}
            </div>
          </QuestionCard>

          {showUrgencia && (
            <QuestionCard label="P3" title="Urgencia de inicio">
              <ToggleButtons value={urgenciaInicio} onSelect={setUrgenciaInicio} yesLabel="Urgente (≤ 48 h)" noLabel="No urgente" />
            </QuestionCard>
          )}

          <QuestionCard label={showUrgencia ? 'P4' : 'P3'} title="¿NPT o pH/osmolaridad extrema?">
            <ToggleButtons value={nptOsmExtrema} onSelect={setNptOsmExtrema} />
          </QuestionCard>

          <QuestionCard label={showUrgencia ? 'P5' : 'P4'} title="¿Infusiones incompatibles simultáneas?">
            <ToggleButtons value={incompatibles} onSelect={setIncompatibles} />
          </QuestionCard>

          <ResetButton onClick={reset} />
        </div>

        {/* Resultados */}
        <div style={s.rightCol}>
          <div style={s.noteCard}>
            <div style={s.noteText}>
              Basado en MAGIC-ONC 2025. Módulo oncológico en revisión clínica. No usar como protocolo institucional sin validación local.
            </div>
          </div>

          <ResultSection resultado={resultado} completed={completedCount} total={totalQuestions} extraWarnings={hemeExtraWarning}>
            <DeviceTable dispositivos={DISPOSITIVOS} resultado={resultado} />
          </ResultSection>
        </div>
      </div>
    </div>
  );
}
