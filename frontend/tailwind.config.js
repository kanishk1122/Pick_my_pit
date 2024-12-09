/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        custom: '5px 5px rgba(0, 0, 0, 0.4), 10px 10px rgba(0, 0, 0, 0.3), 15px 15px rgba(0, 0, 0, 0.2), 20px 20px rgba(0, 0, 0, 0.1), 25px 25px rgba(0, 0, 0, 0.05)',
        customHover: '5px 5px rgba(0, 0, 0, 1)',
      },
      transitionTimingFunction: {
        'shadow-hover': 'ease',
      },
    },
  },
  plugins: [],
};
