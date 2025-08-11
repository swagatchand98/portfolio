'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { ThreeOptimizer } from '../utils/threeOptimizer';
import { useScreenSize, useQualitySettings } from '../utils/mobileOptimizer';

// This component handles the actual 3D scene and responds to scroll
function Scene({ children }: { children: React.ReactNode }) {
  const scroll = useScroll();
  const { camera, gl } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  // const qualitySettings = useQualitySettings();
  
  // Set initial camera position
  useEffect(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    
    // Optimize renderer
    ThreeOptimizer.optimizeRenderer(gl);
    
    // Store current ref value to use in cleanup
    const group = groupRef.current;
    
    // Clean up on unmount
    return () => {
      // Clean up any Three.js resources using stored reference
      if (group) {
        ThreeOptimizer.disposeObject(group);
      }
    };
  }, [camera, gl]);
  
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
  const [scrollHeight, setScrollHeight] = useState('300vh'); // Default scroll height
  const screenSize = useScreenSize();
  const qualitySettings = useQualitySettings();
  
  console.log(scrollHeight);
  // Adjust scroll height based on content and screen size
  useEffect(() => {
    if (containerRef.current) {
      // Set scroll height to at least 3x viewport height to ensure enough scroll space
      // Adjust for mobile devices
      setScrollHeight(screenSize.isMobile ? '250vh' : '300vh');
    }
  }, [screenSize.isMobile]);
  
  // Memoize performance settings based on device capabilities
  const performanceSettings = useMemo(() => {
    return {
      // Adjust shadow map size based on device capabilities
      shadowMapSize: qualitySettings.shadowQuality === 'high' ? 2048 : 
                     qualitySettings.shadowQuality === 'medium' ? 1024 : 
                     qualitySettings.shadowQuality === 'low' ? 512 : 0,
      // Enable shadows based on quality settings
      shadows: qualitySettings.shadowQuality !== 'off',
      // Set power preference for better battery life on mobile
      powerPreference: screenSize.isMobile ? 'high-performance' : 'default',
      // Set pixel ratio based on device capabilities
      dpr: [0.5, 2], // Will be handled by AdaptiveDpr
    };
  }, [qualitySettings, screenSize.isMobile]);
  
  return (
    <div className="z-scroll-container" ref={containerRef}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: screenSize.isMobile ? 70 : 60 }}
        shadows={performanceSettings.shadows}
        gl={{
          antialias: !screenSize.isMobile, // Disable antialiasing on mobile for better performance
          powerPreference: performanceSettings.powerPreference as WebGLPowerPreference,
          alpha: false, // Disable alpha for better performance
          stencil: false, // Disable stencil for better performance
          depth: true, // Keep depth buffer
        }}
      >
        {/* Performance optimizations */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <Preload all />
        
        <ScrollControls 
          pages={screenSize.isMobile ? 2.5 : 3} 
          damping={screenSize.isMobile ? 0.15 : 0.2} 
          distance={1}
        >
          <Scene>
            {children}
          </Scene>
        </ScrollControls>
        
        <fog attach="fog" args={['#08090B', 5, 20]} />
      </Canvas>
    </div>
  );
}
