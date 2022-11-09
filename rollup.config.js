import ts from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
export default defineConfig({
  input: "./src/main.ts",

  output: [
    {
      format: "cjs",
      file: "lib/mini-vue.cjs.js",
    },
    {
      format: "es",
      file: "lib/mini-vue.esm.js",
      sourcemap: true,
    },
    {
      format: "iife",
      name: "Vue", // must have name
      file: "lib/mini-vue.iife.js",
    },
    {
      format: "umd",
      name: "mini-vue", // must have name
      file: "lib/mini-vue.umd.js",
    },
  ],
  plugins: [ts()],
});
