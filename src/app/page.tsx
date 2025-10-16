"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ScrollObserver from "../components/ScrollObserver";
import "./zscroll.css";
import ZScrollScene from "../components/ZScrollScene";
import ZScrollContent from "../components/ZScrollContent";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      skills: 0.25,
      projects: 0.45,
      experience: 0.65,
      education: 0.8,
      contact: 0.95
    };

    const targetPosition = scrollPositions[sectionName as keyof typeof scrollPositions] || 0;
    
    // Get the scroll container (the main element with scroll)
    const scrollContainer = document.documentElement || document.body;
    const maxScroll = scrollContainer.scrollHeight - window.innerHeight;
    const targetScroll = maxScroll * targetPosition;

    // Smooth scroll to target position
    scrollContainer.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
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
          <div className="md:hidden">
            <Link href="/" className="text-[#ededed] font-medium text-lg">
              SC
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-16 mx-auto">
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
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
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

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-[#08090B] bg-opacity-95 backdrop-blur-md z-40">
              <div className="flex flex-col items-center justify-center h-full space-y-8">
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-[#ededed] font-medium text-xl hover:text-[#ffffff] transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('skills')}
                  className="text-[#8a8a8a] hover:text-[#ededed] transition-colors text-xl"
                >
                  Skills
                </button>
                <button
                  onClick={() => scrollToSection('projects')}
                  className="text-[#8a8a8a] hover:text-[#ededed] transition-colors text-xl"
                >
                  Projects
                </button>
                <button
                  onClick={() => scrollToSection('experience')}
                  className="text-[#8a8a8a] hover:text-[#ededed] transition-colors text-xl"
                >
                  Experience
                </button>
                <button
                  onClick={() => scrollToSection('education')}
                  className="text-[#8a8a8a] hover:text-[#ededed] transition-colors text-xl"
                >
                  Education
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-[#8a8a8a] hover:text-[#ededed] transition-colors text-xl"
                >
                  Contact
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </main>
    </>
  );
}
