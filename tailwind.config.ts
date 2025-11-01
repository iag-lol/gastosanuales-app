import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f1f6ff",
          100: "#e3ecff",
          200: "#c4d7ff",
          300: "#9db9ff",
          400: "#6f8fff",
          500: "#3c5fff",
          600: "#1d3df5",
          700: "#132bd4",
          800: "#1525a6",
          900: "#162478"
        },
        accent: {
          100: "#f5f8ff",
          200: "#ebf2ff",
          300: "#dce9ff",
          400: "#c2daff",
          500: "#9fc0ff"
        }
      },
      boxShadow: {
        subtle: "0 10px 40px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
