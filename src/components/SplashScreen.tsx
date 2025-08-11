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
          }, 500); // Wait a bit after reaching 100% before calling onComplete
          return 100;
        }
        return prev + 2; // Increment by 2% each time
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [onComplete]);
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-[#08090B] flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: progress === 100 ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-4xl font-light text-[#ededed] mb-8 font-sans">
        Swagat Chand
      </div>
      
      <div className="w-64 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-[#a3b8ef]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeInOut" }}
        />
      </div>
      
      <div className="mt-4 text-[#8a8a8a]">
        {progress}% Loading...
      </div>
    </motion.div>
  );
}
