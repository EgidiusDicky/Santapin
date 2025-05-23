import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: defaultTheme.fontFamily.sans,
      },
      colors: {
        gray: defaultTheme.colors.gray,
        primary: "#ef4444",
      },
    },
  },
  plugins: [],
};