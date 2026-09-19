import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Leaf,
  TriangleAlert,
  ExternalLink,
  ShieldCheck,
  ChefHat,
  ThumbsUp,
  Flag,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  Snack,
  parseArrayField,
  parseJsonObjectField,
  ProductMetadata,
  UserPollStats,
} from "@/lib/snacks-data";
import { supabase } from "@/supabaseClient";
import { motion } from "framer-motion";
import { landingTheme } from "@/lib/theme";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { Helmet } from "react-helmet-async";
import SnackCard from "@/components/SnackCard";

const FLAG_REASONS = [
  "Contains Milk Solids / Dairy",
  "Vendor uses Ghee or Butter",
  "Flavoring sourced from Dairy",
  "Contains Honey / Carmine / E-numbers",
  "Other ingredient change",
];

const SnackDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [snack, setSnack] = useState<Snack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Smart Alternatives for non-vegan items
  const [alternatives, setAlternatives] = useState<Snack[]>([]);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);

  // Community state
  const [pollStats, setPollStats] = useState<UserPollStats>({
    upvotes_as_vegan: 0,
    reports_as_non_vegan: 0,
    total_comments: 0,
  });
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [selectedFlagReason, setSelectedFlagReason] = useState(FLAG_REASONS[0]);
  const [flagDetails, setFlagDetails] = useState("");
  const [flagSubmitted, setFlagSubmitted] = useState(false);

  // Comments
  const [comments, setComments] = useState<
    Array<{ author: string; text: string; date: string }>
  >([]);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    if (!slug) return;

    const fetchSnack = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from<Snack>("isthisvegan_db3")
        .select("*")
        .eq("slug", slug)
        .limit(1);

      if (error) {
        setError(error.message);
        setSnack(null);
      } else if (data && data.length > 0) {
        const item = data[0];
        setSnack(item);

        const initialStats = parseJsonObjectField<UserPollStats>(
          item.user_poll_stats,
          { upvotes_as_vegan: 0, reports_as_non_vegan: 0, total_comments: 0 }
        );
        setPollStats(initialStats);

        // Fetch smart alternatives if item is non-vegan
        if (!item.is_vegan) {
          fetchVeganAlternatives(item);
        }
      } else {
        setSnack(null);
      }

      setLoading(false);
    };

    fetchSnack();
  }, [slug]);

  const fetchVeganAlternatives = async (currentSnack: Snack) => {
    setLoadingAlternatives(true);
    const subType = currentSnack.sub_type;
    const foodType = currentSnack.food_type;
    const productClass = currentSnack.product_class;

    let matched: Snack[] = [];

    if (subType) {
      const { data: subData } = await supabase
        .from<Snack>("isthisvegan_db3")
        .select("*")
        .eq("is_vegan", true)
        .eq("sub_type", subType)
        .neq("slug", currentSnack.slug)
        .limit(4);

      if (subData && subData.length > 0) {
        matched = subData;
      }
    }

    if (matched.length === 0 && foodType) {
      const { data: foodData } = await supabase
        .from<Snack>("isthisvegan_db3")
        .select("*")
        .eq("is_vegan", true)
        .eq("food_type", foodType)
        .neq("slug", currentSnack.slug)
        .limit(4);

      if (foodData && foodData.length > 0) {
        matched = foodData;
      }
    }

    if (matched.length === 0 && productClass) {
      const { data: classData } = await supabase
        .from<Snack>("isthisvegan_db3")
        .select("*")
        .eq("is_vegan", true)
        .eq("product_class", productClass)
        .neq("slug", currentSnack.slug)
        .limit(4);

      if (classData && classData.length > 0) {
        matched = classData;
      }
    }

    if (matched.length === 0) {
      const { data: fallbackData } = await supabase
        .from<Snack>("isthisvegan_db3")
        .select("*")
        .eq("is_vegan", true)
        .neq("slug", currentSnack.slug)
        .limit(4);
      matched = fallbackData || [];
    }

    setAlternatives(matched);
    setLoadingAlternatives(false);
  };

  const handleUpvote = () => {
    if (hasUpvoted) return;
    setHasUpvoted(true);
    setPollStats((prev) => ({
      ...prev,
      upvotes_as_vegan: prev.upvotes_as_vegan + 1,
    }));
  };

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFlagSubmitted(true);
    setPollStats((prev) => ({
      ...prev,
      reports_as_non_vegan: prev.reports_as_non_vegan + 1,
    }));
    setTimeout(() => {
      setShowFlagModal(false);
      setFlagSubmitted(false);
      setFlagDetails("");
    }, 1800);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const entry = {
      author: authorName.trim() || "Community Member",
      text: newComment.trim(),
      date: new Date().toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    setComments((prev) => [entry, ...prev]);
    setPollStats((prev) => ({
      ...prev,
      total_comments: prev.total_comments + 1,
    }));
    setNewComment("");
  };

  if (loading) {
    return (
      <div
        style={landingTheme}
        className="flex min-h-screen items-center justify-center bg-[#f8f7f4] text-[#1c211e]"
      >
        <LoadingAnimation message="Fetching product details..." />
      </div>
    );
  }

  if (error || !snack) {
    return (
      <div
        style={landingTheme}
        className="relative flex min-h-screen flex-col items-center justify-center bg-[#f8f7f4] text-[#1c211e] px-4 text-center"
      >
        <div className="relative z-10">
          <p className="font-serif text-2xl font-normal mb-2 text-[#1c211e]">
            {error ? "Error Loading Data" : "Product Not Found"}
          </p>
          {error && <p className="muted-label text-xs text-[#5a655c] mt-2 max-w-md">{error}</p>}
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-[#e3e7e2] bg-white px-4 py-2 text-xs font-medium text-[#1c211e] shadow-xs hover:bg-[#f0f3ef]"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const dietaryBadges = parseArrayField(snack.dietary_compatibility);
  const allergens = parseArrayField(snack.allergens_list);
  const hiddenIngredients = parseArrayField(snack.hidden_animal_ingredients);
  const metadata = parseJsonObjectField<ProductMetadata>(snack.product_metadata, {});
  const descriptionText = snack.enhanced_description || snack.detailed_analysis;

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    const savedUrl = sessionStorage.getItem("isthisvegan_last_url");
    if (savedUrl) {
      navigate(savedUrl);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const pageTitle = `${snack.name} (${snack.brand || "Indian Food"}) | Is This Vegan?`;
  const pageDescription = snack.verdict_summary
    ? `${snack.name} by ${snack.brand} • ${snack.is_vegan ? "Plant-Based Verdict" : "Not Vegan Alert"}. ${snack.verdict_summary}`
    : `Is ${snack.name} by ${snack.brand} vegan? Ingredient verification on IsThisVegan.in`;
  const pageUrl = `https://www.isthisvegan.in/snack/${snack.slug}`;

  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "var(--mist)", color: "var(--ink)" }}
    >
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://www.isthisvegan.in/" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
      </Helmet>

      <div className="noise-overlay pointer-events-none fixed inset-0 z-[1]" aria-hidden />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", zIndex: 10, maxWidth: "720px", margin: "0 auto", padding: "clamp(32px,6vw,64px) var(--gutter)" }}
      >
        {/* Back link — plain text, no pill */}
        <button
          onClick={handleBack}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "none", border: "none", cursor: "pointer",
            color: "var(--forest)", fontSize: "var(--fs-small)", fontWeight: 500,
            marginBottom: "var(--s-6)", padding: 0,
            textDecoration: "underline", textUnderlineOffset: "3px",
          }}
        >
          <ArrowLeft size={15} strokeWidth={1.75} />
          Back to search
        </button>

        {/* Verdict banner */}
        <div
          style={{
            marginBottom: "var(--s-6)",
            borderRadius: "var(--r-md)",
            border: "1px solid var(--hairline)",
            padding: "var(--s-6) var(--s-4)",
            backgroundColor: snack.is_vegan ? "var(--vegan-bg)" : "var(--not-vegan-bg)",
            color: snack.is_vegan ? "var(--vegan-fg)" : "var(--not-vegan-fg)",
          }}
        >
          {/* Verdict word — hero scale */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--s-2)", marginBottom: "var(--s-2)" }}>
            {snack.is_vegan ? (
              <Leaf size={32} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <TriangleAlert size={32} strokeWidth={1.75} aria-hidden="true" />
            )}
            <span style={{ fontSize: "var(--fs-hero)", fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 0.98 }}>
              {snack.is_vegan ? "Vegan" : "Not vegan"}
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font)", fontWeight: 400, fontSize: "clamp(1.25rem, 3vw, 1.75rem)", lineHeight: 1.2, color: "var(--ink)", marginBottom: "var(--s-1)" }}>
            {snack.name}
          </h1>
          <p style={{ fontSize: "var(--fs-small)", color: "var(--stone)", display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {snack.brand && (
              <Link
                to={`/?brand=${encodeURIComponent(snack.brand)}`}
                style={{ color: "var(--forest)", fontWeight: 500 }}
                title={`See all products by ${snack.brand}`}
              >
                {snack.brand}
              </Link>
            )}
            {snack.sub_type && (
              <>
                <span>·</span>
                <Link
                  to={`/?sub_type=${encodeURIComponent(snack.sub_type)}`}
                  style={{ color: "var(--stone)" }}
                  title={`See all products in ${snack.sub_type}`}
                >
                  {snack.sub_type}
                </Link>
              </>
            )}
          </p>

          {/* Confidence + verified date */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-2)", marginTop: "var(--s-3)", alignItems: "center" }}>
            {snack.is_vegan && metadata.vegan_confidence_score && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "var(--fs-small)", fontWeight: 500, color: "var(--vegan-fg)" }}>
                <ShieldCheck size={14} aria-hidden="true" />
                Confidence: {metadata.vegan_confidence_score}/5
              </span>
            )}
            {snack.last_verified_date && (
              <span style={{ fontSize: "var(--fs-small)", color: "var(--stone)" }}>
                Verified: {snack.last_verified_date}
              </span>
            )}
          </div>
        </div>

        {/* Verdict summary */}
        {snack.verdict_summary && (
          <div className="earthy-card" style={{ marginBottom: "var(--s-6)", padding: "var(--s-4) var(--s-4)" }}>
            <p className="muted-label" style={{ marginBottom: "var(--s-1)" }}>Verdict summary</p>
            <p className="font-serif" style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", lineHeight: 1.5, color: "var(--ink)" }}>
              {snack.verdict_summary}
            </p>
          </div>
        )}

        {/* Hidden animal ingredients alert */}
        {!snack.is_vegan && hiddenIngredients.length > 0 && (
          <div style={{
            marginBottom: "var(--s-6)", display: "flex", alignItems: "flex-start", gap: "var(--s-2)",
            borderRadius: "var(--r-md)", border: "1px solid var(--hairline)",
            backgroundColor: "var(--not-vegan-bg)", padding: "var(--s-3)",
          }}>
            <TriangleAlert size={20} style={{ color: "var(--not-vegan-fg)", flexShrink: 0, marginTop: "2px" }} aria-hidden="true" />
            <div>
              <p className="muted-label" style={{ color: "var(--not-vegan-fg)", marginBottom: "4px" }}>Hidden animal ingredients detected</p>
              <p style={{ fontSize: "var(--fs-small)", color: "var(--ink)", fontWeight: 500 }}>
                {hiddenIngredients.join(", ")}
              </p>
            </div>
          </div>
        )}

        {/* Ingredient analysis — Fraunces accent (one per page) */}
        {descriptionText && (
          <div className="earthy-card" style={{ marginBottom: "var(--s-8)", padding: "var(--s-4) var(--s-4)" }}>
            <p className="muted-label" style={{ marginBottom: "var(--s-1)" }}>Ingredient analysis &amp; formulation insights</p>
            <p style={{ fontSize: "var(--fs-body)", lineHeight: 1.65, color: "var(--ink)" }}>
              {descriptionText}
            </p>
          </div>
        )}

        {/* DIY Vegan Hack / Ordering Tip */}
        {snack.diy_vegan_recipe_or_hack && (
          <div style={{ marginBottom: "var(--s-6)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--hairline)", backgroundColor: "var(--vegan-bg)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--forest)", fontSize: "var(--fs-small)", fontWeight: 500, marginBottom: "var(--s-1)" }}>
              <ChefHat size={16} style={{ color: "var(--forest)" }} />
              <span>How to veganise / street ordering hack</span>
            </div>
            <p style={{ fontSize: "var(--fs-body)", color: "var(--ink)", lineHeight: 1.6 }}>
              {snack.diy_vegan_recipe_or_hack}
            </p>
          </div>
        )}

        {/* Badges Grid */}
        <div style={{ marginBottom: "var(--s-6)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--s-3)" }}>
          {/* Dietary Compatibility */}
          <div className="earthy-card" style={{ padding: "var(--s-4)" }}>
            <p className="muted-label" style={{ marginBottom: "var(--s-2)" }}>Dietary compatibility</p>
            {dietaryBadges.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {dietaryBadges.map((badge) => (
                  <Link
                    key={badge}
                    to={`/?dietary=${encodeURIComponent(badge)}`}
                    className="preset-chip"
                    style={{ fontSize: "var(--fs-small)", minHeight: "32px", padding: "3px 12px" }}
                    title={`See all ${badge} items`}
                  >
                    <CheckCircle2 size={12} style={{ color: "var(--forest)" }} />
                    {badge}
                  </Link>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "var(--fs-small)", color: "var(--stone)" }}>
                No specific dietary badges tagged.
              </p>
            )}
          </div>

          {/* Allergens Present */}
          <div className="earthy-card" style={{ padding: "var(--s-4)" }}>
            <p className="muted-label" style={{ marginBottom: "var(--s-2)" }}>Allergens present</p>
            {allergens.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {allergens.map((allergen) => (
                  <Link
                    key={allergen}
                    to={`/?allergen=${encodeURIComponent(allergen)}`}
                    className="preset-chip"
                    style={{ fontSize: "var(--fs-small)", minHeight: "32px", padding: "3px 12px" }}
                    title={`See products without ${allergen}`}
                  >
                    <AlertCircle size={12} style={{ color: "var(--not-vegan-fg)" }} />
                    {allergen}
                  </Link>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "var(--fs-small)", color: "var(--vegan-fg)", fontWeight: 500 }}>
                Confirmed allergen-free / zero tracked allergens.
              </p>
            )}
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="earthy-card" style={{ marginBottom: "var(--s-6)", padding: "var(--s-4)" }}>
          <p className="muted-label" style={{ marginBottom: "var(--s-3)" }}>Product specifications &amp; attributes</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "var(--s-2)", fontSize: "var(--fs-small)" }}>
            {snack.product_class && (
              <Link
                to={`/?product_class=${encodeURIComponent(snack.product_class)}`}
                style={{ padding: "var(--s-2)", borderRadius: "var(--r-sm)", backgroundColor: "var(--mist)", border: "1px solid var(--hairline)", display: "block" }}
              >
                <span className="muted-label" style={{ display: "block", marginBottom: "2px", fontSize: "11px" }}>Class</span>
                <span style={{ fontWeight: 500, color: "var(--ink)" }}>{snack.product_class}</span>
              </Link>
            )}
            {snack.food_type && (
              <Link
                to={`/?food_type=${encodeURIComponent(snack.food_type)}`}
                style={{ padding: "var(--s-2)", borderRadius: "var(--r-sm)", backgroundColor: "var(--mist)", border: "1px solid var(--hairline)", display: "block" }}
              >
                <span className="muted-label" style={{ display: "block", marginBottom: "2px", fontSize: "11px" }}>Food type</span>
                <span style={{ fontWeight: 500, color: "var(--ink)" }}>{snack.food_type}</span>
              </Link>
            )}
            {snack.sub_type && (
              <Link
                to={`/?sub_type=${encodeURIComponent(snack.sub_type)}`}
                style={{ padding: "var(--s-2)", borderRadius: "var(--r-sm)", backgroundColor: "var(--mist)", border: "1px solid var(--hairline)", display: "block" }}
              >
                <span className="muted-label" style={{ display: "block", marginBottom: "2px", fontSize: "11px" }}>Sub type</span>
                <span style={{ fontWeight: 500, color: "var(--ink)" }}>{snack.sub_type}</span>
              </Link>
            )}
            {metadata.regional_cuisine && (
              <div style={{ padding: "var(--s-2)", borderRadius: "var(--r-sm)", backgroundColor: "var(--mist)", border: "1px solid var(--hairline)" }}>
                <span className="muted-label" style={{ display: "block", marginBottom: "2px", fontSize: "11px" }}>Cuisine</span>
                <span style={{ fontWeight: 500, color: "var(--ink)" }}>{metadata.regional_cuisine}</span>
              </div>
            )}
            {metadata.packaging_status && (
              <div style={{ padding: "var(--s-2)", borderRadius: "var(--r-sm)", backgroundColor: "var(--mist)", border: "1px solid var(--hairline)" }}>
                <span className="muted-label" style={{ display: "block", marginBottom: "2px", fontSize: "11px" }}>Packaging</span>
                <span style={{ fontWeight: 500, color: "var(--ink)" }}>{metadata.packaging_status}</span>
              </div>
            )}
            {metadata.health_tier && (
              <div style={{ padding: "var(--s-2)", borderRadius: "var(--r-sm)", backgroundColor: "var(--mist)", border: "1px solid var(--hairline)" }}>
                <span className="muted-label" style={{ display: "block", marginBottom: "2px", fontSize: "11px" }}>Health tier</span>
                <span style={{ fontWeight: 500, color: "var(--ink)" }}>{metadata.health_tier}</span>
              </div>
            )}
          </div>
        </div>

        {/* Amazon Purchase Link */}
        {snack.amazon_search_url && (
          <div style={{ marginBottom: "var(--s-8)", textAlign: "center" }}>
            <a
              href={snack.amazon_search_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                borderRadius: "var(--r-pill)", backgroundColor: "var(--forest)",
                padding: "12px 24px", fontSize: "var(--fs-small)", fontWeight: 500,
                color: "var(--mist)", textDecoration: "none", minHeight: "44px"
              }}
            >
              <ExternalLink size={15} style={{ marginRight: "8px" }} />
              Check price / buy on Amazon
            </a>
          </div>
        )}

        {/* "Switch To This" Vegan Alternatives Section */}
        {!snack.is_vegan && (
          <div style={{ marginBottom: "var(--s-8)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--hairline)", backgroundColor: "var(--vegan-bg)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "var(--s-3)" }}>
              <Sparkles size={16} style={{ color: "var(--forest)" }} />
              <h2 style={{ fontSize: "1.25rem", fontWeight: 300, color: "var(--ink)" }}>
                Switch to this · Vegan alternatives for {snack.sub_type || snack.name}
              </h2>
            </div>
            {loadingAlternatives ? (
              <LoadingAnimation message="Finding matching vegan alternatives..." />
            ) : alternatives.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--s-2)" }}>
                {alternatives.map((alt) => (
                  <SnackCard key={alt.slug} snack={alt} />
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "var(--fs-small)", color: "var(--stone)" }}>
                No matching alternatives found.
              </p>
            )}
          </div>
        )}

        {/* Community Verification & Discussion Hub */}
        <div className="earthy-card" style={{ marginBottom: "var(--s-8)", padding: "var(--s-4)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--hairline)", paddingBottom: "var(--s-3)", marginBottom: "var(--s-4)", gap: "var(--s-2)" }}>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 300, color: "var(--ink)", marginBottom: "2px" }}>
                Community verification &amp; discussion
              </h2>
              <p style={{ fontSize: "var(--fs-small)", color: "var(--stone)" }}>
                Report ingredient updates or confirm product verification.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-2)" }}>
              <button
                onClick={handleUpvote}
                disabled={hasUpvoted}
                className="tabular-nums"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  borderRadius: "var(--r-pill)", padding: "6px 14px",
                  fontSize: "var(--fs-small)", fontWeight: 500,
                  backgroundColor: hasUpvoted ? "var(--forest)" : "var(--vegan-bg)",
                  color: hasUpvoted ? "var(--mist)" : "var(--vegan-fg)",
                  border: "none", cursor: "pointer"
                }}
              >
                <ThumbsUp size={13} />
                <span>{pollStats.upvotes_as_vegan} vegan confirmed</span>
              </button>

              <button
                onClick={() => setShowFlagModal(true)}
                className="tabular-nums"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  borderRadius: "var(--r-pill)", padding: "6px 14px",
                  fontSize: "var(--fs-small)", fontWeight: 500,
                  backgroundColor: "var(--not-vegan-bg)", color: "var(--not-vegan-fg)",
                  border: "1px solid var(--hairline)", cursor: "pointer"
                }}
              >
                <Flag size={13} />
                <span>Flag non-vegan ({pollStats.reports_as_non_vegan})</span>
              </button>
            </div>
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} style={{ marginBottom: "var(--s-4)", display: "flex", flexDirection: "column", gap: "var(--s-2)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-2)" }}>
              <input
                type="text"
                placeholder="Your name (optional)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="earthy-input"
                style={{ flex: "1 1 180px", height: "40px", padding: "0 12px", fontSize: "var(--fs-small)" }}
              />
              <input
                type="text"
                placeholder="Share ingredient update or verification comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="earthy-input"
                style={{ flex: "2 1 280px", height: "40px", padding: "0 12px", fontSize: "var(--fs-small)" }}
              />
            </div>
            <button
              type="submit"
              style={{
                alignSelf: "flex-start", borderRadius: "var(--r-pill)",
                backgroundColor: "var(--forest)", color: "var(--mist)",
                padding: "8px 18px", fontSize: "var(--fs-small)", fontWeight: 500,
                border: "none", cursor: "pointer", minHeight: "36px"
              }}
            >
              Post comment
            </button>
          </form>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-2)" }}>
              {comments.map((c, i) => (
                <div key={i} style={{ padding: "var(--s-2)", borderRadius: "var(--r-sm)", backgroundColor: "var(--mist)", border: "1px solid var(--hairline)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--fs-small)", color: "var(--ink)", fontWeight: 500, marginBottom: "2px" }}>
                    <span>{c.author}</span>
                    <span className="tabular-nums" style={{ color: "var(--stone)", fontWeight: 400 }}>{c.date}</span>
                  </div>
                  <p style={{ fontSize: "var(--fs-small)", color: "var(--stone)" }}>{c.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", fontSize: "var(--fs-small)", color: "var(--stone)", padding: "var(--s-3) 0" }}>
              No comments yet. Share your verification note!
            </p>
          )}
        </div>

        {/* Flag Report Modal */}
        {showFlagModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", padding: "16px" }}>
            <div style={{ width: "100%", maxWidth: "420px", borderRadius: "var(--r-md)", backgroundColor: "var(--paper)", padding: "var(--s-4)", border: "1px solid var(--hairline)" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 300, color: "var(--ink)", marginBottom: "4px" }}>
                Report recipe change / non-vegan flag
              </h2>
              <p style={{ fontSize: "var(--fs-small)", color: "var(--stone)", marginBottom: "var(--s-3)" }}>
                Did {snack.name} start using milk solids or non-vegan ingredients?
              </p>

              {flagSubmitted ? (
                <div style={{ padding: "var(--s-2)", borderRadius: "var(--r-sm)", backgroundColor: "var(--vegan-bg)", color: "var(--vegan-fg)", textAlign: "center", fontSize: "var(--fs-small)", fontWeight: 500 }}>
                  Report submitted. Moderators will audit this product.
                </div>
              ) : (
                <form onSubmit={handleFlagSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "var(--fs-small)", fontWeight: 500, color: "var(--ink)", marginBottom: "4px" }}>
                      Reason for flag
                    </label>
                    <select
                      value={selectedFlagReason}
                      onChange={(e) => setSelectedFlagReason(e.target.value)}
                      className="earthy-input"
                      style={{ width: "100%", height: "40px", padding: "0 12px", fontSize: "var(--fs-small)" }}
                    >
                      {FLAG_REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "var(--fs-small)", fontWeight: 500, color: "var(--ink)", marginBottom: "4px" }}>
                      Batch details / notes
                    </label>
                    <textarea
                      rows={3}
                      value={flagDetails}
                      onChange={(e) => setFlagDetails(e.target.value)}
                      placeholder="Specify batch date or exact ingredient label change..."
                      className="earthy-input"
                      style={{ width: "100%", padding: "8px 12px", fontSize: "var(--fs-small)" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={() => setShowFlagModal(false)}
                      style={{ borderRadius: "var(--r-pill)", padding: "6px 16px", fontSize: "var(--fs-small)", fontWeight: 500, color: "var(--stone)", background: "none", border: "none", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ borderRadius: "var(--r-pill)", backgroundColor: "var(--not-vegan-fg)", color: "var(--mist)", padding: "6px 18px", fontSize: "var(--fs-small)", fontWeight: 500, border: "none", cursor: "pointer" }}
                    >
                      Submit report
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
    </div>
  );
};

export default SnackDetail;

