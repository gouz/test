import { defineConfig } from "vite";
import pugPlugin from "vite-plugin-pug";

module.exports = defineConfig({
  plugins: [pugPlugin()],
  build: {
    target: ["es2021"],
  },
});
