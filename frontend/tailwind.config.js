/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    theme: {
  extend: {
    fontFamily: {
      sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
    },
  },
},

  },
  plugins: [],
}
