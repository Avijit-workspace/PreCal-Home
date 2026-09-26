/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        // Warm White & Cream
        cream: {
          50: '#fdfbf7',
          100: '#faf6ee',
          200: '#f5eddc',
          300: '#ede0c4',
        },
        // Charcoal
        charcoal: {
          700: '#2d2d2d',
          800: '#1f1f1f',
          900: '#111111',
        },
        // Muted Green (sage)
        sage: {
          50: '#f4f7f4',
          100: '#e5ede5',
          200: '#c8d9c8',
          300: '#9fbf9f',
          400: '#6e9e6e',
          500: '#4a7c4a',
          600: '#3a6339',
          700: '#2f4f2e',
        },
        // Gold Accent
        gold: {
          300: '#f0d080',
          400: '#e8b84b',
          500: '#d4a017',
          600: '#b8860b',
        },
        // Warm Browns
        warm: {
          100: '#f5ede0',
          200: '#ead5b7',
          300: '#d4b896',
          400: '#b89570',
          500: '#8b6a43',
        },
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.07)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.13)',
        'premium': '0 20px 60px rgba(0,0,0,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        pulseSoft: { '0%, 100%': { opacity: '0.8' }, '50%': { opacity: '1' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #fdfbf7 0%, #f5eddc 100%)',
        'gradient-hero': 'linear-gradient(to right, rgba(17,17,17,0.75) 0%, rgba(17,17,17,0.2) 100%)',
        'gradient-sage': 'linear-gradient(135deg, #3a6339 0%, #4a7c4a 100%)',
        'gradient-gold': 'linear-gradient(135deg, #d4a017 0%, #e8b84b 100%)',
      },
    },
  },
  plugins: [],
}
