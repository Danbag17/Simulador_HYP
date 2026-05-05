// ─── BrakeCalculator.jsx ─────────────────────────────────────────
//
// TEORÍA (React III — Controlled Inputs + fetch GET + async/await):
//   Dos inputs controlados (masa y distancia deseada) cuyos valores
//   viven en useState. Al hacer submit, llamamos a calcularFrenada()
//   del archivo api/commands.js con async/await.
//
// TEORÍA (React I — Eventos de formulario):
//   onSubmit del form llama a manejarCalculo. Usamos
//   event.preventDefault() para que el navegador no recargue la página
//   (comportamiento por defecto de los formularios HTML).
//
// ENDPOINT (del enunciado):
//   GET /api/calculate?m=<masa>&d=<distancia>
//   Respuesta: { braking_position_m: 37.5 }

import { useState } from 'react'
import { calcularFrenada } from '../api/comandos.js'

function BrakeCalculator() {
  // Controlled inputs — React III
  const [masa, setMasa]       = useState('')
  const [distancia, setDistancia] = useState('')

  // Resultado de la API
  const [resultado, setResultado] = useState(null)

  // Estado de carga y error
  const [cargando, setCargando] = useState(false)
  const [error, setError]       = useState(null)

  // Handler del formulario — async/await (React III)
  async function manejarCalculo(event) {
    // Evita que el form recargue la página
    event.preventDefault()

    // Validación de inputs antes de enviar (requisito del enunciado)
    const masaNum = parseFloat(masa)
    const distNum = parseFloat(distancia)

    if (isNaN(masaNum) || masaNum <= 0) {
      setError('La masa debe ser un número positivo')
      return
    }
    if (isNaN(distNum) || distNum <= 0) {
      setError('La distancia debe ser un número positivo')
      return
    }

    setCargando(true)
    setError(null)
    setResultado(null)

    try {
      // Llamada GET al backend — async/await (React III)
      const datos = await calcularFrenada(masaNum, distNum)
      setResultado(datos.braking_position_m)
    } catch (err) {
      setError(err.message)
    }

    setCargando(false)
  }

  return (
    <div className="panel">
      <div className="panel-title">◈ calculadora de frenada óptima</div>

      <form
        onSubmit={manejarCalculo}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}
      >

        {/* ── Input masa ─────────────────────────────────────── */}
        <CampoControlado
          label="MASA DEL VEHÍCULO (kg)"
          tipo="number"
          valor={masa}
          onChange={(e) => setMasa(e.target.value)}
          placeholder="ej: 40"
        />

        {/* ── Input distancia deseada ────────────────────────── */}
        <CampoControlado
          label="DISTANCIA AL FINAL DESEADA (m)"
          tipo="number"
          valor={distancia}
          onChange={(e) => setDistancia(e.target.value)}
          placeholder="ej: 5"
        />

        {/* ── Botón submit ────────────────────────────────────── */}
        <button
          type="submit"
          className="btn btn-success"
          disabled={cargando}
          style={{ width: '100%' }}
        >
          {cargando ? 'CALCULANDO...' : 'CALCULAR POSICIÓN DE FRENADA'}
        </button>

        {/* ── Resultado ──────────────────────────────────────── */}
        {resultado !== null && (
          <div style={{
            background: '#00ff8811',
            border: '1px solid #00ff8844',
            borderRadius: '3px',
            padding: '12px',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-dim)',
              letterSpacing: '0.15em',
              marginBottom: '4px',
            }}>
              FRENAR EN LA POSICIÓN
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '28px',
              color: 'var(--green)',
              fontWeight: 700,
            }}>
              {resultado.toFixed(2)} <span style={{ fontSize: '14px' }}>m</span>
            </div>
          </div>
        )}

        {/* ── Error ─────────────────────────────────────────── */}
        {error && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--red)',
            background: '#ff3b3b11',
            border: '1px solid #ff3b3b33',
            borderRadius: '3px',
            padding: '8px',
          }}>
            {error}
          </div>
        )}

      </form>
    </div>
  )
}

// ─── Campo de formulario reutilizable ────────────────────────────
// TEORÍA React I — Props: recibe label, tipo, valor, onChange, placeholder
function CampoControlado({ label, tipo, valor, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--text-dim)',
        letterSpacing: '0.1em',
      }}>
        {label}
      </label>
      <input
        type={tipo}
        min="0"
        step="0.1"
        value={valor}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '3px',
          color: 'var(--text-main)',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          padding: '7px 10px',
          outline: 'none',
          width: '100%',
        }}
      />
    </div>
  )
}

export default BrakeCalculator