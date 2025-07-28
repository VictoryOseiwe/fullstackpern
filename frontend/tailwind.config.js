// tailwind.config.js
import daisyui from "daisyui"; // Keep this one

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui], // <--- **CHANGED: Only one entry for daisyui**
  daisyui: {
    themes: [
      "pastel",
      "retro",
      "coffee",
      "forest",
      "cyberpunk",
      "synthwave",
      "luxury",
      "autumn",
      "valentine",
      "aqua",
      "business",
      "night",
      "dracula",
    ],
  },
};
