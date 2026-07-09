import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#050505",
          900: "#241C15",
          800: "#3A2E23",
          700: "#514234",
          500: "#7A6B5A",
        },
        panel: "#101017",
        panelSoft: "#171720",
        gold: "#d8b642",
        goldDeep: "#8b6a1b",
        rice: "#f2ead7",
        mist: "#8d9a9a",
        paper: {
          50: "#FBF7EE",
          100: "#F5ECDC",
          200: "#EADCC3",
          300: "#D8C3A0",
        },
        cinnabar: {
          DEFAULT: "#b7412e",
          700: "#9E3428",
          600: "#B94738",
          100: "#F3DDD6",
        },
        bronze: {
          DEFAULT: "#9A7048",
          700: "#7C5835",
          600: "#9A7048",
          300: "#C7A06F",
        },
        jade: {
          DEFAULT: "#6fa38b",
          700: "#3F6757",
          500: "#638879",
          100: "#DDE9E2",
        },
        academy: {
          bg: "#F6EFE4",
          surface: "#FFF9EA",
          surfaceSoft: "#F5E9D4",
          line: "#D8C8A8",
          lineStrong: "#B99663",
          brown: "#8B6A4C",
          red: "#A33A2D",
          jade: "#5E7868",
          cloud: "#D8C7A6",
        },
        qimen: {
          bg: "#10110E",
          panel: "#171813",
          card: "#202016",
          line: "#7E6138",
          gold: "#D0A868",
          goldSoft: "#E8D4A8",
          red: "#B94738",
          green: "#78906C",
          bluegray: "#60717A",
          text: "#F4EAD8",
          muted: "#B9AA91",
        },
        admin: {
          bg: "#F7F7F4",
          panel: "#FFFFFF",
          line: "#E5E0D6",
          text: "#24211C",
          muted: "#7B746A",
          blue: "#3E6173",
          orange: "#B86F2C",
          red: "#A64235",
          green: "#4F7B5F",
        },
      },
      fontFamily: {
        brand: ["Songti SC", "STSong", "Noto Serif SC", "Source Han Serif SC", "serif"],
        body: ["PingFang SC", "Microsoft YaHei", "Noto Sans SC", "sans-serif"],
        classic: ["Songti SC", "STSong", "SimSun", "serif"],
      },
      boxShadow: {
        glow: "0 0 32px rgba(216, 182, 66, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
