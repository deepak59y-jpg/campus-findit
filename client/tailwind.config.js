/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-end campus brand styling
        brand: {
          50: '#f4f6fb',
          100: '#e9edf7',
          200: '#cbd5ee',
          300: '#9cb1df',
          400: '#6886cc',
          500: '#4361ee', // Main brand indigo
          600: '#2b44d2',
          700: '#2032aa',
          800: '#1e2b8a',
          900: '#1e2670',
          950: '#121644',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
