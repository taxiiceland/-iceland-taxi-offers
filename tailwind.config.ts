import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#07111f",
        navy: "#0b1d33",
        glacier: "#d9f3ff",
        ice: "#f4fbff",
        gold: "#d6a84f",
        ember: "#f2cf8a"
      },
      boxShadow: {
        soft: "0 24px 70px rgba(7, 17, 31, 0.16)",
        glow: "0 0 0 1px rgba(214, 168, 79, 0.22), 0 24px 80px rgba(24, 65, 92, 0.24)"
      },
      backgroundImage: {
        "aurora-soft":
          "radial-gradient(circle at 18% 12%, rgba(217, 243, 255, 0.34), transparent 34%), radial-gradient(circle at 82% 5%, rgba(214, 168, 79, 0.2), transparent 30%), linear-gradient(135deg, #07111f 0%, #0b1d33 52%, #102b43 100%)",
        "ice-panel":
          "linear-gradient(135deg, rgba(244, 251, 255, 0.96), rgba(217, 243, 255, 0.7))"
      }
    }
  },
  plugins: []
};

export default config;
