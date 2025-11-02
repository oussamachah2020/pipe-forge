module.exports = {
    // Use ts-jest preset for TypeScript support
    preset: 'ts-jest',
    
    // Run tests in Node environment (not browser)
    testEnvironment: 'node',
    
    // Look for tests in the test directory
    roots: ['<rootDir>/tests'],
    
    // Match any files ending in .test.ts or .spec.ts
    testMatch: ['**/*.test.ts', '**/*.spec.ts'],
    
    // Collect coverage from src files
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/index.ts', // Exclude entry point
      '!src/**/*.d.ts', // Exclude type definition files
    ],
    
    // Output coverage reports to the coverage directory
    coverageDirectory: 'coverage',
    
    // Generate multiple coverage report formats
    coverageReporters: ['text', 'lcov', 'html'],
    
    // Show individual test results
    verbose: true,
    
    // Clear mock calls and instances between tests
    clearMocks: true,
    
    // Coverage thresholds (optional but recommended)
    coverageThreshold: {
        global: {
          branches: 60,
          functions: 85,
          lines: 80,
          statements: 75,
        },
      },
  };