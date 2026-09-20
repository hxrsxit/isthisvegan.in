import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { X, LogIn, UserPlus, AlertCircle, CheckCircle2, Leaf } from "lucide-react";

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleClose = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setEmail("");
    setPassword("");
    setName("");
    setAuthModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signin") {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          handleClose();
        }
      } else {
        const { error } = await signUpWithEmail(email, password, name);
        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg("Account created! Check your email to confirm registration or sign in.");
          setTimeout(() => {
            setMode("signin");
            setSuccessMsg(null);
          }, 2500);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#f8f7f4] border border-[#e3e7e2] p-6 sm:p-8 shadow-2xl text-[#1c211e]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#5a655c] hover:bg-[#e2e7e0] hover:text-[#1c211e] transition-colors"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#354338] text-white shadow-xs">
            <Leaf size={20} strokeWidth={2} />
          </div>
          <div>
            <h2 className="font-serif-fraunces text-xl font-bold text-[#1c211e]">
              {mode === "signin" ? "Welcome Back" : "Join the Community"}
            </h2>
            <p className="font-sans-ui text-xs text-[#5a655c]">
              {mode === "signin"
                ? "Sign in to post comments & verification notes"
                : "Create an account to participate in product reviews"}
            </p>
          </div>
        </div>

        {/* Auth Mode Toggle */}
        <div className="my-5 flex rounded-full border border-[#e3e7e2] bg-white p-1">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMsg(null);
            }}
            className={`flex-1 rounded-full py-1.5 text-xs font-semibold transition-all ${
              mode === "signin"
                ? "bg-[#354338] text-white shadow-xs"
                : "text-[#5a655c] hover:text-[#1c211e]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMsg(null);
            }}
            className={`flex-1 rounded-full py-1.5 text-xs font-semibold transition-all ${
              mode === "signup"
                ? "bg-[#354338] text-white shadow-xs"
                : "text-[#5a655c] hover:text-[#1c211e]"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#f9eee9] border border-[#e5c5bd] p-3 text-xs text-[#7d3c34]">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#e6ece7] border border-[#b2c2b5] p-3 text-xs text-[#2c3d31]">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-sans-ui">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-[#1c211e] mb-1">
                Full Name / Username
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full rounded-xl border border-[#e3e7e2] bg-white px-3.5 py-2.5 text-xs text-[#1c211e] focus:border-[#354338] focus:outline-hidden"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1c211e] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[#e3e7e2] bg-white px-3.5 py-2.5 text-xs text-[#1c211e] focus:border-[#354338] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c211e] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#e3e7e2] bg-white px-3.5 py-2.5 text-xs text-[#1c211e] focus:border-[#354338] focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#354338] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#2d3a30] disabled:opacity-50 cursor-pointer transition-colors"
          >
            {submitting ? (
              <span>Processing...</span>
            ) : mode === "signin" ? (
              <>
                <LogIn size={15} />
                <span>Sign In</span>
              </>
            ) : (
              <>
                <UserPlus size={15} />
                <span>Register</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
