// ─── App.jsx ─────────────────────────────────────────────────────
//
// TEORÍA (React IV — Context API):
//   App es el componente raíz. Aquí usamos el hook useWebSocket para
//   obtener los datos del servidor y los metemos en el Provider del
//   Context. Así, cualquier componente dentro del Provider puede
//   leer esos datos con useBooster() sin recibir props.
//
// LAYOUT:
//   Una sola pantalla sin scroll (como recomienda el enunciado).
//   Grid de 3 columnas x 2 filas que ocupa toda la ventana.

import { BoosterContext } from './context/BoosterContext.jsx'
import { useWebSocket }   from './hooks/useWebSocket.js'

import StatusBar       from './components/StatusBar.jsx'
import Charts          from './components/Charts.jsx'
import Controls        from './components/Controls.jsx'
import Messages        from './components/Messages.jsx'
import BrakeCalculator from './components/BrakeCalculator.jsx'
import BoosterModel3D  from './components/BoosterModel3D.jsx'

function App() {
  // useWebSocket nos da los datos del servidor en tiempo real.
  // Es un custom hook (React III): encapsula toda la lógica del WebSocket.
  const { datoActual, historial, mensajes, conectado } = useWebSocket()

  // El valor del Provider es lo que todos los componentes hijos
  // podrán leer con useBooster() — exactamente como en el ejemplo
  // del PDF React IV (sección 4.1.4 Ejemplo completo)
  const valorContexto = { datoActual, historial, mensajes, conectado }

  return (
    // 2. Provider envuelve todo el árbol de componentes
    <BoosterContext.Provider value={valorContexto}>

      <div style={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr 1fr',
        gridTemplateColumns: '1fr 1fr 1fr',
        height: '100vh',
        width: '100vw',
        gap: '6px',
        padding: '6px',
        background: 'var(--bg-main)',
        overflow: 'hidden',
      }}>

        {/* ── Fila 0: barra de estado (ocupa las 3 columnas) ── */}
        <div style={{ gridColumn: '1 / -1' }}>
          <StatusBar />
        </div>

        {/* ── Fila 1 ── */}
        <Charts />          {/* col 1 */}
        <Controls />        {/* col 2 */}
        <Messages />        {/* col 3 */}

        {/* ── Fila 2 ── */}
        <BrakeCalculator /> {/* col 1 */}
        <div style={{ gridColumn: '2 / 4' }}>
          <BoosterModel3D />  {/* col 2-3 */}
        </div>

      </div>

    </BoosterContext.Provider>
  )
}

export default App