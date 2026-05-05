// ─── BoosterModel3D.jsx ──────────────────────────────────────────
//
// TEORÍA (React IV — ecosistema npm):
//   @react-three/fiber es una librería que envuelve Three.js para usarlo
//   como si fueran componentes React. Instalada con npm.
//   @react-three/drei añade utilidades como OrbitControls (rotación con ratón).
//
// TEORÍA (React IV — useContext):
//   Leemos datoActual del Context para mover el carro en tiempo real
//   según la posición que llega del WebSocket.
//
// MODELO:
//   Track de 50m, Sección Booster entre s=2 y s=4.
//   El carro se mueve en el eje X según position_m del simulador.
//   Color del carro cambia según el estado (BOOSTING=naranja, BRAKING=rojo...)

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useBooster } from '../context/BoosterContext.jsx'

// ─── El carro en 3D ──────────────────────────────────────────────
// useFrame se ejecuta en cada frame de animación (60fps).
// Movemos el mesh según la posición actual del simulador.
function Carro({ posicion, estado }) {
  const mesh = useRef()

  // Color dinámico según el estado del simulador
  const colorCarro =
    estado === 'BOOSTING' ? '#ff8c00' :
    estado === 'BRAKING'  ? '#ff3b3b' :
    estado === 'RUNNING'  ? '#00ff88' :
    estado === 'STOPPED'  ? '#5a7a96' :
                            '#00d4ff'

  // useFrame: actualiza la posición del mesh en cada frame de animación.
  // El track va de 0 a 50m; mapeamos a coordenadas 3D (escala 1:5 → 0 a 10 unidades)
  useFrame(() => {
    if (mesh.current) {
      const xObjetivo = (posicion / 50) * 10 - 5  // centrado en 0
      // Interpolación suave (lerp) para que el movimiento sea fluido
      mesh.current.position.x += (xObjetivo - mesh.current.position.x) * 0.1
    }
  })

  return (
    <group ref={mesh} position={[0, 0.3, 0]}>
      {/* Cuerpo principal del carro */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.3, 0.5]} />
        <meshStandardMaterial color={colorCarro} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Ruedas */}
      {[[-0.3, -0.2, 0.3], [0.3, -0.2, 0.3], [-0.3, -0.2, -0.3], [0.3, -0.2, -0.3]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 12]} />
          <meshStandardMaterial color="#1a2030" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {/* Imán (EMS) debajo */}
      <mesh position={[0, -0.18, 0]}>
        <boxGeometry args={[0.6, 0.06, 0.3]} />
        <meshStandardMaterial color="#ffd600" metalness={0.9} roughness={0.1} emissive="#ffd600" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

// ─── El track completo ───────────────────────────────────────────
function Track() {
  return (
    <group>
      {/* Rail principal */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[10, 0.06, 0.4]} />
        <meshStandardMaterial color="#1e2a38" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Sección Booster (s=2 a s=4 → x=-3.6 a -3.2 en escala) */}
      <mesh position={[-3.4, 0.04, 0]}>
        <boxGeometry args={[0.4, 0.04, 0.5]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} />
      </mesh>

      {/* Marcas de posición cada 10m */}
      {[0, 10, 20, 30, 40, 50].map((m) => (
        <group key={m} position={[(m / 50) * 10 - 5, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.02, 0.15, 0.6]} />
            <meshStandardMaterial color="#2a3a50" />
          </mesh>
          <Text
            position={[0, -0.2, 0.4]}
            fontSize={0.18}
            color="#3a5a7a"
            anchorX="center"
            font={undefined}
          >
            {m}m
          </Text>
        </group>
      ))}

      {/* Mechanical stopper al final */}
      <mesh position={[5, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.6]} />
        <meshStandardMaterial color="#ff3b3b" emissive="#ff3b3b" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

// ─── Componente principal ────────────────────────────────────────
function BoosterModel3D() {
  const { datoActual } = useBooster()

  const posicion = datoActual?.position_m ?? 0
  const estado   = datoActual?.state ?? 'IDLE'

  return (
    <div className="panel" style={{ position: 'relative' }}>
      <div className="panel-title">
        ◈ modelo 3D — carro booster
        <span style={{ float: 'right', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
          s = {posicion.toFixed(2)} m
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 0, borderRadius: '3px', overflow: 'hidden' }}>
        {/* Canvas de Three.js — React Three Fiber */}
        <Canvas
          shadows
          camera={{ position: [0, 3, 6], fov: 45 }}
          style={{ background: 'var(--bg-card)' }}
        >
          {/* Iluminación */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 5]} intensity={1} castShadow />
          <pointLight position={[-3.4, 1, 0]} color="#00d4ff" intensity={0.8} />

          {/* Suelo */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
            <planeGeometry args={[12, 4]} />
            <meshStandardMaterial color="#0a0c10" />
          </mesh>

          {/* Track */}
          <Track />

          {/* Carro con posición en tiempo real */}
          <Carro posicion={posicion} estado={estado} />

          {/* Controles de órbita — el usuario puede rotar con el ratón */}
          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </div>

      {/* Leyenda */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '6px',
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        color: 'var(--text-dim)',
        flexShrink: 0,
      }}>
        <span><span style={{ color: '#00d4ff' }}>━</span> Sección booster</span>
        <span><span style={{ color: '#ff3b3b' }}>━</span> Stopper (50m)</span>
        <span style={{ marginLeft: 'auto' }}>Arrastra para rotar</span>
      </div>
    </div>
  )
}

export default BoosterModel3D