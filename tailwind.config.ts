import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2A5BD7",
          50: "#EEF2FC",
          100: "#D9E2F9",
          200: "#B3C5F3",
          300: "#8DA8ED",
          400: "#678BE7",
          500: "#416EE1",
          600: "#2A5BD7", // Primary color
          700: "#2149AB",
          800: "#193780",
          900: "#102454",
        },
        secondary: {
          DEFAULT: "#00B894",
          50: "#E6F9F5",
          100: "#CCF3EB",
          200: "#99E7D7",
          300: "#66DBC3",
          400: "#33CFAF",
          500: "#00B894", // Secondary color
          600: "#009376",
          700: "#006E59",
          800: "#00493B",
          900: "#00251E",
        },
        warning: {
          DEFAULT: "#FF6F61",
          50: "#FFF0EE",
          100: "#FFE1DD",
          200: "#FFC3BB",
          300: "#FFA599",
          400: "#FF8777",
          500: "#FF6F61", // Warning color
          600: "#CC594E",
          700: "#99433A",
          800: "#662C27",
          900: "#331613",
        },
        neutral: {
          bg: "#F8F9FA", // Neutral BG
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "10": "10px", // Card radius
        "8": "8px", // Button radius
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
