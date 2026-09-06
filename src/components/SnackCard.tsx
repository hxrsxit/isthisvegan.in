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

  // Determine health tier label & class
  const healthTier = metadata.health_tier || "";
  let healthLabel = "";
  let healthColorClass = "";

  if (healthTier.startsWith("1")) {
    healthLabel = "Superfood";
    healthColorClass = "bg-[#edf4ee] text-[#2c4c36] border-[#b6d5bd]";
  } else if (healthTier.startsWith("2")) {
    healthLabel = "Healthy";
    healthColorClass = "bg-[#edf4ee] text-[#2c4c36] border-[#c2ddc8]";
  } else if (healthTier.startsWith("3")) {
    healthLabel = "Moderate";
    healthColorClass = "bg-[#f4f3ea] text-[#524e38] border-[#dfdbc7]";
  } else if (healthTier.startsWith("4")) {
    healthLabel = "Processed";
    healthColorClass = "bg-[#f9f4ee] text-[#6b4729] border-[#e8d1bd]";
  } else if (healthTier.startsWith("5")) {
    healthLabel = "Ultra-Processed";
    healthColorClass = "bg-[#fcf0ef] text-[#7d2c29] border-[#f2c7c5]";
  }

  const categoryPill = snack.sub_type || snack.food_type || snack.product_class || snack.main_category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.02, 0.2), ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/snack/${snack.slug}`}
        className="sage-card group flex flex-col justify-between h-full p-5 md:p-6 text-[#1a1f2e]"
      >
        <div>
          {/* Top row: Brand & Verdict badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="font-['Inter'] text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">
                {snack.brand || "Brand Unspecified"}
              </span>
              <h3 className="mt-0.5 font-['Inter'] text-[1.05rem] font-bold leading-snug text-[#1a1f2e] group-hover:text-[#7c9082] transition-colors">
                {snack.name}
              </h3>
            </div>

            <Badge
              variant="outline"
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 font-['Inter'] text-[10px] font-bold uppercase tracking-wider transition-all ${
                snack.is_vegan
                  ? "border-[#7c9082]/40 bg-[#eaf0eb] text-[#2e4033]"
                  : "border-[#c73e3a]/30 bg-[#fdf2f2] text-[#962b28]"
              }`}
            >
              {snack.is_vegan ? (
                <Leaf size={12} strokeWidth={2.5} className="text-[#7c9082]" aria-hidden="true" />
              ) : (
                <TriangleAlert size={12} strokeWidth={2.5} className="text-[#c73e3a]" aria-hidden="true" />
              )}
              {snack.is_vegan ? "Vegan" : "Not Vegan"}
            </Badge>
          </div>

          {/* Verdict Summary */}
          {snack.verdict_summary && (
            <p className="mt-3 line-clamp-2 font-['Inter'] text-xs text-[#6b7280] leading-relaxed font-normal">
              {snack.verdict_summary}
            </p>
          )}
        </div>

        {/* Bottom Metadata Badges */}
        <div className="mt-4 pt-3 border-t border-[#e8e6e1] flex flex-wrap items-center gap-1.5">
          {categoryPill && (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#fafaf8] border border-[#e8e6e1] px-2 py-0.5 font-['Inter'] text-[10px] font-medium text-[#1a1f2e]">
              <Tag size={10} className="text-[#7c9082]" />
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
              className="inline-flex items-center gap-1 rounded-md bg-[#fafaf8] border border-[#e8e6e1] px-2 py-0.5 font-['Inter'] text-[10px] font-medium text-[#6b7280]"
            >
              <ShieldCheck size={10} className="text-[#7c9082]" />
              {badge}
            </span>
          ))}

          {dietaryBadges.length > 2 && (
            <span className="font-['Inter'] text-[10px] font-medium text-[#6b7280]/70">
              +{dietaryBadges.length - 2} more
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
