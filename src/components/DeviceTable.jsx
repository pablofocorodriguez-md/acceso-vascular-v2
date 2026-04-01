import { s } from '../styles/shared';
import { matchesDevice } from '../utils/matchesDevice';

export default function DeviceTable({ dispositivos, resultado }) {
  return (
    <div style={s.tableCard}>
      <div style={s.tableTitle}>Dispositivos disponibles</div>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Dispositivo</th>
            <th style={s.th}>Servicio</th>
          </tr>
        </thead>
        <tbody>
          {dispositivos.map(d => {
            const isMain = matchesDevice(resultado?.main, d.match);
            const isBridge = matchesDevice(resultado?.bridge?.main, d.match);
            return (
              <tr key={d.nombre}>
                <td style={s.td(isMain, isBridge && !isMain)}>{d.nombre}</td>
                <td style={s.td(isMain, isBridge && !isMain)}>{d.servicio}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
