import { Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { forwardRef } from "react";

interface LoadingAnimationProps {
  message?: string;
  className?: string;
}

export const LoadingAnimation = forwardRef<HTMLDivElement, LoadingAnimationProps>(
  ({ message = "Reading the ingredient lists...", className = "py-16" }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`flex flex-col items-center justify-center w-full ${className}`}
      >
        <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-[#ccd5ae]/40 mb-4 shadow-[0_10px_30px_rgba(1,71,46,0.1)]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Leaf size={28} strokeWidth={1.5} className="text-[#01472e]" />
          </motion.div>
        </div>
        <p className="font-['Inter'] text-[15px] font-medium tracking-wide text-[#01472e] animate-pulse">
          {message}
        </p>
      </motion.div>
    );
  }
);

LoadingAnimation.displayName = "LoadingAnimation";
