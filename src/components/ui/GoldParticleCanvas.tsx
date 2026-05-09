"use client";

import { useEffect, useRef } from "react";
import type * as THREE from "three";

/**
 * Full-viewport Three.js gold particle background
 * Runs behind ALL sections — shader-based, GPU-accelerated
 * Ported from reference alqadi_website.html's bg-canvas system
 */
export function GoldParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // We use vanilla Three.js here (via dynamic import) to avoid
    // conflicts with the R3F instance in Airplane3D
    let destroyed = false;

    import("three").then((THREE) => {
      if (destroyed) return;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // — Particles —
      const N = 2500;
      const positions = new Float32Array(N * 3);
      const colors = new Float32Array(N * 3);
      const sizes = new Float32Array(N);

      const goldColor = new THREE.Color(0xc9a84c);
      const goldLight = new THREE.Color(0xf5d68a);
      const dimGold = new THREE.Color(0x8b6914);

      for (let i = 0; i < N; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        const t = Math.random();
        const c = t < 0.3 ? goldLight : t < 0.7 ? goldColor : dimGold;
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;

        sizes[i] = Math.random() * 2.5 + 0.3;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const mat = new THREE.ShaderMaterial({
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        vertexShader: `
          attribute float size;
          varying vec3 vColor;
          varying float vAlpha;
          uniform float uTime;
          void main() {
            vColor = color;
            vec3 pos = position;
            pos.z += sin(uTime * 0.3 + position.x * 0.5) * 0.15;
            vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPos.z);
            gl_Position = projectionMatrix * mvPos;
            vAlpha = 0.35 + 0.65 * sin(uTime * 0.8 + position.x * 2.1 + position.y * 1.7);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            if (d > 0.5) discard;
            float alpha = (1.0 - d * 2.0) * vAlpha;
            gl_FragColor = vec4(vColor, alpha * 0.55);
          }
        `,
        uniforms: { uTime: { value: 0 } },
      });

      const points = new THREE.Points(geo, mat);
      scene.add(points);

      // — Floating gold torus / octahedrons —
      const shapes: THREE.Mesh[] = [];
      for (let i = 0; i < 5; i++) {
        const g =
          i % 2 === 0
            ? new THREE.TorusGeometry(0.4 + Math.random() * 0.3, 0.02, 16, 80)
            : new THREE.OctahedronGeometry(0.2 + Math.random() * 0.15, 0);
        const m = new THREE.MeshBasicMaterial({
          color: 0xc9a84c,
          wireframe: i % 2 !== 0,
          transparent: true,
          opacity: 0.06 + Math.random() * 0.06,
        });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5 - 3
        );
        mesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        shapes.push(mesh);
        scene.add(mesh);
      }

      // — Mouse parallax —
      let mX = 0;
      let mY = 0;
      let tX = 0;
      let tY = 0;
      const onMove = (e: MouseEvent) => {
        mX = (e.clientX / window.innerWidth - 0.5) * 2;
        mY = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      document.addEventListener("mousemove", onMove, { passive: true });

      // — Animate —
      const startTime = performance.now();
      let animId: number;
      const tick = () => {
        if (destroyed) return;
        animId = requestAnimationFrame(tick);
        const t = (performance.now() - startTime) / 1000;
        mat.uniforms.uTime.value = t;

        tX += (mX - tX) * 0.03;
        tY += (mY - tY) * 0.03;

        points.rotation.y = t * 0.012 + tX * 0.1;
        points.rotation.x = tY * 0.05;

        shapes.forEach((s, i) => {
          s.rotation.x += 0.003 + i * 0.001;
          s.rotation.y += 0.004 + i * 0.0008;
          s.position.y += Math.sin(t * 0.4 + i * 1.2) * 0.002;
        });

        renderer.render(scene, camera);
      };
      tick();

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      return () => {
        destroyed = true;
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("mousemove", onMove);
        renderer.dispose();
        geo.dispose();
        mat.dispose();
        shapes.forEach((s) => {
          s.geometry.dispose();
          (s.material as THREE.MeshBasicMaterial).dispose();
        });
      };
    });

    return () => {
      destroyed = true;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
