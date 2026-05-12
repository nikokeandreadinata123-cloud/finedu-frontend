/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,css}", 
  ],
  theme: {
    extend: {
      colors: {
        primary: "#374DB7",
        secondary: "#5934D3",
      },
    },
  },
  plugins: [],
}
