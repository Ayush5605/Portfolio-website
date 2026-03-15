/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terminal': {
          bg: '#050505',
          dark: '#080808',
          gray: '#111111',
          border: '#1a1a1a',
          accent: '#00ff41',
        },
        'matrix': {
          50: '#f0fff4',
          100: '#dcffd6',
          200: '#b7ffad',
          300: '#7eff74',
          400: '#48ff40',
          500: '#00ff41',
          600: '#00d632',
          700: '#00a328',
          800: '#007a21',
          900: '#005c1d',
          950: '#00330f',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1.2s infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        }
      },
    },
  },
  plugins: [],
}
