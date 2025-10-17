"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ScrollObserver from "../components/ScrollObserver";
import "./zscroll.css";
import ZScrollScene from "../components/ZScrollScene";
import ZScrollContent from "../components/ZScrollContent";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag to prevent hydration mismatch
    setIsClient(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent hydration mismatch by not rendering responsive elements until client-side
  if (!isClient) {
    return (
      <main className="min-h-screen text-[#ededed] relative" style={{ background: 'radial-gradient(circle at bottom, #2C313D, #08090B)' }}>
        <ZScrollScene>
          <ZScrollContent/>
        </ZScrollScene>
        
        {/* Simple navigation for SSR */}
        <div className="z-scroll-overlay">
          <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-4 md:px-8 pt-4 md:pt-8 pb-4 z-50 bg-gradient-to-b from-[#08090B] to-transparent">
            <div className="mobile-logo">
              <span className="text-[#ededed] font-medium text-lg">SC</span>
            </div>
            <div className="mobile-menu-btn">
              <div className="flex flex-col justify-center items-center w-8 h-8 space-y-1">
                <span className="block w-6 h-0.5 bg-[#ededed]"></span>
                <span className="block w-6 h-0.5 bg-[#ededed]"></span>
                <span className="block w-6 h-0.5 bg-[#ededed]"></span>
              </div>
            </div>
          </nav>
        </div>
      </main>
    );
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Function to scroll to specific sections
  const scrollToSection = (sectionName: string) => {
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
    
    // Calculate scroll positions based on section
    const scrollPositions = {
      home: 0,
      skills: isMobile ? 0.215 : 0.2,
      projects: 0.33,
      experience: 0.6,
      education: 0.78,
      contact: 1
    };

    const targetPosition = scrollPositions[sectionName as keyof typeof scrollPositions] || 0;
    
    // Try multiple selectors to find the scroll container
    const possibleSelectors = [
      '.scroll',
      '[data-scroll]',
      '.r3f-scroll',
      'canvas + div',
      '.z-scroll-container div'
    ];
    
    let scrollContainer: HTMLElement | null = null;
    
    for (const selector of possibleSelectors) {
      scrollContainer = document.querySelector(selector) as HTMLElement;
      if (scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight) {
        break;
      }
    }
    
    // If no scroll container found, try to find any scrollable element
    if (!scrollContainer) {
      const allElements = document.querySelectorAll('*');
      for (const element of allElements) {
        const el = element as HTMLElement;
        if (el.scrollHeight > el.clientHeight && el.scrollTop !== undefined) {
          scrollContainer = el;
          break;
        }
      }
    }
    
    if (scrollContainer) {
      const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const targetScroll = maxScroll * targetPosition;

      // Smooth scroll to target position
      scrollContainer.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    } else {
      // Final fallback to document scroll
      const documentContainer = document.documentElement;
      const maxScroll = documentContainer.scrollHeight - window.innerHeight;
      const targetScroll = maxScroll * targetPosition;

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <ScrollObserver targetId="skills-section" threshold={0.2} rootMargin="-100px" />
    <main className="min-h-screen text-[#ededed] relative" style={{ background: 'radial-gradient(circle at bottom, #2C313D, #08090B)' }}>
      {/* 3D Scrolling Scene */}
      <ZScrollScene>
        <ZScrollContent/>
      </ZScrollScene>
      
      {/* Content Overlay - This will be visible on top of the 3D scene */}
      <div className="z-scroll-overlay">
        {/* Navigation - Fixed at the top */}
        <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-4 md:px-8 pt-4 md:pt-8 pb-4 z-50 bg-gradient-to-b from-[#08090B] to-transparent">
          {/* Logo/Brand - Mobile */}
          <div className="md:hidden mobile-logo">
            <Link href="/" className="text-[#ededed] font-medium text-lg">
              SC
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-16 mx-auto desktop-nav">
            <li>
              <button 
                onClick={() => scrollToSection('home')}
                className="text-[#ededed] font-medium hover:text-[#ffffff] transition-colors"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('skills')}
                className="text-[#8a8a8a] hover:text-[#ededed] transition-colors"
              >
                Skills
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('projects')}
                className="text-[#8a8a8a] hover:text-[#ededed] transition-colors"
              >
                Projects
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('experience')}
                className="text-[#8a8a8a] hover:text-[#ededed] transition-colors"
              >
                Experience
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('education')}
                className="text-[#8a8a8a] hover:text-[#ededed] transition-colors"
              >
                Education
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-[#8a8a8a] hover:text-[#ededed] transition-colors"
              >
                Contact
              </button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span 
              className={`block w-6 h-0.5 bg-[#ededed] transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span 
              className={`block w-6 h-0.5 bg-[#ededed] transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            ></span>
            <span 
              className={`block w-6 h-0.5 bg-[#ededed] transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            ></span>
          </button>

          {/* Mobile Menu Dropdown */}
          <div className={`md:hidden absolute top-full left-0 w-full bg-[#08090B] border-t border-[#2C313D] transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className="px-4 py-6 space-y-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="block w-full text-left text-[#ededed] font-medium text-lg hover:text-[#ffffff] transition-colors py-2"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('skills')}
                className="block w-full text-left text-[#8a8a8a] hover:text-[#ededed] transition-colors text-lg py-2"
              >
                Skills
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className="block w-full text-left text-[#8a8a8a] hover:text-[#ededed] transition-colors text-lg py-2"
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection('experience')}
                className="block w-full text-left text-[#8a8a8a] hover:text-[#ededed] transition-colors text-lg py-2"
              >
                Experience
              </button>
              <button
                onClick={() => scrollToSection('education')}
                className="block w-full text-left text-[#8a8a8a] hover:text-[#ededed] transition-colors text-lg py-2"
              >
                Education
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left text-[#8a8a8a] hover:text-[#ededed] transition-colors text-lg py-2"
              >
                Contact
              </button>
            </div>
          </div>
        </nav>
      </div>
    </main>
    </>
  );
}
