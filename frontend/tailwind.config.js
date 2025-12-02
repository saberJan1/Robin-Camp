/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sci: {
          base: '#030712', // Very dark blue/black
          surface: '#0f172a', // Dark blue gray
          primary: '#0ea5e9', // Sky blue (Neon)
          secondary: '#8b5cf6', // Violet (Neon)
          accent: '#f43f5e', // Rose (Neon)
          text: '#f8fafc', // Slate 50
          muted: '#94a3b8', // Slate 400
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #0ea5e9, 0 0 10px #0ea5e9' },
          '100%': { boxShadow: '0 0 20px #0ea5e9, 0 0 30px #0ea5e9' },
        }
      }
    },
  },
  plugins: [],
}
