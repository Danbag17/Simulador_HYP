import { useState } from "react";

export function Calculadora() {
    const [masa, setMasa] = useState(40);
    const [distancia, setDistancia] = useState(10); // Por defecto: querer frenar a 10m del final
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState("");

    const calcularFrenado = async () => {
        setError("");
        setResultado(null);
        
        try {
            // Hacemos la petición GET pasando la masa (m) y la distancia (d)
            const res = await fetch(`http://localhost:8001/api/calculate?m=${masa}&d=${distancia}`);
            
            if (!res.ok) {
                throw new Error("Datos inválidos.");
            }
            
            const data = await res.json();
            setResultado(data.braking_position_m);

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full mt-6">
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
                        onChange={(e) => setMasa(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-32 text-center font-mono focus:outline-none focus:border-purple-500"
                    />
                </div>
                
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400">DISTANCIA META (m)</label>
                    <input 
                        type="number" 
                        value={distancia}
                        onChange={(e) => setDistancia(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-32 text-center font-mono focus:outline-none focus:border-purple-500"
                    />
                </div>

                <button 
                    onClick={calcularFrenado}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded shadow transition-colors h-[42px]"
                >
                    CALCULAR PUNTO
                </button>
            </div>

            {/* Pantalla de resultados */}
            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 min-h-[60px] flex items-center">
                {error && <span className="text-red-500 text-sm font-bold">⚠️ {error}</span>}
                
                {resultado !== null && !error && (
                    <span className="text-gray-700 text-sm font-mono flex items-center">
                        INICIAR FRENADO EN EL METRO: 
                        <b className="text-2xl text-purple-600 ml-3">{resultado.toFixed(2)} m</b>
                    </span>
                )}
                
                {resultado === null && !error && (
                    <span className="text-gray-400 text-sm italic">
                        Introduce los parámetros y pulsa calcular para obtener la posición...
                    </span>
                )}
            </div>
        </div>
    );
}