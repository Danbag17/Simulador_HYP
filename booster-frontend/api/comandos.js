// ─── commands.js ─────────────────────────────────────────────────
//
// TEORÍA (React III — fetch + async/await):
//   fetch() hace peticiones HTTP. async/await hace el código más legible
//   que las cadenas .then(). Si el servidor devuelve 400, lanzamos un
//   error para que el componente pueda mostrarlo al usuario.
//
// ENDPOINTS (del enunciado):
//   POST http://localhost:8001/api/command  → enviar ordenes
//   GET  http://localhost:8001/api/calculate?m=X&d=Y → calcular frenada

const BASE_URL = 'http://localhost:8001'

// Envía una orden al backend (PRECHARGE, START, BRAKE, RESET)
// Para START hay que incluir { mass: número }
export async function enviarComando(comando, payload = {}) {
  const body = { command: comando, ...payload }

  const respuesta = await fetch(`${BASE_URL}/api/command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!respuesta.ok) {
    // 400 Bad Request → el comando no es válido en este momento
    throw new Error(`Error ${respuesta.status}: comando rechazado`)
  }

  return respuesta
}

// Calcula la posición óptima de frenada
// m = masa del carro (kg), d = distancia deseada al final (m)
export async function calcularFrenada(m, d) {
  const url = `${BASE_URL}/api/calculate?m=${m}&d=${d}`

  const respuesta = await fetch(url)

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}: no se pudo calcular`)
  }

  // Devuelve { braking_position_m: 37.5 }
  const datos = await respuesta.json()
  return datos
}