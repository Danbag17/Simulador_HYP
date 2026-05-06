import { useEffect } from "react";
import { useBooster } from "../context/BoosterContext.jsx";

const URL_Backend = "ws://localhost:5001";

export function useWebSocket() {
    
    const { setTelemetria } = useBooster();

    useEffect(() => {
        
        const socket = new WebSocket(URL_Backend);

        socket.onopen = () => {
            console.log(" Conectado al simulador ");
        };

        socket.onmessage = (evento) => {
            const datosNuevos = JSON.parse(evento.data);
            setTelemetria(datosNuevos);
        };

        return () => {
            socket.close();
            console.log(" Desconectado del simulador");
        };

    }, []); 
}