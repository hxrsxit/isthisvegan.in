import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Leaf, TriangleAlert, ExternalLink } from "lucide-react";
import { type Snack } from "@/lib/snacks-data";
import { supabase } from "@/supabaseClient";
import { motion } from "framer-motion";
import { landingTheme, landingNoiseBackground } from "@/lib/theme";

const SnackDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [snack, setSnack] = useState<Snack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchSnack = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from<Snack>("indian-snacks")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        setError(error.message);
        setSnack(null);
      } else {
        setSnack(data ?? null);
      }

      setLoading(false);
    };

    fetchSnack();
  }, [slug]);

  if (loading) {
    return (
      <div style={landingTheme} className="flex min-h-screen items-center justify-center bg-[hsl(var(--landing-cream))] text-[hsl(var(--landing-forest))]">
        <p className="font-['Inter'] text-[12px] font-bold uppercase tracking-[0.28em] text-[hsl(var(--landing-forest)/0.7)] animate-pulse">Loading details...</p>
      </div>
    );
  }

  if (error || !snack) {
    return (
      <div style={landingTheme} className="relative flex min-h-screen flex-col items-center justify-center bg-[hsl(var(--landing-cream))] text-[hsl(var(--landing-forest))] px-4 text-center">
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04]" style={{ backgroundImage: landingNoiseBackground }} />
        <div className="relative z-10">
          <p className="font-['Anton'] text-4xl mb-2">{error ? "Error Loading Data" : "Snack Not Found"}</p>
          {error && <p className="font-['Inter'] text-sm text-[hsl(var(--landing-forest)/0.7)] mt-2 break-words max-w-md">{error}</p>}
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--landing-forest)/0.08)] bg-[hsl(var(--landing-cream)/0.42)] px-4 py-2 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.28em] text-[hsl(var(--landing-forest)/0.72)] shadow-[0_20px_50px_hsl(var(--landing-shadow))] backdrop-blur-[20px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:bg-[hsl(var(--landing-cream)/0.8)] hover:text-[hsl(var(--landing-forest))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--landing-forest)/0.3)] focus-visible:ring-offset-2"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={landingTheme} className="relative min-h-screen overflow-hidden bg-[hsl(var(--landing-cream))] text-[hsl(var(--landing-forest))]">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04]" style={{ backgroundImage: landingNoiseBackground }} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 container max-w-3xl py-8 md:py-12"
      >
        {/* Back */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--landing-forest)/0.08)] bg-[hsl(var(--landing-cream)/0.42)] px-4 py-2 font-['Inter'] text-[10px] font-bold uppercase tracking-[0.28em] text-[hsl(var(--landing-forest)/0.72)] shadow-[0_10px_30px_hsl(var(--landing-shadow))] backdrop-blur-[20px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:bg-[hsl(var(--landing-cream)/0.8)] hover:text-[hsl(var(--landing-forest))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--landing-forest)/0.3)] focus-visible:ring-offset-2"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back to Search
        </Link>

        {/* Verdict */}
        <div
          className={`mb-8 overflow-hidden rounded-[2rem] border border-[hsl(var(--landing-forest)/0.08)] ${
            snack.is_vegan ? "bg-[hsl(var(--landing-sage)/0.2)]" : "bg-destructive/5"
          } p-6 shadow-[0_20px_50px_hsl(var(--landing-shadow))] backdrop-blur-[20px] md:p-8`}
        >
          <div className="flex items-center gap-4">
            {snack.is_vegan ? (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-[hsl(var(--landing-forest))] shadow-md">
                <Leaf size={32} strokeWidth={1.5} className="text-[hsl(var(--landing-cream))]" aria-hidden="true" />
              </div>
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-destructive/10 border border-destructive/20 shadow-md">
                <TriangleAlert size={32} strokeWidth={1.5} className="text-destructive" aria-hidden="true" />
              </div>
            )}
            <div>
              <span
                className={`inline-block font-['Inter'] text-[10px] font-bold uppercase tracking-[0.3em] mb-1 ${
                  snack.is_vegan ? "text-[hsl(var(--landing-forest))]" : "text-destructive"
                }`}
              >
                {snack.is_vegan ? "Vegan" : "Not Vegan"}
              </span>
              <h1 className="font-['Anton'] text-3xl md:text-5xl tracking-normal">{snack.snack_name}</h1>
              <p className="font-['Inter'] text-sm text-[hsl(var(--landing-forest)/0.7)] mt-1 tracking-wide">{snack.brand_or_region}</p>
            </div>
          </div>
        </div>

        {/* Hidden ingredients warning */}
        {!snack.is_vegan && snack.hidden_ingredients && (
          <div className="mb-6 flex gap-3 rounded-[2rem] border border-destructive/20 bg-destructive/5 p-6 shadow-[0_10px_30px_hsl(var(--landing-shadow))] backdrop-blur-[20px]">
            <TriangleAlert size={20} className="text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-['Inter'] text-sm font-bold uppercase tracking-wider text-destructive mb-1">Hidden Ingredients</h3>
              <p className="font-['Inter'] text-base text-destructive/90">{snack.hidden_ingredients}</p>
            </div>
          </div>
        )}

        {/* Hack Box */}
        {snack.instructions_to_veganise && (
          <div className="mb-8 rounded-[2rem] border border-[hsl(var(--landing-forest)/0.2)] bg-[hsl(var(--landing-forest))] p-6 text-[hsl(var(--landing-cream))] shadow-[0_20px_50px_hsl(var(--landing-shadow))] backdrop-blur-[20px]">
            <p className="font-['Inter'] text-[10px] font-bold uppercase tracking-[0.28em] opacity-80 mb-2">Show this to the vendor:</p>
            <p className="font-['Anton'] text-2xl md:text-3xl tracking-wide">{snack.instructions_to_veganise}</p>
          </div>
        )}

        {/* Description & Comments */}
        {(snack.short_description || snack.comments) && (
          <div className="space-y-4 mb-8">
            {snack.short_description && (
              <p className="font-['Inter'] text-base leading-relaxed text-[hsl(var(--landing-forest)/0.85)]">{snack.short_description}</p>
            )}
            {snack.comments && (
              <p className="font-['Inter'] text-base leading-relaxed text-[hsl(var(--landing-forest)/0.65)]">{snack.comments}</p>
            )}
          </div>
        )}

        {/* Amazon CTA */}
        {snack.amazon_search_url && (
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <a
              href={snack.amazon_search_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Check price of ${snack.snack_name} on Amazon`}
              className="flex h-14 w-full items-center justify-center rounded-full border border-[hsl(var(--landing-forest)/0.08)] bg-[hsl(var(--landing-cream)/0.7)] px-4 py-2 font-['Inter'] text-[12px] font-bold uppercase tracking-[0.28em] text-[hsl(var(--landing-forest))] shadow-[0_20px_50px_hsl(var(--landing-shadow))] backdrop-blur-[20px] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[hsl(var(--landing-cream)/0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--landing-forest)/0.3)] focus-visible:ring-offset-2"
            >
              <ExternalLink size={18} className="mr-2" />
              Check Price / Buy on Amazon
            </a>
          </motion.div>
        )}

        {/* Report */}
        <div className="mt-12 text-center botanical-watermark pb-8">
          <a
            href="mailto:hello@isthisvegan.in?subject=Recipe Update Report"
            className="font-['Inter'] text-xs font-bold uppercase tracking-[0.15em] text-[hsl(var(--landing-forest)/0.4)] transition-opacity hover:opacity-80"
          >
            Did the recipe change? Report an update.
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default SnackDetail;
