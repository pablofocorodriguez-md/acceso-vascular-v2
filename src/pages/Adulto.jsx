import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { decidirAdulto } from '../logic/decidirAdulto';

const APP_VERSION = "v2.0";
const LOGICA_VERSION = "v2.0";

const DISPOSITIVOS = [
  { nombre: "VVP", servicio: "Enfermería" },
  { nombre: "Midline", servicio: "Angiografía" },
  { nombre: "PICC", servicio: "Angiografía" },
  { nombre: "CVC yugular", servicio: "Angiografía" },
  { nombre: "CVC subclavia", servicio: "Cirugía" },
  { nombre: "Port", servicio: "Cirugía" },
  { nombre: "Hickman", servicio: "Cirugía" },
];

// --- Styles ---
const s = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    color: '#0f172a',
  },
  header: {
    background: '#fff',
    borderBottom: '1px solid #e2e8f0',
    padding: '0.75rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#0284c7',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontWeight: 500,
    padding: '4px 0',
  },
  headerTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#0f172a',
  },
  headerVersion: {
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    color: '#94a3b8',
    marginLeft: '0.75rem',
  },
  headerRight: {
    fontStyle: 'italic',
    color: '#94a3b8',
    fontSize: '0.85rem',
  },
  layout: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '1.5rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    alignItems: 'start',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    position: 'sticky',
    top: '70px',
  },
  questionCard: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '1.25rem',
  },
  questionLabel: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#0284c7',
    marginBottom: '0.25rem',
  },
  questionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '1rem',
  },
  grid2x2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
  },
  optionBtn: (selected) => ({
    padding: '0.65rem 0.75rem',
    borderRadius: '8px',
    border: `1.5px solid ${selected ? '#0284c7' : '#e2e8f0'}`,
    background: selected ? '#f0f9ff' : '#fff',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    transition: 'all 0.12s ease',
  }),
  optionLabel: (selected) => ({
    fontSize: '0.9rem',
    fontWeight: selected ? 600 : 500,
    color: selected ? '#0284c7' : '#0f172a',
  }),
  optionSub: {
    fontSize: '0.75rem',
    color: '#475569',
    marginTop: '2px',
  },
  checkboxRow: (selected) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.6rem',
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    border: `1.5px solid ${selected ? '#0284c7' : '#e2e8f0'}`,
    background: selected ? '#f0f9ff' : '#fff',
    cursor: 'pointer',
    marginBottom: '0.4rem',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  }),
  checkbox: (checked) => ({
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    border: `2px solid ${checked ? '#0284c7' : '#cbd5e1'}`,
    background: checked ? '#0284c7' : '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '1px',
    transition: 'all 0.12s ease',
  }),
  toggle: {
    display: 'flex',
    gap: '0.5rem',
  },
  toggleBtn: (active, danger) => ({
    flex: 1,
    padding: '0.6rem',
    borderRadius: '8px',
    border: `1.5px solid ${active ? (danger ? '#ef4444' : '#0284c7') : '#e2e8f0'}`,
    background: active ? (danger ? '#fff5f5' : '#f0f9ff') : '#fff',
    color: active ? (danger ? '#ef4444' : '#0284c7') : '#0f172a',
    fontWeight: active ? 600 : 500,
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    textAlign: 'center',
    transition: 'all 0.12s ease',
  }),
  // P6 conditional container
  p6Container: {
    border: '2px dashed #7dd3fc',
    borderRadius: '10px',
    padding: '1.25rem',
    background: '#f0f9ff',
  },
  p6Badge: {
    display: 'inline-block',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#0284c7',
    background: '#e0f2fe',
    padding: '2px 8px',
    borderRadius: '9999px',
    marginBottom: '0.5rem',
  },
  // Result panel
  progressBar: {
    display: 'flex',
    gap: '4px',
    marginBottom: '0.25rem',
  },
  progressSeg: (filled) => ({
    flex: 1,
    height: '6px',
    borderRadius: '3px',
    background: filled ? '#0284c7' : '#e2e8f0',
    transition: 'background 0.2s ease',
  }),
  progressText: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textAlign: 'right',
  },
  resultCard: {
    border: '1.5px solid #7dd3fc',
    borderRadius: '10px',
    padding: '1.25rem',
    background: '#f0f9ff',
  },
  resultLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#0284c7',
    marginBottom: '0.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  resultMain: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '0.35rem',
  },
  resultServicio: {
    fontSize: '0.9rem',
    color: '#475569',
    marginBottom: '0.5rem',
  },
  resultAlt: {
    fontSize: '0.82rem',
    color: '#475569',
    background: '#e0f2fe',
    padding: '0.6rem 0.75rem',
    borderRadius: '6px',
    marginTop: '0.5rem',
    lineHeight: 1.45,
  },
  resultSource: {
    fontSize: '0.75rem',
    fontStyle: 'italic',
    color: '#94a3b8',
    marginTop: '0.75rem',
  },
  bridgeCard: {
    border: '1.5px dashed #94a3b8',
    borderRadius: '10px',
    padding: '1.25rem',
    background: '#f8fafc',
  },
  bridgeLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#475569',
    marginBottom: '0.15rem',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  bridgeSub: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    marginBottom: '0.5rem',
  },
  noteCard: {
    border: '1px solid #bae6fd',
    borderRadius: '10px',
    padding: '1rem',
    background: '#f0f9ff',
  },
  noteLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#0284c7',
    marginBottom: '0.35rem',
  },
  noteText: {
    fontSize: '0.85rem',
    color: '#475569',
    lineHeight: 1.5,
  },
  warningCard: {
    border: '1.5px solid #fbbf24',
    borderRadius: '10px',
    padding: '1rem',
    background: '#fffbeb',
  },
  warningLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#92400e',
    marginBottom: '0.35rem',
  },
  warningText: {
    fontSize: '0.85rem',
    color: '#92400e',
    whiteSpace: 'pre-line',
    lineHeight: 1.5,
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem 1rem',
    color: '#94a3b8',
    fontSize: '0.9rem',
  },
  deviceTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.82rem',
  },
  deviceTh: {
    textAlign: 'left',
    padding: '0.4rem 0.6rem',
    borderBottom: '1.5px solid #e2e8f0',
    color: '#475569',
    fontWeight: 600,
    fontSize: '0.75rem',
  },
  deviceTd: (highlighted, isBridge) => ({
    padding: '0.4rem 0.6rem',
    borderBottom: '1px solid #f1f5f9',
    background: highlighted ? '#e0f2fe' : isBridge ? '#f1f5f9' : 'transparent',
    fontWeight: highlighted ? 600 : 400,
    color: highlighted ? '#0284c7' : '#0f172a',
  }),
  tableCard: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '1rem',
  },
  tableTitle: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#475569',
    marginBottom: '0.5rem',
  },
  resetBtn: {
    background: 'none',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    color: '#475569',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    marginTop: '0.5rem',
    transition: 'all 0.12s ease',
  },
};

// Responsive media query handled inline
const MOBILE_BREAKPOINT = 640;

const DURACION_OPTIONS = [
  { value: "D1", label: "\u2264 5 días" },
  { value: "D2", label: "6 \u2013 14 días" },
  { value: "D3", label: "15 días \u2013 3 meses" },
  { value: "D4", label: "> 3 meses" },
];

const TERAPIA_OPTIONS = [
  { value: "estandar", label: "Estándar", sub: "ATB, fluidos, analgesia" },
  { value: "irritante", label: "Irritante / vesicante", sub: "no oncológica" },
  { value: "npt", label: "NPT", sub: "nutrición parenteral total" },
  { value: "ph", label: "pH / osmol extrema", sub: "> 900 mOsm o pH < 5 / > 9" },
];

const VENAS_OPTIONS = [
  { value: "V1", label: "Buenas", sub: "visibles y palpables" },
  { value: "V2", label: "Dificultosas", sub: "múltiples intentos" },
  { value: "V3", label: "Agotadas", sub: "sin acceso periférico" },
];

function matchesDevice(mainStr, deviceName) {
  if (!mainStr) return false;
  const m = mainStr.toLowerCase();
  const d = deviceName.toLowerCase();
  if (d === "vvp") return m.includes("vvp") || m.includes("vía venosa periférica");
  if (d === "midline") return m.includes("midline");
  if (d === "picc") return m.includes("picc");
  if (d === "cvc yugular") return m.includes("cvc") && m.includes("yugular");
  if (d === "cvc subclavia") return m.includes("cvc") && m.includes("subclavia");
  if (d === "port") return m.includes("port");
  if (d === "hickman") return m.includes("hickman");
  return false;
}

export default function Adulto() {
  const navigate = useNavigate();
  const [duracion, setDuracion] = useState(null);
  const [terapias, setTerapias] = useState([]);
  const [venas, setVenas] = useState(null);
  const [hemodinamico, setHemodinamico] = useState(null);
  const [irc, setIrc] = useState(null);
  const [doubleLumen, setDoubleLumen] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useState(() => {
    const handler = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  });

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

  // First pass: without doubleLumen to check if PICC is included
  const preResult = useMemo(() => {
    if (!allAnswered) return null;
    return decidirAdulto({
      duracion, terapias, venas, hemodinamico, irc, doubleLumen: false,
    });
  }, [duracion, terapias, venas, hemodinamico, irc, allAnswered]);

  const showP6 = preResult?.incluyePICC || false;

  // Final result with doubleLumen
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

  // Collect all warnings including bridge
  const allWarnings = resultado
    ? [...resultado.warnings, ...(resultado.bridge?.warnings || [])]
    : [];

  const layoutStyle = isMobile
    ? { ...s.layout, gridTemplateColumns: '1fr', maxWidth: '480px' }
    : s.layout;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <button style={s.backBtn} onClick={() => navigate('/')}>
            ← Volver
          </button>
          <span style={s.headerTitle}>Adulto general</span>
          <span style={s.headerVersion}>
            código {APP_VERSION} · lógica {LOGICA_VERSION}
          </span>
        </div>
        <div style={s.headerRight}>MAGIC 2015</div>
      </div>

      {/* Layout */}
      <div style={layoutStyle}>
        {/* Left column — Questionnaire */}
        <div style={s.col}>
          {/* P1 */}
          <div style={s.questionCard}>
            <div style={s.questionLabel}>P1</div>
            <div style={s.questionTitle}>Duración de la terapia IV</div>
            <div style={s.grid2x2}>
              {DURACION_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  style={s.optionBtn(duracion === opt.value)}
                  onClick={() => setDuracion(opt.value)}
                >
                  <div style={s.optionLabel(duracion === opt.value)}>{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* P2 */}
          <div style={s.questionCard}>
            <div style={s.questionLabel}>P2</div>
            <div style={s.questionTitle}>Tipo de terapia</div>
            {TERAPIA_OPTIONS.map(opt => (
              <div
                key={opt.value}
                style={s.checkboxRow(terapias.includes(opt.value))}
                onClick={() => toggleTerapia(opt.value)}
              >
                <div style={s.checkbox(terapias.includes(opt.value))}>
                  {terapias.includes(opt.value) && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div>
                  <div style={s.optionLabel(terapias.includes(opt.value))}>{opt.label}</div>
                  <div style={s.optionSub}>{opt.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* P3 */}
          <div style={s.questionCard}>
            <div style={s.questionLabel}>P3</div>
            <div style={s.questionTitle}>Patrimonio venoso</div>
            {VENAS_OPTIONS.map(opt => (
              <div
                key={opt.value}
                style={s.checkboxRow(venas === opt.value)}
                onClick={() => setVenas(opt.value)}
              >
                <div style={{
                  ...s.checkbox(venas === opt.value),
                  borderRadius: '50%',
                }}>
                  {venas === opt.value && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#fff',
                    }} />
                  )}
                </div>
                <div>
                  <div style={s.optionLabel(venas === opt.value)}>{opt.label}</div>
                  <div style={s.optionSub}>{opt.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* P4 */}
          <div style={s.questionCard}>
            <div style={s.questionLabel}>P4</div>
            <div style={s.questionTitle}>¿PVC o múltiples vasoactivos actualmente?</div>
            <div style={s.toggle}>
              <button
                style={s.toggleBtn(hemodinamico === true, true)}
                onClick={() => setHemodinamico(true)}
              >
                Sí
              </button>
              <button
                style={s.toggleBtn(hemodinamico === false, false)}
                onClick={() => setHemodinamico(false)}
              >
                No
              </button>
            </div>
          </div>

          {/* P5 */}
          <div style={s.questionCard}>
            <div style={s.questionLabel}>P5</div>
            <div style={s.questionTitle}>¿IRC avanzada, prediálisis o diálisis?</div>
            <div style={s.toggle}>
              <button
                style={s.toggleBtn(irc === true, false)}
                onClick={() => setIrc(true)}
              >
                Sí
              </button>
              <button
                style={s.toggleBtn(irc === false, false)}
                onClick={() => setIrc(false)}
              >
                No
              </button>
            </div>
          </div>

          {/* P6 — conditional */}
          {showP6 && (
            <div style={s.p6Container}>
              <div style={s.p6Badge}>P6 · adicional</div>
              <div style={s.questionTitle}>¿Soluciones incompatibles simultáneas?</div>
              <div style={s.toggle}>
                <button
                  style={s.toggleBtn(doubleLumen === true, false)}
                  onClick={() => setDoubleLumen(true)}
                >
                  Sí
                </button>
                <button
                  style={s.toggleBtn(doubleLumen === false, false)}
                  onClick={() => setDoubleLumen(false)}
                >
                  No
                </button>
              </div>
            </div>
          )}

          {/* Reset */}
          <button
            style={s.resetBtn}
            onClick={reset}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#94a3b8'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            Reiniciar
          </button>
        </div>

        {/* Right column — Results */}
        <div style={isMobile ? s.col : s.rightCol}>
          {/* Progress */}
          <div>
            <div style={s.progressBar}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={s.progressSeg(i <= completedCount)} />
              ))}
            </div>
            <div style={s.progressText}>
              {completedCount === 5
                ? 'Cuestionario completo'
                : `${5 - completedCount} pregunta${5 - completedCount > 1 ? 's' : ''} restante${5 - completedCount > 1 ? 's' : ''}`}
            </div>
          </div>

          {/* Result or empty state */}
          {resultado?.main ? (
            <>
              {/* Main recommendation */}
              <div style={s.resultCard}>
                <div style={s.resultLabel}>
                  {resultado.bridge ? 'Dispositivo inmediato' : 'Recomendación'}
                </div>
                <div style={s.resultMain}>{resultado.main}</div>
                <div style={s.resultServicio}>→ {resultado.servicio}</div>
                {resultado.alt && (
                  <div style={s.resultAlt}>{resultado.alt}</div>
                )}
                {resultado.source && (
                  <div style={s.resultSource}>{resultado.source}</div>
                )}
              </div>

              {/* Bridge */}
              {resultado.bridge?.main && (
                <div style={s.bridgeCard}>
                  <div style={s.bridgeLabel}>Acceso definitivo</div>
                  <div style={s.bridgeSub}>
                    Planificar al estabilizarse — el CVC es un puente
                  </div>
                  <div style={s.resultMain}>{resultado.bridge.main}</div>
                  <div style={s.resultServicio}>→ {resultado.bridge.servicio}</div>
                  {resultado.bridge.alt && (
                    <div style={s.resultAlt}>{resultado.bridge.alt}</div>
                  )}
                  {resultado.bridge.source && (
                    <div style={s.resultSource}>{resultado.bridge.source}</div>
                  )}
                </div>
              )}

              {/* Evidence note (only if no bridge) */}
              {resultado.note && !resultado.bridge && (
                <div style={s.noteCard}>
                  <div style={s.noteLabel}>Nota de evidencia</div>
                  <div style={s.noteText}>{resultado.note}</div>
                </div>
              )}

              {/* Warnings */}
              {allWarnings.map((w, i) => (
                <div key={i} style={s.warningCard}>
                  <div style={s.warningLabel}>⚠ Advertencia</div>
                  <div style={s.warningText}>{w}</div>
                </div>
              ))}
            </>
          ) : (
            <div style={s.emptyState}>
              {completedCount === 0
                ? 'Completá las preguntas para ver la recomendación'
                : `${5 - completedCount} pregunta${5 - completedCount > 1 ? 's' : ''} restante${5 - completedCount > 1 ? 's' : ''}`}
            </div>
          )}

          {/* Device table — always visible */}
          <div style={s.tableCard}>
            <div style={s.tableTitle}>Dispositivos disponibles</div>
            <table style={s.deviceTable}>
              <thead>
                <tr>
                  <th style={s.deviceTh}>Dispositivo</th>
                  <th style={s.deviceTh}>Servicio</th>
                </tr>
              </thead>
              <tbody>
                {DISPOSITIVOS.map(d => {
                  const isMain = resultado?.main && matchesDevice(resultado.main, d.nombre);
                  const isBridge = resultado?.bridge?.main && matchesDevice(resultado.bridge.main, d.nombre);
                  return (
                    <tr key={d.nombre}>
                      <td style={s.deviceTd(isMain, isBridge && !isMain)}>{d.nombre}</td>
                      <td style={s.deviceTd(isMain, isBridge && !isMain)}>{d.servicio}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
