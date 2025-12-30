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
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
        heading: [
          "ITC Franklin Gothic Medium Condensed",
          "Adobe Garamond Pro",
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
