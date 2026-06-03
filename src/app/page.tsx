import CanvasContainer from "@/components/CanvasContainer";
import HtmlContent from "@/components/overlays/HtmlContent";

export default function Home() {
  return (
    <main>
      <CanvasContainer />
      <div className="scroll-container">
         {/* This div is the height of the scrollable area, GSAP ScrollTrigger uses it to scrub timelines */}
      </div>
      <HtmlContent />
    </main>
  );
}
