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

export const snacksData: Snack[] = [
  {
    slug: "parle-g-biscuits",
    snack_name: "Parle-G Biscuits",
    brand_or_region: "Parle",
    is_vegan: false,
    hidden_ingredients: "Contains milk solids (0.4%), butter fat",
    instructions_to_veganise: "Try Parle 20-20 Cashew Butter Cookies instead — fully plant-based.",
    comments: "India's most iconic biscuit. Unfortunately contains dairy derivatives in small quantities.",
    short_description: "The classic glucose biscuit found in every Indian household.",
    amazon_search_url: "https://www.amazon.in/s?k=parle+g+biscuits",
  },
  {
    slug: "haldirams-aloo-bhujia",
    snack_name: "Haldiram's Aloo Bhujia",
    brand_or_region: "Haldiram's",
    is_vegan: true,
    hidden_ingredients: null,
    instructions_to_veganise: null,
    comments: "A safe, fully plant-based snack. Made from potato, chickpea flour, and spices.",
    short_description: "Crispy potato-based namkeen from Haldiram's.",
    amazon_search_url: "https://www.amazon.in/s?k=haldirams+aloo+bhujia",
  },
  {
    slug: "britannia-good-day",
    snack_name: "Britannia Good Day",
    brand_or_region: "Britannia",
    is_vegan: false,
    hidden_ingredients: "Contains butter (15%), milk solids, whey protein",
    instructions_to_veganise: "Switch to Unibic Oatmeal Digestive — no dairy.",
    comments: "Heavily dairy-laden. The butter is the primary flavoring agent.",
    short_description: "Popular butter cookie range from Britannia.",
    amazon_search_url: "https://www.amazon.in/s?k=britannia+good+day",
  },
  {
    slug: "bikaji-bhujia-sev",
    snack_name: "Bikaji Bhujia Sev",
    brand_or_region: "Bikaji / Bikaner",
    is_vegan: true,
    hidden_ingredients: null,
    instructions_to_veganise: null,
    comments: "Traditional Bikaneri bhujia. All plant-based ingredients — chickpea flour, peanut oil, spices.",
    short_description: "Authentic Rajasthani bhujia sev.",
    amazon_search_url: "https://www.amazon.in/s?k=bikaji+bhujia",
  },
  {
    slug: "kurkure-masala-munch",
    snack_name: "Kurkure Masala Munch",
    brand_or_region: "PepsiCo / Kurkure",
    is_vegan: false,
    hidden_ingredients: "Contains dried cheese powder, milk solids",
    instructions_to_veganise: "Try Kurkure Puffcorn — the plain salt variant is dairy-free.",
    comments: "Most Kurkure flavors contain dairy derivatives. Always check the label.",
    short_description: "India's beloved crunchy corn puff snack.",
    amazon_search_url: "https://www.amazon.in/s?k=kurkure+masala+munch",
  },
  {
    slug: "lijjat-papad",
    snack_name: "Lijjat Papad",
    brand_or_region: "Shri Mahila Griha Udyog",
    is_vegan: true,
    hidden_ingredients: null,
    instructions_to_veganise: null,
    comments: "Made by a women's cooperative. Ingredients: urad dal, salt, oil, spices. 100% plant-based.",
    short_description: "The iconic Indian papadum brand.",
    amazon_search_url: "https://www.amazon.in/s?k=lijjat+papad",
  },
  {
    slug: "amul-dark-chocolate",
    snack_name: "Amul Dark Chocolate",
    brand_or_region: "Amul",
    is_vegan: false,
    hidden_ingredients: "Contains milk fat, milk solids — even in the 'dark' variant",
    instructions_to_veganise: "Choose Paul & Mike 72% Dark or Mason & Co for truly dairy-free dark chocolate.",
    comments: "Amul's 'dark' chocolate is misleading for vegans. It still contains dairy.",
    short_description: "Amul's dark chocolate bar — not as dark as you'd think.",
    amazon_search_url: "https://www.amazon.in/s?k=amul+dark+chocolate",
  },
  {
    slug: "bikanervala-samosa",
    snack_name: "Bikanervala Samosa",
    brand_or_region: "Bikanervala / North India",
    is_vegan: true,
    hidden_ingredients: null,
    instructions_to_veganise: null,
    comments: "The classic aloo samosa. Made with potato, peas, and spices in a maida shell fried in vegetable oil.",
    short_description: "The quintessential Indian street food snack.",
    amazon_search_url: null,
  },
  {
    slug: "hide-and-seek",
    snack_name: "Hide & Seek Chocolate Chip",
    brand_or_region: "Parle",
    is_vegan: false,
    hidden_ingredients: "Contains butter (12%), milk solids, whey powder",
    instructions_to_veganise: "Try Unibic Choco Chip cookies — check label for the dairy-free batch.",
    comments: "A childhood favorite, but loaded with dairy.",
    short_description: "Popular chocolate chip cookie from Parle.",
    amazon_search_url: "https://www.amazon.in/s?k=hide+and+seek+biscuit",
  },
];
