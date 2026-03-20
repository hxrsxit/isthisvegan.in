import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { featureCards } from "@/components/landing/landing-data";

const premiumEase = [0.16, 1, 0.3, 1] as const;

const LandingFeatureGrid = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.2, ease: premiumEase }}
      className="relative -mt-8 rounded-t-[5rem] bg-[hsl(var(--landing-olive))] px-4 pb-24 pt-20 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-['Inter'] text-[10px] font-bold uppercase tracking-[0.38em] text-[hsl(var(--landing-forest)/0.6)]">
              Curated entry points
            </p>
            <h2 className="mt-4 max-w-[8ch] font-['Anton'] text-[clamp(4rem,15vw,9rem)] uppercase leading-[0.78] tracking-[-0.05em] text-[hsl(var(--landing-forest))]">
              Explore
            </h2>
          </div>

          <Button
            asChild
            className="h-28 w-28 rounded-full border border-[hsl(var(--landing-forest)/0.12)] bg-[hsl(var(--landing-forest))] p-0 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.34em] text-[hsl(var(--landing-cream))] shadow-[0_24px_60px_hsl(var(--landing-shadow))] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:bg-[hsl(var(--landing-forest))]"
          >
            <Link to="/">Open Index</Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {featureCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1.2, delay: index * 0.08, ease: premiumEase }}
              className="group"
            >
              <Link
                to={card.to}
                className="block overflow-hidden rounded-[2.5rem] bg-[hsl(var(--landing-cream)/0.78)] p-4 shadow-[0_30px_70px_hsl(var(--landing-shadow))] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--landing-forest))] focus-visible:ring-offset-4 focus-visible:ring-offset-[hsl(var(--landing-olive))]"
              >
                <AspectRatio ratio={4 / 5}>
                  <div className={`relative h-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${card.accent}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--landing-cream)/0.78),transparent_38%),linear-gradient(180deg,transparent,transparent_55%,hsl(var(--landing-forest)/0.14))] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
                    <div className="absolute left-5 top-5 right-5 z-10">
                      <p className="font-['Inter'] text-[10px] font-bold uppercase tracking-[0.28em] text-[hsl(var(--landing-forest)/0.56)]">
                        {card.label}
                      </p>
                      <h3 className="mt-4 max-w-[7ch] font-['Anton'] text-5xl uppercase leading-[0.82] tracking-[-0.05em] text-[hsl(var(--landing-forest))]">
                        {card.title}
                      </h3>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 z-20 translate-y-8 bg-[hsl(var(--landing-forest)/0.3)] px-5 pb-5 pt-14 opacity-0 backdrop-blur-[2px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="flex items-center justify-between rounded-full bg-[hsl(var(--landing-cream))] px-5 py-3 text-[hsl(var(--landing-forest))]">
                        <span className="font-['Inter'] text-[10px] font-bold uppercase tracking-[0.34em]">
                          {card.cta}
                        </span>
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </AspectRatio>

                <p className="px-2 pb-2 pt-5 font-['Inter'] text-sm leading-7 text-[hsl(var(--landing-forest)/0.74)]">
                  {card.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default LandingFeatureGrid;