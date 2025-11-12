import type { Config } from "tailwindcss";
import forms from '@tailwindcss/forms';

export default {
  // Expanded content globs to correctly include all application source files.
  // Previous pattern inadvertently excluded top-level and certain nested .tsx files,
  // preventing Tailwind from generating dark: variants for those components.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./functions/**/*.{js,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        handwriting: ['Permanent Marker', 'cursive'],
      },
      animation: {
        'draw-arrow': 'draw-arrow 1.5s ease-out forwards',
        'marquee': 'marquee 25s linear infinite',
        'marquee2': 'marquee2 25s linear infinite',
        'wave': 'wave 2s ease-in-out infinite',
      },
      keyframes: {
        'draw-arrow': {
          '0%': {
            strokeDashoffset: '60',
          },
          '100%': {
            strokeDashoffset: '0',
          },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '10%, 30%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10deg)' },
          '60%': { transform: 'rotate(0deg)' },
        },
      },
    },
  },
  plugins: [
    forms,
  ],
} satisfies Config;
