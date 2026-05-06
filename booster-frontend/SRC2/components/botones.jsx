import { useBooster } from "../context/BoosterContext.jsx";

export function Controles() {
    const { telemetria } = useBooster();

    // 3. Esta función enviará la orden al backend
    const enviarComando = async (comando) => {
        try {
            const respuesta = await fetch("http://localhost:8001", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ command: comando })
            });
            console.log("Orden enviada:", comando);
            
        } catch (error) {
            console.error("Error al enviar comando:", error);
        }
    };

    return (
        <div className="flex gap-4 mt-6 p-4 bg-gray-100 rounded-lg shadow-md w-fit">
            
            {/* Botón START (Verde) */}
            <button 
                onClick={() => enviarComando("START")}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow transition-colors"
            >
                START
            </button>

            {/* Botón STOP (Naranja/Amarillo) */}
            <button 
                onClick={() => enviarComando("STOP")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow transition-colors"
            >
                STOP
            </button>

            {/* Botón EMERGENCY (Rojo) */}
            <button 
                onClick={() => enviarComando("EMERGENCY")}
                className="bg-red-600 hover:bg-red-800 text-white font-bold py-3 px-8 rounded-lg shadow transition-colors"
            >
                EMERGENCY
            </button>

        </div>
    );

}