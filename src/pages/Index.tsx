import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, X, ShieldCheck } from "lucide-react";
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
  { label: "Vegan Only", key: "Vegan" },
  { label: "Jain Friendly", key: "Jain-Friendly" },
  { label: "Gluten Free", key: "Gluten-Free" },
  { label: "Palm-Oil Free", key: "Palm-oil-free" },
  { label: "Healthy", key: "Healthy" },
  { label: "Street Food", key: "Street-Food" },
  { label: "Savory Snacks", key: "Savory" },
  { label: "Sweets & Baked", key: "Sweets" },
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

  // Infinite scroll sentinel callback ref
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

      // Paginate through isthisvegan_db2
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

        if (!data || data.length < PAGE_SIZE) break;
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
    <div className="relative min-h-screen bg-[#f8f7f4] text-[#1c211e]">
      <Helmet>
        <title>Is This Vegan? — Check if Indian Foods & Snacks are Vegan</title>
        <meta
          name="description"
          content="Search 3000+ Indian packaged snacks, street foods, and drinks to instantly check if they're vegan. Sage green dietary directory for India."
        />
        <link rel="canonical" href="https://www.isthisvegan.in/" />
        <meta property="og:title" content="Is This Vegan? — Check if Indian Foods & Snacks are Vegan" />
        <meta property="og:description" content="Search 3000+ Indian snacks and foods to check if they're vegan." />
        <meta property="og:url" content="https://www.isthisvegan.in/" />
      </Helmet>

      <div className="noise-overlay pointer-events-none fixed inset-0 z-[1]" aria-hidden />

      <div className="relative z-10">
        {/* Natural Sage Green Hero Container */}
        <div className="bg-[#354338] text-[#f8f7f4] pt-10 pb-14 md:pt-16 md:pb-20 border-b border-[#2d3a30]">
          <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: motionEase }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#4d5d50] bg-[#435246] px-3.5 py-1 font-mono-data text-[10px] font-bold uppercase tracking-[0.2em] text-[#d9e2db] shadow-2xs mb-5">
                <ShieldCheck size={12} className="text-[#a3b5a7]" />
                <span>India's Plant-Based Directory • 3,000+ Verified Items</span>
              </div>
              <h1 className="font-serif-fraunces text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#f8f7f4] leading-[1.12]">
                Is Your Food Plant-based or Not?
              </h1>
              <p className="mt-4 max-w-xl font-sans-ui text-base text-[#c5cfc8] leading-relaxed">
                Instant ingredient verification, allergen safety, Jain compatibility badges, and street food ordering hacks.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Sticky Search Bar & Filter Controls Bar */}
        <div className="sticky top-16 z-40 border-b border-[#e3e7e2] bg-[#f8f7f4]/95 py-4 backdrop-blur-md shadow-2xs mb-8">
          <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3">
              {/* Search Field */}
              <div className="relative w-full">
                <Search
                  size={18}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5a655c]"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  placeholder="Search brand, dish, 'jain snacks', 'palm oil free chips'..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-12 w-full rounded-xl border-[#e3e7e2] bg-white pl-11 pr-11 font-sans-ui text-sm text-[#1c211e] shadow-2xs placeholder:text-[#5a655c]/60 focus-visible:ring-2 focus-visible:ring-[#354338]"
                  aria-label="Search products"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#5a655c] hover:bg-[#e3e7e2] hover:text-[#1c211e]"
                    aria-label="Clear search"
                  >
                    <X size={16} strokeWidth={1.5} />
                  </button>
                )}
              </div>

              {/* Filter Pills */}
              <div className="overflow-x-auto pb-0.5 no-scrollbar">
                <div className="flex min-w-max items-center gap-2">
                  {PRESET_FILTERS.map((filter) => (
                    <Badge
                      key={filter.key}
                      variant="outline"
                      onClick={() => setActivePreset(filter.key)}
                      className={`cursor-pointer rounded-full px-4 py-1.5 font-sans-ui text-xs font-semibold tracking-wide transition-all ${
                        activePreset === filter.key
                          ? "border-[#354338] bg-[#354338] text-white shadow-xs"
                          : "border-[#e3e7e2] bg-white text-[#3e4a40] hover:bg-[#e2e7e0] hover:border-[#354338]/40 shadow-2xs"
                      }`}
                    >
                      {filter.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingAnimation key="loadingState" />
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-16 text-center"
              >
                <p className="font-serif-fraunces text-lg text-[#1c211e]">
                  Failed to load products from database.
                </p>
                <p className="mt-2 font-sans-ui text-xs text-[#5a655c]">{error}</p>
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-16 text-center"
              >
                <div className="mx-auto max-w-md rounded-2xl border border-[#e3e7e2] bg-white p-8 shadow-xs">
                  <p className="font-serif-fraunces text-xl font-bold text-[#1c211e]">
                    No Matching Products Found
                  </p>
                  <p className="mt-2 font-sans-ui text-xs text-[#5a655c]">
                    Try adjusting your search terms or selecting "All Items".
                  </p>
                  <Button
                    asChild
                    className="mt-5 rounded-full bg-[#354338] px-6 py-2.5 font-sans-ui text-xs font-semibold text-white hover:bg-[#28332a]"
                  >
                    <a href="mailto:info.isthisvegan@gmail.com?subject=New Snack Suggestion">
                      Suggest a Product
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
                  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
                }}
                className="w-full"
              >
                <div className="mb-4 flex items-center justify-between font-mono-data text-xs text-[#5a655c] uppercase tracking-wider">
                  <span>Showing {displayedSnacks.length} of {filtered.length} products</span>
                  {activePreset !== "All" && (
                    <button
                      onClick={() => setActivePreset("All")}
                      className="underline hover:text-[#1c211e]"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedSnacks.map((snack, i) => (
                    <motion.div
                      key={snack.slug}
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        show: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.35, ease: motionEase }}
                    >
                      <SnackCard snack={snack} index={i} />
                    </motion.div>
                  ))}
                </div>

                {/* Infinite Scroll sentinel */}
                {displayCount < filtered.length && (
                  <div ref={sentinelRef} className="w-full mt-10">
                    <LoadingAnimation message="Loading more products..." className="py-6" />
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
