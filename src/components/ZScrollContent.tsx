"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, useScroll, Html, Float, useGLTF } from "@react-three/drei";
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

// GLTF Model Component
function CyborgModel() {
  const { scene, nodes, materials } = useGLTF("/cyborg_with_thermal_katana/scene.gltf");
  const modelRef = useRef<THREE.Group>(null);
  const katanaRef = useRef<THREE.Object3D>(null);
  const rightHandRef = useRef<THREE.Object3D>(null);
  const rightForeArmRef = useRef<THREE.Object3D>(null);
  const rightArmRef = useRef<THREE.Object3D>(null);
  const rightShoulderRef = useRef<THREE.Object3D>(null);
  const katanaLightRef = useRef<THREE.PointLight>(null);
  
  // Additional refs for full-body animation
  const leftArmRef = useRef<THREE.Object3D>(null);
  const leftShoulderRef = useRef<THREE.Object3D>(null);
  const spineRef = useRef<THREE.Object3D>(null);
  const hipsRef = useRef<THREE.Object3D>(null);
  const leftLegRef = useRef<THREE.Object3D>(null);
  const rightLegRef = useRef<THREE.Object3D>(null);
  
  // Mobile optimization - reduce features on mobile
  const [mobile, setMobile] = useState(false);
  
  useEffect(() => {
    setMobile(isMobile());
    
    // Listen for window resize to update mobile status
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Store original transforms
  const originalRightHandRotation = useRef<THREE.Euler>(new THREE.Euler());
  const originalRightForeArmRotation = useRef<THREE.Euler>(new THREE.Euler());
  const originalRightArmRotation = useRef<THREE.Euler>(new THREE.Euler());
  const originalRightShoulderRotation = useRef<THREE.Euler>(new THREE.Euler());
  const originalLeftArmRotation = useRef<THREE.Euler>(new THREE.Euler());
  const originalLeftShoulderRotation = useRef<THREE.Euler>(new THREE.Euler());
  const originalSpineRotation = useRef<THREE.Euler>(new THREE.Euler());
  const originalHipsRotation = useRef<THREE.Euler>(new THREE.Euler());
  const originalLeftLegRotation = useRef<THREE.Euler>(new THREE.Euler());
  const originalRightLegRotation = useRef<THREE.Euler>(new THREE.Euler());

  useEffect(() => {
    console.log('Nodes:', nodes)
    console.log('Materials:', materials)
    
    // Find and store references to all relevant objects
    if (nodes.Katana_71) {
      katanaRef.current = nodes.Katana_71;
      console.log('Found Katana_71:', nodes.Katana_71);
    }
    
    if (nodes.mixamorigRightHand_48) {
      rightHandRef.current = nodes.mixamorigRightHand_48;
      originalRightHandRotation.current.copy(nodes.mixamorigRightHand_48.rotation);
      console.log('Found Right Hand:', nodes.mixamorigRightHand_48);
    }
    
    if (nodes.mixamorigRightForeArm_49) {
      rightForeArmRef.current = nodes.mixamorigRightForeArm_49;
      originalRightForeArmRotation.current.copy(nodes.mixamorigRightForeArm_49.rotation);
      console.log('Found Right Forearm:', nodes.mixamorigRightForeArm_49);
    }
    
    if (nodes.mixamorigRightArm_50) {
      rightArmRef.current = nodes.mixamorigRightArm_50;
      originalRightArmRotation.current.copy(nodes.mixamorigRightArm_50.rotation);
      console.log('Found Right Arm:', nodes.mixamorigRightArm_50);
    }
    
    if (nodes.mixamorigRightShoulder_51) {
      rightShoulderRef.current = nodes.mixamorigRightShoulder_51;
      originalRightShoulderRotation.current.copy(nodes.mixamorigRightShoulder_51.rotation);
      console.log('Found Right Shoulder:', nodes.mixamorigRightShoulder_51);
    }

    // Find additional body parts for full-body animation
    if (nodes.mixamorigLeftArm_46) {
      leftArmRef.current = nodes.mixamorigLeftArm_46;
      originalLeftArmRotation.current.copy(nodes.mixamorigLeftArm_46.rotation);
      console.log('Found Left Arm:', nodes.mixamorigLeftArm_46);
    }
    
    if (nodes.mixamorigLeftShoulder_47) {
      leftShoulderRef.current = nodes.mixamorigLeftShoulder_47;
      originalLeftShoulderRotation.current.copy(nodes.mixamorigLeftShoulder_47.rotation);
      console.log('Found Left Shoulder:', nodes.mixamorigLeftShoulder_47);
    }
    
    if (nodes.mixamorigSpine2_11) {
      spineRef.current = nodes.mixamorigSpine2_11;
      originalSpineRotation.current.copy(nodes.mixamorigSpine2_11.rotation);
      console.log('Found Spine2:', nodes.mixamorigSpine2_11);
    }
    
    if (nodes.mixamorigHips_0) {
      hipsRef.current = nodes.mixamorigHips_0;
      originalHipsRotation.current.copy(nodes.mixamorigHips_0.rotation);
      console.log('Found Hips:', nodes.mixamorigHips_0);
    }
    
    if (nodes.mixamorigLeftUpLeg_1) {
      leftLegRef.current = nodes.mixamorigLeftUpLeg_1;
      originalLeftLegRotation.current.copy(nodes.mixamorigLeftUpLeg_1.rotation);
      console.log('Found Left Leg:', nodes.mixamorigLeftUpLeg_1);
    }
    
    if (nodes.mixamorigRightUpLeg_18) {
      rightLegRef.current = nodes.mixamorigRightUpLeg_18;
      originalRightLegRotation.current.copy(nodes.mixamorigRightUpLeg_18.rotation);
      console.log('Found Right Leg:', nodes.mixamorigRightUpLeg_18);
    }

    // Attach katana to right hand after both are found
    if (katanaRef.current && rightHandRef.current) {
      // Remove katana from its current parent
      if (katanaRef.current.parent) {
        katanaRef.current.parent.remove(katanaRef.current);
      }
      
      // Reset katana to proper grip position and rotation
      katanaRef.current.position.set(0.1, 0.1, 0); // Position in palm, slightly forward and up
      katanaRef.current.rotation.set(0 , 0 , Math.PI); // Rotate to point upward from hand at angle
      
      // Add katana as child of right hand
      rightHandRef.current.add(katanaRef.current);
      
      console.log('Katana attached to right hand');
    }
  }, [nodes, materials])

  useFrame((state) => {
    // Reduce animation complexity on mobile
    const animationScale = mobile ? 0.5 : 1;
    
    if (modelRef.current) {
      // Reduced rotation animation on mobile
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 * animationScale) * 0.1 * animationScale;
    }

    // Simplified swing animation on mobile
    const time = state.clock.elapsedTime;
    const swingCycle = mobile ? (time % 6) / 6 : (time % 4) / 7; // Slower on mobile
    
    let swingProgress = 0;
    let armSwingAngle = 0;
    let forearmBend = 0;
    let handRotation = 0;
    let shoulderLift = 0;
    
    // Additional animation variables for full-body movement
    let torsoTwist = 0;
    let hipRotation = 0;
    let leftArmBalance = 0;
    let leftShoulderMove = 0;
    let stanceShift = 0;
    let weightTransfer = 0;
    
    if (swingCycle < 0.3) {
      // Wind up phase (0 to 0.3) - 1.2 seconds
      const windUpProgress = swingCycle / 0.3;
      swingProgress = Math.sin(windUpProgress * Math.PI * 0.5) * -0.2;
      
      // Arm movements during wind-up
      armSwingAngle = Math.sin(windUpProgress * Math.PI * 0.5) * -0.1; // Pull back
      forearmBend = Math.sin(windUpProgress * Math.PI * 0.5) * -0.6; // Bend elbow
      handRotation = Math.sin(windUpProgress * Math.PI * 0.5) * 0.4; // Cock wrist
      shoulderLift = Math.sin(windUpProgress * Math.PI * 0.5) * 0.5; // Lift shoulder
      
      // Full-body wind-up movements
      torsoTwist = Math.sin(windUpProgress * Math.PI * 0.5) * -0.3; // Twist torso back
      hipRotation = Math.sin(windUpProgress * Math.PI * 0.5) * -0.2; // Rotate hips slightly
      leftArmBalance = Math.sin(windUpProgress * Math.PI * 0.5) * 0.4; // Left arm counterbalance
      leftShoulderMove = Math.sin(windUpProgress * Math.PI * 0.5) * 0.2; // Left shoulder adjustment
      stanceShift = Math.sin(windUpProgress * Math.PI * 0.5) * 0.15; // Subtle stance shift
      weightTransfer = Math.sin(windUpProgress * Math.PI * 0.5) * 0.1; // Weight on back leg
      
    } else if (swingCycle < 0.5) {
      // Quick swing phase (0.3 to 0.5) - 0.8 seconds
      const swingPhaseProgress = (swingCycle - 0.3) / 0.2;
      const easeOut = 1 - Math.pow(1 - swingPhaseProgress, 3);
      swingProgress = -0.2 + easeOut * 1.8; // From -0.2 to 1.6 radians
      
      // Explosive arm movements during swing
      armSwingAngle = -0.4 + easeOut * 1.6; // From -0.4 to 1.2 radians
      forearmBend = 0.3 - easeOut * -1.2; // Straighten arm explosively
      handRotation = -0.2 + easeOut * 0.8; // Snap wrist forward
      shoulderLift = 0.2 + easeOut * 0.3; // Continue shoulder movement
      
      // Full-body explosive swing movements
      torsoTwist = -0.3 + easeOut * 1.0; // Explosive torso rotation forward
      hipRotation = -0.2 + easeOut * 0.6; // Hips follow torso rotation
      leftArmBalance = 0.4 - easeOut * 0.8; // Left arm swings opposite for balance
      leftShoulderMove = 0.2 + easeOut * 0.3; // Left shoulder moves forward
      stanceShift = 0.15 + easeOut * 0.25; // Step into swing
      weightTransfer = 0.1 + easeOut * 0.4; // Weight transfers to front leg
      
    } else {
      // Return to rest phase (0.5 to 1.0) - 2 seconds
      const returnProgress = (swingCycle - 0.5) / 0.15;
      const easeIn = Math.pow(returnProgress, 2);
      swingProgress = 1.6 - easeIn * 1.6; // Return to 0
      
      // Gradual return to rest position
      armSwingAngle = 1.2 - easeIn * 1.2; // Return to 0
      forearmBend = 1.5 + easeIn * 4; // Return to 0
      handRotation = 0.6 - easeIn * 0.6; // Return to 0
      shoulderLift = 0.5 - easeIn * 0.5; // Return to 0
      
      // Full-body return to rest
      torsoTwist = 0.7 - easeIn * 0.7; // Return torso to neutral
      hipRotation = 0.4 - easeIn * 0.4; // Return hips to neutral
      leftArmBalance = -0.4 + easeIn * 0.4; // Return left arm
      leftShoulderMove = 0.5 - easeIn * 0.5; // Return left shoulder
      stanceShift = 0.4 - easeIn * 0.4; // Return stance
      weightTransfer = 0.5 - easeIn * 0.5; // Return weight distribution
    }

    // Apply katana thermal glow effect - simplified on mobile
    if (katanaRef.current && !mobile) {
      // Calculate glow intensity based on arm movement and swing speed
      const swingSpeed = Math.abs(armSwingAngle) + Math.abs(forearmBend) + Math.abs(handRotation);
      const glowIntensity = Math.abs(armSwingAngle) * 0.8 + swingSpeed * 0.3 + 0.2;
      
      // Enhanced thermal glow effect - simulate heating metal
      const thermalHeat = Math.min(1.0, glowIntensity * 1.5);
      
      katanaRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => {
              if (material.emissive) {
                // Create thermal heating effect - red hot to white hot
                if (thermalHeat < 0.3) {
                  material.emissive.setRGB(thermalHeat * 2, 0, 0);
                } else if (thermalHeat < 0.6) {
                  material.emissive.setRGB(1, (thermalHeat - 0.3) * 2, 0);
                } else {
                  material.emissive.setRGB(1, 1, (thermalHeat - 0.6) * 2.5);
                }
                
                // Add pulsing effect during swing
                if (swingSpeed > 0.5) {
                  const pulse = Math.sin(state.clock.elapsedTime * 20) * 0.3 + 0.7;
                  material.emissive.multiplyScalar(pulse);
                }
              }
            });
          } else if (child.material.emissive) {
            if (thermalHeat < 0.3) {
              child.material.emissive.setRGB(thermalHeat * 2, 0, 0);
            } else if (thermalHeat < 0.6) {
              child.material.emissive.setRGB(1, (thermalHeat - 0.3) * 2, 0);
            } else {
              child.material.emissive.setRGB(1, 1, (thermalHeat - 0.6) * 2.5);
            }
            
            if (swingSpeed > 0.5) {
              const pulse = Math.sin(state.clock.elapsedTime * 20) * 0.3 + 0.7;
              child.material.emissive.multiplyScalar(pulse);
            }
          }
        }
      });
      
      // Update katana light with thermal colors
      if (katanaLightRef.current && rightHandRef.current) {
        const katanaWorldPos = new THREE.Vector3();
        katanaRef.current.getWorldPosition(katanaWorldPos);
        
        katanaLightRef.current.position.copy(katanaWorldPos);
        katanaLightRef.current.intensity = 5 + thermalHeat * 40 + (swingSpeed > 0.5 ? 20 : 0);
        
        if (thermalHeat < 0.3) {
          katanaLightRef.current.color.setRGB(1, 0.1, 0);
        } else if (thermalHeat < 0.6) {
          katanaLightRef.current.color.setRGB(1, 0.4, 0);
        } else {
          katanaLightRef.current.color.setRGB(1, 0.9, 0.7);
        }
      }
    } else if (katanaRef.current && mobile) {
      // Simple glow for mobile
      const simpleGlow = Math.abs(armSwingAngle) * 0.3;
      katanaRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material && child.material.emissive) {
          child.material.emissive.setRGB(simpleGlow, simpleGlow * 0.3, 0);
        }
      });
    }

    // Apply right arm bone animations - simplified on mobile
    if (rightShoulderRef.current) {
      rightShoulderRef.current.rotation.copy(originalRightShoulderRotation.current);
      rightShoulderRef.current.rotation.z -= shoulderLift * 0.3 * animationScale;
      rightShoulderRef.current.rotation.x -= armSwingAngle * 0.3 * animationScale;
    }

    if (rightArmRef.current) {
      rightArmRef.current.rotation.copy(originalRightArmRotation.current);
      rightArmRef.current.rotation.z -= armSwingAngle * animationScale;
      rightArmRef.current.rotation.x -= armSwingAngle * 0.5 * animationScale;
    }

    if (rightForeArmRef.current) {
      rightForeArmRef.current.rotation.copy(originalRightForeArmRotation.current);
      rightForeArmRef.current.rotation.y -= forearmBend * animationScale;
    }

    if (rightHandRef.current) {
      rightHandRef.current.rotation.copy(originalRightHandRotation.current);
      rightHandRef.current.rotation.z -= handRotation * animationScale;
      rightHandRef.current.rotation.x -= handRotation * 0.5 * animationScale;
    }
  });

  // Configure the model for better lighting and mobile optimization
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Mobile optimization - disable shadows on mobile for performance
          child.castShadow = !mobile;
          child.receiveShadow = !mobile;
          
          // Optimize materials for performance
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => {
                if (material instanceof THREE.MeshStandardMaterial) {
                  // Reduce quality on mobile
                  material.envMapIntensity = mobile ? 0.2 : 0.5;
                  material.roughness = mobile ? 0.6 : 0.4;
                  material.metalness = mobile ? 0.4 : 0.6;
                  
                  // Disable unnecessary features on mobile
                  if (mobile) {
                    material.transparent = false;
                    material.alphaTest = 0;
                  }
                }
              });
            } else if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.envMapIntensity = mobile ? 0.2 : 0.5;
              child.material.roughness = mobile ? 0.6 : 0.4;
              child.material.metalness = mobile ? 0.4 : 0.6;
              
              if (mobile) {
                child.material.transparent = false;
                child.material.alphaTest = 0;
              }
            }
          }
        }
      });
    }
  }, [scene, mobile]);

  return (
    <group ref={modelRef} scale={mobile ? [2.0, 2.0, 2.0] : [3.2, 3.2, 3.2]} position={[0, mobile ? -2.5 : -3.4, 0]}>
      <primitive object={scene} />
      
      {/* Thermal effects - simplified on mobile */}
      {!mobile && (
        <>
          {/* Heat distortion particles - desktop only */}
          <group>
            {Array.from({ length: 4 }).map((_, i) => (
              <mesh
                key={`heat-particle-${i}`}
                position={[
                  0.1 + (Math.random() - 0.5) * 0.1,
                  0.1 + i * 0.15,
                  (Math.random() - 0.5) * 0.05,
                ]}
              >
                <sphereGeometry args={[0.005 + Math.random() * 0.01]} />
                <meshBasicMaterial
                  color={i % 2 === 0 ? "#ff6600" : "#ffaa00"}
                  transparent
                  opacity={0.4}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            ))}
          </group>
        </>
      )}
      
      {/* Dynamic katana light - reduced intensity on mobile */}
      <pointLight
        ref={katanaLightRef}
        intensity={mobile ? 1 : 2}
        color="#ff4500"
        distance={mobile ? 2 : 4}
        decay={2}
      />
    </group>
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

      {/* GLTF 3D Model */}
      <group ref={gltfModelGroupRef} position={[0, -1.5, 0]}>
        <CyborgModel />
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

// Preload the GLTF model for better performance
useGLTF.preload("/cyborg_with_thermal_katana/scene.gltf");
