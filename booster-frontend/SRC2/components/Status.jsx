import { useBooster } from '../context/BoosterContext.jsx';

export function Status() {
  const { telemetria } = useBooster();

  // Diccionario para cambiar el color según el estado
  const colores = {
    IDLE: 'bg-gray-200 text-gray-600',
    RUNNING: 'bg-green-200 text-green-800',
    BRAKING: 'bg-red-200 text-red-800',
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center justify-between font-mono text-sm mb-6">
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-400">ESTADO:</span>
        <span className={`px-2 py-0.5 rounded font-bold ${colores[telemetria.state] || colores.IDLE}`}>
          {telemetria.state}
        </span>
      </div>
      
      <div className="flex gap-6">
        <div><span className="text-gray-400">v:</span> <b>{telemetria.velocity_kmh}</b> <small>km/h</small></div>
        <div><span className="text-gray-400">s:</span> <b>{telemetria.position_m}</b> <small>m</small></div>
        <div><span className="text-gray-400">V:</span> <b>{telemetria.voltage_v}</b> <small>V</small></div>
      </div>
    </div>
  );
}