import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Leaf,
  TriangleAlert,
  ExternalLink,
  ShieldCheck,
  Flame,
  ChefHat,
  Tag,
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
import { landingTheme, landingNoiseBackground } from "@/lib/theme";
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
        .from<Snack>("isthisvegan_db2")
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
        .from<Snack>("isthisvegan_db2")
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
        .from<Snack>("isthisvegan_db2")
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
        .from<Snack>("isthisvegan_db2")
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
        .from<Snack>("isthisvegan_db2")
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
          <p className="font-serif-fraunces text-2xl font-bold mb-2 text-[#1c211e]">
            {error ? "Error Loading Data" : "Product Not Found"}
          </p>
          {error && <p className="font-sans-ui text-xs text-[#5a655c] mt-2 max-w-md">{error}</p>}
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-[#e3e7e2] bg-white px-4 py-2 font-sans-ui text-xs font-semibold text-[#1c211e] shadow-xs hover:bg-[#f0f3ef]"
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

  const pageTitle = `${snack.name} (${snack.brand || "Indian Food"}) — Is This Vegan?`;
  const pageDescription = snack.verdict_summary
    ? `${snack.name} by ${snack.brand} — ${snack.is_vegan ? "Plant-Based Verdict" : "Not Vegan Alert"}. ${snack.verdict_summary}`
    : `Is ${snack.name} by ${snack.brand} vegan? Ingredient verification on IsThisVegan.in`;
  const pageUrl = `https://www.isthisvegan.in/snack/${snack.slug}`;

  return (
    <div
      style={landingTheme}
      className="relative min-h-screen overflow-hidden bg-[#f8f7f4] text-[#1c211e]"
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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 container max-w-4xl py-8 md:py-12 px-4 sm:px-6"
      >
        {/* Navigation */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#e3e7e2] bg-white px-4 py-2 font-sans-ui text-xs font-semibold text-[#1c211e] shadow-2xs hover:border-[#2d3a30]"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back to Search
        </Link>

        {/* Master Verdict Banner */}
        <div
          className={`mb-8 rounded-2xl border p-6 md:p-8 shadow-xs ${
            snack.is_vegan
              ? "border-[#b6d5bd] bg-[#edf4ee] text-[#1c211e]"
              : "border-[#f2c7c5] bg-[#fcf0ef] text-[#1c211e]"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl shadow-xs ${
                  snack.is_vegan ? "bg-[#2d3a30] text-white" : "bg-[#7d2c29] text-white"
                }`}
              >
                {snack.is_vegan ? (
                  <Leaf size={28} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <TriangleAlert size={28} strokeWidth={2} aria-hidden="true" />
                )}
              </div>
              <div>
                <span
                  className={`inline-block font-mono-data text-xs font-bold uppercase tracking-wider ${
                    snack.is_vegan ? "text-[#2c4c36]" : "text-[#7d2c29]"
                  }`}
                >
                  {snack.is_vegan ? "100% Plant-Based Verdict" : "Non-Vegan Alert"}
                </span>
                <h1 className="font-serif-fraunces text-2xl md:text-4xl font-bold tracking-tight text-[#1c211e]">
                  {snack.name}
                </h1>
                <p className="font-sans-ui text-sm text-[#5a655c] mt-1">
                  Brand: <span className="font-semibold text-[#1c211e]">{snack.brand || "Unspecified"}</span>
                  {snack.sub_type && <span> • Category: {snack.sub_type}</span>}
                </p>
              </div>
            </div>

            {/* Confidence & Verified Date */}
            <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 border-t md:border-t-0 border-[#e3e7e2] pt-3 md:pt-0">
              {metadata.vegan_confidence_score && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#e3e7e2] px-3.5 py-1 text-xs font-semibold text-[#1c211e]">
                  <ShieldCheck size={14} className="text-[#2c4c36]" />
                  Confidence: {metadata.vegan_confidence_score}/5
                </div>
              )}
              {snack.last_verified_date && (
                <span className="font-mono-data text-[11px] text-[#7a867c]">
                  Verified: {snack.last_verified_date}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Verdict Summary Callout */}
        {snack.verdict_summary && (
          <div className="mb-6 rounded-2xl border border-[#e3e7e2] bg-white p-6 text-[#1c211e] shadow-xs">
            <p className="font-mono-data text-xs uppercase tracking-wider text-[#7a867c] mb-1 font-bold">
              Verdict Summary
            </p>
            <p className="font-serif-fraunces text-lg md:text-2xl leading-relaxed">{snack.verdict_summary}</p>
          </div>
        )}

        {/* Hidden Animal Ingredients Alert */}
        {!snack.is_vegan && hiddenIngredients.length > 0 && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#f2c7c5] bg-[#fcf0ef] p-5">
            <TriangleAlert size={22} className="text-[#7d2c29] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-mono-data text-xs font-bold uppercase tracking-wider text-[#7d2c29]">
                Hidden Animal Ingredients Detected
              </h3>
              <p className="mt-1 font-sans-ui text-sm text-[#1c211e] font-semibold">
                {hiddenIngredients.join(", ")}
              </p>
            </div>
          </div>
        )}

        {/* SME Description */}
        {descriptionText && (
          <div className="mb-8 p-6 md:p-8 rounded-2xl border border-[#e3e7e2] bg-white shadow-xs">
            <h3 className="font-mono-data text-xs font-bold uppercase tracking-wider text-[#7a867c] mb-2">
              SME Ingredient Analysis & Formulation Insights
            </h3>
            <p className="font-sans-ui text-sm md:text-base leading-relaxed text-[#1c211e]">
              {descriptionText}
            </p>
          </div>
        )}

        {/* DIY Vegan Hack / Ordering Tip */}
        {snack.diy_vegan_recipe_or_hack && (
          <div className="mb-8 p-6 rounded-2xl border border-[#b6d5bd] bg-[#edf4ee] shadow-xs">
            <div className="flex items-center gap-2 text-[#2c4c36] font-bold uppercase text-xs tracking-wider mb-2 font-mono-data">
              <ChefHat size={18} className="text-[#2c4c36]" />
              <span>How to Veganise / Street Ordering Hack</span>
            </div>
            <p className="font-sans-ui text-sm md:text-base text-[#1c211e] leading-relaxed">
              {snack.diy_vegan_recipe_or_hack}
            </p>
          </div>
        )}

        {/* Badges Grid */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dietary Compatibility */}
          <div className="p-6 rounded-2xl border border-[#e3e7e2] bg-white shadow-xs">
            <h4 className="font-mono-data text-xs font-bold uppercase tracking-wider text-[#7a867c] mb-3">
              Dietary Compatibility
            </h4>
            {dietaryBadges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {dietaryBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1 rounded-full bg-[#edf4ee] border border-[#b6d5bd] px-3 py-1 font-sans-ui text-xs font-semibold text-[#2c4c36]"
                  >
                    <CheckCircle2 size={12} className="text-[#2c4c36]" />
                    {badge}
                  </span>
                ))}
              </div>
            ) : (
              <p className="font-sans-ui text-xs text-[#5a655c]">
                No specific dietary badges tagged.
              </p>
            )}
          </div>

          {/* Allergens Present */}
          <div className="p-6 rounded-2xl border border-[#e3e7e2] bg-white shadow-xs">
            <h4 className="font-mono-data text-xs font-bold uppercase tracking-wider text-[#7a867c] mb-3">
              Allergens Present
            </h4>
            {allergens.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allergens.map((allergen) => (
                  <span
                    key={allergen}
                    className="inline-flex items-center gap-1 rounded-full bg-[#f5f4eb] border border-[#dfdbc7] px-3 py-1 font-sans-ui text-xs font-semibold text-[#545037]"
                  >
                    <AlertCircle size={12} className="text-[#6b4729]" />
                    {allergen}
                  </span>
                ))}
              </div>
            ) : (
              <p className="font-sans-ui text-xs text-[#2c4c36] font-semibold">
                Confirmed Allergen-Free / Zero tracked allergens.
              </p>
            )}
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="mb-8 p-6 md:p-8 rounded-2xl border border-[#e3e7e2] bg-white shadow-xs">
          <h3 className="font-mono-data text-xs font-bold uppercase tracking-wider text-[#7a867c] mb-4">
            Product Specifications & Attributes
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-sans-ui text-xs">
            {metadata.regional_cuisine && (
              <div className="p-3.5 rounded-xl bg-[#f8f7f4] border border-[#e3e7e2]">
                <span className="text-[#7a867c] block mb-0.5 font-mono-data text-[10px] uppercase">Cuisine</span>
                <span className="font-semibold text-[#1c211e]">{metadata.regional_cuisine}</span>
              </div>
            )}
            {metadata.packaging_status && (
              <div className="p-3.5 rounded-xl bg-[#f8f7f4] border border-[#e3e7e2]">
                <span className="text-[#7a867c] block mb-0.5 font-mono-data text-[10px] uppercase">Packaging</span>
                <span className="font-semibold text-[#1c211e]">{metadata.packaging_status}</span>
              </div>
            )}
            {metadata.health_tier && (
              <div className="p-3.5 rounded-xl bg-[#f8f7f4] border border-[#e3e7e2]">
                <span className="text-[#7a867c] block mb-0.5 font-mono-data text-[10px] uppercase">Health Tier</span>
                <span className="font-semibold text-[#1c211e]">{metadata.health_tier}</span>
              </div>
            )}
            {metadata.cross_contamination_risk && (
              <div className="p-3.5 rounded-xl bg-[#f8f7f4] border border-[#e3e7e2]">
                <span className="text-[#7a867c] block mb-0.5 font-mono-data text-[10px] uppercase">Cross Contamination</span>
                <span className="font-semibold text-[#1c211e]">{metadata.cross_contamination_risk}</span>
              </div>
            )}
            {metadata.price_tier && (
              <div className="p-3.5 rounded-xl bg-[#f8f7f4] border border-[#e3e7e2]">
                <span className="text-[#7a867c] block mb-0.5 font-mono-data text-[10px] uppercase">Price Tier</span>
                <span className="font-semibold text-[#1c211e]">{metadata.price_tier}</span>
              </div>
            )}
            {metadata.target_audience && (
              <div className="p-3.5 rounded-xl bg-[#f8f7f4] border border-[#e3e7e2]">
                <span className="text-[#7a867c] block mb-0.5 font-mono-data text-[10px] uppercase">Target Audience</span>
                <span className="font-semibold text-[#1c211e]">{metadata.target_audience}</span>
              </div>
            )}
          </div>
        </div>

        {/* Amazon Affiliate Button */}
        {snack.amazon_search_url && (
          <div className="mb-10">
            <a
              href={snack.amazon_search_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-13 w-full items-center justify-center rounded-full bg-[#2d3a30] px-6 font-sans-ui text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#202a23]"
            >
              <ExternalLink size={16} className="mr-2" />
              Check Price / Buy on Amazon
            </a>
          </div>
        )}

        {/* "Switch To This" Vegan Alternatives Section */}
        {!snack.is_vegan && (
          <div className="mb-10 p-6 md:p-8 rounded-2xl border border-[#b6d5bd] bg-[#edf4ee]/60">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-[#2c4c36]" />
              <h3 className="font-serif-fraunces text-xl font-bold text-[#1c211e]">
                Switch To This — Vegan Alternatives for {snack.sub_type || snack.name}
              </h3>
            </div>
            {loadingAlternatives ? (
              <LoadingAnimation message="Finding matching vegan alternatives..." />
            ) : alternatives.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {alternatives.map((alt) => (
                  <SnackCard key={alt.slug} snack={alt} />
                ))}
              </div>
            ) : (
              <p className="font-sans-ui text-xs text-[#5a655c]">
                No matching alternatives found.
              </p>
            )}
          </div>
        )}

        {/* Community Verification & Discussion Hub */}
        <div className="mb-10 p-6 md:p-8 rounded-2xl border border-[#e3e7e2] bg-white shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e3e7e2] pb-4 mb-6 gap-4">
            <div>
              <h3 className="font-serif-fraunces text-xl font-bold text-[#1c211e]">
                Community Verification & Discussion
              </h3>
              <p className="font-sans-ui text-xs text-[#5a655c]">
                Report ingredient updates or confirm product verification.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleUpvote}
                disabled={hasUpvoted}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 font-sans-ui text-xs font-semibold transition-all ${
                  hasUpvoted
                    ? "bg-[#2d3a30] text-white"
                    : "bg-[#edf4ee] text-[#2c4c36] hover:bg-[#dceade]"
                }`}
              >
                <ThumbsUp size={13} />
                <span>{pollStats.upvotes_as_vegan} Vegan Confirmed</span>
              </button>

              <button
                onClick={() => setShowFlagModal(true)}
                className="flex items-center gap-1.5 rounded-full bg-[#fcf0ef] border border-[#f2c7c5] px-4 py-2 font-sans-ui text-xs font-semibold text-[#7d2c29] hover:bg-[#f9e0de]"
              >
                <Flag size={13} />
                <span>Flag Non-Vegan ({pollStats.reports_as_non_vegan})</span>
              </button>
            </div>
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-6 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="sm:w-1/3 rounded-xl border border-[#e3e7e2] bg-[#f8f7f4] px-3.5 py-2.5 text-xs font-sans-ui text-[#1c211e]"
              />
              <input
                type="text"
                placeholder="Share ingredient update or verification comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="sm:w-2/3 rounded-xl border border-[#e3e7e2] bg-[#f8f7f4] px-3.5 py-2.5 text-xs font-sans-ui text-[#1c211e]"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-[#2d3a30] px-5 py-2.5 font-sans-ui text-xs font-semibold text-white hover:bg-[#202a23]"
            >
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((c, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#f8f7f4] border border-[#e3e7e2]">
                  <div className="flex justify-between text-xs font-semibold text-[#1c211e] mb-1">
                    <span>{c.author}</span>
                    <span className="font-mono-data text-[#7a867c] text-[11px]">{c.date}</span>
                  </div>
                  <p className="text-xs text-[#5a655c] font-sans-ui">{c.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center font-sans-ui text-xs text-[#5a655c] py-3">
              No comments yet. Share your verification note!
            </p>
          )}
        </div>

        {/* Flag Report Modal */}
        {showFlagModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="font-serif-fraunces text-lg font-bold text-[#1c211e] mb-1">
                Report Recipe Change / Non-Vegan Flag
              </h3>
              <p className="font-sans-ui text-xs text-[#5a655c] mb-4">
                Did {snack.name} start using milk solids or non-vegan ingredients?
              </p>

              {flagSubmitted ? (
                <div className="p-3 rounded-xl bg-[#edf4ee] text-[#2c4c36] text-center font-sans-ui text-xs font-semibold">
                  Report submitted. Moderators will audit this product.
                </div>
              ) : (
                <form onSubmit={handleFlagSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1c211e] mb-1">
                      Reason for Flag
                    </label>
                    <select
                      value={selectedFlagReason}
                      onChange={(e) => setSelectedFlagReason(e.target.value)}
                      className="w-full rounded-xl border border-[#e3e7e2] p-2.5 text-xs font-sans-ui"
                    >
                      {FLAG_REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1c211e] mb-1">
                      Batch Details / Notes
                    </label>
                    <textarea
                      rows={3}
                      value={flagDetails}
                      onChange={(e) => setFlagDetails(e.target.value)}
                      placeholder="Specify batch date or exact ingredient label change..."
                      className="w-full rounded-xl border border-[#e3e7e2] p-2.5 text-xs font-sans-ui"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowFlagModal(false)}
                      className="rounded-full px-4 py-2 text-xs font-medium text-[#5a655c] hover:bg-[#f0f3ef]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-full bg-[#7d2c29] px-5 py-2 text-xs font-semibold text-white hover:bg-[#60211f]"
                    >
                      Submit Report
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

export default SnackDetail;
