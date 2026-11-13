// cypress.smoke.config.js
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://github.io",
    specPattern: "cypress/smoke/**/*.smoke.js",
    supportFile: "cypress/support/smoke.js",
  },
});
