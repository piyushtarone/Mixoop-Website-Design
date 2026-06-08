"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MessageSquare, Zap, Shield, Cloud, ArrowRight } from "lucide-react";
import ChatWidget from "../ChatWidget";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HtmlContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isChatVisible, setIsChatVisible] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    // Scene 1: Logo zoom in (acts as portal)
    gsap.set(".logo-main", { transformOrigin: "65% 50%" });
    tl.to(".logo-main", { scale: 50, opacity: 0, duration: 2, ease: "power2.in" }, 0);

    // Timeline mapping (roughly 1 unit = 100vh)
    // 0-2: Portal zoom
    // 2-10: Digital Ecosystem & Services Explosion (in Experience.tsx)
    
    // Scene 3: How Mixoop Works (Timeline)
    // Starts exactly after laptop flies away (19) + a gap
    tl.fromTo(".scene-3-html", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 22);
    tl.to(".timeline-progress", { width: "80%", duration: 4, ease: "none" }, 23);
    tl.fromTo(".step-1", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 23);
    tl.fromTo(".step-2", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 24);
    tl.fromTo(".step-3", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 25);
    tl.fromTo(".step-4", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 26);
    tl.fromTo(".step-5", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 27);
    tl.to(".scene-3-html", { autoAlpha: 0, duration: 1 }, 29);

    // Scene 4: Featured Projects
    tl.fromTo(".scene-4-html", { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1 }, 30);
    // Project 1
    tl.fromTo(".proj-1", { autoAlpha: 0, x: -50 }, { autoAlpha: 1, x: 0, duration: 1 }, 31);
    tl.to(".proj-1", { autoAlpha: 0, x: 50, duration: 1 }, 33);
    // Project 2
    tl.fromTo(".proj-2", { autoAlpha: 0, x: -50 }, { autoAlpha: 1, x: 0, duration: 1 }, 34);
    tl.to(".proj-2", { autoAlpha: 0, x: 50, duration: 1 }, 36);
    tl.to(".scene-4-html", { autoAlpha: 0, duration: 1 }, 38);

    // 37-46: Technology Universe (in Experience.tsx)

    // Scene 6: AI Workspace Overlay
    // Instead of fading a static HTML block, we trigger the interactive React widget to appear
    tl.call(() => setIsChatVisible(true), undefined, 43);

    // Scene 7: Trust & Metrics
    tl.fromTo(".scene-7-html", { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1 }, 48);
    tl.to(".scene-7-html", { autoAlpha: 0, y: -50, duration: 1 }, 52);

    // Scene 8: Final CTA
    tl.fromTo(".scene-8-html", { autoAlpha: 0, y: 100 }, { autoAlpha: 1, y: 0, duration: 1 }, 53);

    // Force timeline duration to exactly 60 to perfectly sync with Experience.tsx timeline
    tl.set({}, {}, 60);

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="overlay-container">
      
      {/* Scene 1: Initial Logo */}
      <div className="scene-overlay scene-1-html" style={{ opacity: 1, visibility: 'visible' }}>
        <img src={process.env.NODE_ENV === 'production' ? '/Mixoop-Website-Design/mixooplogo.png' : '/mixooplogo.png'} alt="Mixoop Logo" className="logo-main glow" />
      </div>

      {/* Scene 3: How Mixoop Works */}
      <div className="scene-overlay scene-3-html overlay-content">
        <h2 className="headline" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>How We Build</h2>
        <p className="subheadline">A seamless journey from concept to global scale.</p>
        
        <div className="timeline-container">
          <div className="timeline-line"></div>
          <div className="timeline-progress"></div>
          
          {['Idea', 'Design', 'Development', 'Deployment', 'Scale'].map((step, index) => (
            <div key={index} className={`timeline-step step-${index + 1}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-label">{step}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scene 4: Featured Projects */}
      <div className="scene-overlay scene-4-html overlay-content" style={{ justifyContent: 'center' }}>
        <div className="proj-1" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }}>
          <div className="project-card">
            <div className="project-image-col">
              <Image 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                alt="Fintech Dashboard" 
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </div>
            <div className="project-info-col">
              <span className="project-tag">Fintech</span>
              <h3 className="project-title">Nexus Pay</h3>
              <div className="project-detail-group">
                <h4>Challenge</h4>
                <p>Legacy systems handling 1M+ transactions daily were experiencing unacceptable latency.</p>
              </div>
              <div className="project-detail-group">
                <h4>Solution</h4>
                <p>Built a custom edge-computed ledger using Rust and Next.js, deployed across global nodes.</p>
              </div>
              <div className="project-detail-group">
                <h4>Result</h4>
                <p style={{ color: '#05D9E8', fontWeight: 600 }}>Latency reduced by 92%. Zero downtime.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="proj-2" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }}>
          <div className="project-card">
            <div className="project-image-col">
              <Image 
                src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=800" 
                alt="Health App" 
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </div>
            <div className="project-info-col">
              <span className="project-tag">Healthcare</span>
              <h3 className="project-title">VitalSync</h3>
              <div className="project-detail-group">
                <h4>Challenge</h4>
                <p>Doctors needed real-time patient vitals streamed directly to their mobile devices securely.</p>
              </div>
              <div className="project-detail-group">
                <h4>Solution</h4>
                <p>Developed a HIPAA-compliant React Native application powered by WebSocket infrastructure.</p>
              </div>
              <div className="project-detail-group">
                <h4>Result</h4>
                <p style={{ color: '#01FFE1', fontWeight: 600 }}>10k+ active clinicians. Millisecond updates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scene 6: AI Workspace Overlay */}
      <ChatWidget isVisible={isChatVisible} />

      {/* Scene 7: Trust & Metrics */}
      <div className="scene-overlay scene-7-html overlay-content">
        <h2 className="headline" style={{ fontSize: '3.5rem', marginBottom: '3rem' }}>Trusted globally.</h2>
        <div className="metrics-container">
          <div className="metric-box">
            <div className="metric-number">99.9%</div>
            <div className="metric-label">Uptime Guaranteed</div>
          </div>
          <div className="metric-box">
            <div className="metric-number">50+</div>
            <div className="metric-label">Enterprise Clients</div>
          </div>
          <div className="metric-box">
            <div className="metric-number">10x</div>
            <div className="metric-label">Faster Deployment</div>
          </div>
        </div>
        
        {/* Testimonial */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '20px', maxWidth: '800px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Shield size={40} color="#01FFE1" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '10px', color: '#ddd' }}>"Mixoop didn't just build our app; they engineered an ecosystem that scaled our business effortlessly."</p>
            <p style={{ fontWeight: 600, color: '#05D9E8' }}>— Sarah J., CTO at TechFlow</p>
          </div>
        </div>
      </div>

      {/* Scene 8: Final CTA */}
      <div className="scene-overlay scene-8-html overlay-content">
         <img src={process.env.NODE_ENV === 'production' ? '/Mixoop-Website-Design/mixooplogo.png' : '/mixooplogo.png'} alt="Mixoop Logo" className="logo-main glow" style={{ width: '120px', marginBottom: '2rem' }} />
         <h1 className="headline" style={{ fontSize: '5rem', background: 'linear-gradient(135deg, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
           Build. Automate. Scale.
         </h1>
         <p className="subheadline" style={{ fontSize: '1.8rem', marginTop: '1rem' }}>Join the future of enterprise software.</p>
         <button className="premium-btn" style={{ marginTop: '3rem', fontSize: '1.2rem', padding: '20px 40px' }}>
           Start Your Project <ArrowRight size={24} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '10px' }} />
         </button>
      </div>

    </div>
  );
}
