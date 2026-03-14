import { Link } from "react-router-dom";
import { Leaf, TriangleAlert } from "lucide-react";
import type { Snack } from "@/lib/snacks-data";

interface SnackCardProps {
  snack: Snack;
}

const SnackCard = ({ snack }: SnackCardProps) => {
  return (
    <Link
      to={`/snack/${snack.slug}`}
      className="block rounded-lg p-5 shadow-card bg-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{ transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)" }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-tight truncate">
              {snack.snack_name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {snack.brand_or_region}
            </p>
          </div>
          <div
            className={`flex items-center gap-1.5 shrink-0 rounded-sm px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
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
  );
};

export default SnackCard;
