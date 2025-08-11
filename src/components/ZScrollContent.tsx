"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, useScroll, Html, Float } from "@react-three/drei";
import * as THREE from "three";
import SplineWrapper from "./SplineWrapper";
import { ThreeOptimizer } from "../utils/threeOptimizer";
import { useScreenSize, useQualitySettings } from "../utils/mobileOptimizer";

// Function to create a star geometry - optimized version
function createStarGeometry(
  innerRadius = 0.02,
  outerRadius = 0.05,
  points = 5
) {
  // Use a cached geometry if possible for better performance
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

// Star component - optimized version using instancing for better performance
function StarField({ count = 300, colors = ["#ffffff", "#8aabff"] }) {
  // const screenSize = useScreenSize();
  const qualitySettings = useQualitySettings();
  
  // Adjust star count based on device capabilities
  const adjustedCount = useMemo(() => {
    if (qualitySettings.effectsQuality === 'low') {
      return Math.floor(count * 0.3); // 30% of stars on low-end devices
    } else if (qualitySettings.effectsQuality === 'medium') {
      return Math.floor(count * 0.6); // 60% of stars on medium devices
    }
    return count; // Full count on high-end devices
  }, [count, qualitySettings.effectsQuality]);
  
  // Create geometries with different sizes
  const smallStarGeo = useMemo(() => createStarGeometry(0.01, 0.03, 5), []);
  const mediumStarGeo = useMemo(() => createStarGeometry(0.02, 0.05, 5), []);
  const largeStarGeo = useMemo(() => createStarGeometry(0.03, 0.07, 5), []);
  
  // Create materials with different colors
  const whiteMaterial = useMemo(() => 
    new THREE.MeshBasicMaterial({
      color: colors[0],
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    }), [colors]);
    
  const blueMaterial = useMemo(() => 
    new THREE.MeshBasicMaterial({
      color: colors[1],
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    }), [colors]);
  
  // Generate random positions, rotations, and scales
  const [positions, rotations, scales] = useMemo(() => {
    const pos = [];
    const rot = [];
    const scl = [];
    
    for (let i = 0; i < adjustedCount; i++) {
      // Random position within a volume
      pos.push(new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 1
      ));
      
      // Random rotation
      rot.push(new THREE.Euler(0, 0, Math.random() * Math.PI * 10));
      
      // Random scale
      scl.push(new THREE.Vector3(
        0.8 + Math.random() * 1.2,
        0.8 + Math.random() * 1.2,
        1
      ));
    }
    
    return [pos, rot, scl];
  }, [adjustedCount]);
  
  // Create materials array for instancing
  const materials = useMemo(() => {
    const mats = [];
    for (let i = 0; i < adjustedCount; i++) {
      mats.push(i % 5 === 0 ? blueMaterial : whiteMaterial);
    }
    return mats;
  }, [adjustedCount, blueMaterial, whiteMaterial]);
  
  // Create instanced meshes for better performance
  const smallStars = useMemo(() => {
    // Create individual meshes for small stars
    const group = new THREE.Group();
    const smallStarCount = Math.floor(adjustedCount * 0.5);
    
    for (let i = 0; i < smallStarCount; i++) {
      const mesh = new THREE.Mesh(smallStarGeo, materials[i]);
      mesh.position.copy(positions[i]);
      if (rotations[i]) mesh.rotation.copy(rotations[i]);
      if (scales[i]) mesh.scale.copy(scales[i]);
      group.add(mesh);
    }
    
    return group;
  }, [smallStarGeo, materials, positions, scales, rotations, adjustedCount]);
    
  const mediumStars = useMemo(() => {
    // Create individual meshes for medium stars
    const group = new THREE.Group();
    const startIdx = Math.floor(adjustedCount * 0.5);
    const endIdx = Math.floor(adjustedCount * 0.8);
    
    for (let i = startIdx; i < endIdx; i++) {
      const mesh = new THREE.Mesh(mediumStarGeo, materials[i]);
      mesh.position.copy(positions[i]);
      if (rotations[i]) mesh.rotation.copy(rotations[i]);
      if (scales[i]) mesh.scale.copy(scales[i]);
      group.add(mesh);
    }
    
    return group;
  }, [mediumStarGeo, materials, positions, scales, rotations, adjustedCount]);
    
  const largeStars = useMemo(() => {
    // Create individual meshes for large stars
    const group = new THREE.Group();
    const startIdx = Math.floor(adjustedCount * 0.8);
    
    for (let i = startIdx; i < adjustedCount; i++) {
      const mesh = new THREE.Mesh(largeStarGeo, materials[i]);
      mesh.position.copy(positions[i]);
      if (rotations[i]) mesh.rotation.copy(rotations[i]);
      if (scales[i]) mesh.scale.copy(scales[i]);
      group.add(mesh);
    }
    
    return group;
  }, [largeStarGeo, materials, positions, scales, rotations, adjustedCount]);
  
  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      smallStarGeo.dispose();
      mediumStarGeo.dispose();
      largeStarGeo.dispose();
      whiteMaterial.dispose();
      blueMaterial.dispose();
    };
  }, [smallStarGeo, mediumStarGeo, largeStarGeo, whiteMaterial, blueMaterial]);
  
  return (
    <group>
      <primitive object={smallStars} />
      <primitive object={mediumStars} />
      <primitive object={largeStars} />
    </group>
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

export default function ZScrollContent() {
  const scroll = useScroll();
  const { scene, gl } = useThree();
  const heroGroupRef = useRef<THREE.Group>(null);
  const splineWrapperGroupRef = useRef<HTMLDivElement>(null);
  const fogGroupRef = useRef<THREE.Group>(null);
  const skillsGroupRef = useRef<THREE.Group>(null);
  const splineWrapperRef = useRef<HTMLDivElement>(null);
  const screenSize = useScreenSize();
  // const qualitySettings = useQualitySettings();

  // Set up fog and optimize renderer
  useEffect(() => {
    // Initial fog settings
    scene.fog = new THREE.Fog("#08090B", 10, 20);
    
    // Optimize renderer
    ThreeOptimizer.optimizeRenderer(gl);
    
    // Store current ref values to use in cleanup
    const heroGroup = heroGroupRef.current;
    const fogGroup = fogGroupRef.current;
    const skillsGroup = skillsGroupRef.current;
    
    // Clean up on unmount
    return () => {
      // Clean up Three.js resources using stored references
      if (heroGroup) {
        ThreeOptimizer.disposeObject(heroGroup);
      }
      if (fogGroup) {
        ThreeOptimizer.disposeObject(fogGroup);
      }
      if (skillsGroup) {
        ThreeOptimizer.disposeObject(skillsGroup);
      }
    };
  }, [scene, gl]);

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

    if (splineWrapperGroupRef.current) {
      // Zoom in the Spline 3D model as user scrolls
      if (splineWrapperRef.current) {
        // Start with scale 1, zoom to scale 1.5 as scroll progresses
        // const zoomScale = 1 + Math.min(1.5, offset * 2);

        // Move the model forward as it zooms
        splineWrapperRef.current.style.transformOrigin = "center center";
      }
    }

    // Fog scene animations
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      // Animate fog based on scroll position
      // Start with fog far away, bring it closer as scroll progresses
      // const fogStart = 10 - Math.min(8, offset * 15); // Starts at 10, decreases to 2
      // const fogEnd = 20 - Math.min(10, offset * 20); // Starts at 20, decreases to 10

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
      {/* Hero Section Content - Optimized for mobile */}
      <group ref={heroGroupRef} position={[0, screenSize.isMobile ? 0.5 : 0.3, 0]}>
        {/* Main heading */}
        <Text
          position={[0, 1.4, 0]}
          fontSize={screenSize.isMobile ? 0.4 : 0.45}
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
          fontSize={screenSize.isMobile ? 0.4 : 0.45}
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

        {/* Left column content - Adjusted for mobile */}
        <group position={[screenSize.isMobile ? -5 : -4.5, -1, 0]}>
          <Text
            position={[0, 0.5, 0]}
            fontSize={screenSize.isMobile ? 0.13 : 0.15}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
            material-transparent={true}
            maxWidth={screenSize.isMobile ? 1.8 : 2}
          >
            Full Stack Developer
          </Text>

          <Text
            position={[0, 0.3, 0]}
            fontSize={screenSize.isMobile ? 0.08 : 0.09}
            color="#8a8a8a"
            anchorX="left"
            anchorY="top"
            material-transparent={true}
            maxWidth={screenSize.isMobile ? 2.2 : 2.8}
          >
            {screenSize.isMobile 
              ? "Building full-stack applications with React, Node.js, and MongoDB. Passionate about learning and open-source."
              : "Crafting seamless user experiences for the web and mobile. I build full-stack applications using modern technologies like React, Node.js, and MongoDB. Passionate about learning, shipping real projects, and contributing to open-source."
            }
          </Text>
        </group>

        {/* Right column content - Adjusted for mobile */}
        <group position={[screenSize.isMobile ? 3 : 4, -1.5, 0]}>
          <Text
            position={[-1.07, 0.2, 0]}
            fontSize={screenSize.isMobile ? 0.09 : 0.1}
            color="#ffffff"
            anchorX="right"
            anchorY="middle"
            material-transparent={true}
            maxWidth={screenSize.isMobile ? 1.8 : 2}
          >
            Meet the Developer
          </Text>

          <Text
            position={[0, 0, 0]}
            fontSize={screenSize.isMobile ? 0.08 : 0.09}
            color="#8a8a8a"
            anchorX="right"
            anchorY="top"
            material-transparent={true}
            maxWidth={screenSize.isMobile ? 1.8 : 2}
          >
            {screenSize.isMobile
              ? "I craft innovative solutions with clean, efficient code."
              : "As a passionate and detail-oriented developer, I craft innovative solutions that drive results. With expertise in coding languages and technologies, I bring ideas to life through clean, efficient, an"
            }
          </Text>
        </group>
      </group>

      {/* Spline 3D Model - Optimized for mobile */}
      <group ref={splineWrapperGroupRef}>
      <Html 
        position={[0, screenSize.isMobile ? -1.2 : -1.5, 0]} 
        transform 
        scale={screenSize.isMobile ? 0.22 : 0.27}
        // Only render when in view for better performance
        // Removed occlude prop due to TypeScript compatibility issues
      >
        <div
          ref={splineWrapperRef}
          style={{
            width: screenSize.isMobile ? "800px" : "1000px",
            height: screenSize.isMobile ? "500px" : "600px",
            transition: "transform 0.5s ease-out",
          }}
        >
          <SplineWrapper scene="https://prod.spline.design/XkOjNda6gpXkrISI/scene.splinecode" />
        </div>
      </Html>
      </group>

      {/* Fog Scene Content - Optimized with instanced rendering */}
      <group ref={fogGroupRef} position={[0, 0, -5]}>
        <StarField count={300} colors={["#ffffff", "#8aabff"]} />
      </group>

      {/* Skills Section Content - Optimized for mobile */}
      <group ref={skillsGroupRef} position={[0, 0, -10]}>
        <Text
          position={[0, screenSize.isMobile ? 4 : 5, 0]}
          fontSize={screenSize.isMobile ? 0.4 : 0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          material-transparent={true}
        >
          Skills
        </Text>

        {/* Skill bars - Optimized with instanced meshes for better performance */}
        {skills.map((skill, index) => {
          // Skip some skills on mobile for better layout
          if (screenSize.isMobile && index > 4) return null;
          
          const yOffset = screenSize.isMobile ? 0.6 : 0.5;
          const yPosition = screenSize.isMobile ? 2.5 : 3;
          
          return (
            <group key={skill.name} position={[0, 1 - index * yOffset, 0]}>
              <Text
                position={[screenSize.isMobile ? -1.8 : -2, yPosition, 0]}
                fontSize={screenSize.isMobile ? 0.16 : 0.2}
                color="#ffffff"
                anchorX="left"
                anchorY="middle"
                material-transparent={true}
              >
                {skill.name}
              </Text>

              {/* Background bar */}
              <mesh position={[0, yPosition, -0.05]}>
                <planeGeometry args={[screenSize.isMobile ? 2.5 : 3, screenSize.isMobile ? 0.18 : 0.2]} />
                <meshBasicMaterial
                  color="#2C313D"
                  transparent={true}
                  opacity={0.5}
                />
              </mesh>

              {/* Skill level bar */}
              <mesh
                name={`skill-bar-${index}`}
                position={[
                  (screenSize.isMobile ? -1.25 : -1.5) + 
                  (skill.level / 100) * (screenSize.isMobile ? 1.25 : 1.5), 
                  yPosition, 
                  0
                ]}
                scale={[0.01, 1, 1]}
              >
                <planeGeometry args={[screenSize.isMobile ? 2.5 : 3, screenSize.isMobile ? 0.18 : 0.2]} />
                <meshBasicMaterial color={skill.color} transparent={true} />
              </mesh>

              {/* Skill percentage */}
              <Text
                position={[screenSize.isMobile ? 1.5 : 1.7, yPosition, 0]}
                fontSize={screenSize.isMobile ? 0.12 : 0.15}
                color="#8a8a8a"
                anchorX="right"
                anchorY="middle"
                material-transparent={true}
              >
                {`${skill.level}%`}
              </Text>
            </group>
          );
        })}
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
    </>
  );
}
