/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  rootDir: './src',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: '../coverage',
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      statements: 80, // Mínimo de 80% de cobertura de declarações
      branches: 80, // Mínimo de 80% de cobertura de branches
      lines: 80, // Mínimo de 80% de cobertura de linhas
      functions: 80, // Mínimo de 80% de cobertura de funções
    },
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.interface.ts',
    '-interface.ts',
    'shared/testing',
    'validator-rules.ts',
    '-fixture.ts',
    '.fixture.ts',
    '.input.ts',
    '.dto.ts',
    '.d.ts',
  ],
  setupFilesAfterEnv: ['./core/shared/infra/testing/expect-helpers.ts'],
  // testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  testEnvironment: 'node',
};

export default config;
