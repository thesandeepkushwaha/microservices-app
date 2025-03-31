import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  displayName: "receiver-service",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/services/receiver-service",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
};

export default config;
