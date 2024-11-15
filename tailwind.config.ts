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
        mainyellow: "#FABD2F",
        mainred: "#E52421",
        secondyellow: "#D5762D",
        thirdyellow: "#FEDC92",
        mainwhite: "#F8F7F7",
        mainblack: "#13100D",
        maincoffee: "#26140F",
      },
    },
  },
  plugins: [],
};
export default config;
