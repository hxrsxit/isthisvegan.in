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

  // Health tier formatting with natural earth tones
  const healthTier = metadata.health_tier || "";
  let healthLabel = "";
  let healthColorClass = "";

  if (healthTier.startsWith("1")) {
    healthLabel = "Superfood";
    healthColorClass = "bg-[#e6ece7] text-[#2c3d31] border-[#b2c2b5]";
  } else if (healthTier.startsWith("2")) {
    healthLabel = "Healthy";
    healthColorClass = "bg-[#e6ece7] text-[#2c3d31] border-[#b2c2b5]";
  } else if (healthTier.startsWith("3")) {
    healthLabel = "Moderate";
    healthColorClass = "bg-[#f5f4eb] text-[#545037] border-[#dfdbc7]";
  } else if (healthTier.startsWith("4")) {
    healthLabel = "Processed";
    healthColorClass = "bg-[#f7efe6] text-[#6b4c29] border-[#e4d4be]";
  } else if (healthTier.startsWith("5")) {
    healthLabel = "Ultra-Processed";
    healthColorClass = "bg-[#f9eee9] text-[#7d3c34] border-[#e5c5bd]";
  }

  const categoryPill = snack.sub_type || snack.food_type || snack.product_class || snack.main_category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.2), ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/snack/${snack.slug}`}
        className="linen-card group flex flex-col justify-between h-full p-5 sm:p-6 text-[#1c211e]"
      >
        <div>
          {/* Header Row: Brand & Status Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="font-mono-data text-[10px] font-bold uppercase tracking-[0.2em] text-[#5a655c]">
                {snack.brand || "Brand Unspecified"}
              </span>
              <h3 className="mt-1 font-serif-fraunces text-lg font-bold leading-snug text-[#1c211e] group-hover:text-[#354338] transition-colors line-clamp-1">
                {snack.name}
              </h3>
            </div>

            <Badge
              variant="outline"
              className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 font-sans-ui text-[10px] font-semibold uppercase tracking-wider transition-all ${
                snack.is_vegan
                  ? "border-[#b2c2b5] bg-[#e6ece7] text-[#2c3d31]"
                  : "border-[#e5c5bd] bg-[#f9eee9] text-[#7d3c34]"
              }`}
            >
              {snack.is_vegan ? (
                <Leaf size={11} strokeWidth={2.5} className="text-[#2c3d31]" aria-hidden="true" />
              ) : (
                <TriangleAlert size={11} strokeWidth={2.5} className="text-[#7d3c34]" aria-hidden="true" />
              )}
              {snack.is_vegan ? "Vegan" : "Not Vegan"}
            </Badge>
          </div>

          {/* Verdict Summary */}
          {snack.verdict_summary && (
            <p className="mt-3 line-clamp-2 font-sans-ui text-xs text-[#5a655c] leading-relaxed font-normal">
              {snack.verdict_summary}
            </p>
          )}
        </div>

        {/* Bottom Attributes Bar */}
        <div className="mt-5 pt-3 border-t border-[#e3e7e2] flex flex-wrap items-center gap-1.5">
          {categoryPill && (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#f0f3ef] border border-[#e3e7e2] px-2 py-0.5 font-sans-ui text-[10px] font-semibold text-[#354338]">
              <Tag size={10} className="text-[#5a655c]" />
              {categoryPill}
            </span>
          )}

          {healthLabel && (
            <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-sans-ui text-[10px] font-medium ${healthColorClass}`}>
              <Flame size={10} />
              {healthLabel}
            </span>
          )}

          {dietaryBadges.slice(0, 2).map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1 rounded-md bg-white border border-[#e3e7e2] px-2 py-0.5 font-sans-ui text-[10px] font-medium text-[#5a655c]"
            >
              <ShieldCheck size={10} className="text-[#2c3d31]" />
              {badge}
            </span>
          ))}

          {dietaryBadges.length > 2 && (
            <span className="font-sans-ui text-[10px] font-medium text-[#5a655c]">
              +{dietaryBadges.length - 2} more
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
