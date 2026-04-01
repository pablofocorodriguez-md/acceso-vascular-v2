import { s } from '../styles/shared';

function ProgressBar({ completed, total }) {
  const remaining = total - completed;
  return (
    <div>
      <div style={s.progressBar}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={s.progressSeg(i < completed)} />
        ))}
      </div>
      <div style={s.progressText}>
        {completed === total
          ? 'Cuestionario completo'
          : `${remaining} pregunta${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}`}
      </div>
    </div>
  );
}

function ResultCard({ resultado }) {
  return (
    <div style={s.resultCard}>
      <div style={s.resultLabel}>
        {resultado.bridge ? 'Dispositivo inmediato' : 'Recomendación'}
      </div>
      <div style={s.resultMain}>{resultado.main}</div>
      {resultado.servicio && (
        <div style={s.resultServicio}>→ {resultado.servicio}</div>
      )}
      {resultado.alt && <div style={s.resultAlt}>{resultado.alt}</div>}
      {resultado.source && (
        <div style={s.resultSource}>{resultado.source}</div>
      )}
    </div>
  );
}

function BridgeCard({ bridge }) {
  return (
    <div style={s.bridgeCard}>
      <div style={s.bridgeLabel}>Acceso definitivo</div>
      <div style={s.bridgeSub}>
        Planificar al estabilizarse — el CVC es un puente
      </div>
      <div style={s.resultMain}>{bridge.main}</div>
      <div style={s.resultServicio}>→ {bridge.servicio}</div>
      {bridge.alt && <div style={s.resultAlt}>{bridge.alt}</div>}
      {bridge.note && <div style={s.noteText}>{bridge.note}</div>}
      {bridge.source && <div style={s.resultSource}>{bridge.source}</div>}
    </div>
  );
}

function NoteCard({ note }) {
  return (
    <div style={s.noteCard}>
      <div style={s.noteLabel}>Nota</div>
      <div style={s.noteText}>{note}</div>
    </div>
  );
}

function WarningCard({ text }) {
  return (
    <div style={s.warningCard}>
      <div style={s.warningLabel}>⚠ Advertencia</div>
      <div style={s.warningText}>{text}</div>
    </div>
  );
}

export default function ResultSection({
  resultado,
  completed,
  total,
  emptyText = 'Completá las preguntas para ver la recomendación',
  extraWarnings,
  children,
}) {
  const allWarnings = resultado
    ? [...resultado.warnings, ...(resultado.bridge?.warnings || []), ...(extraWarnings || [])]
    : [];

  return (
    <>
      <ProgressBar completed={completed} total={total} />

      {resultado?.main ? (
        <>
          <ResultCard resultado={resultado} />
          {resultado.bridge?.main && <BridgeCard bridge={resultado.bridge} />}
          {resultado.note && !resultado.bridge && <NoteCard note={resultado.note} />}
          {resultado.note && resultado.bridge && <NoteCard note={resultado.note} />}
          {allWarnings.map((w, i) => (
            <WarningCard key={i} text={w} />
          ))}
        </>
      ) : (
        <div style={s.emptyState}>{emptyText}</div>
      )}

      {children}
    </>
  );
}
