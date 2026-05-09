"use client";

/**
 * مشهد مكتب طيران / وكالة سفر — هندسة برمجية (بدون glb) بأسلوب مشابه
 * لتجميع المشاهد في أمثلة three.js (إضاءة، مواد، تكوين فضاء).
 * @see https://threejs.org/examples/
 */

import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function OfficeLights() {
  return (
    <>
      <ambientLight intensity={0.35} color="#b8c4e0" />
      <directionalLight
        castShadow
        position={[4, 10, 6]}
        intensity={1.15}
        color="#fff6e5"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={40}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <spotLight
        position={[0, 3.2, 2]}
        angle={0.45}
        penumbra={0.65}
        intensity={1.4}
        color="#ffe8b0"
        castShadow
        distance={18}
      />
      <pointLight position={[-3, 2.2, 2]} intensity={0.35} color="#c9a227" />
    </>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[18, 14]} />
      <meshStandardMaterial
        color="#0d0d12"
        roughness={0.92}
        metalness={0.05}
      />
    </mesh>
  );
}

function Rug() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 1]} receiveShadow>
      <planeGeometry args={[5.5, 3.8]} />
      <meshStandardMaterial
        color="#121018"
        roughness={0.88}
        metalness={0.08}
      />
    </mesh>
  );
}

function BackWall() {
  return (
    <mesh position={[0, 2.2, -5]} receiveShadow>
      <planeGeometry args={[16, 5]} />
      <meshStandardMaterial color="#0a0a10" roughness={0.95} metalness={0.02} />
    </mesh>
  );
}

/** نافذة بإطار ذهبي وسماء ليلية — فخامة مكتب السفر */
function WindowSky() {
  return (
    <group position={[0, 2, -4.99]}>
      <RoundedBox args={[6.2, 3.2, 0.06]} radius={0.04} smoothness={4} castShadow>
        <meshStandardMaterial
          color="#c9a227"
          metalness={0.65}
          roughness={0.35}
        />
      </RoundedBox>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[5.5, 2.85]} />
        <meshStandardMaterial
          color="#0a1628"
          emissive="#1a3050"
          emissiveIntensity={0.35}
          roughness={0.9}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

function ExecutiveDesk() {
  return (
    <group position={[0, 0, 1.1]}>
      <RoundedBox
        args={[3.6, 0.1, 1.35]}
        radius={0.03}
        position={[0, 0.75, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#15151c"
          metalness={0.25}
          roughness={0.45}
        />
      </RoundedBox>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[3.2, 0.7, 1.1]} />
        <meshStandardMaterial color="#0e0e14" roughness={0.7} metalness={0.15} />
      </mesh>
      {/* خط ذهبي أمامي */}
      <mesh position={[0, 0.8, 0.68]}>
        <boxGeometry args={[3.5, 0.02, 0.04]} />
        <meshStandardMaterial
          color="#c9a227"
          metalness={0.85}
          roughness={0.25}
          emissive="#6b5200"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
}

function Monitor() {
  return (
    <group position={[0, 1.22, 0.65]}>
      <mesh castShadow>
        <boxGeometry args={[1.15, 0.72, 0.05]} />
        <meshStandardMaterial color="#08080c" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.05, 0.62]} />
        <meshStandardMaterial
          color="#0d1528"
          emissive="#1e3a6e"
          emissiveIntensity={0.45}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, -0.5, -0.05]}>
        <cylinderGeometry args={[0.06, 0.08, 0.35, 16]} />
        <meshStandardMaterial color="#1a1a22" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}

function OfficeChair() {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    g.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.2) * 0.08;
  });
  return (
    <group ref={g} position={[0, 0.45, -0.35]}>
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[0.95, 0.95, 0.08]} />
        <meshStandardMaterial color="#141018" roughness={0.55} />
      </mesh>
      <mesh castShadow position={[0, -0.15, 0.45]}>
        <boxGeometry args={[0.85, 0.35, 0.85]} />
        <meshStandardMaterial color="#141018" roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.45, 0.45]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#c9a227" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Globe() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * 0.12;
  });
  return (
    <group position={[-1.05, 0.92, 0.85]}>
      <mesh ref={ref} castShadow>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial
          color="#1a2d4a"
          metalness={0.45}
          roughness={0.35}
          emissive="#0a1520"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.06, 24]} />
        <meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.22} />
      </mesh>
    </group>
  );
}

function FilingCabinet() {
  return (
    <group position={[2.35, 0, -0.8]}>
      <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
        <boxGeometry args={[0.75, 1.8, 0.55]} />
        <meshStandardMaterial color="#12121a" roughness={0.65} metalness={0.2} />
      </mesh>
      {[0.35, 0.05, -0.25].map((z, i) => (
        <mesh key={i} position={[0.01, 1.15 - i * 0.45, z]}>
          <boxGeometry args={[0.72, 0.04, 0.5]} />
          <meshStandardMaterial
            color="#c9a227"
            metalness={0.75}
            roughness={0.28}
            opacity={0.85}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

function WallMapBoard() {
  return (
    <group position={[-2.35, 2.1, -4.92]}>
      <mesh>
        <planeGeometry args={[2.4, 1.5]} />
        <meshStandardMaterial color="#0e1018" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[2.1, 1.2]} />
        <meshStandardMaterial
          color="#152238"
          emissive="#2a4060"
          emissiveIntensity={0.15}
          roughness={0.6}
        />
      </mesh>
      {/* خطوط مسار تجريدية */}
      <mesh position={[0.3, 0.1, 0.03]} rotation={[0, 0, 0.4]}>
        <planeGeometry args={[1.2, 0.02]} />
        <meshBasicMaterial color="#e8c547" />
      </mesh>
      <mesh position={[-0.2, -0.15, 0.03]} rotation={[0, 0, -0.25]}>
        <planeGeometry args={[0.9, 0.02]} />
        <meshBasicMaterial color="#7db8e8" />
      </mesh>
    </group>
  );
}

function DeskPhone() {
  return (
    <group position={[1.15, 0.82, 0.95]}>
      <mesh castShadow>
        <boxGeometry args={[0.22, 0.06, 0.14]} />
        <meshStandardMaterial color="#1a1a22" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.08]} />
        <meshStandardMaterial
          color="#2a3040"
          emissive="#1a2030"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

function MiniaturePlane() {
  const r = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!r.current) return;
    r.current.rotation.z = Math.sin(s.clock.elapsedTime * 1.2) * 0.06;
  });
  return (
    <group ref={r} position={[1.25, 0.82, 0.35]} rotation={[0, 0.5, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.35, 0.04, 0.12]} />
        <meshStandardMaterial color="#e8e8f0" roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.06, 0.2, 8]} />
        <meshStandardMaterial color="#c9a227" metalness={0.7} roughness={0.25} />
      </mesh>
    </group>
  );
}

export function AirlineOfficeScene() {
  return (
    <group>
      <OfficeLights />
      <Floor />
      <Rug />
      <BackWall />
      <WindowSky />
      <WallMapBoard />
      <ExecutiveDesk />
      <Monitor />
      <OfficeChair />
      <Globe />
      <FilingCabinet />
      <DeskPhone />
      <MiniaturePlane />
    </group>
  );
}
