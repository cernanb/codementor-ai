# Code Review Checklist

This checklist helps ensure code quality and consistency across the codebase. Use this when reviewing pull requests or before submitting your own.

## General

- [ ] Code follows the project's coding style and conventions
- [ ] No console.log statements (use proper logging)
- [ ] No commented-out code
- [ ] No hardcoded values (use environment variables or constants)
- [ ] Code is self-documenting with clear variable/function names

## TypeScript

- [ ] All functions have proper type annotations
- [ ] No `any` types (use `unknown` if type is truly unknown)
- [ ] Types are imported from `@/types` when available
- [ ] Type assertions are avoided (use type guards instead)
- [ ] Generic types are used appropriately

## Error Handling

- [ ] All API routes have try-catch blocks
- [ ] Errors use custom error classes (`ValidationError`, `NotFoundError`, etc.)
- [ ] Error messages are user-friendly (no stack traces exposed)
- [ ] Errors are logged with context
- [ ] Error responses follow the standard format

## Security

- [ ] Authentication is checked before sensitive operations
- [ ] Input validation is performed (Zod schemas)
- [ ] SQL injection is prevented (using Supabase parameterized queries)
- [ ] No sensitive data in logs or error messages
- [ ] Rate limiting is applied to API routes
- [ ] Environment variables are used (not hardcoded secrets)

## Testing

- [ ] Unit tests are included for new utilities/functions
- [ ] Integration tests are included for new API routes
- [ ] Tests cover edge cases and error scenarios
- [ ] Test names are descriptive
- [ ] Tests are passing locally

## Performance

- [ ] Database queries are optimized (no N+1 queries)
- [ ] Unnecessary re-renders are avoided
- [ ] Large dependencies are dynamically imported
- [ ] Images are optimized (if applicable)
- [ ] No blocking operations in render functions

## API Design

- [ ] Request/response formats are consistent
- [ ] HTTP status codes are appropriate
- [ ] Rate limiting headers are included
- [ ] Error responses follow standard format
- [ ] API routes are documented (if new)

## Database

- [ ] Migrations are included for schema changes
- [ ] RLS policies are updated if needed
- [ ] Indexes are added for frequently queried columns
- [ ] No raw SQL queries (use Supabase client)
- [ ] Foreign key constraints are respected

## React/Next.js

- [ ] Server Components are used when possible
- [ ] Client Components are marked with `"use client"`
- [ ] Props are properly typed
- [ ] No prop drilling (use context if needed)
- [ ] Components are properly memoized if needed
- [ ] Loading and error states are handled

## Accessibility

- [ ] Semantic HTML is used
- [ ] ARIA labels are included where needed
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG standards

## Documentation

- [ ] README is updated if setup changed
- [ ] Architecture docs are updated for significant changes
- [ ] Complex logic has inline comments
- [ ] Function JSDoc comments for public APIs

## Git

- [ ] Commit messages follow conventional commits
- [ ] Branch name is descriptive
- [ ] PR description explains what and why
- [ ] No merge conflicts
- [ ] PR is up to date with base branch

## Code Review Process

1. **Automated Checks**: Ensure CI passes (tests, linting, type checking)
2. **Review Checklist**: Go through this checklist
3. **Provide Feedback**: Be constructive and specific
4. **Approve**: Only approve when all items are addressed
5. **Merge**: Squash commits when merging

## Common Issues to Watch For

### ❌ Bad
```typescript
// No error handling
export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json({ result: process(data) });
}

// No validation
const { challengeId } = await request.json();

// Exposing internal errors
catch (error) {
  return NextResponse.json({ error: error.stack });
}
```

### ✅ Good
```typescript
// Proper error handling
export async function POST(req: Request) {
  try {
    const data = await validateRequest(req, schema);
    const result = await process(data);
    return NextResponse.json({ result });
  } catch (error) {
    logError(error);
    const response = formatErrorResponse(error);
    return NextResponse.json(response, { status: response.statusCode });
  }
}

// Validation
const { challengeId } = await validateRequest(request, schemas.submitCode);

// User-friendly errors
catch (error) {
  logError(error, { context });
  return NextResponse.json(
    formatErrorResponse(error),
    { status: formatErrorResponse(error).statusCode }
  );
}
```

## Questions to Ask

- Does this code follow existing patterns?
- Is this the simplest solution?
- Are there edge cases not handled?
- Is this secure?
- Is this performant?
- Is this testable?
- Is this maintainable?
