import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';

function CarroBooster() {
    // IMPORTANTE: Si tu archivo no se llama 'booster.glb', cambia el nombre aquí
    const { scene } = useGLTF('/modelo/Ensamblaje_Provisional_sinLetras.glb'); 
    
    return <primitive object={scene} />;
}

export function Modelo3D() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full h-[400px] flex flex-col">
            <h3 className="text-gray-400 font-bold text-xs mb-4 tracking-widest flex items-center gap-2 uppercase">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Visualización Telemetría 3D
            </h3>
            
            <div className="flex-1 bg-slate-50 rounded-lg overflow-hidden border border-gray-100 cursor-grab active:cursor-grabbing">
                <Canvas shadows camera={{ position: [4, 2, 4], fov: 45 }}>
                    {/* Stage configura automáticamente luces y sombras profesionales */}
                    <Stage environment="city" intensity={0.5} contactShadow={{ opacity: 0.7, blur: 2 }}>
                        <Suspense fallback={null}>
                            <CarroBooster />
                        </Suspense>
                    </Stage>
                    
                    <OrbitControls 
                        enablePan={false} 
                        autoRotate 
                        autoRotateSpeed={0.5}
                        maxPolarAngle={Math.PI / 2} 
                    />
                </Canvas>
            </div>
            
            <p className="mt-2 text-[10px] text-gray-400 text-center italic">
                Usa el ratón para rotar y hacer zoom sobre el prototipo
            </p>
        </div>
    );
}