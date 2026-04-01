import { s } from '../styles/shared';

export function QuestionCard({ label, title, children, conditional, badgeText }) {
  if (conditional) {
    return (
      <div style={s.conditionalCard}>
        {badgeText && <div style={s.conditionalBadge}>{badgeText}</div>}
        <div style={s.questionTitle}>{title}</div>
        {children}
      </div>
    );
  }

  return (
    <div style={s.questionCard}>
      {label && <div style={s.questionLabel}>{label}</div>}
      <div style={s.questionTitle}>{title}</div>
      {children}
    </div>
  );
}

export function OptionButton({ selected, label, sub, onClick }) {
  return (
    <button style={s.optionBtn(selected)} onClick={onClick}>
      <div style={s.optionLabel(selected)}>{label}</div>
      {sub && <div style={s.optionSub}>{sub}</div>}
    </button>
  );
}

export function CheckboxRow({ selected, label, sub, onClick, radio }) {
  return (
    <div style={s.checkboxRow(selected)} onClick={onClick}>
      <div style={s.checkboxIndicator(selected, radio)}>
        {selected && (
          radio ? (
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )
        )}
      </div>
      <div>
        <div style={s.optionLabel(selected)}>{label}</div>
        {sub && <div style={s.optionSub}>{sub}</div>}
      </div>
    </div>
  );
}

export function ToggleButtons({ value, onSelect, yesLabel = 'Sí', noLabel = 'No', danger }) {
  return (
    <div style={s.toggle}>
      <button style={s.toggleBtn(value === true, danger)} onClick={() => onSelect(true)}>
        {yesLabel}
      </button>
      <button style={s.toggleBtn(value === false, false)} onClick={() => onSelect(false)}>
        {noLabel}
      </button>
    </div>
  );
}

export function ResetButton({ onClick }) {
  return (
    <button
      style={s.resetBtn}
      onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#94a3b8'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
    >
      Reiniciar
    </button>
  );
}
