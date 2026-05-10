import { useBooster } from "../context/BoosterContext.jsx";

export function Mensajes() {
    const { mensajes } = useBooster();

    // Nuestro diccionario de colores
    const colores = {
        info: "text-blue-400",
        success: "text-green-400",
        error: "text-red-400",
        critical: "text-red-600 font-bold bg-red-100 p-1 rounded"
    };

    return (
        
        <div className="bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-700 w-full h-[250px] flex flex-col">
            
            <h3 className="text-gray-400 font-bold text-xs mb-3 tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                LOGS DEL SISTEMA
            </h3>
            
            {/* Contenedor donde van los textos, con scroll si hay muchos */}
            <div className="flex-1 overflow-y-auto font-mono text-xs flex flex-col gap-1.5 pr-2">
                
                {/* 2. El texto de espera (Renderizado Condicional) */}
                {(!mensajes || mensajes.length === 0) && (
                    <span className="text-gray-600 animate-pulse">Esperando eventos del simulador...</span>
                )}
                
                {/* 3. La lista de mensajes (Renderizado de Listas) */}
                {mensajes?.map((msg, index) => (
                    <div key={index} className="border-b border-gray-800 pb-1.5 mb-1">
                        <span className="text-gray-500 mr-2">[{msg.hora}]</span>
                        <span className="text-gray-400 mr-2">[{msg.type.toUpperCase()}]</span>
                        <span className={colores[msg.type] || "text-white"}>
                            {msg.content}
                        </span>
                    </div>
                ))}

            </div>
        </div>
    );
}