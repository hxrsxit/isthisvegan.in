import { Link } from "react-router-dom";
import { Leaf, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Snack } from "@/lib/snacks-data";

interface SnackCardProps {
  snack: Snack;
  index?: number;
}

const SnackCard = ({ snack, index = 0 }: SnackCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/snack/${snack.slug}`}
        className={`block rounded-3xl border p-6 shadow-card transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          snack.is_vegan
            ? "border-emerald-200/70 bg-emerald-50/50"
            : "border-rose-200/70 bg-rose-50/50"
        }`}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-['Inter'] text-[1.02rem] font-medium leading-tight tracking-[-0.01em] text-foreground">
                {snack.snack_name}
              </h3>
              <p className="mt-1.5 font-['Inter'] text-sm font-normal text-muted-foreground">
                {snack.brand_or_region}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-['Inter'] text-[11px] font-medium uppercase tracking-[0.2em] ${
                snack.is_vegan
                  ? "border-emerald-300/80 bg-emerald-100/70 text-emerald-700"
                  : "border-rose-300/80 bg-rose-100/70 text-rose-700"
              }`}
            >
              {snack.is_vegan ? (
                <Leaf size={14} strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <TriangleAlert size={14} strokeWidth={1.5} aria-hidden="true" />
              )}
              {snack.is_vegan ? "Vegan" : "Not Vegan"}
            </Badge>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SnackCard;
