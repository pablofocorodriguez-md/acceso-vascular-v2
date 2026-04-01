import { useNavigate } from 'react-router-dom';
import { s } from '../styles/shared';

export default function Header({ title, reference, appVersion, logicaVersion }) {
  const navigate = useNavigate();

  return (
    <div style={s.header}>
      <div style={s.headerLeft}>
        <button style={s.backBtn} onClick={() => navigate('/')}>
          ← Volver
        </button>
        <span style={s.headerTitle}>{title}</span>
        <span style={s.headerVersion}>
          código {appVersion} · lógica {logicaVersion}
        </span>
      </div>
      <div style={s.headerRight}>{reference}</div>
    </div>
  );
}
