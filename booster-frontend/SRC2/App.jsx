import { useWebSocket } from "./hooks/useWebSocket";
import { useBooster } from "./context/BoosterContext";
import { Botones} from "./components/botones";
import { Status } from "./components/Status";
import { Graficas } from "./components/graficas"; 
import './App.css'
import {Mensajes} from "./components/Mensajes.jsx";
import { Calculadora } from "./components/formulario.jsx";


export default function App() {

    useWebSocket();
    const { telemetria } = useBooster();

 return (

  
    <div className="p-10 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-4xl font-black text-blue-900 mb-8">
        BOOSTER <span className="text-blue-500 text-xl font-light">v2.0</span>
      </h1>
      
      {/* El panel de estado que acabamos de crear */}
      <Status />

      <Graficas />
      <Mensajes />
      {/* Los botones de control */}
      <div className="mt-10">
        <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Controles de Misión</h2>
        <Botones />
      </div>

      <Calculadora />


    </div>
  );
}
