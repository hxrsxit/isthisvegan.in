import { Link } from "react-router-dom";
import { Leaf, TriangleAlert, ShieldCheck, Flame, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Snack, parseArrayField, parseJsonObjectField, ProductMetadata } from "@/lib/snacks-data";

interface SnackCardProps {
  snack: Snack;
  index?: number;
}

export default function SnackCard({ snack, index = 0 }: SnackCardProps) {
  const dietaryBadges = parseArrayField(snack.dietary_compatibility);
  const metadata = parseJsonObjectField<ProductMetadata>(snack.product_metadata, {});

  // Determine health tier styling
  const healthTier = metadata.health_tier || "";
  let healthLabel = "";
  let healthColorClass = "";

  if (healthTier.startsWith("1")) {
    healthLabel = "Superfood";
    healthColorClass = "bg-emerald-100 text-emerald-800 border-emerald-300";
  } else if (healthTier.startsWith("2")) {
    healthLabel = "Healthy";
    healthColorClass = "bg-green-100 text-green-800 border-green-300";
  } else if (healthTier.startsWith("3")) {
    healthLabel = "Moderately Healthy";
    healthColorClass = "bg-teal-100 text-teal-800 border-teal-300";
  } else if (healthTier.startsWith("4")) {
    healthLabel = "Processed";
    healthColorClass = "bg-amber-100 text-amber-800 border-amber-300";
  } else if (healthTier.startsWith("5")) {
    healthLabel = "Ultra-Processed";
    healthColorClass = "bg-orange-100 text-orange-800 border-orange-300";
  }

  const categoryPill = snack.sub_type || snack.food_type || snack.product_class || snack.main_category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/snack/${snack.slug}`}
        className={`group flex flex-col justify-between h-full rounded-3xl border p-5 md:p-6 shadow-card transition-all duration-300 ease-out hover:scale-[1.015] hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          snack.is_vegan
            ? "border-emerald-200/70 bg-gradient-to-b from-emerald-50/60 to-emerald-50/20 hover:border-emerald-300"
            : "border-rose-200/70 bg-gradient-to-b from-rose-50/60 to-rose-50/20 hover:border-rose-300"
        }`}
      >
        <div>
          {/* Top row: Brand & Verdict badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="font-['Inter'] text-xs font-semibold uppercase tracking-wider text-[#01472e]/60">
                {snack.brand || "Brand Unspecified"}
              </span>
              <h3 className="mt-0.5 font-['Inter'] text-[1.1rem] font-bold leading-snug text-[#01472e] group-hover:text-emerald-950">
                {snack.name}
              </h3>
            </div>
            <Badge
              variant="outline"
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 font-['Inter'] text-[11px] font-bold uppercase tracking-wider shadow-xs ${
                snack.is_vegan
                  ? "border-emerald-600/30 bg-emerald-600 text-white"
                  : "border-rose-600/30 bg-rose-600 text-white"
              }`}
            >
              {snack.is_vegan ? (
                <Leaf size={12} strokeWidth={2.5} className="text-white" aria-hidden="true" />
              ) : (
                <TriangleAlert size={12} strokeWidth={2.5} className="text-white" aria-hidden="true" />
              )}
              {snack.is_vegan ? "Vegan" : "Not Vegan"}
            </Badge>
          </div>

          {/* Verdict Summary */}
          {snack.verdict_summary && (
            <p className="mt-3 line-clamp-2 font-['Inter'] text-xs text-[#01472e]/75 leading-relaxed">
              {snack.verdict_summary}
            </p>
          )}
        </div>

        {/* Bottom Metadata Badges */}
        <div className="mt-4 pt-3 border-t border-[#01472e]/10 flex flex-wrap items-center gap-1.5">
          {categoryPill && (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#01472e]/10 px-2 py-0.5 font-['Inter'] text-[10px] font-medium text-[#01472e]">
              <Tag size={10} />
              {categoryPill}
            </span>
          )}

          {healthLabel && (
            <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-['Inter'] text-[10px] font-medium ${healthColorClass}`}>
              <Flame size={10} />
              {healthLabel}
            </span>
          )}

          {dietaryBadges.slice(0, 2).map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-0.5 rounded-md bg-white/80 border border-[#01472e]/15 px-2 py-0.5 font-['Inter'] text-[10px] font-medium text-[#01472e]/80 shadow-2xs"
            >
              <ShieldCheck size={10} className="text-emerald-700" />
              {badge}
            </span>
          ))}

          {dietaryBadges.length > 2 && (
            <span className="font-['Inter'] text-[10px] font-medium text-[#01472e]/50">
              +{dietaryBadges.length - 2} more
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
