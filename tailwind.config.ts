import type { Config } from "tailwindcss";
import forms from '@tailwindcss/forms';

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
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
      },
    },
  },
  plugins: [
    forms,
  ],
} satisfies Config;
