import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";

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
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 border-b border-[#e8e6e1] bg-[#fafaf8]/90 backdrop-blur-xl"
    >
      <nav
        className="container flex h-16 items-center justify-between gap-3"
        aria-label="Main navigation"
      >
        <Logo showText size={38} textClassName="text-[#1a1f2e]" />

        <div className="hidden rounded-lg border border-[#e8e6e1] bg-white p-1 md:flex md:items-center md:gap-1 shadow-2xs">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
                location.pathname === link.to
                  ? "bg-[#7c9082] text-white"
                  : "text-[#6b7280] hover:bg-[#fafaf8] hover:text-[#1a1f2e]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button
              aria-label="Open navigation menu"
              className="rounded-lg p-2 text-[#6b7280] hover:bg-[#e8e6e1] hover:text-[#1a1f2e]"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-[#e8e6e1] bg-[#f8f7f4] backdrop-blur-xl">
            <nav className="mt-8 flex flex-col gap-2" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "bg-[#7c9082] text-white"
                      : "text-[#1a1f2e] hover:bg-[#e8e6e1]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </motion.header>
  );
};

export default Header;
