import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { footerLinkGroups } from "@/components/landing/landing-data";

const premiumEase = [0.16, 1, 0.3, 1] as const;

const isExternal = (value: string) => value.startsWith("mailto:");

const LandingFooter = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.2, ease: premiumEase }}
      className="rounded-t-[5rem] bg-[hsl(var(--landing-forest))] px-4 pb-10 pt-20 text-[hsl(var(--landing-sage))] sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-['Inter'] text-[10px] font-bold uppercase tracking-[0.38em] text-[hsl(var(--landing-sage)/0.72)]">
              Newsletter
            </p>
            <h2 className="mt-5 max-w-[8ch] font-['Anton'] text-[clamp(3.5rem,10vw,7rem)] uppercase leading-[0.8] tracking-[-0.05em] text-[hsl(var(--landing-cream))]">
              Stay Close
            </h2>
            <p className="mt-5 max-w-xl font-['Inter'] text-base leading-8 text-[hsl(var(--landing-sage)/0.84)]">
              For future drops, campaign visuals, and updates from the vegan snack index.
            </p>

            <div className="mt-10 flex max-w-xl flex-col gap-4 sm:flex-row sm:items-end">
              <label className="flex-1">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  placeholder="Email address"
                  className="h-14 w-full border-0 border-b border-[hsl(var(--landing-sage)/0.42)] bg-transparent px-0 font-['Inter'] text-sm text-[hsl(var(--landing-cream))] placeholder:text-[hsl(var(--landing-sage)/0.46)] focus-visible:outline-none focus-visible:ring-0"
                />
              </label>
              <Button
                type="button"
                className="h-14 rounded-full bg-[hsl(var(--landing-cream))] px-8 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.32em] text-[hsl(var(--landing-forest))] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:bg-[hsl(var(--landing-cream))]"
              >
                Notify Me
              </Button>
            </div>
          </div>

          <div className="grid gap-10 md:col-span-6 md:grid-cols-2 md:pl-12">
            {footerLinkGroups.map((group) => (
              <div key={group.title}>
                <p className="font-['Inter'] text-[11px] font-bold uppercase tracking-[0.32em] text-[hsl(var(--landing-sage)/0.7)]">
                  {group.title}
                </p>
                <div className="mt-5 space-y-4">
                  {group.links.map((link) =>
                    isExternal(link.to) ? (
                      <a
                        key={link.label}
                        href={link.to}
                        className="block font-['Inter'] text-[11px] font-bold uppercase tracking-[0.28em] text-[hsl(var(--landing-cream))] transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-70"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.label}
                        to={link.to}
                        className="block font-['Inter'] text-[11px] font-bold uppercase tracking-[0.28em] text-[hsl(var(--landing-cream))] transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-70"
                      >
                        {link.label}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-[hsl(var(--landing-sage)/0.18)] pt-6 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.28em] text-[hsl(var(--landing-sage)/0.3)] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Is This Vegan?</p>
          <div className="flex flex-wrap gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default LandingFooter;