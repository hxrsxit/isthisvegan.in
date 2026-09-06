import type { CSSProperties } from "react";

export const landingTheme = {
  ["--sage-primary" as string]: "#7c9082",
  ["--sage-secondary" as string]: "#ced4bf",
  ["--sage-accent" as string]: "#bfc9bb",
  ["--sage-bg" as string]: "#f8f7f4",
  ["--sage-[#1a1f2e]" as string]: "#1a1f2e",
  ["--sage-muted" as string]: "#e8e6e1",
} as CSSProperties;

export const landingNoiseBackground =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")";
