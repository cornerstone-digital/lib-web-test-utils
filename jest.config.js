const tsconfig = require('./tsconfig.json')
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig)

module.exports = module.exports = {
  testPathIgnorePatterns: [
    '<rootDir>/lib',
    '<rootDir>/_backup'
  ],
  roots: [
    '<rootDir>/package'
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
    'yml'
  ],
  moduleNameMapper,
  coverageReporters: [
    'lcov',
    'json',
    'cobertura'
  ],
  collectCoverageFrom: [
    'package/**/*.ts',
    '!package/**/index.ts'
  ],
  collectCoverage: true
}
