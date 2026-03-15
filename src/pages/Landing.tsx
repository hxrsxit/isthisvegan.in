import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  Sparkles,
  Shield,
  Heart,
  Beaker,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const navLinks = [
  { to: "/", label: "Snack Finder" },
  { to: "/go-vegan", label: "Go Vegan" },
  { to: "/about", label: "About" },
  { to: "/join-us", label: "Community" },
];

const bentoCards = [
  {
    id: "flagship",
    span: 2,
    icon: Leaf,
    title: "Science-Backed Formulations",
    body: "Every product is developed with clinical-grade ingredients and third-party tested for purity. We partner with nutritionists and researchers to ensure efficacy you can trust.",
  },
  {
    id: "2",
    span: 1,
    icon: Shield,
    title: "Clean Transparency",
    body: "Full ingredient lists, sourcing origins, and sustainability metrics. No greenwashing—just clarity.",
  },
  {
    id: "3",
    span: 1,
    icon: Heart,
    title: "Gentle on You & Earth",
    body: "Vegan, cruelty-free, and formulated for sensitive systems. Kind to your body and the planet.",
  },
  {
    id: "4",
    span: 1,
    icon: Beaker,
    title: "Rigorous Testing",
    body: "Lab-verified for heavy metals, contaminants, and label accuracy. Premium quality, guaranteed.",
  },
  {
    id: "5",
    span: 1,
    icon: Award,
    title: "Expert Trust",
    body: "Recommended by wellness practitioners and trusted by thousands for daily vitality.",
  },
];

const logoPlaceholders = ["Wellness Co", "Pure Life", "Green Path", "Vitality Lab", "Earth & Body"];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const itemFadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-ethereal-bg text-ethereal-text">
      {/* Floating Nav */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed left-1/2 top-0 z-50 -translate-x-1/2 pt-4 w-full max-w-5xl px-4"
        >
        <nav
          className="mx-auto flex items-center justify-between rounded-full border border-ethereal-border bg-white/80 px-6 py-3 shadow-ethereal backdrop-blur-xl"
          aria-label="Main navigation"
        >
          <Logo
            size={40}
            textClassName="text-ethereal-text text-xl md:text-2xl"
            className="md:gap-3"
          />
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full px-4 py-2 text-sm font-medium text-ethereal-text-muted transition-colors hover:bg-ethereal-border/50 hover:text-ethereal-text"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link to="/" className="shrink-0">
            <Button
              size="sm"
              className="rounded-full bg-ethereal-accent px-5 font-medium text-white hover:bg-ethereal-accent/90"
            >
              Get Started
            </Button>
          </Link>
        </nav>
      </motion.header>

      {/* Hero */}
      <section className="relative grid min-h-[90vh] w-full grid-cols-1 items-center gap-12 px-4 pt-28 pb-20 md:grid-cols-2 md:gap-16 md:px-8 lg:px-16 lg:pt-32">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex max-w-lg flex-col gap-8"
        >
          <motion.span
            variants={itemFadeUp}
            className="font-sans text-xs font-medium uppercase tracking-widest text-ethereal-text-muted"
          >
            Pure. Proven. Plant-Based.
          </motion.span>
          <motion.h1
            variants={itemFadeUp}
            className="font-serif text-5xl font-semibold leading-snug tracking-tight text-ethereal-text md:text-6xl lg:text-7xl"
          >
            Elevate Your Vitality.
          </motion.h1>
          <motion.p
            variants={itemFadeUp}
            className="max-w-md font-sans text-lg leading-relaxed text-ethereal-text-muted"
          >
            Discover evidence-based vegan wellness—from supplements to daily essentials.
            Trusted formulations, full transparency, and a calmer, stronger you.
          </motion.p>
          <motion.div variants={itemFadeUp} className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-ethereal-accent px-8 font-medium text-white shadow-ethereal hover:bg-ethereal-accent/90"
            >
              <Link to="/" className="group inline-flex items-center gap-2">
                Explore Snacks
                <ArrowRight size={18} strokeWidth={1.5} className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border border-ethereal-border bg-white/60 px-8 font-medium text-ethereal-text backdrop-blur-sm hover:bg-white/80 hover:border-ethereal-text-muted/30"
            >
              <Link to="/about" className="inline-flex items-center gap-2 group">
                Our Story
                <ArrowRight size={18} strokeWidth={1.5} className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-ethereal-accent/10 via-transparent to-ethereal-border/30 blur-2xl" />
          <div className="relative rounded-3xl border border-ethereal-border bg-white/70 p-10 shadow-ethereal backdrop-blur-md md:p-12 lg:rotate-[-2deg]">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ethereal-accent/10">
                <Sparkles size={32} strokeWidth={1.5} className="text-ethereal-accent" />
              </div>
              <p className="font-serif text-xl font-semibold text-ethereal-text">
                Trusted by thousands for clarity and vitality.
              </p>
              <p className="max-w-xs font-sans text-sm text-ethereal-text-muted">
                Real ingredients. Real results. No compromises.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social proof */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="border-y border-ethereal-border bg-white/40 py-12"
      >
        <div className="container">
          <p className="mb-8 text-center font-sans text-sm font-medium uppercase tracking-widest text-ethereal-text-muted">
            Trusted by leading wellness experts at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {logoPlaceholders.map((name, i) => (
              <span
                key={name}
                className="font-serif text-lg font-medium text-ethereal-text-muted/70"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Bento */}
      <section className="container py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <span className="font-sans text-xs font-medium uppercase tracking-widest text-ethereal-text-muted">
            Why choose us
          </span>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ethereal-text md:text-4xl">
            Built on science. Designed for life.
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4"
        >
          {bentoCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                variants={itemFadeUp}
                className={card.span === 2 ? "md:col-span-2" : ""}
              >
                <motion.div
                  whileHover={{
                    scale: 1.01,
                    boxShadow: "0 12px 40px rgb(0,0,0,0.06)",
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full rounded-3xl border border-ethereal-border bg-white p-8 shadow-ethereal md:p-10"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-ethereal-accent/10">
                    <Icon size={24} strokeWidth={1.5} className="text-ethereal-accent" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold tracking-tight text-ethereal-text">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-ethereal-text-muted">
                    {card.body}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Footer CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-t border-ethereal-border bg-white/50 py-20"
      >
        <div className="container max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ethereal-text md:text-4xl">
            Ready to feel the difference?
          </h2>
          <p className="mt-4 font-sans text-base text-ethereal-text-muted">
            Join thousands who've made the switch to evidence-based vegan wellness.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-ethereal-accent px-10 font-medium text-white shadow-ethereal hover:bg-ethereal-accent/90"
            >
              <Link to="/">Get Started</Link>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Landing;
