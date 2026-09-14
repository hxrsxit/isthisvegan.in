import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, ShieldCheck, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import SnackCard from "@/components/SnackCard";
import { Snack, parseArrayField, parseJsonObjectField, ProductMetadata } from "@/lib/snacks-data";
import { supabase } from "@/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { searchWithTypoTolerance, getSnackSearchKeys } from "@/lib/fuzzy";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { Helmet } from "react-helmet-async";
import { FilterDrawer, FilterState, DEFAULT_FILTERS } from "@/components/FilterDrawer";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState("All");
  const [displayCount, setDisplayCount] = useState(30);
  const [sortOption, setSortOption] = useState<string>(searchParams.get("sort") || "featured");

  const [filters, setFilters] = useState<FilterState>(() => {
    const brand = searchParams.get("brand");
    const dietary = searchParams.get("dietary");
    const subType = searchParams.get("sub_type");
    const foodType = searchParams.get("food_type");
    const productClass = searchParams.get("product_class");
    const allergen = searchParams.get("allergen");
    const status = searchParams.get("status");

    return {
      status: (status as any) || "all",
      productClasses: productClass ? [productClass] : [],
      foodTypes: foodType ? [foodType] : [],
      subTypes: subType ? [subType] : [],
      dietary: dietary ? [dietary] : [],
      excludeAllergens: allergen ? [allergen] : [],
      brands: brand ? [brand] : [],
    };
  });

  const debouncedQuery = useDebounce(query, 300);

  // Sync state with URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (sortOption !== "featured") params.set("sort", sortOption);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.brands.length > 0) params.set("brand", filters.brands[0]);
    if (filters.dietary.length > 0) params.set("dietary", filters.dietary[0]);
    if (filters.subTypes.length > 0) params.set("sub_type", filters.subTypes[0]);
    if (filters.foodTypes.length > 0) params.set("food_type", filters.foodTypes[0]);
    if (filters.productClasses.length > 0) params.set("product_class", filters.productClasses[0]);
    if (filters.excludeAllergens.length > 0) params.set("allergen", filters.excludeAllergens[0]);

    setSearchParams(params, { replace: true });
  }, [query, sortOption, filters, setSearchParams]);

  // Extract available brands
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    snacks.forEach((s) => {
      if (s.brand && s.brand.trim()) {
        set.add(s.brand.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [snacks]);

  useEffect(() => {
    setDisplayCount(30);
  }, [debouncedQuery, activePreset, filters, sortOption]);

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

      while (true) {
        const { data, error } = await supabase
          .from<Snack>("isthisvegan_db3")
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

  // Restore scroll position & pagination state when navigating back
  useEffect(() => {
    if (!loading && snacks.length > 0 && filtered.length > 0) {
      const savedPos = sessionStorage.getItem("isthisvegan_scroll_pos");
      const savedSlug = sessionStorage.getItem("isthisvegan_last_slug");

      if (!savedPos && !savedSlug) return;

      if (savedSlug) {
        const itemIdx = filtered.findIndex((s) => s.slug === savedSlug);
        if (itemIdx >= 0) {
          setDisplayCount((prev) => Math.max(prev, itemIdx + 20));
        }
      }

      const timer = setTimeout(() => {
        if (savedSlug) {
          const el = document.getElementById(`snack-card-${savedSlug}`);
          if (el) {
            el.scrollIntoView({ block: "center", behavior: "instant" });
            sessionStorage.removeItem("isthisvegan_scroll_pos");
            sessionStorage.removeItem("isthisvegan_last_slug");
            return;
          }
        }

        if (savedPos) {
          window.scrollTo({ top: parseInt(savedPos, 10), behavior: "instant" });
          sessionStorage.removeItem("isthisvegan_scroll_pos");
          sessionStorage.removeItem("isthisvegan_last_slug");
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [loading, snacks, filtered]);

  const filtered = useMemo(() => {
    let base = snacks;

    // 1. Preset filter bar
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
            return (
              pClass.includes("street") ||
              fType.includes("street") ||
              sType.includes("street") ||
              metadata.packaging_status === "Street-Food"
            );
          case "Savory":
            return pClass.includes("food") || fType.includes("snack");
          case "Sweets":
            return (
              fType.includes("dessert") ||
              sType.includes("sweet") ||
              sType.includes("chocolate")
            );
          default:
            return true;
        }
      });
    }

    // 2. Multi-Attribute Filters (Amazon-style)
    if (filters.status === "vegan") {
      base = base.filter((s) => s.is_vegan === true);
    } else if (filters.status === "non-vegan") {
      base = base.filter((s) => s.is_vegan === false);
    }

    if (filters.productClasses.length > 0) {
      base = base.filter((s) =>
        s.product_class && filters.productClasses.includes(s.product_class)
      );
    }

    if (filters.foodTypes.length > 0) {
      base = base.filter((s) =>
        s.food_type && filters.foodTypes.includes(s.food_type)
      );
    }

    if (filters.subTypes.length > 0) {
      base = base.filter((s) =>
        s.sub_type && filters.subTypes.includes(s.sub_type)
      );
    }

    if (filters.dietary.length > 0) {
      base = base.filter((s) => {
        const badges = parseArrayField(s.dietary_compatibility).map((b) => b.toLowerCase());
        return filters.dietary.every((d) =>
          badges.some((b) => b.includes(d.toLowerCase()))
        );
      });
    }

    if (filters.excludeAllergens.length > 0) {
      base = base.filter((s) => {
        const allergens = parseArrayField(s.allergens_list).map((a) => a.toLowerCase());
        return !filters.excludeAllergens.some((ex) =>
          allergens.some((a) => a.includes(ex.toLowerCase()))
        );
      });
    }

    if (filters.brands.length > 0) {
      base = base.filter(
        (s) => s.brand && filters.brands.includes(s.brand.trim())
      );
    }

    // 3. Search query filter
    if (debouncedQuery.trim()) {
      base = searchWithTypoTolerance(base, debouncedQuery, getSnackSearchKeys);
    }

    // 4. Enhanced Sorting Options
    const sorted = [...base];
    if (sortOption === "healthy-vegan") {
      sorted.sort((a, b) => {
        const metaA = parseJsonObjectField<ProductMetadata>(a.product_metadata, {});
        const metaB = parseJsonObjectField<ProductMetadata>(b.product_metadata, {});

        const isHealthyA = a.is_vegan && (metaA.health_tier?.startsWith("1") || metaA.health_tier?.startsWith("2"));
        const isHealthyB = b.is_vegan && (metaB.health_tier?.startsWith("1") || metaB.health_tier?.startsWith("2"));

        if (isHealthyA && !isHealthyB) return -1;
        if (!isHealthyA && isHealthyB) return 1;

        if (a.is_vegan && !b.is_vegan) return -1;
        if (!a.is_vegan && b.is_vegan) return 1;

        return a.name.localeCompare(b.name);
      });
    } else if (sortOption === "price-asc") {
      sorted.sort((a, b) => {
        const metaA = parseJsonObjectField<ProductMetadata>(a.product_metadata, {});
        const metaB = parseJsonObjectField<ProductMetadata>(b.product_metadata, {});
        const pA = (metaA.price_tier || "").length || 1;
        const pB = (metaB.price_tier || "").length || 1;
        return pA - pB;
      });
    } else if (sortOption === "price-desc") {
      sorted.sort((a, b) => {
        const metaA = parseJsonObjectField<ProductMetadata>(a.product_metadata, {});
        const metaB = parseJsonObjectField<ProductMetadata>(b.product_metadata, {});
        const pA = (metaA.price_tier || "").length || 1;
        const pB = (metaB.price_tier || "").length || 1;
        return pB - pA;
      });
    } else if (sortOption === "name-asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "brand-asc") {
      sorted.sort((a, b) => (a.brand || "").localeCompare(b.brand || ""));
    } else if (sortOption === "featured") {
      // Placeholder for Featured ranking
      sorted.sort((a, b) => {
        const isFeatA = (a as any).is_featured || false;
        const isFeatB = (b as any).is_featured || false;
        if (isFeatA && !isFeatB) return -1;
        if (!isFeatA && isFeatB) return 1;
        return 0;
      });
    }

    return sorted;
  }, [snacks, activePreset, filters, debouncedQuery, sortOption]);

  const displayedSnacks = useMemo(() => {
    return filtered.slice(0, displayCount);
  }, [filtered, displayCount]);

  const motionEase = [0.16, 1, 0.3, 1];

  const removeFilterChip = (type: keyof FilterState, val?: string) => {
    if (type === "status") {
      setFilters({ ...filters, status: "all" });
    } else if (val) {
      const arr = (filters[type] as string[]).filter((x) => x !== val);
      setFilters({ ...filters, [type]: arr });
    }
  };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.productClasses.length > 0 ||
    filters.foodTypes.length > 0 ||
    filters.subTypes.length > 0 ||
    filters.dietary.length > 0 ||
    filters.excludeAllergens.length > 0 ||
    filters.brands.length > 0;

  return (
    <div
      style={{ minHeight: "100vh" }}
      className="relative overflow-hidden bg-[#f8f7f4] text-[#1c211e]"
    >
      <Helmet>
        <title>Is Your Food Plant-Based or Not? | IsThisVegan.in</title>
        <meta
          name="description"
          content="India's leading plant-based food directory. Search 3,000+ snacks, packaged foods, and dishes with instant ingredient verification and allergen alerts."
        />
        <link rel="canonical" href="https://www.isthisvegan.in/" />
        <meta property="og:title" content="Is Your Food Plant-Based or Not? | IsThisVegan.in" />
        <meta
          property="og:description"
          content="Instant ingredient verification, allergen safety, Jain compatibility badges, and street food ordering hacks."
        />
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

        {/* Sticky Search Bar & Multi-Filter Controls Bar */}
        <div className="sticky top-16 z-40 border-b border-[#e3e7e2] bg-[#f8f7f4]/95 py-4 backdrop-blur-md shadow-2xs mb-6">
          <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3">
              {/* Top Row: Search Input + Filter Drawer Button + Sort Dropdown */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
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

                {/* Filter Drawer Component */}
                <FilterDrawer
                  filters={filters}
                  onFilterChange={setFilters}
                  availableBrands={availableBrands}
                  totalResultsCount={filtered.length}
                />

                {/* Enhanced Sort Dropdown */}
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="h-12 px-3 sm:px-4 shrink-0 rounded-xl border-[#e3e7e2] bg-white text-xs font-semibold text-[#1c211e] shadow-2xs">
                    <ArrowUpDown size={14} className="mr-1 text-[#354338] shrink-0" />
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#e3e7e2]">
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="healthy-vegan">Healthy & Vegan First</SelectItem>
                    <SelectItem value="price-asc">Price: Low - High</SelectItem>
                    <SelectItem value="price-desc">Price: High - Low</SelectItem>
                    <SelectItem value="name-asc">Name: A - Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z - A</SelectItem>
                    <SelectItem value="brand-asc">Brand: A - Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preset Filters Row */}
              <div className="overflow-x-auto pb-0.5 no-scrollbar">
                <div className="flex min-w-max items-center gap-2">
                  {PRESET_FILTERS.map((filter) => (
                    <Badge
                      key={filter.key}
                      variant="outline"
                      onClick={() => setActivePreset(filter.key)}
                      className={`cursor-pointer rounded-full px-4 py-1.5 font-sans-ui text-xs font-semibold tracking-wide transition-all ${activePreset === filter.key
                        ? "border-[#354338] bg-[#354338] text-white shadow-xs"
                        : "border-[#e3e7e2] bg-white text-[#3e4a40] hover:bg-[#e2e7e0] hover:border-[#354338]/40 shadow-2xs"
                        }`}
                    >
                      {filter.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Active Filter Chips Bar */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="font-mono-data text-[10px] uppercase font-bold text-[#5a655c] mr-1">
                    Active Filters:
                  </span>
                  {filters.status !== "all" && (
                    <Badge
                      variant="secondary"
                      className="bg-[#e6ece7] text-[#2c3d31] border border-[#b2c2b5] px-2.5 py-0.5 text-[11px] font-medium gap-1 cursor-pointer hover:bg-[#d8e4da]"
                      onClick={() => removeFilterChip("status")}
                    >
                      Status: {filters.status}
                      <X size={12} />
                    </Badge>
                  )}
                  {filters.brands.map((b) => (
                    <Badge
                      key={b}
                      variant="secondary"
                      className="bg-[#e6ece7] text-[#2c3d31] border border-[#b2c2b5] px-2.5 py-0.5 text-[11px] font-medium gap-1 cursor-pointer hover:bg-[#d8e4da]"
                      onClick={() => removeFilterChip("brands", b)}
                    >
                      Brand: {b}
                      <X size={12} />
                    </Badge>
                  ))}
                  {filters.dietary.map((d) => (
                    <Badge
                      key={d}
                      variant="secondary"
                      className="bg-[#e6ece7] text-[#2c3d31] border border-[#b2c2b5] px-2.5 py-0.5 text-[11px] font-medium gap-1 cursor-pointer hover:bg-[#d8e4da]"
                      onClick={() => removeFilterChip("dietary", d)}
                    >
                      {d}
                      <X size={12} />
                    </Badge>
                  ))}
                  {filters.subTypes.map((st) => (
                    <Badge
                      key={st}
                      variant="secondary"
                      className="bg-[#e6ece7] text-[#2c3d31] border border-[#b2c2b5] px-2.5 py-0.5 text-[11px] font-medium gap-1 cursor-pointer hover:bg-[#d8e4da]"
                      onClick={() => removeFilterChip("subTypes", st)}
                    >
                      Type: {st}
                      <X size={12} />
                    </Badge>
                  ))}
                  {filters.productClasses.map((pc) => (
                    <Badge
                      key={pc}
                      variant="secondary"
                      className="bg-[#e6ece7] text-[#2c3d31] border border-[#b2c2b5] px-2.5 py-0.5 text-[11px] font-medium gap-1 cursor-pointer hover:bg-[#d8e4da]"
                      onClick={() => removeFilterChip("productClasses", pc)}
                    >
                      Class: {pc}
                      <X size={12} />
                    </Badge>
                  ))}
                  {filters.foodTypes.map((ft) => (
                    <Badge
                      key={ft}
                      variant="secondary"
                      className="bg-[#e6ece7] text-[#2c3d31] border border-[#b2c2b5] px-2.5 py-0.5 text-[11px] font-medium gap-1 cursor-pointer hover:bg-[#d8e4da]"
                      onClick={() => removeFilterChip("foodTypes", ft)}
                    >
                      Food: {ft}
                      <X size={12} />
                    </Badge>
                  ))}
                  {filters.excludeAllergens.map((alg) => (
                    <Badge
                      key={alg}
                      variant="secondary"
                      className="bg-[#f9eee9] text-[#7d3c34] border border-[#e5c5bd] px-2.5 py-0.5 text-[11px] font-medium gap-1 cursor-pointer hover:bg-[#f3ded6]"
                      onClick={() => removeFilterChip("excludeAllergens", alg)}
                    >
                      No {alg}
                      <X size={12} />
                    </Badge>
                  ))}
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="text-[11px] font-semibold text-[#5a655c] underline hover:text-[#1c211e] ml-2"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
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
                    Try adjusting your filter options or clearing search terms.
                  </p>

                  {hasActiveFilters && (
                    <Button
                      onClick={() => setFilters(DEFAULT_FILTERS)}
                      className="mt-4 rounded-full bg-[#354338] px-5 py-2 font-sans-ui text-xs text-white"
                    >
                      Reset All Filters
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`${debouncedQuery}-${activePreset}-${sortOption}`}
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
                  {(activePreset !== "All" || hasActiveFilters) && (
                    <button
                      onClick={() => {
                        setActivePreset("All");
                        setFilters(DEFAULT_FILTERS);
                      }}
                      className="underline hover:text-[#1c211e]"
                    >
                      Reset All Filters
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

