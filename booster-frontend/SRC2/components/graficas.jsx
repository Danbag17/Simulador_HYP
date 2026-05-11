import { useBooster } from "../context/BoosterContext.jsx";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function Graficas() {
    const { historial } = useBooster();
    const historialSeguro = historial || [];
     // F = m * a 
    const datosProcesados = historialSeguro.map(punto => {
        const masa = Number(punto.mass_kg || 0);
        const aceleracion = Number(punto.acceleration_ms2 || 0);
        
        return {
            ...punto,
            V: Number(punto.voltage_v || 0),
            I: Number(punto.current_a || 0),
            F: masa * aceleracion,
            v: Number(punto.velocity_kmh || 0),
            a: aceleracion,
        };
    });


     if (historialSeguro.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full mb-6">
                <h3 className="text-gray-400 font-bold text-xs mb-4 tracking-widest uppercase">
                    Telemetría dinámica
                </h3>
                <div className="flex h-[200px] items-center justify-center text-gray-400 font-mono bg-gray-50 rounded border border-dashed">
                    Esperando datos del flujo...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full mb-6">
            <h3 className="text-gray-400 font-bold text-xs mb-4 tracking-widest flex justify-between uppercase">
                <span>Telemetría dinámica</span>
                <span className="text-blue-500">Puntos: {historialSeguro.length}</span>
            </h3>
 
            {/* Gráfica 1: velocidad y aceleración — AÑADIDAS según requisito del enunciado */}
            <p className="text-[10px] font-bold text-gray-400 mb-1 tracking-widest">CINEMÁTICA — v (km/h) · a (m/s²)</p>
            <div style={{ width: '100%', height: '160px' }} className="mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={datosProcesados}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="t" hide />
                        <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Legend verticalAlign="top" align="right" />
                        <Line type="monotone" dataKey="v" name="Velocidad (km/h)" stroke="#22c55e" strokeWidth={2} dot={false} isAnimationActive={false} />
                        <Line type="monotone" dataKey="a" name="Aceleración (m/s²)" stroke="#6366f1" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
 
            {/* Gráfica 2: eléctrica V, I y fuerza F */}
            <p className="text-[10px] font-bold text-gray-400 mb-1 tracking-widest">ELÉCTRICA / FUERZA — V (V) · I (A) · F (N)</p>
            <div style={{ width: '100%', height: '160px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={datosProcesados}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="t" hide />
                        <YAxis yAxisId="left" orientation="left" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Legend verticalAlign="top" align="right" />
                        <Line yAxisId="left" type="monotone" dataKey="V" name="Voltaje (V)" stroke="#eab308" strokeWidth={2} dot={false} isAnimationActive={false} />
                        <Line yAxisId="left" type="monotone" dataKey="I" name="Intensidad (A)" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                        <Line yAxisId="right" type="monotone" dataKey="F" name="Fuerza (N)" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}