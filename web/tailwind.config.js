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
        gold: {
          50: '#fcfaf5',
          100: '#f7f2e4',
          200: '#efe1be',
          300: '#e4cc92',
          400: '#d4af37',
          500: '#c5a059', // Emirates Signature Warm Gold
          600: '#b1893d',
          700: '#8c6729',
          800: '#694a1f',
          900: '#432e12',
          950: '#2a1c09',
        },
        obsidian: {
          800: '#1e2433',
          850: '#161c2b',
          900: '#0f1422',
          950: '#080c16',
          999: '#04060b',
        },
        brand: {
          50: '#f0fdf4',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-sm': '0 2px 10px -2px rgba(197, 160, 89, 0.15)',
        'gold-md': '0 8px 25px -4px rgba(197, 160, 89, 0.25)',
        'gold-lg': '0 20px 40px -10px rgba(197, 160, 89, 0.35)',
        'obsidian-lg': '0 25px 50px -12px rgba(4, 6, 11, 0.85)',
      }
    },
  },
  plugins: [],
}
