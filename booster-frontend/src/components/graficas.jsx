// ─── Charts.jsx ──────────────────────────────────────────────────
//
// TEORÍA (React IV — ecosistema npm):
//   Recharts es una librería externa instalada con npm.
//   La importamos y la usamos como cualquier componente React.
//   Recharts se encarga de dibujar el SVG; nosotros solo le pasamos
//   los datos y la configuración.
//
// TEORÍA (React IV — useContext):
//   Leemos `historial` del Context. Cada vez que llega un nuevo
//   paquete del WebSocket, el historial cambia, React re-renderiza
//   este componente y la gráfica se actualiza automáticamente.
//
// VARIABLES A MOSTRAR (del enunciado):
//   V (voltage_v), a (acceleration_ms2), v (velocity_kmh),
//   F = m*a (calculada aquí), I (current_a)

import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useBooster } from '../context/BoosterContext.jsx'

// Configuración de cada variable que queremos graficar
const VARIABLES = [
  { key: 'velocity_kmh',      nombre: 'v (km/h)',  color: '#00ff88' },
  { key: 'acceleration_ms2',  nombre: 'a (m/s²)',  color: '#00d4ff' },
  { key: 'voltage_v',         nombre: 'V (V)',      color: '#ffd600' },
  { key: 'current_a',         nombre: 'I (A)',      color: '#ff8c00' },
  { key: 'fuerza_n',          nombre: 'F (N)',      color: '#ff3b3b' },
]

function Charts() {
  // Leemos el historial del Context (sin props)
  const { historial } = useBooster()

  // Preparamos los datos para Recharts:
  // añadimos F = m * a a cada punto del historial
  const datos = historial.map((p, i) => ({
    ...p,
    fuerza_n: (p.mass_kg ?? 0) * (p.acceleration_ms2 ?? 0),
    i, // índice como eje X (tiempo relativo)
  }))

  return (
    <div className="panel">
      <div className="panel-title">◈ telemetría — gráficas</div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflow: 'hidden' }}>

        {/* Gráfica principal: velocidad y aceleración */}
        <GraficaLinea
          datos={datos}
          variables={[VARIABLES[0], VARIABLES[1]]}
          titulo="v · a"
        />

        {/* Gráfica eléctrica: V e I */}
        <GraficaLinea
          datos={datos}
          variables={[VARIABLES[2], VARIABLES[3]]}
          titulo="V · I"
        />

        {/* Gráfica de fuerza */}
        <GraficaLinea
          datos={datos}
          variables={[VARIABLES[4]]}
          titulo="F = m·a"
        />

      </div>
    </div>
  )
}

// ─── Componente reutilizable para una gráfica ─────────────────────
// TEORÍA (React I — Props desestructuradas):
//   Recibe datos, variables y titulo como props.
//   Esto nos permite reutilizar el mismo componente para 3 gráficas
//   distintas sin repetir código.
function GraficaLinea({ datos, variables, titulo }) {
  return (
    <div style={{ flex: 1, minHeight: 0 }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        color: 'var(--text-dim)',
        marginBottom: '2px',
        letterSpacing: '0.1em',
      }}>
        {titulo}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={datos} margin={{ top: 2, right: 8, bottom: 2, left: 0 }}>
          <XAxis dataKey="i" hide />
          <YAxis
            tick={{ fill: 'var(--text-dim)', fontSize: 9, fontFamily: 'var(--font-mono)' }}
            width={36}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '3px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-main)',
            }}
          />
          {variables.map(v => (
            <Line
              key={v.key}
              type="monotone"
              dataKey={v.key}
              stroke={v.color}
              dot={false}
              strokeWidth={1.5}
              isAnimationActive={false}  // desactivamos animación para datos en tiempo real
              name={v.nombre}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Charts