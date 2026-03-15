import { Link } from "react-router-dom";
import { Leaf, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";
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
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        to={`/snack/${snack.slug}`}
        className="block rounded-3xl border border-border/60 bg-card p-6 shadow-card transition-all duration-300 ease-out hover:scale-[1.01] hover:border-border hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold leading-tight text-foreground">
                {snack.snack_name}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {snack.brand_or_region}
              </p>
            </div>
            <div
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                snack.is_vegan
                  ? "bg-safe/10 text-safe"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {snack.is_vegan ? (
                <Leaf size={14} strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <TriangleAlert size={14} strokeWidth={1.5} aria-hidden="true" />
              )}
              {snack.is_vegan ? "Vegan" : "Not Vegan"}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SnackCard;
