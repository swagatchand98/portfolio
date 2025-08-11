'use client';

import { useEffect, useRef } from 'react';

interface ScrollObserverProps {
  targetId: string;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export default function ScrollObserver({
  targetId,
  threshold = 0.1,
  rootMargin = '0px',
  className = 'in-view'
}: ScrollObserverProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create a new IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Add or remove the class based on intersection
          if (entry.isIntersecting) {
            entry.target.classList.add(className);
          } else {
            entry.target.classList.remove(className);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    // Get the target element
    const targetElement = document.getElementById(targetId);
    
    // Observe the target if it exists
    if (targetElement && observerRef.current) {
      observerRef.current.observe(targetElement);
    }

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [targetId, threshold, rootMargin, className]);

  // This component doesn't render anything
  return null;
}
