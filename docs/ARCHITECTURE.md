# Architecture Guide

This document outlines the architecture, design patterns, and best practices used in CodeMentor AI. It serves as a guide for developers, especially those new to the codebase.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Patterns](#architecture-patterns)
- [Directory Structure](#directory-structure)
- [Key Design Decisions](#key-design-decisions)
- [Data Flow](#data-flow)
- [Security](#security)
- [Performance Considerations](#performance-considerations)

## System Overview

CodeMentor AI is a full-stack web application built with Next.js 16 (App Router) that provides an adaptive learning platform for coding challenges.

### Technology Stack

- **Frontend Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **AI/ML**: OpenAI GPT-4
- **Code Execution**: Piston API
- **Deployment**: Vercel (Frontend), Supabase (Database)

### High-Level Architecture

```
┌─────────────────┐
│   Next.js App   │
│  (App Router)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │        │
┌───▼───┐ ┌──▼────┐
│Supabase│ │OpenAI│
│(Auth+DB)│ │ API  │
└────────┘ └──────┘
    │
┌───▼────┐
│ Piston │
│  API   │
└────────┘
```

## Architecture Patterns

### 1. Server Components First

We leverage Next.js Server Components for data fetching and initial rendering. This reduces client-side JavaScript and improves performance.

**Example:**
```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: challenges } = await supabase
    .from("challenges")
    .select("*");
  
  return <ChallengeList challenges={challenges} />;
}
```

**When to use Server Components:**
- Initial data fetching
- Accessing backend resources (databases, APIs)
- Keeping sensitive information on the server

**When to use Client Components:**
- Interactive UI (buttons, forms, animations)
- Browser-only APIs (localStorage, window)
- State management with hooks

### 2. API Route Pattern

API routes follow a consistent pattern:

1. **Authentication Check**
2. **Request Validation**
3. **Rate Limiting**
4. **Business Logic**
5. **Error Handling**
6. **Response Formatting**

**Example:**
```typescript
export async function POST(request: NextRequest) {
  return withRateLimit(request, config, async (req) => {
    try {
      // 1. Authenticate
      const user = await authenticate(req);
      
      // 2. Validate
      const data = await validateRequest(req, schema);
      
      // 3. Business logic
      const result = await processRequest(data);
      
      // 4. Return response
      return NextResponse.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
```

### 3. Error Handling Strategy

We use a centralized error handling system:

- **Custom Error Classes**: Domain-specific errors (`ValidationError`, `NotFoundError`)
- **Error Formatting**: Consistent API error responses
- **Error Logging**: Structured logging with context
- **User-Friendly Messages**: Never expose internal errors to clients

**Error Flow:**
```
Error Thrown → Logged → Formatted → Returned to Client
```

### 4. Type Safety

TypeScript types are generated from the database schema, ensuring end-to-end type safety:

```typescript
// types/index.ts - Generated from Supabase schema
export interface Challenge {
  id: string;
  title: string;
  // ... other fields
}

// Usage in components
const challenge: Challenge = await getChallenge(id);
```

## Directory Structure

```
codementor-ai/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── hint/         # AI hint generation endpoint
│   │   └── submit/       # Code submission endpoint
│   ├── challenge/        # Challenge pages
│   ├── dashboard/        # Dashboard page
│   └── layout.tsx         # Root layout
│
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   ├── CodeEditor.tsx    # Monaco editor wrapper
│   └── TestResults.tsx   # Test execution display
│
├── lib/                  # Utility libraries
│   ├── errors.ts         # Error handling utilities
│   ├── middleware/       # Middleware functions
│   │   ├── rate-limit.ts
│   │   └── validation.ts
│   ├── openai.ts         # OpenAI integration
│   ├── piston.ts         # Code execution
│   └── supabase/         # Supabase client utilities
│
├── types/                # TypeScript type definitions
│   └── index.ts          # Database types
│
├── __tests__/            # Test files
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── e2e/             # End-to-end tests
│
└── supabase/             # Database configuration
    ├── migrations/       # SQL migration files
    └── config.toml       # Supabase config
```

## Key Design Decisions

### 1. Why Next.js App Router?

- **Server Components**: Better performance and SEO
- **Streaming**: Improved perceived performance
- **Built-in Routing**: File-based routing is intuitive
- **API Routes**: Unified framework for full-stack development

### 2. Why Supabase?

- **PostgreSQL**: Robust relational database
- **Row Level Security**: Built-in security policies
- **Real-time**: Optional real-time subscriptions
- **Auth**: Integrated authentication
- **Type Generation**: Automatic TypeScript types

### 3. Why Centralized Error Handling?

- **Consistency**: Uniform error responses
- **Security**: Prevents information leakage
- **Debugging**: Structured error logging
- **Maintainability**: Single source of truth

### 4. Why Rate Limiting?

- **Cost Control**: Prevents API abuse
- **Fair Usage**: Ensures resources for all users
- **Security**: Mitigates DDoS attacks
- **Production Ready**: Essential for production apps

## Data Flow

### Challenge Submission Flow

```
User submits code
    ↓
Client Component (CodeEditor)
    ↓
POST /api/submit
    ↓
Rate Limiting Check
    ↓
Authentication Check
    ↓
Request Validation
    ↓
Fetch Challenge from DB
    ↓
Execute Code via Piston API
    ↓
Compare Results with Test Cases
    ↓
Save Attempt to Database
    ↓
Update User Progress
    ↓
Return Results to Client
```

### AI Hint Generation Flow

```
User requests hint
    ↓
POST /api/hint
    ↓
Rate Limiting (stricter limits)
    ↓
Fetch Challenge & Previous Hints
    ↓
Generate Hint via OpenAI
    ↓
Save Hint to Database
    ↓
Update Hint Count
    ↓
Return Hint to Client
```

## Security

### Authentication & Authorization

- **Supabase Auth**: Handles user authentication
- **Row Level Security (RLS)**: Database-level access control
- **Server-Side Validation**: All sensitive operations validated server-side

### Input Validation

- **Zod Schemas**: Runtime type validation
- **Sanitization**: Input sanitization before processing
- **SQL Injection Prevention**: Parameterized queries via Supabase

### API Security

- **Rate Limiting**: Prevents abuse
- **Error Handling**: No sensitive information in error messages
- **CORS**: Configured for production domains only

## Performance Considerations

### Database Optimization

- **Indexes**: Strategic indexes on frequently queried columns
- **Query Optimization**: Efficient queries with proper joins
- **Connection Pooling**: Managed by Supabase

### Caching Strategy

- **Static Generation**: Challenge pages can be statically generated
- **ISR (Incremental Static Regeneration)**: For frequently updated content
- **Client-Side Caching**: React Query for client-side data caching (future)

### Code Splitting

- **Automatic**: Next.js automatically code-splits by route
- **Dynamic Imports**: Heavy components loaded on demand
- **Monaco Editor**: Loaded only when needed

## Best Practices

### For New Developers

1. **Start with Server Components**: Default to server components unless you need interactivity
2. **Use TypeScript Strictly**: Leverage type safety
3. **Follow Error Handling Pattern**: Use custom error classes
4. **Write Tests**: Add tests for new features
5. **Document Decisions**: Update this guide when making architectural changes

### Code Review Checklist

- [ ] TypeScript types are correct
- [ ] Error handling is implemented
- [ ] Input validation is present
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No sensitive data in logs/errors
- [ ] Performance considerations addressed

## Future Improvements

- [ ] Add Redis for rate limiting (currently in-memory)
- [ ] Implement caching layer (React Query)
- [ ] Add real-time features (Supabase Realtime)
- [ ] Implement analytics dashboard
- [ ] Add E2E tests with Playwright
- [ ] Set up monitoring (Sentry, Vercel Analytics)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
