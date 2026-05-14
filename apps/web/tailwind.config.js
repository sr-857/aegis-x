const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: {
          DEFAULT: "#131313",
          container: {
            lowest: "#0e0e0e",
            low: "#1a1a1a",
            high: "#2a2a2a",
          },
        },
        gold: {
          50: "#fef8e7",
          100: "#fdf0c3",
          200: "#fae18c",
          300: "#f7cf50",
          400: "#f2ca50",
          500: "#e8b832",
          600: "#d4af37",
          700: "#b8922a",
          800: "#967226",
          900: "#7a5d22",
        },
        on: {
          surface: "#e5e2e1",
          "surface-variant": "#d0c5af",
        },
        outline: {
          DEFAULT: "#99907c",
          variant: "#4d4635",
        },
      },
      borderRadius: {
        DEFAULT: "2px",
        lg: "4px",
        xl: "8px",
        full: "12px",
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        mono: ["JetBrains Mono", ...fontFamily.mono],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "1.1", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "500" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "500" }],
        "headline-sm": ["20px", { lineHeight: "1.4", fontWeight: "500" }],
        "body-lg": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-lg": ["14px", { lineHeight: "1.0", fontWeight: "500" }],
        "label-md": ["12px", { lineHeight: "1.0", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "1.0", fontWeight: "500" }],
      },
      spacing: {
        gutter: "24px",
        margin: "40px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "32px",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 8px rgba(212,175,55,0.6)",
          },
          "50%": {
            boxShadow: "0 0 16px rgba(212,175,55,0.9)",
          },
        },
        "data-flow": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "terminal-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "data-flow": "data-flow 3s linear infinite",
        "fade-in": "fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in": "slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "terminal-blink": "terminal-blink 1s step-end infinite",
      },
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        DEFAULT: "300ms",
        emphasize: "400ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
