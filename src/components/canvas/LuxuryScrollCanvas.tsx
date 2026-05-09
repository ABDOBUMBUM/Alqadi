"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  Html,
  Line,
  MeshTransmissionMaterial,
  Sparkles,
} from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import type { WebGlTier } from "@/hooks/useAdaptiveFps";
import type { SceneTheme } from "@/context/SiteExperienceContext";

type Props = {
  scroll: number;
  dpr: [number, number];
  shadows: boolean;
  sceneTheme: SceneTheme;
  tier: WebGlTier;
  onGlReady?: (gl: THREE.WebGLRenderer) => void;
};

function GoldMaterial(props: Partial<THREE.MeshStandardMaterialParameters>) {
  return (
    <meshStandardMaterial
      color="#d4af37"
      metalness={0.92}
      roughness={0.22}
      envMapIntensity={1.2}
      {...props}
    />
  );
}

function CinematicRig({ scroll }: { scroll: number }) {
  const { camera } = useThree();
  useFrame(() => {
    const z = 6.2 - scroll * 1.35;
    const y = 0.35 + scroll * 0.55;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, y, 0.06);
    camera.lookAt(0, 0.05, 0);
  });
  return null;
}

function GatewayRing({ scroll }: { scroll: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * 0.12;
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      scroll * 0.85,
      0.04,
    );
  });
  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <torusGeometry args={[2.1, 0.09, 48, 200]} />
        <GoldMaterial />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.35, 0.02, 32, 128]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.4}
          roughness={0.6}
          emissive="#2a2410"
          emissiveIntensity={0.15 + scroll * 0.35}
        />
      </mesh>
    </group>
  );
}

function GlassEarth() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.08;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
      <mesh ref={ref} castShadow>
        <icosahedronGeometry args={[0.95, 2]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.35}
          chromaticAberration={0.06}
          anisotropy={0.15}
          distortion={0.12}
          distortionScale={0.2}
          temporalDistortion={0.05}
          color="#c9a227"
          metalness={0.25}
          roughness={0.15}
        />
      </mesh>
    </Float>
  );
}

function RouteLines({ scroll }: { scroll: number }) {
  const points = useMemo(() => {
    const p: THREE.Vector3[][] = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const b = a + 0.9;
      p.push([
        new THREE.Vector3(Math.cos(a) * 1.1, Math.sin(a) * 0.35, Math.sin(a) * 1.1),
        new THREE.Vector3(Math.cos(b) * 2.4, 0.1 + scroll * 0.4, Math.sin(b) * 2.4),
      ]);
    }
    return p;
  }, [scroll]);

  return (
    <group>
      {points.map((seg, i) => (
        <Line
          key={i}
          points={seg}
          color="#e8c547"
          lineWidth={1.5}
          transparent
          opacity={0.35 + scroll * 0.45}
        />
      ))}
    </group>
  );
}

function LuxuryPlane({ scroll }: { scroll: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      -1.8 + scroll * 3.2,
      0.02,
    );
    ref.current.rotation.z = -0.25 + scroll * 0.2;
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      0.15 + Math.sin(delta * 2) * 0.02,
      0.05,
    );
  });
  return (
    <group ref={ref} position={[-2.2, 0.1, 0.2]}>
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.45, 12]} />
        <GoldMaterial color="#f0dc82" />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.22, 0.08, 0.08]} />
        <meshStandardMaterial color="#0c0c0c" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}

function TalentOrbit({ scroll }: { scroll: number }) {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(
    () =>
      [0, 1, 2, 3].map((i) => ({
        angle: (i / 4) * Math.PI * 2,
        y: 0.15 + i * 0.12,
      })),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.25 + scroll * 2.2;
  });

  return (
    <group ref={group} position={[0, -0.35, 0]}>
      {nodes.map((n, i) => {
        const r = 1.55 + (i % 2) * 0.15;
        const x = Math.cos(n.angle + scroll) * r;
        const z = Math.sin(n.angle + scroll) * r;
        return (
          <mesh key={i} position={[x, n.y, z]} castShadow>
            <sphereGeometry args={[0.09, 24, 24]} />
            <meshStandardMaterial
              color="#f6e7b3"
              emissive="#c9a227"
              emissiveIntensity={0.35 + (i === 2 ? scroll * 0.6 : 0.15)}
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function HandshakeMonument({ scroll }: { scroll: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current) return;
    g.current.rotation.y = THREE.MathUtils.lerp(
      g.current.rotation.y,
      scroll * Math.PI * 1.4,
      0.03,
    );
  });
  return (
    <group ref={g} position={[0, -0.2, 0]}>
      <mesh position={[-0.22, 0, 0]} rotation={[0, 0, 0.35]} castShadow>
        <capsuleGeometry args={[0.07, 0.45, 8, 16]} />
        <GoldMaterial />
      </mesh>
      <mesh position={[0.22, 0, 0]} rotation={[0, 0, -0.35]} castShadow>
        <capsuleGeometry args={[0.07, 0.45, 8, 16]} />
        <GoldMaterial />
      </mesh>
      <mesh position={[0, 0.05, 0.12]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial
          color="#fff2c2"
          emissive="#e8c547"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.18}
        />
      </mesh>
    </group>
  );
}

function SceneLights({ sceneTheme }: { sceneTheme: SceneTheme }) {
  const hour = useMemo(() => new Date().getHours(), []);
  const isDay = hour >= 7 && hour < 19;
  const warm = sceneTheme === "day" || isDay;
  const keyColor = warm ? "#ffe9a8" : "#b8c8ff";
  const fill = warm ? "#4a3a18" : "#1a2040";

  return (
    <>
      <ambientLight intensity={warm ? 0.28 : 0.18} color="#ffffff" />
      <directionalLight
        position={[6, 8, 4]}
        intensity={warm ? 1.35 : 0.95}
        color={keyColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-4, 2, -6]} intensity={0.4} color={fill} />
    </>
  );
}

function Hotspot({
  position,
  label,
  href,
}: {
  position: [number, number, number];
  label: string;
  href: string;
}) {
  return (
    <Html position={position} center distanceFactor={8} zIndexRange={[100, 0]}>
      <a
        href={href}
        className="rounded-full border border-gold-500/50 bg-bg-panel/90 px-2 py-1 text-[10px] font-medium text-gold-400 shadow-lg backdrop-blur pointer-events-auto"
      >
        {label}
      </a>
    </Html>
  );
}

function PostFX({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom luminanceThreshold={0.22} mipmapBlur intensity={0.42} />
      <Vignette eskil={false} offset={0.12} darkness={0.5} />
    </EffectComposer>
  );
}

function SceneContent({
  scroll,
  sceneTheme,
  tier,
}: Pick<Props, "scroll" | "sceneTheme" | "tier">) {
  const phase = scroll;
  const showPlane = phase > 0.22;
  const showTalent = phase > 0.48;
  const showMonument = phase > 0.72;
  const sparkles = tier !== "low";

  return (
    <Suspense fallback={null}>
      <color attach="background" args={["#030303"]} />
      <fog attach="fog" args={["#030303", 8, 22]} />

      <CinematicRig scroll={scroll} />
      <SceneLights sceneTheme={sceneTheme} />

      <group position={[0, 0.1, 0]}>
        <GatewayRing scroll={scroll} />
        <GlassEarth />
        <RouteLines scroll={scroll} />
      </group>

      <Hotspot position={[1.6, 0.8, 0.5]} label="سياحة" href="#tourism" />
      <Hotspot position={[-1.4, -0.2, 1]} label="توظيف" href="#manpower" />

      {sparkles ? (
        <Sparkles
          count={tier === "high" ? 70 : 40}
          scale={7}
          size={1.4}
          speed={0.25}
          color="#e8c547"
          opacity={0.45}
        />
      ) : null}

      {showPlane ? <LuxuryPlane scroll={(scroll - 0.22) / 0.26} /> : null}
      {showTalent ? <TalentOrbit scroll={(scroll - 0.48) / 0.24} /> : null}
      {showMonument ? <HandshakeMonument scroll={(scroll - 0.72) / 0.28} /> : null}

      <Environment preset="city" />

      <PostFX enabled={tier !== "low"} />
    </Suspense>
  );
}

export default function LuxuryScrollCanvas({
  scroll,
  dpr,
  shadows,
  sceneTheme,
  tier,
  onGlReady,
}: Props) {
  return (
    <div className="webgl-root fixed inset-0 z-0">
      <Canvas
        shadows={shadows}
        dpr={dpr}
        camera={{ position: [0, 0.35, 6.2], fov: 42 }}
        gl={{
          alpha: false,
          antialias: tier !== "low",
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          onGlReady?.(gl);
        }}
      >
        <SceneContent scroll={scroll} sceneTheme={sceneTheme} tier={tier} />
      </Canvas>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-deep/90"
        aria-hidden
      />
    </div>
  );
}
