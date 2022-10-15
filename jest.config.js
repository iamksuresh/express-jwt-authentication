module.exports = {
  roots: ["<rootDir>/test"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testResultsProcessor: "jest-sonar-reporter",
  testRegex: "(test|spec)\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsconfig: {
        noUnusedLocals: false,
      },
    },
  },
  coveragePathIgnorePatterns: [
    "<rootDir>/src/app.ts",
    "<rootDir>/src/server.ts",
    "<rootDir>/src/bootstrap.ts",
    "<rootDir>/src/repositories/ioc.ts",
    "<rootDir>/src/repositories/types.ts",
    "<rootDir>/src/services/ioc.ts",
    "<rootDir>/src/services/types.ts",
    "<rootDir>/src/services/types",
    "<rootDir>/src/routes",
    "<rootDir>/src/mock",
    "<rootDir>/test/__fixtures_",
    "<rootDir>/test/data",
    "<rootDir>/test/mock",
    "<rootDir>/src/models",
    "<rootDir>/src/types",
    "<rootDir>/src/services/implementation/__fixtures__"  
  ],
  // collectCoverageFrom: ["**/*.ts", "!test/test-utils.test.ts"],
  collectCoverage: true,
};
