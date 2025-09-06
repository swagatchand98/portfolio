'use client';

import { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineWrapperProps {
  scene: string;
}

export default function SplineWrapper({ scene }: SplineWrapperProps) {
  return (
    <div className="relative w-full h-[600px] flex items-end">
      <Suspense fallback={<div className="w-full h-[400px] flex items-center justify-center">Loading 3D model...</div>}>
        <div className="w-full h-full">
          <Spline scene={scene} />
        </div>
      </Suspense>
    </div>
  );
}
