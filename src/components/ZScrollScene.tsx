'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll } from '@react-three/drei';
import * as THREE from 'three';

// Mobile detection utility
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

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
      const scrollOffset = scroll.offset * 2;
      
      // Move camera deeper into the scene as user scrolls
      camera.position.z = 5 - scrollOffset * 18;
      
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
  const [scrollHeight, setScrollHeight] = useState('200vh');
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
    
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Adjust scroll height based on content
  useEffect(() => {
    if (containerRef.current) {
      setScrollHeight(mobile ? '1000vh' : '2800vh');
    }
  }, [mobile]);
  
  // Mobile-optimized renderer settings
  const canvasSettings = mobile ? {
    dpr: [1, 1.5], // Limit pixel ratio on mobile
    performance: { min: 0.8 }, // Maintain 80% performance
    antialias: false, // Disable antialiasing on mobile
    alpha: false, // Disable alpha for better performance
    powerPreference: "high-performance" as const,
  } : {
    dpr: [1, 2],
    antialias: true,
    alpha: true,
  };
  
  return (
    <div className="z-scroll-container">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: mobile ? 70 : 60 }}
        gl={canvasSettings}
        shadows={!mobile} // Disable shadows on mobile
      >
        <ScrollControls pages={mobile ? 6 : 12} damping={mobile ? 0.3 : 0.2} distance={2}>
          <Scene>
            {children}
          </Scene>
        </ScrollControls>
        <fog attach="fog" args={['#08090B', mobile ? 3 : 5, mobile ? 15 : 20]} />
      </Canvas>
    </div>
  );
}
