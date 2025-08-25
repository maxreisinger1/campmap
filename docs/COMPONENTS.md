# Creator Camp Map - Component Documentation

This document provides detailed information about the React components used in the Creator Camp Map application.

## Table of Contents

- [Component Architecture](#component-architecture)
- [Core Components](#core-components)
- [UI Components](#ui-components)
- [Component Props](#component-props)
- [State Management](#state-management)
- [Performance Considerations](#performance-considerations)

## Component Architecture

The application follows a modular component architecture with clear separation of concerns:

```
FanDemandGlobe (Main Container)
├── Header
├── GlobeMap
├── SignupForm
├── Leaderboard
├── Footer
├── RetroEffects
└── RetroToast (via Context)
```

### Design Patterns

- **Container/Presentational**: FanDemandGlobe manages state, child components handle presentation
- **Lazy Loading**: All major components are lazy-loaded for performance
- **Context API**: Toast notifications use React Context for global state
- **Custom Hooks**: Data fetching and business logic abstracted into hooks

## Core Components

### FanDemandGlobe

**Purpose**: Main container component that orchestrates the entire application.

**Location**: `src/components/FanDemandGlobe.js`

**Responsibilities**:

- Globe rotation and zoom management
- Real-time data coordination
- Form submission handling
- Layout and component orchestration

**State Management**:

```javascript
const [rotate, setRotate] = useState([-20, -15, 0]);
const [zoom, setZoom] = useState(1.15);
const [cursor, setCursor] = useState("grab");
```

**Custom Hooks Used**:

- `useLiveSubmissions()` - Real-time submission updates
- `useLeaderboard()` - City leaderboard data
- `useSubmitSignup()` - Form submission handling

**Key Features**:

- Animated globe transitions to focus on cities
- Real-time data updates without full re-renders
- Responsive layout adaptation
- Touch and mouse interaction handling

### GlobeMap

**Purpose**: Interactive 3D globe visualization using react-simple-maps.

**Location**: `src/components/GlobeMap.js`

**Props**:

```typescript
interface GlobeMapProps {
  submissions: PublicSubmission[];
  rotate: [number, number, number];
  zoom: number;
  onCountryClick?: (country: CountryData) => void;
  className?: string;
}
```

**Features**:

- Orthographic projection for 3D effect
- Country highlighting on hover
- Submission markers with clustering
- Responsive SVG scaling
- Smooth rotation animations

**Performance Optimizations**:

- Memoized country path calculations
- Debounced hover events
- Optimized re-render conditions

### Leaderboard

**Purpose**: Displays city rankings with progress indicators.

**Location**: `src/components/Leaderboard.js`

**Props**:

```typescript
interface LeaderboardProps {
  data: CityLeaderboard[];
  loading: boolean;
  error?: string;
  onCityClick?: (city: CityLeaderboard) => void;
}
```

**Features**:

- Animated progress bars
- Sortable columns
- City event links
- Loading states
- Error boundaries

**Data Flow**:

```javascript
useLeaderboard() → Leaderboard → Progress visualization
```

### SignupForm

**Purpose**: Fan registration form with validation and feedback.

**Location**: `src/components/SignupForm.js`

**State Management**:

```javascript
const [formData, setFormData] = useState({
  name: "",
  email: "",
  zip: "",
});
```

**Validation Rules**:

- **Name**: Required, minimum 2 characters
- **Email**: Valid email format using regex
- **ZIP**: 5-digit US ZIP code format

**Form Flow**:

1. Input validation (real-time)
2. ZIP code lookup
3. City assignment
4. Submission to Edge Function
5. Success/error feedback

**Features**:

- Real-time validation
- Auto-complete suggestions
- Keyboard navigation
- Accessibility compliance

## UI Components

### Header

**Purpose**: Application header with branding and navigation.

**Location**: `src/components/Header.js`

**Features**:

- Retro terminal styling
- Responsive logo display
- Animation effects

### Footer

**Purpose**: Application footer with links and attribution.

**Location**: `src/components/Footer.js`

**Features**:

- Social media links
- Legal information
- Consistent retro theming

### RetroLoader

**Purpose**: Loading animation with retro terminal aesthetics.

**Location**: `src/components/RetroLoader.js`

**Props**:

```typescript
interface RetroLoaderProps {
  message?: string;
  size?: "small" | "medium" | "large";
  className?: string;
}
```

**Features**:

- CSS animations
- Customizable size and message
- Terminal-style effects

### RetroToast

**Purpose**: Notification system with retro styling.

**Location**: `src/components/RetroToast.js`

**Props**:

```typescript
interface RetroToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  retroMode?: boolean;
  duration?: number;
}
```

**Features**:

- Auto-dismiss functionality
- Multiple toast types
- Slide animations
- Screen reader support

### RetroEffects

**Purpose**: Visual effects and ambient animations.

**Location**: `src/components/RetroEffects.js`

**Features**:

- CSS-based particle effects
- Responsive animations
- Performance-optimized rendering

## Component Props

### Common Prop Patterns

#### Data Props

```typescript
interface DataProps {
  data: any[];
  loading: boolean;
  error?: string | null;
}
```

#### Event Handler Props

```typescript
interface EventProps {
  onClick?: (item: any) => void;
  onSubmit?: (data: any) => Promise<void>;
  onUpdate?: (changes: any) => void;
}
```

#### Styling Props

```typescript
interface StyleProps {
  className?: string;
  variant?: "primary" | "secondary" | "success" | "error";
  size?: "small" | "medium" | "large";
}
```

### Prop Validation

Components use PropTypes for runtime validation:

```javascript
import PropTypes from "prop-types";

Component.propTypes = {
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onUpdate: PropTypes.func,
};

Component.defaultProps = {
  loading: false,
  onUpdate: () => {},
};
```

## State Management

### Component State Patterns

#### Form State

```javascript
const [formData, setFormData] = useState({
  name: "",
  email: "",
  zip: "",
});

const updateField = (field, value) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};
```

#### Async State

```javascript
const [state, setState] = useState({
  data: [],
  loading: false,
  error: null,
});

const loadData = async () => {
  setState((prev) => ({ ...prev, loading: true, error: null }));
  try {
    const data = await fetchData();
    setState((prev) => ({ ...prev, data, loading: false }));
  } catch (error) {
    setState((prev) => ({ ...prev, error: error.message, loading: false }));
  }
};
```

#### Animation State

```javascript
const [animation, setAnimation] = useState({
  rotate: [0, 0, 0],
  transitioning: false,
  targetLocation: null,
});

const animateToLocation = (location) => {
  setAnimation((prev) => ({
    ...prev,
    transitioning: true,
    targetLocation: location,
  }));
};
```

### Context Usage

#### ToastContext

```javascript
// Provider setup
export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    retroMode: false,
  });

  const showToast = useCallback((message, retroMode = false) => {
    setToast({ show: true, message, retroMode });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <RetroToast {...toast} onClose={closeToast} />
    </ToastContext.Provider>
  );
}

// Component usage
function Component() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast("Signup successful!", true);
  };
}
```

## Performance Considerations

### Lazy Loading

All major components are lazy-loaded to reduce initial bundle size:

```javascript
const FanDemandGlobe = lazy(() => import("./components/FanDemandGlobe"));
const SignupForm = lazy(() => import("./SignupForm"));
const Leaderboard = lazy(() => import("./Leaderboard"));
```

### Memoization

Components use React.memo and useMemo for optimization:

```javascript
const MemoizedComponent = React.memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      computed: expensiveCalculation(item),
    }));
  }, [data]);

  return <div>{/* Render processedData */}</div>;
});
```

### Virtual Scrolling

For large data sets, consider implementing virtual scrolling:

```javascript
const VirtualizedList = ({ items }) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });

  const visibleItems = useMemo(
    () => items.slice(visibleRange.start, visibleRange.end),
    [items, visibleRange]
  );

  return (
    <div onScroll={handleScroll}>
      {visibleItems.map((item) => (
        <Item key={item.id} {...item} />
      ))}
    </div>
  );
};
```

### Event Optimization

Debounce expensive operations:

```javascript
import { useCallback, useRef } from "react";

const useDebounced = (callback, delay) => {
  const timeoutRef = useRef();

  return useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
};

// Usage
const debouncedSearch = useDebounced((query) => {
  performSearch(query);
}, 300);
```

### Bundle Optimization

- **Code Splitting**: Implemented via React.lazy()
- **Tree Shaking**: Remove unused exports
- **Dynamic Imports**: Load features on demand
- **Asset Optimization**: Compress images and optimize SVGs

### Memory Management

- **Cleanup Subscriptions**: Always cleanup in useEffect
- **Avoid Memory Leaks**: Set cancelled flags for async operations
- **Optimize Re-renders**: Use React.memo strategically

```javascript
useEffect(() => {
  let cancelled = false;

  const subscription = subscribeToUpdates((data) => {
    if (!cancelled) {
      setData(data);
    }
  });

  return () => {
    cancelled = true;
    subscription.unsubscribe();
  };
}, []);
```

## Testing Components

### Component Testing Strategy

```javascript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("SignupForm", () => {
  test("validates required fields", async () => {
    const onSubmit = jest.fn();
    render(<SignupForm onSubmit={onSubmit} />);

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("submits valid form data", async () => {
    const onSubmit = jest.fn().mockResolvedValue({});
    render(<SignupForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/name/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "john@example.com");
    await userEvent.type(screen.getByLabelText(/zip/i), "12345");

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        zip: "12345",
      });
    });
  });
});
```

### Accessibility Testing

```javascript
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

test("component has no accessibility violations", async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```
