'use client';

import { useEffect, useRef } from 'react';

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
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    // const containerRect = container.getBoundingClientRect();
    
    // Create a canvas element for better performance
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size to match container
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
    
    // Draw grid function
    const drawGrid = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate grid dimensions
      const cols = Math.ceil(canvas.width / cellSize) + 1;
      const rows = Math.ceil(canvas.height / cellSize) + 1;
      
      // Draw grid
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const cellX = x * cellSize;
          const cellY = y * cellSize;
          
          // Calculate distance from mouse
          const dx = mouseX - cellX;
          const dy = mouseY - cellY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Calculate scale based on distance
          let scale = 1;
          const alpha = 1;
          let cellColor = color;
          
          if (distance < expandRadius) {
            scale = 1 + (expandScale - 1) * (1 - distance / expandRadius);
            
            // Change color based on distance
            const blueIntensity = Math.floor(255 * (1 - distance / expandRadius));
            cellColor = `rgba(108, 169, ${blueIntensity + 100}, ${alpha})`;
          }
          
          // Draw cell with scale
          ctx.beginPath();
          
          // Apply scale transformation
          const scaledSize = cellSize * scale;
          const offsetX = (scaledSize - cellSize) / 2;
          const offsetY = (scaledSize - cellSize) / 2;
          
          ctx.strokeStyle = cellColor;
          ctx.lineWidth = 1;
          
          // Draw right border
          ctx.moveTo(cellX + cellSize - offsetX, cellY - offsetY);
          ctx.lineTo(cellX + cellSize - offsetX, cellY + cellSize - offsetY);
          
          // Draw bottom border
          ctx.moveTo(cellX - offsetX, cellY + cellSize - offsetY);
          ctx.lineTo(cellX + cellSize - offsetX, cellY + cellSize - offsetY);
          
          ctx.stroke();
        }
      }
    };
    
    // Animation frame
    let animationFrameId: number;
    const animate = () => {
      drawGrid();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Start animation
    updateCanvasSize();
    animate();
    
    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    // Window resize handler
    const handleResize = () => {
      updateCanvasSize();
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, [cellSize, expandRadius, expandScale, color]);
  
  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
}
