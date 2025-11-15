/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          600: '#1e2a40',
          700: '#1a2234',
          800: '#151b2b',
          900: '#0f1421',
        },
      },
    },
  },
  plugins: [],
};