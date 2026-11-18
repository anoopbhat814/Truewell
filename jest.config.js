// Root Jest config used for scripts/ tests; the worker package carries its own config.
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/scripts'],
  testMatch: ['**/*.test.js'],
};
