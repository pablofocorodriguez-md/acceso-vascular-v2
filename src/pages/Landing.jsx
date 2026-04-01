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
  card: {
    width: '200px',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textAlign: 'center',
  },
  cardHover: {
    borderColor: '#7dd3fc',
    boxShadow: '0 4px 12px rgba(2,132,199,0.12)',
  },
  cardDisabled: {
    width: '200px',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    background: '#f1f5f9',
    cursor: 'not-allowed',
    textAlign: 'center',
    opacity: 0.6,
  },
  cardTitle: {
    fontSize: '1.05rem',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '0.25rem',
  },
  cardTitleDisabled: {
    fontSize: '1.05rem',
    fontWeight: 600,
    color: '#94a3b8',
    marginBottom: '0.25rem',
  },
  badge: {
    display: 'inline-block',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#94a3b8',
    background: '#f1f5f9',
    padding: '2px 8px',
    borderRadius: '9999px',
    marginTop: '0.5rem',
  },
  footer: {
    marginTop: '3rem',
    fontSize: '0.8rem',
    color: '#94a3b8',
  },
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Selección de Acceso Vascular</h1>
      <p style={styles.subtitle}>Soporte a la decisión clínica — guías MAGIC 2015</p>

      <div style={styles.grid}>
        <div
          style={styles.card}
          onClick={() => navigate('/adulto')}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#7dd3fc';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(2,132,199,0.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧑</div>
          <div style={styles.cardTitle}>Adulto general</div>
        </div>

        <div style={styles.cardDisabled}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem', filter: 'grayscale(1)' }}>🎗️</div>
          <div style={styles.cardTitleDisabled}>Oncología</div>
          <span style={styles.badge}>Próximamente</span>
        </div>

        <div
          style={styles.card}
          onClick={() => navigate('/pediatrico')}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#7dd3fc';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(2,132,199,0.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👶</div>
          <div style={styles.cardTitle}>Pediátrico</div>
        </div>
      </div>

      <div style={styles.footer}>v2.0</div>
    </div>
  );
}
