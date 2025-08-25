# Creator Camp Map - Deployment Guide

This guide covers the deployment process for the Creator Camp Map application, with a focus on **Vercel deployment** as the primary platform.

## Table of Contents

- [Quick Start (Vercel)](#quick-start-vercel)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Build Process](#build-process)
- [Vercel Deployment (Primary)](#vercel-deployment-primary)
- [Alternative Platforms](#alternative-platforms)
- [Database Setup](#database-setup)
- [Edge Functions](#edge-functions)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

## Quick Start (Vercel)

The fastest way to deploy Creator Camp Map to production:

1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Connect to Vercel**: Import your project at [vercel.com/new](https://vercel.com/new)
3. **Set Environment Variables**: Add your Supabase credentials in Vercel dashboard
4. **Deploy**: Vercel will automatically build and deploy your app

Detailed instructions below ⬇️

## Prerequisites

### Development Requirements

- Node.js 16+
- npm or yarn
- Git
- Supabase CLI (for database management)

### Production Requirements

- **Vercel Account**: Free tier available at [vercel.com](https://vercel.com)
- **GitHub Repository**: Code must be in a Git repository
- **Supabase Project**: Production instance with configured database
- **Domain** (optional): Custom domain for branding
- **Monitoring Service** (optional): Sentry, LogRocket, etc.

## Environment Configuration

### Environment Variables

Create production environment variables:

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-production-anon-key

# Optional: Analytics
REACT_APP_GA_TRACKING_ID=your-google-analytics-id
REACT_APP_SENTRY_DSN=your-sentry-dsn

# Build Configuration
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false
```

### Supabase Environment Setup

1. **Create Production Project**:

   ```bash
   # Via Supabase Dashboard
   https://supabase.com/dashboard/new
   ```

2. **Configure Environment Variables**:

   ```bash
   # In your deployment platform (Vercel, Netlify, etc.)
   REACT_APP_SUPABASE_URL=your-production-url
   REACT_APP_SUPABASE_ANON_KEY=your-production-key
   ```

3. **Database Migration**:
   ```bash
   supabase login
   supabase link --project-ref your-project-id
   supabase db push
   ```

## Build Process

### Local Build

```bash
# Install dependencies
npm install

# Run tests
npm run test:ci

# Create production build
npm run build

# Verify build
npm install -g serve
serve -s build -l 3000
```

### Build Optimization

The build process includes:

- **Code Splitting**: Automatic via React.lazy()
- **Tree Shaking**: Removes unused code
- **Asset Optimization**: Image compression and SVG optimization
- **Bundle Analysis**: Use `npm run analyze` to inspect bundle size

### Build Configuration

In `package.json`:

```json
{
  "scripts": {
    "build": "react-scripts build",
    "build:analyze": "npm run build && npx bundle-analyzer build/static/js/*.js",
    "build:ci": "CI=true npm run build"
  }
}
```

## Vercel Deployment (Primary)

Vercel is the recommended deployment platform for Creator Camp Map due to its seamless React support, automatic builds, and excellent performance.

### Method 1: Dashboard Deployment (Recommended)

1. **Prepare Repository**:

   ```bash
   # Ensure your code is committed and pushed to GitHub
   git add .
   git commit -m "feat: prepare for production deployment"
   git push origin main
   ```

2. **Import Project to Vercel**:

   - Visit [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your `campmap` repository
   - Vercel will auto-detect it's a React app

3. **Configure Build Settings** (Auto-detected):

   - **Framework Preset**: Create React App
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `build` (default)
   - **Install Command**: `npm install` (default)

4. **Set Environment Variables**:
   In the Vercel dashboard, add:

   ```
   REACT_APP_SUPABASE_URL = https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY = your-production-anon-key
   GENERATE_SOURCEMAP = false
   ```

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - You'll get a live URL instantly

### Method 2: CLI Deployment

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login and Deploy**:

   ```bash
   # Login to Vercel
   vercel login

   # Deploy (first time - will prompt for configuration)
   vercel

   # Deploy to production
   vercel --prod
   ```

3. **Configure Project** (if prompted):
   ```
   ? Set up and deploy "campmap"? [Y/n] y
   ? Which scope do you want to deploy to? (your-username)
   ? Link to existing project? [y/N] n
   ? What's your project's name? campmap
   ? In which directory is your code located? ./
   ```

### Environment Variables in Vercel

Set these in your Vercel dashboard (Settings → Environment Variables):

```bash
# Required
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-production-anon-key

# Build Optimization
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false

# Optional: Analytics
REACT_APP_GA_TRACKING_ID=your-google-analytics-id
REACT_APP_SENTRY_DSN=your-sentry-dsn

# Performance
DISABLE_ESLINT_PLUGIN=true
```

### Automatic Deployments

Vercel automatically deploys when you push to your repository:

- **Production**: Deploys from `main` branch
- **Preview**: Deploys from feature branches and PRs
- **Rollback**: Easy one-click rollbacks in dashboard

### Custom Domain Setup

1. **Add Domain in Vercel Dashboard**:

   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **DNS Configuration**:
   ```
   Type: CNAME
   Name: @ (or subdomain)
   Value: cname.vercel-dns.com
   ```

### Performance Optimizations for Vercel

1. **Speed Insights**:
   Enable in Vercel dashboard for Core Web Vitals monitoring

## Alternative Platforms

### Netlify

1. **Deploy via Git**:

   - Connect your GitHub repository in Netlify dashboard
   - Set build command: `npm run build`
   - Set publish directory: `build`

2. **Configuration** (`netlify.toml`):

   ```toml
   [build]
     publish = "build"
     command = "npm run build"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200

   [build.environment]
     REACT_APP_SUPABASE_URL = "your-production-url"
     REACT_APP_SUPABASE_ANON_KEY = "your-production-key"
   ```

### AWS S3 + CloudFront

1. **Build and Upload**:

   ```bash
   # Build
   npm run build

   # Upload to S3
   aws s3 sync build/ s3://your-bucket-name --delete

   # Invalidate CloudFront cache
   aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
   ```

2. **S3 Bucket Configuration**:

   - Enable static website hosting
   - Set index document: `index.html`
   - Set error document: `index.html`

3. **CloudFront Distribution**:
   - Origin: Your S3 bucket
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Compress Objects Automatically: Yes

### Docker Deployment

1. **Dockerfile**:

   ```dockerfile
   # Build stage
   FROM node:16-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build

   # Serve stage
   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **nginx.conf**:

   ```nginx
   events {
     worker_connections 1024;
   }

   http {
     include /etc/nginx/mime.types;
     default_type application/octet-stream;

     server {
       listen 80;
       server_name localhost;
       root /usr/share/nginx/html;
       index index.html;

       location / {
         try_files $uri $uri/ /index.html;
       }

       location /static/ {
         expires 1y;
         add_header Cache-Control "public, immutable";
       }
     }
   }
   ```

3. **Build and Deploy**:

   ```bash
   # Build image
   docker build -t creator-camp-map .

   # Run container
   docker run -p 80:80 creator-camp-map
   ```

## Database Setup

### Production Database Configuration

1. **Row Level Security (RLS)**:

   ```sql
   -- Enable RLS on all tables
   ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
   ALTER TABLE city_metrics ENABLE ROW LEVEL SECURITY;
   ALTER TABLE events ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Public read access" ON submissions_public
     FOR SELECT USING (true);

   CREATE POLICY "Public read access" ON city_leaderboard
     FOR SELECT USING (true);
   ```

2. **Database Indexes**:

   ```sql
   -- Performance indexes
   CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
   CREATE INDEX idx_submissions_city_id ON submissions(city_id);
   CREATE INDEX idx_city_metrics_city_id ON city_metrics(city_id);
   ```

3. **Realtime Configuration**:
   ```sql
   -- Enable realtime for specific tables
   ALTER PUBLICATION supabase_realtime ADD TABLE submissions_public;
   ALTER PUBLICATION supabase_realtime ADD TABLE city_metrics;
   ALTER PUBLICATION supabase_realtime ADD TABLE events;
   ```

### Data Migration

```bash
# Export data from development
supabase db dump --data-only > data.sql

# Import to production
supabase db reset --linked
psql -h your-prod-host -U postgres -d postgres < data.sql
```

## Edge Functions

### Deploy Edge Functions

1. **Function Structure**:

   ```
   supabase/functions/
   ├── submit_signup/
   │   ├── index.ts
   │   └── cors.ts
   └── _shared/
       └── database.ts
   ```

2. **Deploy Commands**:

   ```bash
   # Deploy all functions
   supabase functions deploy

   # Deploy specific function
   supabase functions deploy submit_signup

   # Set environment variables
   supabase secrets set ZIPCODE_API_KEY=your-api-key
   ```

3. **Function Configuration**:

   ```typescript
   // supabase/functions/submit_signup/index.ts
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
   import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

   const corsHeaders = {
     "Access-Control-Allow-Origin": "*",
     "Access-Control-Allow-Headers":
       "authorization, x-client-info, apikey, content-type",
   };

   serve(async (req) => {
     // Handle CORS
     if (req.method === "OPTIONS") {
       return new Response("ok", { headers: corsHeaders });
     }

     try {
       const { name, email, zip } = await req.json();

       // Validate input
       if (!name || !email || !zip) {
         throw new Error("Missing required fields");
       }

       // Process submission
       const result = await processSubmission({ name, email, zip });

       return new Response(JSON.stringify(result), {
         headers: { ...corsHeaders, "Content-Type": "application/json" },
         status: 200,
       });
     } catch (error) {
       return new Response(JSON.stringify({ error: error.message }), {
         headers: { ...corsHeaders, "Content-Type": "application/json" },
         status: 400,
       });
     }
   });
   ```

## Monitoring & Analytics

### Error Monitoring (Sentry)

1. **Installation**:

   ```bash
   npm install @sentry/react @sentry/tracing
   ```

2. **Configuration**:

   ```javascript
   // src/sentry.js
   import * as Sentry from "@sentry/react";
   import { Integrations } from "@sentry/tracing";

   if (process.env.NODE_ENV === "production") {
     Sentry.init({
       dsn: process.env.REACT_APP_SENTRY_DSN,
       integrations: [new Integrations.BrowserTracing()],
       tracesSampleRate: 0.1,
       environment: process.env.NODE_ENV,
     });
   }
   ```

3. **Error Boundaries**:

   ```javascript
   import * as Sentry from "@sentry/react";

   const SentryErrorBoundary = Sentry.withErrorBoundary(App, {
     fallback: ({ error, resetError }) => (
       <div>
         <h2>Something went wrong</h2>
         <button onClick={resetError}>Try again</button>
       </div>
     ),
   });
   ```

### Performance Monitoring

1. **Web Vitals**:

   ```javascript
   // src/reportWebVitals.js
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

   function sendToAnalytics(metric) {
     if (window.gtag) {
       window.gtag("event", metric.name, {
         event_category: "Web Vitals",
         value: Math.round(metric.value),
         non_interaction: true,
       });
     }
   }

   getCLS(sendToAnalytics);
   getFID(sendToAnalytics);
   getFCP(sendToAnalytics);
   getLCP(sendToAnalytics);
   getTTFB(sendToAnalytics);
   ```

2. **Google Analytics**:

   ```javascript
   // src/analytics.js
   import ReactGA from "react-ga4";

   if (process.env.REACT_APP_GA_TRACKING_ID) {
     ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
   }

   export const trackEvent = (action, category, label) => {
     ReactGA.event({
       action,
       category,
       label,
     });
   };
   ```

### Health Checks

1. **API Health Check**:

   ```javascript
   // src/utils/healthCheck.js
   export const checkApiHealth = async () => {
     try {
       const response = await fetch(
         `${process.env.REACT_APP_SUPABASE_URL}/rest/v1/`,
         {
           headers: {
             apikey: process.env.REACT_APP_SUPABASE_ANON_KEY,
           },
         }
       );
       return response.ok;
     } catch (error) {
       return false;
     }
   };
   ```

2. **Database Connectivity**:
   ```javascript
   export const checkDatabaseHealth = async () => {
     try {
       const { data, error } = await supabase
         .from("cities")
         .select("count(*)")
         .limit(1);
       return !error;
     } catch (error) {
       return false;
     }
   };
   ```

## Troubleshooting

### Common Issues

#### Build Failures

**Issue**: "Module not found" errors

```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Memory errors during build

```bash
# Solution: Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### Deployment Issues

**Issue**: Environment variables not working

```bash
# Verify variables are set
echo $REACT_APP_SUPABASE_URL

# Check build output
grep -r "REACT_APP_" build/static/js/
```

**Issue**: CORS errors

```javascript
// Verify Supabase configuration
const { data } = await supabase.from("cities").select("*").limit(1);
```

#### Performance Issues

**Issue**: Slow initial load

```bash
# Analyze bundle size
npm run build:analyze

# Implement code splitting
const LazyComponent = lazy(() => import('./Component'));
```

**Issue**: Real-time connection failures

```javascript
// Add connection monitoring
supabase.realtime.onOpen(() => console.log("Connected"));
supabase.realtime.onClose(() => console.log("Disconnected"));
```

### Debug Mode

Enable debug logging in development:

```javascript
// src/config/debug.js
export const DEBUG = {
  API_CALLS: process.env.NODE_ENV === "development",
  REALTIME: process.env.NODE_ENV === "development",
  PERFORMANCE: process.env.NODE_ENV === "development",
};

// Usage
if (DEBUG.API_CALLS) {
  console.log("API call:", endpoint, payload);
}
```

### Rollback Strategy

1. **Database Rollback**:

   ```bash
   # Backup before migration
   supabase db dump > backup-$(date +%Y%m%d).sql

   # Rollback if needed
   supabase db reset
   psql -h host -U user -d db < backup-file.sql
   ```

2. **Application Rollback**:

   ```bash
   # Git rollback
   git revert HEAD
   git push origin main

   # Redeploy previous version
   vercel --prod
   ```

### Support Checklist

When reporting issues, include:

- [ ] Build logs
- [ ] Browser console errors
- [ ] Network tab screenshots
- [ ] Environment variables (redacted)
- [ ] Supabase project settings
- [ ] Steps to reproduce
- [ ] Expected vs actual behavior

For urgent production issues:

1. Check monitoring dashboards
2. Verify database connectivity
3. Check edge function logs
4. Review CDN status
5. Implement temporary fixes
6. Plan permanent resolution
