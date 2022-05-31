import ts from "@rollup/plugin-typescript";
export default {
  input: "./src/main.ts",
  output: [
    {
      format: "cjs",
      file: "lib/mini-vue.cjs.js",
    },
    {
      format: "es",
      file: "lib/mini-vue.esm.js",
    },
  ],
  plugins: [ts()],
};
