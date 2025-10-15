"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Float, Html, useScroll } from "@react-three/drei";
import * as THREE from "three";

interface Project {
  name: string;
  description: string;
  tech: string[];
  color: string;
  github: string;
  live?: string;
  details: string[];
}

const projects: Project[] = [
  {
    name: "CareCrew",
    description: "Full-stack service marketplace with User, Provider, and Admin roles",
    tech: ["Next.js", "TypeScript", "Node.js", "MongoDB", "Firebase", "AWS S3", "Stripe"],
    color: "#ffffff",
    github: "https://github.com/swagatchand98/carecrew",
    live: "https://carecrew-demo.vercel.app",
    details: [
      "Built a full-stack service marketplace (Urban Company–like) with roles for User, Provider, and Admin using Next.js, TypeScript, Node.js (Express), and MongoDB/Firestore.",
      "Implemented hybrid authentication (Firebase + JWT) and advanced security measures (bcrypt, CORS, Helmet, mongo-sanitize, rate limiting).",
      "Integrated real-time chat (WebSocket) and Stripe payments, enhancing user engagement and transaction reliability.",
      "Designed scalable image/file storage with AWS S3, multer-s3, and AWS SDK, and deployed on AWS EC2 ensuring 99.9% uptime."
    ]
  },
  {
    name: "Web3-Dropbox",
    description: "Decentralized cloud storage marketplace with crypto payments",
    tech: ["Next.js", "Ethers.js", "IPFS", "Hardhat", "Three.js", "RainbowKit"],
    color: "#ffffff",
    github: "https://github.com/swagatchand98/web3-dropbox",
    live: "https://web3-dropbox-demo.vercel.app",
    details: [
      "Built a decentralized cloud storage marketplace where providers rent out unused space and earn crypto, while users securely upload data.",
      "Integrated Web3 payments and wallet authentication using Ethers.js, WAGMI, Hardhat, and RainbowKit SDK.",
      "Leveraged IPFS + Helia for distributed storage and retrieval, ensuring censorship resistance and fault-tolerance.",
      "Developed a responsive Next.js + Tailwind frontend with Three.js visualizations and optimized data handling via TanStack Query."
    ]
  },
  {
    name: "Selzo",
    description: "SaaS platform for automated WhatsApp bot creation and management",
    tech: ["Next.js", "Node.js", "WhatsApp API", "AI", "Razorpay", "Stripe"],
    color: "#ffffff",
    github: "https://github.com/swagatchand98/selzo",
    live: "https://selzo-demo.vercel.app",
    details: [
      "Built a SaaS platform using Next.js, Node.js, and WhatsApp Cloud API that enables SMBs to auto-create and manage personalized WhatsApp bots.",
      "Features product uploads, AI-driven replies, and seamless customer interaction automation.",
      "Integrated Razorpay/Stripe payment systems for subscription management and transaction processing.",
      "Developed intuitive dashboard for bot customization, analytics, and performance monitoring."
    ]
  },
  {
    name: "Thesco",
    description: "Modern landing page for import and export company",
    tech: ["Next.js", "Framer Motion", "Tailwind", "Nodemailer"],
    color: "#ffffff",
    github: "https://github.com/swagatchand98/thesco",
    live: "https://thesco-demo.vercel.app",
    details: [
      "Landing page project for import and export company made with Next.js for optimal performance and SEO.",
      "Implemented smooth, engaging animations using Framer Motion for enhanced user experience.",
      "Designed responsive layout with Tailwind CSS ensuring perfect display across all devices.",
      "Integrated contact forms with Nodemailer for efficient lead generation and client communication."
    ]
  }
];

interface InteractiveProjectsProps {
  mobile: boolean;
}

export default function InteractiveProjects({ mobile }: InteractiveProjectsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const scroll = useScroll();

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.3) * 0.001;
      
      // Animate individual project cards based on scroll
      const { offset } = scroll;
      
      groupRef.current.children.forEach((child, index) => {
        if (child.name === `project-card-${index}`) {
          // Calculate when each project should appear
          // Projects start appearing at offset 0.8, with each card delayed by 0.05
          const projectStartOffset = 0.8 + (index * 0.05);
          const projectProgress = Math.max(0, Math.min(1, (offset - projectStartOffset) * 8));
          
          // Animate from below and slightly rotated
          const startY = mobile ? 2.2 - index * 1.8 - 1 : 2.8 - index * 2.2 - 1.5;
          const endY = mobile ? 2.2 - index * 1.8 : 2.8 - index * 2.2;
          
          child.position.y = THREE.MathUtils.lerp(startY, endY, projectProgress);
          child.rotation.x = THREE.MathUtils.lerp(-0.2, 0, projectProgress);
          
          // Fade in effect
          child.traverse((meshChild) => {
            if (meshChild instanceof THREE.Mesh && meshChild.material) {
              if (Array.isArray(meshChild.material)) {
                meshChild.material.forEach((material) => {
                  if (material.transparent !== undefined) {
                    material.transparent = true;
                    material.opacity = projectProgress * (material.userData?.baseOpacity || 0.9);
                  }
                });
              } else {
                meshChild.material.transparent = true;
                meshChild.material.opacity = projectProgress * (meshChild.material.userData?.baseOpacity || 0.9);
              }
            }
          });
        }
      });
    }
  });

  const handleProjectClick = (index: number) => {
    setSelectedProject(selectedProject === index ? null : index);
  };

  const handleLinkClick = (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <group ref={groupRef}>
      {/* Section Title */}
      <Text
        position={[0, mobile ? 3.5 : 3, 5]}
        fontSize={mobile ? 0.4 : 0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        material-transparent={true}
        font="/fonts/opening_hours_sans/OpeningHoursSans-Regular.woff"
      >
        Projects
      </Text>

      {/* Project Cards */}
      {projects.map((project, index) => {
        const isHovered = hoveredProject === index;
        const isSelected = selectedProject === index;

        // Vertical layout - cards stacked one below another
        const yPos = mobile ? 2.2 - index * 1.8 : (4.5 - index) * 0.8;

        return (
          <group key={project.name} name={`project-card-${index}`} position={[0, yPos, (index - 1) * 3]}>
            <Float
              speed={0.5}
              rotationIntensity={0.05}
              floatIntensity={0.1}
            >
              <group scale={[1, 1, 1]}>
                {/* Main Card Container */}
                <mesh position={[0, 0, 0]}>
                  <planeGeometry args={[mobile ? 4.2 : 4, mobile ? 1.4 : 1.6]} />
                  <meshBasicMaterial
                    color="#2C313D"
                    transparent={true}
                    opacity={0.9}
                    userData={{ baseOpacity: 0.9 }}
                  />
                </mesh>

                {/* Accent Border */}
                <mesh position={[0, 0, 0.01]}>
                  <planeGeometry args={[mobile ? 4.25 : 4.05, mobile ? 1.45 : 1.65]} />
                  <meshBasicMaterial
                    color={project.color}
                    transparent={true}
                    opacity={isHovered ? 0.4 : 0.2}
                    userData={{ baseOpacity: isHovered ? 0.4 : 0.2 }}
                  />
                </mesh>

                {/* Glow Effect on Hover */}
                {isHovered && (
                  <mesh position={[0, 0, -0.05]}>
                    <planeGeometry args={[mobile ? 4.4 : 6.2, mobile ? 1.6 : 1.8]} />
                    <meshBasicMaterial
                      color={project.color}
                      transparent={true}
                      opacity={0.1}
                    />
                  </mesh>
                )}

                {/* Project Content */}
                <group position={[mobile ? -1.9 : -1.8, 0, 0.02]}>
                  {/* Project Name */}
                  <Text
                    position={[0, mobile ? 0.4 : 0.5, 0]}
                    fontSize={mobile ? 0.12 : 0.1}
                    color="#ffffff"
                    anchorX="left"
                    anchorY="middle"
                    material-transparent={true}
                    font="/fonts/opening_hours_sans/OpeningHoursSans-Regular.woff"
                  >
                    {project.name}
                  </Text>

                  {/* Project Description */}
                  <Text
                    position={[0, mobile ? 0.15 : 0.2, 0]}
                    fontSize={mobile ? 0.07 : 0.07}
                    color="#cccccc"
                    anchorX="left"
                    anchorY="middle"
                    material-transparent={true}
                    maxWidth={mobile ? 3.5 : 4.5}
                  >
                    {project.description}
                  </Text>

                  {/* Tech Stack */}
                  <group position={[0, mobile ? -0.15 : -0.3, 0]}>
                    {project.tech.slice(0, mobile ? 3 : 5).map((tech, techIndex) => (
                      <group key={tech} position={[techIndex * (mobile ? 0.9 : 0.6), 0, 0]}>
                        <mesh position={[0.25, 0, -0.01]}>
                          <planeGeometry args={[mobile ? 0.7 : 0.5, 0.15]} />
                          <meshBasicMaterial
                            color={project.color}
                            transparent={true}
                            opacity={0.1}
                            userData={{ baseOpacity: 0.15 }}
                          />
                        </mesh>
                        <Text
                          position={[0.25, 0, 0]}
                          fontSize={mobile ? 0.05 : 0.05}
                          color={project.color}
                          anchorX="center"
                          anchorY="middle"
                          material-transparent={true}
                        >
                          {tech}
                        </Text>
                      </group>
                    ))}
                  </group>

                  {/* Action Buttons */}
                  <group position={[0, mobile ? -0.45 : -0.55, 0]}>
                    {/* GitHub Button */}
                    <group position={[0, 0, 0]}>
                      <mesh position={[0.25, 0, -0.01]}>
                        <planeGeometry args={[0.5, 0.15]} />
                        <meshBasicMaterial
                          color="#333333"
                          transparent={true}
                          opacity={0.8}
                          userData={{ baseOpacity: 0.8 }}
                        />
                      </mesh>
                      <Text
                        position={[0.25, 0, 0]}
                        fontSize={0.05}
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                        material-transparent={true}
                      >
                        GitHub
                      </Text>
                    </group>

                    {/* Live Demo Button */}
                    {project.live && (
                      <group position={[0.6, 0, 0]}>
                        <mesh position={[0.25, 0, -0.01]}>
                          <planeGeometry args={[0.5, 0.15]} />
                          <meshBasicMaterial
                            color={project.color}
                            transparent={true}
                            opacity={0.8}
                            userData={{ baseOpacity: 0.8 }}
                          />
                        </mesh>
                        <Text
                          position={[0.25, 0, 0]}
                          fontSize={0.05}
                          color="#ffffff"
                          anchorX="center"
                          anchorY="middle"
                          material-transparent={true}
                        >
                          Live Demo
                        </Text>
                      </group>
                    )}
                  </group>
                </group>

                {/* Expand Indicator */}
                <group position={[mobile ? 1.8 : 1.75, mobile ? 0.4 : 0.6, 0.05]}>
                  <mesh>
                    <sphereGeometry args={[0.03]} />
                    <meshBasicMaterial 
                      color={isSelected ? "#ffffff" : project.color}
                      transparent={true}
                      opacity={0.8}
                    />
                  </mesh>
                </group>

                {/* Detailed Information (Expanded State) */}
                {isSelected && (
                  <group position={[0, mobile ? -0.9 : -1.1, 0.03]}>
                    {/* Details Background */}
                    <mesh position={[0, 0, -0.02]}>
                      <planeGeometry args={[mobile ? 4.1 : 5.8, mobile ? 1.2 : 1.6]} />
                      <meshBasicMaterial
                        color="#050505"
                        transparent={true}
                        opacity={0.95}
                        userData={{ baseOpacity: 0.95 }}
                      />
                    </mesh>

                    {/* Details Border */}
                    <mesh position={[0, 0, -0.01]}>
                      <planeGeometry args={[mobile ? 4.15 : 5.85, mobile ? 1.25 : 1.65]} />
                      <meshBasicMaterial
                        color={project.color}
                        transparent={true}
                        opacity={0.3}
                        userData={{ baseOpacity: 0.3 }}
                      />
                    </mesh>

                    {/* Project Details */}
                    {project.details.slice(0, mobile ? 2 : 4).map((detail, detailIndex) => (
                      <Text
                        key={detailIndex}
                        position={[
                          mobile ? -1.9 : -2.7, 
                          mobile ? 0.35 - detailIndex * 0.3 : 0.5 - detailIndex * 0.25, 
                          0
                        ]}
                        fontSize={mobile ? 0.055 : 0.065}
                        color="#bbbbbb"
                        anchorX="left"
                        anchorY="top"
                        material-transparent={true}
                        maxWidth={mobile ? 3.6 : 5.2}
                      >
                        • {detail}
                      </Text>
                    ))}
                  </group>
                )}

                {/* Interactive Overlay */}
                <Html
                  position={[0, 0, 0.1]}
                  style={{
                    width: mobile ? '336px' : '480px',
                    height: mobile ? '112px' : '128px',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    background: 'transparent'
                  }}
                  onPointerEnter={() => setHoveredProject(index)}
                  onPointerLeave={() => setHoveredProject(null)}
                  onClick={() => handleProjectClick(index)}
                >
                  <div 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      background: 'transparent',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-start',
                      paddingLeft: mobile ? '20px' : '40px',
                      paddingBottom: mobile ? '15px' : '20px'
                    }}
                  >
                    {/* GitHub Link */}
                    <button
                      onClick={(e) => handleLinkClick(project.github, e)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: '10px',
                        width: '56px',
                        height: '20px'
                      }}
                    />
                    
                    {/* Live Demo Link */}
                    {project.live && (
                      <button
                        onClick={(e) => handleLinkClick(project.live!, e)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          width: '56px',
                          height: '20px'
                        }}
                      />
                    )}
                  </div>
                </Html>
              </group>
            </Float>
          </group>
        );
      })}

      {/* Ambient Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight
        position={[0, 2, 4]}
        intensity={mobile ? 0.4 : 0.6}
        color="#ffffff"
        distance={mobile ? 10 : 15}
        decay={2}
      />

      {/* Accent Lighting */}
      {!mobile && (
        <>
          <spotLight
            position={[-3, 3, 2]}
            angle={0.4}
            penumbra={0.6}
            intensity={0.3}
            color="#4ECDC4"
          />
          
          <spotLight
            position={[3, 3, 2]}
            angle={0.4}
            penumbra={0.6}
            intensity={0.3}
            color="#FF6B6B"
          />
        </>
      )}
    </group>
  );
}
