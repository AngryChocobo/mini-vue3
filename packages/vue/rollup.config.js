import ts from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import resolve from "rollup-plugin-node-resolve";

export default defineConfig({
  input: "./src/index.ts",
  output: [
    {
      format: "cjs",
      file: "dist/mini-vue.cjs.js",
    },
    {
      format: "es",
      file: "dist/mini-vue.esm.js",
      sourcemap: true,
    },
    {
      format: "iife",
      name: "Vue", // must have name
      file: "dist/mini-vue.iife.js",
    },
    {
      format: "umd",
      name: "mini-vue", // must have name
      file: "dist/mini-vue.umd.js",
    },
  ],
  plugins: [
    ts(),
    // to build workspace:* package dependency
    resolve(),
  ],
});
