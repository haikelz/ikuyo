/** @type {import("prettier").Config} */
export default {
  trailingComma: "none",
  overrides: [
    {
      files: "*.svg",
      options: {
        parser: "html",
      },
    },
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
};
