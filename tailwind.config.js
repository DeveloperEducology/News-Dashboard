/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        candal: ['Candal', 'sans-serif'],
        fun: ['Fredoka', 'sans-serif'],
      },
      // ADDED SECTION for swipe animations
      keyframes: {
        'slide-in-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-out-up': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        'slide-in-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-out-down': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'slide-in-up': 'slide-in-up 0.5s ease-out forwards',
        'slide-out-up': 'slide-out-up 0.5s ease-out forwards',
        'slide-in-down': 'slide-in-down 0.5s ease-out forwards',
        'slide-out-down': 'slide-out-down 0.5s ease-out forwards',
      },
      // END of added section
    },
  },
  plugins: [],
}