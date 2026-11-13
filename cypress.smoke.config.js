// cypress.smoke.config.js
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://fanshaweoerdesign.github.io/AttributionBuilder-Online/",
    specPattern: "cypress/smoke/**/*.smoke.js",
    supportFile: "cypress/support/smoke.js",
  },
});
