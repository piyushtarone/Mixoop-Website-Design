"use client";

import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import { Suspense } from "react";

export default function CanvasContainer() {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
    </div>
  );
}
