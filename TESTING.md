# Testing Documentation

This project uses Jest and React Testing Library for testing. This document outlines the testing setup, conventions, and best practices.

## Testing Stack

- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: Simulating user interactions
- **jest-environment-jsdom**: DOM environment for tests

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run tests with coverage report
npm test -- --coverage

