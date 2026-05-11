import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Html } from '@react-three/drei';

function ModeloCarro(props) {
  const { scene } = useGLTF('/carro_booster.glb'); 
  return <primitive object={scene} {...props} />;
}

function Loader() {
  return (
    <Html center>
      <div className="text-white text-sm font-semibold animate-pulse">
        Cargando Carro Booster...
      </div>
    </Html>
  );
}

export default function Visor3D() {
  return (
    <div className="w-full h-full min-h-[400px] bg-slate-900 rounded-xl overflow-hidden relative border border-slate-700 shadow-lg">
      
      {/* Etiqueta indicativa */}
      <div className="absolute top-4 left-4 z-10 text-slate-300 text-sm font-bold pointer-events-none bg-slate-800/50 px-3 py-1 rounded-md backdrop-blur-sm">
        Vista 3D Interactiva
      </div>

      {/* Lienzo 3D */}
      <Canvas shadows camera={{ position: [4, 2, 5], fov: 45 }}>
        <Suspense fallback={<Loader />}>
            <Stage environment="city" intensity={0.5} adjustCamera={1.2}>
            <ModeloCarro />
          </Stage>

        </Suspense>

        {/* Controles para que el usuario pueda rotar y hacer zoom con el ratón */}
        <OrbitControls 
          makeDefault 
          autoRotate 
          autoRotateSpeed={0.5} 
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2} 
        />
      </Canvas>
    </div>
  );
}