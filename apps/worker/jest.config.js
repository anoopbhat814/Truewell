/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  collectCoverageFrom: ['src/**/*.js', '!src/index.js'],
  coverageThreshold: { global: { lines: 70, functions: 70 } },
};
