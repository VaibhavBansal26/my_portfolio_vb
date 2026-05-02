"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 160 }) {
  const mesh = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.035;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#e8a838" transparent opacity={0.45} sizeAttenuation />
    </points>
  );
}

function Lines() {
  const ref = useRef<THREE.LineSegments>(null);
  const geo = useMemo(() => {
    const pts: number[] = [];
    const idx: number[] = [];
    const n = 28;
    for (let i = 0; i < n; i++) {
      pts.push((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 6);
    }
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = pts[i*3] - pts[j*3], dy = pts[i*3+1] - pts[j*3+1];
        if (Math.hypot(dx, dy) < 4.5) idx.push(i, j);
      }
    }
    return { positions: new Float32Array(pts), indices: new Uint16Array(idx) };
  }, []);

  useFrame((state) => { if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.018; });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geo.positions, 3]} />
        <bufferAttribute attach="index" args={[geo.indices, 1]} />
      </bufferGeometry>
      <lineBasicMaterial color="#e8a838" transparent opacity={0.07} />
    </lineSegments>
  );
}

export default function ParticleBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 55 }}>
        <Particles />
        <Lines />
      </Canvas>
    </div>
  );
}
