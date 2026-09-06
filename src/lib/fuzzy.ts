import { Snack, parseArrayField, parseJsonObjectField, ProductMetadata } from "./snacks-data";

/**
 * Helper file for typo-tolerant fuzzy matching (similar to Algolia/Elasticsearch edit distance matching)
 */

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
    s.is_vegan ? "vegan accidentally-vegan" : "non-vegan not-vegan dairy",
    meta.regional_cuisine || "",
    meta.packaging_status || "",
    meta.health_tier || "",
    ...dietary,
    ...allergens,
    ...hidden,
    ...tags,
  ];

  return keys.filter(Boolean);
}

/**
 * Searches an array of items with typo tolerance, imitating big-firm enterprise search algorithms.
 */
export function searchWithTypoTolerance<T>(
  items: T[], 
  query: string, 
  getKeys: (item: T) => string[]
): T[] {
  if (!query.trim()) return items;

  const qWords = query.toLowerCase().split(/\s+/).filter(Boolean);

  const scoredItems = items.map(item => {
    const textValues = getKeys(item).map(v => (v || '').toLowerCase());
    
    let totalScore = 0;
    let isMatch = true;

    for (const qw of qWords) {
      const allowedTypos = qw.length <= 3 ? 0 : qw.length <= 6 ? 1 : 2;
      let bestWordScore = Infinity;

      for (const textValue of textValues) {
        if (textValue.includes(qw)) {
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
      
      totalScore += bestWordScore;
    }

    return { item, score: totalScore, isMatch };
  });

  return scoredItems
    .filter(res => res.isMatch)
    .sort((a, b) => a.score - b.score)
    .map(res => res.item);
}
