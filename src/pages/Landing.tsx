import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import LandingFeatureGrid from "@/components/landing/LandingFeatureGrid";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingHero from "@/components/landing/LandingHero";
import { landingNavLinks } from "@/components/landing/landing-data";

const Landing = () => {
  const landingTheme = {
    ["--landing-forest" as string]: "147 97% 14%",
    ["--landing-sage" as string]: "78 31% 76%",
    ["--landing-olive" as string]: "74 45% 91%",
    ["--landing-cream" as string]: "51 86% 94%",
    ["--landing-moss" as string]: "84 22% 67%",
    ["--landing-shadow" as string]: "147 97% 14% / 0.2",
  } as React.CSSProperties;

  return (
    <div style={landingTheme} className="relative min-h-screen overflow-hidden bg-[hsl(var(--landing-cream))] text-[hsl(var(--landing-forest))]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;700&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <Link
            to="/"
            className="font-['Inter'] text-[10px] font-bold uppercase tracking-[0.34em] text-[hsl(var(--landing-forest))] transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-70"
          >
            - Is This Vegan?
          </Link>

          <nav
            aria-label="Landing navigation"
            className="hidden items-center gap-2 rounded-full border border-[hsl(var(--landing-forest)/0.08)] bg-[hsl(var(--landing-cream)/0.42)] px-3 py-2 shadow-[0_20px_50px_hsl(var(--landing-shadow))] backdrop-blur-[20px] md:flex"
          >
            {landingNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full px-4 py-2 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.28em] text-[hsl(var(--landing-forest)/0.72)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:bg-[hsl(var(--landing-cream)/0.8)] hover:text-[hsl(var(--landing-forest))]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Button
            asChild
            className="h-12 rounded-full border border-[hsl(var(--landing-forest)/0.08)] bg-[hsl(var(--landing-cream)/0.7)] px-2 text-[hsl(var(--landing-forest))] shadow-[0_20px_50px_hsl(var(--landing-shadow))] backdrop-blur-[20px] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:bg-[hsl(var(--landing-cream)/0.85)]"
          >
            <Link to="/" className="flex items-center gap-2 px-3">
              <span className="font-['Inter'] text-[10px] font-bold uppercase tracking-[0.28em]">Browse</span>
              <span className="inline-flex min-w-12 items-center justify-center rounded-full bg-[hsl(var(--landing-cream))] px-3 py-1 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.24em] text-[hsl(var(--landing-forest))]">
                200+
              </span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10">
        <LandingHero />
        <LandingFeatureGrid />
        <LandingFooter />
      </main>
    </div>
  );
};

export default Landing;
