/** @type {import('tailwindcss').Config} */
// Tokens do design system "Obsidian Architectural Prestige" (Stitch)
module.exports = {
  content: ["./*.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        "surface-canvas": "#0B0B0D",
        "surface-elevated": "#121316",
        "surface-overlay": "#181A1E",
        "surface-dim": "#131315",
        "surface-container": "#201f21",
        "surface-container-low": "#1c1b1d",
        "surface-container-lowest": "#0e0e10",
        "hairline-border": "#26262B",
        "hairline-subtle": "rgba(255, 255, 255, 0.08)",
        "text-primary": "#F5F5F7",
        "text-secondary": "#A1A1A6",
        "text-muted": "#86868B",
        "accent-gold-core": "#D4AF37",
        "accent-gold-rich": "#E5A93C",
        "accent-gold-champagne": "#F5D77F",
        primary: "#f2ca50",
        whatsapp: "#25D366",
      },
      fontFamily: {
        display: ["'Hanken Grotesk'", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      fontSize: {
        "display-hero": ["80px", { lineHeight: "88px", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-hero-mobile": ["44px", { lineHeight: "50px", letterSpacing: "-0.025em", fontWeight: "700" }],
        "headline-xl": ["56px", { lineHeight: "64px", letterSpacing: "-0.025em", fontWeight: "600" }],
        "headline-xl-mobile": ["36px", { lineHeight: "42px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-lg-mobile": ["28px", { lineHeight: "34px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-md": ["28px", { lineHeight: "36px", letterSpacing: "-0.015em", fontWeight: "500" }],
        "headline-sm": ["22px", { lineHeight: "30px", letterSpacing: "-0.01em", fontWeight: "500" }],
        "title-lg": ["18px", { lineHeight: "26px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
        "body-md": ["15px", { lineHeight: "24px", letterSpacing: "-0.005em" }],
        "body-sm": ["13px", { lineHeight: "20px" }],
        "label-md": ["13px", { lineHeight: "18px", letterSpacing: "0.04em", fontWeight: "600" }],
        "label-caps": ["11px", { lineHeight: "16px", letterSpacing: "0.08em", fontWeight: "700" }],
      },
      maxWidth: {
        site: "80rem",
      },
    },
  },
  plugins: [],
};
