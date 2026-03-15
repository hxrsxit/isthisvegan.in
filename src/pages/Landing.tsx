import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Sparkles,
  Shield,
  Heart,
  Search,
  ShoppingBag,
  FlaskConical,
  Award,
  Smartphone,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

/* ─── Data ─── */
const navLinks = [
  { to: "/", label: "Snack Finder" },
  { to: "/go-vegan", label: "Go Vegan" },
  { to: "/about", label: "About" },
  { to: "/join-us", label: "Community" },
];

const featureCards = [
  {
    icon: Leaf,
    title: "PLANT TEST",
    body: "Our unique plant selection test that works flawlessly for every conscious choice.",
    image: "/images/tropical-leaf.jpg",
  },
  {
    icon: BookOpen,
    title: "INFO",
    body: "We have collected thousands of articles and podcasts for your study.",
    image: "/images/monstera.jpg",
  },
  {
    icon: FlaskConical,
    title: "FEATURE",
    body: "Each plant has its own passport, because it's a new member of the family.",
    image: "/images/hero-matcha.jpg",
  },
  {
    icon: Smartphone,
    title: "APP",
    body: "Our app will make your experience easier and more beautiful.",
    image: "/images/greenhouse.jpg",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-ethereal-bg text-ethereal-text">
      {/* ═══════ Floating Glass Nav ═══════ */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed left-1/2 top-0 z-50 -translate-x-1/2 pt-4 w-full max-w-6xl px-4"
      >
        <nav
          className="mx-auto flex items-center justify-between rounded-full border border-white/20 bg-white/30 px-5 py-2.5 shadow-ethereal backdrop-blur-xl"
          aria-label="Main navigation"
        >
          <Logo
            size={36}
            textClassName="text-ethereal-text text-lg md:text-xl"
            className="md:gap-2.5"
          />
          <div className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full px-4 py-2 text-sm font-medium text-ethereal-text-muted transition-colors hover:bg-white/40 hover:text-ethereal-text"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden rounded-full p-2 text-ethereal-text-muted transition-colors hover:bg-white/40 hover:text-ethereal-text md:inline-flex" aria-label="Search">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button className="hidden rounded-full p-2 text-ethereal-text-muted transition-colors hover:bg-white/40 hover:text-ethereal-text md:inline-flex" aria-label="Favorites">
              <Heart size={18} strokeWidth={1.5} />
            </button>
            <Link to="/" className="shrink-0">
              <Button
                size="sm"
                className="rounded-full bg-ethereal-accent px-5 text-sm font-medium text-white hover:bg-ethereal-accent/90"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* ═══════ Botanical Hero ═══════ */}
      <section className="relative mx-4 mt-20 overflow-hidden rounded-3xl md:mx-6 lg:mx-8">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-leaves.jpg"
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        </div>

        <div className="relative grid min-h-[85vh] grid-cols-1 items-center gap-8 px-6 py-20 md:grid-cols-2 md:px-12 lg:px-20">
          {/* Glass overlay card */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-lg md:p-12"
          >
            <motion.span
              variants={fadeUp}
              className="mb-4 inline-block font-sans text-xs font-medium uppercase tracking-[0.2em] text-white/70"
            >
              Kudos To Being Conscious
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="font-serif text-5xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl"
            >
              Enjoy
              <br />
              Nature.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-md font-sans text-base leading-relaxed text-white/80"
            >
              Add a touch of magic and uniqueness to your home. Our curated vegan snacks are not just food — they're a connection to a kinder world.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-ethereal-bg px-8 font-medium text-ethereal-text shadow-lg hover:bg-white"
              >
                <Link to="/" className="group inline-flex items-center gap-2">
                  Connect with nature
                  <ArrowRight size={16} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-white/30 bg-transparent px-8 font-medium text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/50"
              >
                <Link to="/about">Our Story</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right side floating accent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden items-end justify-end md:flex"
          >
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <p className="font-serif text-2xl font-semibold leading-tight text-white lg:text-3xl">
                Plants
                <br />
                for you
              </p>
              <p className="mt-2 text-sm text-white/60">Discover curated wellness</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ Green Paradise Bento ═══════ */}
      <section className="px-4 py-20 md:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 flex items-end justify-between"
          >
            <div>
              <span className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-ethereal-text-muted">
                Explore
              </span>
              <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-tight text-ethereal-text md:text-5xl lg:text-6xl">
                YOU GOT A TICKET TO THE
                <br />
                <span className="font-display">GREEN PARADISE</span>
              </h2>
            </div>
            <span className="hidden font-sans text-sm text-ethereal-text-muted md:block">
              Enjoy Nature
            </span>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2"
          >
            {/* Card 1 – Large image, spans 2 cols & 2 rows */}
            <motion.div
              variants={fadeUp}
              className="group relative overflow-hidden rounded-3xl md:col-span-2 md:row-span-2"
            >
              <img
                src="/images/forest-cover.jpg"
                alt="Lush green forest"
                className="h-full min-h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:min-h-full"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-sm">
                  Explore
                </span>
              </div>
            </motion.div>

            {/* Card 2 – Text card */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col justify-between rounded-3xl bg-ethereal-surface p-8 shadow-ethereal md:col-span-2"
            >
              <h3 className="font-serif text-2xl font-semibold tracking-tight text-ethereal-text md:text-3xl">
                TOUCH THE
                <br />
                WORLD OF FLORA
              </h3>
              <div className="mt-6 flex items-center gap-3">
                <Link
                  to="/"
                  className="group inline-flex items-center gap-2 font-sans text-sm font-medium text-ethereal-accent transition-colors hover:text-ethereal-text"
                >
                  Learn more
                  <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.div>

            {/* Card 3 – Small image */}
            <motion.div
              variants={fadeUp}
              className="group relative overflow-hidden rounded-3xl"
            >
              <img
                src="/images/plant-hand.jpg"
                alt="Hand holding a plant"
                className="h-full min-h-[220px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </motion.div>

            {/* Card 4 – Small accent card */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col justify-between rounded-3xl border border-ethereal-border bg-[hsl(100_15%_92%)] p-6"
            >
              <Sparkles size={24} strokeWidth={1.5} className="text-ethereal-accent" />
              <div className="mt-auto pt-6">
                <p className="font-serif text-lg font-semibold text-ethereal-text">Unique Project</p>
                <p className="mt-1 text-sm text-ethereal-text-muted">
                  For 10 years, we have been gaining experience growing unique plants.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ About Us Strip ═══════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-y border-ethereal-border bg-ethereal-surface py-16 md:py-20"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-2 md:gap-16 lg:px-8">
          <div>
            <span className="rounded-full border border-ethereal-border px-4 py-1.5 font-sans text-xs font-medium uppercase tracking-wider text-ethereal-text-muted">
              About Us
            </span>
            <p className="mt-6 font-serif text-xl leading-relaxed text-ethereal-text md:text-2xl">
              We are glad to welcome you to our ecosystem! We are a team of professionals who will be happy to help you make your green dreams come true.
            </p>
            <Link
              to="/about"
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-ethereal-border px-5 py-2.5 font-sans text-sm font-medium text-ethereal-text transition-colors hover:bg-ethereal-accent hover:text-white hover:border-transparent"
            >
              LEARN MORE
              <ArrowRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div>
            <p className="font-sans text-base leading-relaxed text-ethereal-text-muted">
              For 10 years, we have been gaining experience and knowledge to grow unique plants just for you. We take care of every order, and yours is no exception.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ═══════ Features Grid (Dark Cards) ═══════ */}
      <section className="px-4 py-20 md:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  variants={fadeUp}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="group relative overflow-hidden rounded-3xl"
                >
                  <img
                    src={card.image}
                    alt=""
                    className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-72"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(150_30%_12%/0.85)] via-[hsl(150_30%_12%/0.3)] to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                      <Icon size={20} strokeWidth={1.5} className="text-white" />
                    </div>
                    <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-white">
                      {card.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/70">
                      {card.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6 flex justify-center"
          >
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-full border border-ethereal-border px-6 py-3 font-sans text-sm font-medium text-ethereal-text transition-colors hover:bg-ethereal-accent hover:text-white hover:border-transparent"
            >
              PODCAST FOR YOU
              <ArrowRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════ "Not just an object" CTA ═══════ */}
      <section className="mx-4 overflow-hidden rounded-3xl md:mx-6 lg:mx-8">
        <div className="relative">
          <img
            src="/images/greenhouse.jpg"
            alt="Inside a greenhouse"
            className="h-[50vh] w-full object-cover md:h-[60vh]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center px-8 md:px-16"
          >
            <div className="max-w-lg">
              <h2 className="font-serif text-3xl font-semibold leading-tight text-white md:text-5xl">
                When plants are
                <br />
                not just an object
              </h2>
              <p className="mt-4 text-base text-white/70">
                Our plants undergo strict selective selection before coming to your home.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 rounded-full bg-white px-8 font-medium text-ethereal-text hover:bg-white/90"
              >
                <Link to="/" className="group inline-flex items-center gap-2">
                  Explore Snacks
                  <ArrowRight size={16} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ Footer ═══════ */}
      <footer className="border-t border-ethereal-border bg-ethereal-surface py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center md:flex-row md:justify-between md:text-left">
          <Logo size={32} textClassName="text-ethereal-text text-lg" />
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-ethereal-text-muted transition-colors hover:text-ethereal-text"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-ethereal-text-muted">
            © {new Date().getFullYear()} IsThisVegan?
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
