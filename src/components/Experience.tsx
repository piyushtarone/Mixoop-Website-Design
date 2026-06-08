import { useRef, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Environment, Float, Text, Html, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Macbook from "./models/Macbook";
import { Cloud, ShieldCheck, Cpu, ClipboardList, CalendarDays, Share2, Building2, Users } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ShootingStar = ({ delay = 0, yOffset = 0 }) => {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    if (!ref.current || !matRef.current) return;

    // Randomize initial position
    const startX = 15 + Math.random() * 20; // spawn off-screen right
    const startY = yOffset + Math.random() * 10;
    const startZ = -10 - Math.random() * 10;

    const duration = 0.5 + Math.random() * 0.8;

    ref.current.position.set(startX, startY, startZ);
    matRef.current.opacity = 0;

    // Increased repeatDelay to reduce the frequency of the shooting stars
    const tl = gsap.timeline({ repeat: -1, delay: delay + Math.random() * 2, repeatDelay: Math.random() * 10 + 5 });

    // Shooting star trajectory (diagonally down-left)
    tl.to(matRef.current, { opacity: 0.8, duration: duration * 0.1, ease: "power1.in" }, 0);
    tl.to(ref.current.position, {
      x: startX - 40,
      y: startY - 20,
      duration: duration,
      ease: "power1.inOut"
    }, 0);
    tl.to(matRef.current, { opacity: 0, duration: duration * 0.2, ease: "power1.out" }, duration * 0.8);

    return () => { tl.kill(); };
  }, [delay, yOffset]);

  return (
    <mesh ref={ref} rotation={[0, 0, Math.atan2(-20, -40)]}>
      {/* Reduced the width/thickness from 0.05 to 0.02 */}
      <boxGeometry args={[4, 0.02, 0.02]} />
      <meshBasicMaterial ref={matRef} color="#ffffff" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
};

const ShootingStarsBackground = () => {
  // Reduced total number of shooting stars from 20 to 8
  const stars = Array.from({ length: 8 });
  return (
    <group>
      {stars.map((_, i) => (
        <ShootingStar key={i} delay={i * 0.3} yOffset={5 - Math.random() * 50} />
      ))}
    </group>
  );
};

export default function Experience() {
  const { camera } = useThree();
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Refs for objects
  const cardsGroupRef = useRef<THREE.Group>(null);
  const cardGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const iconsGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const macbookRef = useRef<THREE.Group>(null);
  const serviceCardsGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const techUniverseRef = useRef<THREE.Group>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const orbitalRefs = useRef<(THREE.Group | null)[]>([]);

  const colors = ['#FF2A6D', '#05D9E8', '#01FFE1', '#FF7B00', '#7A04EB', '#FF2A6D'];
  const products = ['Form Flow', 'Mix Events', 'Hub', 'ERP', 'HRMS'];
  const productIcons = [ClipboardList, CalendarDays, Share2, Building2, Users];
  const servicesList = ['AI Solutions', 'Web Dev', 'Mobile Apps', 'Cloud Infra', 'Automation'];
  const techList = ['React', 'NextJS', 'NodeJS', 'Python', 'AWS', 'Docker', 'MongoDB', 'AI'];

  // Load textures asynchronously to avoid Suspense requirement
  const [textures, setTextures] = useState<THREE.Texture[] | null>(null);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const getBasePath = () => process.env.NODE_ENV === 'production' ? '/Mixoop-Website-Design' : '';
    Promise.all([
      loader.loadAsync(`${getBasePath()}/images/cloud.png`),
      loader.loadAsync(`${getBasePath()}/images/shield.png`),
      loader.loadAsync(`${getBasePath()}/images/brain.png`)
    ]).then(setTextures);
  }, []);

  useGSAP(() => {
    // Reset camera position just in case
    camera.position.set(0, 0, 5);

    tl.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrubbing
      }
    });

    // 0-2: Portal zoom (Handled in HTML)

    // Scene 1: Digital Ecosystem (Floating Cards & MacBook)
    cardGroupRefs.current.forEach((card, i) => {
      if (card && tl.current) {
        tl.current.fromTo(card.position,
          { x: -15, y: (2 - i) * 1.0, z: 0 },
          { x: 0, y: (2 - i) * 1.0, z: 0, duration: 1.5, ease: "power3.out" },
          2.5 + (4 - i) * 0.4
        );
      }
    });

    if (macbookRef.current) {
      tl.current.fromTo(macbookRef.current.position, { x: 10, y: 0.5, z: -1 }, { x: 2.0, y: 0.5, z: -1, duration: 2 }, 3.5);
      tl.current.fromTo(macbookRef.current.rotation, { x: 0, y: -Math.PI / 2 }, { x: 0.1, y: -0.2, duration: 2 }, 3.5);

      cardGroupRefs.current.forEach((card, i) => {
        if (card && tl.current) {
          tl.current.to(card.position, { x: 5.0, y: -0.6, z: -0.5, duration: 1, ease: "power2.inOut" }, 6 + i * 0.4);
          tl.current.to(card.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: "power2.in" }, 6.5 + i * 0.4);

          const icon = iconsGroupRefs.current[i];
          if (icon) {
            tl.current.fromTo(icon.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out(1.5)" }, 6.8 + i * 0.4);
          }
        }
      });
    }

    // Laptop moves closer (Digital Ecosystem full view)
    if (macbookRef.current) {
      tl.current.to(macbookRef.current.position, { x: 0, y: 0.5, duration: 2 }, 8);
      tl.current.to(camera.position, { z: 4.5, y: -0.5, duration: 2 }, 8);
      tl.current.to(macbookRef.current.rotation, { x: 0, y: 0, duration: 2 }, 8);
    }

    // Scene 2: Services Explosion
    if (macbookRef.current) {
      tl.current.to(macbookRef.current.position, { x: -3.5, y: 0.5, duration: 2 }, 10);
      tl.current.to(macbookRef.current.rotation, { y: Math.PI / 5, duration: 2 }, 10);

      iconsGroupRefs.current.forEach((icon, i) => {
        if (icon && tl.current) tl.current.to(icon.scale, { x: 0, y: 0, z: 0, duration: 0.5 }, 10 + i * 0.1);
      });

      serviceCardsGroupRefs.current.forEach((card, i) => {
        if (card && tl.current) {
          tl.current.to(card.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out(1.5)" }, 10.5 + i * 0.15);
        }
      });

      // Fly out towards the camera one by one
      serviceCardsGroupRefs.current.forEach((card, i) => {
        if (card && tl.current) {
          // The laptop is rotated by Math.PI / 5. 
          // Base vector to fly straight at the camera (global Z)
          const angle = Math.PI / 5;
          const flyDistance = 12; 
          const baseLocalZ = flyDistance * Math.cos(angle);
          const baseLocalX = flyDistance * -Math.sin(angle);

          // Scatter destinations: Right, Up, Below, Left, Bottom-Right
          let scatterX = 0;
          let scatterY = 0;
          if (i === 0) { scatterX = 12; scatterY = 2; }        // Right
          else if (i === 1) { scatterX = 2; scatterY = 10; }   // Up
          else if (i === 2) { scatterX = -2; scatterY = -10; } // Below
          else if (i === 3) { scatterX = -12; scatterY = 2; }  // Left
          else { scatterX = 8; scatterY = -8; }                // Bottom Right

          tl.current.to(card.position, {
            z: baseLocalZ + Math.abs(scatterX) * 0.2, // Fly further if scattering wide
            x: baseLocalX + scatterX,
            y: scatterY,
            duration: 1.5,
            ease: "power2.in"
          }, 12 + i * 0.8); // Stagger interval

          tl.current.to(card.scale, {
            x: 6, y: 6, z: 6,
            duration: 1.5,
            ease: "power2.in"
          }, 12 + i * 0.8);

          tl.current.to(card.rotation, {
            x: scatterY * 0.05, // Lean up/down
            y: -angle + (scatterX * 0.05), // Counter-rotate to face user, plus lean left/right
            z: -scatterX * 0.02, // Slight swinging tilt
            duration: 1.5,
            ease: "power1.inOut"
          }, 12 + i * 0.8);
        }
      });
    }

    // Fly laptop away only AFTER all cards have flown past
    if (macbookRef.current) {
      if (tl.current) {
        // Last card finishes around 12 + 4.0 + 1.5 = 17.5
        tl.current.to(macbookRef.current.position, { x: -15, y: 5, duration: 1.5, ease: "power2.in" }, 17.5);
      }
    }

    // 19-35: HTML Sections (Timeline, Projects) - Camera stays put

    // Scene 5: Technology Universe
    if (techUniverseRef.current && tl.current) {
      tl.current.fromTo(techUniverseRef.current.position, { y: -20 }, { y: -0.5, duration: 2, ease: "power2.out" }, 38);
      tl.current.fromTo(techUniverseRef.current.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 2, ease: "back.out(1.2)" }, 38);

      // Continuous rotation of the orbiting elements only
      if (orbitGroupRef.current) {
        tl.current.to(orbitGroupRef.current.rotation, { y: Math.PI * 2, duration: 8, ease: "none" }, 39);
      }
    }

    // Orbital elements pop in
    orbitalRefs.current.forEach((orb, i) => {
      if (orb && tl.current) {
        tl.current.fromTo(orb.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.5)" }, 39 + i * 0.2);
      }
    });

    // 42-55: AI Workspace, Metrics, Final CTA (HTML overlays)
    if (techUniverseRef.current && tl.current) {
      // Fly out tech universe for final scenes
      tl.current.to(techUniverseRef.current.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 1.5, ease: "power2.in" }, 46);
      tl.current.to(techUniverseRef.current.position, { y: 20, duration: 1.5, ease: "power2.in" }, 46);
    }

    // Force timeline duration to exactly 60 to perfectly sync with HtmlContent.tsx timeline
    if (tl.current) tl.current.set({}, {}, 60);

  }, { dependencies: [] });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <spotLight position={[0, 5, 5]} intensity={2} penumbra={1} color="#ffffff" />
      <Environment preset="city" />

      {/* Live Space Background using Stars from Drei */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />

      {/* Global Background Particles spanning the entire scroll height */}
      <ShootingStarsBackground />
      <Sparkles count={300} scale={[20, 50, 20]} size={2} speed={0.4} opacity={0.3} color="#05D9E8" position={[0, -20, -5]} />
      <Sparkles count={200} scale={[20, 50, 20]} size={1.5} speed={0.2} opacity={0.2} color="#FF2A6D" position={[0, -20, -8]} />
      <Sparkles count={100} scale={[20, 50, 20]} size={3} speed={0.1} opacity={0.1} color="#FFC200" position={[0, -20, -10]} />

      {/* Scene 3: Floating Cards Stack */}
      <group ref={cardsGroupRef} position={[-2.0, 0, -1]} scale={0.8}>
        {products.map((text, i) => (
          <group ref={(el) => { cardGroupRefs.current[i] = el; }} key={i} position={[0, (2 - i) * 1.0, 0]}>
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
              {/* Isometric Rotation applied here */}
              <group rotation={[Math.PI / 6, -Math.PI / 4, 0]}>
                <mesh>
                  <boxGeometry args={[1.8, 0.3, 1.8]} />
                  {/* Provide colorful standard material, let lighting do the top/side shading */}
                  <meshStandardMaterial color={colors[i]} roughness={0.1} metalness={0.1} />
                  {/* Text on top face (y+) */}
                  <Text position={[0.2, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">{text}</Text>
                  {/* Icon on top face */}
                  <Html transform position={[-0.6, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.06}>
                    <div style={{ color: 'white', pointerEvents: 'none' }}>
                      {(() => { const Icon = productIcons[i]; return <Icon size={48} strokeWidth={2.5} />; })()}
                    </div>
                  </Html>
                </mesh>
              </group>
            </Float>
          </group>
        ))}
      </group>

      {/* Scene 4-6: Macbook & Feature Cards */}
      {/* Scaled up the entire Macbook group */}
      <group ref={macbookRef} position={[2.0, 0.5, -1]} scale={2.5}>
        <Macbook scale={5} position={[0, -0.8, 0]} />

        {/* Icons that appear on the laptop screen. Tilted slightly to match screen angle */}
        <group position={[0, -0.2, -0.15]} rotation={[-0.2, 0, 0]}>
          {products.map((text, i) => {
            const isTopRow = i < 3;
            const x = isTopRow ? (i - 1) * 0.3 : (i - 3.5) * 0.3;
            const y = isTopRow ? 0.15 : -0.15;
            const IconComponent = productIcons[i];
            return (
              <group ref={(el) => { iconsGroupRefs.current[i] = el; }} key={`icon-${i}`} position={[x, y, 0]} scale={0}>
                <mesh>
                  <boxGeometry args={[0.25, 0.25, 0.02]} />
                  <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.6} roughness={0.2} />
                  <Html transform center position={[0, 0, 0.015]} scale={0.06}>
                    <div style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', pointerEvents: 'none' }}>
                      <IconComponent size={48} strokeWidth={2.5} />
                    </div>
                  </Html>
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Services that appear on screen then fly out */}
        <group position={[0, -0.2, -0.15]} rotation={[-0.2, 0, 0]}>
          {servicesList.map((text, i) => {
            const isTopRow = i < 3;
            const x = isTopRow ? (i - 1) * 0.32 : (i - 3.5) * 0.32;
            const y = isTopRow ? 0.16 : -0.16;

            return (
              <group ref={(el) => { serviceCardsGroupRefs.current[i] = el; }} key={`service-${i}`} position={[x, y, 0]} scale={0}>
                <mesh>
                  <boxGeometry args={[0.28, 0.28, 0.02]} />
                  <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.4} roughness={0.1} metalness={0.5} />

                  {/* 3D Texture for the transparent glowing icon */}
                  {textures && textures[i % 3] && (
                    <mesh position={[0, 0.02, 0.012]}>
                      <planeGeometry args={[0.16, 0.16]} />
                      <meshBasicMaterial
                        map={textures[i % 3]}
                        transparent={true}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                      />
                    </mesh>
                  )}

                  <Html transform center position={[0, -0.08, 0.011]} scale={0.06}>
                    <div className="flex flex-col items-center justify-center text-white" style={{ width: '150px', transform: 'scale(1.2)' }}>
                      <span className="text-xl font-bold mt-2 tracking-wide drop-shadow-md text-center leading-tight" style={{ wordWrap: 'break-word', width: '100%' }}>{text}</span>
                    </div>
                  </Html>
                </mesh>
              </group>
            );
          })}
        </group>
      </group>

      {/* Scene 5: Technology Universe */}
      <group ref={techUniverseRef} position={[0, -5, -2]} scale={0}>
        {/* Core Mixoop Node */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#000000" emissive="#05D9E8" emissiveIntensity={0.2} wireframe={true} />
            <Html transform center position={[0, 0, 1.2]} scale={0.5}>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '3rem', letterSpacing: '2px', textShadow: '0 0 20px #05D9E8' }}>MIXOOP</div>
            </Html>
          </mesh>
        </Float>

        {/* Orbiting Tech Nodes */}
        <group ref={orbitGroupRef}>
          {techList.map((tech, i) => {
            const angle = (i / techList.length) * Math.PI * 2;
            const radius = 3.5 + Math.random();
            return (
              <group ref={(el) => { orbitalRefs.current[i] = el; }} key={tech} position={[Math.cos(angle) * radius, (Math.random() - 0.5) * 2, Math.sin(angle) * radius]} scale={0}>
                <Float speed={3} rotationIntensity={1} floatIntensity={1}>
                  <mesh>
                    <octahedronGeometry args={[0.4, 0]} />
                    <meshStandardMaterial color={colors[i % colors.length]} wireframe={true} emissive={colors[i % colors.length]} emissiveIntensity={0.5} />
                    <Html transform sprite center position={[0, -0.6, 0]} scale={0.2}>
                      <div style={{ color: 'white', fontWeight: 600, fontSize: '1.5rem', background: 'rgba(0,0,0,0.5)', padding: '5px 15px', borderRadius: '10px', backdropFilter: 'blur(5px)', border: `1px solid ${colors[i % colors.length]}` }}>
                        {tech}
                      </div>
                    </Html>
                  </mesh>
                </Float>
              </group>
            );
          })}
        </group>
      </group>

    </>
  );
}
