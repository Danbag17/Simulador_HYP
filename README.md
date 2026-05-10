# Simulador Booster — Hyperloop UPV

Panel de control en tiempo real para la bancada de pruebas del booster.  
Desarrollado con React + Vite + Tailwind CSS + Recharts.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- El backend de la bancada ejecutándose localmente (ver apartado siguiente)

---

## Instalación

```bash
# 1. Clona el repositorio
git clone <url-del-repositorio>
cd booster-frontend

# 2. Instala las dependencias
npm install
```

---

## Ejecución

### 1. Arranca el backend primero

**Windows:**
```bash
backend.exe
```

**Linux / macOS:**
```bash
chmod +x backend
./backend
```

El backend expone:
| Servicio | URL |
|---|---|
| WebSocket (telemetría) | `ws://localhost:5001/backend/stream` |
| HTTP (comandos y cálculo) | `http://localhost:8001` |

### 2. Arranca el frontend

```bash
npm run dev
```

Abre el navegador en `http://localhost:5173`.

---

## Funcionalidades

| Sección | Descripción |
|---|---|
| **Estado** | Barra superior con las variables principales en tiempo real |
| **Cronograma** | Historial de transiciones de estado de la máquina |
| **Gráficas** | Evolución de v, a, V, I y F = m·a (últimos 10 s) |
| **Controles** | Botones PRECHARGE / START / BRAKE / RESET con validación |
| **Calculadora** | Posición óptima de frenada vía GET /api/calculate |
| **Mensajes** | Log de eventos del simulador (info, success, error, critical) |
| **Modelo 3D** | Visualización interactiva del carro en el track |

---

## Estructura del proyecto

```
booster-frontend/
├── SRC2/
│   ├── App.jsx                      # Raíz — layout principal
│   ├── main.jsx                     # Punto de entrada
│   ├── context/
│   │   └── BoosterContext.jsx       # Estado global (Context API)
│   ├── hooks/
│   │   └── useWebSocket.js          # Conexión WebSocket
│   └── components/
│       ├── Status.jsx               # Barra de estado
│       ├── CronogramaEstados.jsx    # Historial de estados
│       ├── graficas.jsx             # Gráficas de telemetría
│       ├── botones.jsx              # Comandos al simulador
│       ├── formulario.jsx           # Calculadora de frenada
│       ├── Mensajes.jsx             # Log de mensajes
│       └── modelo3D.jsx             # Visualización 3D
├── index.html
├── package.json
└── vite.config.js
```

---

## Puertos utilizados

| Puerto | Servicio |
|---|---|
| 5173 | Frontend (Vite dev server) |
| 5001 | Backend WebSocket |
| 8001 | Backend HTTP |

Asegúrate de que los puertos 5001 y 8001 no estén ocupados antes de arrancar el backend.
