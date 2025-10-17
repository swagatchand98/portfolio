"use client";

import { useRef, useState, useEffect } from "react";
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
    name: "Thesco",
    description:
      "Modern, responsive landing page for import-export company featuring smooth Framer Motion animations, optimized SEO performance, integrated contact forms, and professional design showcasing company services and global trade capabilities.",
    tech: ["Next.js", "Framer Motion", "Tailwind", "Nodemailer"],
    color: "#ffffff",
    github: "https://github.com/swagatchand98/Thesco-web",
    live: "https://thesco.vercel.app",
    details: [
      "Landing page project for import and export company made with Next.js for optimal performance and SEO.",
      "Implemented smooth, engaging animations using Framer Motion for enhanced user experience.",
      "Designed responsive layout with Tailwind CSS ensuring perfect display across all devices.",
      "Integrated contact forms with Nodemailer for efficient lead generation and client communication.",
    ],
  },
  {
    name: "Web3-Dropbox",
    description:
      "Decentralized cloud storage marketplace where providers monetize unused space through cryptocurrency. Built with IPFS for distributed storage, Web3 wallet integration, and modern Three.js visualizations for enhanced user experience.",
    tech: ["Next.js", "Ethers.js", "IPFS", "Hardhat", "Three.js", "RainbowKit"],
    color: "#ffffff",
    github: "https://github.com/swagatchand98/web3-dropbox",
    live: "https://web3-dropbox.vercel.app",
    details: [
      "Built a decentralized cloud storage marketplace where providers rent out unused space and earn crypto, while users securely upload data.",
      "Integrated Web3 payments and wallet authentication using Ethers.js, WAGMI, Hardhat, and RainbowKit SDK.",
      "Leveraged IPFS + Helia for distributed storage and retrieval, ensuring censorship resistance and fault-tolerance.",
      "Developed a responsive Next.js + Tailwind frontend with Three.js visualizations and optimized data handling via TanStack Query.",
    ],
  },
  {
    name: "Selzo",
    description:
      "AI-powered SaaS platform enabling small businesses to create and manage automated WhatsApp bots. Features intelligent product uploads, automated customer responses, subscription management, and comprehensive analytics dashboard for business growth.",
    tech: ["Next.js", "Node.js", "WhatsApp API", "AI", "Razorpay", "Stripe"],
    color: "#ffffff",
    github: "https://github.com/swagatchand98/selzo-web",
    live: "https://selzo.vercel.app",
    details: [
      "Built a SaaS platform using Next.js, Node.js, and WhatsApp Cloud API that enables SMBs to auto-create and manage personalized WhatsApp bots.",
      "Features product uploads, AI-driven replies, and seamless customer interaction automation.",
      "Integrated Razorpay/Stripe payment systems for subscription management and transaction processing.",
      "Developed intuitive dashboard for bot customization, analytics, and performance monitoring.",
    ],
  },
  {
    name: "CareConnect",
    description:
      "Full-stack service marketplace connecting users with service providers. Features real-time chat, secure payments, multi-role authentication, and comprehensive admin dashboard for seamless service management and booking experience.",
    tech: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "Firebase",
      "AWS S3",
      "Stripe",
    ],
    color: "#ffffff",
    github: "https://careconnect-links.carrd.co",
    live: "https://careconnect-links.carrd.co",
    details: [
      "Built a full-stack service marketplace (Urban Company–like) with roles for User, Provider, and Admin using Next.js, TypeScript, Node.js (Express), and MongoDB/Firestore.",
      "Implemented hybrid authentication (Firebase + JWT) and advanced security measures (bcrypt, CORS, Helmet, mongo-sanitize, rate limiting).",
      "Integrated real-time chat (WebSocket) and Stripe payments, enhancing user engagement and transaction reliability.",
      "Designed scalable image/file storage with AWS S3, multer-s3, and AWS SDK, and deployed on AWS EC2 ensuring 99.9% uptime.",
    ],
  },
];

interface InteractiveProjectsProps {
  mobile: boolean;
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
                0.5,
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

export default function InteractiveProjects({
  mobile,
}: InteractiveProjectsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const scroll = useScroll();

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // // Subtle floating animation
      // groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.3) * 0.001;

      // Animate individual project cards based on scroll
      const { offset } = scroll;

      groupRef.current.children.forEach((child, index) => {
        if (child.name === `project-card-${index}`) {
          // Calculate when each project should appear
          // Projects start appearing at offset 0.8, with each card delayed by 0.05
          const projectStartOffset = 0.8 + index * 0.05;
          const projectProgress = Math.max(
            0,
            Math.min(1, (offset - projectStartOffset) * 8)
          );

          // Animate from below and slightly rotated
          // const startY = 2.8 - index * 2.2 - 1.5;
          // const endY = 2.8 - index * 2.2;

          // child.position.y = THREE.MathUtils.lerp(startY, endY, projectProgress);
          // child.rotation.x = THREE.MathUtils.lerp(-0.2, 0, projectProgress);

          // Fade in effect
          child.traverse((meshChild) => {
            if (meshChild instanceof THREE.Mesh && meshChild.material) {
              if (Array.isArray(meshChild.material)) {
                meshChild.material.forEach((material) => {
                  if (material.transparent !== undefined) {
                    material.transparent = true;
                    material.opacity =
                      projectProgress * (material.userData?.baseOpacity || 0.9);
                  }
                });
              } else {
                meshChild.material.transparent = true;
                meshChild.material.opacity =
                  projectProgress *
                  (meshChild.material.userData?.baseOpacity || 0.9);
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
    window.open(url, "_blank");
  };

  return (
    <group ref={groupRef} position={[0, isMobile ? 1.4 : 0, 0]}>
      {/* Section Title */}
      <Text
        position={[0, isMobile ? 4 : 3, isMobile ? 5 : 5]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        material-transparent={true}
        font="/fonts/opening_hours_sans/OpeningHoursSans-Regular.woff"
      >
        Projects
      </Text>
      <FloatingParticles />

      {/* Project Cards */}
      {projects.map((project, index) => {
        const isHovered = hoveredProject === index;
        const isSelected = selectedProject === index;

        // Mobile: 2x2 grid layout, Desktop: vertical stack
        let xPos = 0;
        let yPos = 0;
        let zPos = 0;

        if (isMobile) {
          // 2x2 grid layout for mobile
          // First 2 cards (index 0,1) on left column, next 2 cards (index 2,3) on right column
          const col = Math.floor(index / 2); // 0 for first 2 cards, 1 for next 2 cards
          const row = index % 2; // 0 for top card in column, 1 for bottom card in column

          xPos = 0; // Left or right column
          yPos = 2 - row * 2.5; // Top or bottom position in column
          zPos = 6 * Math.floor(index / 2); // Same z-depth for mobile
        } else {
          // Desktop: vertical stack
          xPos = 0;
          yPos = (4.5 - index) * 0.8;
          zPos = (index - 1) * 3;
        }

        return (
          <group
            key={project.name}
            name={`project-card-${index}`}
            position={[xPos, yPos, zPos]}
          >
            <group scale={[1, 1, 1]}>
              {/* Main Card Container */}
              <mesh position={[0, 0, 0]}>
                <planeGeometry args={isMobile ? [3, 2.2] : [4, 1.6]} />
                <meshBasicMaterial
                  color="#2C313D"
                  transparent={true}
                  opacity={0.9}
                  userData={{ baseOpacity: 0.9 }}
                />
              </mesh>
              <FloatingParticles />

              {/* Project Content */}
              <group position={[-1.2, 0, 0.02]}>
                {/* Project Name */}
                <Text
                  position={[0, isMobile ? 0.7 : 0.5, 0]}
                  fontSize={isMobile ? 0.15 : 0.1}
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
                  position={[0, isMobile ? 0.3 : 0.2, 0]}
                  fontSize={isMobile ? 0.08 : 0.07}
                  color="#cccccc"
                  anchorX="left"
                  anchorY="middle"
                  material-transparent={true}
                  maxWidth={2.5}
                >
                  {project.description}
                </Text>

                {/* Tech Stack */}
                <group position={[0, -0.3, 0]}>
                  {project.tech
                    .slice(0, isMobile ? 4 : 5)
                    .map((tech, techIndex) => (
                      <group key={tech} position={[techIndex * 0.6, 0, 0]}>
                        <mesh position={[0.25, 0, -0.01]}>
                          <planeGeometry args={[0.5, 0.15]} />
                          <meshBasicMaterial
                            color={project.color}
                            transparent={true}
                            opacity={0.1}
                            userData={{ baseOpacity: 0.15 }}
                          />
                        </mesh>
                        <Text
                          position={[0.25, 0, 0]}
                          fontSize={0.05}
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
                <group position={[0, -0.55, 0]}>
                  {/* GitHub Button */}
                  <group position={[0, 0, 0]}>
                    <mesh 
                      position={[0.25, 0, -0.01]}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.github, '_blank');
                      }}
                      onPointerOver={() => document.body.style.cursor = 'pointer'}
                      onPointerOut={() => document.body.style.cursor = 'default'}
                    >
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
                      <mesh 
                        position={[0.25, 0, -0.01]}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.live!, '_blank');
                        }}
                        onPointerOver={() => document.body.style.cursor = 'pointer'}
                        onPointerOut={() => document.body.style.cursor = 'default'}
                      >
                        <planeGeometry args={[0.5, 0.15]} />
                        <meshBasicMaterial
                          color={project.color}
                          transparent={true}
                          opacity={0.2}
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
              <group position={[1.75, 0.6, 0.05]}>
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
                <group position={[0, -1.1, 0.03]}>
                  {/* Details Background */}
                  <mesh position={[0, 0, -0.02]}>
                    <planeGeometry args={[5.8, 1.6]} />
                    <meshBasicMaterial
                      color="#050505"
                      transparent={true}
                      opacity={0.95}
                      userData={{ baseOpacity: 0.95 }}
                    />
                  </mesh>

                  {/* Details Border */}
                  <mesh position={[0, 0, -0.01]}>
                    <planeGeometry args={[5.85, 1.65]} />
                    <meshBasicMaterial
                      color={project.color}
                      transparent={true}
                      opacity={0.3}
                      userData={{ baseOpacity: 0.3 }}
                    />
                  </mesh>

                  {/* Project Details */}
                  {project.details.slice(0, 4).map((detail, detailIndex) => (
                    <Text
                      key={detailIndex}
                      position={[-2.7, 0.5 - detailIndex * 0.25, 0]}
                      fontSize={0.065}
                      color="#bbbbbb"
                      anchorX="left"
                      anchorY="top"
                      material-transparent={true}
                      maxWidth={5.2}
                    >
                      • {detail}
                    </Text>
                  ))}
                </group>
              )}

              {/* Interactive Overlay */}
              <Html
                position={[0, 5, 0.1]}
                style={{
                  width: isMobile ? "300px" : "480px",
                  height: isMobile ? "420px" : "128px",
                  pointerEvents: "auto",
                  cursor: "pointer",
                  background: "transparent",
                }}
                onPointerEnter={() => setHoveredProject(index)}
                onPointerLeave={() => setHoveredProject(null)}
                onClick={() => handleProjectClick(index)}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "transparent",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    paddingLeft: "40px",
                    paddingBottom: "20px",
                  }}
                >
                  {/* GitHub Link */}
                  <button
                    onClick={(e) => handleLinkClick(project.github, e)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      marginRight: "10px",
                      width: "56px",
                      height: "20px",
                    }}
                  />

                  {/* Live Demo Link */}
                  {project.live && (
                    <button
                      onClick={(e) => handleLinkClick(project.live!, e)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        width: "56px",
                        height: "20px",
                      }}
                    />
                  )}
                </div>
              </Html>
            </group>
          </group>
        );
      })}

      {/* Ambient Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight
        position={[0, 2, 4]}
        intensity={0.6}
        color="#ffffff"
        distance={15}
        decay={2}
      />

      {/* Accent Lighting */}
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
    </group>
  );
}
