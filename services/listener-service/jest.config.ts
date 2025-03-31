import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  displayName: "listener-service",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
  moduleFileExtensions: ["ts", "js", "json"],
  coverageDirectory: "../../coverage/services/listener-service",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
};

export default config;
