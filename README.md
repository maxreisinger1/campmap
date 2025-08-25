# Creator Camp Map

An interactive web application for visualizing and tracking fan demand and event progress across cities, built with React and Supabase.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Component Documentation](#component-documentation)
- [Testing](#testing)
- [Performance](#performance)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

Creator Camp Map is a real-time dashboard for fans and event organizers to track city-based demand, event progress, and leaderboard rankings. The app leverages Supabase for live data updates and provides a visually engaging experience with an interactive globe interface.

The application allows users to:

- View real-time fan signup data on an interactive globe
- Track city leaderboards with progress ratios
- Submit fan signups through a retro-styled form
- Monitor event metrics and city thresholds
- Experience responsive design with retro aesthetics

## Features

- **Real-time Data**: Live updates via Supabase realtime subscriptions
- **Interactive Globe**: 3D globe visualization using react-simple-maps
- **City Leaderboard**: Dynamic ranking system with progress tracking
- **Fan Signup System**: Form submission with validation and feedback
- **Retro UI**: Terminal-inspired design with green text on black backgrounds
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Comprehensive error parsing and user feedback
- **Testing Coverage**: Extensive test suite with >80% coverage
- **Performance Optimization**: Lazy loading and code splitting

## Tech Stack

- **Frontend**: React 18.3.1 (Create React App)
- **Database**: Supabase (PostgreSQL with realtime subscriptions)
- **Styling**: Tailwind CSS with custom retro theming
- **Maps**: react-simple-maps for globe visualization
- **Testing**: Jest, React Testing Library
- **Load Testing**: k6 for performance testing
- **Deployment**: Optimized for modern browsers

## Architecture

The application follows a modular architecture with clear separation of concerns:

```
├── Components/        # Reusable UI components
├── Hooks/            # Custom React hooks for data management
├── Services/         # API and data services
├── Context/          # React context for state management
├── Utils/            # Utility functions and helpers
└── Testing/          # Comprehensive test suite
```

### Key Architectural Patterns

- **Custom Hooks**: Data fetching and state management
- **Context API**: Global state for toast notifications
- **Service Layer**: Abstracted API calls and business logic
- **Error Boundaries**: Graceful error handling
- **Lazy Loading**: Performance optimization for components

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Supabase project with configured database tables

### Environment Setup

1. Create a `.env` file in the root directory:
   ```env
   REACT_APP_SUPABASE_URL=your-supabase-project-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/maxreisinger1/campmap.git
   cd campmap
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run test:coverage` - Runs tests with coverage reporting
- `npm run test:ci` - Runs tests in CI mode with coverage

## Project Structure

```
src/
├── components/          # React UI components
│   ├── FanDemandGlobe.js   # Main globe container component
│   ├── GlobeMap.js         # Interactive globe visualization
│   ├── Leaderboard.js      # City rankings display
│   ├── SignupForm.js       # Fan registration form
│   ├── Header.js           # Application header
│   ├── Footer.js           # Application footer
│   ├── RetroLoader.js      # Loading animation
│   ├── RetroEffects.js     # Visual effects
│   └── RetroToast.js       # Notification system
├── context/             # React context providers
│   └── ToastContext.js     # Global toast notification state
├── hooks/               # Custom React hooks
│   ├── useLeaderboard.js   # City leaderboard data management
│   ├── useLiveSubmissions.js # Real-time submission updates
│   └── useSubmitSignup.js  # Form submission handling
├── services/            # API and business logic
│   ├── supabase.js         # Supabase client configuration
│   ├── SubmissionsService.js # Submission CRUD operations
│   ├── CityService.js      # City and leaderboard operations
│   └── testdata.js         # Mock data for development
├── utils/               # Utility functions
│   ├── helpers.js          # General utility functions
│   ├── errorParser.js      # Error handling utilities
│   ├── csv.js              # CSV parsing functions
│   └── zipLookup.js        # ZIP code utilities
├── styles/              # CSS files
│   ├── App.css
│   ├── index.css
│   └── RetroLoader.css
└── testing/             # Test files (mirrors src structure)
    ├── components/
    ├── hooks/
    ├── services/
    └── utils/
```

## API Documentation

### Supabase Database Schema

The application uses the following main tables:

#### submissions_public

- Public view of fan submissions
- Columns: `id`, `name`, `email`, `zip`, `city`, `created_at`

#### city_leaderboard

- Aggregated city metrics and rankings
- Columns: `city_id`, `city_name`, `signup_count`, `city_threshold`, `progress_ratio`, `evey_event_url`

#### city_metrics

- Real-time city statistics
- Columns: `city_id`, `signup_count`, `last_updated`

### Edge Functions

#### submit_signup

- **Purpose**: Handles fan signup submissions
- **Input**: `{ name, email, zip }`
- **Output**: `{ submission: {...}, city: {...} }`
- **Validation**: Email format, required fields, ZIP code lookup

### Service Layer

#### SubmissionsService

```javascript
// Load all public submissions
loadSubmissions() → Promise<Submission[]>

// Add new fan submission
addSubmission(submission) → Promise<{submission, city}>
```

#### CityService

```javascript
// Get city leaderboard data
getCityLeaderboard() → Promise<CityLeaderboard[]>

// Subscribe to real-time updates
subscribeToCityLeaderboard(callback) → UnsubscribeFunction
```

## Component Documentation

### Core Components

#### FanDemandGlobe

- **Purpose**: Main container component that orchestrates the entire application
- **Features**: Globe interaction, form handling, real-time updates
- **Props**: None (top-level component)
- **State Management**: Uses multiple custom hooks for data fetching

#### GlobeMap

- **Purpose**: Interactive 3D globe visualization using react-simple-maps
- **Props**:
  - `submissions`: Array of submission data
  - `rotate`: Globe rotation state
  - `zoom`: Current zoom level
  - `onCountryClick`: Callback for country interactions
- **Features**: Orthographic projection, animated transitions, responsive sizing

#### Leaderboard

- **Purpose**: Displays city rankings with progress indicators
- **Props**:
  - `data`: Leaderboard data array
  - `loading`: Loading state boolean
- **Features**: Progress bars, city links, responsive design

#### SignupForm

- **Purpose**: Fan registration form with validation
- **Features**: Real-time validation, ZIP code lookup, success feedback
- **Validation**: Email format, required fields, ZIP code format

### Utility Components

#### RetroLoader

- **Purpose**: Retro-styled loading animation
- **Features**: Terminal-inspired design, smooth animations

#### RetroToast

- **Purpose**: Notification system with retro styling
- **Props**: `message`, `show`, `onClose`, `retroMode`

## Custom Hooks Documentation

### useLeaderboard()

```javascript
const { data, loading, error } = useLeaderboard();
```

- **Purpose**: Manages city leaderboard data with real-time updates
- **Returns**: `{ data: CityLeaderboard[], loading: boolean, error: string }`
- **Features**: Automatic data fetching, real-time subscriptions, error handling

### useLiveSubmissions(initialData)

```javascript
const [submissions, setSubmissions] = useLiveSubmissions([]);
```

- **Purpose**: Manages real-time submission updates
- **Parameters**: `initialData` - Array of initial submissions
- **Returns**: `[submissions, setSubmissions]`
- **Features**: Real-time Supabase subscriptions, automatic cleanup

### useSubmitSignup()

```javascript
const { submitSignup, loading, error, success } = useSubmitSignup();
```

- **Purpose**: Handles form submission with validation and feedback
- **Returns**: Object with submit function and state
- **Features**: Loading states, error handling, success callbacks

## Testing

### Test Coverage

The project maintains high test coverage (>80%) across all modules:

- **Components**: Unit tests for all UI components
- **Hooks**: Custom hook testing with React Testing Library
- **Services**: API service mocking and integration tests
- **Utils**: Utility function unit tests

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Run specific test file
npm test -- SignupForm.test.js
```

### Test Structure

```
src/testing/
├── components/          # Component tests
├── hooks/              # Hook tests
├── services/           # Service layer tests
├── utils/              # Utility tests
├── integration/        # Integration tests
└── setupTests.js       # Test configuration
```

### Load Testing

The project includes k6 load testing scripts:

```bash
# Run load test against submit_signup endpoint
k6 run -e SUPABASE_FUNCTION_URL=your-url -e SUPABASE_ANON_KEY=your-key loadtest.js
```

## Performance

### Optimization Strategies

- **Code Splitting**: Lazy loading of components with React.lazy()
- **Memoization**: React.memo and useMemo for expensive computations
- **Realtime Throttling**: Limited to 2 events per second for Supabase connections
- **Bundle Optimization**: Tree shaking and modern JS output

### Performance Monitoring

- Web Vitals integration for Core Web Vitals tracking
- Error boundaries for graceful error handling
- Timeout configurations for API calls (8s default)

## Deployment

### Quick Deploy to Vercel (Recommended)

The fastest way to deploy Creator Camp Map:

1. **Push to GitHub**: Ensure your code is committed and pushed
2. **Import to Vercel**: Visit [vercel.com/new](https://vercel.com/new) and import your repository
3. **Set Environment Variables**: Add Supabase credentials in Vercel dashboard
4. **Deploy**: Vercel automatically builds and deploys

### Production Build

```bash
npm run build
```

### Environment Variables (Production)

Set these in your Vercel dashboard (Settings → Environment Variables):

```env
REACT_APP_SUPABASE_URL=your-production-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-production-anon-key
GENERATE_SOURCEMAP=false
```

### Deployment Checklist

- [ ] Environment variables configured in Vercel
- [ ] Supabase RLS policies enabled
- [ ] Edge functions deployed to Supabase
- [ ] Database tables created
- [ ] DNS and SSL configured
- [ ] Performance monitoring enabled

## Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes with appropriate tests
4. Run the test suite: `npm test`
5. Submit a pull request

### Code Standards

- Follow ESLint configuration
- Maintain test coverage above 80%
- Use TypeScript-style JSDoc comments
- Follow React best practices and hooks patterns

### Commit Convention

Use conventional commit format:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `test:` Test additions/updates
- `refactor:` Code refactoring

## License

This project is licensed under the MIT License. See the LICENSE file for details.
services/ # API and data services
styles/ # CSS and Tailwind styles
utils/ # Utility functions
App.js # Main app component
index.js # Entry point

```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
```
