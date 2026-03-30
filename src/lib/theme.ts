import type { CSSProperties } from "react";

export const landingTheme = {
  ["--landing-forest" as string]: "147 97% 14%",
  ["--landing-sage" as string]: "78 31% 76%",
  ["--landing-olive" as string]: "74 45% 91%",
  ["--landing-cream" as string]: "51 86% 94%",
  ["--landing-moss" as string]: "84 22% 67%",
  ["--landing-shadow" as string]: "147 97% 14% / 0.2",
} as CSSProperties;

export const landingNoiseBackground = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")";
