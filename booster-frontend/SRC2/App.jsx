import { useWebSocket } from "./hooks/useWebSocket";
import { useBooster } from "./context/BoosterContext";
import { Botones } from "./components/botones";
import { Status } from "./components/Status";
import { Graficas } from "./components/graficas";
import { Mensajes } from "./components/Mensajes.jsx";
import { Calculadora } from "./components/formulario.jsx";
// AÑADIDO: importamos el nuevo componente de cronograma requerido por el enunciado
import { CronogramaEstados } from "./components/CronogramaEstados.jsx";
import { Modelo3D } from "./components/modelo3D.jsx";
import './App.css';

export default function App() {
    useWebSocket();
    const { telemetria } = useBooster();

    return (
        /*
         * CORREGIDO: antes era "min-h-screen" (permitía scroll si el contenido crecía).
         * Ahora es "h-screen overflow-hidden" para que todo quepa en una sola pantalla
         * sin scroll, tal como recomienda el enunciado ("panel de control, sin scroll").
         *
         * Layout: 3 columnas con grid. La columna central concentra los controles.
         */
        <div className="h-screen overflow-hidden bg-gray-50 font-sans flex flex-col p-3 gap-3">

            {/* Fila superior: título + barra de estado */}
            <div className="flex-shrink-0">
                <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-2xl font-black text-blue-900">
                        BOOSTER <span className="text-blue-500 text-sm font-light">v2.0</span>
                    </h1>
                </div>
                <Status />
            </div>

            {/* AÑADIDO: cronograma de estados debajo del status — requerido por el enunciado */}
            <div className="flex-shrink-0">
                <CronogramaEstados />
            </div>

            {/* Cuerpo principal: 3 columnas */}
            <div className="flex-1 overflow-hidden grid grid-cols-3 gap-3 min-h-0">

                {/* Columna 1: Gráficas */}
                <div className="overflow-y-auto">
                    <Graficas />
                </div>

                {/* Columna 2: Controles + Calculadora */}
                <div className="overflow-y-auto flex flex-col gap-3">
                    <div>
                        <h2 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">
                            Controles de misión
                        </h2>
                        <Botones />
                    </div>
                    <Calculadora />
                </div>

                {/* Columna 3: Mensajes + 3D */}
                <div className="overflow-y-auto flex flex-col gap-3">
                    <Mensajes />
                    <Modelo3D />
                </div>

            </div>
        </div>
    );
}