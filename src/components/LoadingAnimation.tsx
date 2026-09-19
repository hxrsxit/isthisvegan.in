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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex flex-col items-center justify-center w-full ${className}`}
      >
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "56px", height: "56px",
            borderRadius: "50%",
            backgroundColor: "var(--sage-100)",
            marginBottom: "var(--s-2)",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Leaf size={24} strokeWidth={1.5} style={{ color: "var(--forest)" }} />
          </motion.div>
        </div>
        <p style={{ fontFamily: "var(--font)", fontSize: "var(--fs-small)", color: "var(--stone)", fontWeight: 400 }}>
          {message}
        </p>
      </motion.div>
    );
  }
);

LoadingAnimation.displayName = "LoadingAnimation";
