import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { countries } from '../data/countries';
import { useGameStore } from '../store/gameStore';
import { useAudio } from '../hooks/useAudio';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobeSceneProps {
  onSelectCountry: (countryId: string) => void;
}

// Convert lat/lng to 3D position on sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Atmosphere shader
function Atmosphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  const atmosphereShader = useMemo(
    () => ({
      uniforms: {},
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity * 1.5;
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
    }),
    []
  );

  return (
    <mesh ref={meshRef} scale={1.15}>
      <sphereGeometry args={[2, 64, 64]} />
      <shaderMaterial {...atmosphereShader} />
    </mesh>
  );
}

// Earth sphere with custom shader
function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        sunDirection: { value: new THREE.Vector3(1, 0, 0) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 sunDirection;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                             -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                 + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                                  dot(x12.zw,x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec3 oceanColor = vec3(0.635, 0.824, 1.0);
          vec3 landColor1 = vec3(0.757, 0.882, 0.757);
          vec3 landColor2 = vec3(0.565, 0.784, 0.565);
          vec3 polarColor = vec3(1.0, 1.0, 1.0);

          float noise1 = snoise(vUv * 6.0);
          float noise2 = snoise(vUv * 12.0 + vec2(100.0, 100.0));
          float noise3 = snoise(vUv * 3.0 + vec2(200.0, 200.0));

          float landMask = smoothstep(-0.1, 0.3, noise1 + noise2 * 0.3);

          // Continent shapes approximation
          float continentNoise = snoise(vUv * 4.0);
          continentNoise += snoise(vUv * 8.0) * 0.5;
          float continents = smoothstep(-0.2, 0.4, continentNoise);

          float isLand = landMask * continents;

          // Polar ice caps
          float polar = smoothstep(0.7, 0.9, abs(vUv.y - 0.5) * 2.0);

          vec3 color = mix(oceanColor, landColor1, isLand);
          color = mix(color, landColor2, isLand * noise2 * 0.5);
          color = mix(color, polarColor, polar * 0.8);

          // Soft lighting
          float light = dot(vNormal, normalize(vec3(1.0, 0.5, 0.3)));
          light = smoothstep(-0.2, 1.0, light);
          color *= 0.7 + light * 0.3;

          // Ocean shimmer
          float shimmer = snoise(vUv * 20.0 + time * 0.1) * 0.1;
          color += vec3(shimmer) * (1.0 - isLand);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
      earthMaterial.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.02 : 1}
    >
      <sphereGeometry args={[2, 64, 64]} />
      <primitive object={earthMaterial} attach="material" />
    </mesh>
  );
}

// Cloud layer
function Clouds() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.05}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial
        color="white"
        transparent
        opacity={0.15}
        depthWrite={false}
      />
    </mesh>
  );
}

// Landmark marker on the globe
function LandmarkMarker({
  country,
  onSelect,
}: {
  country: (typeof countries)[0];
  onSelect: (id: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const isUnlocked = useGameStore((s) => s.isCountryUnlocked(country.id));
  const isCompleted = useGameStore((s) => s.isCountryCompleted(country.id));
  const { playClick } = useAudio();

  const position = useMemo(
    () => latLngToVector3(country.position.lat, country.position.lng, 2.08),
    [country.position]
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.copy(position);
      meshRef.current.lookAt(0, 0, 0);
      // Bobbing animation
      const bobOffset = Math.sin(state.clock.elapsedTime * 2 + country.position.lat) * 0.05;
      meshRef.current.position.add(
        position.clone().normalize().multiplyScalar(bobOffset)
      );
    }
  });

  if (!isUnlocked) {
    return (
      <mesh ref={meshRef} position={position} lookAt={[0, 0, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#999" transparent opacity={0.5} />
      </mesh>
    );
  }

  return (
    <group>
      {/* Glow ring */}
      <mesh position={position} ref={meshRef}>
        <ringGeometry args={[0.08, 0.12, 32]} />
        <meshBasicMaterial
          color={country.color}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Clickable sphere */}
      <mesh
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          playClick();
          onSelect(country.id);
        }}
        scale={hovered ? 1.5 : 1}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={country.color}
          emissive={country.color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Star for completed */}
      {isCompleted && (
        <mesh position={position.clone().add(new THREE.Vector3(0, 0.15, 0))}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}

// Scene setup
function Scene({ onSelectCountry }: { onSelectCountry: (id: string) => void }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#FFF8DC" />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#87CEEB" />

      {/* Stars background */}
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0.3} fade speed={1} />

      {/* Earth */}
      <Earth />
      <Atmosphere />
      <Clouds />

      {/* Landmarks */}
      {countries.map((country) => (
        <LandmarkMarker
          key={country.id}
          country={country}
          onSelect={onSelectCountry}
        />
      ))}

      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

// Country tooltip
function CountryTooltip({
  country,
  visible,
}: {
  country: (typeof countries)[0] | null;
  visible: boolean;
}) {
  if (!country || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-xl border-2 border-white/50 z-30"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{country.flag}</span>
          <div>
            <p className="font-bold text-slate-800 text-lg">{country.name}</p>
            <p className="text-slate-500 text-sm">{country.continent}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function GlobeScene({ onSelectCountry }: GlobeSceneProps) {
  const [hoveredCountry] = useState<(typeof countries)[0] | null>(
    null
  );

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene onSelectCountry={onSelectCountry} />
      </Canvas>

      {/* Country name tooltip */}
      <CountryTooltip country={hoveredCountry} visible={!!hoveredCountry} />

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border-2 border-white/50 z-20">
        <p className="text-slate-600 font-medium text-sm text-center">
          🖱️ Drag to rotate • Tap glowing dots to travel! 🌎
        </p>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-6 right-4 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border-2 border-white/50 z-20">
        <p className="text-slate-600 text-sm font-medium">
          {useGameStore.getState().completedCountries.length} / {countries.length}{' '}
          Countries
        </p>
      </div>
    </div>
  );
}
