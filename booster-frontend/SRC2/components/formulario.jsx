import { useState } from "react";

export function Calculadora() {
    const [masa, setMasa] = useState(40);
    const [distancia, setDistancia] = useState(10);
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const calcularFrenado = async () => {
        setError("");
        setResultado(null);

        const masaNum = parseFloat(masa);
        const distanciaNum = parseFloat(distancia);

        if (isNaN(masaNum) || masaNum <= 0) {
            setError("La masa debe ser un número positivo (kg > 0).");
            return;
        }
        if (isNaN(distanciaNum) || distanciaNum <= 0) {
            setError("La distancia debe ser un número positivo (m > 0).");
            return;
        }

        setCargando(true);

        try {
            const res = await fetch(`http://localhost:8001/api/calculate?m=${masaNum}&d=${distanciaNum}`);

            if (!res.ok) {
        
                if (res.status === 400) {
                    setError("Parámetros inválidos: la posición de frenada calculada sería negativa. Reduce la distancia o la masa.");
                } else {
                    setError(`Error del servidor (${res.status}). Comprueba que el backend está activo.`);
                }
                return;
            }

            const data = await res.json();
            setResultado(data.braking_position_m);

        } catch (err) {
            err.message = "No se pudo conectar con el backend. Comprueba que está en marcha en el puerto 8001.";    
            setError("No se pudo conectar con el backend. Comprueba que está en marcha en el puerto 8001.");
        } finally {
            setCargando(false);
        }
    };

    return (
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 w-full">
            <h3 className="text-gray-400 font-bold text-xs mb-4 tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                CALCULADORA DE FRENADO ÓPTIMO
            </h3>

            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400">MASA DEL CARRO (kg)</label>
                    <input
                        type="number"
                        value={masa}
                        min="0.1"
                        step="0.1"
                        onChange={(e) => setMasa(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-32 text-center font-mono focus:outline-none focus:border-purple-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400">DISTANCIA META (m)</label>
                    <input
                        type="number"
                        value={distancia}
                        min="0.1"
                        step="0.1"
                        onChange={(e) => setDistancia(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-32 text-center font-mono focus:outline-none focus:border-purple-500"
                    />
                </div>

                <button
                    onClick={calcularFrenado}
                    disabled={cargando}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded shadow transition-colors h-[42px]"
                >
                    {cargando ? 'CALCULANDO...' : 'CALCULAR PUNTO'}
                </button>
            </div>

            
            {error && (
                <div className="mt-4 px-4 py-3 rounded-lg text-sm font-mono border bg-red-50 border-red-200 text-red-700">
                    {error}
                </div>
            )}

            {resultado !== null && !error && (
                <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 flex items-center">
                    <span className="text-gray-700 text-sm font-mono">
                        INICIAR FRENADO EN EL METRO:
                        <b className="text-2xl text-purple-600 ml-3">{resultado.toFixed(2)} m</b>
                    </span>
                </div>
            )}

            {resultado === null && !error && !cargando && (
                <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 min-h-[60px] flex items-center">
                    <span className="text-gray-400 text-sm italic">
                        Introduce los parámetros y pulsa calcular para obtener la posición...
                    </span>
                </div>
            )}
        </div>
    );
}