"use client";

import { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Float,
  Sparkles,
  Html,
  useProgress,
  useGLTF,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

/* ─────────────────────────────────────────────
   Pre-load so no stutter on first render
───────────────────────────────────────────── */
useGLTF.preload("/assets/airplane_new.glb");

/* ═══════════════════════════════════════════════════════════
   LOADING PROGRESS BAR
═══════════════════════════════════════════════════════════ */
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 200,
            height: 2,
            background: "rgba(201,162,39,0.2)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #e8c547, #c9a227)",
              transition: "width 0.3s ease",
              borderRadius: 4,
            }}
          />
        </div>
        <span
          style={{
            color: "#c9a227",
            fontSize: 11,
            fontFamily: "Cairo, sans-serif",
            letterSpacing: "0.25em",
          }}
        >
          {Math.round(progress)}% · جارٍ تحميل الطائرة…
        </span>
      </div>
    </Html>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCENE LIGHTS  — dynamic gold fill + rim + key
═══════════════════════════════════════════════════════════ */
function SceneLights() {
  const fillRef = useRef<THREE.PointLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (fillRef.current) {
      fillRef.current.position.x = Math.sin(t * 0.35) * 6;
      fillRef.current.position.z = Math.cos(t * 0.35) * 6;
      fillRef.current.intensity = 2.2 + Math.sin(t * 0.8) * 0.4;
    }
    if (rimRef.current) {
      rimRef.current.position.x = Math.cos(t * 0.28 + 2) * 5;
      rimRef.current.position.z = Math.sin(t * 0.28 + 2) * 5;
    }
  });

  return (
    <>
      {/* Soft base fill */}
      <ambientLight intensity={0.3} color="#1a1208" />

      {/* Key light — overhead warm */}
      <directionalLight
        position={[6, 12, 5]}
        intensity={3}
        color="#fff5d6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Orbiting gold fill */}
      <pointLight
        ref={fillRef}
        color="#e8c547"
        intensity={2.2}
        distance={20}
        position={[6, 3, 6]}
      />

      {/* Orbiting cool rim */}
      <pointLight
        ref={rimRef}
        color="#c9a227"
        intensity={1.8}
        distance={16}
        position={[-5, 2, -5]}
      />

      {/* Under-belly warm glow */}
      <pointLight
        color="#c9a227"
        intensity={1.2}
        distance={12}
        position={[0, -5, 3]}
      />

      {/* Back-light punch */}
      <spotLight
        position={[-8, 4, -8]}
        intensity={4}
        color="#fde577"
        angle={0.35}
        penumbra={0.9}
        castShadow={false}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   ACTUAL GLB AIRPLANE MODEL
═══════════════════════════════════════════════════════════ */
function AirplaneModel({
  mouse,
}: {
  mouse: React.MutableRefObject<[number, number]>;
}) {
  const { scene } = useGLTF("/assets/airplane_new.glb");
  const groupRef = useRef<THREE.Group>(null);

  /* Apply PBR gold + white override to all meshes */
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        /* Enhance material for cinematic look */
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && mat.isMeshStandardMaterial) {
          mat.envMapIntensity = 2.5;
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    /* Gentle floating bob */
    groupRef.current.position.y = Math.sin(t * 0.55) * 0.25;

    /* Subtle banking roll */
    groupRef.current.rotation.z = Math.sin(t * 0.38) * 0.028;

    /* Pitch oscillation */
    groupRef.current.rotation.x = Math.sin(t * 0.32 + 1) * 0.018;

    /* Mouse parallax yaw */
    const [mx] = mouse.current;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mx * 0.35,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      {/* Scale up significantly — the model is small, so we push it to 8× */}
      <primitive object={scene} scale={8} position={[0, 0, 0]} />

      {/* Engine glow lights attached to approximate engine positions */}
      <pointLight
        color="#ff6600"
        intensity={1.8}
        distance={6}
        position={[-2, -1, 2]}
      />
      <pointLight
        color="#ff6600"
        intensity={1.8}
        distance={6}
        position={[-2, -1, -2]}
      />

      {/* Nose light */}
      <pointLight
        color="#ffffff"
        intensity={3}
        distance={6}
        position={[5, 0.5, 0]}
      />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════
   ENGINE EXHAUST PLUMES
═══════════════════════════════════════════════════════════ */
function ExhaustPlume({
  position,
}: {
  position: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 0.3 + Math.sin(t * 5 + position[2]) * 0.15;
    ref.current.scale.y = 1 + Math.sin(t * 4 + position[2]) * 0.15;
  });

  return (
    <mesh ref={ref} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <coneGeometry args={[0.12, 2.5, 10]} />
      <meshStandardMaterial
        color="#ff5500"
        emissive="#ff3300"
        emissiveIntensity={3}
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   ATMOSPHERE RING — rotating golden torus
═══════════════════════════════════════════════════════════ */
function AtmosphereRing() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.07;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} position={[0, -1, -4]}>
      <torusGeometry args={[9, 0.5, 8, 100]} />
      <meshStandardMaterial
        color="#c9a227"
        emissive="#a07b12"
        emissiveIntensity={0.55}
        metalness={0.85}
        roughness={0.25}
        transparent
        opacity={0.16}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   CLOUD PUFFS
═══════════════════════════════════════════════════════════ */
function CloudPuff({
  pos,
  scale,
  speed,
  phase,
}: {
  pos: [number, number, number];
  scale: number;
  speed: number;
  phase: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.x = pos[0] + Math.sin(t * speed + phase) * 4;
    ref.current.position.y = pos[1] + Math.sin(t * 0.3 + phase) * 0.4;
  });

  const offsets: [number, number, number][] = [
    [0, 0, 0],
    [1.2, 0.3, 0],
    [-0.8, 0.2, 0.3],
    [0.5, 0.6, -0.2],
    [-0.3, 0.5, 0.4],
  ];

  return (
    <group ref={ref} position={pos} scale={scale}>
      {offsets.map((offset, i) => (
        <mesh key={i} position={offset}>
          <sphereGeometry args={[0.9 - i * 0.06, 10, 7]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={1}
            metalness={0}
            transparent
            opacity={0.05 + i * 0.008}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function CloudField() {
  const clouds = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        pos: [
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 12 - 2,
          (Math.random() - 0.5) * 30 - 12,
        ] as [number, number, number],
        scale: Math.random() * 2 + 1,
        speed: Math.random() * 0.005 + 0.002,
        phase: Math.random() * Math.PI * 2,
      })),
    []
  );

  return (
    <>
      {clouds.map((c) => (
        <CloudPuff key={c.id} {...c} />
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   GROUND MIRROR PLANE
═══════════════════════════════════════════════════════════ */
function GroundMirror() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -6, 0]}
      receiveShadow
    >
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial
        color="#050404"
        metalness={0.9}
        roughness={0.05}
        transparent
        opacity={0.35}
        envMapIntensity={2}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════
   INTERACTIVE HOTSPOT LABELS
═══════════════════════════════════════════════════════════ */
function HotspotLabel({
  position,
  label,
}: {
  position: [number, number, number];
  label: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Html position={position} center distanceFactor={12}>
      <div
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          cursor: "pointer",
          userSelect: "none",
          pointerEvents: "auto",
        }}
      >
        {/* Pulsing dot */}
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#c9a227",
            border: "2px solid #fff",
            boxShadow: hovered
              ? "0 0 22px rgba(201,162,39,1)"
              : "0 0 10px rgba(201,162,39,0.7)",
            transition: "box-shadow 0.3s ease",
            animation: "pulse-dot 2s infinite",
          }}
        />
        {/* Tooltip */}
        <div
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(4px)",
            transition: "all 0.25s ease",
            background: "rgba(0,0,0,0.9)",
            border: "1px solid rgba(201,162,39,0.5)",
            borderRadius: 8,
            padding: "5px 14px",
            color: "#e8c547",
            fontSize: 11,
            fontFamily: "Cairo, sans-serif",
            whiteSpace: "nowrap",
            backdropFilter: "blur(8px)",
            pointerEvents: "none",
          }}
        >
          {label}
        </div>
      </div>
    </Html>
  );
}

/* ═══════════════════════════════════════════════════════════
   CAMERA RIG — slow cinematic orbit + mouse parallax
═══════════════════════════════════════════════════════════ */
function CameraRig({
  mouse,
}: {
  mouse: React.MutableRefObject<[number, number]>;
}) {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const [mx, my] = mouse.current;

    /* Gentle cinematic orbit */
    const r = 14;
    const tx = Math.cos(t * 0.08) * r + mx * 2;
    const ty = 2.5 + my * -2;
    const tz = Math.sin(t * 0.08) * r;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, 0.018);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, 0.018);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, tz, 0.018);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ═══════════════════════════════════════════════════════════
   FULL 3-D SCENE
═══════════════════════════════════════════════════════════ */
function AirplaneScene({
  mouse,
}: {
  mouse: React.MutableRefObject<[number, number]>;
}) {
  return (
    <>
      <SceneLights />

      {/* Atmospheric fog */}
      <fog attach="fog" args={["#000000", 20, 80]} />

      {/* Stars backdrop */}
      <Stars
        radius={100}
        depth={60}
        count={3000}
        factor={3.5}
        saturation={0.2}
        fade
        speed={0.2}
      />

      {/* Atmosphere ring */}
      <AtmosphereRing />

      {/* Cloud layer */}
      <CloudField />

      {/* Gold sparkle dust */}
      <Sparkles
        count={120}
        scale={10}
        size={2.5}
        speed={0.2}
        color="#e8c547"
        opacity={0.55}
      />

      {/* THE AIRPLANE — loaded from GLB, large + floating */}
      <Float speed={1.0} rotationIntensity={0.06} floatIntensity={0.3}>
        <AirplaneModel mouse={mouse} />
      </Float>

      {/* Engine exhaust plumes (approximate positions for scale=8 model) */}
      <ExhaustPlume position={[-4.5, -0.8, 2.2]} />
      <ExhaustPlume position={[-4.5, -0.8, -2.2]} />

      {/* Interactive hotspots */}
      <HotspotLabel position={[-2, 0.8, 3]} label="محركات تيربوفان" />
      <HotspotLabel position={[4, 1, 0.5]} label="مقصورة الكابينة الفاخرة" />
      <HotspotLabel position={[-4.5, 3, 0]} label="الذيل الذهبي — رمز القاضي" />

      {/* Ground reflection */}
      <GroundMirror />

      {/* Slow cinematic camera orbit */}
      <CameraRig mouse={mouse} />

      {/* Manual drag controls for the user */}
      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={6}
        maxDistance={28}
        maxPolarAngle={Math.PI * 0.68}
        minPolarAngle={Math.PI * 0.18}
        enableDamping
        dampingFactor={0.06}
        zoomSpeed={0.5}
      />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.25}
          luminanceSmoothing={0.6}
          intensity={1.6}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.28} darkness={0.7} />
      </EffectComposer>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT EXPORT
═══════════════════════════════════════════════════════════ */
export function Airplane3D() {
  const mouse = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      ];
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      className="relative w-full h-full"
      aria-label="الطائرة الذهبية ثلاثية الأبعاد التفاعلية — مجموعة القاضي"
    >
      <Canvas
        shadows
        camera={{ position: [14, 3, 14], fov: 42, near: 0.5, far: 300 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.3;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <Suspense fallback={<Loader />}>
          <AirplaneScene mouse={mouse} />
        </Suspense>
      </Canvas>

      {/* Bottom drag hint */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(201,162,39,0.35)",
          borderRadius: 40,
          padding: "5px 18px",
          backdropFilter: "blur(10px)",
        }}
      >
        <p
          style={{
            color: "#c9a227",
            fontSize: 10,
            fontFamily: "Cairo, sans-serif",
            letterSpacing: "0.2em",
            margin: 0,
          }}
        >
          اسحب للتدوير · مجموعة القاضي الذهبية
        </p>
      </div>

      {/* Pulse animation keyframe */}
      <style>{`
        @keyframes pulse-dot {
          0%   { box-shadow: 0 0 0 0 rgba(201,162,39,0.9); }
          70%  { box-shadow: 0 0 0 14px rgba(201,162,39,0); }
          100% { box-shadow: 0 0 0 0 rgba(201,162,39,0); }
        }
      `}</style>
    </div>
  );
}
