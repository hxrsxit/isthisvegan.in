import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, X, Leaf, Sparkles, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import SnackCard from "@/components/SnackCard";
import { Snack, parseArrayField, parseJsonObjectField, ProductMetadata } from "@/lib/snacks-data";
import { supabase } from "@/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { searchWithTypoTolerance, getSnackSearchKeys } from "@/lib/fuzzy";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { Helmet } from "react-helmet-async";

const PRESET_FILTERS = [
  { label: "All Items", key: "All" },
  { label: "🌱 Vegan Only", key: "Vegan" },
  { label: "🙏 Jain Friendly", key: "Jain-Friendly" },
  { label: "🌾 Gluten Free", key: "Gluten-Free" },
  { label: "🌴 Palm-Oil Free", key: "Palm-oil-free" },
  { label: "💚 Healthy", key: "Healthy" },
  { label: "🛵 Street Food", key: "Street-Food" },
  { label: "🥨 Savory Snacks", key: "Savory" },
  { label: "🍫 Sweets & Baked", key: "Sweets" },
];

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState("All");
  const [displayCount, setDisplayCount] = useState(30);
  const debouncedQuery = useDebounce(query, 300);

  // Reset display count on new search or preset filter change
  useEffect(() => {
    setDisplayCount(30);
  }, [debouncedQuery, activePreset]);

  // Callback ref: attaches observer whenever the sentinel element mounts
  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayCount((prev) => prev + 30);
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchSnacks = async () => {
      setLoading(true);
      setError(null);

      const PAGE_SIZE = 1000;
      let allData: Snack[] = [];
      let from = 0;

      // Paginate — Supabase caps single queries at 1000 rows
      while (true) {
        const { data, error } = await supabase
          .from<Snack>("isthisvegan_db2")
          .select("*")
          .order("name", { ascending: true })
          .range(from, from + PAGE_SIZE - 1);

        if (error) {
          setError(error.message);
          setSnacks([]);
          setLoading(false);
          return;
        }

        allData = allData.concat(data ?? []);

        if (!data || data.length < PAGE_SIZE) break; // last page
        from += PAGE_SIZE;
      }

      setSnacks(allData);
      setLoading(false);
    };

    fetchSnacks();
  }, []);

  const filtered = useMemo(() => {
    let base = snacks;

    // Filter by preset tag
    if (activePreset !== "All") {
      base = base.filter((s) => {
        const dietaryBadges = parseArrayField(s.dietary_compatibility);
        const metadata = parseJsonObjectField<ProductMetadata>(s.product_metadata, {});
        const pClass = (s.product_class || "").toLowerCase();
        const fType = (s.food_type || "").toLowerCase();
        const sType = (s.sub_type || "").toLowerCase();
        const mainCat = (s.main_category || "").toLowerCase();

        switch (activePreset) {
          case "Vegan":
            return s.is_vegan === true;
          case "Jain-Friendly":
            return dietaryBadges.some((b) => b.toLowerCase().includes("jain"));
          case "Gluten-Free":
            return dietaryBadges.some((b) => b.toLowerCase().includes("gluten"));
          case "Palm-oil-free":
            return (
              dietaryBadges.some((b) => b.toLowerCase().includes("palm")) ||
              metadata.ethical_flags?.palm_oil_free === true
            );
          case "Healthy":
            return (
              metadata.health_tier?.startsWith("1") ||
              metadata.health_tier?.startsWith("2")
            );
          case "Street-Food":
            return metadata.packaging_status === "Street-Food";
          case "Savory":
            return (
              fType.includes("snack") ||
              pClass.includes("food") ||
              ["chips", "wafers", "namkeen", "popcorn", "extruded", "nut", "fried", "papad"].some((t) =>
                sType.includes(t)
              )
            );
          case "Sweets":
            return (
              fType.includes("dessert") ||
              ["chocolate", "biscuit", "cookie", "cake", "candy", "sweet", "halwa", "ice-cream"].some((t) =>
                sType.includes(t)
              )
            );
          default:
            return true;
        }
      });
    }

    // Step 2: Use typo-tolerant fuzzy finder across multi-attribute keys
    if (!debouncedQuery.trim()) return base;

    return searchWithTypoTolerance(base, debouncedQuery, getSnackSearchKeys);
  }, [activePreset, debouncedQuery, snacks]);

  const displayedSnacks = useMemo(() => {
    return filtered.slice(0, displayCount);
  }, [filtered, displayCount]);

  const motionEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className="relative min-h-screen bg-[#fefae0] text-[#01472e]">
      <Helmet>
        <title>Is This Vegan? — Check if Indian Snacks & Foods are Vegan</title>
        <meta
          name="description"
          content="Search 3000+ Indian snacks, street foods, packaged products, and drinks to instantly check if they're vegan. Filter by Jain, Gluten-Free, Palm-Oil-Free, and Health Tiers."
        />
        <link rel="canonical" href="https://www.isthisvegan.in/" />
        <meta property="og:title" content="Is This Vegan? — Check if Indian Snacks & Foods are Vegan" />
        <meta
          property="og:description"
          content="Search 3000+ Indian snacks, street foods, and packaged products to instantly find out if they're vegan."
        />
        <meta property="og:url" content="https://www.isthisvegan.in/" />
      </Helmet>
      <div className="noise-overlay pointer-events-none fixed inset-0 z-[1]" aria-hidden />
      <div className="relative z-10">
        <div className="rounded-t-[5rem] bg-[#ccd5ae] py-10 md:py-14">
          <div className="container">
            <motion.h1
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: motionEase }}
              className="max-w-5xl font-['Playfair_Display'] text-[clamp(2.5rem,8.2vw,6.2rem)] font-semibold leading-[0.95] tracking-[-0.015em] text-[#01472e]"
            >
              Wondering if your Indian Snack{" "}
              <br className="hidden sm:inline" />
              is Vegan or Not?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.08, ease: motionEase }}
              className="mt-5 max-w-2xl font-['Inter'] text-base text-[#01472e]/75 md:text-lg"
            >
              Search 3000+ Indian packaged snacks, street foods & beverages.
              <br className="hidden sm:inline" />
              Detailed allergen breakdowns, Jain badges, and street ordering hacks.
            </motion.p>
          </div>
        </div>

        <div className="container py-8 md:py-10">
          <div className="sticky top-16 z-40 mb-8 rounded-[2rem] border border-white/60 bg-white/70 p-3 shadow-[0_12px_30px_rgba(1,71,46,0.08)] backdrop-blur-md md:p-4">
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
                placeholder="Search brand, dish, 'palm oil free chips', 'jain snacks'..."
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

            {/* Category / Preset Badges */}
            <div className="mt-3 overflow-x-auto pb-1">
              <div className="flex min-w-max items-center gap-2">
                {PRESET_FILTERS.map((filter) => (
                  <Badge
                    key={filter.key}
                    variant="outline"
                    onClick={() => setActivePreset(filter.key)}
                    className={`cursor-pointer rounded-full px-3.5 py-1.5 font-['Inter'] text-[11px] font-medium tracking-wide transition-all duration-300 ${activePreset === filter.key
                        ? "border-[#01472e] bg-[#01472e] text-[#fefae0] shadow-xs"
                        : "border-[#01472e]/20 bg-[#fefae0]/70 text-[#01472e]/80 hover:border-[#01472e]/45 hover:text-[#01472e]"
                      }`}
                  >
                    {filter.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingAnimation key="loadingState" />
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
                  Failed to load database.
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
                <div className="mx-auto max-w-xl rounded-[2.5rem] border border-[#01472e]/15 bg-white/70 p-8 shadow-[0_18px_36px_rgba(1,71,46,0.12)] backdrop-blur-sm">
                  <p className="font-['Inter'] text-xl font-semibold text-[#01472e]">
                    No Matching Products Found
                  </p>
                  <p className="mt-2 font-['Inter'] text-sm text-[#01472e]/70">
                    Try clearing your search query or selecting "All Items" filter.
                  </p>
                  <Button
                    asChild
                    className="mt-5 rounded-full bg-[#01472e] px-6 font-['Inter'] text-xs font-bold uppercase tracking-[0.22em] text-[#fefae0] hover:bg-[#01472e]/90"
                  >
                    <a href="mailto:info.isthisvegan@gmail.com?subject=New Snack Suggestion for IsThisVegan">
                      Suggest a Snack
                    </a>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`${debouncedQuery}-${activePreset}`}
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.04, delayChildren: 0.01 },
                  },
                }}
                className="w-full"
              >
                <div className="mb-4 flex items-center justify-between font-['Inter'] text-xs text-[#01472e]/70 px-1">
                  <span>Showing {displayedSnacks.length} of {filtered.length} products</span>
                  {activePreset !== "All" && (
                    <button
                      onClick={() => setActivePreset("All")}
                      className="underline hover:text-[#01472e]"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  {displayedSnacks.map((snack, i) => (
                    <motion.div
                      key={snack.slug}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.4, ease: motionEase }}
                    >
                      <SnackCard snack={snack} index={i} />
                    </motion.div>
                  ))}
                </div>

                {/* Infinite Scroll trigger target */}
                {displayCount < filtered.length && (
                  <div ref={sentinelRef} className="w-full mt-10">
                    <LoadingAnimation message="Loading more products..." className="py-8" />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
