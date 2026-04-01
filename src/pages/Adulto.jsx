import { useState, useMemo, useEffect } from 'react';
import { decidirAdulto } from '../logic/decidirAdulto';
import { s, MOBILE_BREAKPOINT } from '../styles/shared';
import Header from '../components/Header';
import ResultSection from '../components/ResultSection';
import DeviceTable from '../components/DeviceTable';
import { QuestionCard, OptionButton, CheckboxRow, ToggleButtons, ResetButton } from '../components/FormWidgets';

const APP_VERSION = 'v2.0';
const LOGICA_VERSION = 'v2.0';

const DISPOSITIVOS = [
  { nombre: 'VVP', servicio: 'Enfermería', match: ['vvp', 'vía venosa periférica'] },
  { nombre: 'Midline', servicio: 'Angiografía', match: ['midline'] },
  { nombre: 'PICC', servicio: 'Angiografía', match: ['picc'] },
  { nombre: 'CVC yugular', servicio: 'Angiografía', match: [['cvc', 'yugular']] },
  { nombre: 'CVC subclavia', servicio: 'Cirugía', match: [['cvc', 'subclavia']] },
  { nombre: 'Port', servicio: 'Cirugía', match: ['port'] },
  { nombre: 'Hickman', servicio: 'Cirugía', match: ['hickman'] },
];

const DURACION_OPTIONS = [
  { value: 'D1', label: '≤ 5 días' },
  { value: 'D2', label: '6 – 14 días' },
  { value: 'D3', label: '15 días – 3 meses' },
  { value: 'D4', label: '> 3 meses' },
];

const TERAPIA_OPTIONS = [
  { value: 'estandar', label: 'Estándar', sub: 'ATB, fluidos, analgesia' },
  { value: 'irritante', label: 'Irritante / vesicante', sub: 'no oncológica' },
  { value: 'npt', label: 'NPT', sub: 'nutrición parenteral total' },
  { value: 'ph', label: 'pH / osmol extrema', sub: '> 900 mOsm o pH < 5 / > 9' },
];

const VENAS_OPTIONS = [
  { value: 'V1', label: 'Buenas', sub: 'visibles y palpables' },
  { value: 'V2', label: 'Dificultosas', sub: 'múltiples intentos' },
  { value: 'V3', label: 'Agotadas', sub: 'sin acceso periférico' },
];

export default function Adulto() {
  const [duracion, setDuracion] = useState(null);
  const [terapias, setTerapias] = useState([]);
  const [venas, setVenas] = useState(null);
  const [hemodinamico, setHemodinamico] = useState(null);
  const [irc, setIrc] = useState(null);
  const [doubleLumen, setDoubleLumen] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const toggleTerapia = (val) => {
    setTerapias(prev =>
      prev.includes(val) ? prev.filter(t => t !== val) : [...prev, val]
    );
  };

  const completedCount = [
    duracion !== null,
    terapias.length > 0,
    venas !== null,
    hemodinamico !== null,
    irc !== null,
  ].filter(Boolean).length;

  const allAnswered = completedCount === 5;

  const preResult = useMemo(() => {
    if (!allAnswered) return null;
    return decidirAdulto({ duracion, terapias, venas, hemodinamico, irc, doubleLumen: false });
  }, [duracion, terapias, venas, hemodinamico, irc, allAnswered]);

  const showP6 = preResult?.incluyePICC || false;

  const resultado = useMemo(() => {
    if (!allAnswered) return null;
    return decidirAdulto({
      duracion, terapias, venas, hemodinamico, irc,
      doubleLumen: showP6 ? (doubleLumen === true) : false,
    });
  }, [duracion, terapias, venas, hemodinamico, irc, doubleLumen, allAnswered, showP6]);

  const reset = () => {
    setDuracion(null);
    setTerapias([]);
    setVenas(null);
    setHemodinamico(null);
    setIrc(null);
    setDoubleLumen(null);
  };

  const layoutStyle = isMobile
    ? { ...s.layout, gridTemplateColumns: '1fr', maxWidth: '480px' }
    : s.layout;

  return (
    <div style={s.page}>
      <Header title="Adulto general" reference="MAGIC 2015" appVersion={APP_VERSION} logicaVersion={LOGICA_VERSION} />

      <div style={layoutStyle}>
        {/* Cuestionario */}
        <div style={s.col}>
          <QuestionCard label="P1" title="Duración de la terapia IV">
            <div style={s.grid2x2}>
              {DURACION_OPTIONS.map(opt => (
                <OptionButton key={opt.value} selected={duracion === opt.value} label={opt.label} onClick={() => setDuracion(opt.value)} />
              ))}
            </div>
          </QuestionCard>

          <QuestionCard label="P2" title="Tipo de terapia">
            {TERAPIA_OPTIONS.map(opt => (
              <CheckboxRow key={opt.value} selected={terapias.includes(opt.value)} label={opt.label} sub={opt.sub} onClick={() => toggleTerapia(opt.value)} />
            ))}
          </QuestionCard>

          <QuestionCard label="P3" title="Patrimonio venoso">
            {VENAS_OPTIONS.map(opt => (
              <CheckboxRow key={opt.value} selected={venas === opt.value} label={opt.label} sub={opt.sub} onClick={() => setVenas(opt.value)} radio />
            ))}
          </QuestionCard>

          <QuestionCard label="P4" title="¿PVC o múltiples vasoactivos actualmente?">
            <ToggleButtons value={hemodinamico} onSelect={setHemodinamico} danger />
          </QuestionCard>

          <QuestionCard label="P5" title="¿IRC avanzada, prediálisis o diálisis?">
            <ToggleButtons value={irc} onSelect={setIrc} />
          </QuestionCard>

          {showP6 && (
            <QuestionCard conditional badgeText="P6 · adicional" title="¿Soluciones incompatibles simultáneas?">
              <ToggleButtons value={doubleLumen} onSelect={setDoubleLumen} />
            </QuestionCard>
          )}

          <ResetButton onClick={reset} />
        </div>

        {/* Resultados */}
        <div style={isMobile ? s.col : s.rightCol}>
          <ResultSection resultado={resultado} completed={completedCount} total={5}>
            <DeviceTable dispositivos={DISPOSITIVOS} resultado={resultado} />
          </ResultSection>
        </div>
      </div>
    </div>
  );
}
