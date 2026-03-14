import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import SnackCard from "@/components/SnackCard";
import { snacksData } from "@/lib/snacks-data";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const filtered = useMemo(() => {
    if (!debouncedQuery.trim()) return snacksData;
    const q = debouncedQuery.toLowerCase();
    return snacksData.filter(
      (s) =>
        s.snack_name.toLowerCase().includes(q) ||
        s.brand_or_region.toLowerCase().includes(q)
    );
  }, [debouncedQuery]);

  return (
    <div>
      {/* Hero with mesh gradient */}
      <div className="mesh-gradient py-16 md:py-24">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-4xl md:text-5xl font-bold leading-tight"
          >
            Is it vegan?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-muted-foreground mt-3 text-lg md:text-xl"
          >
            Search {snacksData.length}+ Indian snacks & street foods.
          </motion.p>
        </div>
      </div>

      <div className="container py-8 md:py-10">
        {/* Search */}
        <div className="sticky top-16 z-40 bg-background/70 backdrop-blur-xl py-4 -mx-2 px-2 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="relative"
          >
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search by name or brand..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 pl-11 pr-11 text-base rounded-2xl border-border bg-card shadow-card focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Search snacks"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </motion.div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
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
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
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
