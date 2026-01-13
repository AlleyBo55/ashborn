/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        monarch: {
          black: '#050505',
          dark: '#0a0a0f',
          DEFAULT: '#121216',
        },
        shadow: {
          purple: '#4c1d95',
          glow: '#7c3aed',
        },
        arise: {
          blue: '#3b82f6',
          ice: '#60a5fa',
        },
        system: {
          frame: '#2563eb', // Solo Leveling Blue
          bg: 'rgba(10, 20, 40, 0.85)',
          alert: '#ef4444',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shadow-lair': "url('/assets/hero-bg-v2.png')",
        'webtoon-army': "url('/assets/webtoon-bg.png')",
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        monarch: ['"Cinzel Decorative"', 'serif'],
        tech: ['"Orbitron"', 'sans-serif'],
        manga: ['"Bangers"', 'cursive'], // Kinetic text
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'arise': 'arise 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'burn': 'burn 4s ease-in-out infinite alternate',
        'slam': 'slam 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'glitch': 'glitch 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        arise: {
          '0%': { opacity: '0', transform: 'translateY(100px) scale(0.5)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slam: {
          '0%': { opacity: '0', transform: 'scale(3)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        burn: {
          '0%': { filter: 'brightness(1) drop-shadow(0 0 10px #4c1d95)' },
          '100%': { filter: 'brightness(1.5) drop-shadow(0 0 25px #7c3aed)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
    },
  },
  plugins: [],
}
