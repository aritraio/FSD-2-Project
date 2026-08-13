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
        mono: ['"SF Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      colors: {
        /* ── Light-mode surfaces ── */
        ivory: {
          DEFAULT: '#FDFBF7',
          50: '#FFFEF9',
          100: '#FDFBF7',
          200: '#F5F2EB',
          300: '#E8E3D9',
          muted: '#F5F2EB',
          border: '#E8E3D9',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#141414',
          'dark-card': '#1E1E1E',
          'dark-elevated': '#282828',
          'dark-border': '#333333',
        },

        /* ── Brand / accent ── */
        brand: {
          amber: '#D97706',
          'amber-hover': '#B45309',
          'amber-light': '#FEF3C7',
          'amber-muted': '#92400E',
          emerald: '#059669',
          'emerald-hover': '#047857',
          'emerald-light': '#D1FAE5',
          'emerald-muted': '#065F46',
          red: '#E11D48',
          'red-hover': '#BE123C',
          'red-light': '#FFE4E6',
          'red-muted': '#9F1239',
          teal: '#0D9488',
          'teal-light': '#CCFBF1',
          gold: '#B45309',
          navy: '#1E293B',
        },

        /* ── Chart palette ── */
        chart: {
          teal: '#0D9488',
          gold: '#D97706',
          navy: '#1E293B',
          coral: '#F97316',
          plum: '#7C3AED',
          rose: '#F43F5E',
          sky: '#0EA5E9',
          lime: '#84CC16',
        },

        /* ── Semantic text ── */
        text: {
          primary: '#18181B',
          secondary: '#71717A',
          tertiary: '#A1A1AA',
          inverse: '#FAFAFA',
          'dark-primary': '#F5F5F5',
          'dark-secondary': '#A1A1AA',
          'dark-tertiary': '#71717A',
        },
      },

      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '128': '32rem',
        '144': '36rem',
      },

      borderRadius: {
        '4xl': '2rem',
      },

      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)',
        'modal': '0 24px 48px rgba(0, 0, 0, 0.16), 0 12px 24px rgba(0, 0, 0, 0.08)',
        'dark-card': '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
        'dark-elevated': '0 10px 30px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.3)',
      },

      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-scale': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'backdrop-fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.3s ease-out',
        'fade-in-scale': 'fade-in-scale 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'backdrop-fade': 'backdrop-fade 0.15s ease-out',
      },
    },
  },
  plugins: [],
}
