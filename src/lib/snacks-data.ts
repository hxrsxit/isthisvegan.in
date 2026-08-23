export interface Snack {
  id: number;
  slug: string;
  name: string;
  brand: string | null;
  is_vegan: boolean;
  main_category: string | null;
  tags: string[] | null;
  amazon_search_url: string | null;
  verdict_summary: string | null;
  hidden_animal_ingredients: string[] | null;
  detailed_analysis: string | null;
  vegan_alternatives: string[] | null;
}