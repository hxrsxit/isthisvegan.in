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
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed left-1/2 top-0 z-50 w-full -translate-x-1/2 px-4 pt-4"
    >
      <nav
        className="container flex h-14 items-center justify-between rounded-full border border-ethereal-border bg-white/80 px-5 shadow-ethereal backdrop-blur-xl md:h-16 md:px-6"
        aria-label="Main navigation"
      >
        <Logo size={28} />

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethereal-accent focus-visible:ring-offset-2 ${
                location.pathname === link.to
                  ? "bg-ethereal-accent text-white"
                  : "text-ethereal-text-muted hover:bg-ethereal-border/50 hover:text-ethereal-text"
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
              className="rounded-2xl p-2.5 text-ethereal-text-muted transition-colors hover:bg-ethereal-border/50 hover:text-ethereal-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethereal-accent focus-visible:ring-offset-2"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-ethereal-border bg-white/95 backdrop-blur-xl">
            <nav className="mt-8 flex flex-col gap-2" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethereal-accent focus-visible:ring-offset-2 ${
                    location.pathname === link.to
                      ? "bg-ethereal-accent text-white"
                      : "text-ethereal-text-muted hover:bg-ethereal-border/50 hover:text-ethereal-text"
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
