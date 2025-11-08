/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0D17",
        surface: "#141824",
        accent: "#00AEEF",
        textMain: "#EAEAEA",
        textSub: "#9CA3AF",
        error: "#FF4C4C",
        success: "#22C55E",
      },
    },
  },
  plugins: [],
}