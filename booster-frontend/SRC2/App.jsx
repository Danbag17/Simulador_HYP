import { useWebSocket } from "./hooks/useWebSocket";
import { Status } from "./components/Status";
import { CronogramaEstados } from "./components/CronogramaEstados.jsx";
import { Graficas } from "./components/graficas";
import { Botones } from "./components/botones";
import { Calculadora } from "./components/formulario.jsx";
import { Mensajes } from "./components/Mensajes.jsx";
import { Modelo3D} from "./components/modelo3D.jsx";
import './App.css';

export default function App() {
    useWebSocket();

    return (
            <div className="h-screen overflow-hidden bg-gray-50 font-sans flex flex-col p-3 gap-3">            {/* ── Header: título + status en una sola línea compacta ── */}
            <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-4">
                <h1 className="text-base font-black text-blue-900 tracking-tight whitespace-nowrap">
                    BOOSTER <span className="text-blue-400 font-light text-xs"></span>
                </h1>
                <div className="flex-1">
                    <Status />
                </div>
            </header>

            {/* ── Cronograma: franja fina debajo del header ── */}
            <div className="flex-shrink-0 px-4 pt-2">
                <CronogramaEstados />
            </div>

            {/* ── Cuerpo: 2 columnas ── */}
            <div className="flex-1 overflow-hidden grid grid-cols-2 gap-3 p-3 pt-2 min-h-0">

                {/* Columna izquierda: gráficas encima, mensajes debajo */}
                <div className="flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <Graficas />
                    </div>
                    <div className="flex-shrink-0 h-[160px]">
                        <Mensajes />
                    </div>
                </div>

                {/* Columna derecha: botones + calculadora + 3D */}
                <div className="flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="flex-shrink-0">
                        <Botones />
                    </div>
                    <div className="flex-shrink-0">
                        <Calculadora />
                    </div>
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <Modelo3D />
                    </div>
                </div>

            </div>
        </div>
    );
}