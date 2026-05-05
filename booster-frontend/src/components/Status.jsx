// ─── StatusBar.jsx ───────────────────────────────────────────────
//
// TEORÍA (React IV — useContext):
//   Lee el estado actual del simulador desde el Context con useBooster().
//   No necesita recibir props: coge los datos directamente del Provider
//   que está en App.jsx.
//
// TEORÍA (React I — JSX + lógica en componentes):
//   Calculamos F = m * a directamente en el componente usando los
//   datos del Context (2ª Ley de Newton, como pide el enunciado).

import { useBooster } from '../context/BoosterContext.jsx'

// Colores por estado (para resaltar visualmente como recomienda el enunciado)
const COLORES_ESTADO = {
  IDLE:      { color: '#5a7a96',  bg: '#5a7a9622' },
  PRECHARGE: { color: '#ffd600',  bg: '#ffd60022' },
  READY:     { color: '#00d4ff',  bg: '#00d4ff22' },
  RUNNING:   { color: '#00ff88',  bg: '#00ff8822' },
  BOOSTING:  { color: '#ff8c00',  bg: '#ff8c0022' },
  BRAKING:   { color: '#ff3b3b',  bg: '#ff3b3b22' },
  STOPPED:   { color: '#5a7a96',  bg: '#5a7a9622' },
}

function StatusBar() {
  // 3. Consumir el contexto — useBooster() internamente llama a useContext(BoosterContext)
  const { datoActual, conectado } = useBooster()

  const estado = datoActual?.state ?? 'IDLE'
  const estilo = COLORES_ESTADO[estado] ?? COLORES_ESTADO.IDLE

  // F = m * a (2ª Ley de Newton) — calculada en el frontend como pide el enunciado
  const masa  = datoActual?.mass_kg ?? 0
  const acel  = datoActual?.acceleration_ms2 ?? 0
  const fuerza = (masa * acel).toFixed(1)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      background: 'var(--bg-panel)',
      border: '1px solid var(--border)',
      borderRadius: '4px',
      padding: '6px 16px',
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
    }}>

      {/* Logo / título */}
      <span style={{ color: 'var(--accent)', letterSpacing: '0.2em', fontWeight: 700, fontSize: '13px' }}>
        HYPERLOOP UPV
      </span>

      <span style={{ color: 'var(--border)', fontSize: '20px', lineHeight: 1 }}>│</span>

      {/* Estado actual con color dinámico */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: estilo.bg,
        border: `1px solid ${estilo.color}44`,
        borderRadius: '3px',
        padding: '3px 10px',
      }}>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: estilo.color,
          boxShadow: `0 0 6px ${estilo.color}`,
        }} />
        <span style={{ color: estilo.color, letterSpacing: '0.15em' }}>{estado}</span>
      </div>

      <span style={{ color: 'var(--border)', fontSize: '20px', lineHeight: 1 }}>│</span>

      {/* Variables rápidas en la barra superior */}
      <MetricaInline label="s"  valor={datoActual?.position_m?.toFixed(2)    ?? '—'} unidad="m"    />
      <MetricaInline label="v"  valor={datoActual?.velocity_kmh?.toFixed(1)  ?? '—'} unidad="km/h" />
      <MetricaInline label="a"  valor={datoActual?.acceleration_ms2?.toFixed(2) ?? '—'} unidad="m/s²" />
      <MetricaInline label="V"  valor={datoActual?.voltage_v?.toFixed(0)     ?? '—'} unidad="V"    />
      <MetricaInline label="I"  valor={datoActual?.current_a?.toFixed(1)     ?? '—'} unidad="A"    />
      <MetricaInline label="F"  valor={fuerza}                                        unidad="N"    color="var(--yellow)" />

      {/* Indicador de conexión WebSocket */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: conectado ? 'var(--green)' : 'var(--red)',
          boxShadow: conectado ? '0 0 6px var(--green)' : '0 0 6px var(--red)',
        }} />
        <span style={{ color: conectado ? 'var(--green)' : 'var(--red)', fontSize: '10px' }}>
          {conectado ? 'WS CONECTADO' : 'WS DESCONECTADO'}
        </span>
      </div>
    </div>
  )
}

// Componente pequeño reutilizable para mostrar una métrica
// TEORÍA (React I — Props): recibe label, valor, unidad y color como props
function MetricaInline({ label, valor, unidad, color = 'var(--text-main)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
      <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}>{label}</span>
      <span style={{ color, fontSize: '13px' }}>{valor}</span>
      <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}>{unidad}</span>
    </div>
  )
}

export default StatusBar