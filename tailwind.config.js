/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        dmsans: ["DM Sans", "sans-serif"],
      },
      colors: {
        royal: "#162DFF",
        electric: "#7B2CFF",
        gold: "#E2B100",
        night: "#0A0A0A",
        charcoal: "#111111",
        mist: "#B5B5B5",
        slate: colors.slate,
      },
      backgroundImage: {
        "african-grid":
          "linear-gradient(120deg, rgba(226,177,0,0.08) 1px, transparent 1px), linear-gradient(60deg, rgba(123,44,255,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        pattern: "120px 120px",
      },
    },
  },
  plugins: [],
};
