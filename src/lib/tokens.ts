/**
 * Design tokens — single source of truth for spacing, radii, colors, font sizes.
 * Reference these instead of hardcoding values in JSX or inline styles.
 */

export const TOKENS = {
  radius: {
    sm: "0.375rem",   // 6px
    md: "0.5rem",     // 8px
    lg: "0.75rem",    // 12px
    xl: "1rem",       // 16px
    full: "9999px",
  },
  spacing: {
    xs: "0.25rem",    // 4px
    sm: "0.5rem",     // 8px
    md: "0.75rem",    // 12px
    lg: "1rem",       // 16px
    xl: "1.25rem",    // 20px
    "2xl": "1.5rem",  // 24px
  },
  fontSize: {
    xs: "0.625rem",   // 10px
    sm: "0.75rem",    // 12px
    base: "0.875rem", // 14px
    lg: "1rem",       // 16px
    xl: "1.125rem",   // 18px
  },
  animation: {
    modalIn: "modalFadeIn 0.22s cubic-bezier(0.34,1.56,0.64,1) forwards",
    modalOut: "modalFadeOut 0.18s ease-in forwards",
    noteSlideIn: "noteSlideIn 0.28s ease-out forwards",
  },
} as const;

/** Event color swatches — label + CSS color value */
export const EVENT_COLORS = [
  { label: "Sky",     value: "hsl(205, 78%, 55%)" },
  { label: "Rose",    value: "hsl(345, 80%, 60%)" },
  { label: "Amber",   value: "hsl(38, 92%, 55%)" },
  { label: "Emerald", value: "hsl(152, 60%, 45%)" },
  { label: "Violet",  value: "hsl(262, 65%, 62%)" },
  { label: "Coral",   value: "hsl(16, 85%, 60%)" },
] as const;

export type EventColor = typeof EVENT_COLORS[number]["value"];
