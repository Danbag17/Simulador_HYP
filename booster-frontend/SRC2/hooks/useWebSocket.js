import { useEffect  } from "react";
import { useBooster } from "../context/boosterContext.jsx";

//const URL_Backend = "ws://localhost:5001/backend/stream";
const URL_Backend = "wss://circumstances-invention-warned-reproduction.trycloudflare.com";

const MAX_PUNTOS = 40

export function useWebSocket() {
    
    
      // estado de la conexión WebSocket
          
    
    const { setConectado ,setTelemetria  , setHistorial , setMensajes} = useBooster();

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
                    const nuevo = [...prev, { ...datosNuevos.payload, t: Date.now() }]
                    if (nuevo.length > MAX_PUNTOS) {
                        return nuevo.slice(nuevo.length - MAX_PUNTOS)
                    }
                    return nuevo
                    })
                
            }else if (datosNuevos.topic === "message") {
                const payload = datosNuevos.payload;
                
                setMensajes(prev => {
                    // Le añadimos la hora exacta al mensaje
                    const nuevoMensaje = { ...payload, hora: new Date().toLocaleTimeString() };
                    // Lo ponemos el primero de la lista
                    const nuevaLista = [nuevoMensaje, ...prev];
                    
                    // Nos quedamos solo con los 10 últimos para que no explote la web
                    return nuevaLista.slice(0, 10); 
                });
            }
        }

          socket.onclose = () => {
             setConectado(false)
            console.log(" Desconectado del simulador");
        }

        socket.onerror = () => {
            setConectado(false)
            console.error("Error en la conexión WebSocket");
        }

        return () => {
            socket.close();
            console.log(" Desconectado del simulador");
        };

    }, []); 
}