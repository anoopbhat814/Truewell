module.exports = {
  '*.{ts,tsx,js}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
  'services/api/**/*.py': ['ruff check --fix', 'ruff format'],
};
