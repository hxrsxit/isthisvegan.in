import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { type Snack } from "@/lib/snacks-data";
import { supabase } from "@/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const debouncedQuery = useDebounce(query, 300);
  const heroTitle = "Vegan Snacks";
  const previewImages = [
    {
      src: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1100&q=80",
      alt: "Assorted organic seeds and grains",
      speed: 0.03,
      className: "left-[8%] top-[22%] w-36 md:w-52",
    },
    {
      src: "https://images.unsplash.com/photo-1515543904379-3d757afe72e1?auto=format&fit=crop&w=1100&q=80",
      alt: "Fresh herb leaves",
      speed: 0.05,
      className: "right-[8%] top-[15%] w-28 md:w-44",
    },
    {
      src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1100&q=80",
      alt: "Organic produce on table",
      speed: 0.04,
      className: "right-[18%] bottom-[14%] w-32 md:w-48",
    },
  ];

  useEffect(() => {
    const fetchSnacks = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from<Snack>("indian-snacks")
        .select("*")
        .order("snack_name", { ascending: true });

      if (error) {
        setError(error.message);
        setSnacks([]);
      } else {
        setSnacks(data ?? []);
      }

      setLoading(false);
    };

    fetchSnacks();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = useMemo(() => {
    if (!debouncedQuery.trim()) return snacks;
    const q = debouncedQuery.toLowerCase();
    return snacks.filter(
      (s) =>
        s.snack_name.toLowerCase().includes(q) ||
        s.brand_or_region.toLowerCase().includes(q)
    );
  }, [debouncedQuery, snacks]);

  const productCards = filtered.slice(0, 9);
  const motionEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#fefae0] text-[#01472e]">
      <div className="noise-overlay fixed inset-0 z-[1] pointer-events-none" aria-hidden />
      <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">
          <p className="font-['Inter'] text-[10px] font-bold uppercase tracking-[0.4em] text-[#01472e]">
            - Vegan Atlas
          </p>
          <nav className="rounded-full border border-white/35 bg-[#ffffff1a] px-3 py-2 backdrop-blur-[20px]">
            <ul className="flex items-center gap-1">
              {["Home", "Products", "Story", "Origin"].map((item) => (
                <li key={item}>
                  <a
                    href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
                    className="inline-flex rounded-full px-4 py-2 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.3em] text-[#01472e] transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:bg-white/40"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.3em] text-[#01472e] shadow-[0_20px_40px_rgba(1,71,46,0.2)]">
            Cart
            <span className="rounded-full bg-[#01472e] px-2 py-1 text-[9px] text-white">03</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 pt-24">
        <section className="relative min-h-screen overflow-hidden bg-[#ccd5ae] px-4 pb-14 pt-10 md:px-8 md:pb-20">
          <div className="mx-auto flex h-full max-w-[1400px] flex-col justify-between">
            {previewImages.map((image) => (
              <motion.img
                key={image.src}
                src={image.src}
                alt={image.alt}
                className={`organic-float pointer-events-none absolute ${image.className} rounded-[3rem] object-cover shadow-[0_24px_56px_rgba(1,71,46,0.2)]`}
                animate={{
                  y: -(scrollY * image.speed),
                }}
                transition={{ duration: 0.6, ease: motionEase }}
              />
            ))}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: motionEase }}
            className="pt-10"
          >
            <p className="mb-5 font-['Inter'] text-[11px] font-bold uppercase tracking-[0.35em] text-[#01472e]/70">
              Organic Editorial Collection
            </p>
            <h1 className="font-['Anton'] text-[23vw] leading-[0.75] tracking-[-0.05em] text-[#01472e] md:text-[18vw]">
              {heroTitle.split("").map((letter, idx) => (
                <motion.span
                  key={`${letter}-${idx}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: idx * 0.05,
                    ease: motionEase,
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </h1>
          </motion.div>

            <div className="mt-12 grid gap-8 font-['Inter'] md:grid-cols-2">
              <p className="max-w-xl text-base leading-relaxed text-[#01472e]/80 md:text-lg">
                Discover handcrafted vegan-friendly Indian snacks in an earthy, premium shopping experience with fluid movement and rich tactile depth.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#01472e]/75">
                  Region: Jaipur + Mumbai
                </p>
                <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#01472e]/75">
                  Curated: {snacks.length} SKUs
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="products"
          className="relative rounded-t-[5rem] bg-[#e9edc9] px-4 pb-20 pt-20 md:px-8"
        >
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: motionEase }}
              className="mb-10 flex flex-wrap items-end justify-between gap-6"
            >
              <h2 className="font-['Anton'] text-[15vw] leading-[0.75] tracking-[-0.05em] text-[#01472e] md:text-[10vw]">
                Featured
              </h2>
              <button className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#01472e] text-[10px] font-bold uppercase tracking-[0.3em] text-[#fefae0] shadow-[0_20px_40px_rgba(1,71,46,0.2)] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:scale-105">
                Explore
              </button>
            </motion.div>

            <div className="mb-10 max-w-xl">
              <div className="relative">
                <Search
                  size={18}
                  strokeWidth={1.5}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#01472e]/55"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  placeholder="Search by name or brand"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-14 rounded-[2.5rem] border-[#01472e]/20 bg-[#fefae0]/70 pl-11 pr-11 font-['Inter'] text-sm text-[#01472e] shadow-[0_20px_40px_rgba(1,71,46,0.2)] backdrop-blur-sm transition-all duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-[#01472e]/40 focus-visible:ring-offset-0"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#01472e]/60 transition-colors duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:bg-[#01472e]/10 hover:text-[#01472e]"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: motionEase }}
                  className="py-24 text-center font-['Inter'] text-sm font-bold uppercase tracking-[0.3em] text-[#01472e]/70"
                >
                  Loading snacks...
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: motionEase }}
                  className="py-24 text-center font-['Inter'] text-sm font-bold uppercase tracking-[0.25em] text-[#01472e]"
                >
                  Failed to load products: {error}
                </motion.div>
              ) : productCards.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: motionEase }}
                  className="py-24 text-center font-['Inter'] text-sm font-bold uppercase tracking-[0.25em] text-[#01472e]/70"
                >
                  No snacks found.
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: motionEase }}
                  className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3"
                >
                  {productCards.map((snack, idx) => (
                    <motion.article
                      key={snack.slug}
                      initial={{ opacity: 0, y: 100 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 1.2,
                        delay: idx * 0.05,
                        ease: motionEase,
                      }}
                      className="group relative overflow-hidden rounded-[2.5rem] bg-[#fefae0]/70 p-4 shadow-[0_20px_40px_rgba(1,71,46,0.2)]"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
                        <img
                          src={`https://picsum.photos/seed/${snack.slug}/900/1120`}
                          alt={snack.snack_name}
                          className="h-full w-full object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-[rgba(1,71,46,0.3)] opacity-0 backdrop-blur-[2px] transition-all duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100">
                          <button className="absolute bottom-5 left-1/2 -translate-x-1/2 translate-y-8 rounded-full bg-white px-6 py-3 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.35em] text-[#01472e] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                            Quick Add
                          </button>
                        </div>
                      </div>
                      <div className="px-2 pb-2 pt-5 font-['Inter'] text-[#01472e]">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#01472e]/65">
                          {snack.brand_or_region}
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <h3 className="text-lg font-bold">{snack.snack_name}</h3>
                          <Link
                            to={`/snack/${snack.slug}`}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#01472e]/30 text-[#01472e] transition-colors duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:bg-[#01472e] hover:text-[#fefae0]"
                            aria-label={`Open ${snack.snack_name}`}
                          >
                            <ArrowUpRight size={18} />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <footer
        id="origin"
        className="relative z-10 rounded-t-[5rem] bg-[#01472e] px-4 pb-10 pt-16 text-[#ccd5ae] md:px-8"
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="font-['Inter'] text-[11px] font-bold uppercase tracking-[0.4em] text-[#ccd5ae]/80">
              Newsletter
            </p>
            <h3 className="mt-5 max-w-lg font-['Anton'] text-[min(14vw,8rem)] leading-[0.85] tracking-[-0.04em]">
              Stay Rooted
            </h3>
            <label className="mt-8 block">
              <span className="sr-only">Email</span>
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="w-full border-0 border-b border-[#ccd5ae]/60 bg-transparent pb-3 font-['Inter'] text-[11px] font-bold uppercase tracking-[0.35em] text-[#ccd5ae] placeholder:text-[#ccd5ae]/50 focus:outline-none"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:col-span-6">
            <div>
              <p className="mb-5 font-['Inter'] text-[11px] font-bold uppercase tracking-[0.35em] text-[#ccd5ae]/70">
                Shop
              </p>
              <ul className="space-y-3 font-['Inter'] text-[11px] font-bold uppercase tracking-[0.3em]">
                <li>Collections</li>
                <li>New Drops</li>
                <li>Gift Boxes</li>
              </ul>
            </div>
            <div>
              <p className="mb-5 font-['Inter'] text-[11px] font-bold uppercase tracking-[0.35em] text-[#ccd5ae]/70">
                About
              </p>
              <ul className="space-y-3 font-['Inter'] text-[11px] font-bold uppercase tracking-[0.3em]">
                <li>Our Origin</li>
                <li>Journal</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-[1400px] flex-wrap items-center justify-between gap-4 border-t border-[#ccd5ae]/20 pt-6 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.28em] text-[#ccd5ae]/30">
          <p>Copyright 2026 Vegan Atlas</p>
          <p>Privacy Policy / Terms</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
