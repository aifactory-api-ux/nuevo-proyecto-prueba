/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        primaryLight: '#A5B4FC',
        secondary: '#1E293B',
        background: '#0F172A',
        surface: '#1E293B',
        textPrimary: '#F1F5F9',
        textSecondary: '#94A3B8',
        border: '#334155',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ["'Inter'", "'Segoe UI'", "sans-serif"],
      },
    },
  },
  plugins: [],
};