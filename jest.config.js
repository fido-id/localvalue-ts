module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.json",
    },
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  name: "localvalue-ts",
  displayName: "localvalue-ts",
}
