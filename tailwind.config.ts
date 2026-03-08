import type { Config } from "tailwindcss";

/**
 * Tailwind config — theme references app/globals.css only (SOT).
 * Brand: Primary #0E065A | Accent #3030FF | Success #79CA45
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background:            "var(--background)",
        foreground:            "var(--foreground)",
        primary:               "var(--primary)",
        "primary-foreground":  "var(--primary-foreground)",
        secondary:             "var(--secondary)",
        "secondary-foreground":"var(--secondary-foreground)",
        accent:                "var(--accent)",
        "accent-foreground":   "var(--accent-foreground)",
        card:                  "var(--card)",
        "card-foreground":     "var(--card-foreground)",
        popover:               "var(--popover)",
        "popover-foreground":  "var(--popover-foreground)",
        muted:                 "var(--muted)",
        "muted-foreground":    "var(--muted-foreground)",
        destructive:           "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",
        success:               "var(--success)",
        "success-foreground":  "var(--success-foreground)",
        border:                "var(--border)",
        input:                 "var(--input)",
        ring:                  "var(--ring)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans:  ["var(--font-tajawal)", "Tajawal", "sans-serif"],
        latin: ["Roboto", "sans-serif"],
      },
      animation: {
        "pulse-slow":     "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in-up":     "fade-in-up 0.8s ease-out forwards",
        "float":          "float 6s ease-in-out infinite",
        "diamond-pulse":  "diamond-pulse 1.8s ease-in-out infinite",
        "arrow-move":     "arrow-move 1.5s ease-in-out infinite",
        "glow-pulse":     "glow-pulse 4s ease-in-out infinite",
        "shimmer":        "shimmer 0.6s ease",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;