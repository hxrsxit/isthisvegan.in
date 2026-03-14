import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Leaf, TriangleAlert, ExternalLink } from "lucide-react";
import { type Snack } from "@/lib/snacks-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase } from "@/supabaseClient";

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
      <div className="container py-16 text-center">
        <p className="text-lg text-muted-foreground">Loading snack details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 text-center">
        <p className="text-lg text-destructive">
          Failed to load snack details from Supabase.
        </p>
        <p className="text-sm text-muted-foreground mt-2 break-words">{error}</p>
        <Link to="/" className="text-primary underline mt-4 inline-block">
          ← Back to Search
        </Link>
      </div>
    );
  }

  if (!snack) {
    return (
      <div className="container py-16 text-center">
        <p className="text-lg text-muted-foreground">Snack not found.</p>
        <Link to="/" className="text-primary underline mt-4 inline-block">
          ← Back to Search
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="container max-w-3xl py-8 md:py-12"
    >
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full px-3 py-1.5 hover:bg-accent"
      >
        <ArrowLeft size={16} />
        Back to Search
      </Link>

      {/* Verdict */}
      <div
        className={`rounded-3xl p-6 md:p-8 mb-8 ${
          snack.is_vegan ? "bg-safe/10" : "bg-destructive/10"
        }`}
      >
        <div className="flex items-center gap-4">
          {snack.is_vegan ? (
            <div className="w-14 h-14 rounded-2xl bg-safe/20 flex items-center justify-center shrink-0">
              <Leaf size={28} className="text-safe" aria-hidden="true" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-destructive/20 flex items-center justify-center shrink-0">
              <TriangleAlert size={28} className="text-destructive" aria-hidden="true" />
            </div>
          )}
          <div>
            <span
              className={`inline-block text-sm font-semibold uppercase tracking-widest mb-1 ${
                snack.is_vegan ? "text-safe" : "text-destructive"
              }`}
            >
              {snack.is_vegan ? "Vegan" : "Not Vegan"}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold">{snack.snack_name}</h1>
            <p className="text-muted-foreground mt-1">{snack.brand_or_region}</p>
          </div>
        </div>
      </div>

      {/* Hidden ingredients warning */}
      {!snack.is_vegan && snack.hidden_ingredients && (
        <Alert variant="destructive" className="mb-6 rounded-2xl">
          <TriangleAlert size={18} />
          <AlertTitle className="font-semibold">Hidden Ingredients</AlertTitle>
          <AlertDescription className="tabular-nums">
            {snack.hidden_ingredients}
          </AlertDescription>
        </Alert>
      )}

      {/* Hack Box */}
      {snack.instructions_to_veganise && (
        <div className="mb-8 p-6 bg-safe text-safe-foreground rounded-3xl shadow-card">
          <p className="text-xs uppercase tracking-widest mb-2 opacity-80">
            Show this to the vendor:
          </p>
          <p className="text-xl md:text-2xl font-bold leading-tight">
            {snack.instructions_to_veganise}
          </p>
        </div>
      )}

      {/* Description & Comments */}
      {(snack.short_description || snack.comments) && (
        <div className="space-y-4 mb-8">
          {snack.short_description && (
            <p className="text-base leading-relaxed">{snack.short_description}</p>
          )}
          {snack.comments && (
            <p className="text-base leading-relaxed text-muted-foreground">
              {snack.comments}
            </p>
          )}
        </div>
      )}

      {/* Amazon CTA */}
      {snack.amazon_search_url && (
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <Button
            asChild
            size="lg"
            className="w-full h-14 text-base font-semibold rounded-2xl"
          >
            <a
              href={snack.amazon_search_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Check price of ${snack.snack_name} on Amazon`}
            >
              <ExternalLink size={18} className="mr-2" />
              Check Price / Buy on Amazon
            </a>
          </Button>
        </motion.div>
      )}

      {/* Report */}
      <div className="mt-12 text-center botanical-watermark">
        <a
          href="mailto:hello@isthisvegan.in?subject=Recipe Update Report"
          className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
        >
          Did the recipe change? Report an update.
        </a>
      </div>
    </motion.div>
  );
};

export default SnackDetail;
