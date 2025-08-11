'use client';

import { useEffect, useRef, useState } from 'react';
import { useScreenSize } from '../utils/mobileOptimizer';

interface AnimatedGridProps {
  cellSize?: number;
  expandRadius?: number;
  expandScale?: number;
  color?: string;
}

export default function AnimatedGrid({
  cellSize = 20,
  expandRadius = 150,
  expandScale = 1.5,
  color = '#18181b'
}: AnimatedGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const screenSize = useScreenSize();
  // const qualitySettings = useQualitySettings();
  const [isVisible, setIsVisible] = useState(true);
  
  // Adjust parameters based on device capabilities
  const optimizedCellSize = screenSize.isMobile ? cellSize * 1.5 : cellSize;
  const optimizedExpandRadius = screenSize.isMobile ? expandRadius * 0.7 : expandRadius;
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Create a canvas element for better performance
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true, // Use desynchronized context for better performance when available
    })!;
    
    // Set canvas size to match container
    const updateCanvasSize = () => {
      // Use devicePixelRatio for high-DPI displays, but limit on mobile
      const pixelRatio = screenSize.isMobile ? 
        Math.min(window.devicePixelRatio || 1, 2) : 
        window.devicePixelRatio || 1;
      
      // Set canvas dimensions
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      
      // Scale canvas CSS size
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      // Scale context to match pixel ratio
      ctx.scale(pixelRatio, pixelRatio);
      
      drawGrid();
    };
    
    // Append canvas to container
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);
    
    // Mouse position
    let mouseX = -1000;
    let mouseY = -1000;
    
    // Draw grid function with performance optimizations
    const drawGrid = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
      
      // Skip rendering if not visible
      if (!isVisible) return;
      
      // Calculate grid dimensions
      const cols = Math.ceil(window.innerWidth / optimizedCellSize) + 1;
      const rows = Math.ceil(window.innerHeight / optimizedCellSize) + 1;
      
      // Performance optimization: reduce grid density on mobile
      const skipFactor = screenSize.isMobile ? 2 : 1;
      
      // Batch drawing operations for better performance
      ctx.beginPath();
      
      // Draw grid
      for (let y = 0; y < rows; y += skipFactor) {
        for (let x = 0; x < cols; x += skipFactor) {
          const cellX = x * optimizedCellSize;
          const cellY = y * optimizedCellSize;
          
          // Calculate distance from mouse
          const dx = mouseX - cellX;
          const dy = mouseY - cellY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Skip cells that are far from mouse on mobile for better performance
          if (screenSize.isMobile && distance > optimizedExpandRadius * 1.5) continue;
          
          // Calculate scale based on distance
          let scale = 1;
          const alpha = 1;
          let cellColor = color;
          
          if (distance < optimizedExpandRadius) {
            scale = 1 + (expandScale - 1) * (1 - distance / optimizedExpandRadius);
            
            // Change color based on distance
            const blueIntensity = Math.floor(255 * (1 - distance / optimizedExpandRadius));
            cellColor = `rgba(108, 169, ${blueIntensity + 100}, ${alpha})`;
            
            // Apply scale transformation
            const scaledSize = optimizedCellSize * scale;
            const offsetX = (scaledSize - optimizedCellSize) / 2;
            const offsetY = (scaledSize - optimizedCellSize) / 2;
            
            ctx.strokeStyle = cellColor;
            ctx.lineWidth = 1;
            
            // Draw right border
            ctx.moveTo(cellX + optimizedCellSize - offsetX, cellY - offsetY);
            ctx.lineTo(cellX + optimizedCellSize - offsetX, cellY + optimizedCellSize - offsetY);
            
            // Draw bottom border
            ctx.moveTo(cellX - offsetX, cellY + optimizedCellSize - offsetY);
            ctx.lineTo(cellX + optimizedCellSize - offsetX, cellY + optimizedCellSize - offsetY);
          } else {
            // For cells outside the influence radius, draw them more efficiently
            ctx.strokeStyle = cellColor;
            ctx.lineWidth = 1;
            
            // Draw right border
            ctx.moveTo(cellX + optimizedCellSize, cellY);
            ctx.lineTo(cellX + optimizedCellSize, cellY + optimizedCellSize);
            
            // Draw bottom border
            ctx.moveTo(cellX, cellY + optimizedCellSize);
            ctx.lineTo(cellX + optimizedCellSize, cellY + optimizedCellSize);
          }
        }
      }
      
      // Draw all lines at once
      ctx.stroke();
    };
    
    // Animation frame with throttling for better performance
    let animationFrameId: number;
    let lastDrawTime = 0;
    const frameInterval = screenSize.isMobile ? 1000 / 30 : 1000 / 60; // 30 FPS on mobile, 60 FPS on desktop
    
    const animate = (timestamp: number) => {
      // Throttle drawing based on device capabilities
      if (timestamp - lastDrawTime >= frameInterval) {
        drawGrid();
        lastDrawTime = timestamp;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Start animation
    updateCanvasSize();
    animationFrameId = requestAnimationFrame(animate);
    
    // Mouse move handler with throttling for better performance
    let lastMoveTime = 0;
    const moveThrottle = screenSize.isMobile ? 50 : 10; // ms
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveTime >= moveThrottle) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        lastMoveTime = now;
      }
    };
    
    // Touch move handler for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const now = Date.now();
        if (now - lastMoveTime >= moveThrottle) {
          mouseX = e.touches[0].clientX;
          mouseY = e.touches[0].clientY;
          lastMoveTime = now;
        }
      }
    };
    
    // Window resize handler with debouncing
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateCanvasSize();
      }, 100);
    };
    
    // Visibility change handler to pause animation when not visible
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, [optimizedCellSize, optimizedExpandRadius, expandScale, color, screenSize.isMobile, isVisible]);
  
  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
}
