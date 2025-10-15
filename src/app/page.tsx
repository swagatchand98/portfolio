"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
// import SplineWrapper from "../components/SplineWrapper";
import ScrollObserver from "../components/ScrollObserver";
import "./zscroll.css";

// Dynamically import components
// const AnimatedGrid = dynamic(() => import("../components/AnimatedGrid"));
const ZScrollScene = dynamic(() => import("../components/ZScrollScene"), { ssr: false });
const ZScrollContent = dynamic(() => import("../components/ZScrollContent"), { ssr: false });

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Mobile detection
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    setIsMobileDevice(checkMobile());
    
    const handleResize = () => setIsMobileDevice(checkMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Close mobile menu when clicking outside or on a link
  useEffect(() => {
    const handleClickOutside = () => {
      if (mobileMenuOpen) setMobileMenuOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);
  
  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);
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
        <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-4 md:px-8 lg:justify-center pt-6 md:pt-8 pb-4 z-50 bg-gradient-to-b from-[#08090B] to-transparent">
          {/* Logo for mobile */}
          <div className="md:hidden">
            <Link href="/" className="text-[#ededed] font-bold text-xl">
              Portfolio
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex md:space-x-8 lg:space-x-16">
            <li>
              <Link href="/" className="text-[#ededed] font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#skills-section"
                className="text-[#8a8a8a] hover:text-[#ededed] transition-colors"
              >
                Skills
              </Link>
            </li>
            <li>
              <Link
                href="#projects-section"
                className="text-[#8a8a8a] hover:text-[#ededed] transition-colors"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="#experience-section"
                className="text-[#8a8a8a] hover:text-[#ededed] transition-colors"
              >
                Experience
              </Link>
            </li>
            <li>
              <Link
                href="#education-section"
                className="text-[#8a8a8a] hover:text-[#ededed] transition-colors"
              >
                Education
              </Link>
            </li>
            <li>
              <Link
                href="#contact-section"
                className="text-[#8a8a8a] hover:text-[#ededed] transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-[#ededed] transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-[#ededed] transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-[#ededed] transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
          
          {/* Mobile Menu Overlay */}
          <div 
            className={`fixed inset-0 bg-[#08090B]/95 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${
              mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <ul className="flex flex-col items-center space-y-8 text-xl">
                <li>
                  <Link 
                    href="/" 
                    className="text-[#ededed] font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#skills-section"
                    className="text-[#8a8a8a] hover:text-[#ededed] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Skills
                  </Link>
                </li>
                <li>
                  <Link
                    href="#projects-section"
                    className="text-[#8a8a8a] hover:text-[#ededed] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="#experience-section"
                    className="text-[#8a8a8a] hover:text-[#ededed] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Experience
                  </Link>
                </li>
                <li>
                  <Link
                    href="#education-section"
                    className="text-[#8a8a8a] hover:text-[#ededed] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Education
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact-section"
                    className="text-[#8a8a8a] hover:text-[#ededed] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </main>
    </>
  );
}
