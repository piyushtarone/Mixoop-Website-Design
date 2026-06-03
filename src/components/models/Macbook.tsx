"use client";

import { useGLTF } from "@react-three/drei";


const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const modelPath = `${basePath}/macbook.glb`;

export default function Macbook(props: any) {
  // Preload is good practice, but we'll do it dynamically
  const { scene } = useGLTF(modelPath);
  
  return (
    <group {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(process.env.NEXT_PUBLIC_BASE_PATH ? `${process.env.NEXT_PUBLIC_BASE_PATH}/macbook.glb` : "/macbook.glb");
