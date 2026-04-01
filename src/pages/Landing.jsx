import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#475569',
    marginBottom: '2.5rem',
    textAlign: 'center',
  },
  grid: {
    display: 'flex',
    gap: '1.25rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '720px',
  },
  footer: {
    marginTop: '3rem',
    fontSize: '0.8rem',
    color: '#94a3b8',
  },
};

const MODULES = [
  { path: '/adulto', icon: '\ud83e\uddd1', label: 'Adulto general' },
  { path: '/oncologia', icon: '\ud83c\udf97\ufe0f', label: 'Oncología' },
  { path: '/pediatrico', icon: '\ud83d\udc76', label: 'Pediátrico' },
];

function ModuleCard({ icon, label, onClick }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        width: '200px',
        padding: '1.5rem',
        borderRadius: '12px',
        border: `1px solid ${hover ? '#7dd3fc' : '#e2e8f0'}`,
        background: '#fff',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        textAlign: 'center',
        boxShadow: hover ? '0 4px 12px rgba(2,132,199,0.12)' : 'none',
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>{label}</div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Selección de Acceso Vascular</h1>
      <p style={styles.subtitle}>Soporte a la decisión clínica — guías MAGIC 2015</p>

      <div style={styles.grid}>
        {MODULES.map(m => (
          <ModuleCard key={m.path} icon={m.icon} label={m.label} onClick={() => navigate(m.path)} />
        ))}
      </div>

      <div style={styles.footer}>v2.0</div>
    </div>
  );
}
