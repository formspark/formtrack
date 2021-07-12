module.exports = {
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
  verbose: true,
};
