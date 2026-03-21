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
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 border-b border-[#01472e]/10 bg-[#fefae0]/80 backdrop-blur-xl"
    >
      <nav
        className="container flex h-16 items-center justify-between gap-3"
        aria-label="Main navigation"
      >
        <Logo size={28} />

        <div className="hidden rounded-full border border-white/35 bg-[#ffffff1a] p-1 md:flex md:items-center md:gap-1 md:backdrop-blur-[20px]">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01472e]/30 focus-visible:ring-offset-2 ${
                location.pathname === link.to
                  ? "bg-[#01472e] text-[#fefae0]"
                  : "text-[#01472e]/75 hover:bg-white/40 hover:text-[#01472e]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <div className="rounded-full bg-white px-3 py-1.5 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.3em] text-[#01472e] shadow-[0_14px_28px_rgba(1,71,46,0.12)]">
            Browse
          </div>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button
              aria-label="Open navigation menu"
              className="rounded-2xl p-2.5 text-[#01472e]/70 transition-colors hover:bg-[#01472e]/10 hover:text-[#01472e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01472e]/30 focus-visible:ring-offset-2"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-[#01472e]/15 bg-[#fefae0]/95 backdrop-blur-xl">
            <nav className="mt-8 flex flex-col gap-2" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01472e]/30 focus-visible:ring-offset-2 ${
                    location.pathname === link.to
                      ? "bg-[#01472e] text-[#fefae0]"
                      : "text-[#01472e]/80 hover:bg-[#01472e]/10 hover:text-[#01472e]"
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
