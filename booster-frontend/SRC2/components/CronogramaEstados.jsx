import { useBooster } from "../context/BoosterContext.jsx";

// Orden lógico y colores de cada estado — igual que en Status.jsx
const ESTADOS_CONFIG = {
    IDLE:      { color: '#94a3b8', label: 'IDLE' },
    PRECHARGE: { color: '#eab308', label: 'PRECHARGE' },
    READY:     { color: '#22d3ee', label: 'READY' },
    RUNNING:   { color: '#22c55e', label: 'RUNNING' },
    BOOSTING:  { color: '#f97316', label: 'BOOSTING' },
    BRAKING:   { color: '#ef4444', label: 'BRAKING' },
    STOPPED:   { color: '#94a3b8', label: 'STOPPED' },
};

export function CronogramaEstados() {
    const { historial } = useBooster();
    const historialSeguro = historial || [];

    // Construimos la secuencia de transiciones de estado a partir del historial
    // Solo guardamos un punto por estado (cuando cambia)
    const transiciones = [];
    for (let i = 0; i < historialSeguro.length; i++) {
        const estado = historialSeguro[i].state;
        if (i === 0 || estado !== historialSeguro[i - 1].state) {
            transiciones.push({ estado, t: historialSeguro[i].t, idx: i });
        }
    }

    // Estado actual
    const estadoActual = historialSeguro.length > 0
        ? historialSeguro[historialSeguro.length - 1].state
        : 'IDLE';

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full mb-4">
            <h3 className="text-gray-400 font-bold text-xs mb-3 tracking-widest uppercase">
                Cronograma de estados
            </h3>

            {/* Barra de progreso de estados */}
            <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
                {Object.entries(ESTADOS_CONFIG).map(([key, cfg], i) => {
                    const esActual = key === estadoActual;
                    const fuePasado = transiciones.some(t => t.estado === key);
                    return (
                        <div key={key} className="flex items-center gap-1 flex-shrink-0">
                            <div
                                style={{
                                    background: fuePasado || esActual ? cfg.color : '#e2e8f0',
                                    border: esActual ? `2px solid ${cfg.color}` : '2px solid transparent',
                                    boxShadow: esActual ? `0 0 8px ${cfg.color}88` : 'none',
                                    opacity: fuePasado || esActual ? 1 : 0.35,
                                }}
                                className="px-2 py-1 rounded text-[10px] font-bold text-white transition-all"
                            >
                                {cfg.label}
                            </div>
                            {i < Object.keys(ESTADOS_CONFIG).length - 1 && (
                                <span className="text-gray-300 text-xs">→</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Log de transiciones ocurridas */}
            <div className="font-mono text-[11px] space-y-1 max-h-[80px] overflow-y-auto">
                {transiciones.length === 0 && (
                    <span className="text-gray-400">Sin transiciones registradas...</span>
                )}
                {transiciones.map((t, i) => {
                    const cfg = ESTADOS_CONFIG[t.estado] || ESTADOS_CONFIG.IDLE;
                    const hora = t.t ? new Date(t.t).toLocaleTimeString() : '--:--:--';
                    return (
                        <div key={i} className="flex items-center gap-2">
                            <span className="text-gray-400">{hora}</span>
                            <span
                                className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                                style={{ background: cfg.color }}
                            >
                                {t.estado}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}