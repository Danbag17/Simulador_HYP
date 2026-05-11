import { useBooster } from "../context/BoosterContext.jsx";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function Graficas() {
    const { historial } = useBooster();
    const historialSeguro = historial || [];

    const datosProcesados = historialSeguro.map(punto => {
        const masa = Number(punto.mass_kg || 0);
        const aceleracion = Number(punto.acceleration_ms2 || 0);
        return {
            ...punto,
            V: Number(punto.voltage_v || 0),
            I: Number(punto.current_a || 0),
            v: Number(punto.velocity_kmh || 0),
            a: aceleracion,
            F: masa * aceleracion,
        };
    });

    if (historialSeguro.length === 0) {
        return (
            <div className="bg-white h-full rounded-lg shadow-sm border border-gray-200 p-3 flex flex-col">
                <p className="text-gray-400 font-bold text-[10px] tracking-widest uppercase mb-2">Telemetría dinámica</p>
                <div className="flex-1 flex items-center justify-center text-gray-400 font-mono text-xs bg-gray-50 rounded border border-dashed">
                    Esperando datos...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white h-full rounded-lg shadow-sm border border-gray-200 p-3 flex flex-col gap-2">
            <div className="flex justify-between items-center flex-shrink-0">
                <p className="text-gray-400 font-bold text-[10px] tracking-widest uppercase">Telemetría dinámica</p>
                <span className="text-blue-500 text-[10px] font-mono">{historialSeguro.length} pts</span>
            </div>

            {/* Gráfica 1: v y a */}
            <div className="flex-1 min-h-0 flex flex-col">
                <p className="text-[9px] font-bold text-gray-300 tracking-widest mb-0.5">CINEMÁTICA — v · a</p>
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={datosProcesados} margin={{ top: 2, right: 4, bottom: 0, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="t" hide />
                            <YAxis stroke="#cbd5e1" tick={{ fontSize: 9 }} width={30} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                            />
                            <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '0px' }} />
                            <Line type="monotone" dataKey="v" name="v (km/h)" stroke="#22c55e" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                            <Line type="monotone" dataKey="a" name="a (m/s²)" stroke="#6366f1" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráfica 2: V, I, F */}
            <div className="flex-1 min-h-0 flex flex-col">
                <p className="text-[9px] font-bold text-gray-300 tracking-widest mb-0.5">ELÉCTRICA / FUERZA — V · I · F</p>
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={datosProcesados} margin={{ top: 2, right: 4, bottom: 0, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="t" hide />
                            <YAxis yAxisId="left" orientation="left" stroke="#cbd5e1" tick={{ fontSize: 9 }} width={30} />
                            <YAxis yAxisId="right" orientation="right" stroke="#cbd5e1" tick={{ fontSize: 9 }} width={30} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                            />
                            <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                            <Line yAxisId="left" type="monotone" dataKey="V" name="V (V)" stroke="#eab308" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                            <Line yAxisId="left" type="monotone" dataKey="I" name="I (A)" stroke="#3b82f6" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                            <Line yAxisId="right" type="monotone" dataKey="F" name="F (N)" stroke="#ef4444" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}