import { useBooster } from "../context/BoosterContext.jsx";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function Graficas() {
    const { historial } = useBooster();
    const historialSeguro = historial || [];

    // Aplicamos la 2ª LEY DE NEWTON (F = m * a) [cite: 95]
    const datosProcesados = historialSeguro.map(punto => {
        const masa = Number(punto.mass_kg || 0);
        const aceleracion = Number(punto.acceleration_ms2 || 0);
        
        return {
            ...punto,
            V: Number(punto.voltage_v || 0),
            I: Number(punto.current_a || 0),
            F: masa * aceleracion // Cálculo manual requerido por el PDF [cite: 95]
        };
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full mb-6">
            <h3 className="text-gray-400 font-bold text-xs mb-4 tracking-widest flex justify-between uppercase">
                <span>Telemetría Dinámica (V, I, F)</span>
                <span className="text-blue-500">Puntos: {historialSeguro.length}</span>
            </h3>
            
            {/* CAMBIO CLAVE: Usamos style={{ height: '300px' }} 
               Esto obliga a la gráfica a ocupar espacio sí o sí.
            */}
            <div style={{ width: '100%', height: '300px' }}>
                {historialSeguro.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-gray-400 font-mono bg-gray-50 rounded border border-dashed">
                        Esperando datos del flujo...
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={datosProcesados}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee"/>
                            <XAxis dataKey="t" hide />
                            
                            {/* Eje izquierdo: Voltaje e Intensidad [cite: 130, 131] */}
                            <YAxis yAxisId="left" orientation="left" stroke="#94a3b8" />
                            
                            {/* Eje derecho: Fuerza (N) [cite: 95] */}
                            <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                            
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
                )}
            </div>
        </div>
    );
}