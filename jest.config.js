/**
 * Jest configuration for react-native-foldface
 */
module.exports = {
  preset: "@react-native/jest-preset",
  transformIgnorePatterns: [
    "node_modules/(?!" +
      "(jest-)?react-native" +
      "|@react-native(-community)?" +
      "|react-native-foldface" +
      "|react-native-reanimated" +
      "|test-renderer" +
      ")",
  ],
  collectCoverageFrom: [
    "lib/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/index.ts",
    "!**/node_modules/**",
    "!**/__tests__/**",
  ],
  moduleNameMapper: {
    "^react$": "<rootDir>/node_modules/react/index.js",
    "^react/jsx-runtime$": "<rootDir>/node_modules/react/jsx-runtime.js",
    "^react/jsx-dev-runtime$": "<rootDir>/node_modules/react/jsx-dev-runtime.js",
    "^react-native($|/.*)": "<rootDir>/node_modules/react-native/$1",
    "^react-native-reanimated$": "<rootDir>/mocks/react-native-reanimated.js",
    "^react-native-worklets$": "<rootDir>/mocks/react-native-worklets.js",
    "^react-native-safe-area-context$": "<rootDir>/mocks/react-native-safe-area-context.js",
    "^react-native-foldface$": "<rootDir>/lib/index.ts",
  },
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 25,
      lines: 35,
      statements: 35,
    },
  },
  testMatch: ["**/__tests__/**/*.test.{ts,tsx}", "**/*.test.{ts,tsx}"],
};
