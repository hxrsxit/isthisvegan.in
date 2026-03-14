export interface Snack {
  slug: string;
  snack_name: string;
  brand_or_region: string;
  is_vegan: boolean;
  hidden_ingredients: string | null;
  instructions_to_veganise: string | null;
  comments: string | null;
  short_description: string | null;
  amazon_search_url: string | null;
}