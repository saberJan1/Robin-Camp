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
          base: '#f8fafc', // Slate 50 (Page Background)
          surface: '#ffffff', // White (Card/Panel Background)
          primary: '#0ea5e9', // Sky 500 (Primary Action)
          secondary: '#64748b', // Slate 500 (Secondary Text/Icon)
          accent: '#38bdf8', // Sky 400
          text: '#0f172a', // Slate 900 (Main Text)
          muted: '#64748b', // Slate 500 (Muted Text)
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)',
        'card-hover': '0 0 0 1px rgba(0,0,0,0.03), 0 8px 16px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
