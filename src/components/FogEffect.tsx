'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Custom shader for realistic fog effect
const fogShader = {
  uniforms: {
    tDiffuse: { value: null },
    fogColor: { value: new THREE.Color(0x08090B) },
    fogDensity: { value: 0.05 },
    time: { value: 0 },
    noiseScale: { value: 1.0 },
    noiseSpeed: { value: 0.2 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 fogColor;
    uniform float fogDensity;
    uniform float time;
    uniform float noiseScale;
    uniform float noiseSpeed;
    
    varying vec2 vUv;
    
    // Simple noise function
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    // Smoothed noise
    float smoothNoise(vec2 p) {
      vec2 ip = floor(p);
      vec2 fp = fract(p);
      
      vec2 u = fp * fp * (3.0 - 2.0 * fp);
      
      float a = noise(ip);
      float b = noise(ip + vec2(1.0, 0.0));
      float c = noise(ip + vec2(0.0, 1.0));
      float d = noise(ip + vec2(1.0, 1.0));
      
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }
    
    // Fractal Brownian Motion
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 0.0;
      
      for (int i = 0; i < 6; i++) {
        value += amplitude * smoothNoise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      
      return value;
    }
    
    void main() {
      // Sample the original scene
      vec4 originalColor = texture2D(tDiffuse, vUv);
      
      // Create animated noise pattern for fog
      vec2 p = vUv * noiseScale;
      p.x += time * noiseSpeed;
      float noise = fbm(p);
      
      // Calculate fog factor based on noise
      float fogFactor = fogDensity * noise;
      fogFactor = clamp(fogFactor, 0.0, 1.0);
      
      // Mix original color with fog color
      vec3 finalColor = mix(originalColor.rgb, fogColor, fogFactor);
      
      gl_FragColor = vec4(finalColor, originalColor.a);
    }
  `
};

interface FogEffectProps {
  density?: number;
  scrollProgress?: number;
}

export default function FogEffect({ density = 0.05, scrollProgress = 0 }: FogEffectProps) {
  const { scene, camera, gl } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  
  // Create shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        fogColor: { value: new THREE.Color(0x08090B) },
        fogDensity: { value: density },
        time: { value: 0 },
        noiseScale: { value: 1.0 },
        noiseSpeed: { value: 0.2 },
      },
      vertexShader: fogShader.vertexShader,
      fragmentShader: fogShader.fragmentShader,
      transparent: true,
    });
  }, [density]);
  
  // Set up render target and pass
  useEffect(() => {
    if (!materialRef.current) return;
    
    // Update material reference
    materialRef.current = shaderMaterial;
    
    // Update fog density based on scroll progress
    if (scrollProgress >= 0.2 && scrollProgress < 0.6) {
      // Increase fog density during the fog scene
      const fogIntensity = (scrollProgress - 0.2) / 0.4; // 0 to 1 as scroll goes from 0.2 to 0.6
      materialRef.current.uniforms.fogDensity.value = THREE.MathUtils.lerp(0.05, 0.3, fogIntensity);
    } else if (scrollProgress >= 0.6) {
      // Decrease fog density after the fog scene
      const fogDissipation = Math.min(1, (scrollProgress - 0.6) / 0.2); // 0 to 1 as scroll goes from 0.6 to 0.8
      materialRef.current.uniforms.fogDensity.value = THREE.MathUtils.lerp(0.3, 0.05, fogDissipation);
    }
  }, [shaderMaterial, scrollProgress]);
  
  // Animate fog
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });
  
  return (
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[20, 20]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}
