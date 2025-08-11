# Testing Guide - Company Fit Explorer

## Overview

This project uses a comprehensive test-driven development (TDD) approach with Vitest and React Testing Library to ensure code quality and prevent regressions.

## Test Setup

### Framework
- **Vitest**: Modern testing framework with native TypeScript support
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing

### Configuration
Tests are configured in `vite.config.ts` with:
- Global test utilities available without imports
- JSDOM environment for DOM testing
- Coverage reporting with v8 provider
- Custom setup file for mocks and global configurations

## Test Structure

### Unit Tests

#### Utility Functions (`src/utils/__tests__/`)
- **`index.test.ts`**: Tests for helper functions
  - Currency formatting
  - Company type formatting  
  - Avatar URL generation
- **`graphDataTransform.test.ts`**: Tests for graph visualization logic
  - Position calculations
  - Data transformations
  - Color coding logic
  - Cytoscape style generation

#### Type Safety (`src/types/__tests__/`)
- **`index.test.ts`**: TypeScript interface validation
  - UserCMF data structure validation
  - Company data structure validation
  - Data integrity helpers

### Component Tests

#### CompanyDetailPanel (`src/components/__tests__/CompanyDetailPanel.test.tsx`)
Comprehensive testing of the main UI component:
- **Rendering**: Correct display of company information
- **Interaction**: Click handlers and user interactions
- **State Management**: Selected vs unselected states
- **Data Integration**: Real company data handling
- **Accessibility**: ARIA labels and keyboard navigation
- **Error Handling**: Logo fallbacks and edge cases

### Integration Tests (`src/__tests__/integration.test.tsx`)
End-to-end testing with real data:
- **Data Validation**: Complete dataset integrity checks
- **User Workflows**: Company selection and navigation flows
- **Career URL Functionality**: External link testing
- **Performance**: Render time validation
- **Edge Cases**: Empty states and error conditions

## Running Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run tests once (CI mode)
npm run test:run

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Coverage Reports
Coverage reports are generated in multiple formats:
- **Text**: Console output
- **HTML**: Browse `coverage/index.html`
- **JSON**: Machine-readable `coverage/coverage-final.json`

Coverage excludes:
- Node modules
- Test files
- Configuration files
- Main entry point
- Build output

## Test Categories

### 1. Core Business Logic (71 tests)
✅ **Utility Functions**: Currency, formatting, avatars  
✅ **Graph Transformations**: Position calculations, data mapping  
✅ **Type Safety**: Interface validation, data integrity  

### 2. User Interface (16 tests)
✅ **Component Rendering**: Display logic, conditional rendering  
✅ **User Interactions**: Clicks, hovers, navigation  
✅ **Accessibility**: Screen readers, keyboard navigation  

### 3. Data Integration (15 tests)
✅ **Real Data**: 15-company dataset validation  
✅ **Career URLs**: All external links verified  
✅ **Relationships**: Company connections and types  

## Test-Driven Development Workflow

### 1. Write Failing Test
```typescript
it('should format company type correctly', () => {
  expect(formatCompanyType('late-stage')).toBe('Late Stage')
})
```

### 2. Implement Feature
```typescript
export const formatCompanyType = (type: string): string => {
  return type.replace(/-/g, ' ').split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
```

### 3. Verify Test Passes
```bash
npm test -- formatCompanyType
```

### 4. Refactor with Confidence
Tests ensure no regressions during refactoring.

## Mocking Strategy

### Cytoscape.js
Complex graph library is mocked in `src/test/setup.ts`:
```typescript
vi.mock('cytoscape', () => ({
  default: vi.fn(() => mockCytoscapeInstance)
}))
```

### Window APIs
Browser APIs mocked for testing:
```typescript
Object.defineProperty(window, 'open', {
  value: vi.fn(),
})
```

## Continuous Integration

GitHub Actions workflow (`.github/workflows/ci.yml`):
1. **Build Check**: TypeScript compilation
2. **Unit Tests**: All test suites
3. **Coverage**: Generate and upload reports
4. **Artifacts**: Store test results

## Best Practices

### Writing Tests
1. **Descriptive Names**: Clear test intent
2. **Arrange-Act-Assert**: Consistent structure  
3. **Single Responsibility**: One concept per test
4. **Real Data**: Use actual company dataset
5. **User-Centric**: Test from user perspective

### Maintaining Tests
1. **Update with Features**: Tests evolve with code
2. **Mock Judiciously**: Mock external dependencies only
3. **Test Edge Cases**: Handle errors and empty states
4. **Performance Aware**: Fast test execution

### Debugging Tests
```bash
# Run specific test file
npm test -- CompanyDetailPanel

# Run with verbose output
npm test -- --reporter=verbose

# Debug single test
npm test -- --run -t "should format currency"
```

## Coverage Goals

Current coverage targets:
- **Functions**: >90%
- **Lines**: >85%
- **Branches**: >80%
- **Statements**: >85%

Key areas covered:
- ✅ All utility functions
- ✅ Core business logic
- ✅ User interactions
- ✅ Data validation
- ✅ Error handling
- ✅ Real dataset integrity

## Future Enhancements

### Planned Test Additions
1. **E2E Tests**: Playwright for full user journeys
2. **Visual Regression**: Screenshot comparisons
3. **Performance Tests**: Lighthouse CI
4. **Load Tests**: Stress testing with large datasets

### Test Automation
1. **Pre-commit Hooks**: Run tests before commits
2. **PR Validation**: Automated test runs on pull requests
3. **Coverage Thresholds**: Prevent coverage degradation
4. **Parallel Execution**: Faster test runs

This comprehensive testing setup ensures that the Company Fit Explorer maintains high quality and reliability as new features are added and existing functionality is modified.