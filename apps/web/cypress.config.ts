import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4321",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
  screenshotOnRunFailure: true,
  video: false,
});
