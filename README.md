# 🚀 Hyperloop UPV — Booster Control Frontend

Panel de control en tiempo real para el sistema de propulsión (booster) del proyecto Hyperloop UPV. Esta aplicación web visualiza la telemetría del prototipo, permite enviar comandos al simulador y calcula puntos óptimos de frenado.

---

## 📋 Tabla de contenidos

- [Descripción general](#descripción-general)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)
- [Arquitectura y flujo de datos](#arquitectura-y-flujo-de-datos)
- [Componentes](#componentes)
- [Contexto global (BoosterContext)](#contexto-global-boostercontext)
- [Hook WebSocket](#hook-websocket)
- [API REST del backend](#api-rest-del-backend)
- [Requisitos del backend](#requisitos-del-backend)

---

## Descripción general

La aplicación es un **dashboard de telemetría** que se conecta en tiempo real a un simulador mediante WebSocket. Muestra el estado del booster, gráficas dinámicas de velocidad, aceleración, voltaje, corriente y fuerza; permite controlar el ciclo de vida del sistema (PRECHARGE → START → BRAKE → RESET), calcula la posición óptima de frenado y renderiza un modelo 3D del prototipo.

---

## Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18.3.1 | Framework UI |
| Vite | 5.4.x | Bundler y servidor de desarrollo |
| Tailwind CSS | 3.4.x | Estilos utilitarios |
| Recharts | 2.15.x | Gráficas de telemetría |
| Three.js | 0.166.x | Motor 3D |
| @react-three/fiber | 8.18.x | Binding React para Three.js |
| @react-three/drei | 9.122.x | Helpers 3D (Stage, OrbitControls, useGLTF) |
| WebSocket API | nativa | Comunicación en tiempo real con el simulador |

---

## Estructura del proyecto

```
booster-frontend/
├── index.html                        # HTML raíz — carga la fuentes y monta #root
├── package.json
├── vite.config.js                    # Configuración de Vite
├── Tailwind.config.js                # Configuración de Tailwind (apunta a SRC2/**)
├── Postcss.config.js
└── SRC2/
    ├── main.jsx                      # Punto de entrada — monta BoosterProvider + App
    ├── App.jsx                       # Layout principal de la aplicación
    ├── index.css                     # Directivas de Tailwind (@tailwind base/components/utilities)
    ├── App.css                       # CSS adicional (vacío por defecto)
    ├── context/
    │   └── BoosterContext.jsx        # Estado global compartido (Context API)
    ├── hooks/
    │   └── useWebSocket.js           # Hook que gestiona la conexión WebSocket
    └── components/
        ├── Status.jsx                # Barra de estado: estado actual + v / s / V
        ├── CronogramaEstados.jsx     # Línea de tiempo de estados del booster
        ├── graficas.jsx              # Gráficas de cinemática y electricidad (Recharts)
        ├── mensajes.jsx              # Log de eventos del sistema (terminal-style)
        ├── botones.jsx               # Panel de comandos con input de masa
        ├── formulario.jsx            # Calculadora de punto óptimo de frenado
        └── modelo3D.jsx              # Visor 3D del prototipo (.glb via Three.js)
```

---

## Instalación y puesta en marcha

### Prerrequisitos

- Node.js ≥ 18
- npm ≥ 8
- El backend/simulador corriendo (ver [Requisitos del backend](#requisitos-del-backend))
- Fichero del modelo 3D en `public/modelo/Ensamblaje_Provisional_sinLetras.glb`

### Pasos

```bash
# 1. Clonar el repositorio y entrar en la carpeta del frontend
cd booster-frontend

# 2. Instalar dependencias
npm install

# 3. Arrancar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (puerto por defecto de Vite).

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Compilación para producción en `/dist` |
| `npm run preview` | Previsualizar el build de producción |

---

## Arquitectura y flujo de datos

```
Simulador (backend)
      │
      │  WebSocket ws://localhost:5001/backend/stream
      │  → topic: "data"    → telemetría en tiempo real
      │  → topic: "message" → logs y eventos del sistema
      ▼
useWebSocket (hook)
      │
      │  actualiza Context (setTelemetria, setHistorial, setMensajes, setConectado)
      ▼
BoosterContext (estado global)
      │
      ├── telemetria   → Status, CronogramaEstados
      ├── historial    → Graficas, CronogramaEstados
      └── mensajes     → Mensajes

Botones / Calculadora
      │
      │  HTTP POST  http://localhost:8001/api/command
      │  HTTP GET   http://localhost:8001/api/calculate
      ▼
Backend REST (puerto 8001)
```

Los datos fluyen en **una sola dirección**: el simulador emite eventos → el hook los procesa → el Context los distribuye → los componentes reaccionan de forma reactiva sin necesidad de prop drilling.

---

## Componentes

### `App.jsx` — Layout principal

Punto de entrada visual. Llama a `useWebSocket()` para iniciar la conexión y organiza el layout en tres zonas:

- **Header** — título de la aplicación + `<Status />`
- **Franja superior** — `<CronogramaEstados />`
- **Cuerpo (grid 2 columnas)**
  - Izquierda: `<Graficas />` + `<Mensajes />`
  - Derecha: `<Botones />` + `<Calculadora />` + `<Modelo3D />`

---

### `Status.jsx` — Barra de estado

Muestra en tiempo real el **estado actual del booster** (IDLE / RUNNING / BRAKING) con código de color, junto con los valores instantáneos de:

- `velocity_kmh` — velocidad en km/h
- `position_m` — posición en metros
- `voltage_v` — voltaje en V

Los colores cambian dinámicamente según el estado: gris (IDLE), verde (RUNNING), rojo (BRAKING).

---

### `CronogramaEstados.jsx` — Línea de tiempo de estados

Visualiza la **secuencia de estados** por los que ha pasado el booster durante la sesión. Los estados posibles son:

`IDLE` → `PRECHARGE` → `READY` → `RUNNING` → `BOOSTING` → `BRAKING` → `STOPPED`

Cada estado se ilumina con su color cuando ha sido visitado. El estado activo tiene un contorno resaltado. También muestra la hora de la última transición registrada.

---

### `graficas.jsx` — Gráficas de telemetría

Renderiza dos gráficas de líneas en tiempo real con los últimos 40 puntos de datos:

**Gráfica 1 — Cinemática (v · a)**
- `v` — velocidad en km/h (verde)
- `a` — aceleración en m/s² (índigo)

**Gráfica 2 — Eléctrica / Fuerza (V · I · F)**
- `V` — voltaje en V (amarillo)
- `I` — corriente en A (azul)
- `F` — fuerza calculada como `masa × aceleración` en N (rojo)

Ambas gráficas tienen animación desactivada (`isAnimationActive={false}`) para maximizar el rendimiento en tiempo real.

---

### `mensajes.jsx` — Log del sistema

Terminal de logs con fondo oscuro que muestra los últimos **10 mensajes** emitidos por el simulador. Cada mensaje incluye:

- Hora exacta de recepción
- Tipo de mensaje con código de color: `info` (azul), `success` (verde), `error` (rojo), `critical` (rojo intenso con fondo)

Los mensajes más nuevos aparecen primero.

---

### `botones.jsx` — Panel de comandos

Controla el **ciclo de vida del booster** mediante cuatro botones que envían comandos al backend vía `POST /api/command`:

| Botón | Comando | Color | Descripción |
|---|---|---|---|
| 1. PRECHARGE | `PRECHARGE` | Amarillo | Inicia la precarga del sistema |
| 2. START | `START` | Verde | Arranca con la masa configurada |
| 3. BRAKE | `BRAKE` | Rojo | Activa el frenado |
| RESET | `RESET` | Gris | Reinicia el simulador |

El botón **START** requiere un input de **masa (kg)** válido. Si el backend responde con error 400, se muestra el estado actual del booster como contexto del error. Todos los resultados (éxito o error) se muestran en un área de feedback debajo de los botones.

---

### `formulario.jsx` — Calculadora de frenado óptimo

Herramienta de planificación que calcula en qué **metro exacto** debe iniciarse el frenado para que el booster se detenga en la distancia deseada.

**Parámetros de entrada:**
- Masa del carro (kg)
- Distancia meta (m)

**Funcionamiento:** envía una petición `GET /api/calculate?m=<masa>&d=<distancia>` al backend y muestra el resultado en metros. Incluye validación local de los parámetros y gestión de errores de red y de servidor.

---

### `modelo3D.jsx` — Visor 3D

Renderiza el **modelo 3D del prototipo** en formato `.glb` ubicado en `public/modelo/Ensamblaje_Provisional_sinLetras.glb`.

Características:
- Rotación automática lenta (`autoRotate`, velocidad 0.5)
- Iluminación de entorno tipo "city" con sombras de contacto
- Controles de órbita con el ratón (rotar y zoom, sin paneo)
- `ErrorBoundary` propio: si el modelo no carga, muestra un mensaje de fallback en lugar de romper la aplicación

---

## Contexto global (BoosterContext)

Fichero: `SRC2/context/BoosterContext.jsx`

Provee el estado compartido a toda la aplicación mediante la Context API de React:

| Variable | Setter | Tipo | Descripción |
|---|---|---|---|
| `conectado` | `setConectado` | `boolean` | Si el WebSocket está activo |
| `telemetria` | `setTelemetria` | `object \| null` | Último frame de datos recibido |
| `historial` | `setHistorial` | `array` | Buffer circular de hasta 40 puntos |
| `mensajes` | `setMensajes` | `array` | Últimos 10 mensajes del sistema |

El hook `useBooster()` es el acceso estándar al contexto desde cualquier componente.

---

## Hook WebSocket

Fichero: `SRC2/hooks/useWebSocket.js`

Se conecta a `ws://localhost:5001/backend/stream` y procesa dos tipos de mensajes:

**`topic: "data"`** — telemetría en tiempo real
- Actualiza `telemetria` con el último frame
- Añade el punto al `historial` con timestamp (`Date.now()`)
- Mantiene el buffer limitado a `MAX_PUNTOS = 40`

**`topic: "message"`** — eventos y logs del simulador
- Añade el mensaje al array de `mensajes` con la hora local
- Limita la lista a los 10 mensajes más recientes

El hook gestiona los eventos `onopen`, `onclose` y `onerror` actualizando el estado `conectado`. Se limpia correctamente al desmontar el componente (`socket.close()` en el cleanup del `useEffect`).

---

## API REST del backend

El frontend se comunica con el backend en `http://localhost:8001`:

### `POST /api/command`

Envía un comando al simulador.

**Body (JSON):**
```json
{
  "command": "START",
  "payload": { "mass": 40 }
}
```

El campo `payload` solo es necesario para el comando `START`.

**Respuestas:**
- `200 OK` — comando aceptado
- `400 Bad Request` — comando no permitido en el estado actual

---

### `GET /api/calculate?m=<masa>&d=<distancia>`

Calcula la posición óptima de frenado.

**Parámetros query:**
- `m` — masa del carro en kg
- `d` — distancia meta en metros

**Respuesta `200 OK`:**
```json
{ "braking_position_m": 7.43 }
```

**Respuesta `400 Bad Request`:** la posición calculada sería negativa (parámetros fuera de rango).

---

## Requisitos del backend

Para que el frontend funcione completamente se necesitan dos servicios activos:

| Servicio | Protocolo | Puerto | Descripción |
|---|---|---|---|
| Simulador | WebSocket | `5001` | Emite telemetría en tiempo real |
| API REST | HTTP | `8001` | Recibe comandos y calcula frenado |


## Anotaciones a tener en cuenta 

Se requiere que no se pueda hacer scroll pero a mi parecer como no hay reajustamiento de los componentes he dejado el scroll para que de igual el tamaño de la pantalla se pueda acceder a todos los componentes.
Despues si se revisa el codigo se veran varias advertencias, no influyen en el desempeño de la web entonces no hace falta alarmarse.
La sibreria para hacer el css ( Tailwind css ) la he usado para el proyecto pero es horrible no me quedo muy claro todas las opciones.
Al ejecutar el programa en el visual la seccion del 3d se ve diferente a como deberia verse pero si se pone en el navegador web va bien.


Ambos servicios deben estar en marcha **antes** de abrir la aplicación en el navegador.
