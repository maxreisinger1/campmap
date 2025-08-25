# Creator Camp Map - Database Schema Reference

This document provides the complete database schema for the Creator Camp Map application based on the actual production database structure.

## Tables Overview

| Table          | Purpose                   | Records                             |
| -------------- | ------------------------- | ----------------------------------- |
| `submissions`  | Fan signup data (private) | Personal information, location data |
| `cities`       | City configuration        | Event locations and thresholds      |
| `city_metrics` | Real-time statistics      | Signup counts and last activity     |
| `events`       | Event management          | Ticket sales, dates, URLs           |
| `ticket_sales` | Sales records             | Individual ticket purchases         |

## Views Overview

| View                 | Purpose                   | Data Source                          |
| -------------------- | ------------------------- | ------------------------------------ |
| `submissions_public` | Public submission data    | `submissions` (PII removed)          |
| `city_leaderboard`   | Combined leaderboard data | `cities` + `city_metrics` + `events` |

---

## Table Definitions

### `submissions`

**Purpose**: Main table for storing fan signups with full personal information.  
**Access**: Private (RLS policies control access)

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  email CITEXT NOT NULL,
  email_normalized TEXT,
  zip TEXT,
  state TEXT,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  city TEXT NOT NULL,
  city_id UUID,
  ip_hash TEXT
);
```

**Key Features**:

- `email` uses CITEXT for case-insensitive storage
- `email_normalized` for deduplication logic
- Geographic coordinates (`lat`, `lon`) for mapping
- `ip_hash` for fraud prevention
- `city` is required even if `city_id` is null

### `cities`

**Purpose**: Configuration table for event cities and their requirements.

```sql
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT,
  threshold INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Key Features**:

- `threshold` defines minimum signups needed for an event
- `state` is optional for international cities
- Simple structure focused on event requirements

### `city_metrics`

**Purpose**: Real-time aggregated statistics for each city.

```sql
CREATE TABLE city_metrics (
  city_id UUID PRIMARY KEY,
  signup_count BIGINT NOT NULL,
  last_signup_at TIMESTAMPTZ
);
```

**Key Features**:

- `city_id` is primary key (one record per city)
- `signup_count` uses BIGINT for scalability
- `last_signup_at` tracks activity recency
- Updated automatically via triggers or functions

### `events`

**Purpose**: Event management with ticket sales integration.

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID,
  event_name TEXT NOT NULL,
  event_date TIMESTAMPTZ,
  evey_event_url TEXT,
  qr_code_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tickets_sold INTEGER,
  prepurchase_enabled_at TIMESTAMPTZ,
  shopify_product_id TEXT,
  shopify_variant_id TEXT,
  evey_event_id TEXT,
  tickets_paused BOOLEAN NOT NULL DEFAULT FALSE
);
```

**Key Features**:

- Multiple integration points (Evey, Shopify)
- `tickets_paused` for sales control
- `prepurchase_enabled_at` for timeline tracking
- QR codes for event access

### `ticket_sales`

**Purpose**: Individual ticket purchase records for analytics.

```sql
CREATE TABLE ticket_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID,
  order_id TEXT NOT NULL,
  customer_email TEXT,
  quantity INTEGER NOT NULL,
  purchased_at TIMESTAMPTZ NOT NULL
);
```

**Key Features**:

- Links to external order systems via `order_id`
- `quantity` supports multi-ticket purchases
- `customer_email` for customer analysis

---

## View Definitions

### `submissions_public`

**Purpose**: Public view of submissions with PII removed for frontend consumption.

```sql
CREATE VIEW submissions_public AS
SELECT
  id,
  city,
  lat,
  lon,
  created_at
FROM submissions;
```

**Usage**:

- Globe visualization (lat/lon coordinates)
- Activity timeline (created_at)
- City-based aggregations
- No personal information exposed

### `city_leaderboard`

**Purpose**: Comprehensive view combining all city-related data for leaderboards.

```sql
CREATE VIEW city_leaderboard AS
SELECT
  c.id AS city_id,
  c.name AS city_name,
  c.state AS city_state,
  c.threshold AS city_threshold,
  cm.signup_count,
  CASE
    WHEN c.threshold > 0 THEN cm.signup_count::numeric / c.threshold::numeric
    ELSE NULL::numeric
  END AS progress_ratio,
  e.evey_event_url,
  e.prepurchase_enabled_at,
  e.tickets_sold,
  e.tickets_paused,
  e.tickets_sold < c.threshold AND NOT e.tickets_paused AS tickets_available
FROM cities c
LEFT JOIN city_metrics cm ON cm.city_id = c.id
LEFT JOIN events e ON e.city_id = c.id;
```

**Key Computed Fields**:

- `progress_ratio`: Signup progress (0.0 to 1.0+)
- `tickets_available`: Boolean indicating if tickets can be purchased

---

## Indexes and Performance

### Recommended Indexes

```sql
-- Performance indexes for common queries
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX idx_submissions_city_id ON submissions(city_id);
CREATE INDEX idx_submissions_city ON submissions(city);
CREATE INDEX idx_events_city_id ON events(city_id);
CREATE INDEX idx_ticket_sales_city_id ON ticket_sales(city_id);
CREATE INDEX idx_ticket_sales_purchased_at ON ticket_sales(purchased_at DESC);

-- Unique constraints
CREATE UNIQUE INDEX idx_city_metrics_city_id ON city_metrics(city_id);
```

### Query Patterns

**Common Queries**:

1. Recent submissions: `ORDER BY created_at DESC`
2. City aggregations: `GROUP BY city_id`
3. Leaderboard ranking: `ORDER BY progress_ratio DESC`
4. Ticket availability: `WHERE tickets_available = true`

---

## Row Level Security (RLS)

### Security Policies

```sql
-- Enable RLS on sensitive tables
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_sales ENABLE ROW LEVEL SECURITY;

-- Public read access to views
CREATE POLICY "Public read access" ON submissions_public FOR SELECT USING (true);
CREATE POLICY "Public read access" ON city_leaderboard FOR SELECT USING (true);

-- Restricted access to main tables (service role only)
CREATE POLICY "Service role access" ON submissions FOR ALL USING (auth.role() = 'service_role');
```

---

## Real-time Subscriptions

### Enabled Tables

```sql
-- Enable real-time for public tables/views
ALTER PUBLICATION supabase_realtime ADD TABLE submissions_public;
ALTER PUBLICATION supabase_realtime ADD TABLE city_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE cities;
```

### Subscription Patterns

**Frontend Subscriptions**:

- `submissions_public`: New signup notifications
- `city_metrics`: Live count updates
- `events`: Ticket sales status changes
- `cities`: Configuration updates

---

## Data Flow

### Signup Process

1. User submits form → Edge Function
2. Edge Function validates & geocodes → `submissions` table
3. Trigger updates → `city_metrics` table
4. Real-time notification → Frontend via `submissions_public`
5. Leaderboard updates → Frontend via `city_leaderboard`

### Event Management

1. Admin creates event → `events` table
2. Ticket sales open → `prepurchase_enabled_at` updated
3. Tickets purchased → `ticket_sales` records + `tickets_sold` increment
4. Real-time updates → Frontend leaderboard

---

## Migration Considerations

### Adding New Columns

```sql
-- Always add nullable columns for backwards compatibility
ALTER TABLE submissions ADD COLUMN new_field TEXT;

-- Update views if needed
CREATE OR REPLACE VIEW submissions_public AS
SELECT id, city, lat, lon, created_at, new_field
FROM submissions;
```

### Data Types

- Use `CITEXT` for case-insensitive text
- Use `BIGINT` for counters that may grow large
- Use `TIMESTAMPTZ` for all timestamps
- Use `UUID` for all primary keys

### Best Practices

- Always use transactions for multi-table updates
- Add indexes before deploying to production
- Test RLS policies thoroughly
- Monitor real-time subscription performance
