import { useWebSocket } from "./hooks/useWebSocket";
import { useBooster } from "./context/BoosterContext";
import { botones } from "./components/botones";

export default function App() {
    useWebSocket();
      const { telemetria } = useBooster();

  return (
    <div className="p-10 font-sans">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Simulador Hyperloop
      </h1>
      
      {/* 3. Imprimimos los datos en crudo para comprobar que funciona */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Telemetría en tiempo real:</h2>
        <pre className="bg-black text-green-400 p-4 rounded">
          {JSON.stringify(telemetria, null, 2)}
        </pre>
      </div>

        {/* 4. Aquí irán los botones de control */}
        <div className="mt-6">
          <Controles />
        </div>  

        

    </div>
  );
}