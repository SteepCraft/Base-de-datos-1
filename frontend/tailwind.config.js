/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esto es crucial: le dice a Tailwind dónde escanear tus archivos para encontrar las clases.
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
