// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(recharts)/)'
    ],
    testPathIgnorePatterns: [
      '/node_modules/',
      '/.next/',
      '/.history/',
      '/backup_20250414_181209/',
      '/backup_20250414_181421/',
      '/src/pages/test.tsx',
    ]
  };