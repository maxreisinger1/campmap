# Testing Documentation

This project includes comprehensive testing for all components, hooks, utilities, and services. The testing setup uses Jest and React Testing Library.

## Test Structure

```
src/testing/
├── components/           # Component tests
├── hooks/               # React hooks tests
├── utils/               # Utility function tests
├── services/            # Service layer tests
├── context/             # Context provider tests
├── integration/         # Integration tests
├── testSetup.js         # Global test setup
├── setupTests.js        # Jest DOM setup
└── App.test.js          # Main app test
```

## Running Tests

```bash
# Run all tests in watch mode
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (no watch)
npm run test:ci
```

## Coverage Goals

The project maintains the following coverage thresholds:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Test Categories

### 1. Unit Tests

- **Components**: Test rendering, props, user interactions, and styling
- **Hooks**: Test state management, side effects, and return values
- **Utilities**: Test pure functions with various inputs and edge cases
- **Services**: Test API calls, error handling, and data transformation

### 2. Integration Tests

- **FanDemandGlobe**: Full component integration with all dependencies
- **Form Submission**: End-to-end form validation and submission flow
- **Retro Mode**: Mode switching and visual changes

### 3. Context Tests

- **ToastContext**: Provider setup, context consumption, and toast management

## Key Testing Patterns

### Component Testing

```javascript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("component renders correctly", () => {
  render(<Component />);
  expect(screen.getByText("Expected Text")).toBeInTheDocument();
});

test("user interactions work", async () => {
  const user = userEvent.setup();
  render(<Component />);

  const button = screen.getByRole("button");
  await user.click(button);

  expect(/* assertion */).toBeTruthy();
});
```

### Hook Testing

```javascript
import { renderHook, act } from "@testing-library/react";

test("hook behaves correctly", () => {
  const { result } = renderHook(() => useCustomHook());

  expect(result.current.value).toBe(expectedValue);

  act(() => {
    result.current.setValue(newValue);
  });

  expect(result.current.value).toBe(newValue);
});
```

### Service Testing

```javascript
import { mockFunction } from "../service";

jest.mock("../dependency");

test("service handles success", async () => {
  mockDependency.mockResolvedValue(successData);

  const result = await mockFunction();

  expect(result).toEqual(expectedResult);
});

test("service handles errors", async () => {
  mockDependency.mockRejectedValue(new Error("Test error"));

  await expect(mockFunction()).rejects.toThrow("Test error");
});
```

## Mocking Strategy

### External Dependencies

- **Supabase**: Mocked for all database and realtime operations
- **ZIP Lookup API**: Mocked to prevent external API calls
- **DOM APIs**: Mocked for File/Blob operations and animations

### Component Dependencies

- **Lazy Components**: Mocked to avoid complex dependencies in tests
- **Context Providers**: Real providers used for integration, mocked for isolation

## Test Files Overview

### Components

- `Header.test.js` - Header component with retro mode toggle
- `Footer.test.js` - Footer component with copyright and roadmap
- `RetroLoader.test.js` - Loading component with retro styling
- `RetroToast.test.js` - Toast notifications with auto-close

### Hooks

- `useSubmitSignup.test.js` - Form submission with validation and API calls
- `useLiveSubmissions.test.js` - Real-time submissions with Supabase

### Utilities

- `helpers.test.js` - UID generation and clamp function
- `zipLookup.test.js` - ZIP code geocoding API
- `csv.test.js` - CSV export functionality
- `errorParser.test.js` - Error message parsing for different formats

### Services

- `SubmissionsService.test.js` - Database operations for submissions
- `supabase.test.js` - Supabase client configuration and edge functions

### Context

- `ToastContext.test.js` - Toast provider and hook consumption

### Integration

- `FanDemandGlobe.integration.test.js` - Full app workflow testing

## Common Test Scenarios

### Form Validation

- Required field validation
- Email format validation
- ZIP code format and length
- Error message display

### API Interactions

- Successful API calls
- Network error handling
- Timeout scenarios
- Response parsing

### User Interactions

- Button clicks and form submissions
- Input field interactions
- Mode switching (retro/normal)
- Toast notifications

### State Management

- React state updates
- Hook state persistence
- Real-time data updates

## Running Specific Tests

```bash
# Run tests for specific file
npm test Header.test.js

# Run tests matching pattern
npm test --testNamePattern="validation"

# Run integration tests only
npm test integration

# Run with verbose output
npm test --verbose
```

## Debugging Tests

```bash
# Run tests in debug mode
npm test --no-coverage --detectOpenHandles

# Run single test file with coverage
npm test -- --coverage --testNamePattern="specific test"
```

## Best Practices

1. **Isolation**: Each test should be independent and not rely on others
2. **Clarity**: Test names should clearly describe what is being tested
3. **Coverage**: Aim for high coverage but focus on meaningful tests
4. **Mocking**: Mock external dependencies but test real interactions when possible
5. **Async**: Properly handle async operations with `waitFor` and `act`
6. **Cleanup**: Clean up timers, event listeners, and other side effects

## Troubleshooting

### Common Issues

1. **Timer Issues**: Use `jest.useFakeTimers()` for components with timeouts
2. **Async Updates**: Use `waitFor()` for state updates that happen asynchronously
3. **Event Handling**: Use `userEvent` instead of `fireEvent` for realistic interactions
4. **Memory Leaks**: Clean up subscriptions and cancel requests in test cleanup

### Test Environment

- **Node Version**: Compatible with project requirements
- **Jest**: Configured through React Scripts
- **Testing Library**: Latest compatible versions
- **User Event**: For realistic user interactions
