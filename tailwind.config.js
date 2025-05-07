import { heroui } from "@heroui/react";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plugin: {
          500: "#ff5f15",
          600: "#ff4400",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#18181b", 
            foreground: "#ffffff",
            content1: {
              DEFAULT: "#242424",
              foreground: "#ffffff"
            },
            content2: {
              DEFAULT: "#2f2f2f",
              foreground: "#ffffff"
            },
            primary: {
              50: "#fff7ed",
              100: "#ffedd5",
              200: "#fed7aa",
              300: "#fdba74",
              400: "#fb923c",
              500: "#ff5f15",
              600: "#ff4400",
              700: "#c2410c",
              800: "#9a3412",
              900: "#7c2d12",
              DEFAULT: "#ff5f15",
              foreground: "#000000"
            },
          },
        },
      },
    }),
  ],
};