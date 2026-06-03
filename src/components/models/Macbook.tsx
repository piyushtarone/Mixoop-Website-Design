"use client";

import { useGLTF } from "@react-three/drei";

const getBasePath = () => process.env.NODE_ENV === 'production' ? '/Mixoop-Website-Design' : '';

export default function Macbook(props: any) {
  // Preload is good practice, but we'll do it dynamically
  const { scene } = useGLTF(`${getBasePath()}/macbook.glb`);
  
  return (
    <group {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(process.env.NODE_ENV === 'production' ? '/Mixoop-Website-Design/macbook.glb' : '/macbook.glb');
