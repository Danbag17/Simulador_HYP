import { createContext , useContext , useState} from "react";

export const BoosterContext = createContext();

export function BoosterProvider({ children }) {
  
  const [mensajes, setMensajes] = useState([]);
  const [telemetria, setTelemetria] = useState({
    state: "IDLE",
    position_m: 0,
    velocity_kmh: 0,
    acceleration_ms2: 0,
    mass_kg: 0,
    voltage_v: 0,
    current_a: 0
    });


  return (
    <BoosterContext.Provider value={{ mensajes, setMensajes, telemetria, setTelemetria }}>
      {children}
    </BoosterContext.Provider>
  );
}
//contexto del booster 
export function useBooster() {
  return useContext(BoosterContext);
}