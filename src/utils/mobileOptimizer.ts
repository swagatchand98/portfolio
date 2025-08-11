'use client';

import { useEffect, useState } from 'react';

/**
 * Breakpoints for responsive design
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Hook to detect current screen size and breakpoint
 * @returns Object with screen information and breakpoint helpers
 */
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({
        width,
        height,
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg,
      });
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}

/**
 * Hook to detect device orientation
 * @returns Current orientation (portrait or landscape)
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState({
    isPortrait: true,
    isLandscape: false,
    angle: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOrientationChange = () => {
      const angle = window.screen.orientation?.angle || 0;
      const isPortrait = window.innerHeight > window.innerWidth;
      
      setOrientation({
        isPortrait,
        isLandscape: !isPortrait,
        angle,
      });
    };

    // Set initial orientation
    handleOrientationChange();

    // Add event listeners
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return orientation;
}

/**
 * Hook to detect touch capability
 * @returns Boolean indicating if touch is supported
 */
export function useTouchCapability() {
  const [hasTouch, setHasTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const navigatorWithMSTouch = navigator as Navigator & { msMaxTouchPoints?: number };
    setHasTouch(
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      (navigatorWithMSTouch.msMaxTouchPoints !== undefined && navigatorWithMSTouch.msMaxTouchPoints > 0)
    );
  }, []);

  return hasTouch;
}

/**
 * Utility class for mobile optimizations
 */
export class MobileOptimizer {
  /**
   * Detects if the current device is a mobile device
   * @returns Boolean indicating if the device is mobile
   */
  static isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  /**
   * Detects if the current device is a low-end device
   * @returns Boolean indicating if the device is low-end
   */
  static isLowEndDevice(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Check for hardware concurrency (CPU cores)
    const lowCpuCores = navigator.hardwareConcurrency !== undefined && 
                        navigator.hardwareConcurrency <= 4;
    
    // Check for device memory (if available)
    const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
    const lowMemory = navigatorWithMemory.deviceMemory !== undefined && 
                      navigatorWithMemory.deviceMemory <= 4;
    
    // Check for mobile device
    const isMobile = this.isMobileDevice();
    
    return (lowCpuCores || lowMemory || isMobile);
  }

  /**
   * Gets recommended quality settings based on device capabilities
   * @returns Object with recommended quality settings
   */
  static getQualitySettings(): {
    particleCount: number;
    shadowQuality: 'off' | 'low' | 'medium' | 'high';
    textureQuality: 'low' | 'medium' | 'high';
    effectsQuality: 'low' | 'medium' | 'high';
    maxLights: number;
  } {
    const isLowEnd = this.isLowEndDevice();
    const isMobile = this.isMobileDevice();
    
    if (isLowEnd) {
      return {
        particleCount: 100,
        shadowQuality: 'off',
        textureQuality: 'low',
        effectsQuality: 'low',
        maxLights: 2,
      };
    } else if (isMobile) {
      return {
        particleCount: 200,
        shadowQuality: 'low',
        textureQuality: 'medium',
        effectsQuality: 'medium',
        maxLights: 4,
      };
    } else {
      return {
        particleCount: 500,
        shadowQuality: 'high',
        textureQuality: 'high',
        effectsQuality: 'high',
        maxLights: 8,
      };
    }
  }

  /**
   * Optimizes touch interactions for mobile devices
   * @param element - The DOM element to optimize
   * @returns Cleanup function to remove event listeners
   */
  static optimizeTouchInteractions(element: HTMLElement): (() => void) | undefined {
    if (!element) return;
    
    // Prevent default touch actions that might cause lag
    element.style.touchAction = 'none';
    
    // Add touch event listeners with passive option for better performance
    const options = { passive: true };
    
    const noop = () => {};
    element.addEventListener('touchstart', noop, options);
    element.addEventListener('touchmove', noop, options);
    element.addEventListener('touchend', noop, options);
    
    // Clean up function to remove listeners
    return () => {
      element.removeEventListener('touchstart', noop);
      element.removeEventListener('touchmove', noop);
      element.removeEventListener('touchend', noop);
    };
  }

  /**
   * Adds viewport meta tags for proper mobile rendering
   */
  static addViewportMetaTags(): void {
    if (typeof document === 'undefined') return;
    
    // Check if viewport meta tag already exists
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    if (!viewportMeta) {
      // Create viewport meta tag if it doesn't exist
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }
    
    // Set viewport properties for optimal mobile experience
    viewportMeta.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
    );
  }
}

/**
 * Hook to get quality settings based on device capabilities
 * @returns Object with quality settings
 */
export function useQualitySettings() {
  const [settings, setSettings] = useState(MobileOptimizer.getQualitySettings());
  
  useEffect(() => {
    // Update settings on mount to ensure client-side values
    setSettings(MobileOptimizer.getQualitySettings());
  }, []);
  
  return settings;
}
