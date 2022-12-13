/** @type {import('jest').Config} */
const config = {
  coveragePathIgnorePatterns: ['/node_modules/', '/src/__mocks__/'],
  coverageReporters: ['text-summary', 'lcov'],
  testPathIgnorePatterns: ['/node_modules/', '/build/routes/session/'], // `routes/session` is freezed
  setupFilesAfterEnv: ['jest-matcher-specific-error', './jest.setup.js'],
  roots: ['./build'],
  moduleNameMapper: {
    '^#src/(.*)\\.js(x)?$': '<rootDir>/build/$1',
    '^(chalk|inquirer)$': '<rootDir>/../shared/lib/esm/module-proxy.js',
  },
};

export default config;
