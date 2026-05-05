// ─── BoosterContext.jsx ───────────────────────────────────────────
//
// TEORÍA (React IV — Context API):
//   createContext() crea un "contenedor" de información compartida.
//   El Provider envuelve todos los componentes que necesitan acceder
//   a esa información. Cualquier componente dentro puede leerla con
//   useContext() sin necesidad de pasar props manualmente (prop drilling).
//
// AQUÍ:
//   Guardamos los datos del WebSocket (telemetría + mensajes) y
//   el estado actual de la simulación para que Charts, Messages y
//   BoosterModel puedan leerlos directamente.

import { createContext, useContext } from 'react'

// 1. Crear el contexto — equivalente al "createContext()" del PDF React IV
export const BoosterContext = createContext(null)

// 2. Hook de conveniencia para consumir el contexto.
//    En lugar de escribir useContext(BoosterContext) en cada componente,
//    exportamos este helper: const { datos } = useBooster()
export function useBooster() {
  return useContext(BoosterContext)
}