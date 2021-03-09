module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsConfig: "./tsconfig.json",
    },
  },
  transform: { "^.+typespec\\.ts$": "dts-jest/transform" },
  testMatch: ["**/+(*.)*(typespec).ts"],
  name: "localvalue-ts",
  displayName: "localvalue-ts",
}
