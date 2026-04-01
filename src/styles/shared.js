export const MOBILE_BREAKPOINT = 640;

export const s = {
  // Page
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    color: '#0f172a',
  },

  // Header
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

  // Layout
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
    gap: '1rem',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    position: 'sticky',
    top: '70px',
  },

  // Question cards
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
    marginBottom: '0.75rem',
  },
  conditionalCard: {
    border: '2px dashed #7dd3fc',
    borderRadius: '10px',
    padding: '1.25rem',
    background: '#f0f9ff',
  },
  conditionalBadge: {
    display: 'inline-block',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#0284c7',
    background: '#e0f2fe',
    padding: '2px 8px',
    borderRadius: '9999px',
    marginBottom: '0.5rem',
  },

  // Option buttons (single/multi select)
  optionRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
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

  // Checkbox / radio rows
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
  checkboxIndicator: (checked, radio) => ({
    width: '18px',
    height: '18px',
    borderRadius: radio ? '50%' : '4px',
    border: `2px solid ${checked ? '#0284c7' : '#cbd5e1'}`,
    background: checked ? '#0284c7' : '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '1px',
    transition: 'all 0.12s ease',
  }),

  // Toggle buttons (Sí/No)
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

  // Progress bar
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

  // Result card
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

  // Bridge card
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

  // Note card
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
    whiteSpace: 'pre-line',
  },

  // Warning card
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

  // Empty state
  emptyState: {
    textAlign: 'center',
    padding: '2rem 1rem',
    color: '#94a3b8',
    fontSize: '0.9rem',
  },

  // Device table
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
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.82rem',
  },
  th: {
    textAlign: 'left',
    padding: '0.4rem 0.6rem',
    borderBottom: '1.5px solid #e2e8f0',
    color: '#475569',
    fontWeight: 600,
    fontSize: '0.75rem',
  },
  td: (highlighted, isBridge) => ({
    padding: '0.4rem 0.6rem',
    borderBottom: '1px solid #f1f5f9',
    background: highlighted ? '#e0f2fe' : isBridge ? '#f1f5f9' : 'transparent',
    fontWeight: highlighted ? 600 : 400,
    color: highlighted ? '#0284c7' : '#0f172a',
  }),

  // Reset button
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
    marginTop: '0.25rem',
    transition: 'all 0.12s ease',
  },
};
