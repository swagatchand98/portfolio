'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }
        return prev + 1.5;
      });
    }, 60);
    
    return () => clearInterval(interval);
  }, [onComplete]);
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-[#08090B] flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: progress === 100 ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Minimal Logo */}
      {/* <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1 
          className="text-2xl font-light text-white tracking-wider"
          style={{ fontFamily: 'var(--font-opening-hours, sans-serif)' }}
        >
          Swagat Chand
        </motion.h1>
      </motion.div> */}

      {/* Minimal Progress Indicator */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {/* Thin Progress Line */}
        <div className="w-48 h-px bg-[#1a1a1a] relative">
          <motion.div 
            className="absolute left-0 top-0 h-px bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          />
        </div>
        
        {/* Progress Percentage */}
        <motion.div 
          className="mt-6 text-center text-xs text-[#666] font-mono tracking-widest"
          animate={{ opacity: progress === 100 ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {Math.round(progress).toString().padStart(2, '0')}
        </motion.div>
      </motion.div>

      {/* Completion Check */}
      <motion.div
        className="absolute"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: progress === 100 ? 1 : 0,
          scale: progress === 100 ? 1 : 0
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: progress === 100 ? 1 : 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
