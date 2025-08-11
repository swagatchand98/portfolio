'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SplashScreen from './SplashScreen';

// Dynamically import the CustomCursor component
const CustomCursor = dynamic(() => import('./CustomCursor'));

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  const handleSplashComplete = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && <SplashScreen onComplete={handleSplashComplete} />}
      <CustomCursor />
      <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
        {children}
      </div>
    </>
  );
}
