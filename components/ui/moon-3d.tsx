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
    "/moon-reference.png",
    "/moon-reference.png" // Using color as bump since standard bump isn't directly available, it still gives depth
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
    // Math.PI * 2 is a full rotation. Offset by PI so 0 phase is New Moon
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
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight 
        position={lightPosition} 
        intensity={5.0} 
        color="#ffffff"
      />
      
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap} 
          color="#ffffff"
          emissive="#2a2a2a"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </>
  );
};

import { Suspense } from "react";

export function Moon3D({ phase }: Moon3DProps) {
  return (
    <div className="w-full h-full min-h-[300px] cursor-move flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minDistance={5}
          maxDistance={5}
          autoRotate={false}
        />
        <Suspense fallback={null}>
          <MoonSphere phase={phase} />
        </Suspense>
      </Canvas>
    </div>
  );
}
