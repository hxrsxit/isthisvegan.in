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
  MapPin,
  Package,
  ThumbsUp,
  Flag,
  MessageSquare,
  Sparkles,
  DollarSign,
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
import { motion, AnimatePresence } from "framer-motion";
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

  // Alternatives for non-vegan items
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

        // Parse initial poll stats
        const initialStats = parseJsonObjectField<UserPollStats>(
          item.user_poll_stats,
          { upvotes_as_vegan: 0, reports_as_non_vegan: 0, total_comments: 0 }
        );
        setPollStats(initialStats);

        // Fetch alternatives if non-vegan
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

    let query = supabase
      .from<Snack>("isthisvegan_db2")
      .select("*")
      .eq("is_vegan", true)
      .neq("slug", currentSnack.slug)
      .limit(4);

    if (subType) {
      query = query.eq("sub_type", subType);
    } else if (foodType) {
      query = query.eq("food_type", foodType);
    }

    const { data } = await query;
    if (data && data.length > 0) {
      setAlternatives(data);
    } else {
      // Fallback: fetch any 4 vegan snacks
      const { data: fallbackData } = await supabase
        .from<Snack>("isthisvegan_db2")
        .select("*")
        .eq("is_vegan", true)
        .neq("slug", currentSnack.slug)
        .limit(4);
      setAlternatives(fallbackData || []);
    }
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
    }, 2000);
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
        className="flex min-h-screen items-center justify-center bg-[hsl(var(--landing-cream))] text-[hsl(var(--landing-forest))]"
      >
        <LoadingAnimation message="Fetching product details..." />
      </div>
    );
  }

  if (error || !snack) {
    return (
      <div
        style={landingTheme}
        className="relative flex min-h-screen flex-col items-center justify-center bg-[hsl(var(--landing-cream))] text-[hsl(var(--landing-forest))] px-4 text-center"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04]"
          style={{ backgroundImage: landingNoiseBackground }}
        />
        <div className="relative z-10">
          <p className="font-['Anton'] text-4xl mb-2">
            {error ? "Error Loading Data" : "Product Not Found"}
          </p>
          {error && (
            <p className="font-['Inter'] text-sm text-[hsl(var(--landing-forest)/0.7)] mt-2 break-words max-w-md">
              {error}
            </p>
          )}
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--landing-forest)/0.08)] bg-[hsl(var(--landing-cream)/0.42)] px-4 py-2 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.28em] text-[hsl(var(--landing-forest)/0.72)] shadow-md backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white hover:text-[hsl(var(--landing-forest))]"
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
    ? `${snack.name} by ${snack.brand} — ${snack.is_vegan ? "✅ 100% Vegan" : "❌ Not Vegan"}. ${snack.verdict_summary}`
    : `Is ${snack.name} by ${snack.brand} vegan? Verified ingredient analysis on IsThisVegan.in`;
  const pageUrl = `https://www.isthisvegan.in/snack/${snack.slug}`;

  return (
    <div
      style={landingTheme}
      className="relative min-h-screen overflow-hidden bg-[hsl(var(--landing-cream))] text-[hsl(var(--landing-forest))]"
    >
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.isthisvegan.in/IsThisVegan_logo.png" />
      </Helmet>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04]"
        style={{ backgroundImage: landingNoiseBackground }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 container max-w-4xl py-8 md:py-12"
      >
        {/* Navigation */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#01472e]/15 bg-white/70 px-4 py-2 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.2em] text-[#01472e] shadow-xs backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back to Search
        </Link>

        {/* Master Verdict Banner */}
        <div
          className={`mb-8 overflow-hidden rounded-[2.5rem] border p-6 md:p-8 shadow-lg backdrop-blur-md ${snack.is_vegan
            ? "border-emerald-300/70 bg-gradient-to-br from-emerald-100/70 via-emerald-50/50 to-white/80 text-[#01472e]"
            : "border-rose-300/70 bg-gradient-to-br from-rose-100/70 via-rose-50/50 to-white/80 text-rose-950"
            }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] shadow-md ${snack.is_vegan ? "bg-[#01472e] text-white" : "bg-rose-600 text-white"
                  }`}
              >
                {snack.is_vegan ? (
                  <Leaf size={34} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <TriangleAlert size={34} strokeWidth={2} aria-hidden="true" />
                )}
              </div>
              <div>
                <span
                  className={`inline-block font-['Inter'] text-xs font-bold uppercase tracking-[0.25em] ${snack.is_vegan ? "text-emerald-800" : "text-rose-700"
                    }`}
                >
                  {snack.is_vegan ? "100% Plant-Based Verdict" : "Non-Vegan Alert"}
                </span>
                <h1 className="font-['Anton'] text-3xl md:text-5xl tracking-normal text-[#01472e]">
                  {snack.name}
                </h1>
                <p className="font-['Inter'] text-sm font-medium text-[#01472e]/70 mt-1">
                  Brand: <span className="font-semibold">{snack.brand || "Unspecified"}</span>
                  {snack.sub_type && <span> • Sub-type: {snack.sub_type}</span>}
                </p>
              </div>
            </div>

            {/* Confidence & Verified Date */}
            <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 border-t md:border-t-0 border-[#01472e]/10 pt-3 md:pt-0">
              {metadata.vegan_confidence_score && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#01472e] shadow-xs">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Confidence Score: {metadata.vegan_confidence_score}/5
                </div>
              )}
              {snack.last_verified_date && (
                <span className="font-['Inter'] text-[11px] text-[#01472e]/60">
                  Last verified: {snack.last_verified_date}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Verdict Summary Callout */}
        {snack.verdict_summary && (
          <div className="mb-6 rounded-[2rem] border border-[#01472e]/20 bg-[#01472e] p-6 text-[#fefae0] shadow-md">
            <p className="font-['Inter'] text-xs uppercase tracking-widest text-[#ccd5ae] mb-1 font-semibold">
              Verdict Summary
            </p>
            <p className="font-['Anton'] text-lg md:text-2xl leading-snug">{snack.verdict_summary}</p>
          </div>
        )}

        {/* Hidden Animal Ingredients Alert */}
        {!snack.is_vegan && hiddenIngredients.length > 0 && (
          <div className="mb-6 flex items-start gap-3 rounded.3xl rounded-[2rem] border border-rose-300 bg-rose-50 p-6 shadow-xs">
            <TriangleAlert size={24} className="text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-['Inter'] text-sm font-bold uppercase tracking-wider text-rose-800">
                Hidden Animal Ingredients Detected
              </h3>
              <p className="mt-1 font-['Inter'] text-base text-rose-950 font-medium">
                {hiddenIngredients.join(", ")}
              </p>
            </div>
          </div>
        )}

        {/* SME Enhanced Description */}
        {descriptionText && (
          <div className="mb-8 p-6 md:p-8 rounded-[2rem] border border-[#01472e]/10 bg-white/80 shadow-xs">
            <h3 className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#01472e]/60 mb-2">
              SME Ingredient Analysis & Manufacturing Insights
            </h3>
            <p className="font-['Inter'] text-base leading-relaxed text-[#01472e]/90 font-normal">
              {descriptionText}
            </p>
          </div>
        )}

        {/* DIY Vegan Hack / Ordering Tip */}
        {snack.diy_vegan_recipe_or_hack && (
          <div className="mb-8 p-6 rounded-[2rem] border border-emerald-300 bg-emerald-50/80 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-bold uppercase text-xs tracking-wider mb-2">
              <ChefHat size={18} className="text-emerald-700" />
              <span>How to Veganise / Street Ordering Hack</span>
            </div>
            <p className="font-['Inter'] text-base text-emerald-950 font-medium leading-relaxed">
              {snack.diy_vegan_recipe_or_hack}
            </p>
          </div>
        )}

        {/* Dietary & Allergen Badges Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dietary Compatibility Badges */}
          <div className="p-6 rounded-[2rem] border border-[#01472e]/10 bg-white/70 shadow-xs">
            <h4 className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#01472e]/60 mb-3">
              Dietary Compatibility Badges
            </h4>
            {dietaryBadges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {dietaryBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 border border-emerald-300 px-3 py-1 font-['Inter'] text-xs font-semibold text-emerald-900"
                  >
                    <CheckCircle2 size={13} className="text-emerald-700" />
                    {badge}
                  </span>
                ))}
              </div>
            ) : (
              <p className="font-['Inter'] text-xs text-[#01472e]/50">
                No specific dietary certifications tagged.
              </p>
            )}
          </div>

          {/* Allergens Present */}
          <div className="p-6 rounded-[2rem] border border-[#01472e]/10 bg-white/70 shadow-xs">
            <h4 className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#01472e]/60 mb-3">
              Allergens Present
            </h4>
            {allergens.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allergens.map((allergen) => (
                  <span
                    key={allergen}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-100/80 border border-amber-300 px-3 py-1 font-['Inter'] text-xs font-semibold text-amber-900"
                  >
                    <AlertCircle size={13} className="text-amber-700" />
                    {allergen}
                  </span>
                ))}
              </div>
            ) : (
              <p className="font-['Inter'] text-xs text-emerald-800 font-medium">
                ✅ Confirmed Allergen Free / Zero tracked allergens.
              </p>
            )}
          </div>
        </div>

        {/* Product Metadata Breakdown Grid */}
        <div className="mb-8 p-6 md:p-8 rounded-[2.5rem] border border-[#01472e]/10 bg-white/80 shadow-xs">
          <h3 className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#01472e]/60 mb-4">
            Product Specifications & Attributes
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-['Inter'] text-xs">
            {metadata.regional_cuisine && (
              <div className="p-3 rounded-2xl bg-[#fefae0]/80 border border-[#01472e]/10">
                <span className="text-[#01472e]/60 block mb-0.5">Cuisine</span>
                <span className="font-semibold text-[#01472e] text-sm">{metadata.regional_cuisine}</span>
              </div>
            )}
            {metadata.packaging_status && (
              <div className="p-3 rounded-2xl bg-[#fefae0]/80 border border-[#01472e]/10">
                <span className="text-[#01472e]/60 block mb-0.5">Packaging</span>
                <span className="font-semibold text-[#01472e] text-sm">{metadata.packaging_status}</span>
              </div>
            )}
            {metadata.health_tier && (
              <div className="p-3 rounded-2xl bg-[#fefae0]/80 border border-[#01472e]/10">
                <span className="text-[#01472e]/60 block mb-0.5">Health Tier</span>
                <span className="font-semibold text-[#01472e] text-sm">{metadata.health_tier}</span>
              </div>
            )}
            {metadata.cross_contamination_risk && (
              <div className="p-3 rounded-2xl bg-[#fefae0]/80 border border-[#01472e]/10">
                <span className="text-[#01472e]/60 block mb-0.5">Cross Contamination</span>
                <span className="font-semibold text-[#01472e] text-sm">{metadata.cross_contamination_risk}</span>
              </div>
            )}
            {metadata.price_tier && (
              <div className="p-3 rounded-2xl bg-[#fefae0]/80 border border-[#01472e]/10">
                <span className="text-[#01472e]/60 block mb-0.5">Price Tier</span>
                <span className="font-semibold text-[#01472e] text-sm">{metadata.price_tier}</span>
              </div>
            )}
            {metadata.target_audience && (
              <div className="p-3 rounded-2xl bg-[#fefae0]/80 border border-[#01472e]/10">
                <span className="text-[#01472e]/60 block mb-0.5">Target Audience</span>
                <span className="font-semibold text-[#01472e] text-sm">{metadata.target_audience}</span>
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
              className="flex h-14 w-full items-center justify-center rounded-full bg-[#01472e] px-6 font-['Inter'] text-xs font-bold uppercase tracking-[0.22em] text-[#fefae0] shadow-lg transition-transform hover:scale-[1.01]"
            >
              <ExternalLink size={18} className="mr-2" />
              Check Price / Buy on Amazon
            </a>
          </div>
        )}

        {/* "Switch To This" Vegan Alternatives Section */}
        {!snack.is_vegan && (
          <div className="mb-10 p-6 md:p-8 rounded-[2.5rem] border border-emerald-300 bg-gradient-to-b from-emerald-50/80 to-white shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-emerald-700" />
              <h3 className="font-['Anton'] text-2xl text-[#01472e] tracking-wide">
                Switch To This — Vegan Alternatives
              </h3>
            </div>
            {loadingAlternatives ? (
              <LoadingAnimation message="Finding delicious vegan alternatives..." />
            ) : alternatives.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {alternatives.map((alt) => (
                  <SnackCard key={alt.slug} snack={alt} />
                ))}
              </div>
            ) : (
              <p className="font-['Inter'] text-sm text-[#01472e]/70">
                No matching alternatives found yet.
              </p>
            )}
          </div>
        )}

        {/* Community Verification & Discussion Hub */}
        <div className="mb-10 p-6 md:p-8 rounded-[2.5rem] border border-[#01472e]/15 bg-white/90 shadow-md">
          <div className="flex items-center justify-between border-b border-[#01472e]/10 pb-4 mb-6">
            <div>
              <h3 className="font-['Anton'] text-2xl text-[#01472e]">
                Community Verification & Discussion
              </h3>
              <p className="font-['Inter'] text-xs text-[#01472e]/60">
                Lakhs of vegans rely on your input. Upvote or report recipe changes.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleUpvote}
                disabled={hasUpvoted}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 font-['Inter'] text-xs font-bold transition-all ${hasUpvoted
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                  }`}
              >
                <ThumbsUp size={14} />
                <span>{pollStats.upvotes_as_vegan} Vegan Confirmed</span>
              </button>

              <button
                onClick={() => setShowFlagModal(true)}
                className="flex items-center gap-1.5 rounded-full bg-rose-100 px-4 py-2 font-['Inter'] text-xs font-bold text-rose-900 hover:bg-rose-200 transition-all"
              >
                <Flag size={14} />
                <span>Report Non-Vegan Flag ({pollStats.reports_as_non_vegan})</span>
              </button>
            </div>
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-8 space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-1/3 rounded-xl border border-[#01472e]/20 bg-white px-3 py-2 text-xs font-['Inter'] text-[#01472e]"
              />
              <input
                type="text"
                placeholder="Share ingredient update or verification comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-2/3 rounded-xl border border-[#01472e]/20 bg-white px-3 py-2 text-xs font-['Inter'] text-[#01472e]"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-[#01472e] px-5 py-2 font-['Inter'] text-xs font-bold text-[#fefae0] hover:bg-[#01472e]/90"
            >
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((c, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#fefae0]/60 border border-[#01472e]/10">
                  <div className="flex justify-between text-xs font-bold text-[#01472e] mb-1">
                    <span>{c.author}</span>
                    <span className="font-normal text-[#01472e]/50">{c.date}</span>
                  </div>
                  <p className="text-xs text-[#01472e]/80 font-['Inter']">{c.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center font-['Inter'] text-xs text-[#01472e]/50 py-4">
              No comments yet. Be the first to share a verification note!
            </p>
          )}
        </div>

        {/* Flag Modal */}
        {showFlagModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <h3 className="font-['Anton'] text-xl text-rose-950 mb-2">
                Report Recipe Change / Non-Vegan Flag
              </h3>
              <p className="font-['Inter'] text-xs text-rose-900/70 mb-4">
                Did {snack.name} update its ingredients or start using milk solids/ghee?
              </p>

              {flagSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 text-center font-['Inter'] text-xs font-bold">
                  Thank you! Your flag alert has been submitted to moderators.
                </div>
              ) : (
                <form onSubmit={handleFlagSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#01472e] mb-1">
                      Reason for Flag
                    </label>
                    <select
                      value={selectedFlagReason}
                      onChange={(e) => setSelectedFlagReason(e.target.value)}
                      className="w-full rounded-xl border border-[#01472e]/20 p-2 text-xs font-['Inter']"
                    >
                      {FLAG_REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#01472e] mb-1">
                      Additional Details / Batch Info
                    </label>
                    <textarea
                      rows={3}
                      value={flagDetails}
                      onChange={(e) => setFlagDetails(e.target.value)}
                      placeholder="e.g. Bought batch dated Nov 2026, ingredient list now states Milk Solids 2%..."
                      className="w-full rounded-xl border border-[#01472e]/20 p-2 text-xs font-['Inter']"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowFlagModal(false)}
                      className="rounded-full px-4 py-2 text-xs font-bold text-[#01472e]/70 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-full bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700"
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
