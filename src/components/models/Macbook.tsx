"use client";

import { useGLTF } from "@react-three/drei";


export default function Macbook(props: any) {
  // Preload is good practice, but we'll do it dynamically
  const { scene } = useGLTF("/macbook.glb");
  
  return (
    <group {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/macbook.glb");
