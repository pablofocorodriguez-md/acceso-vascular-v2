import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decidirPediatrico } from '../logic/decidirPediatrico';

const APP_VERSION = 'v2.0';
const LOGICA_VERSION = 'v2.0-ped';
const MOBILE_BREAKPOINT = 640;

const DISPOSITIVOS = [
  { nombre: 'PIV', servicio: 'Enfermería' },
  { nombre: 'Catéter umbilical', servicio: 'Neonatología' },
  { nombre: 'Midline', servicio: 'Acceso vascular' },
  { nombre: 'PICC', servicio: 'Acceso vascular / angiografía' },
  { nombre: 'CVC no tunelizado', servicio: 'Unidad crítica / angiografía' },
  { nombre: 'CVC tunelizado', servicio: 'Cirugía / acceso vascular' },
  { nombre: 'Port', servicio: 'Cirugía' },
  { nombre: 'Intraóseo', servicio: 'Unidad crítica' },
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

function matchesDevice(mainStr, deviceName) {
  if (!mainStr) return false;
  const m = mainStr.toLowerCase();
  const d = deviceName.toLowerCase();
  if (d === 'piv') return m.includes('piv');
  if (d === 'catéter umbilical') return m.includes('umbilical');
  if (d === 'midline') return m.includes('midline');
  if (d === 'picc') return m.includes('picc');
  if (d === 'cvc no tunelizado') return m.includes('cvc no tunelizado') || m.includes('ntcvad');
  if (d === 'cvc tunelizado') return m.includes('tunelizado') || m.includes('tccvad');
  if (d === 'port') return m.includes('port');
  if (d === 'intraóseo') return m.includes('intraóseo');
  return false;
}

const s = {
  page: { minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', system-ui, sans-serif", color: '#0f172a' },
  header: { background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '1rem' },
  backBtn: { background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 },
  headerTitle: { fontSize: '1.1rem', fontWeight: 700 },
  headerVersion: { fontFamily: 'monospace', fontSize: '0.75rem', color: '#94a3b8' },
  headerRight: { fontStyle: 'italic', color: '#94a3b8', fontSize: '0.85rem' },
  layout: { maxWidth: '960px', margin: '0 auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' },
  col: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '70px' },
  questionCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' },
  questionLabel: { fontSize: '0.8rem', fontWeight: 600, color: '#0284c7', marginBottom: '0.25rem' },
  questionTitle: { fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' },
  optionRow: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  optionBtn: (selected) => ({ border: `1.5px solid ${selected ? '#0284c7' : '#e2e8f0'}`, borderRadius: '8px', background: selected ? '#f0f9ff' : '#fff', padding: '0.55rem 0.7rem', textAlign: 'left', cursor: 'pointer' }),
  optionLabel: (selected) => ({ fontSize: '0.9rem', fontWeight: selected ? 600 : 500, color: selected ? '#0284c7' : '#0f172a' }),
  optionSub: { fontSize: '0.75rem', color: '#475569', marginTop: '2px' },
  toggle: { display: 'flex', gap: '0.5rem' },
  toggleBtn: (active) => ({ flex: 1, border: `1.5px solid ${active ? '#0284c7' : '#e2e8f0'}`, background: active ? '#f0f9ff' : '#fff', color: active ? '#0284c7' : '#0f172a', borderRadius: '8px', padding: '0.6rem', cursor: 'pointer', fontWeight: active ? 600 : 500 }),
  progressSeg: (filled) => ({ flex: 1, height: '6px', borderRadius: '3px', background: filled ? '#0284c7' : '#e2e8f0' }),
  resultCard: { border: '1.5px solid #7dd3fc', borderRadius: '10px', padding: '1rem', background: '#f0f9ff' },
  resultLabel: { fontSize: '0.75rem', fontWeight: 600, color: '#0284c7', textTransform: 'uppercase', marginBottom: '0.25rem' },
  resultMain: { fontSize: '1.1rem', fontWeight: 700 },
  resultServicio: { fontSize: '0.88rem', color: '#475569', marginTop: '0.25rem' },
  resultAlt: { fontSize: '0.82rem', color: '#475569', background: '#e0f2fe', borderRadius: '6px', padding: '0.6rem', marginTop: '0.55rem' },
  warningCard: { border: '1.5px solid #fbbf24', borderRadius: '10px', background: '#fffbeb', padding: '0.9rem' },
  warningLabel: { fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.2rem' },
  warningText: { fontSize: '0.85rem', color: '#92400e', whiteSpace: 'pre-line' },
  infoCard: { border: '1px solid #bae6fd', borderRadius: '10px', background: '#f0f9ff', padding: '0.9rem' },
  infoText: { fontSize: '0.84rem', color: '#475569', lineHeight: 1.45, whiteSpace: 'pre-line' },
  tableCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' },
  tableTitle: { fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' },
  th: { textAlign: 'left', borderBottom: '1.5px solid #e2e8f0', padding: '0.35rem 0.5rem', color: '#475569', fontSize: '0.75rem' },
  td: (highlighted) => ({ padding: '0.35rem 0.5rem', borderBottom: '1px solid #f1f5f9', background: highlighted ? '#e0f2fe' : 'transparent', color: highlighted ? '#0284c7' : '#0f172a', fontWeight: highlighted ? 600 : 400 }),
  resetBtn: { border: '1px solid #e2e8f0', borderRadius: '8px', background: 'none', padding: '0.45rem 0.8rem', color: '#475569', cursor: 'pointer', marginTop: '0.25rem' },
};

export default function Pediatrico() {
  const navigate = useNavigate();
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

  const completedCount = [grupo, duracion, tipoTerapia, venas, incompatibles, cardiopatiaCongenita, prematuro]
    .filter(v => v !== null)
    .length;

  const allAnswered = completedCount === 7;

  const resultado = useMemo(() => {
    if (!allAnswered) return null;
    return decidirPediatrico({
      grupo,
      duracion,
      tipoTerapia,
      venas,
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
      <div style={s.header}>
        <div style={s.headerLeft}>
          <button style={s.backBtn} onClick={() => navigate('/')}>← Volver</button>
          <span style={s.headerTitle}>Pediátrico</span>
          <span style={s.headerVersion}>código {APP_VERSION} · lógica {LOGICA_VERSION}</span>
        </div>
        <div style={s.headerRight}>miniMAGIC 2020</div>
      </div>

      <div style={layoutStyle}>
        <div style={s.col}>
          <div style={s.questionCard}>
            <div style={s.questionLabel}>P1</div>
            <div style={s.questionTitle}>Grupo etario</div>
            <div style={s.optionRow}>{GRUPO_OPTIONS.map(opt => <button key={opt.value} style={s.optionBtn(grupo === opt.value)} onClick={() => setGrupo(opt.value)}><div style={s.optionLabel(grupo === opt.value)}>{opt.label}</div><div style={s.optionSub}>{opt.sub}</div></button>)}</div>
          </div>

          <div style={s.questionCard}>
            <div style={s.questionLabel}>P2</div>
            <div style={s.questionTitle}>Duración estimada de la terapia IV</div>
            <div style={s.optionRow}>{DURACION_OPTIONS.map(opt => <button key={opt.value} style={s.optionBtn(duracion === opt.value)} onClick={() => setDuracion(opt.value)}><div style={s.optionLabel(duracion === opt.value)}>{opt.label}</div></button>)}</div>
          </div>

          <div style={s.questionCard}>
            <div style={s.questionLabel}>P3</div>
            <div style={s.questionTitle}>Tipo de terapia</div>
            <div style={s.optionRow}>{TERAPIA_OPTIONS.map(opt => <button key={opt.value} style={s.optionBtn(tipoTerapia === opt.value)} onClick={() => setTipoTerapia(opt.value)}><div style={s.optionLabel(tipoTerapia === opt.value)}>{opt.label}</div></button>)}</div>
          </div>

          <div style={s.questionCard}>
            <div style={s.questionLabel}>P4</div>
            <div style={s.questionTitle}>Calidad del acceso venoso periférico</div>
            <div style={s.optionRow}>{VENAS_OPTIONS.map(opt => <button key={opt.value} style={s.optionBtn(venas === opt.value)} onClick={() => setVenas(opt.value)}><div style={s.optionLabel(venas === opt.value)}>{opt.label}</div></button>)}</div>
          </div>

          {[['P5', '¿Infusiones incompatibles simultáneas?', incompatibles, setIncompatibles], ['P6', '¿Cardiopatía congénita?', cardiopatiaCongenita, setCardiopatiaCongenita], ['P7', '¿Prematuro?', prematuro, setPrematuro]].map(([label, title, value, setter]) => (
            <div style={s.questionCard} key={label}>
              <div style={s.questionLabel}>{label}</div>
              <div style={s.questionTitle}>{title}</div>
              <div style={s.toggle}>
                <button style={s.toggleBtn(value === true)} onClick={() => setter(true)}>Sí</button>
                <button style={s.toggleBtn(value === false)} onClick={() => setter(false)}>No</button>
              </div>
            </div>
          ))}

          <button style={s.resetBtn} onClick={reset}>Reiniciar</button>
        </div>

        <div style={s.rightCol}>
          <div style={s.infoCard}>
            <div style={s.infoText}>Basado en miniMAGIC 2020. Módulo pediátrico en revisión clínica. No usar como protocolo institucional sin validación local.</div>
          </div>

          <div style={{ ...s.infoCard, paddingBottom: '0.55rem' }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '0.35rem' }}>
              {Array.from({ length: 7 }).map((_, idx) => <div key={idx} style={s.progressSeg(idx < completedCount)} />)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'right' }}>Preguntas respondidas: {completedCount}/7</div>
          </div>

          {!resultado && (
            <div style={s.tableCard}>Completá las preguntas para ver la recomendación.</div>
          )}

          {resultado && (
            <div style={s.resultCard}>
              <div style={s.resultLabel}>Recomendación</div>
              <div style={s.resultMain}>{resultado.main || 'Fuera de alcance del módulo estándar'}</div>
              {resultado.servicio && <div style={s.resultServicio}>→ {resultado.servicio}</div>}
              {resultado.alt && <div style={s.resultAlt}>{resultado.alt}</div>}
              {resultado.source && <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#94a3b8', marginTop: '0.55rem' }}>{resultado.source}</div>}
            </div>
          )}

          {resultado?.note && (
            <div style={s.infoCard}>
              <div style={s.warningLabel}>Nota</div>
              <div style={s.infoText}>{resultado.note}</div>
            </div>
          )}

          {resultado?.warnings?.map((warning) => (
            <div style={s.warningCard} key={warning}>
              <div style={s.warningLabel}>⚠ Advertencia</div>
              <div style={s.warningText}>{warning}</div>
            </div>
          ))}

          <div style={s.tableCard}>
            <div style={s.tableTitle}>Dispositivos disponibles</div>
            <table style={s.table}>
              <thead>
                <tr><th style={s.th}>Dispositivo</th><th style={s.th}>Servicio</th></tr>
              </thead>
              <tbody>
                {DISPOSITIVOS.map((d) => (
                  <tr key={d.nombre}>
                    <td style={s.td(matchesDevice(resultado?.main, d.nombre))}>{d.nombre}</td>
                    <td style={s.td(matchesDevice(resultado?.main, d.nombre))}>{d.servicio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
