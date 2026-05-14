import { useEffect, useRef } from "react";
import { useBooster } from "../context/boosterContext.jsx";

const URL_Backend = "wss://lamp-proxy-abstracts-worker.trycloudflare.com/backend/stream";
const MAX_PUNTOS = 40;
const RECONNECT_DELAY_MS = 3000;   // espera 3 s antes de reconectar
const PING_INTERVAL_MS  = 30000;   // envía un ping cada 30 s para mantener viva la conexión

export function useWebSocket() {
    const { setConectado, setTelemetria, setHistorial, setMensajes } = useBooster();

    // Usamos refs para que los closures de los handlers siempre vean los valores actuales
    const socketRef   = useRef(null);
    const pingRef     = useRef(null);
    const shouldReconnect = useRef(true);   // false solo cuando el componente se desmonta

    useEffect(() => {
        function connect() {
            if (!shouldReconnect.current) return;

            console.log("[WS] Conectando...");
            const socket = new WebSocket(URL_Backend);
            socketRef.current = socket;

            socket.onopen = () => {
                console.log("[WS] Conectado al simulador");
                setConectado(true);

                // Ping periódico: evita que Cloudflare cierre la conexión por inactividad
                // Enviamos un string vacío; el backend puede ignorarlo o responder
                pingRef.current = setInterval(() => {
                    if (socket.readyState === WebSocket.OPEN) {
                        try {
                            socket.send(JSON.stringify({ topic: "ping" }));
                        } catch (_) {
                            // si falla el send la conexión ya se cerró, onclose se encargará
                        }
                    }
                }, PING_INTERVAL_MS);
            };

            socket.onmessage = (evento) => {
                let datosNuevos;
                try {
                    datosNuevos = JSON.parse(evento.data);
                } catch {
                    return; // ignorar mensajes malformados
                }

                if (datosNuevos.topic === "data") {
                    setTelemetria(datosNuevos.payload);
                    setHistorial(prev => {
                        const nuevo = [...prev, { ...datosNuevos.payload, t: Date.now() }];
                        return nuevo.length > MAX_PUNTOS
                            ? nuevo.slice(nuevo.length - MAX_PUNTOS)
                            : nuevo;
                    });

                } else if (datosNuevos.topic === "message") {
                    const payload = datosNuevos.payload;
                    setMensajes(prev => {
                        const nuevoMensaje = { ...payload, hora: new Date().toLocaleTimeString() };
                        return [nuevoMensaje, ...prev].slice(0, 10);
                    });

                } else if (datosNuevos.topic === "pong") {
                    // el backend confirma el ping, no hace falta hacer nada
                }
            };

            socket.onclose = (event) => {
                console.warn(`[WS] Desconectado (code=${event.code}). Reconectando en ${RECONNECT_DELAY_MS / 1000}s...`);
                setConectado(false);
                clearInterval(pingRef.current);

                if (shouldReconnect.current) {
                    setTimeout(connect, RECONNECT_DELAY_MS);
                }
            };

            socket.onerror = (err) => {
                console.error("[WS] Error de conexión:", err);
                // onclose se disparará justo después, allí hacemos la reconexión
            };
        }

        shouldReconnect.current = true;
        connect();

        // Limpieza al desmontar el componente
        return () => {
            shouldReconnect.current = false;
            clearInterval(pingRef.current);
            if (socketRef.current) {
                socketRef.current.close(1000, "componente desmontado");
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
}