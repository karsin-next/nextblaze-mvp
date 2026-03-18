import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blaze: {
          50: '#fff3ec',
          100: '#ffe5d3',
          200: '#ffcaaa',
          300: '#ffa67a',
          400: '#ff7742',
          500: '#ff5414',
          600: '#f03a06',
          700: '#c82a08',
          800: '#9e230f',
          900: '#7e2010',
          950: '#440d06',
        },
        slate: {
          850: '#151e2e',
          900: '#0f172a',
          950: '#020617',
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ['var(--font-outfit)'],
      },
    },
  },
  plugins: [],
};
export default config;
