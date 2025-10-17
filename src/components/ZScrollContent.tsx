"use client";

import { useRef, useEffect, useMemo, useState, use } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, useScroll, Html, Float } from "@react-three/drei";
import * as THREE from "three";
import FogEffect from "./FogEffect";
import InteractiveSkills from "./InteractiveSkills";
import InteractiveProjects from "./InteractiveProjects";

// Custom hook for responsive design
function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile };
}


// Particle System Component using THREE.Points
interface ParticleSystemProps {
  count: number;
  size: number;
  color?: string;
  spread: number;
  position?: [number, number, number];
}

function ParticleSystem({
  count,
  size,
  color = "#ffffff",
  spread,
  position = [0, 0, 0],
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  
  // Create star sprite texture
  const starTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d')!;
    
    // Create radial gradient for star glow
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Generate particle positions
  const positions = useMemo(() => {
    const vertices = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * spread;
      const z = (Math.random() - 0.5) * spread * 0.5;
      vertices.push(x, y, z);
    }
    return new Float32Array(vertices);
  }, [count, spread]);

  // Animation
  useFrame((state) => {
    if (materialRef.current) {
      const time = state.clock.elapsedTime;
      // Color cycling effect
      const h = (360 * (1.0 + time * 0.1) % 360) / 360;
      materialRef.current.color.setHSL(h, 0.5, 0.8);
    }
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={size}
        sizeAttenuation={true}
        map={starTexture}
        alphaTest={0.5}
        transparent={true}
        color={color}
      />
    </points>
  );
}

// Experience data
const experiences = [
  {
    title: "Frontend Developer",
    company: "Nexathread Private Limited",
    period: "Feb 2025 - Sept 2025",
    achievements: [
      "Enhanced website performance using Next.js, TailwindCSS, Framer Motion, and Firebase",
      "Integrated Cloudinary API for image generation and modification features",
      "Built end-to-end mobile application with React Native in a 5-member team",
      "Implemented Firebase authentication for secure user access management",
      "Developed RESTful APIs with Node.js, Express.js, and DynamoDB",
      "Successfully deployed Android app to Google Play Store"
    ],
    color: "#64FFDA",
    icon: "💼"
  }
];

// Education data
const education = [
  {
    degree: "Bachelor of Computer Science",
    institution: "Jain University Bangalore",
    period: "2024 - 2028",
    description: "Specialized in Software Engineering and Web Development",
    achievements: [
      "Participated and won multiple coding hackathons",
      "Published research on web optimization"
    ],
    color: "#BB86FC",
    icon: "🎓"
  },
  {
    degree: "Higher Secondary Education",
    institution: "OAV Bandupali",
    period: "2023",
    description: "Higher Secondary Education with focus on Science and Mathematics (PCMB)",
    achievements: [
        "82% in Higher Secondary Board Exams"
    ],
    color: "#03DAC6",
    icon: "🎒"
  }
];

// Contact data
const contactInfo = {
  email: "swagat@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/swagatchand",
  github: "github.com/swagatchand98",
  website: "swagatchand.dev"
};

// Interactive elements state
interface InteractiveState {
  hoveredSection: string | null;
  activeSection: string | null;
}

function FloatingParticles() {
  return (
    <group>
          {Array.from({ length: 5 }).map((_, i) => {
                const angle = (i / 5) * Math.PI * 2;
                const radius = 2.5;
                return (
                  <Float
                    key={i}
                    speed={5 + i * 0.1}
                    rotationIntensity={0.1}
                    floatIntensity={0.8}
                  >
                    <mesh
                      position={[
                        Math.cos(angle) * radius,
                        Math.sin(angle) * radius * 0.3,
                        0.5
                      ]}
                    >
                      <sphereGeometry args={[0.008]} />
                      <meshBasicMaterial
                        color="#64FFDA"
                        transparent={true}
                        opacity={0.6}
                      />
                    </mesh>
                  </Float>
                );
              })}
    </group>
  );
}

// Hero Image Component
function HeroImage() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { isMobile } = useResponsive();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Load texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load('/hero.png', (loadedTexture) => {
      setTexture(loadedTexture);
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      // Subtle rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={[0, -1.5, 0]}>
      <planeGeometry args={[isMobile ? 5 : 4, isMobile ? 5 : 4]} />
      <meshBasicMaterial 
        map={texture} 
        transparent={true}
        alphaTest={0.1}
      />
    </mesh>
  );
}

export default function ZScrollContent() {
  const scroll = useScroll();
  const { scene } = useThree();
  const { isMobile } = useResponsive();
  const heroGroupRef = useRef<THREE.Group>(null);
  const gltfModelGroupRef = useRef<THREE.Group>(null);
  const mobileAboutGroupRef = useRef<THREE.Group>(null);
  const fogGroupRef = useRef<THREE.Group>(null);
  const skillsGroupRef = useRef<THREE.Group>(null);
  const projectsGroupRef = useRef<THREE.Group>(null);
  const experienceGroupRef = useRef<THREE.Group>(null);
  const educationGroupRef = useRef<THREE.Group>(null);
  const contactGroupRef = useRef<THREE.Group>(null);

  // Set up fog
  useEffect(() => {
    // Initial fog settings
    scene.fog = new THREE.Fog("#08090B", 10, 20);
  }, [scene]);

  // Animation based on scroll position
  useFrame(() => {
    const { offset } = scroll;

    // Hero section animations
    if (heroGroupRef.current) {
      // Fade out hero section as user scrolls
      heroGroupRef.current.position.z = -offset * 5;

      // Apply opacity to all materials
      heroGroupRef.current.children.forEach((child) => {
        if ("material" in child) {
          const material = (child as THREE.Mesh).material;
          if (material instanceof THREE.Material && material.transparent) {
            material.opacity = 1 - Math.min(1, offset * 2);
          } else if (Array.isArray(material)) {
            material.forEach((m) => {
              if (m.transparent) m.opacity = 1 - Math.min(1, offset * 2);
            });
          }
        }
      });
    }

    if (gltfModelGroupRef.current) {
      // Position the GLTF model and animate it based on scroll
      gltfModelGroupRef.current.position.z = -offset * 3;
      
      // Scale the model slightly based on scroll
      const modelScale = 0.8 + Math.min(0.6, offset * 1);
      gltfModelGroupRef.current.scale.setScalar(modelScale);
      
      // Apply opacity based on scroll
      gltfModelGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => {
              if (material.transparent !== undefined) {
                material.transparent = true;
                // material.opacity = 1 - Math.min(1, offset * 1.5);
              }
            });
          } else {
            child.material.transparent = true;
            child.material.opacity = 1 - Math.min(1, offset * 1.5);
          }
        }
      });
    }

    // Fog scene animations
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      // Animate fog based on scroll position
      // Start with fog far away, bring it closer as scroll progresses
      const fogStart = 10 - Math.min(8, offset * 15); // Starts at 10, decreases to 2
      const fogEnd = 20 - Math.min(10, offset * 20); // Starts at 20, decreases to 10

      // Fog becomes denser as user scrolls from 0.2 to 0.4
      if (offset > 0.2 && offset < 0.6) {
        const fogDensity = (offset - 0.2) * 2.5; // 0 to 1 as offset goes from 0.2 to 0.6
        scene.fog.near = THREE.MathUtils.lerp(10, 2, fogDensity);
        scene.fog.far = THREE.MathUtils.lerp(20, 8, fogDensity);
      }
      // Fog dissipates as user scrolls past 0.6
      else if (offset >= 0.6) {
        const fogDissipation = Math.min(1, (offset - 0.6) * 2.5); // 0 to 1 as offset goes from 0.6 to 1.0
        scene.fog.near = THREE.MathUtils.lerp(2, 5, fogDissipation);
        scene.fog.far = THREE.MathUtils.lerp(8, 20, fogDissipation);
      }
    }

    // Mobile About section animations (only for mobile)
    if (mobileAboutGroupRef.current && isMobile) {
      // Position mobile about section after hero section
      mobileAboutGroupRef.current.position.z = -1.5 - offset * 5;
      
      // Fade in mobile about section as user scrolls past hero
      const mobileAboutOpacity = Math.max(0, Math.min(1, (offset - 0.15) * 6));
      
      // Hide mobile about section completely until we start scrolling past hero
      if (offset < 0.14) {
        mobileAboutGroupRef.current.visible = false;
      } else {
        mobileAboutGroupRef.current.visible = true;
        
        // Apply opacity to all materials
        mobileAboutGroupRef.current.children.forEach((child) => {
          if ("material" in child) {
            const material = (child as THREE.Mesh).material;
            if (material instanceof THREE.Material && material.transparent) {
              material.opacity = mobileAboutOpacity * (1 - Math.min(1, Math.max(0, (offset - 0.4) * 2.5)));
            } else if (Array.isArray(material)) {
              material.forEach((m) => {
                if (m.transparent) m.opacity = mobileAboutOpacity * (1 - Math.min(1, Math.max(0, (offset - 0.4) * 2.5)));
              });
            }
          }
        });
        
        // Animate mobile about elements
        mobileAboutGroupRef.current.children.forEach((child, index) => {
          if (child.name === `mobile-about-item-${index}`) {
            const progress = Math.max(0, Math.min(1, (offset - 0.15 - index * 0.05) * 5));
            child.position.y = THREE.MathUtils.lerp(1, 0, progress);
            child.rotation.x = THREE.MathUtils.lerp(-0.1, 0, progress);
          }
        });
      }
    }

    // Fog group animations
    if (fogGroupRef.current) {
      // Position fog group between hero and skills sections
      fogGroupRef.current.position.z = -0.5 - offset * 5;

      // Fade in fog group as user scrolls past hero
      const fogOpacity = Math.max(0, Math.min(1, (offset - 0.02) * 5));

      // Hide fog group completely until we start scrolling
      if (offset < 0.1) {
        fogGroupRef.current.visible = false;
      } else {
        fogGroupRef.current.visible = true;

        // Apply opacity to all materials
        fogGroupRef.current.children.forEach((child) => {
          if ("material" in child) {
            const material = (child as THREE.Mesh).material;
            if (material instanceof THREE.Material && material.transparent) {
              material.opacity =
                fogOpacity *
                (1 - Math.min(1, Math.max(0, (offset - 0.6) * 2.5)));
            } else if (Array.isArray(material)) {
              material.forEach((m) => {
                if (m.transparent)
                  m.opacity =
                    fogOpacity *
                    (1 - Math.min(1, Math.max(0, (offset - 0.6) * 2.5)));
              });
            }
          }
        });
      }
    }

    // Skills section animations
    if (skillsGroupRef.current) {
      // Position skills section after fog section in z-space
      skillsGroupRef.current.position.z = (isMobile? (-3.5) : (-2.5)) - offset * 5;

      // Fade in skills section as user scrolls past fog
      const skillsOpacity = Math.max(0, Math.min(1, (offset - 0.22) * 5));

      // Hide skills section completely until we start scrolling past fog
      if (offset < 0.175) {
        skillsGroupRef.current.visible = false;
      } else {
        skillsGroupRef.current.visible = true;

        // Apply opacity to all materials
        skillsGroupRef.current.children.forEach((child) => {
          if ("material" in child) {
            const material = (child as THREE.Mesh).material;
            if (material instanceof THREE.Material && material.transparent) {
              material.opacity = skillsOpacity;
            } else if (Array.isArray(material)) {
              material.forEach((m) => {
                if (m.transparent) m.opacity = skillsOpacity;
              });
            }
          }
        });
      }

    }

    // Projects section animations
    if (projectsGroupRef.current) {
      projectsGroupRef.current.position.z = (isMobile? (-12) : (-10)) - offset * 5;
      
      const projectsOpacity = 1;
      
      if (offset < 0.25) {
        projectsGroupRef.current.visible = false;
      } else {
        projectsGroupRef.current.visible = true;
        
        projectsGroupRef.current.children.forEach((child) => {
          if ("material" in child) {
            const material = (child as THREE.Mesh).material;
            if (material instanceof THREE.Material && material.transparent) {
              material.opacity = projectsOpacity * (1 - Math.min(1, Math.max(0, (offset - 1.2) * 2.5)));
            } else if (Array.isArray(material)) {
              material.forEach((m) => {
                if (m.transparent) m.opacity = projectsOpacity * (1 - Math.min(1, Math.max(0, (offset - 1.2) * 2.5)));
              });
            }
          }
        });

        // // Animate project cards
        // projectsGroupRef.current.children.forEach((child, index) => {
        //   if (child.name === `project-card-${index}`) {
        //     const progress = Math.max(0, Math.min(1, (offset - 0.85) * 3));
        //     child.position.y = THREE.MathUtils.lerp(-2, 0, progress);
        //     child.rotation.x = THREE.MathUtils.lerp(-0.3, 0, progress);
        //   }
        // });
      }
    }

    // Experience section animations
    if (experienceGroupRef.current) {
      experienceGroupRef.current.position.z = (isMobile? (-19) : (-17)) - offset * 5;
      
      const experienceOpacity = Math.max(0, Math.min(1, (offset - 1.2) * 4));
      
      if (offset < 0.5) {
        experienceGroupRef.current.visible = false;
      } else {
        experienceGroupRef.current.visible = true;
        
        experienceGroupRef.current.children.forEach((child) => {
          if ("material" in child) {
            const material = (child as THREE.Mesh).material;
            if (material instanceof THREE.Material && material.transparent) {
              material.opacity = experienceOpacity * (1 - Math.min(1, Math.max(0, (offset - 1.6) * 2.5)));
            } else if (Array.isArray(material)) {
              material.forEach((m) => {
                if (m.transparent) m.opacity = experienceOpacity * (1 - Math.min(1, Math.max(0, (offset - 1.6) * 2.5)));
              });
            }
          }
        });

        // Animate experience timeline
        experienceGroupRef.current.children.forEach((child, index) => {
          if (child.name === `experience-item-${index}`) {
            const progress = Math.max(0, Math.min(1, (offset - 1.25 - index * 0.1) * 4));
            child.position.x = THREE.MathUtils.lerp(-5, 0, progress);
            child.rotation.y = THREE.MathUtils.lerp(-0.2, 0, progress);
          }
        });
      }
    }

    // Education section animations
    if (educationGroupRef.current) {
      educationGroupRef.current.position.z = (isMobile? (-26) : (-24)) - offset * 5;
      
      const educationOpacity = Math.max(0, Math.min(1, (offset - 1.6) * 4));
      
      if (offset < 0.65) {
        educationGroupRef.current.visible = false;
      } else {
        educationGroupRef.current.visible = true;
        
        educationGroupRef.current.children.forEach((child) => {
          if ("material" in child) {
            const material = (child as THREE.Mesh).material;
            if (material instanceof THREE.Material && material.transparent) {
              material.opacity = educationOpacity * (1 - Math.min(1, Math.max(0, (offset - 2.0) * 2.5)));
            } else if (Array.isArray(material)) {
              material.forEach((m) => {
                if (m.transparent) m.opacity = educationOpacity * (1 - Math.min(1, Math.max(0, (offset - 2.0) * 2.5)));
              });
            }
          }
        });

        // Animate education cards
        educationGroupRef.current.children.forEach((child, index) => {
          if (child.name === `education-card-${index}`) {
            const progress = Math.max(0, Math.min(1, (offset - 1.65 - index * 0.1) * 4));
            child.position.y = THREE.MathUtils.lerp(2, 0, progress);
            child.scale.setScalar(THREE.MathUtils.lerp(0.8, 1, progress));
          }
        });
      }
    }

    // Contact section animations
    if (contactGroupRef.current) {
      contactGroupRef.current.position.z = (isMobile? (-32) : (-29)) - offset * 5;
      
      const contactOpacity = Math.max(0, Math.min(1, (offset - 2.0) * 4));
      
      if (offset < 0.75) {
        contactGroupRef.current.visible = false;
      } else {
        contactGroupRef.current.visible = true;
        
        contactGroupRef.current.children.forEach((child) => {
          if ("material" in child) {
            const material = (child as THREE.Mesh).material;
            if (material instanceof THREE.Material && material.transparent) {
              material.opacity = contactOpacity;
            } else if (Array.isArray(material)) {
              material.forEach((m) => {
                if (m.transparent) m.opacity = contactOpacity;
              });
            }
          }
        });

        // Animate contact elements
        contactGroupRef.current.children.forEach((child, index) => {
          if (child.name === `contact-item-${index}`) {
            const progress = Math.max(0, Math.min(1, (offset - 2.05 - index * 0.05) * 5));
            child.position.z = THREE.MathUtils.lerp(-1, 0, progress);
            child.rotation.z = THREE.MathUtils.lerp(0.1, 0, progress);
          }
        });
      }
    }
  });

  return (
    <>
      {/* Hero Section Content */}
      <group ref={heroGroupRef} position={[0, 0.3, 0]}>
        {/* Main heading - Responsive */}
        <Text
          position={[0, isMobile ? 1.5 : 1.4, 0]}
          fontSize={isMobile ? 0.35 : 0.45}
          color="#ffffff"
          font="/fonts/opening_hours_sans/OpeningHoursSans-Regular.woff"
          anchorX="center"
          anchorY="middle"
          material-transparent={true}
        >
          Hi, I am
        </Text>

        <Text
          position={[0, isMobile ? 1.1 : 0.9, 0]}
          fontSize={isMobile ? 0.35 : 0.45}
          color="#ffffff"
          font="/fonts/opening_hours_sans/OpeningHoursSans-Regular.woff"
          anchorX="center"
          anchorY="middle"
          material-transparent={true}
        >
          Swagat Chand
          <FloatingParticles/>
        </Text>

        {/* Sparkle emoji - Responsive positioning */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Text
            position={[isMobile ? 1 : 1, isMobile ? 1.7 : 1.65, 0]}
            fontSize={isMobile ? 0.18 : 0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            material-transparent={true}
          >
            ✨
          </Text>
        </Float>

        {/* Desktop Layout - Two Columns */}
        {!isMobile && (
          <>
            {/* Desktop Layout - Two Columns */}
            {/* Left column content */}
            <group position={[-4.5, -1, 0]}>
              <Text
                position={[0, 0.5, 0]}
                fontSize={0.15}
                color="#ffffff"
                anchorX="left"
                anchorY="middle"
                material-transparent={true}
                maxWidth={2}
              >
                Full Stack Developer
              </Text>

              <Text
                position={[0, 0.3, 0]}
                fontSize={0.09}
                color="#8a8a8a"
                anchorX="left"
                anchorY="top"
                material-transparent={true}
                maxWidth={2.8}
              >
                Crafting seamless user experiences for the web and mobile. I build
                full-stack applications using modern technologies like React,
                Node.js, and MongoDB. Passionate about learning, shipping real
                projects, and contributing to open-source.
                <FloatingParticles/>
              </Text>
            </group>

            {/* Right column content */}
            <group position={[4, -1.5, 0]}>
              <Text
                position={[-1.07, 0.2, 0]}
                fontSize={0.1}
                color="#ffffff"
                anchorX="right"
                anchorY="middle"
                material-transparent={true}
                maxWidth={2}
              >
                Meet the Developer
              </Text>

              <Text
                position={[0, 0, 0]}
                fontSize={0.09}
                color="#8a8a8a"
                anchorX="right"
                anchorY="top"
                material-transparent={true}
                maxWidth={2}
              >
                As a passionate and detail-oriented developer, I craft innovative
                solutions that drive results. With expertise in coding languages and
                technologies, I bring ideas to life through clean, efficient, an
                <FloatingParticles/>
              </Text>
            </group>
          </>
        )}
      </group>

      {/* Hero Image */}
      <group ref={gltfModelGroupRef} position={[0, isMobile ? -1.75 : -1.5, 0]}>
        <HeroImage />
        {/* Model-specific lighting */}
        <spotLight
          position={[5, 8, 5]}
          angle={0.3}
          penumbra={0.5}
          intensity={2}
          color="#ffffff"
          castShadow={true}
          shadow-mapSize={[2048, 2048]}
          target-position={[0, 0, 0]}
        />
        
        <spotLight
          position={[-5, 5, 3]}
          angle={0.4}
          penumbra={0.7}
          intensity={20}
          color="#4a90e2"
          target-position={[0, 0, 0]}
        />
        
        <pointLight
          position={[0, 3, 8]}
          intensity={120}
          color="#ff6b6b"
          distance={20}
          decay={2}
        />
        
        {/* Rim lighting */}
        <directionalLight
          position={[-10, 2, -5]}
          intensity={3}
          color="#00FFFF"
        />
      </group>

      {/* Mobile About Section - Only visible on mobile */}
      {isMobile && (
        <group ref={mobileAboutGroupRef} position={[0, -0.2, 0]}>
          {/* Background card for mobile about section */}
          <group name="mobile-about-item-0" position={[0, 0, 0]}>
            {/* Main background */}
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[5.5, 3.2]} />
              <meshBasicMaterial
                color="#0A0A0A"
                transparent={true}
                opacity={0.7}
              />
            </mesh>

            {/* Border glow */}
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[5.6, 3.3]} />
              <meshBasicMaterial
                color="#64FFDA"
                transparent={true}
                opacity={0.15}
              />
            </mesh>

            {/* Full Stack Developer Title */}
            <Text
              position={[0, 0.5, 0]}
              fontSize={0.07}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              material-transparent={true}
              maxWidth={4.5}
            >
              Full Stack Developer
            </Text>

            {/* Combined Description */}
            <Text
              position={[0, 0.4, 0]}
              fontSize={0.04}
              color="#8a8a8a"
              anchorX="center"
              anchorY="top"
              material-transparent={true}
              maxWidth={0.85}
              textAlign="center"
            >
              Crafting seamless user experiences for the web and mobile. I build
              full-stack applications using modern technologies like React,
              Node.js, and MongoDB. Passionate about learning, shipping real
              projects, and contributing to open-source.
            </Text>

            {/* Meet the Developer - Mobile */}
            <Text
              position={[0, -0.2, 0]}
              fontSize={0.05}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              material-transparent={true}
              maxWidth={4.5}
            >
              Meet the Developer
            </Text>

            <Text
              position={[0, -0.3, 0]}
              fontSize={0.04}
              color="#8a8a8a"
              anchorX="center"
              anchorY="top"
              material-transparent={true}
              maxWidth={0.85}
              textAlign="center"
            >
              As a passionate and detail-oriented developer, I craft innovative
              solutions that drive results. With expertise in coding languages and
              technologies, I bring ideas to life through clean, efficient code.
            </Text>

            {/* Floating particles around mobile about section */}
            <group>
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const radius = 3.2;
                return (
                  <Float
                    key={i}
                    speed={0.3 + i * 0.05}
                    rotationIntensity={0.05}
                    floatIntensity={0.15}
                  >
                    <mesh
                      position={[
                        Math.cos(angle) * radius,
                        Math.sin(angle) * radius * 0.4,
                        0.3
                      ]}
                    >
                      <sphereGeometry args={[0.01]} />
                      <meshBasicMaterial
                        color="#64FFDA"
                        transparent={true}
                        opacity={0.6}
                      />
                    </mesh>
                  </Float>
                );
              })}
            </group>
          </group>

          {/* Ambient lighting for mobile about section */}
          <pointLight
            position={[0, 0, 2]}
            intensity={0.4}
            color="#64FFDA"
            distance={8}
            decay={2}
          />
        </group>
      )}

      {/* Fog Scene Content - Particle System Starfield */}
      <group ref={fogGroupRef} position={[0, 0, -2]}>
        <ParticleSystem
          count={5000}
          size={0.05}
          color="#ffffff"
          spread={3}
          position={[0, 0, 0]}
        />
      </group>

      {/* Skills Section Content */}
      <group ref={skillsGroupRef} position={[0, -1.85, -3]}>
        <InteractiveSkills mobile={false} />
      </group>

      {/* Projects Section Content */}
      <group ref={projectsGroupRef} position={[0, 0.5, -4]} scale={[0.5, 0.5, 0.5]}>
        <InteractiveProjects mobile={false} />
      </group>

      {/* Experience Section Content */}
      <group ref={experienceGroupRef} position={[-0.65, 1.3, -5]}>
        <Text
          position={[0, 3.5, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          material-transparent={true}
          font="/fonts/opening_hours_sans/OpeningHoursSans-Regular.woff"
        >
          Experience
        </Text>

        {/* Minimal Experience Cards */}
        {experiences.map((exp, index) => (
          <group 
            key={exp.title} 
            name={`experience-item-${index}`}
            position={[0, 1.5 - index * 2.2, 0]}
          >
            {/* Glowing accent line */}
            <mesh position={[-2, 0, 0]}>
              <planeGeometry args={[0.03, 2]} />
              <meshBasicMaterial color={exp.color} transparent={true} opacity={0.8} />
            </mesh>

            {/* Icon background */}
            <mesh position={[-2, 0.8, 0.01]}>
              <circleGeometry args={[0.2]} />
              <meshBasicMaterial color={exp.color} transparent={true} opacity={0.2} />
            </mesh>

            {/* Icon */}
            <Text
              position={[-2, 0.8, 0.02]}
              fontSize={0.15}
              color={exp.color}
              anchorX="center"
              anchorY="middle"
              material-transparent={true}
            >
              {exp.icon}
            </Text>

            {/* Main content card - minimal glass effect */}
            <mesh position={[0.65, 0, -0.01]}>
              <planeGeometry args={isMobile ? [3.5, 2.4] : [4.5, 1.8]} />
              <meshBasicMaterial
                color="#0A0A0A"
                transparent={true}
                opacity={0.4}
              />
            </mesh>

            {/* Subtle border glow */}
            <mesh position={[0.65, 0, -0.02]}>
              <planeGeometry args={isMobile ? [3.55, 2.45] : [4.55, 1.85]} />
              <meshBasicMaterial
                color={exp.color}
                transparent={true}
                opacity={0.1}
              />
            </mesh>

            {/* Job title */}
            <Text
              position={[isMobile ? -0.8 : -1, 0.6, 0.1]}
              fontSize={0.14}
              color="#ffffff"
              anchorX="left"
              anchorY="middle"
              material-transparent={true}
              maxWidth={4}
            >
              {exp.title}
            </Text>

            {/* Company */}
            <Text
              position={[isMobile ? -0.8 : -1, 0.3, 0.1]}
              fontSize={0.1}
              color={exp.color}
              anchorX="left"
              anchorY="middle"
              material-transparent={true}
              maxWidth={4}
            >
              {exp.company}
            </Text>

            {/* Period */}
            <Text
              position={[isMobile ? -0.8 : -1, 0.05, 0.1]}
              fontSize={0.08}
              color="#888888"
              anchorX="left"
              anchorY="middle"
              material-transparent={true}
              maxWidth={4}
            >
              {exp.period}
            </Text>

            {/* Key highlights - condensed */}
            <group position={[isMobile ? -0.8 :-1, -0.3, 0.1]}>
              {exp.achievements.slice(0, 3).map((achievement, achIndex) => (
                <Text
                  key={achIndex}
                  position={[0, -achIndex * 0.18, 0]}
                  fontSize={0.065}
                  color="#CCCCCC"
                  anchorX="left"
                  anchorY="middle"
                  material-transparent={true}
                  maxWidth={4}
                >
                  • {achievement.length > 80 ? 
                      achievement.substring(0, 80) + '...' : 
                      achievement}
                </Text>
              ))}
            </group>

            {/* Floating particles around experience card */}
            <FloatingParticles/>
          </group>
        ))}

        {/* Ambient glow for experience section */}
        <pointLight
          position={[0, 0, 2]}
          intensity={0.5}
          color="#64FFDA"
          distance={10}
          decay={2}
        />
      </group>

      {/* Education Section Content */}
      <group ref={educationGroupRef} position={[0, (isMobile ? 5 : 3.5), -6]}>
        <Text
          position={[0, 2.8, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          material-transparent={true}
          font="/fonts/opening_hours_sans/OpeningHoursSans-Regular.woff"
        >
          Education
        </Text>

        {/* Improved Education Cards Layout */}
        {education.map((edu, index) => (
          <group 
            key={edu.degree} 
            name={`education-card-${index}`}
            position={isMobile ? [0, 0.8 - index * 3.5, 0] : [index === 1 ? -2.8 : 2.8, 0.8, 0]}
          >
            {/* Card background with improved glass effect */}
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={isMobile ? [3.5, 3.0] : [4.2, 2.4]} />
              <meshBasicMaterial
                color="#0A0A0A"
                transparent={true}
                opacity={0.6}
              />
            </mesh>

            {/* Enhanced gradient border */}
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={isMobile ? [3.6, 3.1] : [4.3, 2.5]} />
              <meshBasicMaterial
                color={edu.color}
                transparent={true}
                opacity={0.15}
              />
            </mesh>

            {/* Icon background with better positioning */}
            <mesh position={[isMobile ? -1 : -1.6, 0.8, 0.01]}>
              <circleGeometry args={[0.25]} />
              <meshBasicMaterial color={edu.color} transparent={true} opacity={0.2} />
            </mesh>

            {/* Icon */}
            <Text
              position={[isMobile ? -1 : -1.6, 0.8, 0.02]}
              fontSize={0.18}
              color={edu.color}
              anchorX="center"
              anchorY="middle"
              material-transparent={true}
            >
              {edu.icon}
            </Text>

            {/* Degree title - better positioned */}
            <Text
              position={[-1.2, isMobile ? 0.2 : 0.4, 0.1]}
              fontSize={0.13}
              color="#ffffff"
              anchorX="left"
              anchorY="middle"
              material-transparent={true}
              maxWidth={3.8}
            >
              {edu.degree}
            </Text>

            {/* Institution */}
            <Text
              position={[-1.2, isMobile ? 0 : 0.1, 0.1]}
              fontSize={0.1}
              color={edu.color}
              anchorX="left"
              anchorY="middle"
              material-transparent={true}
              maxWidth={3.8}
            >
              {edu.institution}
            </Text>

            {/* Period */}
            <Text
              position={[-1.2, isMobile ? -0.2 : -0.15, 0.1]}
              fontSize={0.09}
              color="#AAAAAA"
              anchorX="left"
              anchorY="middle"
              material-transparent={true}
              maxWidth={3.8}
            >
              {edu.period}
            </Text>

            {/* Key achievement with better spacing */}
            <Text
              position={[-1.2, -0.5, 0.1]}
              fontSize={0.08}
              color="#DDDDDD"
              anchorX="left"
              anchorY="middle"
              material-transparent={true}
              maxWidth={3.8}
            >
              🏆 {edu.achievements[0]}
            </Text>

            {/* Floating accent particles - reduced count for cleaner look */}
            <group>
              {Array.from({ length: 4 }).map((_, i) => {
                const angle = (i / 4) * Math.PI * 2;
                const radius = 2.2;
                return (
                  <Float
                    key={i}
                    speed={0.2 + i * 0.1}
                    rotationIntensity={0.03}
                    floatIntensity={0.1}
                  >
                    <mesh
                      position={[
                        Math.cos(angle) * radius,
                        Math.sin(angle) * radius * 0.3,
                        0.2
                      ]}
                    >
                      <sphereGeometry args={[0.008]} />
                      <meshBasicMaterial
                        color={edu.color}
                        transparent={true}
                        opacity={0.5}
                      />
                    </mesh>
                  </Float>
                );
              })}
            </group>
          </group>
        ))}

        {/* Central connecting element */}
        <mesh position={[0, 0.8, -0.1]}>
          <planeGeometry args={[1.2, 0.02]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent={true}
            opacity={0.2}
          />
        </mesh>

        {/* Section ambient lighting */}
        <pointLight
          position={[0, 0, 2]}
          intensity={0.6}
          color="#BB86FC"
          distance={15}
          decay={2}
        />
        
        {/* Additional accent lighting for each card */}
        <pointLight
          position={[-2.8, 0.8, 1]}
          intensity={0.3}
          color="#BB86FC"
          distance={8}
          decay={2}
        />
        <pointLight
          position={[2.8, 0.8, 1]}
          intensity={0.3}
          color="#03DAC6"
          distance={8}
          decay={2}
        />
      </group>

      {/* Contact Section Content - Simple & Modern */}
      <group ref={contactGroupRef} position={[0, 4, -30]} scale={isMobile ? [1.2, 1.2, 1.2] : [0.8, 0.8, 0.8]}>
        {/* Section Title */}
        <Text
          position={[0, 3, 0]}
          fontSize={isMobile ? 0.4 : 0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          material-transparent={true}
          font="/fonts/opening_hours_sans/OpeningHoursSans-Regular.woff"
        >
          Let&apos;s Connect
        </Text>

        {/* Simple Contact List */}
        <group position={[0, 1.5, 0]}>
          {/* Email */}
          <group name="contact-item-0" position={[0, isMobile ? 1 : 0.8, 0]}>
            <Text
              position={[0, 0.2, 0]}
              fontSize={isMobile ? 0.12 : 0.1}
              color="#64FFDA"
              anchorX="center"
              anchorY="middle"
              material-transparent={true}
            >
              Email
            </Text>
            <Text
              position={[0, -0.1, 0]}
              fontSize={isMobile ? 0.1 : 0.08}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              material-transparent={true}
              onClick={(e) => {
                e.stopPropagation();
                window.open('mailto:swagatsaswatchand@gmail.com', '_blank');
              }}
              onPointerOver={() => document.body.style.cursor = 'pointer'}
              onPointerOut={() => document.body.style.cursor = 'default'}
            >
              swagatsaswatchand@gmail.com
            </Text>
          </group>

          {/* GitHub */}
          <group name="contact-item-1" position={[0, isMobile ? 0.2 : 0.2, 0]}>
            <Text
              position={[0, 0.2, 0]}
              fontSize={isMobile ? 0.12 : 0.1}
              color="#BB86FC"
              anchorX="center"
              anchorY="middle"
              material-transparent={true}
            >
              GitHub
            </Text>
            <Text
              position={[0, -0.1, 0]}
              fontSize={isMobile ? 0.1 : 0.08}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              material-transparent={true}
              onClick={(e) => {
                e.stopPropagation();
                window.open('https://github.com/swagatchand98', '_blank');
              }}
              onPointerOver={() => document.body.style.cursor = 'pointer'}
              onPointerOut={() => document.body.style.cursor = 'default'}
            >
              github.com/swagatchand98
            </Text>
          </group>

          {/* LinkedIn */}
          <group name="contact-item-2" position={[0, isMobile ? -0.6 : -0.4, 0]}>
            <Text
              position={[0, 0.2, 0]}
              fontSize={isMobile ? 0.12 : 0.1}
              color="#03DAC6"
              anchorX="center"
              anchorY="middle"
              material-transparent={true}
            >
              LinkedIn
            </Text>
            <Text
              position={[0, -0.1, 0]}
              fontSize={isMobile ? 0.1 : 0.08}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              material-transparent={true}
              onClick={(e) => {
                e.stopPropagation();
                window.open('https://www.linkedin.com/in/swagat-chand-947a6b2ba/', '_blank');
              }}
              onPointerOver={() => document.body.style.cursor = 'pointer'}
              onPointerOut={() => document.body.style.cursor = 'default'}
            >
              linkedin.com/in/swagat-chand
            </Text>
          </group>

          {/* Location */}
          <group name="contact-item-3" position={[0, isMobile ? -1.4 : -1, 0]}>
            <Text
              position={[0, 0.2, 0]}
              fontSize={isMobile ? 0.12 : 0.1}
              color="#FF6B6B"
              anchorX="center"
              anchorY="middle"
              material-transparent={true}
            >
              Location
            </Text>
            <Text
              position={[0, -0.1, 0]}
              fontSize={isMobile ? 0.1 : 0.08}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              material-transparent={true}
            >
              Bangalore, India
            </Text>
          </group>
        </group>

        {/* Call to Action */}
        <group position={[0, isMobile ? -0.8 : -0.2, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={isMobile ? 0.15 : 0.12}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            material-transparent={true}
          >
            Ready to collaborate?
          </Text>

          <Text
            position={[0, -0.3, 0]}
            fontSize={isMobile ? 0.1 : 0.08}
            color="#64FFDA"
            anchorX="center"
            anchorY="middle"
            material-transparent={true}
            maxWidth={isMobile ? 4 : 6}
          >
            Drop me a message and let&apos;s bring your ideas to life
          </Text>
        </group>

        {/* Minimal Background Elements */}
        <group>
          {/* Simple connecting lines */}
          <mesh position={[0, 0.5, -0.1]}>
            <planeGeometry args={[0.01, isMobile ? 3 : 2.5]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent={true}
              opacity={0.1}
            />
          </mesh>

          {/* Subtle accent dots */}
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh
              key={i}
              position={[0, 1 - i * (isMobile ? 0.8 : 0.6), 0]}
            >
              <circleGeometry args={[0.02]} />
              <meshBasicMaterial
                color={["#64FFDA", "#BB86FC", "#03DAC6", "#FF6B6B"][i]}
                transparent={true}
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>

        {/* Clean Lighting */}
        <pointLight
          position={[0, 0, 3]}
          intensity={0.8}
          color="#ffffff"
          distance={15}
          decay={2}
        />
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.3} color="#404040" />
      <hemisphereLight
        args={["#87ceeb", "#362d28", 0.5]}
      />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8}
        color="#ffffff"
        castShadow={true}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Additional fill light */}
      <pointLight
        position={[-8, 4, 3]}
        intensity={0.6}
        color="#ffa500"
        distance={15}
        decay={2}
      />
    </>
  );
}
