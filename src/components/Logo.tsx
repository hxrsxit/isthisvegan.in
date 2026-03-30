import { Link } from "react-router-dom";
import logoImage from "@/assets/is-this-vegan-logo.png";

interface LogoProps {
  /** Show "Is This Vegan?" text next to the logo */
  showText?: boolean;
  /** Optional class for the wrapper link */
  className?: string;
  /** Optional class for the text (e.g. text-ethereal-text on landing) */
  textClassName?: string;
  /** Logo image height (width scales to preserve aspect) */
  size?: number;
}

const Logo = ({ showText = false, className = "", textClassName, size = 32 }: LogoProps) => (
  <Link
    to="/"
    className={`inline-flex items-center gap-2.5 ${className}`}
    aria-label="Is This Vegan? – Home"
  >
    <img
      src={logoImage}
      alt=""
      width={size}
      height={size}
      className="object-contain"
      style={{ width: size, height: size }}
      onError={(e) => {
        e.currentTarget.src = "/IsThisVegan_logo.png";
      }}
    />
    {showText && (
      <span className={`font-['Inter'] text-lg font-semibold tracking-tight ${textClassName ?? "text-foreground"}`}>
        Is This Vegan?
      </span>
    )}
  </Link>
);

export default Logo;
