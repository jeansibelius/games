import { defineConfig, defaultExclude } from "vitest/config";

export default defineConfig({
  test: {
    includeSource: ["**/*.ts"],
    exclude: [...defaultExclude],
  },
});
