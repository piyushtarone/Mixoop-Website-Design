"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MessageSquare, Zap, Shield, Cloud, ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HtmlContent() {
  const containerRef = useRef<HTMLDivElement>(null);

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
    // The infinity symbol is roughly on the right side, so we adjust transformOrigin to zoom into it.
    gsap.set(".logo-main", { transformOrigin: "65% 50%" });
    tl.to(".logo-main", { scale: 50, opacity: 0, duration: 2, ease: "power2.in" }, 0);

    // Scene 8: Portfolio Showcase
    tl.fromTo(".scene-8-html", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 30);
    tl.to(".scene-8-html", { opacity: 0, y: -50, duration: 1 }, 32);

    // Scene 9: AI Workspace
    tl.fromTo(".scene-9-html", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 }, 33);
    tl.to(".scene-9-html", { opacity: 0, scale: 1.1, duration: 1 }, 35);

    // Scene 10: Final CTA
    tl.fromTo(".scene-10-html", { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1 }, 36);

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="overlay-container">
      
      {/* Scene 1: Initial Logo */}
      <div className="scene-overlay scene-1-html" style={{ opacity: 1, visibility: 'visible' }}>
        <img src={process.env.NODE_ENV === 'production' ? '/Mixoop-Website-Design/mixooplogo.png' : '/mixooplogo.png'} alt="Mixoop Logo" className="logo-main glow" />
      </div>

      {/* Scene 8: Portfolio */}
      <div className="scene-overlay scene-8-html overlay-content">
        <h2 className="headline" style={{ fontSize: '3rem' }}>Our Work</h2>
        <p className="subheadline">Award-winning digital experiences.</p>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem' }}>
          {[1, 2, 3].map((i) => (
             <div key={i} style={{ width: '250px', height: '350px', background: `rgba(255,255,255,0.${i}5)`, borderRadius: '20px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }} />
          ))}
        </div>
      </div>

      {/* Scene 9: AI Workspace */}
      <div className="scene-overlay scene-9-html overlay-content">
        <div className="ai-chat-interface">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
            <MessageSquare size={20} color="white" />
            <span style={{ color: 'white', fontWeight: 600 }}>Mixoop AI</span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="chat-msg msg-user">Deploy the new e-commerce architecture.</div>
            <div className="chat-msg msg-ai">Analyzing requirements... Generating cloud-native infrastructure with zero downtime. 🚀</div>
            <div className="chat-msg msg-user">Optimize for speed and security.</div>
            <div className="chat-msg msg-ai">Applied Edge caching and advanced encryption. Deployment successful in 1.2s.</div>
          </div>
        </div>
      </div>

      {/* Scene 10: Final CTA */}
      <div className="scene-overlay scene-10-html overlay-content">
         <img src={process.env.NODE_ENV === 'production' ? '/Mixoop-Website-Design/mixooplogo.png' : '/mixooplogo.png'} alt="Mixoop Logo" className="logo-main glow" style={{ width: '100px', marginBottom: '2rem', opacity: 0.5 }} />
         <h1 className="headline">Build. Automate. Scale.</h1>
         <p className="subheadline">Join the future of enterprise software.</p>
         <button className="premium-btn">
           Start Your Project <ArrowRight size={20} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '10px' }} />
         </button>
      </div>

    </div>
  );
}
