/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        funky: {
          dark: '#1e1e1e',
          light: '#fdfbf7',
          pink: '#ff90e8',
          yellow: '#ffc900',
          cyan: '#23a094',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          border: '#000000',
        }
      },
      boxShadow: {
        'hard': '4px 4px 0px 0px #000000',
        'hard-lg': '8px 8px 0px 0px #000000',
        'hard-xl': '12px 12px 0px 0px #000000',
      }
    }
  },
  plugins: [],
}