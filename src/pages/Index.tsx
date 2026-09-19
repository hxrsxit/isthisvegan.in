import { useState, useMemo, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, ArrowUpDown } from "lucide-react";
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
  const [activePreset, setActivePreset] = useState<string>(
    searchParams.get("preset") || "All"
  );
  const [displayCount, setDisplayCount] = useState(() => {
    const savedCount = sessionStorage.getItem("isthisvegan_display_count");
    if (savedCount) {
      return Math.max(30, parseInt(savedCount, 10));
    }
    return 30;
  });
  const [sortOption, setSortOption] = useState<string>(searchParams.get("sort") || "featured");

  const [filters, setFilters] = useState<FilterState>(() => {
    const parseParamArray = (paramName: string): string[] => {
      const val = searchParams.get(paramName);
      if (!val) return [];
      return val.split(",").map((s) => decodeURIComponent(s.trim())).filter(Boolean);
    };

    return {
      status: (searchParams.get("status") as any) || "all",
      productClasses: parseParamArray("product_class"),
      foodTypes: parseParamArray("food_type"),
      subTypes: parseParamArray("sub_type"),
      dietary: parseParamArray("dietary"),
      excludeAllergens: parseParamArray("allergen"),
      brands: parseParamArray("brand"),
    };
  });

  const debouncedQuery = useDebounce(query, 300);

  // ── Scroll restoration state ──────────────────────────────────────────────
  // We read sessionStorage ONCE on mount so refs are stable across re-renders.
  const restorationRef = useRef<{
    slug: string | null;
    scrollY: number;
    displayCount: number;
    phase: "idle" | "expanding" | "scrolling" | "done";
  }>({
    slug: sessionStorage.getItem("isthisvegan_last_slug"),
    scrollY: parseInt(sessionStorage.getItem("isthisvegan_scroll_pos") || "0", 10),
    displayCount: parseInt(sessionStorage.getItem("isthisvegan_display_count") || "30", 10),
    phase: sessionStorage.getItem("isthisvegan_last_slug") || sessionStorage.getItem("isthisvegan_scroll_pos")
      ? "expanding"
      : "idle",
  });

  // Tell the browser NOT to auto-restore scroll — we handle it ourselves.
  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);

  // Sync state with URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (sortOption !== "featured") params.set("sort", sortOption);
    if (activePreset !== "All") params.set("preset", activePreset);
    if (filters.status !== "all") params.set("status", filters.status);

    if (filters.brands.length > 0) params.set("brand", filters.brands.join(","));
    if (filters.dietary.length > 0) params.set("dietary", filters.dietary.join(","));
    if (filters.subTypes.length > 0) params.set("sub_type", filters.subTypes.join(","));
    if (filters.foodTypes.length > 0) params.set("food_type", filters.foodTypes.join(","));
    if (filters.productClasses.length > 0) params.set("product_class", filters.productClasses.join(","));
    if (filters.excludeAllergens.length > 0) params.set("allergen", filters.excludeAllergens.join(","));

    setSearchParams(params, { replace: true });
  }, [query, sortOption, activePreset, filters, setSearchParams]);

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
    // Only reset displayCount when a NEW search/filter is applied (not on back-navigation).
    if (restorationRef.current.phase === "idle") {
      setDisplayCount(30);
    }
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

  // ── Scroll Restoration: single self-retrying effect ─────────────────────
  // Deps include displayedSnacks so React re-runs this after every displayCount
  // expansion, giving us a reliable "wait until DOM is ready then scroll" loop.
  useEffect(() => {
    const r = restorationRef.current;
    if (r.phase === "idle" || r.phase === "done") return;
    if (loading || filtered.length === 0) return;

    // ── Step 1: Compute how many items we need rendered ──────────────────
    const neededCount = (() => {
      // If we saved an explicit count, use it (handles mid-page items)
      if (r.displayCount > 30) return r.displayCount;
      // Otherwise compute from slug position in the filtered list
      if (r.slug) {
        const idx = filtered.findIndex(s => s.slug === r.slug);
        return idx >= 0 ? idx + 5 : 30;
      }
      return 30;
    })();

    // ── Step 2: If not enough items are rendered yet, expand and wait ─────
    if (displayCount < neededCount) {
      setDisplayCount(neededCount);
      return; // Effect will re-run once displayedSnacks updates
    }

    // ── Step 3: Try to scroll to the target card ──────────────────────────
    if (r.slug) {
      const el = document.getElementById(`snack-card-${r.slug}`);
      if (!el) {
        // Card should be rendered but isn't in DOM yet — bump count and retry
        setDisplayCount(prev => prev + 10);
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.height === 0) return; // Exists but not painted yet — retry next frame

      const absoluteTop = window.scrollY + rect.top - Math.round(window.innerHeight / 3);
      window.scrollTo({ top: Math.max(0, absoluteTop), behavior: "instant" });
    } else if (r.scrollY > 0) {
      window.scrollTo({ top: r.scrollY, behavior: "instant" });
    }

    // ── Done: clean up ────────────────────────────────────────────────────
    restorationRef.current = { ...r, phase: "done" };
    sessionStorage.removeItem("isthisvegan_scroll_pos");
    sessionStorage.removeItem("isthisvegan_last_slug");
    sessionStorage.removeItem("isthisvegan_display_count");
    sessionStorage.removeItem("isthisvegan_last_url");
  }, [loading, filtered, displayCount, displayedSnacks]);

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
    <div style={{ minHeight: "100vh", backgroundColor: "var(--mist)", color: "var(--ink)" }}>
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
        <meta name="theme-color" content="#01472E" />
      </Helmet>

      {/* Paper grain overlay */}
      <div className="noise-overlay pointer-events-none fixed inset-0 z-[1]" aria-hidden />

      <div className="relative z-10">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section
          className="hero-fade"
          style={{
            borderBottom: "1px solid var(--hairline)",
            paddingTop: "clamp(40px, 8vw, 80px)",
            paddingBottom: "clamp(32px, 6vw, 64px)",
          }}
        >
          <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "clamp(24px, 5vw, 64px)",
                alignItems: "center",
              }}
            >
              {/* Left Column: Copy & Search */}
              <div>
                <h1 style={{ color: "var(--ink)", maxWidth: "18ch", marginBottom: "var(--s-3)" }}>
                  Is your food plant-based or not?
                </h1>
                <p style={{ color: "var(--stone)", maxWidth: "52ch", marginBottom: "var(--s-4)", fontSize: "var(--fs-body)", lineHeight: 1.6 }}>
                  Instant ingredient checks, allergen safety, Jain compatibility, and street food ordering hacks — for Indian snacks.
                </p>

                {/* Search input */}
                <div style={{ position: "relative", maxWidth: "640px" }}>
                  <Search
                    size={18}
                    strokeWidth={1.75}
                    style={{
                      position: "absolute", left: "16px",
                      top: "50%", transform: "translateY(-50%)",
                      color: "var(--moss)", pointerEvents: "none",
                    }}
                    aria-hidden="true"
                  />
                  <Input
                    type="search"
                    placeholder="Search brand, dish, 'jain snacks', 'palm oil free chips'..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="earthy-input"
                    style={{
                      height: "56px", width: "100%",
                      paddingLeft: "48px", paddingRight: query ? "48px" : "16px",
                      fontSize: "1rem",
                    }}
                    aria-label="Search products"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      style={{
                        position: "absolute", right: "12px",
                        top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none",
                        color: "var(--stone)", cursor: "pointer",
                        padding: "4px", borderRadius: "50%",
                        minWidth: "32px", minHeight: "32px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                      aria-label="Clear search"
                    >
                      <X size={16} strokeWidth={1.5} />
                    </button>
                  )}
                </div>

                {/* Item count line — small muted, sentence case */}
                {!loading && (
                  <p style={{
                    marginTop: "var(--s-1)",
                    fontSize: "var(--fs-small)",
                    color: "var(--stone)",
                  }}>
                    Showing {displayedSnacks.length} of {filtered.length} products
                  </p>
                )}
              </div>

              {/* Right Column: Hero Photo */}
              <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <img
                  src="/images/hero.jpg"
                  alt="Assorted Indian snacks and dishes layout"
                  loading="eager"
                  width="560"
                  height="373"
                  style={{
                    width: "100%",
                    maxHeight: "420px",
                    objectFit: "cover",
                    borderRadius: "var(--r-lg)",
                    filter: "saturate(.85) contrast(.96)",
                    border: "1px solid var(--hairline)",
                  }}
            </div>

            {/* Item count line — small muted, sentence case */}
            {!loading && (
              <p style={{
                marginTop: "var(--s-1)",
                fontSize: "var(--fs-small)",
                color: "var(--stone)",
                fontWeight: 400,
              }}>
                {filtered.length === snacks.length
                  ? `${snacks.length.toLocaleString()} products verified`
                  : `${filtered.length.toLocaleString()} of ${snacks.length.toLocaleString()} products`}
              </p>
            )}
          </div>
        </section>

        {/* ── Sticky filter/sort controls ──────────────────────── */}
        <div
          className="sticky z-40"
          style={{
            top: "56px",
            borderBottom: "1px solid var(--hairline)",
            backgroundColor: "color-mix(in srgb, var(--mist) 95%, transparent)",
            backdropFilter: "blur(8px)",
            paddingBlock: "var(--s-2)",
            marginBottom: "var(--s-3)",
          }}
        >
          <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-2)" }}>

              {/* Controls row: Filter + Sort buttons (search is in hero) */}
              <div style={{ display: "flex", alignItems: "center", gap: "var(--s-1)", flexWrap: "wrap" }}>
                {/* Filter Drawer */}
                <FilterDrawer
                  filters={filters}
                  onFilterChange={setFilters}
                  availableBrands={availableBrands}
                  totalResultsCount={filtered.length}
                  triggerClassName=""
                />

                {/* Sort dropdown */}
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger
                    style={{
                      height: "40px",
                      minWidth: "130px",
                      border: "1px solid var(--hairline)",
                      borderRadius: "var(--r-sm)",
                      backgroundColor: "var(--paper)",
                      color: "var(--ink)",
                      fontSize: "var(--fs-small)",
                      fontWeight: 500,
                      paddingInline: "12px",
                      gap: "6px",
                    }}
                  >
                    <ArrowUpDown size={13} style={{ color: "var(--moss)", flexShrink: 0 }} />
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "var(--paper)", borderColor: "var(--hairline)", fontSize: "var(--fs-small)" }}>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="healthy-vegan">Healthy &amp; vegan first</SelectItem>
                    <SelectItem value="price-asc">Price: low to high</SelectItem>
                    <SelectItem value="price-desc">Price: high to low</SelectItem>
                    <SelectItem value="name-asc">Name: A – Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z – A</SelectItem>
                    <SelectItem value="brand-asc">Brand: A – Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preset filter chips row */}
              <div className="overflow-x-auto no-scrollbar" style={{ paddingBottom: "2px" }}>
                <div style={{ display: "flex", minWidth: "max-content", gap: "var(--s-1)", alignItems: "center" }}>
                  {PRESET_FILTERS.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setActivePreset(filter.key)}
                      className={`preset-chip${activePreset === filter.key ? " preset-chip--active" : ""}`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active filter chips */}
              {hasActiveFilters && (
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "var(--fs-small)", color: "var(--stone)", fontWeight: 500, marginRight: "4px" }}>
                    Active filters:
                  </span>
                  {filters.status !== "all" && (
                    <button className="filter-chip" onClick={() => removeFilterChip("status")}>
                      Status: {filters.status} <X size={11} />
                    </button>
                  )}
                  {filters.brands.map((b) => (
                    <button key={b} className="filter-chip" onClick={() => removeFilterChip("brands", b)}>
                      Brand: {b} <X size={11} />
                    </button>
                  ))}
                  {filters.dietary.map((d) => (
                    <button key={d} className="filter-chip" onClick={() => removeFilterChip("dietary", d)}>
                      {d} <X size={11} />
                    </button>
                  ))}
                  {filters.subTypes.map((st) => (
                    <button key={st} className="filter-chip" onClick={() => removeFilterChip("subTypes", st)}>
                      Type: {st} <X size={11} />
                    </button>
                  ))}
                  {filters.productClasses.map((pc) => (
                    <button key={pc} className="filter-chip" onClick={() => removeFilterChip("productClasses", pc)}>
                      Class: {pc} <X size={11} />
                    </button>
                  ))}
                  {filters.foodTypes.map((ft) => (
                    <button key={ft} className="filter-chip" onClick={() => removeFilterChip("foodTypes", ft)}>
                      Food: {ft} <X size={11} />
                    </button>
                  ))}
                  {filters.excludeAllergens.map((alg) => (
                    <button
                      key={alg}
                      className="filter-chip"
                      style={{ backgroundColor: "var(--not-vegan-bg)", color: "var(--not-vegan-fg)", borderColor: "var(--hairline)" }}
                      onClick={() => removeFilterChip("excludeAllergens", alg)}
                    >
                      No {alg} <X size={11} />
                    </button>
                  ))}
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    style={{ fontSize: "var(--fs-small)", color: "var(--forest)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px", marginLeft: "4px" }}
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Product list ─────────────────────────────────────── */}
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)", paddingBottom: "var(--s-12)" }}>
          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingAnimation key="loadingState" />
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ padding: "64px 0", textAlign: "center" }}
              >
                <p style={{ color: "var(--ink)", fontSize: "1.1rem" }}>Failed to load products from database.</p>
                <p style={{ color: "var(--stone)", fontSize: "var(--fs-small)", marginTop: "8px" }}>{error}</p>
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ padding: "64px 0", textAlign: "center" }}
              >
                <div className="earthy-card" style={{ maxWidth: "420px", margin: "0 auto", padding: "var(--s-6)" }}>
                  <p style={{ fontSize: "1.25rem", fontWeight: 400, color: "var(--ink)", marginBottom: "var(--s-1)" }}>No matching products</p>
                  <p style={{ fontSize: "var(--fs-small)", color: "var(--stone)" }}>Try adjusting filters or clearing search terms.</p>
                  {hasActiveFilters && (
                    <Button
                      onClick={() => setFilters(DEFAULT_FILTERS)}
                      style={{ marginTop: "var(--s-3)", backgroundColor: "var(--forest)", color: "var(--mist)", borderRadius: "var(--r-pill)", fontWeight: 500, minHeight: "44px" }}
                    >
                      Reset all filters
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <div>
                {/* Result meta line */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  fontSize: "var(--fs-small)", color: "var(--stone)",
                  paddingBlock: "var(--s-2)",
                  borderBottom: "1px solid var(--hairline)",
                  marginBottom: "0",
                }}>
                  <span>Showing {displayedSnacks.length} of {filtered.length} products</span>
                  {(activePreset !== "All" || hasActiveFilters) && (
                    <button
                      onClick={() => { setActivePreset("All"); setFilters(DEFAULT_FILTERS); }}
                      style={{ color: "var(--forest)", background: "none", border: "none", cursor: "pointer", fontSize: "var(--fs-small)", textDecoration: "underline", textUnderlineOffset: "3px" }}
                    >
                      Reset filters
                    </button>
                  )}
                </div>

                {/* Directory list */}
                <div>
                  {displayedSnacks.map((snack, i) => (
                    <SnackCard key={snack.slug} snack={snack} index={i} />
                  ))}
                </div>

                {/* Infinite scroll sentinel */}
                {displayCount < filtered.length && (
                  <div ref={sentinelRef} style={{ width: "100%", marginTop: "var(--s-8)" }}>
                    <LoadingAnimation message="Loading more products..." className="py-6" />
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HomePage;


