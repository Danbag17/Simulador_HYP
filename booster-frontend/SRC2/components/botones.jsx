import { useState } from "react";
import { useBooster } from "../context/BoosterContext";

export function Botones() {
    // 1. Estado para guardar la masa que escriba el usuario (por defecto 40kg)
    const [masa, setMasa] = useState(40); 
    const [feedback, setFeedback] = useState(null);

    const { telemetria } = useBooster();
    const estado = telemetria?.state ?? 'IDLE';

    const enviarComando = async (comando) => { 

             if (comando === "START") {
                const masaNum = parseFloat(masa);
                if (isNaN(masaNum) || masaNum <= 0) {
                    setFeedback({ tipo: 'error', texto: 'La masa debe ser un número mayor que 0.' });
                    return;
            }

           setFeedback(null); // Limpiamos feedback previo

           try {
            const bodyData = { command: comando };
             if (comando === "START") {
                bodyData.payload = { mass: Number(masa) };
            }
            const respuesta = await fetch("http://localhost:8001/api/command", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData)
            });

            if (respuesta.ok) {
                setFeedback({ tipo: 'ok', texto: `Orden [${comando}] aceptada por el simulador` });
            } else {
                    let textoDeError = "";

                if (respuesta.status === 400) {
                    textoDeError = `Comando ${comando} no permitido en el estado actual (${estado}).`;
                } else {
                    textoDeError = `Error ${respuesta.status}: no se pudo procesar la orden.`;
                }

                setFeedback({ tipo: 'error', texto: textoDeError });
            }
                   

            
            
        } catch (error) {
            setFeedback({ tipo: 'error', texto: "Error de conexión con el simulador" });    
            console.error(" Error de conexión", error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-fit">
            <h3 className="text-gray-400 font-bold text-xs mb-4 tracking-widest">SECUENCIA DE ENCENDIDO</h3>
            
            <div className="flex gap-4 items-end">
                
                {/* 1. Botón PRECHARGE (Amarillo) */}
                <button 
                    onClick={() => enviarComando("PRECHARGE")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg shadow transition-colors"
                >
                    1. PRECHARGE
                </button>

                {/* Input de Masa */}
                <div className="flex flex-col gap-1 mx-2">
                    <label className="text-[10px] font-bold text-gray-400">MASA (kg)</label>
                    <input 
                        type="number" 
                        value={masa}
                        min="0.1"
                        step="0.1"
                        onChange={(e) => setMasa(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-3 w-20 text-center font-mono font-bold text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* 2. Botón START (Verde) */}
                <button 
                    onClick={() => enviarComando("START")}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow transition-colors"
                >
                    2. START
                </button>

                {/* 3. Botón BRAKE (Rojo) */}
                <button 
                    onClick={() => enviarComando("BRAKE")}
                    className="bg-red-600 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg shadow transition-colors"
                >
                    3. BRAKE
                </button>

                 {/* Botón RESET (Gris) */}
                 <button 
                    onClick={() => enviarComando("RESET")}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow transition-colors"
                >
                    RESET
                </button>

            </div>
            {feedback && (
                <div className={`mt-4 px-4 py-3 rounded-lg text-sm font-mono font-bold border ${
                    feedback.tipo === 'error'
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-green-50 border-green-200 text-green-700'
                }`}>
                    {feedback.tipo === 'error' ? '⚠️ ' : '✓ '}{feedback.texto}
                </div>
            )}
        </div>
    );
}