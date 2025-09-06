'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll } from '@react-three/drei';
import * as THREE from 'three';

// This component handles the actual 3D scene and responds to scroll
function Scene({ children }: { children: React.ReactNode }) {
  const scroll = useScroll();
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  // Set initial camera position
  useEffect(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  // Update scene based on scroll
  useFrame(() => {
    if (groupRef.current) {
      // Move along z-axis based on scroll
      const scrollOffset = scroll.offset;
      
      // Move camera deeper into the scene as user scrolls
      camera.position.z = 5 - scrollOffset * 10;
      
      // Slightly rotate camera based on scroll for a more dynamic effect
      camera.rotation.x = scrollOffset * 0.1;
      
      // Update group position for parallax effect
      groupRef.current.position.y = scrollOffset * -2;
    }
  });
  
  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}

// Main component that sets up the Canvas and scroll container
export default function ZScrollScene({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState('200vh'); // Default scroll height

  console.log(scrollHeight);
  
  // Adjust scroll height based on content
  useEffect(() => {
    if (containerRef.current) {
      // Set scroll height to at least 2x viewport height to ensure enough scroll space
      setScrollHeight('300vh');
    }
  }, []);
  
  return (
    <div className="z-scroll-container">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ScrollControls pages={3} damping={0.2} distance={1}>
          <Scene>
            {children}
          </Scene>
        </ScrollControls>
        <fog attach="fog" args={['#08090B', 5, 20]} />
      </Canvas>
    </div>
  );
}
