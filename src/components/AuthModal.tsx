import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { X, LogIn, UserPlus, AlertCircle, CheckCircle2, Leaf } from "lucide-react";

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
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

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(error.message);
    }
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

        {/* Quick Google Sign In */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2.5 rounded-full border border-[#e3e7e2] bg-white py-2.5 px-4 font-sans-ui text-xs font-semibold text-[#1c211e] shadow-2xs hover:bg-[#f0f3ef] hover:border-[#354338] transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e3e7e2]" />
          </div>
          <span className="relative bg-[#f8f7f4] px-3 text-[11px] font-sans-ui font-semibold text-[#5a655c] uppercase">
            or with email
          </span>
        </div>

        {/* Auth Mode Toggle */}
        <div className="mb-4 flex rounded-full border border-[#e3e7e2] bg-white p-1">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMsg(null);
            }}
            className={`flex-1 rounded-full py-1.5 text-xs font-semibold transition-all ${mode === "signin"
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
            className={`flex-1 rounded-full py-1.5 text-xs font-semibold transition-all ${mode === "signup"
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
