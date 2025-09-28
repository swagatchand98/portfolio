"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, useScroll, Html, Float } from "@react-three/drei";
import * as THREE from "three";
import FogEffect from "./FogEffect";

// Mobile detection utility
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Function to create a star geometry
function createStarGeometry(
  innerRadius = 0.02,
  outerRadius = 0.05,
  points = 5
) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];

  // Create star shape vertices
  const angleStep = Math.PI / points;

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * angleStep;

    const x = Math.sin(angle) * radius;
    const y = Math.cos(angle) * radius;

    vertices.push(x, y, 0);
  }

  // Create faces (triangles)
  const indices = [];
  for (let i = 0; i < points * 2 - 2; i++) {
    indices.push(0, i + 1, i + 2);
  }
  indices.push(0, points * 2 - 1, 1);

  // Set attributes
  geometry.setIndex(indices);
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  // Compute normals
  geometry.computeVertexNormals();

  return geometry;
}

// Star component interface
interface StarProps {
  position: [number, number, number];
  size?: number;
  color?: string;
  opacity?: number;
  rotation?: number;
}

// Star component
function Star({
  position,
  size = 1,
  color = "#ffffff",
  opacity = 0.2,
  rotation = 0,
}: StarProps) {
  const starGeometry = useMemo(() => {
    const innerRadius = 0.02 * size;
    const outerRadius = 0.05 * size;
    return createStarGeometry(innerRadius, outerRadius, 5);
  }, [size]);

  return (
    <mesh position={position} rotation={[0, 0, rotation]}>
      <primitive object={starGeometry} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Skills data
const skills = [
  { name: "React", level: 90, color: "#61DAFB" },
  { name: "TypeScript", level: 85, color: "#3178C6" },
  { name: "Node.js", level: 80, color: "#339933" },
  { name: "Three.js", level: 75, color: "#000000" },
  { name: "Next.js", level: 85, color: "#000000" },
  { name: "MongoDB", level: 70, color: "#47A248" },
];

// Hero Image Component
function HeroImage() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [mobile, setMobile] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  
  useEffect(() => {
    setMobile(isMobile());
    
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load('/hero-short.png', (loadedTexture) => {
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
    <mesh ref={meshRef} position={[0, mobile ? -1 : -1.5, 0]}>
      <planeGeometry args={[mobile ? 3 : 4, mobile ? 3 : 4]} />
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
  const heroGroupRef = useRef<THREE.Group>(null);
  const gltfModelGroupRef = useRef<THREE.Group>(null);
  const fogGroupRef = useRef<THREE.Group>(null);
  const skillsGroupRef = useRef<THREE.Group>(null);
  
  // Mobile detection
  const [mobile, setMobile] = useState(false);
  
  useEffect(() => {
    setMobile(isMobile());
    
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      const modelScale = 0.8 + Math.min(0.6, offset * 10);
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

    // Fog group animations
    if (fogGroupRef.current) {
      // Position fog group between hero and skills sections
      fogGroupRef.current.position.z = -2.5 - offset * 5;

      // Fade in fog group as user scrolls past hero
      const fogOpacity = Math.max(0, Math.min(1, (offset - 0.2) * 5));

      // Hide fog group completely until we start scrolling
      if (offset < 0.2) {
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
      skillsGroupRef.current.position.z = -7.5 - offset * 5;

      // Fade in skills section as user scrolls past fog
      // Start with opacity 0, and only fade in after scrolling past 60% of the first page
      const skillsOpacity = Math.max(0, Math.min(1, (offset - 0.6) * 2.5));

      // Hide skills section completely until we start scrolling past fog
      if (offset < 0.55) {
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

      // Animate skill bars based on scroll
      skillsGroupRef.current.children.forEach((child, index) => {
        if (child.name === `skill-bar-${index}`) {
          const targetScale = new THREE.Vector3(
            skills[index].level / 100,
            1,
            1
          );
          const currentScale = (child as THREE.Mesh).scale;
          // Start animation after scrolling past 65% of the first page
          const progress = Math.max(0, Math.min(1, (offset - 0.65) * 3));

          currentScale.x = THREE.MathUtils.lerp(0.01, targetScale.x, progress);
        }
      });
    }
  });

  return (
    <>
      {/* Hero Section Content */}
      <group ref={heroGroupRef} position={[0, 0.3, 0]}>
        {/* Main heading */}
        <Text
          position={[0, 1.4, 0]}
          fontSize={0.45}
          color="#ffffff"
          font="/fonts/opening_hours_sans/OpeningHoursSans-Regular.woff"
          anchorX="center"
          anchorY="middle"
          material-transparent={true}
        >
          Hi, I am
        </Text>

        <Text
          position={[0, 0.9, 0]}
          fontSize={0.45}
          color="#ffffff"
          font="/fonts/opening_hours_sans/OpeningHoursSans-Regular.woff"
          anchorX="center"
          anchorY="middle"
          material-transparent={true}
        >
          Swagat Chand
        </Text>

        {/* Sparkle emoji */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Text
            position={[1, 1.65, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            material-transparent={true}
          >
            ✨
          </Text>
        </Float>

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
          </Text>
        </group>
      </group>

      {/* Hero Image */}
      <group ref={gltfModelGroupRef} position={[0, -1.5, 0]}>
        <HeroImage />
        {/* Model-specific lighting - reduced on mobile */}
        <spotLight
          position={[5, 8, 5]}
          angle={0.3}
          penumbra={0.5}
          intensity={mobile ? 1 : 2}
          color="#ffffff"
          castShadow={!mobile}
          shadow-mapSize={mobile ? [512, 512] : [2048, 2048]}
          target-position={[0, 0, 0]}
        />
        
        {!mobile && (
          <>
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
          </>
        )}
      </group>

      {/* Fog Scene Content - reduced particles on mobile */}
      <group ref={fogGroupRef} position={[0, 0, -5]}>
        {/* Star-shaped fog particles */}
        {Array.from({ length: mobile ? 100 : 300 }).map((_, i) => (
          <Star
            key={`fog-star-${i}`}
            position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 1,
            ]}
            size={mobile ? 0.5 + Math.random() * 0.8 : 0.8 + Math.random() * 1.2}
            color={i % 5 === 0 ? "#8aabff" : "#ffffff"}
            opacity={mobile ? 0.05 + Math.random() * 0.1 : 0.1 + Math.random() * 0.2}
            rotation={Math.random() * Math.PI * 10}
          />
        ))}
      </group>

      {/* Skills Section Content */}
      <group ref={skillsGroupRef} position={[0, 0, -10]}>
        <Text
          position={[0, 5, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          material-transparent={true}
        >
          Skills
        </Text>

        {/* Skill bars */}
        {skills.map((skill, index) => (
          <group key={skill.name} position={[0, 1 - index * 0.5, 0]}>
            <Text
              position={[-2, 3, 0]}
              fontSize={0.2}
              color="#ffffff"
              anchorX="left"
              anchorY="middle"
              material-transparent={true}
            >
              {skill.name}
            </Text>

            {/* Background bar */}
            <mesh position={[0, 3, -0.05]}>
              <planeGeometry args={[3, 0.2]} />
              <meshBasicMaterial
                color="#2C313D"
                transparent={true}
                opacity={0.5}
              />
            </mesh>

            {/* Skill level bar */}
            <mesh
              name={`skill-bar-${index}`}
              position={[-1.5 + (skill.level / 100) * 1.5, 3  , 0]}
              scale={[0.01, 1, 1]}
            >
              <planeGeometry args={[3, 0.2]} />
              <meshBasicMaterial color={skill.color} transparent={true} />
            </mesh>

            {/* Skill percentage */}
            <Text
              position={[1.7, 3, 0]}
              fontSize={0.15}
              color="#8a8a8a"
              anchorX="right"
              anchorY="middle"
              material-transparent={true}
            >
              {`${skill.level}%`}
            </Text>
          </group>
        ))}
      </group>

      {/* Lighting - optimized for mobile */}
      <ambientLight intensity={mobile ? 0.4 : 0.3} color="#404040" />
      <hemisphereLight
        args={["#87ceeb", "#362d28", mobile ? 0.3 : 0.5]}
      />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={mobile ? 0.5 : 0.8}
        color="#ffffff"
        castShadow={!mobile}
        shadow-mapSize={mobile ? [512, 512] : [1024, 1024]}
        shadow-camera-far={mobile ? 25 : 50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Additional fill light - desktop only */}
      {!mobile && (
        <pointLight
          position={[-8, 4, 3]}
          intensity={0.6}
          color="#ffa500"
          distance={15}
          decay={2}
        />
      )}
    </>
  );
}
