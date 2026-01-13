'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useRef, useMemo, Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';

// Vertex Shader: Standard plane mapping with simple displacement
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment Shader: Liquid Distortion & Chromatic Aberration
const fragmentShader = `
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Liquid Wave Effect
  float wave = sin(uv.y * 10.0 + uTime) * 0.005;
  float waveX = cos(uv.x * 10.0 + uTime) * 0.005;
  
  // Mouse Interaction (Distortion)
  float dist = distance(uv, uMouse);
  float strength = 0.5 * exp(-dist * 2.0); // localized warp
  
  vec2 distortedUv = uv + vec2(wave + strength * 0.02, waveX + strength * 0.02);

  // Chromatic Aberration (RGB Split)
  float r = texture2D(uTexture, distortedUv + vec2(0.005, 0.0)).r;
  float g = texture2D(uTexture, distortedUv).g;
  float b = texture2D(uTexture, distortedUv - vec2(0.005, 0.0)).b;
  float a = texture2D(uTexture, distortedUv).a;

  gl_FragColor = vec4(r, g, b, a);
}
`;

const ImagePlane = ({ mouse }: { mouse: React.MutableRefObject<THREE.Vector2> }) => {
    const mesh = useRef<THREE.Mesh>(null);
    const texture = useLoader(TextureLoader, '/assets/ashborn_character_solo.png');

    const uniforms = useMemo(() => ({
        uTexture: { value: texture },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 }
    }), [texture]);

    useFrame((state) => {
        if (mesh.current) {
            // Smoothly interpolate mouse uniform
            uniforms.uMouse.value.lerp(mouse.current, 0.05);
            uniforms.uTime.value = state.clock.getElapsedTime();

            // Hover Float effect
            mesh.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
        }
    });

    return (
        <mesh ref={mesh} scale={[6, 8, 1]}> {/* Adjust scale to fit aspect ratio */}
            <planeGeometry args={[1, 1, 32, 32]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
            />
        </mesh>
    );
};

export default function LiquidHero() {
    const mouse = useRef(new THREE.Vector2(0.5, 0.5));

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.set(
                e.clientX / window.innerWidth,
                1.0 - (e.clientY / window.innerHeight)
            );
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="w-full h-full absolute inset-0 z-20 pointer-events-none">
            <Suspense fallback={null}>
                <Canvas camera={{ position: [0, 0, 5] }} gl={{ alpha: true }}>
                    <ImagePlane mouse={mouse} />
                </Canvas>
            </Suspense>
        </div>
    );
}
