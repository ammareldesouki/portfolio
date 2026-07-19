import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // All semantic colors reference CSS variables (RGB triplets) defined in
        // globals.css under :root (light) and .dark (dark). The `<alpha-value>`
        // placeholder keeps Tailwind opacity modifiers (e.g. bg-primary/50) working.
        "surface-bright": "rgb(var(--surface-bright) / <alpha-value>)",
        "on-error": "rgb(var(--on-error) / <alpha-value>)",
        "primary-fixed-dim": "rgb(var(--primary-fixed-dim) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-container": "rgb(var(--surface-container) / <alpha-value>)",
        "primary-container": "rgb(var(--primary-container) / <alpha-value>)",
        "secondary-fixed-dim": "rgb(var(--secondary-fixed-dim) / <alpha-value>)",
        "on-surface": "rgb(var(--on-surface) / <alpha-value>)",
        "on-primary-fixed-variant": "rgb(var(--on-primary-fixed-variant) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        "tertiary-fixed-dim": "rgb(var(--tertiary-fixed-dim) / <alpha-value>)",
        "surface-container-highest": "rgb(var(--surface-container-highest) / <alpha-value>)",
        "primary-fixed": "rgb(var(--primary-fixed) / <alpha-value>)",
        "inverse-surface": "rgb(var(--inverse-surface) / <alpha-value>)",
        "on-secondary-fixed-variant": "rgb(var(--on-secondary-fixed-variant) / <alpha-value>)",
        "inverse-on-surface": "rgb(var(--inverse-on-surface) / <alpha-value>)",
        "tertiary-container": "rgb(var(--tertiary-container) / <alpha-value>)",
        "outline-variant": "rgb(var(--outline-variant) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "surface-dim": "rgb(var(--surface-dim) / <alpha-value>)",
        "on-secondary-container": "rgb(var(--on-secondary-container) / <alpha-value>)",
        "on-tertiary": "rgb(var(--on-tertiary) / <alpha-value>)",
        "on-tertiary-fixed-variant": "rgb(var(--on-tertiary-fixed-variant) / <alpha-value>)",
        "secondary-container": "rgb(var(--secondary-container) / <alpha-value>)",
        outline: "rgb(var(--outline) / <alpha-value>)",
        tertiary: "rgb(var(--tertiary) / <alpha-value>)",
        "surface-tint": "rgb(var(--surface-tint) / <alpha-value>)",
        "on-primary-fixed": "rgb(var(--on-primary-fixed) / <alpha-value>)",
        "surface-container-high": "rgb(var(--surface-container-high) / <alpha-value>)",
        "surface-container-lowest": "rgb(var(--surface-container-lowest) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        "on-tertiary-fixed": "rgb(var(--on-tertiary-fixed) / <alpha-value>)",
        "secondary-fixed": "rgb(var(--secondary-fixed) / <alpha-value>)",
        "surface-variant": "rgb(var(--surface-variant) / <alpha-value>)",
        "on-primary": "rgb(var(--on-primary) / <alpha-value>)",
        "on-secondary-fixed": "rgb(var(--on-secondary-fixed) / <alpha-value>)",
        "tertiary-fixed": "rgb(var(--tertiary-fixed) / <alpha-value>)",
        "on-primary-container": "rgb(var(--on-primary-container) / <alpha-value>)",
        "on-error-container": "rgb(var(--on-error-container) / <alpha-value>)",
        "inverse-primary": "rgb(var(--inverse-primary) / <alpha-value>)",
        "on-tertiary-container": "rgb(var(--on-tertiary-container) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--on-surface-variant) / <alpha-value>)",
        error: "rgb(var(--error) / <alpha-value>)",
        "on-secondary": "rgb(var(--on-secondary) / <alpha-value>)",
        "error-container": "rgb(var(--error-container) / <alpha-value>)",
        "on-background": "rgb(var(--on-background) / <alpha-value>)",
        "surface-container-low": "rgb(var(--surface-container-low) / <alpha-value>)",
        // Theme-aware helpers (not part of the original Material token set):
        // `hairline` replaces white/black opacity borders so they invert per theme;
        // `card` and `field` back panels and form inputs.
        hairline: "rgb(var(--hairline) / <alpha-value>)",
        card: "rgb(var(--card-bg) / <alpha-value>)",
        field: "rgb(var(--field-bg) / <alpha-value>)",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "margin-mobile": "20px",
        "sidebar-width": "280px",
        unit: "4px",
        "margin-desktop": "64px",
        gutter: "24px",
        "max-width-content": "1200px",
      },
      fontFamily: {
        "display-lg-mobile": ["Geist"],
        "code-sm": ["JetBrains Mono"],
        "display-lg": ["Geist"],
        "body-base": ["Inter"],
        "headline-md": ["Geist"],
        "label-caps": ["JetBrains Mono"],
      },
      fontSize: {
        "display-lg-mobile": [
          "40px",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "code-sm": [
          "13px",
          { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" },
        ],
        "display-lg": [
          "64px",
          { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "700" },
        ],
        "body-base": [
          "16px",
          { lineHeight: "1.6", letterSpacing: "0em", fontWeight: "400" },
        ],
        "headline-md": [
          "32px",
          { lineHeight: "1.3", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "label-caps": [
          "11px",
          { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" },
        ],
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
