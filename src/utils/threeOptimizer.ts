'use client';

import * as THREE from 'three';

/**
 * Utility class for Three.js optimizations
 */
export class ThreeOptimizer {
  /**
   * Disposes of Three.js objects properly to prevent memory leaks
   */
  static disposeObject(object: THREE.Object3D): void {
    if (!object) return;

    // Process all children recursively
    if (object.children && object.children.length > 0) {
      // Create a copy of children array as it might be modified during disposal
      const children = [...object.children];
      for (const child of children) {
        ThreeOptimizer.disposeObject(child);
      }
    }

    // Dispose geometries
    if ((object as THREE.Mesh).geometry) {
      (object as THREE.Mesh).geometry.dispose();
    }

    // Dispose materials
    if ((object as THREE.Mesh).material) {
      const material = (object as THREE.Mesh).material;
      
      if (Array.isArray(material)) {
        material.forEach(mat => {
          disposeMaterial(mat);
        });
      } else {
        disposeMaterial(material);
      }
    }

    // Remove from parent
    if (object.parent) {
      object.parent.remove(object);
    }
  }

  /**
   * Optimizes renderer settings based on device capabilities
   */
  static optimizeRenderer(renderer: THREE.WebGLRenderer): void {
    const capabilities = detectDeviceCapabilities();
    
    // Set pixel ratio based on device capabilities
    renderer.setPixelRatio(capabilities.recommendedPixelRatio);
    
    // Enable shadow map optimization
    if (renderer.shadowMap.enabled) {
      renderer.shadowMap.type = capabilities.isLowPowerDevice 
        ? THREE.BasicShadowMap 
        : THREE.PCFSoftShadowMap;
    }
    
    // Enable tone mapping for better color reproduction
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    
    // Using a more specific type for compatibility with different Three.js versions
    interface RendererWithLegacyLights extends THREE.WebGLRenderer {
      useLegacyLights?: boolean;
    }
    (renderer as RendererWithLegacyLights).useLegacyLights = false;
  }
}

/**
 * Helper function to dispose a single material
 */
function disposeMaterial(material: THREE.Material): void {
  // Dispose textures
  for (const value of Object.values(material)) {
    if (value instanceof THREE.Texture) {
      value.dispose();
    }
  }
  material.dispose();
}

/**
 * Detects device capabilities to adjust rendering quality
 */
function detectDeviceCapabilities(): {
  isMobile: boolean;
  isLowPowerDevice: boolean;
  maxTextureSize: number;
  recommendedPixelRatio: number;
} {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    typeof navigator !== 'undefined' ? navigator.userAgent : ''
  );
  
  // Estimate if this is a low power device
  const isLowPowerDevice = isMobile || 
    (typeof navigator !== 'undefined' && 
     navigator.hardwareConcurrency !== undefined && 
     navigator.hardwareConcurrency <= 4);
  
  // Determine max texture size based on device
  const maxTextureSize = isLowPowerDevice ? 1024 : 2048;
  
  // Adjust pixel ratio based on device capabilities
  const recommendedPixelRatio = isLowPowerDevice 
    ? Math.min(1.5, window.devicePixelRatio || 1)
    : Math.min(2, window.devicePixelRatio || 1);
  
  return {
    isMobile,
    isLowPowerDevice,
    maxTextureSize,
    recommendedPixelRatio
  };
}

/**
 * Hook to detect if the current device is mobile
 */
export function useIsMobile(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Hook to get the device pixel ratio with a safe default
 */
export function useDevicePixelRatio(): number {
  if (typeof window === 'undefined') return 1;
  
  const capabilities = detectDeviceCapabilities();
  return capabilities.recommendedPixelRatio;
}
