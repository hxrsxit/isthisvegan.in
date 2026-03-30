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
 * Searches an array of items with typo tolerance, imitating big-firm enterprise search algorithms.
 * 
 * Rules:
 * 1. Queries with length <= 3: exact match required (0 typos)
 * 2. Queries with length 4-6: 1 typo allowed
 * 3. Queries with length >= 7: 2 typos allowed
 * 4. Matches prefix of words as well (so "chocola" matches "chocolate").
 * 5. Returns items sorted by relevance (fewer typos rank higher).
 */
export function searchWithTypoTolerance<T>(
  items: T[], 
  query: string, 
  getKeys: (item: T) => string[]
): T[] {
  if (!query.trim()) return items;

  const qWords = query.toLowerCase().split(/\s+/).filter(Boolean);

  const scoredItems = items.map(item => {
    // Collect all searchable text fields, split them into words to test against
    const textValues = getKeys(item).map(v => (v || '').toLowerCase());
    
    let totalScore = 0;
    let isMatch = true;

    // Every word in the query must match *something* in the item's text values
    for (const qw of qWords) {
      // Algolia/Elasticsearch style dynamic thresholding based on word length
      const allowedTypos = qw.length <= 3 ? 0 : qw.length <= 6 ? 1 : 2;
      
      let bestWordScore = Infinity; // Lower is better (0 = exact match)

      for (const textValue of textValues) {
        // Fast path: exact substring match (0 typos)
        if (textValue.includes(qw)) {
          bestWordScore = 0;
          break;
        }

        // Fuzzy path: compare query word with every word in the text value
        const tWords = textValue.split(/[\s\-]+/); // Split by space or hyphen
        for (const tw of tWords) {
          // Compare against full word
          const distFull = levenshteinDistance(qw, tw);
          // Compare against prefix of the word (for partial typing)
          const prefixDist = tw.length >= qw.length 
            ? levenshteinDistance(qw, tw.substring(0, qw.length)) 
            : Infinity;
          
          const minDist = Math.min(distFull, prefixDist);

          if (minDist <= allowedTypos) {
            bestWordScore = Math.min(bestWordScore, minDist);
          }
        }
      }

      // If we couldn't find a matching word within the allowed typo threshold, this item fails
      if (bestWordScore > allowedTypos) {
        isMatch = false;
        break;
      }
      
      totalScore += bestWordScore;
    }

    return { item, score: totalScore, isMatch };
  });

  // Filter out non-matching items and sort by the lowest score (most relevant first)
  return scoredItems
    .filter(res => res.isMatch)
    .sort((a, b) => a.score - b.score)
    .map(res => res.item);
}
