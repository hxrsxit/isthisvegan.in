import { Snack, parseArrayField, parseJsonObjectField, ProductMetadata } from "./snacks-data";

// Calculates the Damerau-Levenshtein distance between two strings
function levenshteinDistance(s1: string, s2: string): number {
  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;

  const dp = Array.from({ length: s1.length + 1 }, () => Array(s2.length + 1).fill(0));

  for (let i = 0; i <= s1.length; i++) dp[i][0] = i;
  for (let j = 0; j <= s2.length; j++) dp[0][j] = j;

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        );
      }
    }
  }

  return dp[s1.length][s2.length];
}

/**
 * Extract all indexable text values from a Snack object for multi-attribute fuzzy search.
 */
export function getSnackSearchKeys(s: Snack): string[] {
  const meta = parseJsonObjectField<ProductMetadata>(s.product_metadata, {});
  const dietary = parseArrayField(s.dietary_compatibility);
  const allergens = parseArrayField(s.allergens_list);
  const hidden = parseArrayField(s.hidden_animal_ingredients);
  const tags = parseArrayField(s.tags);

  const taste = meta.taste_profile;
  const tasteKeys = taste ? [taste.sweetness ? `sweet-${taste.sweetness}` : "", taste.spiciness ? `spicy-${taste.spiciness}` : ""] : [];

  const keys: string[] = [
    s.name || "",
    s.brand || "",
    s.product_class || "",
    s.food_type || "",
    s.sub_type || "",
    s.main_category || "",
    s.verdict_summary || "",
    s.enhanced_description || "",
    s.detailed_analysis || "",
    s.is_vegan ? "vegan plant-based dairy-free" : "non-vegan not-vegan milk dairy ghee",
    meta.regional_cuisine || "",
    meta.packaging_status || "",
    meta.health_tier || "",
    ...dietary,
    ...allergens,
    ...hidden,
    ...tags,
    ...tasteKeys
  ];

  return keys.filter(Boolean);
}

/**
 * Enhanced semantic search with smart scoring & typo tolerance.
 */
export function searchWithTypoTolerance(
  items: Snack[], 
  query: string, 
  getKeys: (item: Snack) => string[]
): Snack[] {
  if (!query.trim()) return items;

  const rawQuery = query.toLowerCase().trim();
  const qWords = rawQuery.split(/[\s,]+/).filter(Boolean);

  const scoredItems = items.map(item => {
    const meta = parseJsonObjectField<ProductMetadata>(item.product_metadata, {});
    const dietary = parseArrayField(item.dietary_compatibility).map(d => d.toLowerCase());
    const subType = (item.sub_type || "").toLowerCase();
    const foodType = (item.food_type || "").toLowerCase();
    const pClass = (item.product_class || "").toLowerCase();

    const textValues = getKeys(item).map(v => (v || '').toLowerCase());

    let score = 0; // Lower is better (0 = exact match, negative = bonus boost)
    let isMatch = true;

    // Direct Intent Boosting
    if (rawQuery.includes("vegan") && !item.is_vegan) {
      score += 10; // Penalty for non-vegan if user explicitly searched "vegan"
    }

    if (rawQuery.includes("sweet")) {
      const isSweetType = ["chocolate", "biscuit", "cookie", "cake", "candy", "sweet", "halwa", "ice-cream", "pudding", "dessert"].some(
        st => subType.includes(st) || foodType.includes(st)
      );
      if (isSweetType) score -= 5; // Reward matching sweet products
    }

    if (rawQuery.includes("healthy")) {
      if (meta.health_tier?.startsWith("1") || meta.health_tier?.startsWith("2")) {
        score -= 5;
      } else if (meta.health_tier?.startsWith("4") || meta.health_tier?.startsWith("5")) {
        score += 8;
      }
    }

    if (rawQuery.includes("jain") && dietary.some(d => d.includes("jain"))) {
      score -= 5;
    }

    if (rawQuery.includes("gluten") && dietary.some(d => d.includes("gluten"))) {
      score -= 5;
    }

    for (const qw of qWords) {
      // Ignore common filler search terms in scoring calculation if query has multiple words
      if (qWords.length > 1 && ["food", "snacks", "snack", "item", "items"].includes(qw)) {
        continue;
      }

      const allowedTypos = qw.length <= 3 ? 0 : qw.length <= 6 ? 1 : 2;
      let bestWordScore = Infinity;

      for (const textValue of textValues) {
        if (textValue === qw || textValue.includes(qw)) {
          bestWordScore = 0;
          break;
        }

        const tWords = textValue.split(/[\s\-\/\_]+/);
        for (const tw of tWords) {
          const distFull = levenshteinDistance(qw, tw);
          const prefixDist = tw.length >= qw.length 
            ? levenshteinDistance(qw, tw.substring(0, qw.length)) 
            : Infinity;
          
          const minDist = Math.min(distFull, prefixDist);

          if (minDist <= allowedTypos) {
            bestWordScore = Math.min(bestWordScore, minDist);
          }
        }
      }

      if (bestWordScore > allowedTypos) {
        isMatch = false;
        break;
      }
      
      score += bestWordScore;
    }

    return { item, score, isMatch };
  });

  return scoredItems
    .filter(res => res.isMatch)
    .sort((a, b) => a.score - b.score)
    .map(res => res.item);
}
