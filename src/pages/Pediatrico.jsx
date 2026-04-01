import { useMemo, useState, useEffect } from 'react';
import { decidirPediatrico } from '../logic/decidirPediatrico';
import { s, MOBILE_BREAKPOINT } from '../styles/shared';
import Header from '../components/Header';
import ResultSection from '../components/ResultSection';
import DeviceTable from '../components/DeviceTable';
import { QuestionCard, OptionButton, ToggleButtons, ResetButton } from '../components/FormWidgets';

const APP_VERSION = 'v2.0';
const LOGICA_VERSION = 'v2.0-ped';

const DISPOSITIVOS = [
  { nombre: 'PIV', servicio: 'Enfermería', match: ['piv'] },
  { nombre: 'Catéter umbilical', servicio: 'Neonatología', match: ['umbilical'] },
  { nombre: 'Midline', servicio: 'Acceso vascular', match: ['midline'] },
  { nombre: 'PICC', servicio: 'Acceso vascular / angiografía', match: ['picc'] },
  { nombre: 'CVC no tunelizado', servicio: 'Unidad crítica / angiografía', match: ['cvc no tunelizado', 'ntcvad'] },
  { nombre: 'CVC tunelizado', servicio: 'Cirugía / acceso vascular', match: ['tunelizado', 'tccvad'] },
  { nombre: 'Port', servicio: 'Cirugía', match: ['port'] },
  { nombre: 'Intraóseo', servicio: 'Unidad crítica', match: ['intraóseo'] },
];

const GRUPO_OPTIONS = [
  { value: 'neonato_termino', label: 'Neonato de término', sub: '0–28 días' },
  { value: 'lactante', label: 'Lactante', sub: '1 mes–1 año' },
  { value: 'nino_adolescente', label: 'Niño/adolescente', sub: '>1 año–18 años' },
];

const DURACION_OPTIONS = [
  { value: 'D0', label: '≤ 2 días post nacimiento' },
  { value: 'D1', label: '≤ 5 días' },
  { value: 'D2', label: '6–14 días' },
  { value: 'D3', label: '>14 días – 3 meses' },
  { value: 'D4', label: '>3 meses' },
];

const TERAPIA_OPTIONS = [
  { value: 'estandar', label: 'Estándar' },
  { value: 'irritante_vesicante', label: 'Irritante / vesicante' },
  { value: 'npt_osm_extrema', label: 'NPT / osmolaridad extrema' },
  { value: 'emergencia', label: 'Emergencia' },
  { value: 'oncologia_hematologica', label: 'Oncología hematológica' },
];

const VENAS_OPTIONS = [
  { value: 'buenas', label: 'Buenas' },
  { value: 'dificultosas', label: 'Dificultosas' },
  { value: 'agotadas', label: 'Agotadas' },
];

const TOGGLE_QUESTIONS = [
  { label: 'P5', title: '¿Infusiones incompatibles simultáneas?', key: 'incompatibles' },
  { label: 'P6', title: '¿Cardiopatía congénita?', key: 'cardiopatiaCongenita' },
  { label: 'P7', title: '¿Prematuro?', key: 'prematuro' },
];

export default function Pediatrico() {
  const [grupo, setGrupo] = useState(null);
  const [duracion, setDuracion] = useState(null);
  const [tipoTerapia, setTipoTerapia] = useState(null);
  const [venas, setVenas] = useState(null);
  const [incompatibles, setIncompatibles] = useState(null);
  const [cardiopatiaCongenita, setCardiopatiaCongenita] = useState(null);
  const [prematuro, setPrematuro] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const toggleState = { incompatibles, cardiopatiaCongenita, prematuro };
  const toggleSetters = {
    incompatibles: setIncompatibles,
    cardiopatiaCongenita: setCardiopatiaCongenita,
    prematuro: setPrematuro,
  };

  const completedCount = [grupo, duracion, tipoTerapia, venas, incompatibles, cardiopatiaCongenita, prematuro]
    .filter(v => v !== null).length;

  const allAnswered = completedCount === 7;

  const resultado = useMemo(() => {
    if (!allAnswered) return null;
    return decidirPediatrico({
      grupo, duracion, tipoTerapia, venas,
      incompatibles: incompatibles === true,
      cardiopatiaCongenita: cardiopatiaCongenita === true,
      prematuro: prematuro === true,
    });
  }, [grupo, duracion, tipoTerapia, venas, incompatibles, cardiopatiaCongenita, prematuro, allAnswered]);

  const reset = () => {
    setGrupo(null);
    setDuracion(null);
    setTipoTerapia(null);
    setVenas(null);
    setIncompatibles(null);
    setCardiopatiaCongenita(null);
    setPrematuro(null);
  };

  const layoutStyle = isMobile
    ? { ...s.layout, gridTemplateColumns: '1fr', maxWidth: '480px' }
    : s.layout;

  return (
    <div style={s.page}>
      <Header title="Pediátrico" reference="miniMAGIC 2020" appVersion={APP_VERSION} logicaVersion={LOGICA_VERSION} />

      <div style={layoutStyle}>
        {/* Cuestionario */}
        <div style={s.col}>
          <QuestionCard label="P1" title="Grupo etario">
            <div style={s.optionRow}>
              {GRUPO_OPTIONS.map(opt => (
                <OptionButton key={opt.value} selected={grupo === opt.value} label={opt.label} sub={opt.sub} onClick={() => setGrupo(opt.value)} />
              ))}
            </div>
          </QuestionCard>

          <QuestionCard label="P2" title="Duración estimada de la terapia IV">
            <div style={s.optionRow}>
              {DURACION_OPTIONS.map(opt => (
                <OptionButton key={opt.value} selected={duracion === opt.value} label={opt.label} onClick={() => setDuracion(opt.value)} />
              ))}
            </div>
          </QuestionCard>

          <QuestionCard label="P3" title="Tipo de terapia">
            <div style={s.optionRow}>
              {TERAPIA_OPTIONS.map(opt => (
                <OptionButton key={opt.value} selected={tipoTerapia === opt.value} label={opt.label} onClick={() => setTipoTerapia(opt.value)} />
              ))}
            </div>
          </QuestionCard>

          <QuestionCard label="P4" title="Calidad del acceso venoso periférico">
            <div style={s.optionRow}>
              {VENAS_OPTIONS.map(opt => (
                <OptionButton key={opt.value} selected={venas === opt.value} label={opt.label} onClick={() => setVenas(opt.value)} />
              ))}
            </div>
          </QuestionCard>

          {TOGGLE_QUESTIONS.map(q => (
            <QuestionCard key={q.key} label={q.label} title={q.title}>
              <ToggleButtons value={toggleState[q.key]} onSelect={toggleSetters[q.key]} />
            </QuestionCard>
          ))}

          <ResetButton onClick={reset} />
        </div>

        {/* Resultados */}
        <div style={s.rightCol}>
          <div style={s.noteCard}>
            <div style={s.noteText}>
              Basado en miniMAGIC 2020. Módulo pediátrico en revisión clínica. No usar como protocolo institucional sin validación local.
            </div>
          </div>

          <ResultSection resultado={resultado} completed={completedCount} total={7}>
            <DeviceTable dispositivos={DISPOSITIVOS} resultado={resultado} />
          </ResultSection>
        </div>
      </div>
    </div>
  );
}
