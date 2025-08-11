'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const updateCursorType = () => {
      const hoveredElement = document.elementFromPoint(position.x, position.y);
      const isClickable = 
        hoveredElement?.tagName === 'A' || 
        hoveredElement?.tagName === 'BUTTON' ||
        hoveredElement?.closest('a') !== null || 
        hoveredElement?.closest('button') !== null ||
        window.getComputedStyle(hoveredElement || document.body).cursor === 'pointer';
      
      setIsPointer(!!isClickable);
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    
    const interval = setInterval(updateCursorType, 100);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      clearInterval(interval);
    };
  }, [position.x, position.y]);
  
  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 z-50 pointer-events-none"
        animate={{
          x: position.x - 8,
          y: position.y - 8,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 500,
          restDelta: 0.001
        }}
      >
        <div 
          className={`w-4 h-4 rounded-full ${isPointer ? 'bg-transparent border-2 border-[#a3b8ef] w-6 h-6' : 'bg-[#a3b8ef]'}`}
          style={{ 
            mixBlendMode: 'difference',
            transition: 'width 0.2s, height 0.2s, background-color 0.2s'
          }}
        />
      </motion.div>
      
      {/* Cursor trail */}
      <motion.div
        className="fixed top-0 left-0 z-40 pointer-events-none"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
        }}
        transition={{
          type: 'spring',
          damping: 50,
          stiffness: 300,
          restDelta: 0.001
        }}
      >
        <div 
          className="w-2 h-2 rounded-full bg-[#a3b8ef] opacity-50"
          style={{ mixBlendMode: 'difference' }}
        />
      </motion.div>
    </>
  );
}
