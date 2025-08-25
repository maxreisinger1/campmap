# Creator Camp Map - Development Guide

This guide provides comprehensive information for developers working on the Creator Camp Map application.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Strategy](#testing-strategy)
- [Database Development](#database-development)
- [Performance Guidelines](#performance-guidelines)
- [Debugging](#debugging)
- [Contributing](#contributing)

## Getting Started

### Local Development Setup

1. **Clone and Install**:

   ```bash
   git clone https://github.com/maxreisinger1/campmap.git
   cd campmap
   npm install
   ```

2. **Environment Configuration**:

   ```bash
   # Copy example environment file
   cp .env.example .env

   # Add your Supabase credentials
   REACT_APP_SUPABASE_URL=your-local-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-local-anon-key
   ```

3. **Start Development Server**:

   ```bash
   npm start
   ```

4. **Run Tests**:
   ```bash
   npm test
   ```

### Project Structure Deep Dive

```
src/
├── components/              # React components
│   ├── FanDemandGlobe.js   # Main container component
│   ├── GlobeMap.js         # Interactive globe visualization
│   ├── Leaderboard.js      # City rankings display
│   ├── SignupForm.js       # Fan registration form
│   ├── Header.js           # App header
│   ├── Footer.js           # App footer
│   ├── RetroLoader.js      # Loading animations
│   ├── RetroEffects.js     # Visual effects
│   └── RetroToast.js       # Notification system
├── context/                # React context providers
│   └── ToastContext.js     # Global toast state
├── hooks/                  # Custom React hooks
│   ├── useLeaderboard.js   # Leaderboard data management
│   ├── useLiveSubmissions.js # Real-time updates
│   └── useSubmitSignup.js  # Form submission
├── services/               # Business logic & API
│   ├── supabase.js         # Supabase client config
│   ├── SubmissionsService.js # Submission operations
│   ├── CityService.js      # City/leaderboard operations
│   └── testdata.js         # Mock data for development
├── utils/                  # Utility functions
│   ├── helpers.js          # General utilities
│   ├── errorParser.js      # Error handling
│   ├── csv.js              # CSV operations
│   └── zipLookup.js        # ZIP code utilities
├── styles/                 # CSS files
│   ├── App.css
│   ├── index.css
│   └── RetroLoader.css
└── testing/                # Test files
    ├── components/         # Component tests
    ├── hooks/              # Hook tests
    ├── services/           # Service tests
    ├── utils/              # Utility tests
    └── integration/        # Integration tests
```

## Development Workflow

### Git Workflow

1. **Feature Development**:

   ```bash
   # Create feature branch
   git checkout -b feature/your-feature-name

   # Make changes and commit
   git add .
   git commit -m "feat: add new feature description"

   # Push and create PR
   git push origin feature/your-feature-name
   ```

2. **Commit Convention**:

   ```
   type(scope): description

   Types:
   - feat: New feature
   - fix: Bug fix
   - docs: Documentation changes
   - style: Code style changes
   - refactor: Code refactoring
   - test: Test additions/updates
   - chore: Build/dependency updates
   ```

3. **Branch Protection**:
   - Main branch requires PR reviews
   - All tests must pass before merge
   - Code coverage must maintain >80%

### Development Scripts

```bash
# Development
npm start                    # Start dev server
npm run build               # Production build
npm run build:analyze       # Bundle analysis

# Testing
npm test                    # Run tests in watch mode
npm run test:coverage       # Run tests with coverage
npm run test:ci             # Run tests in CI mode
```

## Code Standards

### ESLint Configuration

The project uses a comprehensive ESLint configuration:

```javascript
// .eslintrc.js
module.exports = {
  extends: ["react-app", "react-app/jest"],
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "warn",
  },
  overrides: [
    {
      files: ["**/*.test.js", "**/*.spec.js"],
      rules: {
        "no-console": "off",
      },
    },
  ],
};
```

### Code Style Guidelines

#### Component Structure

```javascript
/**
 * Component documentation
 */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function ComponentName({ prop1, prop2 }) {
  // State declarations
  const [state, setState] = useState(initialValue);

  // Effect hooks
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  // Event handlers
  const handleEvent = (event) => {
    // Handler logic
  };

  // Render
  return <div>{/* JSX content */}</div>;
}

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.func,
};

ComponentName.defaultProps = {
  prop2: () => {},
};

export default ComponentName;
```

#### Service Layer Pattern

```javascript
/**
 * Service documentation
 */
import { supabase } from "./supabase";
import { parseError } from "../utils/errorParser";

/**
 * Function documentation
 */
export async function serviceFunction(parameters) {
  try {
    const { data, error } = await supabase
      .from("table")
      .select("*")
      .eq("field", value);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Service error: ${error.message}`);
    throw error;
  }
}
```

#### Custom Hook Pattern

```javascript
/**
 * Hook documentation
 */
import { useState, useEffect, useCallback } from "react";

export function useCustomHook(initialValue) {
  const [state, setState] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const operation = useCallback(async (params) => {
    setLoading(true);
    setError(null);

    try {
      const result = await performOperation(params);
      setState(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    state,
    loading,
    error,
    operation,
  };
}
```

### Documentation Standards

#### JSDoc Comments

````javascript
/**
 * Brief description of the function.
 *
 * @async
 * @function functionName
 * @param {string} param1 - Description of param1
 * @param {Object} param2 - Description of param2
 * @param {number} param2.property - Description of property
 * @returns {Promise<Object>} Description of return value
 * @throws {Error} When validation fails
 *
 * @example
 * ```javascript
 * const result = await functionName('value', { property: 123 });
 * console.log(result);
 * ```
 */
````

#### Component Documentation

````javascript
/**
 * Component description and purpose.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display
 * @param {Function} props.onSubmit - Callback for form submission
 * @returns {JSX.Element} The rendered component
 *
 * @example
 * ```jsx
 * <ComponentName
 *   title="My Title"
 *   onSubmit={(data) => console.log(data)}
 * />
 * ```
 */
````

## Testing Strategy

### Test Structure

```
src/testing/
├── components/              # Component tests
│   ├── Component.test.js   # Standard component tests
│   └── Component.integration.test.js # Integration tests
├── hooks/                  # Hook tests
│   └── useHook.test.js
├── services/               # Service tests
│   └── Service.test.js
├── utils/                  # Utility tests
│   └── utility.test.js
├── setupTests.js           # Test configuration
└── testUtils.js            # Test utilities
```

### Test Categories

#### Unit Tests

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Component from "../Component";

describe("Component", () => {
  test("renders correctly with props", () => {
    render(<Component title="Test Title" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  test("handles user interactions", async () => {
    const onSubmit = jest.fn();
    render(<Component onSubmit={onSubmit} />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
```

#### Hook Tests

```javascript
import { renderHook, act } from "@testing-library/react";
import { useCustomHook } from "../useCustomHook";

describe("useCustomHook", () => {
  test("initializes with correct state", () => {
    const { result } = renderHook(() => useCustomHook("initial"));

    expect(result.current.state).toBe("initial");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test("handles async operations", async () => {
    const { result } = renderHook(() => useCustomHook());

    await act(async () => {
      await result.current.operation("test");
    });

    expect(result.current.state).toBe("test");
  });
});
```

#### Service Tests

```javascript
import { serviceFunction } from "../service";
import { supabase } from "../supabase";

// Mock Supabase
jest.mock("../supabase");

describe("serviceFunction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("successfully fetches data", async () => {
    const mockData = [{ id: 1, name: "Test" }];
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: mockData,
          error: null,
        }),
      }),
    });

    const result = await serviceFunction("test");
    expect(result).toEqual(mockData);
  });

  test("handles errors correctly", async () => {
    const mockError = new Error("Database error");
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      }),
    });

    await expect(serviceFunction("test")).rejects.toThrow("Database error");
  });
});
```

### Integration Tests

```javascript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import * as api from "../services/api";

// Mock API calls
jest.mock("../services/api");

describe("App Integration", () => {
  test("complete user flow", async () => {
    // Mock API responses
    api.loadSubmissions.mockResolvedValue([]);
    api.getCityLeaderboard.mockResolvedValue([]);
    api.addSubmission.mockResolvedValue({ success: true });

    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(/creator camp/i)).toBeInTheDocument();
    });

    // Fill form
    await userEvent.type(screen.getByLabelText(/name/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "john@example.com");
    await userEvent.type(screen.getByLabelText(/zip/i), "12345");

    // Submit form
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Verify submission
    await waitFor(() => {
      expect(api.addSubmission).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        zip: "12345",
      });
    });
  });
});
```

### Coverage Requirements

Maintain minimum coverage thresholds:

```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    "./src/services/": {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
```

## Database Development

### Local Database Setup

1. **Supabase CLI Installation**:

   ```bash
   npm install -g @supabase/cli
   supabase login
   ```

2. **Initialize Local Project**:

   ```bash
   supabase init
   supabase start
   ```

3. **Database Migrations**:

   ```bash
   # Create migration
   supabase migration new create_tables

   # Apply migrations
   supabase db reset

   # Generate types
   supabase gen types typescript --local > src/types/database.ts
   ```

### Schema Development

#### Migration Example

```sql
-- migrations/20240101000000_create_tables.sql

-- Cities table
CREATE TABLE cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  threshold INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions table
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  zip TEXT NOT NULL,
  city_id UUID REFERENCES cities(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access" ON cities FOR SELECT USING (true);

-- Create indexes
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX idx_submissions_city_id ON submissions(city_id);

-- Create views
CREATE VIEW submissions_public AS
SELECT
  id,
  city.name as city,
  created_at
FROM submissions s
JOIN cities c ON s.city_id = c.id;
```

### Seed Data

```sql
-- seed.sql
INSERT INTO cities (name, state, latitude, longitude, threshold) VALUES
('Austin', 'TX', 30.2672, -97.7431, 100),
('Los Angeles', 'CA', 34.0522, -118.2437, 200),
('New York', 'NY', 40.7128, -74.0060, 300);
```

## Performance Guidelines

### React Performance

#### Memoization

```javascript
import React, { memo, useMemo, useCallback } from "react";

const ExpensiveComponent = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      computed: expensiveCalculation(item),
    }));
  }, [data]);

  const handleUpdate = useCallback(
    (id, changes) => {
      onUpdate(id, changes);
    },
    [onUpdate]
  );

  return (
    <div>
      {processedData.map((item) => (
        <Item key={item.id} data={item} onUpdate={handleUpdate} />
      ))}
    </div>
  );
});
```

#### Code Splitting

```javascript
import { lazy, Suspense } from "react";

const LazyComponent = lazy(() => import("./LazyComponent"));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### Database Performance

#### Query Optimization

```javascript
// Efficient: Select only needed columns
const { data } = await supabase
  .from("submissions")
  .select("id, name, city_id, created_at")
  .order("created_at", { ascending: false })
  .limit(100);

// Inefficient: Select all columns
const { data } = await supabase
  .from("submissions")
  .select("*")
  .order("created_at", { ascending: false });
```

#### Real-time Optimization

```javascript
// Efficient: Specific event filtering
const channel = supabase
  .channel("submissions")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "submissions_public",
    },
    handleUpdate
  )
  .subscribe();

// Inefficient: Listen to all changes
const channel = supabase
  .channel("all-changes")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
    },
    handleUpdate
  )
  .subscribe();
```

## Debugging

### Development Tools

#### React DevTools

```javascript
// Enable React DevTools profiler
if (process.env.NODE_ENV === "development") {
  import("react-dom").then(({ unstable_trace: trace }) => {
    window.trace = trace;
  });
}
```

#### Console Debugging

```javascript
// Debug utility
const debug = {
  api: process.env.NODE_ENV === "development",
  realtime: process.env.NODE_ENV === "development",
  performance: process.env.NODE_ENV === "development",
};

export const log = {
  api: (...args) => debug.api && console.log("[API]", ...args),
  realtime: (...args) => debug.realtime && console.log("[RT]", ...args),
  perf: (...args) => debug.performance && console.log("[PERF]", ...args),
};
```

### Error Tracking

#### Error Boundaries

```javascript
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error boundary caught:", error, errorInfo);

    // Report to error tracking service
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: { errorInfo },
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>Reload page</button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Contributing

### Pull Request Process

1. **Before Creating PR**:

   ```bash
   # Update from main
   git checkout main
   git pull origin main
   git checkout feature-branch
   git rebase main

   # Run tests
   npm run test:ci
   npm run lint
   ```

2. **PR Checklist**:

   - [ ] Tests added for new functionality
   - [ ] Documentation updated
   - [ ] Code coverage maintained
   - [ ] No console errors
   - [ ] Performance impact considered
   - [ ] Accessibility tested

3. **Code Review Guidelines**:
   - Focus on code correctness and maintainability
   - Check for security vulnerabilities
   - Verify test coverage
   - Ensure documentation is updated
   - Consider performance implications

### Release Process

1. **Version Bumping**:

   ```bash
   npm version patch  # Bug fixes
   npm version minor  # New features
   npm version major  # Breaking changes
   ```

2. **Release Notes**:

   - Document new features
   - List bug fixes
   - Note breaking changes
   - Include migration instructions

3. **Deployment**:

   ```bash
   # Tag release
   git tag v1.0.0
   git push origin v1.0.0

   # Deploy to production
   npm run deploy:prod
   ```
