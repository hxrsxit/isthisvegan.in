import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/go-vegan", label: "Go Vegan" },
  { to: "/about", label: "About Us" },
  { to: "/join-us", label: "Join Us" },
];

const Header = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { user, openAuthModal, signOut } = useAuth();

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Member";

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 border-b border-[#e3e7e2] bg-[#f8f7f4]/90 backdrop-blur-md"
    >
      <nav
        className="container max-w-7xl flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Logo showText size={36} textClassName="text-[#1c211e] font-black-mango font-bold text-xl tracking-wide" />

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-1 rounded-full border border-[#e3e7e2] bg-white p-1 shadow-xs">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-full px-4 py-1.5 font-sans-ui text-xs font-semibold tracking-wide transition-all ${
                  location.pathname === link.to
                    ? "bg-[#354338] text-white shadow-xs"
                    : "text-[#5a655c] hover:bg-[#f0f3ef] hover:text-[#1c211e]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-2 rounded-full border border-[#e3e7e2] bg-white px-3 py-1 shadow-xs font-sans-ui text-xs text-[#1c211e]">
              <UserIcon size={14} className="text-[#354338]" />
              <span className="font-semibold max-w-[120px] truncate">{userName}</span>
              <button
                onClick={signOut}
                title="Sign Out"
                className="ml-1 text-[#5a655c] hover:text-[#7d3c34] transition-colors cursor-pointer"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#354338] px-4 py-1.5 font-sans-ui text-xs font-semibold text-white shadow-xs hover:bg-[#2d3a30] transition-colors cursor-pointer"
            >
              <LogIn size={14} />
              Sign In
            </button>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button
              aria-label="Open navigation menu"
              className="rounded-lg p-2 text-[#5a655c] hover:bg-[#e2e7e0] hover:text-[#1c211e]"
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-[#e3e7e2] bg-[#f8f7f4] backdrop-blur-xl">
            <nav className="mt-8 flex flex-col gap-2" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition-colors ${
                    location.pathname === link.to
                      ? "bg-[#354338] text-white"
                      : "text-[#1c211e] hover:bg-[#e2e7e0]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-6 pt-6 border-t border-[#e3e7e2]">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1c211e]">
                      <UserIcon size={16} className="text-[#354338]" />
                      <span>{userName}</span>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#e3e7e2] bg-white py-2.5 text-xs font-semibold text-[#7d3c34]"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      openAuthModal();
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#354338] py-2.5 text-xs font-semibold text-white shadow-xs"
                  >
                    <LogIn size={16} />
                    Sign In / Register
                  </button>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </motion.header>
  );
};

export default Header;
