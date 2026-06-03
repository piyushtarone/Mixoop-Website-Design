import { useRef, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Environment, Float, Text, Html, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Macbook from "./models/Macbook";
import { Cloud, ShieldCheck, Cpu } from "lucide-react";

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
  const screenARef = useRef<THREE.Group>(null);
  const bubblesARef = useRef<(THREE.Group | null)[]>([]);
  const screenBRef = useRef<THREE.Group>(null);
  const bubblesBRef = useRef<(THREE.Group | null)[]>([]);
  const screenCRef = useRef<THREE.Group>(null);
  const bubblesCRef = useRef<(THREE.Group | null)[]>([]);
  const screenshotsGridRef = useRef<THREE.Group>(null);

  const colors = ['#FF2A6D', '#05D9E8', '#01FFE1', '#FF7B00', '#7A04EB'];
  const products = ['Websites', 'Mobile Apps', 'AI Products', 'Cloud', 'Automation'];
  const servicesList = ['Cloud', 'Security', 'AI'];

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

    // Scene 2: Removed 3D Portal, handled in HTML overlay

    // Scene 3: Floating Cards Stack (Left Side)
    // Cards stack one by one coming from the left side (bottom to top)
    cardGroupRefs.current.forEach((card, i) => {
      if (card && tl.current) {
        tl.current.fromTo(card.position,
          { x: -15, y: (2 - i) * 1.0, z: 0 },
          { x: 0, y: (2 - i) * 1.0, z: 0, duration: 1.5, ease: "power3.out" },
          2.5 + (4 - i) * 0.4 // Bottom card (i=4) enters first
        );
      }
    });

    // Scene 4: MacBook Entry (Right Side)
    if (macbookRef.current) {
      // Entry from the right
      tl.current.fromTo(macbookRef.current.position, { x: 10, y: 0.5, z: -1 }, { x: 2.0, y: 0.5, z: -1, duration: 2 }, 3.5);
      tl.current.fromTo(macbookRef.current.rotation, { x: 0, y: -Math.PI / 2 }, { x: 0.1, y: -0.2, duration: 2 }, 3.5);

      // Cards fly into laptop sequentially (top to bottom)
      cardGroupRefs.current.forEach((card, i) => {
        if (card && tl.current) {
          // Stack is at x: -2.0, laptop is at x: 2.0. Delta = 4.0. Since stack scale is 0.8, local delta x = 5.0
          // Laptop y is 0.5, icon y is -0.4. Global icon y = -0.5. Stack y is 0. Local card y = -0.625
          tl.current.to(card.position, { x: 5.0, y: -0.6, z: -0.5, duration: 1, ease: "power2.inOut" }, 6 + i * 0.4);
          tl.current.to(card.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: "power2.in" }, 6.5 + i * 0.4);

          // Icon on laptop screen pops up when card vanishes
          const icon = iconsGroupRefs.current[i];
          if (icon) {
            tl.current.fromTo(icon.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out(1.5)" }, 6.8 + i * 0.4);
          }
        }
      });
    }

    // Scene 5: Laptop moves closer
    if (macbookRef.current) {
      tl.current.to(macbookRef.current.position, { x: 0, y: 0.5, duration: 2 }, 8);
      // Zoom camera in very slightly (z: 4.5 instead of 3.5)
      tl.current.to(camera.position, { z: 4.5, y: -0.5, duration: 2 }, 8);
      tl.current.to(macbookRef.current.rotation, { x: 0, y: 0, duration: 2 }, 8);
    }

    // Scene 6: Laptop shifts left, feature cards emerge
    if (macbookRef.current) {
      tl.current.to(macbookRef.current.position, { x: -2.5, y: 0.5, duration: 2 }, 10);
      tl.current.to(macbookRef.current.rotation, { y: Math.PI / 6, duration: 2 }, 10);

      // Hide old icons
      iconsGroupRefs.current.forEach((icon, i) => {
        if (icon && tl.current) tl.current.to(icon.scale, { x: 0, y: 0, z: 0, duration: 0.5 }, 10 + i * 0.1);
      });

      // Show services ON the laptop screen
      serviceCardsGroupRefs.current.forEach((card, i) => {
        if (card && tl.current) {
          tl.current.to(card.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out(1.5)" }, 10.5 + i * 0.2);
        }
      });

      // Scene 7: Services fly OUT of the laptop
      const targetLocalPositions = [
        { x: 1.5, y: 0.6, z: 0.5 },   // Cloud
        { x: 1.8, y: 0.0, z: 0.8 },   // Security
        { x: 1.5, y: -0.6, z: 0.5 }   // AI
      ];

      serviceCardsGroupRefs.current.forEach((card, i) => {
        if (card && tl.current) {
          // Fly out to local positions
          tl.current.to(card.position, {
            x: targetLocalPositions[i].x,
            y: targetLocalPositions[i].y,
            z: targetLocalPositions[i].z,
            duration: 1.5, ease: "power2.out"
          }, 12 + i * 0.3);

          // Scale up to be larger floating cards
          tl.current.to(card.scale, { x: 2, y: 2, z: 2, duration: 1.5, ease: "power2.out" }, 12 + i * 0.3);

          // Rotate for 3D effect
          tl.current.to(card.rotation, { x: 0.2, y: -0.2, duration: 1.5 }, 12 + i * 0.3);
        }
      });
    }

    // Scene 7.5: Fly icons out of the screen completely
    if (macbookRef.current) {
      serviceCardsGroupRefs.current.forEach((card, i) => {
        if (card && tl.current) {
          tl.current.to(card.position, { x: 10, duration: 1, ease: "power2.in" }, 14 + i * 0.1);
          tl.current.to(card.scale, { x: 0, y: 0, z: 0, duration: 1, ease: "power2.in" }, 14 + i * 0.1);
        }
      });

      // Scene 7.6: Auto-Scrolling Grid appears while laptop is on the side
      if (screenshotsGridRef.current && tl.current) {
        tl.current.to(screenshotsGridRef.current.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.5)" }, 14.5);
      }

      // Scene 7.7: Laptop centers
      if (tl.current) {
        tl.current.to(macbookRef.current.position, { x: 0, y: 0.5, duration: 2, ease: "power2.inOut" }, 16);
        tl.current.to(macbookRef.current.rotation, { y: 0, duration: 2, ease: "power2.inOut" }, 16);
      }

      // Fade out Auto-Scrolling Grid
      if (screenshotsGridRef.current && tl.current) {
        tl.current.to(screenshotsGridRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: "power2.in" }, 18);
      }

      // Project A
      if (screenARef.current && tl.current) {
        tl.current.fromTo(screenARef.current.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.2)" }, 18.5);
        bubblesARef.current.forEach((b, i) => b && tl.current!.fromTo(b.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 0.6, ease: "back.out(1.5)" }, 18.8 + i * 0.2));
        
        tl.current.to(screenARef.current.scale, { x: 0, y: 0, z: 0, duration: 0.6, ease: "power2.in" }, 21);
        bubblesARef.current.forEach((b, i) => b && tl.current!.to(b.scale, { x: 0, y: 0, z: 0, duration: 0.4, ease: "power2.in" }, 21));
      }

      // Project B
      if (screenBRef.current && tl.current) {
        tl.current.fromTo(screenBRef.current.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.2)" }, 21.5);
        bubblesBRef.current.forEach((b, i) => b && tl.current!.fromTo(b.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 0.6, ease: "back.out(1.5)" }, 21.8 + i * 0.2));
        
        tl.current.to(screenBRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.6, ease: "power2.in" }, 24);
        bubblesBRef.current.forEach((b, i) => b && tl.current!.to(b.scale, { x: 0, y: 0, z: 0, duration: 0.4, ease: "power2.in" }, 24));
      }

      // Project C
      if (screenCRef.current && tl.current) {
        tl.current.fromTo(screenCRef.current.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.2)" }, 24.5);
        bubblesCRef.current.forEach((b, i) => b && tl.current!.fromTo(b.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 0.6, ease: "back.out(1.5)" }, 24.8 + i * 0.2));
        
        tl.current.to(screenCRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.6, ease: "power2.in" }, 27);
        bubblesCRef.current.forEach((b, i) => b && tl.current!.to(b.scale, { x: 0, y: 0, z: 0, duration: 0.4, ease: "power2.in" }, 27));
      }

      // Laptop flies away
      if (tl.current) {
        tl.current.to(macbookRef.current.position, { x: -10, y: 5, duration: 1.5, ease: "power2.in" }, 28);
      }
    }

    // Scene 9: Portfolio Showcase
    if (tl.current) {
      tl.current.to(camera.position, { y: -20, duration: 2 }, 30);
      tl.current.to(camera.position, { y: -30, duration: 2 }, 33);
      tl.current.to(camera.position, { y: -40, duration: 2 }, 36);
    }

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
                  <Text position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">{text}</Text>
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
            return (
              <group ref={(el) => { iconsGroupRefs.current[i] = el; }} key={`icon-${i}`} position={[x, y, 0]} scale={0}>
                <mesh>
                  <boxGeometry args={[0.25, 0.25, 0.02]} />
                  <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.6} roughness={0.2} />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Services that appear on screen then fly out */}
        <group position={[0, -0.2, -0.15]} rotation={[-0.2, 0, 0]}>
          {servicesList.map((text, i) => (
            <group ref={(el) => { serviceCardsGroupRefs.current[i] = el; }} key={`service-${i}`} position={[(i - 1) * 0.28, 0, 0]} scale={0}>
              <mesh>
                <boxGeometry args={[0.3, 0.3, 0.02]} />
                <meshStandardMaterial color={colors[i + 1]} emissive={colors[i + 1]} emissiveIntensity={0.4} roughness={0.1} metalness={0.5} />

                {/* 3D Texture for the transparent glowing icon */}
                {textures && textures[i] && (
                  <mesh position={[0, 0.02, 0.012]}>
                    <planeGeometry args={[0.2, 0.2]} />
                    <meshBasicMaterial
                      map={textures[i]}
                      transparent={true}
                      blending={THREE.AdditiveBlending}
                      depthWrite={false}
                    />
                  </mesh>
                )}

                {/* Only text in HTML now */}
                <Html transform center position={[0, -0.12, 0.011]} scale={0.1}>
                  <div className="flex flex-col items-center justify-center text-white" style={{ width: '140px', transform: 'scale(1.2)' }}>
                    <span className="text-xl font-bold mt-2 tracking-wide drop-shadow-md">{text}</span>
                  </div>
                </Html>
              </mesh>
            </group>
          ))}
        </group>

        {/* PROJECTS CONTAINER */}
        <group position={[0, -0.28, -0.14]} rotation={[-0.2, 0, 0]}>
          
          {/* PROJECT A: Dashboard */}
          <group ref={screenARef} scale={0}>
            {/* Project Title */}
            <group position={[0, -0.8, 0.8]}>
              <Html transform center scale={0.15}>
                <div className="font-bold text-white text-5xl tracking-widest uppercase" style={{ textShadow: '0 0 20px rgba(255,42,109,0.5)' }}>Project A</div>
              </Html>
            </group>
            {/* Screen Image */}
            <group>
              <Html transform center scale={0.035}>
                <div style={{ width: '1400px', height: '900px', background: '#000', borderRadius: '20px', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1400" alt="Dashboard" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </Html>
            </group>
            {/* Project A Bubbles */}
            <group ref={(el) => { bubblesARef.current[0] = el; }} position={[-1.2, 0.5, 0.05]} scale={0}>
              <Html transform center scale={0.05}>
                <div className="chat-msg msg-ai" style={{ width: '250px', background: 'rgba(255,42,109,0.15)', border: '1px solid #FF2A6D', color: 'white', padding: '15px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                  <div className="font-bold text-sm mb-1" style={{ color: '#FF2A6D' }}>Core Features</div>
                  <p className="text-xs text-gray-200">Advanced AI analytics dashboard with real-time tracking.</p>
                </div>
              </Html>
            </group>
            <group ref={(el) => { bubblesARef.current[1] = el; }} position={[1.25, 0.4, 0.1]} scale={0}>
              <Html transform center scale={0.05}>
                <div className="chat-msg msg-user" style={{ width: '250px', background: 'rgba(5,217,232,0.15)', border: '1px solid #05D9E8', color: 'white', padding: '15px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                  <div className="font-bold text-sm mb-1" style={{ color: '#05D9E8' }}>User Growth</div>
                  <p className="text-xs text-gray-200">Scalable architecture supporting 10k+ concurrent users.</p>
                </div>
              </Html>
            </group>
            <group ref={(el) => { bubblesARef.current[2] = el; }} position={[-1.15, -0.3, 0.15]} scale={0}>
              <Html transform center scale={0.05}>
                <div className="chat-msg msg-ai" style={{ width: '250px', background: 'rgba(1,255,225,0.15)', border: '1px solid #01FFE1', color: 'white', padding: '15px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                  <div className="font-bold text-sm mb-1" style={{ color: '#01FFE1' }}>Security</div>
                  <p className="text-xs text-gray-200">End-to-end encryption for all sensitive data layers.</p>
                </div>
              </Html>
            </group>
            <group ref={(el) => { bubblesARef.current[3] = el; }} position={[1.15, -0.2, 0.05]} scale={0}>
              <Html transform center scale={0.05}>
                <div className="chat-msg msg-user" style={{ width: '250px', background: 'rgba(255,123,0,0.15)', border: '1px solid #FF7B00', color: 'white', padding: '15px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                  <div className="font-bold text-sm mb-1" style={{ color: '#FF7B00' }}>Cloud Sync</div>
                  <p className="text-xs text-gray-200">Real-time data synchronization across all devices.</p>
                </div>
              </Html>
            </group>
          </group>

          {/* PROJECT B: Mobile App */}
          <group ref={screenBRef} scale={0}>
            {/* Project Title */}
            <group position={[0, -0.8, 0.8]}>
              <Html transform center scale={0.15}>
                <div className="font-bold text-white text-5xl tracking-widest uppercase" style={{ textShadow: '0 0 20px rgba(5,217,232,0.5)' }}>Project B</div>
              </Html>
            </group>
            {/* Screen Image */}
            <group>
              <Html transform center scale={0.035}>
                <div style={{ width: '1400px', height: '900px', background: '#000', borderRadius: '20px', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=1400" alt="Mobile App" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </Html>
            </group>
            {/* Project B Bubbles */}
            <group ref={(el) => { bubblesBRef.current[0] = el; }} position={[1.15, 0.5, 0.05]} scale={0}>
              <Html transform center scale={0.05}>
                <div className="chat-msg msg-user" style={{ width: '250px', background: 'rgba(255,123,0,0.15)', border: '1px solid #FF7B00', color: 'white', padding: '15px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                  <div className="font-bold text-sm mb-1" style={{ color: '#FF7B00' }}>UX Design</div>
                  <p className="text-xs text-gray-200">Seamless cross-platform mobile experience.</p>
                </div>
              </Html>
            </group>
            <group ref={(el) => { bubblesBRef.current[1] = el; }} position={[-1.25, 0.1, 0.1]} scale={0}>
              <Html transform center scale={0.05}>
                <div className="chat-msg msg-ai" style={{ width: '250px', background: 'rgba(122,4,235,0.15)', border: '1px solid #7A04EB', color: 'white', padding: '15px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                  <div className="font-bold text-sm mb-1" style={{ color: '#7A04EB' }}>Offline Mode</div>
                  <p className="text-xs text-gray-200">Full functionality without internet connection.</p>
                </div>
              </Html>
            </group>
            <group ref={(el) => { bubblesBRef.current[2] = el; }} position={[1.2, -0.4, 0.15]} scale={0}>
              <Html transform center scale={0.05}>
                <div className="chat-msg msg-user" style={{ width: '250px', background: 'rgba(255,42,109,0.15)', border: '1px solid #FF2A6D', color: 'white', padding: '15px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                  <div className="font-bold text-sm mb-1" style={{ color: '#FF2A6D' }}>Integrations</div>
                  <p className="text-xs text-gray-200">Native integration with health and fitness APIs.</p>
                </div>
              </Html>
            </group>
            <group ref={(el) => { bubblesBRef.current[3] = el; }} position={[-1.1, 0.45, 0.05]} scale={0}>
              <Html transform center scale={0.05}>
                <div className="chat-msg msg-ai" style={{ width: '250px', background: 'rgba(1,255,225,0.15)', border: '1px solid #01FFE1', color: 'white', padding: '15px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                  <div className="font-bold text-sm mb-1" style={{ color: '#01FFE1' }}>Push Notifications</div>
                  <p className="text-xs text-gray-200">Smart triggers based on user behavior and geo-location.</p>
                </div>
              </Html>
            </group>
          </group>

          {/* PROJECT C: Web Platform */}
          <group ref={screenCRef} scale={0}>
            {/* Project Title */}
            <group position={[0, -0.8, 0.8]}>
              <Html transform center scale={0.15}>
                <div className="font-bold text-white text-5xl tracking-widest uppercase" style={{ textShadow: '0 0 20px rgba(122,4,235,0.5)' }}>Project C</div>
              </Html>
            </group>
            {/* Screen Image */}
            <group>
              <Html transform center scale={0.035}>
                <div style={{ width: '1400px', height: '900px', background: '#000', borderRadius: '20px', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400" alt="Web Platform" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </Html>
            </group>
            {/* Project C Bubbles */}
            <group ref={(el) => { bubblesCRef.current[0] = el; }} position={[-1.15, 0.5, 0.05]} scale={0}>
              <Html transform center scale={0.05}>
                <div className="chat-msg msg-ai" style={{ width: '250px', background: 'rgba(5,217,232,0.15)', border: '1px solid #05D9E8', color: 'white', padding: '15px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                  <div className="font-bold text-sm mb-1" style={{ color: '#05D9E8' }}>Performance</div>
                  <p className="text-xs text-gray-200">Lightning-fast edge delivery globally.</p>
                </div>
              </Html>
            </group>
            <group ref={(el) => { bubblesCRef.current[1] = el; }} position={[1.25, 0.1, 0.1]} scale={0}>
              <Html transform center scale={0.05}>
                <div className="chat-msg msg-user" style={{ width: '250px', background: 'rgba(1,255,225,0.15)', border: '1px solid #01FFE1', color: 'white', padding: '15px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                  <div className="font-bold text-sm mb-1" style={{ color: '#01FFE1' }}>Accessibility</div>
                  <p className="text-xs text-gray-200">WCAG 2.1 AA compliant across all components.</p>
                </div>
              </Html>
            </group>
            <group ref={(el) => { bubblesCRef.current[2] = el; }} position={[-1.2, -0.4, 0.15]} scale={0}>
              <Html transform center scale={0.05}>
                <div className="chat-msg msg-ai" style={{ width: '250px', background: 'rgba(255,123,0,0.15)', border: '1px solid #FF7B00', color: 'white', padding: '15px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                  <div className="font-bold text-sm mb-1" style={{ color: '#FF7B00' }}>Dark Mode</div>
                  <p className="text-xs text-gray-200">Automatic intelligent color scheme switching.</p>
                </div>
              </Html>
            </group>
            <group ref={(el) => { bubblesCRef.current[3] = el; }} position={[1.1, -0.3, 0.05]} scale={0}>
              <Html transform center scale={0.05}>
                <div className="chat-msg msg-user" style={{ width: '250px', background: 'rgba(255,42,109,0.15)', border: '1px solid #FF2A6D', color: 'white', padding: '15px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                  <div className="font-bold text-sm mb-1" style={{ color: '#FF2A6D' }}>SEO Optimized</div>
                  <p className="text-xs text-gray-200">Server-side rendering for perfect search engine indexation.</p>
                </div>
              </Html>
            </group>
          </group>
        </group>

        {/* Auto-scrolling Screenshots Grid */}
        <group ref={screenshotsGridRef} position={[0, -0.28, -0.15]} rotation={[-0.2, 0, 0]} scale={0}>
          <Html transform center position={[0, 0, 0]} scale={0.035}>
            <div className="laptop-screen-content" style={{ background: 'transparent' }}>
              <div className="scrolling-col col-up">
                {[
                  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
                  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
                  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=400",
                  "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=400",
                  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
                  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400"
                ].map((src, i) => (
                  <div key={`left-${i}`} className="mockup-card" style={{ padding: 0, overflow: 'hidden', flexShrink: 0, minHeight: '400px' }}>
                    <img src={src} alt="UI Mockup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
              <div className="scrolling-col col-down">
                {[
                  "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=400",
                  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=400",
                  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
                  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
                  "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=400",
                  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=400"
                ].map((src, i) => (
                  <div key={`right-${i}`} className="mockup-card" style={{ padding: 0, overflow: 'hidden', flexShrink: 0, minHeight: '400px' }}>
                    <img src={src} alt="UI Mockup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          </Html>
        </group>
      </group>

    </>
  );
}
