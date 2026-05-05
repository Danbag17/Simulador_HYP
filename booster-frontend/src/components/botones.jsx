// ─── Controls.jsx ────────────────────────────────────────────────
//
// TEORÍA (React III — Controlled Inputs):
//   El input de masa es un controlled input: su valor vive en useState,
//   no en el DOM. Cada tecla que pulsa el usuario llama a setMasa(),
//   React actualiza el estado, y el input se re-renderiza con el nuevo
//   valor. Esto nos permite validar el valor antes de enviarlo.
//
// TEORÍA (React III — fetch + async/await):
//   Los botones llaman a enviarComando() del archivo api/commands.js.
//   Usamos useState para gestionar estados de carga y errores.
//
// TEORÍA (React I — Eventos):
//   Cada botón tiene onClick={handler} donde handler es una función
//   que se ejecuta al hacer click (no al renderizar).
//
// BOTONES (del enunciado):
//   PRECHARGE, START (con masa), BRAKE, RESET

import { useState } from 'react'
import { useBooster } from '../context/BoosterContext.jsx'
import { enviarComando } from '../api/comandos.js'

function Controls() {
  // Controlled input para la masa del carro (necesario para START)
  // TEORÍA React III: el valor del input está controlado por este estado
  const [masa, setMasa] = useState('')

  // Estado de carga: para deshabilitar botones mientras se envía
  const [cargando, setCargando] = useState(false)

  // Mensaje de error o éxito para mostrar al usuario
  const [feedback, setFeedback] = useState(null)

  // Leemos el estado actual del simulador para habilitar/deshabilitar botones
  const { datoActual } = useBooster()
  const estado = datoActual?.state ?? 'IDLE'

  // ─── Handler genérico para enviar comandos ───────────────────────
  // TEORÍA React III — async/await:
  //   Marcamos la función como async para poder usar await dentro.
  //   Si el servidor devuelve error, lo capturamos con try/catch.
  async function manejarComando(comando) {
    setCargando(true)
    setFeedback(null)

    try {
      // Para START necesitamos validar y enviar la masa
      if (comando === 'START') {
        const masaNum = parseFloat(masa)

        // Validación del input antes de enviar (requisito del enunciado)
        if (isNaN(masaNum) || masaNum <= 0) {
          setFeedback({ tipo: 'error', texto: 'Introduce una masa válida (kg > 0)' })
          setCargando(false)
          return
        }

        await enviarComando('START', { payload: { mass: masaNum } })

      } else {
        await enviarComando(comando)
      }

      setFeedback({ tipo: 'ok', texto: `${comando} enviado` })

    } catch (error) {
      // Si el servidor devuelve 400 o falla la conexión
      setFeedback({ tipo: 'error', texto: error.message })
    }

    setCargando(false)
  }

  return (
    <div className="panel">
      <div className="panel-title">◈ control — comandos</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>

        {/* ── PRECHARGE ─────────────────────────────────────── */}
        <BotonComando
          label="PRECHARGE"
          descripcion="Inicia la precarga del sistema"
          onClick={() => manejarComando('PRECHARGE')}
          disabled={cargando || !['IDLE'].includes(estado)}
        />

        {/* ── START ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

          {/* Input controlled para la masa — React III */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-dim)',
              letterSpacing: '0.1em',
            }}>
              MASA DEL CARRO (kg)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              // value controlado por useState — React III controlled input
              value={masa}
              // onChange actualiza el estado con cada pulsación — React III
              onChange={(event) => setMasa(event.target.value)}
              placeholder="ej: 40"
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

          <BotonComando
            label="START"
            descripcion="Inicia el movimiento del carro"
            onClick={() => manejarComando('START')}
            disabled={cargando || !['READY'].includes(estado)}
            variante="success"
          />
        </div>

        {/* ── BRAKE ─────────────────────────────────────────── */}
        <BotonComando
          label="BRAKE"
          descripcion="Frena el carro"
          onClick={() => manejarComando('BRAKE')}
          disabled={cargando || !['RUNNING', 'BOOSTING'].includes(estado)}
          variante="danger"
        />

        {/* ── RESET ─────────────────────────────────────────── */}
        <BotonComando
          label="RESET"
          descripcion="Reinicia el simulador"
          onClick={() => manejarComando('RESET')}
          disabled={cargando}
        />

        {/* ── Estado actual ──────────────────────────────────── */}
        <div style={{
          marginTop: 'auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '3px',
          padding: '8px 10px',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-dim)', marginBottom: '4px' }}>
            ESTADO SIMULADOR
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--accent)' }}>
            {estado}
          </div>
        </div>

        {/* ── Feedback (error / éxito) ──────────────────────── */}
        {feedback && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            padding: '7px 10px',
            borderRadius: '3px',
            background: feedback.tipo === 'error' ? '#ff3b3b18' : '#00ff8818',
            border: `1px solid ${feedback.tipo === 'error' ? '#ff3b3b44' : '#00ff8844'}`,
            color: feedback.tipo === 'error' ? 'var(--red)' : 'var(--green)',
          }}>
            {feedback.texto}
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Componente reutilizable para botones ─────────────────────────
// TEORÍA React I — Props desestructuradas:
//   Recibe label, descripcion, onClick, disabled y variante como props.
function BotonComando({ label, descripcion, onClick, disabled, variante }) {
  const claseExtra = variante === 'danger'  ? 'btn-danger'
                   : variante === 'success' ? 'btn-success'
                   : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <button
        className={`btn ${claseExtra}`}
        onClick={onClick}
        disabled={disabled}
        style={{ width: '100%', textAlign: 'left' }}
      >
        {label}
      </button>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-dim)', paddingLeft: '2px' }}>
        {descripcion}
      </span>
    </div>
  )
}

export default Controls