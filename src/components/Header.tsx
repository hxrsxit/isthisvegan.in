import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/go-vegan", label: "Go Vegan" },
  { to: "/about", label: "About Us" },
  { to: "/join-us", label: "Join Us" },
];

const Header = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        borderColor: "var(--hairline)",
        backgroundColor: "color-mix(in srgb, var(--mist) 92%, transparent)",
      }}
    >
      <nav
        className="flex h-14 items-center justify-between gap-4"
        style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Logo
          showText
          size={32}
          textClassName="font-black-mango font-semibold text-base tracking-tight"
          className=""
        />

        {/* Desktop nav — plain text links, active underlined */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium transition-colors"
                style={{
                  color: isActive ? "var(--forest)" : "var(--stone)",
                  textDecoration: isActive ? "underline" : "none",
                  textDecorationColor: "var(--forest)",
                  textUnderlineOffset: "4px",
                  textDecorationThickness: "1.5px",
                }}
                onMouseEnter={(e) => { if (!isActive) (e.target as HTMLElement).style.color = "var(--ink)"; }}
                onMouseLeave={(e) => { if (!isActive) (e.target as HTMLElement).style.color = "var(--stone)"; }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <button
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
          style={{ color: "var(--stone)" }}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      {open && (
        <div
          className="md:hidden border-t"
          style={{ borderColor: "var(--hairline)", backgroundColor: "var(--mist)" }}
        >
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-6 py-4 text-base font-medium border-b transition-colors"
                  style={{
                    borderColor: "var(--hairline)",
                    color: isActive ? "var(--forest)" : "var(--ink)",
                    backgroundColor: isActive ? "var(--sage-100)" : "transparent",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
