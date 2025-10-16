"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html } from "@react-three/drei";
import * as THREE from "three";

// Skills data with logo paths
const skillsData = [
  { 
    name: "TypeScript", 
    logo: "/logo/Typescript.svg", 
    color: "#3178C6",
    description: "Strongly typed JavaScript"
  },
  { 
    name: "Node.js", 
    logo: "/logo/nodejs.svg", 
    color: "#339933",
    description: "JavaScript runtime environment"
  },
  { 
    name: "CSS", 
    logo: "/logo/CSS.png", 
    color: "#1572B6",
    description: "Styling and animations"
  },
  { 
    name: "Next.js", 
    logo: "/logo/nextjs.png", 
    color: "#000000",
    description: "React production framework"
  },
  { 
    name: "MongoDB", 
    logo: "/logo/mongo.webp", 
    color: "#47A248",
    description: "NoSQL database"
  },
  { 
    name: "PostgreSQL", 
    logo: "/logo/elephant.png", 
    color: "#336791",
    description: "Relational database"
  },
  { 
    name: "Docker", 
    logo: "/logo/docker.png", 
    color: "#2496ED",
    description: "Containerization platform"
  },
  { 
    name: "AWS", 
    logo: "/logo/awslogo.png", 
    color: "#FF9900",
    description: "Cloud computing services"
  },
  { 
    name: "Redis", 
    logo: "/logo/redis.png", 
    color: "#DC382D",
    description: "In-memory data store"
  }
];

interface SkillOrbProps {
  skill: typeof skillsData[0];
  position: [number, number, number];
  index: number;
  onHover: (skill: typeof skillsData[0] | null) => void;
}

function SkillOrb({ skill, position, index, onHover }: SkillOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Load texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(skill.logo, (loadedTexture) => {
      setTexture(loadedTexture);
    });
  }, [skill.logo]);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      const time = state.clock.elapsedTime;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5 + index) * 0.1;
      
      // Rotation animation
      meshRef.current.rotation.y = time * 0.2 + index;
      
      // Scale animation on hover
      const targetScale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    // Counter-rotate the group to keep logos and text upright while circle spins
    if (groupRef.current) {
      groupRef.current.rotation.z = -state.clock.elapsedTime * 0.2;
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    onHover(skill);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover(null);
    document.body.style.cursor = 'auto';
  };

  if (!texture) return null;

  return (
    <group position={position} ref={groupRef}>
      {/* Glowing background sphere */}
      {/* <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[mobile ? 0.3 : 0.4, 32, 32]} />
        <meshBasicMaterial
          color={hovered ? skill.color : "#ffffff"}
          transparent={true}
          opacity={0.1}
        />
      </mesh> */}

      {/* Logo plane */}
      <mesh
        position={[0, 0, 0.01]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={[0.2, 0.2, 0.2]}
      >
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial
          map={texture}
          transparent={true}
          alphaTest={0.1}
        />
      </mesh>

      {/* Skill name */}
      <Text
        position={[0, -0.09, 0]}
        fontSize={0.03}
        color={hovered ? skill.color : "#ffffff"}
        anchorX="center"
        anchorY="middle"
        material-transparent={true}
      >
        {skill.name}
      </Text>

      {/* Particle ring effect when hovered */}
      {hovered && (
        <group>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 0.1;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(angle) * radius,
                  0
                ]}
              >
                <sphereGeometry args={[0.005]} />
                <meshBasicMaterial color={skill.color} />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}

interface InteractiveSkillsProps {
  mobile: boolean;
}

export default function InteractiveSkills({ mobile }: InteractiveSkillsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const titleRef = useRef<THREE.Group>(null);
  const [hoveredSkill, setHoveredSkill] = useState<typeof skillsData[0] | null>(null);

  // Arrange skills in a circle pattern
  const getSkillPosition = (index: number): [number, number, number] => {
    // Circle layout for desktop
    const radius = 0.5;
    const angle = (index / skillsData.length) * Math.PI * 2;
    return [
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    ];
  };

  useFrame((state) => {
    if (groupRef.current) {
      // Continuous spinning rotation of the entire skill circle
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={titleRef}>
    {/* Section title */}
      <Text
        position={[0, 2.75, 0]}
        fontSize={0.07}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        material-transparent={true}
      >
        Skills
      </Text>
    <group ref={groupRef} position={[0, 2.75, 0]}>
      {/* Skill orbs */}
      {skillsData.map((skill, index) => (
        <SkillOrb
          key={skill.name}
          skill={skill}
          position={getSkillPosition(index)}
          index={index}
          onHover={setHoveredSkill}
        />
      ))}

      {/* Skill description panel */}
      {hoveredSkill && (
        <group position={[0, -3.5, 0]}>
          {/* Background panel */}
          <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[5, 1.2]} />
            <meshBasicMaterial
              color="#1a1a1a"
              transparent={true}
              opacity={0.9}
            />
          </mesh>

          {/* Border */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[5.1, 1.3]} />
            <meshBasicMaterial
              color={hoveredSkill.color}
              transparent={true}
              opacity={0.3}
            />
          </mesh>

          {/* Skill name */}
          <Text
            position={[0, 0.3, 0.1]}
            fontSize={0.18}
            color={hoveredSkill.color}
            anchorX="center"
            anchorY="middle"
            material-transparent={true}
          >
            {hoveredSkill.name}
          </Text>

          {/* Skill description */}
          <Text
            position={[0, -0.15, 0.1]}
            fontSize={0.11}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            material-transparent={true}
          >
            {hoveredSkill.description}
          </Text>
        </group>
      )}

      {/* Background particles */}
      <group>
        {Array.from({ length: 50 }).map((_, i) => {
          const angle = Math.random() * Math.PI * 2;
          const radius = 6;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius * Math.random(),
                Math.sin(angle) * radius * Math.random(),
                -2 + Math.random() * 4
              ]}
            >
              <sphereGeometry args={[0.01]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent={true}
                opacity={0.3}
              />
            </mesh>
          );
        })}
      </group>

      {/* Ambient glow effect */}
      <pointLight
        position={[0, 0, 2]}
        intensity={1}
        color="#4a90e2"
        distance={12}
        decay={2}
      />
    </group>
    </group>
  );
}
