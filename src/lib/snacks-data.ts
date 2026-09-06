export interface EthicalFlags {
  palm_oil_free?: boolean | null;
  cruelty_free_certified?: boolean | null;
  parent_company_vegan?: boolean | null;
  fssai_vegan_certified?: boolean | null;
  plastic_free_packaging?: boolean | null;
}

export interface TasteProfile {
  sweetness?: "High" | "Medium" | "Low" | "None" | string | null;
  spiciness?: "High" | "Medium" | "Low" | "None" | string | null;
  savory_umami?: boolean | null;
}

export interface NutritionEstimates {
  primary_macro?: "Carbohydrates" | "Fats" | "Protein" | "Balanced" | string | null;
  protein_tier?: "High" | "Medium" | "Low" | string | null;
}

export interface ProductMetadata {
  regional_cuisine?: string | null;
  packaging_status?: "Packaged-Normal" | "Ready-To-Eat" | "Street-Food" | "Homemade-Restaurant" | "Loose-Produce" | string | null;
  health_tier?: "1-Superfood/Whole" | "2-Healthy" | "3-Moderately-Healthy" | "4-Moderately-Unhealthy" | "5-Junk/Ultra-Processed/Very-Unhealthy" | string | null;
  ethical_flags?: EthicalFlags | null;
  vegan_confidence_score?: number | null; // 1-5
  cross_contamination_risk?: "None" | "May-Contain-Traces" | "Shared-Facility" | "Shared-Equipment" | "Vendor-Dependent" | string | null;
  brand_is_vegan_friendly?: boolean | null;
  taste_profile?: TasteProfile | null;
  nutrition_estimates?: NutritionEstimates | null;
  price_tier?: "$" | "$$" | "$$$" | "$$$$" | "$$$$$" | string | null;
  target_audience?: "Kids" | "Fitness-Enthusiasts" | "General" | string | null;
}

export interface UserPollStats {
  upvotes_as_vegan: number;
  reports_as_non_vegan: number;
  total_comments: number;
}

export interface Snack {
  id: number;
  slug: string;
  name: string;
  brand: string | null;
  is_vegan: boolean;
  
  // Taxonomy fields (v7)
  product_class?: string | null;
  food_type?: string | null;
  sub_type?: string | null;
  
  // Legacy / fallback fields
  main_category?: string | null;
  tags?: string[] | string | null;
  
  // Categorization & Allergen Arrays
  dietary_compatibility?: string[] | string | null;
  allergens_list?: string[] | string | null;
  hidden_animal_ingredients?: string[] | string | null;
  vegan_alternatives?: string[] | string | null;
  
  // Content & SEO
  amazon_search_url?: string | null;
  verdict_summary?: string | null;
  enhanced_description?: string | null;
  detailed_analysis?: string | null;
  diy_vegan_recipe_or_hack?: string | null;
  
  // Rich JSON metadata & poll stats
  product_metadata?: ProductMetadata | string | null;
  user_poll_stats?: UserPollStats | string | null;
  last_verified_date?: string | null;
}

/**
 * Safely parses any array field (whether returned as JSON string or native array)
 */
export function parseArrayField(field: any): string[] {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // If comma-separated or simple text
      return field ? [field] : [];
    }
  }
  return [];
}

/**
 * Safely parses a JSON object field (like product_metadata or user_poll_stats)
 */
export function parseJsonObjectField<T>(field: any, fallback: T): T {
  if (!field) return fallback;
  if (typeof field === "object") return field as T;
  if (typeof field === "string") {
    try {
      return JSON.parse(field) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}