/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@react-three|three)/)",
  ],
  coverageThreshold: {
    global: {
      branches: 15,
      functions: 16,
      lines: 18,
      statements: 17,
    },
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/messages/**",
    "!src/**/*.test.{ts,tsx}",
    "!src/types/**",
    "!src/scripts/**",
    "!src/i18n/**",
  ],
};
