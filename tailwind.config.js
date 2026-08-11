/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"SF Mono"', 'Consolas', 'monospace'],
      },
      colors: {
        ivory: {
          DEFAULT: '#FDFBF7',
          muted: '#F5F2EB',
          border: '#E8E3D9',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#18181B',
          'dark-card': '#27272A',
        },
        brand: {
          amber: '#D97706',
          'amber-hover': '#B45309',
          emerald: '#059669',
          red: '#E11D48',
          teal: '#0D9488',
          gold: '#B45309',
          navy: '#1E293B',
        },
      },
    },
  },
  plugins: [],
}
