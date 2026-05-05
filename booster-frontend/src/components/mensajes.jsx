// ─── Messages.jsx ────────────────────────────────────────────────
//
// TEORÍA (React IV — useContext):
//   Lee `mensajes` directamente del Context con useBooster().
//
// TEORÍA (React I — .map() para renderizar listas):
//   Usamos mensajes.map() para convertir el array de mensajes en
//   elementos JSX. Cada elemento necesita una prop `key` única
//   para que React pueda identificarlos en el árbol de componentes.
//
// TIPOS DE MENSAJES (del enunciado):
//   info, critical, error, success

import { useBooster } from '../context/BoosterContext.jsx'

// Colores según el tipo de mensaje
const COLORES_TIPO = {
  info:     { color: 'var(--accent)',  bg: '#00d4ff11' },
  success:  { color: 'var(--green)',   bg: '#00ff8811' },
  critical: { color: 'var(--yellow)',  bg: '#ffd60011' },
  error:    { color: 'var(--red)',     bg: '#ff3b3b11' },
}

function Messages() {
  // Leemos mensajes del Context (sin props — React IV)
  const { mensajes } = useBooster()

  return (
    <div className="panel">
      <div className="panel-title">
        ◈ mensajes del simulador
        <span style={{ float: 'right', color: 'var(--text-dim)' }}>
          {mensajes.length}
        </span>
      </div>

      {/* Lista de mensajes con scroll interno */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>

        {mensajes.length === 0 && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-dim)',
            textAlign: 'center',
            marginTop: '20px',
          }}>
            Sin mensajes
          </div>
        )}

        {/* TEORÍA React I — .map():
            Convertimos el array de mensajes en elementos JSX.
            La prop key={m.id} es obligatoria para que React optimice
            el renderizado de la lista. */}
        {mensajes.map((m) => {
          const estilo = COLORES_TIPO[m.type] ?? COLORES_TIPO.info
          return (
            <div
              key={m.id}
              style={{
                background: estilo.bg,
                borderLeft: `2px solid ${estilo.color}`,
                borderRadius: '2px',
                padding: '5px 8px',
                flexShrink: 0,
              }}
            >
              {/* Tipo del mensaje */}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                color: estilo.color,
                letterSpacing: '0.12em',
                marginBottom: '2px',
              }}>
                {m.type?.toUpperCase()}
              </div>

              {/* Contenido del mensaje */}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-main)',
                lineHeight: 1.4,
              }}>
                {m.content}
              </div>
            </div>
          )
        })}

      </div>
    </div>
  )
}

export default Messages