# Creator Camp Map - Documentation Index

Welcome to the Creator Camp Map documentation! This index provides quick access to all available documentation for developers, contributors, and users.

## 📖 Documentation Overview

This documentation is organized into several key areas to help you understand, develop, and deploy the Creator Camp Map application.

## 🚀 Quick Start

- **For Users**: See the main [README.md](../README.md) for setup and usage instructions
- **For Developers**: Start with the [Development Guide](DEVELOPMENT.md)
- **For Deployment**: Check the [Deployment Guide](DEPLOYMENT.md)

## 📚 Documentation Sections

### 1. [Main README](../README.md)

**Who it's for**: Everyone  
**What it covers**: Project overview, features, quick setup, and basic usage

Key sections:

- Project overview and features
- Tech stack and architecture
- Installation and setup
- Available scripts
- Testing instructions

### 2. [API Documentation](API.md)

**Who it's for**: Developers integrating with the API  
**What it covers**: Complete API reference, data structures, and service interfaces

Key sections:

- Database schema and tables
- Edge Functions (submit_signup)
- Service layer API (SubmissionsService, CityService)
- Data types and interfaces
- Error handling patterns
- Real-time subscriptions

### 3. [Database Schema Reference](DATABASE_SCHEMA.md)

**Who it's for**: Database administrators and backend developers  
**What it covers**: Complete database structure with actual table definitions

Key sections:

- Full table definitions with SQL
- View definitions and purposes
- Indexes and performance considerations
- Row Level Security (RLS) policies
- Real-time subscription setup
- Data flow and migration guides

### 4. [Component Documentation](COMPONENTS.md)

**Who it's for**: Frontend developers and contributors  
**What it covers**: React component architecture, props, and usage patterns

Key sections:

- Component architecture overview
- Core components (FanDemandGlobe, GlobeMap, Leaderboard, SignupForm)
- UI components (Header, Footer, RetroLoader, RetroToast)
- Component props and interfaces
- State management patterns
- Performance considerations

### 5. [Development Guide](DEVELOPMENT.md)

**Who it's for**: Developers contributing to the project  
**What it covers**: Complete development workflow, coding standards, and best practices

Key sections:

- Local development setup
- Git workflow and conventions
- Code standards and ESLint rules
- Testing strategy and patterns
- Database development
- Performance guidelines
- Debugging techniques

### 6. [Deployment Guide](DEPLOYMENT.md)

**Who it's for**: DevOps engineers and deployment managers  
**What it covers**: Production deployment, monitoring, and troubleshooting

Key sections:

- Environment configuration
- Build process and optimization
- Vercel deployment (primary platform)
- Alternative deployment platforms
- Database setup and migrations
- Edge Functions deployment
- Monitoring and analytics
- Troubleshooting common issues

### 7. [Database Schema Reference](DATABASE_SCHEMA.md)

**Who it's for**: Developers and database administrators  
**What it covers**: Complete database structure reference

Key sections:

- Table definitions and relationships
- Column types and constraints
- Database views and computed fields
- Row Level Security (RLS) policies
- Indexes and performance optimizations
- Sample queries and usage patterns

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
├─────────────────────────────────────────────────────────────┤
│  Components  │  Hooks  │  Context  │  Services  │  Utils   │
│ ─────────────┼─────────┼───────────┼────────────┼──────────│
│ FanDemandGlobe│ useLeaderboard │ ToastContext │ Supabase │ helpers │
│ GlobeMap     │ useLiveSubmissions │           │ Submissions │ errorParser │
│ Leaderboard  │ useSubmitSignup │              │ CityService │ zipLookup │
│ SignupForm   │                │              │           │ csv      │
│ RetroComponents │              │              │           │          │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Supabase Backend                           │
├─────────────────────────────────────────────────────────────┤
│  Database (PostgreSQL)  │  Edge Functions  │  Realtime     │
│ ─────────────────────────┼──────────────────┼───────────────│
│ • submissions           │ • submit_signup   │ • Live updates │
│ • cities                │                  │ • Subscriptions │
│ • city_metrics          │                  │ • Rate limiting │
│ • events                │                  │               │
│ • city_leaderboard (view) │                │               │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Common Tasks

### Setting Up Development Environment

1. Clone repository
2. Install dependencies: `npm install`
3. Configure environment variables (see [Development Guide](DEVELOPMENT.md))
4. Start development server: `npm start`

### Running Tests

```bash
npm test              # Watch mode
npm run test:coverage # With coverage
npm run test:ci       # CI mode
```

### Building for Production

```bash
npm run build         # Standard build
npm run build:analyze # With bundle analysis
```

### Database Operations

```bash
supabase start        # Start local instance
supabase db reset     # Reset database
supabase db push      # Push migrations
```

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Working**

   - Ensure variables start with `REACT_APP_`
   - Restart development server after changes
   - Check [Deployment Guide](DEPLOYMENT.md#environment-configuration)

2. **Database Connection Issues**

   - Verify Supabase URL and keys
   - Check RLS policies are configured
   - See [API Documentation](API.md#database-schema)

3. **Build Failures**

   - Clear node_modules and reinstall
   - Check for TypeScript errors
   - Review [Development Guide](DEVELOPMENT.md#troubleshooting)

4. **Real-time Not Working**
   - Verify subscription setup
   - Check rate limiting configuration
   - See [API Documentation](API.md#real-time-subscriptions)

## 📋 Checklists

### Before Committing

- [ ] Tests pass (`npm test`)
- [ ] Code linted (`npm run lint`)
- [ ] No console errors
- [ ] Documentation updated if needed

### Before Deploying

- [ ] All tests pass in CI
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Edge functions deployed
- [ ] Monitoring configured

### When Reporting Issues

- [ ] Steps to reproduce
- [ ] Expected vs actual behavior
- [ ] Browser/environment details
- [ ] Console errors/logs
- [ ] Network request failures

## 🔗 External Resources

### Dependencies Documentation

- [React](https://reactjs.org/docs/) - Frontend framework
- [Supabase](https://supabase.com/docs) - Backend-as-a-Service
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling framework
- [react-simple-maps](https://www.react-simple-maps.io/) - Map visualization
- [Jest](https://jestjs.io/docs/) - Testing framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Component testing

### Tools and Services

- [Vercel](https://vercel.com/docs) - Deployment platform
- [Netlify](https://docs.netlify.com/) - Alternative deployment
- [Sentry](https://docs.sentry.io/) - Error monitoring
- [GitHub Actions](https://docs.github.com/en/actions) - CI/CD

## 🤝 Contributing

We welcome contributions! Please see the [Development Guide](DEVELOPMENT.md#contributing) for:

- Code standards and style guide
- Pull request process
- Testing requirements
- Release process

## 📞 Support

### Getting Help

1. Check this documentation first
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Join our Discord community (link in main README)

### Reporting Bugs

Use the GitHub issue template and include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, OS, etc.)
- Screenshots if applicable

### Feature Requests

We love new ideas! When submitting feature requests:

- Describe the use case and problem being solved
- Provide mockups or examples if possible
- Consider implementation complexity
- Be open to feedback and iteration

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

---

**Need to add something to the docs?** Create an issue or submit a pull request!

**Found an error?** Please let us know by creating an issue.
