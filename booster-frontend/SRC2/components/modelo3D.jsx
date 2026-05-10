import { Suspense } from 'react';

export function Modelo3D() {
    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-700 w-full mt-6 h-[400px] flex flex-col">
            <h3 className="text-gray-400 font-bold text-xs mb-4 tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                VISUALIZADOR 3D - CARRO BOOSTER
            </h3>
            
            {/* El contenedor donde vivirá el 3D */}
            <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden relative flex items-center justify-center border border-gray-700">
                
                {/* =======================================================
                  AQUÍ RELLENAREMOS CON NUESTRO PLATÓ DE CINE (CANVAS)
                  1. Pondremos el <Canvas>
                  2. Pondremos las luces <ambientLight> y <directionalLight>
                  3. Pondremos el modelo <CarroBooster />
                  4. Pondremos los controles de cámara <OrbitControls>
                  =======================================================
                */}

                <span className="text-gray-500 font-mono animate-pulse">
                    [ Aquí insertaremos el Canvas 3D... ]
                </span>

            </div>
        </div>
    );
}