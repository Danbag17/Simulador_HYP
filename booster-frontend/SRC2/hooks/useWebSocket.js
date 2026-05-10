import { useEffect , useState } from "react";
import { useBooster } from "../context/BoosterContext.jsx";

const URL_Backend = "ws://localhost:5001/backend/stream";

export function useWebSocket() {
    
    
      // estado de la conexión WebSocket
      const [conectado, setConectado] = useState(false)
    
    
    const { setTelemetria , setDatoActual , setHistorial } = useBooster();

    useEffect(() => {
        
        const socket = new WebSocket(URL_Backend);

        socket.onopen = () => {
            console.log(" Conectado al simulador ");
            setConectado(true);
        };

        socket.onmessage = (evento) => {
            const datosNuevos = JSON.parse(evento.data);
            if(datosNuevos.topic == "data"){
                console.log("Datos recibidos:", datosNuevos);
                 setTelemetria(datosNuevos.payload);


                setHistorial(prev => {
                    const nuevo = [...prev, { ...payload, t: Date.now() }]
                    if (nuevo.length > MAX_PUNTOS) {
                        return nuevo.slice(nuevo.length - MAX_PUNTOS)
                    }
                    return nuevo
                    })
                
            };

          ws.onclose = () => {
             setConectado(false)
            console.log(" Desconectado del simulador");
        }

        ws.onerror = () => {
            setConectado(false)
            console.error("Error en la conexión WebSocket");
        }

        return () => {
            socket.close();
            console.log(" Desconectado del simulador");
        };

    }, []); 
}