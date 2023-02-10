import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  collectCoverage: false,
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
};

export default config;
