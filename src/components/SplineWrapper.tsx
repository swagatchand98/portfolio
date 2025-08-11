'use client';

import { Suspense, useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { useScreenSize, useQualitySettings } from '../utils/mobileOptimizer';

interface SplineWrapperProps {
  scene: string;
}

export default function SplineWrapper({ scene }: SplineWrapperProps) {
  const screenSize = useScreenSize();
  const qualitySettings = useQualitySettings();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Adjust height based on screen size
  const height = screenSize.isMobile ? '800px' : '600px';
  const fallbackHeight = screenSize.isMobile ? '300px' : '400px';
  
  // Handle loading progress
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (isLoading) {
      // Simulate loading progress
      progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 300);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isLoading]);
  
  // Handle Spline load complete
  const handleSplineLoad = () => {
    setLoadingProgress(100);
    setTimeout(() => setIsLoading(false), 500);
  };
  
  return (
    <div className="relative w-full flex items-end" style={{ height: height }}>
      <Suspense 
        fallback={
          <div className="w-full flex flex-col items-center justify-center" style={{ height: fallbackHeight }}>
            <div className="mb-4 text-center">Loading 3D model...</div>
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="mt-2 text-sm">{Math.round(loadingProgress)}%</div>
          </div>
        }
      >
        <div className="w-full h-full">
          <Spline 
            scene={scene} 
            onLoad={handleSplineLoad}
            style={{
              // Apply optimizations based on device capabilities
              filter: qualitySettings.effectsQuality === 'low' ? 'blur(0.5px)' : 'none',
              transform: screenSize.isMobile ? 'scale(0.85)' : 'none',
              transformOrigin: 'center center',
            }}
          />
        </div>
      </Suspense>
    </div>
  );
}
