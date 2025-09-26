/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        main: {
          50: "var(--color-main-50)",
          100: "var(--color-main-100)",
          200: "var(--color-main-200)",
          300: "var(--color-main-300)",
          400: "var(--color-main-400)",
          500: "var(--color-main-500)",
          DEFAULT: "var(--color-main-500)",
        },
        dark: "#1D1B1B",
        graphite: "#505051",
        backgroundImage: {
          'app-icon': "url('/public/logo.png')",
        },
      },
      backgroundImage: {
        "gradient-opacity-left-to-right":
          "linear-gradient(90deg, var(--color-main) 0%, var(--color-main-200) 55.15%, var(--color-main-100) 100.28%)",
      },
    },
  },
  plugins: [],
};
