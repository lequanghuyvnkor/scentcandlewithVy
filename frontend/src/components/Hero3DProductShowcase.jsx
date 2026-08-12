import React, { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Lightformer, Sparkles } from '@react-three/drei';
import { Flame, Power, Layers, RotateCw, ArrowRight, Eye } from 'lucide-react';
import * as THREE from 'three';

/* =========================================================================
   1. PROCEDURAL TEXTURES (VALERON GRAPHICS - ACCURATE FRONT & BACK)
   ========================================================================= */

function drawValeronLogo(ctx, x, y, size, color = '#ffffff') {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.05;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const w = size * 0.8;
  const h = size;

  ctx.beginPath();
  ctx.moveTo(-w / 2, -h / 2);
  ctx.lineTo(-w / 2, h * 0.05);
  ctx.lineTo(0, h / 2);
  ctx.lineTo(w / 2, h * 0.05);
  ctx.lineTo(w / 2, -h / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -h / 3);
  ctx.lineTo(0, h * 0.25);
  ctx.moveTo(-w * 0.25, -h * 0.4);
  ctx.lineTo(-w * 0.25, h * 0.1);
  ctx.moveTo(w * 0.25, -h * 0.4);
  ctx.lineTo(w * 0.25, h * 0.1);

  ctx.stroke();
  ctx.restore();
}

function createMicroNormalMap(width = 512, height = 512, intensity = 0.8) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const nx = (Math.random() - 0.5) * 0.4 * intensity;
      const ny = (Math.random() - 0.5) * 0.4 * intensity;
      const nz = 1.0;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      data[idx] = Math.floor(((nx / len) * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.floor(((ny / len) * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.floor(((nz / len) * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.anisotropy = 16;
  return texture;
}

// Front Box Texture
function createBoxFrontTexture() {
  const width = 1024;
  const height = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, '#141618');
  bgGradient.addColorStop(0.5, '#0d0e10');
  bgGradient.addColorStop(1, '#090a0b');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  const cyanGlow = ctx.createLinearGradient(width - 40, 0, width, 0);
  cyanGlow.addColorStop(0, 'rgba(34, 211, 238, 0)');
  cyanGlow.addColorStop(1, 'rgba(34, 211, 238, 0.45)');
  ctx.fillStyle = cyanGlow;
  ctx.fillRect(width - 40, 0, 40, height);

  ctx.textAlign = 'center';
  drawValeronLogo(ctx, width / 2, 280, 160, '#ffffff');

  ctx.fillStyle = '#f8fafc';
  ctx.font = '600 68px "Cinzel", serif';
  ctx.fillText('VALERON', width / 2, 540);

  ctx.fillStyle = '#22d3ee';
  ctx.font = '600 32px "Josefin Sans", sans-serif';
  ctx.fillText('GATE I', width / 2, 630);

  ctx.fillStyle = '#ffffff';
  ctx.font = '500 60px "Cinzel", serif';
  ctx.fillText('MORNING', width / 2, 1080);
  ctx.fillText('POWER', width / 2, 1170);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 24px "Josefin Sans", sans-serif';
  ctx.fillText('THE FIRST HOUR PROTOCOL', width / 2, 1280);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 26px "Josefin Sans", sans-serif';
  ctx.fillText('BERGAMOT · BLACK PEPPER · DRY CEDAR', width / 2, 1370);

  ctx.fillStyle = '#64748b';
  ctx.font = '400 24px "Josefin Sans", sans-serif';
  ctx.fillText('200 G', width / 2, 1620);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Back Box Texture (Exact according to User Image 1)
function createBoxBackTexture() {
  const width = 1024;
  const height = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0f1113';
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = 'center';
  drawValeronLogo(ctx, width / 2, 220, 140, '#ffffff');

  ctx.fillStyle = '#f8fafc';
  ctx.font = '600 58px "Cinzel", serif';
  ctx.fillText('VALERON', width / 2, 440);

  ctx.fillStyle = '#22d3ee';
  ctx.font = '600 28px "Josefin Sans", sans-serif';
  ctx.fillText('GATE I', width / 2, 510);

  ctx.fillStyle = '#ffffff';
  ctx.font = '500 52px "Cinzel", serif';
  ctx.fillText('MORNING POWER', width / 2, 640);

  const drawSection = (title, line1, line2, yPos) => {
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, yPos);
    ctx.lineTo(824, yPos);
    ctx.stroke();

    ctx.fillStyle = '#22d3ee';
    ctx.font = '600 24px "Josefin Sans", sans-serif';
    ctx.fillText(title, width / 2, yPos + 55);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '400 24px "Josefin Sans", sans-serif';
    ctx.fillText(line1, width / 2, yPos + 105);

    if (line2) {
      ctx.fillText(line2, width / 2, yPos + 145);
    }
  };

  drawSection('PURPOSE', 'CLARITY · FOCUS · INTENTION', null, 740);
  drawSection('SCENT PROFILE', 'BERGAMOT · BLACK PEPPER · SMOKY CEDAR', null, 980);
  drawSection('MATERIALS', 'SOY–COCONUT WAX', 'PREMIUM FRAGRANCE BLEND', 1220);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '400 24px "Josefin Sans", sans-serif';
  ctx.fillText('COTTON WICK', width / 2, 1220 + 185);

  drawSection('RITUAL', 'TRIM WICK TO 5 MM', 'BURN FOR 2–3 HOURS', 1520);

  ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(200, 1790);
  ctx.lineTo(824, 1790);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 24px "Josefin Sans", sans-serif';
  ctx.fillText('200 G', width / 2, 1870);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Top Box Texture (Logo [W] centered on dark matte black)
function createBoxTopTexture() {
  const width = 512;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0f1113';
  ctx.fillRect(0, 0, width, height);

  drawValeronLogo(ctx, width / 2, height / 2, 140, '#ffffff');

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createJarLabelTexture() {
  const width = 1024;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0e1012';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.textAlign = 'center';
  drawValeronLogo(ctx, width / 2, 220, 110, '#ffffff');

  ctx.fillStyle = '#f8fafc';
  ctx.font = '600 48px "Cinzel", serif';
  ctx.fillText('VALERON', width / 2, 400);

  ctx.fillStyle = '#22d3ee';
  ctx.font = '600 24px "Josefin Sans", sans-serif';
  ctx.fillText('GATE I', width / 2, 470);

  ctx.fillStyle = '#ffffff';
  ctx.font = '400 22px "Josefin Sans", sans-serif';
  ctx.fillText('SOY–COCONUT WAX', width / 2, 650);
  ctx.fillText('COTTON WICK', width / 2, 700);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 20px "Josefin Sans", sans-serif';
  ctx.fillText('200 G', width / 2, 790);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createLidTexture() {
  const width = 512;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#141618';
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '700 80px "Cinzel", serif';
  ctx.fillText('V', width / 2, height / 2 + 28);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/* =========================================================================
   2. 3D CANDLE FLAME SHADER
   ========================================================================= */

const FlameShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColorCore: { value: new THREE.Color('#ffffff') },
    uColorInner: { value: new THREE.Color('#ffcc00') },
    uColorOuter: { value: new THREE.Color('#ff4400') },
    uColorBase: { value: new THREE.Color('#1177ff') },
  },
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    void main() {
      vUv = uv;
      vec3 pos = position;
      float heightFactor = pow(max(0.0, pos.y + 0.25), 1.8);
      float n = noise(vec2(uTime * 3.5, pos.y * 4.0));
      pos.x += (n - 0.5) * 0.12 * heightFactor;
      pos.z += (sin(uTime * 5.0 + pos.y * 6.0)) * 0.06 * heightFactor;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorCore; uniform vec3 uColorInner;
    uniform vec3 uColorOuter; uniform vec3 uColorBase;
    varying vec2 vUv;
    void main() {
      float y = vUv.y; float x = abs(vUv.x - 0.5) * 2.0;
      float alpha = smoothstep(1.0, 0.0, x) * smoothstep(1.0, 0.1, y);
      vec3 color;
      if (y < 0.18) color = mix(uColorBase, uColorInner, y / 0.18);
      else if (y < 0.65) color = mix(uColorInner, uColorOuter, (y - 0.18) / 0.47);
      else color = mix(uColorOuter, vec3(0.9, 0.2, 0.0), (y - 0.65) / 0.35);
      color = mix(color, uColorCore, smoothstep(0.4, 0.0, x) * smoothstep(0.7, 0.1, y) * 0.9);
      gl_FragColor = vec4(color * 1.6, alpha * 0.95);
    }
  `
};

function CandleFlame({ isLit = true, position = [0, 1.58, 0] }) {
  const lightRef = useRef();
  const materialRef = useRef();
  const flameGeometry = useMemo(() => {
    const geom = new THREE.ConeGeometry(0.08, 0.42, 32, 32);
    geom.translate(0, 0.21, 0);
    return geom;
  }, []);

  useFrame((state) => {
    if (!isLit) return;
    const time = state.clock.getElapsedTime();
    if (materialRef.current) materialRef.current.uniforms.uTime.value = time;
    if (lightRef.current) {
      const f1 = Math.sin(time * 14) * 0.12;
      const f2 = Math.cos(time * 27) * 0.08;
      lightRef.current.intensity = 2.4 + f1 + f2;
    }
  });

  if (!isLit) return null;

  return (
    <group position={position}>
      <mesh geometry={flameGeometry}>
        <shaderMaterial
          ref={materialRef}
          args={[FlameShaderMaterial]}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      <pointLight ref={lightRef} color="#ffa033" intensity={2.5} distance={6} decay={1.8} castShadow />
    </group>
  );
}

/* =========================================================================
   3. 3D CANDLE JAR & BOX (EXACT 1:1 SCALING MATCH FOR BOTH INSIDE & OUTSIDE)
   ========================================================================= */

function CandleJar({ isLit = false, isLidOn = true, position = [0.95, 0, 0.2], scale = 1.0 }) {
  const lidRef = useRef();
  const labelTexture = useMemo(() => createJarLabelTexture(), []);
  const lidTexture = useMemo(() => createLidTexture(), []);
  const normalMap = useMemo(() => createMicroNormalMap(512, 512, 0.6), []);

  useFrame((state, delta) => {
    if (lidRef.current) {
      const targetY = isLidOn ? 1.88 : 0;
      const targetX = isLidOn ? 0 : 2.2;
      lidRef.current.position.y = THREE.MathUtils.damp(lidRef.current.position.y, targetY, 7, delta);
      lidRef.current.position.x = THREE.MathUtils.damp(lidRef.current.position.x, targetX, 7, delta);
    }
  });

  const jarGeometry = useMemo(() => {
    const points = [];
    const height = 1.95;
    const rBase = 0.88; const rBody = 0.92; const rNeck = 0.84; const wallThickness = 0.08;
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(rBase * 0.8, 0.015));
    points.push(new THREE.Vector2(rBase, 0.08));
    points.push(new THREE.Vector2(rBody, 0.3));
    points.push(new THREE.Vector2(rBody, 1.45));
    points.push(new THREE.Vector2(rNeck, 1.82));
    points.push(new THREE.Vector2(rNeck, height));
    points.push(new THREE.Vector2(rNeck - wallThickness, height));
    points.push(new THREE.Vector2(rNeck - wallThickness, 1.8));
    points.push(new THREE.Vector2(rBody - wallThickness, 1.4));
    points.push(new THREE.Vector2(rBody - wallThickness, 0.12));
    points.push(new THREE.Vector2(0, 0.12));
    return new THREE.LatheGeometry(points, 64);
  }, []);

  const labelCurvedGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.922, 0.922, 1.15, 48, 1, true, -0.61, 1.22);
  }, []);

  return (
    <group position={position} scale={scale}>
      <mesh geometry={jarGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#111214"
          roughness={0.42}
          metalness={0.08}
          clearcoat={0.15}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.2, 0.2)}
        />
      </mesh>

      <mesh position={[0, 1.38, 0]} receiveShadow>
        <cylinderGeometry args={[0.83, 0.83, 0.1, 48]} />
        <meshPhysicalMaterial
          color="#f4ebd9"
          roughness={0.65}
          transmission={isLit ? 0.25 : 0}
          thickness={0.5}
          emissive={isLit ? "#ff7700" : "#000000"}
          emissiveIntensity={isLit ? 0.18 : 0}
        />
      </mesh>

      <mesh position={[0, 1.46, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.18, 12]} />
        <meshStandardMaterial color="#1a1410" roughness={0.9} />
      </mesh>

      <CandleFlame isLit={isLit && !isLidOn} position={[0, 1.55, 0]} />

      <mesh geometry={labelCurvedGeometry} position={[0, 0.94, 0]}>
        <meshStandardMaterial map={labelTexture} roughness={0.6} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-2} />
      </mesh>

      <group ref={lidRef} position={[0, isLidOn ? 1.88 : 0, isLidOn ? 0 : 2.2]}>
        <mesh position={[0, 0.17, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 0.87, 0.34, 64]} />
          <meshPhysicalMaterial color="#141517" roughness={0.38} metalness={0.12} normalMap={normalMap} normalScale={new THREE.Vector2(0.15, 0.15)} />
        </mesh>
        <mesh position={[0, 0.342, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.84, 0.84]} />
          <meshStandardMaterial map={lidTexture} roughness={0.4} transparent opacity={0.88} />
        </mesh>
      </group>
    </group>
  );
}

// 3D Packaging Box (Supports Solid View Image 1 & Open Display Shadowbox Cutaway View Image 2)
function CandleBox({ position = [-1.6, 0, -0.5], isCutaway = false }) {
  const boxFrontTexture = useMemo(() => createBoxFrontTexture(), []);
  const boxBackTexture = useMemo(() => createBoxBackTexture(), []);
  const boxTopTexture = useMemo(() => createBoxTopTexture(), []);
  const boxNormalMap = useMemo(() => createMicroNormalMap(512, 512, 0.6), []);

  const boxMaterials = useMemo(() => {
    const sideMat = new THREE.MeshStandardMaterial({ color: '#111214', roughness: 0.75, normalMap: boxNormalMap, normalScale: new THREE.Vector2(0.2, 0.2) });
    const topMat = new THREE.MeshStandardMaterial({ map: boxTopTexture, roughness: 0.6, normalMap: boxNormalMap, normalScale: new THREE.Vector2(0.15, 0.15) });
    const frontMat = new THREE.MeshStandardMaterial({ map: boxFrontTexture, roughness: 0.65, normalMap: boxNormalMap, normalScale: new THREE.Vector2(0.15, 0.15) });
    const backMat = new THREE.MeshStandardMaterial({ map: boxBackTexture, roughness: 0.65, normalMap: boxNormalMap, normalScale: new THREE.Vector2(0.15, 0.15) });

    return [sideMat, sideMat, topMat, sideMat, frontMat, backMat];
  }, [boxFrontTexture, boxBackTexture, boxTopTexture, boxNormalMap]);

  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#111214', roughness: 0.7 }), []);
  const foamMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#17191c', roughness: 0.9, normalMap: boxNormalMap, normalScale: new THREE.Vector2(0.4, 0.4) }), [boxNormalMap]);

  return (
    <group position={position} rotation={[0, 0.2, 0]}>
      {!isCutaway ? (
        // Standard Solid Packaging Box (Image 1)
        <group>
          <mesh position={[0, 1.925, 0]} material={boxMaterials} castShadow receiveShadow>
            <boxGeometry args={[2.25, 3.85, 2.25]} />
          </mesh>
          <mesh position={[1.128, 1.925, 1.128]}>
            <boxGeometry args={[0.02, 3.83, 0.02]} />
            <meshBasicMaterial color="#22d3ee" />
          </mesh>
          <pointLight position={[1.2, 1.9, 1.2]} color="#22d3ee" intensity={0.8} distance={3.2} decay={2} />
        </group>
      ) : (
        // Cutaway Open Shadowbox Display View (Exact matching User Image 2!)
        <group position={[0, 0, 0]}>
          {/* Back Wall */}
          <mesh position={[0, 1.925, -1.025]} material={frameMat} castShadow receiveShadow>
            <boxGeometry args={[2.25, 3.85, 0.2]} />
          </mesh>

          {/* Left Wall */}
          <mesh position={[-1.025, 1.925, 0]} material={frameMat} castShadow receiveShadow>
            <boxGeometry args={[0.2, 3.85, 2.25]} />
          </mesh>

          {/* Right Wall */}
          <mesh position={[1.025, 1.925, 0]} material={frameMat} castShadow receiveShadow>
            <boxGeometry args={[0.2, 3.85, 2.25]} />
          </mesh>

          {/* Top Wall */}
          <mesh position={[0, 3.75, 0]} material={frameMat} castShadow receiveShadow>
            <boxGeometry args={[2.25, 0.2, 2.25]} />
          </mesh>

          {/* Bottom Wall */}
          <mesh position={[0, 0.1, 0]} material={frameMat} castShadow receiveShadow>
            <boxGeometry args={[2.25, 0.2, 2.25]} />
          </mesh>

          {/* Interior Molded Foam Insert Cushion */}
          <mesh position={[0, 1.925, -0.75]} material={foamMat} receiveShadow>
            <boxGeometry args={[1.85, 3.45, 0.35]} />
          </mesh>
          <mesh position={[0, 0.35, 0]} material={foamMat} receiveShadow>
            <boxGeometry args={[1.85, 0.3, 1.85]} />
          </mesh>
          <mesh position={[0, 3.5, 0]} material={foamMat} receiveShadow>
            <boxGeometry args={[1.85, 0.3, 1.85]} />
          </mesh>

          {/* Cyan Glow Edges (Acrylic Outline Frame) */}
          <mesh position={[1.12, 1.925, 1.125]}>
            <boxGeometry args={[0.02, 3.83, 0.02]} />
            <meshBasicMaterial color="#22d3ee" />
          </mesh>
          <mesh position={[-1.12, 1.925, 1.125]}>
            <boxGeometry args={[0.02, 3.83, 0.02]} />
            <meshBasicMaterial color="#22d3ee" />
          </mesh>

          {/* CANDLE JAR INSIDE PACKAGING - EXACT 1:1 SCALING & GEOMETRY AS OUTSIDE JAR */}
          <CandleJar position={[0, 0.2, 0]} isLit={false} isLidOn={true} scale={1.0} />
        </group>
      )}
    </group>
  );
}

/* =========================================================================
   4. STUDIO SCENE WITH AUTO-ROTATE SUPPORT & CUTAWAY VIEW TOGGLE
   ========================================================================= */

function StudioScene({ isLit = false, isLidOn = true, autoRotate = true, isCutaway = false }) {
  return (
    <>
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.8}
        zoomSpeed={0.8}
        minDistance={1.8}
        maxDistance={9.5}
        maxPolarAngle={Math.PI / 2 + 0.05}
        autoRotate={autoRotate}
        autoRotateSpeed={1.5}
        target={[-0.3, 1.2, 0]}
      />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 4]} intensity={2.2} castShadow />
      <directionalLight position={[-6, 5, -3]} intensity={1.5} color="#22d3ee" />

      <Environment preset="city" environmentIntensity={0.35}>
        <Lightformer form="rect" intensity={2.5} position={[0, 6, 0]} scale={[12, 12, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.8} color="#22d3ee" position={[6, 2, 0]} scale={[4, 10, 1]} rotation-y={-Math.PI / 2} />
      </Environment>

      <group position={[0, -0.01, 0]}>
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <cylinderGeometry args={[5.2, 5.5, 0.2, 64]} />
          <meshStandardMaterial color="#0d0e10" roughness={0.5} metalness={0.2} />
        </mesh>
        <ContactShadows position={[0, 0.01, 0]} opacity={0.8} scale={12} blur={2.0} far={5.0} />
      </group>

      {/* 3D Box Packaging (Supports Cutaway mode from Image 2 + Back panel from Image 1) */}
      <CandleBox position={[-1.6, 0, -0.5]} isCutaway={isCutaway} />

      {/* Standalone Candle Jar (Exact 1:1 Scale matching the Jar inside packaging) */}
      <CandleJar position={[0.95, 0, 0.2]} isLit={isLit} isLidOn={isLidOn} scale={1.0} />

      {isLit && !isLidOn && (
        <Sparkles count={35} scale={[1.2, 2.5, 1.2]} position={[0.95, 2.0, 0.2]} size={2.5} speed={0.4} color="#ffaa33" />
      )}
    </>
  );
}

/* =========================================================================
   5. FULLSCREEN HERO SHOWCASE WITH CUTAWAY TOGGLE & ACCURATE GRAPHICS
   ========================================================================= */

export default function Hero3DProductShowcase({ setView, onExploreClick }) {
  const [isLit, setIsLit] = useState(false);
  const [isLidOn, setIsLidOn] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isCutaway, setIsCutaway] = useState(false);

  const handleExplore = () => {
    if (setView) {
      setView("shop");
    } else if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById("collection") || document.getElementById("shop");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      minHeight: '650px',
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      marginTop: '-28px',
      marginBottom: '48px',
      background: '#090a0c',
      overflow: 'hidden'
    }}>
      {/* Background Subtle Radial Lighting */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* 3D Canvas Viewport - Edge-to-Edge Fullscreen */}
      <div style={{ width: '100%', height: '100%' }}>
        <Canvas
          shadows
          camera={{ position: [-0.3, 2.0, 5.2], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15
          }}
        >
          <Suspense fallback={null}>
            <StudioScene isLit={isLit} isLidOn={isLidOn} autoRotate={autoRotate} isCutaway={isCutaway} />
          </Suspense>
        </Canvas>
      </div>

      {/* Interactive Controls Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '36px',
        left: '36px',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* Flame Toggle */}
        <button
          onClick={() => {
            const nextLit = !isLit;
            setIsLit(nextLit);
            if (nextLit && isLidOn) setIsLidOn(false);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '50px',
            border: 'none',
            background: isLit ? 'linear-gradient(135deg, #d97706, #ea580c)' : 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            color: isLit ? '#ffffff' : '#94a3b8',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: isLit ? '0 0 20px rgba(245, 158, 11, 0.4)' : '0 8px 24px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease',
            fontFamily: "'Josefin Sans', sans-serif",
            letterSpacing: '0.08em'
          }}
        >
          {isLit ? <Flame size={16} color="#ffe4e6" /> : <Power size={16} />}
          <span>{isLit ? 'Flame ON' : 'Light Candle'}</span>
        </button>

        {/* Lid Toggle */}
        <button
          onClick={() => {
            const nextLid = !isLidOn;
            setIsLidOn(nextLid);
            if (nextLid) setIsLit(false);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background: isLidOn ? 'rgba(34, 211, 238, 0.15)' : 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            color: isLidOn ? '#22d3ee' : '#94a3b8',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease',
            fontFamily: "'Josefin Sans', sans-serif",
            letterSpacing: '0.08em'
          }}
        >
          <Layers size={16} />
          <span>{isLidOn ? 'Lid: ON' : 'Lid: OFF'}</span>
        </button>

        {/* Cutaway / Cross-Section View Toggle (Image 2 Cutaway View) */}
        <button
          onClick={() => setIsCutaway(!isCutaway)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background: isCutaway ? 'rgba(34, 211, 238, 0.25)' : 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            color: isCutaway ? '#22d3ee' : '#94a3b8',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease',
            fontFamily: "'Josefin Sans', sans-serif",
            letterSpacing: '0.08em'
          }}
        >
          <Eye size={16} />
          <span>{isCutaway ? 'Cutaway View' : 'Solid Box'}</span>
        </button>

        {/* 360 Spin Toggle Button (RotateCw) */}
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background: autoRotate ? 'rgba(34, 211, 238, 0.2)' : 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            color: autoRotate ? '#22d3ee' : '#94a3b8',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease'
          }}
          title="Toggle 360° Auto Rotation"
        >
          <RotateCw size={16} />
        </button>
      </div>

      {/* Prominent CTA Button - TÌM HIỂU NGAY */}
      <div style={{
        position: 'absolute',
        bottom: '36px',
        right: '36px',
        zIndex: 20
      }}>
        <button
          onClick={handleExplore}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 32px',
            borderRadius: '50px',
            border: '1px solid #d4af37',
            background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
            color: '#090a0c',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(212, 175, 55, 0.35)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: "'Cinzel', serif"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(212, 175, 55, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(212, 175, 55, 0.35)';
          }}
        >
          <span>TÌM HIỂU NGAY</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
