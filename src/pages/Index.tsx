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
    <div className="container py-8 md:py-12">
      {/* Hero */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          Is it vegan?
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Search {snacksData.length}+ Indian snacks & street foods.
        </p>
      </div>

      {/* Search */}
      <div className="sticky top-14 z-40 bg-background/90 backdrop-blur-sm py-3 -mx-2 px-2 mb-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search by name or brand..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 pl-10 pr-10 text-base shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] rounded-lg border-border focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
            aria-label="Search snacks"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-center py-16"
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
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((snack) => (
              <SnackCard key={snack.slug} snack={snack} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
