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
        className="block rounded-3xl p-6 shadow-card bg-card transition-all duration-300 ease-out hover:shadow-card-hover hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold leading-tight truncate">
                {snack.snack_name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5">
                {snack.brand_or_region}
              </p>
            </div>
            <div
              className={`flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                snack.is_vegan
                  ? "bg-safe/10 text-safe"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {snack.is_vegan ? (
                <Leaf size={14} aria-hidden="true" />
              ) : (
                <TriangleAlert size={14} aria-hidden="true" />
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
