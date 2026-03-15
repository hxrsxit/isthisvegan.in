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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="mesh-gradient py-16 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-6"
          >
            <Logo showText={false} size={40} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-serif text-4xl font-semibold leading-snug tracking-tight text-foreground md:text-5xl"
          >
            Wondering if your Indian Snack is Vegan or Not?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-3 max-w-lg text-lg text-muted-foreground md:text-xl"
          >
            Search {snacks.length}+ Indian snacks & street foods.
          </motion.p>
        </div>
      </div>

      <div className="container py-8 md:py-10">
        {/* Search */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="relative"
          >
            <Search
              size={18}
              strokeWidth={1.5}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search by name or brand..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 rounded-2xl border-border bg-card/80 pl-11 pr-11 text-base shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm transition-shadow focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:shadow-[0_12px_40px_rgb(0,0,0,0.06)]"
              aria-label="Search snacks"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Clear search"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            )}
          </motion.div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-20 botanical-watermark"
            >
              <p className="text-muted-foreground text-lg">Loading snacks...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-20 botanical-watermark"
            >
              <p className="text-destructive text-lg">
                Failed to load snacks from Supabase.
              </p>
              <p className="text-muted-foreground mt-2 text-sm break-words">
                {error}
              </p>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-20 botanical-watermark"
            >
              <p className="text-muted-foreground text-lg">
                No snacks found. Try checking the spelling or report a missing item.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, staggerChildren: 0.04 }}
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
  );
};

export default HomePage;
