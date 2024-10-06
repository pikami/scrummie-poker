/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nero: {
          50: '#f7f7f7',
          100: '#e1e1e1',
          200: '#cfcfcf',
          300: '#a8a8a8',
          400: '#737373',
          500: '#4e4e4e',
          600: '#383838',
          700: '#2f2f2f',
          800: '#282828',
          900: '#242424',
        },
      },
    },
  },
  plugins: [],
};
