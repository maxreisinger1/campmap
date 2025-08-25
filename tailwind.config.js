/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "SF Mono",
          "Monaco",
          "Inconsolata",
          "Roboto Mono",
          "Source Code Pro",
          "monospace",
        ],
        sans: [
          "SF Mono",
          "Monaco",
          "Inconsolata",
          "Roboto Mono",
          "Source Code Pro",
          "monospace",
        ],
        heading: [
          "ITC Franklin Gothic Medium Condensed",
          "Franklin Gothic Medium",
          "Impact",
          "Arial Black",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
