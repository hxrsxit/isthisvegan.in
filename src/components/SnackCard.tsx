import { Link, useNavigate } from "react-router-dom";
import { Leaf, TriangleAlert, HelpCircle } from "lucide-react";
import { Snack, parseJsonObjectField, ProductMetadata } from "@/lib/snacks-data";

interface SnackCardProps {
  snack: Snack;
  index?: number;
}

export default function SnackCard({ snack, index = 0 }: SnackCardProps) {
  const navigate = useNavigate();
  const metadata = parseJsonObjectField<ProductMetadata>(snack.product_metadata, {});

  // Category: prefer sub_type → food_type → product_class
  const category = snack.sub_type || snack.food_type || snack.product_class || "";

  // Health tier — only surface clearly positive ones in the list
  const healthTier = metadata.health_tier || "";
  const showHealthy = healthTier.startsWith("1") || healthTier.startsWith("2");

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (snack.brand) {
      navigate(`/?brand=${encodeURIComponent(snack.brand)}`);
    }
  };

  const handleCardClick = () => {
    sessionStorage.setItem("isthisvegan_scroll_pos", window.scrollY.toString());
    sessionStorage.setItem("isthisvegan_last_slug", snack.slug);
    sessionStorage.setItem("isthisvegan_last_url", window.location.pathname + window.location.search);
    const visibleCards = document.querySelectorAll("[id^='snack-card-']");
    if (visibleCards.length > 0) {
      sessionStorage.setItem("isthisvegan_display_count", visibleCards.length.toString());
    }
  };

  // Verdict badge content
  const VerdictBadge = () => {
    if (snack.is_vegan === true) {
      return (
        <span className="verdict-badge verdict-badge--vegan" aria-label="Vegan">
          <Leaf size={11} strokeWidth={2.5} aria-hidden="true" />
          Vegan
        </span>
      );
    }
    if (snack.is_vegan === false) {
      return (
        <span className="verdict-badge verdict-badge--not-vegan" aria-label="Not vegan">
          <TriangleAlert size={11} strokeWidth={2.5} aria-hidden="true" />
          Not vegan
        </span>
      );
    }
    return (
      <span className="verdict-badge verdict-badge--unsure" aria-label="Check label">
        <HelpCircle size={11} strokeWidth={2.5} aria-hidden="true" />
        Check label
      </span>
    );
  };

  return (
    <div id={`snack-card-${snack.slug}`}>
      <Link
        to={`/snack/${snack.slug}`}
        onClick={handleCardClick}
        className="dir-row"
        style={{ display: "grid" }}
      >
        {/* Left: brand + name + category */}
        <div className="dir-row__left">
          {snack.brand && (
            <span
              className="dir-row__brand"
              onClick={handleBrandClick}
              title={`Filter by brand: ${snack.brand}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleBrandClick(e as any)}
            >
              {snack.brand}
            </span>
          )}
          <span className="dir-row__name">{snack.name}</span>
          {category && (
            <span className="dir-row__cat">{category}{showHealthy ? " · Healthy" : ""}</span>
          )}
        </div>

        {/* Right: verdict badge */}
        <div className="dir-row__right">
          <VerdictBadge />
        </div>
      </Link>
    </div>
  );
}
