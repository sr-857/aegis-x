/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#f5f5f5",
        primary: {
          DEFAULT: "#f2ca50",
          foreground: "#0a0a0a",
        },
        destructive: {
          DEFAULT: "#ffb4ab",
          foreground: "#0a0a0a",
        },
        success: {
          DEFAULT: "#85e89d",
          foreground: "#0a0a0a",
        },
        warning: {
          DEFAULT: "#ffc551",
          foreground: "#0a0a0a",
        },
        muted: {
          DEFAULT: "#1a1a1a",
          foreground: "#99907c",
        },
        surface: {
          DEFAULT: "#121212",
        },
        "on-surface": "#f5f5f5",
        "on-surface-variant": "#99907c",
        "outline-variant": "#2a2a2a",
        card: {
          DEFAULT: "#121212",
          foreground: "#f5f5f5",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      fontSize: {
        "headline-lg": ["1.875rem", { lineHeight: "2.25rem", fontWeight: "600" }],
        "headline-md": ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }],
        "body-sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "body-md": ["1rem", { lineHeight: "1.5rem" }],
        "display-md": ["3rem", { lineHeight: "1.1", fontWeight: "700" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(242, 202, 80, 0.15)",
        "glow-lg": "0 0 40px rgba(242, 202, 80, 0.25)",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "slide-up": { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(0.95)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        pulse: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.5" } },
        glow: { "0%, 100%": { boxShadow: "0 0 5px rgba(242, 202, 80, 0.4)" }, "50%": { boxShadow: "0 0 20px rgba(242, 202, 80, 0.8)" } },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        pulse: "pulse 2s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};