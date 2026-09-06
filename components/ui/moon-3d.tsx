"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface Moon3DProps {
  phase: number;
}

const MoonSphere = ({ phase }: { phase: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load standard three.js examples textures (reliable CDNs)
  const [colorMap, bumpMap] = useTexture([
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg" // Using color as bump since standard bump isn't directly available, it still gives depth
  ]);

  // Rotate slowly over time
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  // Calculate light position based on moon phase.
  // Phase 0 = New Moon (light from back)
  // Phase 0.25 = First Quarter (light from right)
  // Phase 0.5 = Full Moon (light from front)
  // Phase 0.75 = Last Quarter (light from left)
  const lightPosition = useMemo(() => {
    // Math.PI * 2 is a full rotation. We offset by Math.PI so 0 phase is in the back (-Z)
    const angle = (phase * Math.PI * 2) + Math.PI;
    const distance = 10;
    return new THREE.Vector3(
      Math.sin(angle) * distance,
      0,
      Math.cos(angle) * distance
    );
  }, [phase]);

  return (
    <>
      <ambientLight intensity={0.05} />
      <directionalLight 
        position={lightPosition} 
        intensity={2.5} 
        castShadow
      />
      
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap} 
          bumpMap={bumpMap}
          bumpScale={0.02}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </>
  );
};

export function Moon3D({ phase }: Moon3DProps) {
  return (
    <div className="w-full h-full min-h-[300px] cursor-move flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minDistance={2.5}
          maxDistance={10}
          autoRotate={false}
        />
        <MoonSphere phase={phase} />
      </Canvas>
    </div>
  );
}
