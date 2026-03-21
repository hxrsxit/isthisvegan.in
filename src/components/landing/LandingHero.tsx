import { motion, useScroll, useTransform } from "framer-motion";

import { floatingCards } from "@/components/landing/landing-data";

const premiumEase = [0.16, 1, 0.3, 1] as const;
const headline = "IS THIS VEGAN?";

const sectionReveal = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: premiumEase },
  },
};

const letterReveal = {
  hidden: { opacity: 0, y: 100 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      delay: 0.15 + index * 0.05,
      ease: premiumEase,
    },
  }),
};

const LandingHero = () => {
  const { scrollY } = useScroll();
  const firstCardY = useTransform(scrollY, [0, 1400], [0, -70]);
  const secondCardY = useTransform(scrollY, [0, 1400], [0, -90]);
  const thirdCardY = useTransform(scrollY, [0, 1400], [0, -60]);
  const parallaxStyles = [firstCardY, secondCardY, thirdCardY];

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[hsl(var(--landing-sage))] px-4 pb-12 pt-36 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,hsl(var(--landing-cream)/0.55),transparent_65%)]" />
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-12">
        <div className="relative flex min-h-[62vh] items-center justify-center overflow-hidden rounded-[5rem] border border-[hsl(var(--landing-forest)/0.08)] bg-[hsl(var(--landing-cream)/0.52)] px-6 py-16 shadow-[0_32px_80px_hsl(var(--landing-shadow))] backdrop-blur-md sm:px-10 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,hsl(var(--landing-cream)/0.9),transparent_28%),radial-gradient(circle_at_80%_20%,hsl(var(--landing-moss)/0.35),transparent_30%),radial-gradient(circle_at_50%_90%,hsl(var(--landing-forest)/0.08),transparent_30%)]" />

          {floatingCards.map((card, index) => (
            <motion.div
              key={card.title}
              style={{ y: parallaxStyles[index] }}
              initial={{ opacity: 0, y: 120, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.35 + index * 0.12, ease: premiumEase }}
              className={`absolute z-10 w-44 rounded-[3rem] border border-[hsl(var(--landing-forest)/0.08)] bg-[hsl(var(--landing-cream)/0.78)] p-5 text-[hsl(var(--landing-forest))] shadow-[0_28px_60px_hsl(var(--landing-shadow))] backdrop-blur-md ${card.className}`}
            >
              <div className="mb-5 aspect-[4/5] rounded-[2.5rem] bg-[linear-gradient(160deg,hsl(var(--landing-olive)),hsl(var(--landing-cream)))]" />
              <p className="font-['Inter'] text-[10px] font-bold uppercase tracking-[0.32em] text-[hsl(var(--landing-forest)/0.65)]">
                {card.subtitle}
              </p>
              <p className="mt-2 font-['Anton'] text-3xl uppercase leading-[0.9] tracking-[-0.04em]">
                {card.title}
              </p>
            </motion.div>
          ))}

          <motion.div
            variants={sectionReveal}
            initial="hidden"
            animate="visible"
            className="relative z-20 mx-auto flex max-w-5xl flex-col items-center text-center"
          >
            <p className="mb-4 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.4em] text-[hsl(var(--landing-forest)/0.62)] sm:mb-6">
              Editorial cover / searchable plant-based index
            </p>
            <h1 className="max-w-[10ch] text-balance font-['Anton'] text-[clamp(4.75rem,23vw,16rem)] uppercase leading-[0.75] tracking-[-0.05em] text-[hsl(var(--landing-forest))]">
              {headline.split("").map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  custom={index}
                  variants={letterReveal}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </h1>
          </motion.div>
        </div>

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="grid gap-6 text-[hsl(var(--landing-forest))] md:grid-cols-[1.3fr_1fr]"
        >
          <p className="max-w-3xl font-['Inter'] text-base leading-8 text-[hsl(var(--landing-forest)/0.78)] sm:text-lg">
            A warmer, more tactile front door for the same vegan snack platform — keeping every route and lookup intact while shifting the cover page toward a high-end editorial mood.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2.5rem] border border-[hsl(var(--landing-forest)/0.08)] bg-[hsl(var(--landing-cream)/0.66)] p-5 backdrop-blur-md">
              <p className="font-['Inter'] text-[10px] font-bold uppercase tracking-[0.34em] text-[hsl(var(--landing-forest)/0.55)]">
                Origin
              </p>
              <p className="mt-3 font-['Anton'] text-3xl uppercase leading-[0.9] tracking-[-0.04em] text-[hsl(var(--landing-forest))]">
                India
              </p>
            </div>
            <div className="rounded-[2.5rem] border border-[hsl(var(--landing-forest)/0.08)] bg-[hsl(var(--landing-cream)/0.66)] p-5 backdrop-blur-md">
              <p className="font-['Inter'] text-[10px] font-bold uppercase tracking-[0.34em] text-[hsl(var(--landing-forest)/0.55)]">
                Mood
              </p>
              <p className="mt-3 font-['Anton'] text-3xl uppercase leading-[0.9] tracking-[-0.04em] text-[hsl(var(--landing-forest))]">
                Forest / Sage
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingHero;