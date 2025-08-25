# Creator Camp Map - API Documentation

This document provides detailed information about the Creator Camp Map application's API, data structures, and service interfaces.

## Table of Contents

- [Database Schema](#database-schema)
- [Edge Functions](#edge-functions)
- [Service Layer API](#service-layer-api)
- [Data Types](#data-types)
- [Error Handling](#error-handling)
- [Real-time Subscriptions](#real-time-subscriptions)

## Database Schema

### Tables

#### `submissions`

Main table for storing fan signups (private, accessed via RLS policies).

| Column             | Type             | Description                            |
| ------------------ | ---------------- | -------------------------------------- |
| `id`               | UUID             | Primary key, auto-generated            |
| `created_at`       | TIMESTAMPTZ      | Auto-generated timestamp               |
| `name`             | TEXT             | Fan's full name                        |
| `email`            | CITEXT           | Fan's email address (case-insensitive) |
| `email_normalized` | TEXT             | Normalized email for deduplication     |
| `zip`              | TEXT             | Fan's ZIP code                         |
| `state`            | TEXT             | State derived from ZIP                 |
| `lat`              | DOUBLE PRECISION | Latitude coordinate                    |
| `lon`              | DOUBLE PRECISION | Longitude coordinate                   |
| `city`             | TEXT             | City name (required)                   |
| `city_id`          | UUID             | Foreign key to cities table            |
| `ip_hash`          | TEXT             | Hashed IP for fraud prevention         |

#### `submissions_public`

Public view of submissions with PII removed.

| Column       | Type             | Description          |
| ------------ | ---------------- | -------------------- |
| `id`         | UUID             | Submission ID        |
| `city`       | TEXT             | City name            |
| `lat`        | DOUBLE PRECISION | Latitude coordinate  |
| `lon`        | DOUBLE PRECISION | Longitude coordinate |
| `created_at` | TIMESTAMPTZ      | Creation timestamp   |

#### `cities`

City configuration and metadata.

| Column       | Type        | Description                           |
| ------------ | ----------- | ------------------------------------- |
| `id`         | UUID        | Primary key                           |
| `name`       | TEXT        | City name (required)                  |
| `state`      | TEXT        | State/province                        |
| `threshold`  | INTEGER     | Required signups for event (required) |
| `created_at` | TIMESTAMPTZ | Creation timestamp                    |

#### `city_metrics`

Real-time city statistics.

| Column           | Type        | Description                        |
| ---------------- | ----------- | ---------------------------------- |
| `city_id`        | UUID        | Primary key, foreign key to cities |
| `signup_count`   | BIGINT      | Current signup count (required)    |
| `last_signup_at` | TIMESTAMPTZ | Timestamp of last signup           |

#### `events`

Event information and ticket sales.

| Column                   | Type        | Description                                |
| ------------------------ | ----------- | ------------------------------------------ |
| `id`                     | UUID        | Primary key                                |
| `city_id`                | UUID        | Foreign key to cities                      |
| `event_name`             | TEXT        | Name of the event (required)               |
| `event_date`             | TIMESTAMPTZ | Scheduled event date                       |
| `evey_event_url`         | TEXT        | Event booking URL                          |
| `qr_code_url`            | TEXT        | QR code for event access                   |
| `created_at`             | TIMESTAMPTZ | Creation timestamp                         |
| `tickets_sold`           | INTEGER     | Number of tickets sold                     |
| `prepurchase_enabled_at` | TIMESTAMPTZ | When ticket sales opened                   |
| `shopify_product_id`     | TEXT        | Shopify integration ID                     |
| `shopify_variant_id`     | TEXT        | Shopify variant ID                         |
| `evey_event_id`          | TEXT        | Evey platform event ID                     |
| `tickets_paused`         | BOOLEAN     | Whether ticket sales are paused (required) |

#### `ticket_sales`

Individual ticket purchase records.

| Column           | Type        | Description                            |
| ---------------- | ----------- | -------------------------------------- |
| `id`             | UUID        | Primary key                            |
| `city_id`        | UUID        | Foreign key to cities                  |
| `order_id`       | TEXT        | Order identifier (required)            |
| `customer_email` | TEXT        | Purchaser's email                      |
| `quantity`       | INTEGER     | Number of tickets purchased (required) |
| `purchased_at`   | TIMESTAMPTZ | Purchase timestamp (required)          |

### Views

#### `city_leaderboard`

Comprehensive view combining city data, metrics, and event information.

| Column                   | Type        | Description                              |
| ------------------------ | ----------- | ---------------------------------------- |
| `city_id`                | UUID        | City identifier                          |
| `city_name`              | TEXT        | City name                                |
| `city_state`             | TEXT        | State/province                           |
| `city_threshold`         | INTEGER     | Required signups for event               |
| `signup_count`           | BIGINT      | Current signup count                     |
| `progress_ratio`         | NUMERIC     | signup_count / city_threshold            |
| `evey_event_url`         | TEXT        | Event booking URL                        |
| `prepurchase_enabled_at` | TIMESTAMPTZ | When ticket sales opened                 |
| `tickets_sold`           | INTEGER     | Number of tickets sold                   |
| `tickets_paused`         | BOOLEAN     | Whether ticket sales are paused          |
| `tickets_available`      | BOOLEAN     | Computed: tickets available for purchase |

## Edge Functions

### `submit_signup`

Handles fan signup submissions with validation and city assignment.

#### Request

```typescript
interface SubmitSignupRequest {
  name: string; // Fan's full name (required)
  email: string; // Valid email address (required)
  zip: string; // ZIP code (required)
  city: string; // City name from ZIP code lookup
  state: string; // State name from ZIP code lookup
  lat: number; // Latitude coordinate
  lon: number; // Longitude coordinate
}
```

#### Response

```typescript
interface SubmitSignupResponse {
  submission: {
    id: string;
    name: string;
    email: string;
    zip: string;
    city_id: string;
    created_at: string;
  };
  city: {
    id: string;
    name: string;
    state: string;
    signup_count: number;
    threshold: number;
  };
}
```

#### Error Responses

| Status | Condition               | Response                                                    |
| ------ | ----------------------- | ----------------------------------------------------------- |
| 400    | Missing required fields | `{ error: "Missing required fields: name, email, or zip" }` |
| 400    | Invalid email format    | `{ error: "Invalid email format" }`                         |
| 404    | ZIP code not found      | `{ error: "ZIP code not found or not supported" }`          |
| 429    | Rate limit exceeded     | `{ error: "Rate limit exceeded" }`                          |
| 500    | Server error            | `{ error: "Internal server error" }`                        |

#### Example Usage

```javascript
const response = await fetch(
  "https://your-project.supabase.co/functions/v1/submit_signup",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      name: "Jane Doe",
      email: "jane@example.com",
      zip: "90210",
    }),
  }
);

const result = await response.json();
```

## Service Layer API

### SubmissionsService

#### `loadSubmissions()`

Loads all public submissions ordered by creation date.

```typescript
function loadSubmissions(): Promise<PublicSubmission[]>;

interface PublicSubmission {
  id: string;
  city: string;
  created_at: string;
}
```

**Example:**

```javascript
import { loadSubmissions } from "./services/SubmissionsService";

try {
  const submissions = await loadSubmissions();
  console.log(`Loaded ${submissions.length} submissions`);
} catch (error) {
  console.error("Failed to load submissions:", error.message);
}
```

#### `addSubmission(submission)`

Submits a new fan signup through the Edge Function.

```typescript
function addSubmission(
  submission: SubmissionData
): Promise<SubmitSignupResponse>;

interface SubmissionData {
  name: string; // Fan's full name (trimmed)
  email: string; // Fan's email address (trimmed and lowercased)
  zip: string; // ZIP code for location lookup
  city: string; // City name from ZIP lookup
  state: string; // State name from ZIP lookup
  lat: number; // Latitude coordinate
  lon: number; // Longitude coordinate
}
```

**Example:**

```javascript
import { addSubmission } from "./services/SubmissionsService";

try {
  const payload = {
    name: "John Smith",
    email: "john@example.com",
    zip: "12345",
    city: "New York",
    state: "NY",
    lat: 40.7128,
    lon: -74.006,
  };

  const result = await addSubmission(payload);
  console.log("Submission successful:", result.submission);
} catch (error) {
  console.error("Submission failed:", error.message);
}
```

### CityService

#### `getCityLeaderboard()`

Fetches the city leaderboard with progress metrics.

```typescript
function getCityLeaderboard(): Promise<CityLeaderboard[]>;

interface CityLeaderboard {
  city_id: string;
  city_name: string;
  signup_count: number;
  city_threshold: number;
  progress_ratio: number;
  evey_event_url?: string;
}
```

**Example:**

```javascript
import { getCityLeaderboard } from "./services/CityService";

const leaderboard = await getCityLeaderboard();
leaderboard.forEach((city) => {
  const progress = Math.round(city.progress_ratio * 100);
  console.log(
    `${city.city_name}: ${progress}% (${city.signup_count}/${city.city_threshold})`
  );
});
```

#### `subscribeToCityLeaderboard(onUpdate)`

Sets up real-time subscriptions for leaderboard changes.

```typescript
function subscribeToCityLeaderboard(
  onUpdate: (type: string, payload: ChangePayload) => void
): () => void;

interface ChangePayload {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new?: Record<string, any>;
  old?: Record<string, any>;
  table: string;
}
```

**Example:**

```javascript
import { subscribeToCityLeaderboard } from "./services/CityService";

const unsubscribe = subscribeToCityLeaderboard((type, payload) => {
  console.log(`${type} table changed:`, payload.new);

  switch (type) {
    case "metrics":
      // Update signup counts
      updateCityMetrics(payload.new);
      break;
    case "events":
      // Update event information
      updateEventInfo(payload.new);
      break;
    case "cities":
      // Refresh city configuration
      refreshCityData();
      break;
  }
});

// Clean up subscription
return () => unsubscribe();
```

## Data Types

### TypeScript Interfaces

```typescript
// Core submission data (private table)
interface Submission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  email_normalized: string | null;
  zip: string | null;
  state: string | null;
  lat: number | null;
  lon: number | null;
  city: string;
  city_id: string | null;
  ip_hash: string | null;
}

// Public submission view
interface PublicSubmission {
  id: string;
  city: string;
  lat: number | null;
  lon: number | null;
  created_at: string;
}

// City information
interface City {
  id: string;
  name: string;
  state: string | null;
  threshold: number;
  created_at: string;
}

// City metrics
interface CityMetrics {
  city_id: string;
  signup_count: number;
  last_signup_at: string | null;
}

// Event information
interface Event {
  id: string;
  city_id: string | null;
  event_name: string;
  event_date: string | null;
  evey_event_url: string | null;
  qr_code_url: string | null;
  created_at: string;
  tickets_sold: number | null;
  prepurchase_enabled_at: string | null;
  shopify_product_id: string | null;
  shopify_variant_id: string | null;
  evey_event_id: string | null;
  tickets_paused: boolean;
}

// Ticket sales record
interface TicketSale {
  id: string;
  city_id: string | null;
  order_id: string;
  customer_email: string | null;
  quantity: number;
  purchased_at: string;
}

// Leaderboard entry (view)
interface CityLeaderboard {
  city_id: string;
  city_name: string;
  city_state: string | null;
  city_threshold: number;
  signup_count: number;
  progress_ratio: number | null;
  evey_event_url: string | null;
  prepurchase_enabled_at: string | null;
  tickets_sold: number | null;
  tickets_paused: boolean;
  tickets_available: boolean;
}

// Form submission data
interface FormData {
  name: string;
  email: string;
  zip: string;
}

// API error response
interface ApiError {
  error: string;
  details?: string;
  code?: string;
}
```

## Error Handling

### Error Types

The application uses a structured error handling approach:

#### Client-Side Validation Errors

- **Type**: `ValidationError`
- **Format**: `{ message: string, field?: string }`
- **Examples**:
  - `"Please enter your name"`
  - `"Invalid email format"`
  - `"ZIP code must be 5 digits"`

#### Network Errors

- **Type**: `NetworkError`
- **Format**: `{ message: string, status?: number }`
- **Examples**:
  - `"Request timed out"`
  - `"Failed to connect to server"`

#### Server Errors

- **Type**: `ServerError`
- **Format**: `{ error: string, details?: string, code?: string }`
- **Examples**:
  - `"ZIP code not found"`
  - `"Database connection failed"`

### Error Parsing

The `parseError` utility function standardizes error messages:

```javascript
import { parseError } from "./utils/errorParser";

try {
  await someAsyncOperation();
} catch (error) {
  const userMessage = await parseError(error);
  showToast(userMessage);
}
```

## Real-time Subscriptions

### Supabase Realtime Configuration

The application uses Supabase realtime subscriptions with the following configuration:

```javascript
// Rate limiting
realtime: {
  params: {
    eventsPerSecond: 2;
  }
}
```

### Subscription Channels

#### Submissions Channel

- **Channel**: `rt-submissions`
- **Table**: `submissions_public`
- **Events**: `INSERT`
- **Purpose**: Live updates when new fans sign up
- **Payload**: New submission with `id`, `city`, `lat`, `lon`, `created_at`

#### City Metrics Channel

- **Channel**: `rt-city-metrics`
- **Table**: `city_metrics`
- **Events**: `UPDATE`
- **Purpose**: Real-time signup count updates
- **Payload**: Updated metrics with `city_id`, `signup_count`, `last_signup_at`

#### Events Channel

- **Channel**: `rt-events`
- **Table**: `events`
- **Events**: `INSERT`, `UPDATE`
- **Purpose**: Event status, ticket sales, and URL updates
- **Payload**: Event data including `tickets_sold`, `tickets_paused`, `evey_event_url`

#### Cities Channel

- **Channel**: `rt-cities`
- **Table**: `cities`
- **Events**: `UPDATE`
- **Purpose**: City configuration changes (thresholds, etc.)
- **Payload**: City updates with `threshold`, `name`, `state`

#### Ticket Sales Channel

- **Channel**: `rt-ticket-sales`
- **Table**: `ticket_sales`
- **Events**: `INSERT`
- **Purpose**: Real-time ticket purchase notifications
- **Payload**: Sale data with `city_id`, `quantity`, `purchased_at`

### Subscription Management

```javascript
// Set up subscription
const channel = supabase
  .channel("my-channel")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "submissions_public",
    },
    (payload) => {
      console.log("Change received:", payload);
    }
  )
  .subscribe();

// Clean up subscription
supabase.removeChannel(channel);
```
