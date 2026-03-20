export const landingNavLinks = [
  { label: "Finder", to: "/" },
  { label: "Go Vegan", to: "/go-vegan" },
  { label: "About", to: "/about" },
  { label: "Join Us", to: "/join-us" },
];

export const floatingCards = [
  {
    title: "Coconut",
    subtitle: "Coastal pantry / clean fats",
    className: "left-0 top-24 hidden md:block lg:left-6",
  },
  {
    title: "Jaggery",
    subtitle: "Warm sweetness / earthy finish",
    className: "right-0 top-12 hidden sm:block lg:right-10",
  },
  {
    title: "Chili",
    subtitle: "Street heat / vivid contrast",
    className: "bottom-24 right-8 hidden lg:block",
  },
];

export const featureCards = [
  {
    title: "Snack Finder",
    label: "Search live index",
    description: "Look up packaged snacks and street foods with fast, accessible verdicts.",
    to: "/",
    cta: "Open Finder",
    accent: "from-[hsl(var(--landing-sage))] via-[hsl(var(--landing-olive))] to-[hsl(var(--landing-cream))]",
  },
  {
    title: "Go Vegan",
    label: "Read the guide",
    description: "Move through the long-form transition guide with a calmer editorial reading rhythm.",
    to: "/go-vegan",
    cta: "Read Guide",
    accent: "from-[hsl(var(--landing-moss))] via-[hsl(var(--landing-sage))] to-[hsl(var(--landing-cream))]",
  },
  {
    title: "About & Work",
    label: "Campaign archive",
    description: "Browse the mission, visual work, and community-facing advocacy projects.",
    to: "/about",
    cta: "View Work",
    accent: "from-[hsl(var(--landing-cream))] via-[hsl(var(--landing-olive))] to-[hsl(var(--landing-sage))]",
  },
];

export const footerLinkGroups = [
  {
    title: "Explore",
    links: [
      { label: "Finder", to: "/" },
      { label: "Go Vegan", to: "/go-vegan" },
      { label: "About", to: "/about" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Join Us", to: "/join-us" },
      { label: "Report Update", to: "mailto:hello@isthisvegan.app" },
      { label: "Contact", to: "mailto:hello@isthisvegan.app" },
    ],
  },
];