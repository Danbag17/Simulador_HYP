// ─── useWebSocket.js ─────────────────────────────────────────────
//
// TEORÍA (React III — useEffect):
//   El WebSocket es un efecto secundario: no es renderizado, es una
//   suscripción a un servidor externo. Por eso vive dentro de useEffect.
//
//   useEffect(() => { ... }, []) con array vacío se ejecuta UNA SOLA VEZ
//   al montar el componente — exactamente lo que necesitamos para abrir
//   la conexión. La función que devuelve (return) es el "cleanup": se
//   ejecuta al desmontar y cierra el WebSocket para no dejar conexiones
//   abiertas.
//
// TEORÍA (React III — useState):
//   Guardamos los datos y mensajes en useState para que React re-renderice
//   los componentes cada vez que llega un nuevo paquete del servidor.
//
// FORMATO WebSocket (del enunciado):
//   { "topic": "data",    "payload": { state, position_m, velocity_kmh, ... } }
//   { "topic": "message", "payload": { type, content } }

import { useState, useEffect } from 'react'

const WS_URL = 'ws://localhost:5001/backend/stream'

// Buffer máximo: últimos 10 segundos a 4 Hz = 40 muestras
const MAX_PUNTOS = 40

export function useWebSocket() {
  // useState: datos de telemetría actuales (último paquete recibido)
  const [datoActual, setDatoActual] = useState(null)

  // useState: historial de datos para las gráficas (array circular)
  const [historial, setHistorial] = useState([])

  // useState: lista de mensajes del servidor
  const [mensajes, setMensajes] = useState([])

  // useState: estado de la conexión WebSocket
  const [conectado, setConectado] = useState(false)

  // useEffect con [] → se ejecuta solo al montar, como dice React III
  useEffect(() => {
    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      setConectado(true)
    }

    ws.onmessage = (event) => {
      // Parseamos el JSON que llega del backend
      const json = JSON.parse(event.data)

      if (json.topic === 'data') {
        const payload = json.payload

        // Actualizamos el dato actual
        setDatoActual(payload)

        // Actualizamos el historial: añadimos el nuevo punto
        // y si supera MAX_PUNTOS, eliminamos el más antiguo (slice)
        // Usamos la forma funcional de setState (prev => ...)
        // porque necesitamos el valor anterior del array
        setHistorial(prev => {
          const nuevo = [...prev, { ...payload, t: Date.now() }]
          if (nuevo.length > MAX_PUNTOS) {
            return nuevo.slice(nuevo.length - MAX_PUNTOS)
          }
          return nuevo
        })
      }

      if (json.topic === 'message') {
        // Añadimos el mensaje al principio de la lista (más reciente arriba)
        setMensajes(prev => [
          { ...json.payload, id: Date.now() },
          ...prev.slice(0, 49) // máximo 50 mensajes
        ])
      }
    }

    ws.onclose = () => {
      setConectado(false)
    }

    ws.onerror = () => {
      setConectado(false)
    }

    // Cleanup de useEffect: cuando el componente se desmonta,
    // cerramos el WebSocket para no dejar conexiones abiertas
    return () => {
      ws.close()
    }

  }, []) // [] → solo se ejecuta una vez al montar

  // Devolvemos todo lo que los componentes pueden necesitar
  return { datoActual, historial, mensajes, conectado }
}