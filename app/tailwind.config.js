/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shadow Monarch theme - Solo Leveling inspired
        shadow: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#1e1033",
        },
        void: {
          DEFAULT: "#0a0a0f",
          light: "#14141f",
          dark: "#050508",
        },
        monarch: {
          purple: "#9333ea",
          blue: "#3b82f6",
          gold: "#f59e0b",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "shadow-glow":
          "radial-gradient(ellipse at center, rgba(147, 51, 234, 0.15) 0%, transparent 70%)",
        "void-pattern":
          "linear-gradient(135deg, #0a0a0f 0%, #1e1033 50%, #0a0a0f 100%)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shadow-rise": "shadow-rise 1s ease-out",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 40px rgba(147, 51, 234, 0.8)",
          },
        },
        "shadow-rise": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        "shadow-sm": "0 0 10px rgba(147, 51, 234, 0.3)",
        "shadow-md": "0 0 20px rgba(147, 51, 234, 0.4)",
        "shadow-lg": "0 0 40px rgba(147, 51, 234, 0.5)",
        "shadow-xl": "0 0 60px rgba(147, 51, 234, 0.6)",
      },
    },
  },
  plugins: [],
};
