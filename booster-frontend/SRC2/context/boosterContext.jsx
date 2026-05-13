import { createContext , useContext , useState} from "react";

export const BoosterContext = createContext();

export function BoosterProvider({ children }) {

  // useState: historial de datos para las gráficas (array circular)
  const [historial, setHistorial] = useState([])

const [conectado, setConectado] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [telemetria, setTelemetria] = useState(null);

  return (
    <BoosterContext.Provider value={{conectado, setConectado, mensajes, setMensajes, telemetria, setTelemetria, historial, setHistorial }}>
      {children}
    </BoosterContext.Provider>
  );
}
//contexto del booster 
export function useBooster() {
  return useContext(BoosterContext);
}
