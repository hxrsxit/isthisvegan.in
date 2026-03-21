import { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import SnackCard from "@/components/SnackCard";
import { type Snack } from "@/lib/snacks-data";
import { supabase } from "@/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);

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

  const filtered = useMemo(() => {
    if (!debouncedQuery.trim()) return snacks;
    const q = debouncedQuery.toLowerCase();
    return snacks.filter(
      (s) =>
        s.snack_name.toLowerCase().includes(q) ||
        s.brand_or_region.toLowerCase().includes(q)
    );
  }, [debouncedQuery, snacks]);

  const motionEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className="relative min-h-screen bg-[#fefae0] text-[#01472e]">
      <div className="noise-overlay pointer-events-none fixed inset-0 z-[1]" aria-hidden />
      <div className="relative z-10">
        <div className="rounded-t-[5rem] bg-[#ccd5ae] py-16 md:py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: motionEase }}
              className="mb-6"
            >
              <Logo showText={false} size={40} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: motionEase }}
              className="max-w-6xl font-['Anton'] text-[clamp(3.2rem,13vw,9rem)] leading-[0.82] tracking-[-0.04em] text-[#01472e]"
            >
              Wondering if your Indian Snack
              <br className="hidden sm:inline" />
              is Vegan or Not?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.08, ease: motionEase }}
              className="mt-5 max-w-2xl font-['Inter'] text-base text-[#01472e]/75 md:text-lg"
            >
              Search {snacks.length}+ Indian snacks & street foods.
            </motion.p>
          </div>
        </div>
        <div className="container py-8 md:py-10">
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.12, ease: motionEase }}
              className="relative"
            >
              <Search
                size={18}
                strokeWidth={1.5}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#01472e]/50"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search by name or brand..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-14 rounded-[2.5rem] border-[#01472e]/20 bg-[#fefae0]/80 pl-11 pr-11 font-['Inter'] text-base text-[#01472e] shadow-[0_20px_40px_rgba(1,71,46,0.2)] backdrop-blur-sm transition-shadow duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-[#01472e]/45 focus-visible:ring-offset-2"
                aria-label="Search snacks"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#01472e]/60 transition-colors duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:bg-[#01472e]/10 hover:text-[#01472e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01472e]/35"
                  aria-label="Clear search"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              )}
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: motionEase }}
                className="botanical-watermark py-20 text-center"
              >
                <p className="font-['Inter'] text-lg text-[#01472e]/70">Loading snacks...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: motionEase }}
                className="botanical-watermark py-20 text-center"
              >
                <p className="font-['Inter'] text-lg text-[#01472e]">
                  Failed to load snacks from Supabase.
                </p>
                <p className="mt-2 break-words font-['Inter'] text-sm text-[#01472e]/70">
                  {error}
                </p>
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: motionEase }}
                className="botanical-watermark py-20 text-center"
              >
                <p className="font-['Inter'] text-lg text-[#01472e]/70">
                  No snacks found. Try checking the spelling or report a missing item.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: motionEase, staggerChildren: 0.04 }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
              >
                {filtered.map((snack, i) => (
                  <SnackCard key={snack.slug} snack={snack} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
