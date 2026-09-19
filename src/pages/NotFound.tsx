import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { landingTheme, landingNoiseBackground } from "@/lib/theme";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div style={landingTheme} className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[hsl(var(--landing-cream))] text-[hsl(var(--landing-forest))] px-4">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04]" style={{ backgroundImage: landingNoiseBackground }} />
      
      <div className="relative z-10 text-center flex flex-col items-center">
        <h1 className="font-['Anton'] text-8xl md:text-9xl mb-2 text-[hsl(var(--landing-forest))]">404</h1>
        <p className="font-['Inter'] text-lg text-[hsl(var(--landing-forest)/0.7)] tracking-wide mb-8">Page not found.</p>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--landing-forest)/0.08)] bg-[hsl(var(--landing-cream)/0.6)] px-6 py-3 font-['Inter'] text-[12px] font-bold uppercase tracking-[0.28em] text-[hsl(var(--landing-forest))] shadow-[0_20px_50px_hsl(var(--landing-shadow))] backdrop-blur-[20px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:bg-[hsl(var(--landing-cream)/0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--landing-forest)/0.3)] focus-visible:ring-offset-2"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Return to Browse
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
