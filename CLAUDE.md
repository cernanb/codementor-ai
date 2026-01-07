# CLAUDE.md

This file provides context for AI assistants (like Claude) working on this codebase.

---

## Project Overview

**CodeMentor AI** is an adaptive coding challenge platform that guides learners with AI-powered hints without giving away solutions. Built as a portfolio piece to demonstrate full-stack competency for the Flatiron School Senior Software Engineer position.

### Core Value Proposition

AI analyzes failed code attempts and provides contextual hints that ask leading questions rather than providing solutions - mirroring how a mentor would teach.

---

## Tech Stack

| Layer              | Technology           | Version           | Why                                            |
| ------------------ | -------------------- | ----------------- | ---------------------------------------------- |
| **Framework**      | Next.js              | 16.1.1            | App Router, Turbopack, React Server Components |
| **Frontend**       | React                | 19.2.3            | Latest stable with improved form handling      |
| **Language**       | TypeScript           | ^5                | Type safety across entire stack                |
| **Styling**        | Tailwind CSS         | v4                | Using `@theme` instead of config file          |
| **Database**       | Supabase (Postgres)  | ^2.90.0           | Auth + Database + RLS in one                   |
| **Auth**           | Supabase Auth        | via @supabase/ssr | Server-side session management                 |
| **AI**             | OpenAI               | ^6.15.0           | GPT-4 for hint generation                      |
| **Code Editor**    | Monaco Editor        | ^4.7.0            | VSCode editor in browser                       |
| **Code Execution** | Judge0 or Piston API | -                 | Sandboxed code execution                       |
| **UI Components**  | Radix UI             | ^1.x              | Accessible primitives                          |
| **Animations**     | Framer Motion        | ^11.19.2          | Success celebrations, transitions              |
| **Notifications**  | Sonner               | ^2.0.7            | Toast notifications                            |
| **Testing**        | Vitest               | ^2.1.8            | Fast unit testing                              |

---

## Design Philosophy

### "Terminal Meets Classroom"

**Educational brutalism with warm accents**

The aesthetic combines:

- Dark terminal background (GitHub Dark inspired)
- High contrast for code readability
- Monospace-first typography
- Warm accent colors for semantic meaning
- Minimal but purposeful animations

### Design Principles

1. **Code-first layout** - Monaco editor is the hero
2. **High contrast** - Clear visual hierarchy
3. **Semantic color** - Green = pass, Red = fail, Yellow = hint
4. **Calm animations** - Subtle, not distracting
5. **Accessible** - WCAG AA compliant, keyboard navigation

---

## Color System

### Core Palette (CSS Variables)

```css
/* Base */
--color-background: #0d1117    /* Main background (GitHub dark) */
--color-surface: #161b22       /* Cards, panels */
--color-border: #30363d        /* Borders, dividers */

/* Text */
--color-text: #c9d1d9          /* Primary text */
--color-text-muted: #8b949e    /* Secondary text, labels */
--color-text-inverse: #0d1117  /* Text on colored backgrounds */

/* Semantic */
--color-primary: #58a6ff       /* Terminal blue - CTAs, links */
--color-primary-hover: #539bf5 /* Hover state */
--color-success: #3fb950       /* Test pass, completion */
--color-success-muted: #238636 /* Success backgrounds */
--color-error: #f85149         /* Test fail, errors */
--color-error-muted: #da3633   /* Error backgrounds */
--color-warning: #d29922       /* Hints, warnings */
--color-warning-muted: #9e6a03 /* Warning backgrounds */

/* Components */
--color-card: #161b22          /* Challenge cards */
--color-card-hover: #1c2128    /* Card hover state */
--color-input: #0d1117         /* Form inputs */
--color-input-border: #30363d  /* Input borders */
--color-code-bg: #0d1117       /* Code blocks */

/* Difficulty Badges */
--color-badge-easy: #238636    /* Green */
--color-badge-medium: #d29922  /* Yellow */
--color-badge-hard: #da3633    /* Red */
```

### Usage Guidelines

**DO:**

- Use semantic colors for their intended purpose (success = green, error = red)
- Use `--color-text-muted` for labels, timestamps, metadata
- Use `--color-border` consistently for all borders
- Use hover states on interactive elements

**DON'T:**

- Mix color usage (e.g., don't use error red for primary buttons)
- Use pure black (`#000000`) or pure white (`#ffffff`)
- Add custom colors without adding them to the system
- Use gradients except for the `.text-gradient` utility

---

## Typography

### Font Families

```css
--font-mono: "JetBrains Mono", monospace     /* Code, editor, monospace UI */
--font-display: "Space Mono", monospace      /* Headers, emphasis */
```

**System fonts** for body text (faster load, better performance)

### Font Usage

| Element             | Font           | Size            | Weight         |
| ------------------- | -------------- | --------------- | -------------- |
| **H1 (Hero)**       | Space Mono     | 3rem (48px)     | Bold (700)     |
| **H2 (Page Title)** | Space Mono     | 2rem (32px)     | Bold (700)     |
| **H3 (Section)**    | Space Mono     | 1.5rem (24px)   | Semibold (600) |
| **Body**            | System UI      | 1rem (16px)     | Normal (400)   |
| **Code**            | JetBrains Mono | 0.875rem (14px) | Normal (400)   |
| **Small**           | System UI      | 0.875rem (14px) | Normal (400)   |
| **Label**           | System UI      | 0.875rem (14px) | Medium (500)   |

### Typography Rules

**DO:**

- Use Space Mono for headers and emphasis only
- Use JetBrains Mono for all code (editor, inline code, test output)
- Keep line height comfortable (1.5-1.7 for body text)
- Use font weights sparingly (400, 500, 700 only)

**DON'T:**

- Mix too many font families
- Use decorative fonts
- Set body text below 16px
- Use ALL CAPS extensively (Space Mono is already distinctive)

---

## Layout Patterns

### Challenge Page Layout (Primary View)

```
┌─────────────────────────────────────────────────────┐
│  Navbar (fixed top)                                 │
├──────────────┬──────────────────────────────────────┤
│              │                                       │
│  Sidebar     │  Monaco Editor                       │
│  (384px)     │  (flex-1)                           │
│              │                                       │
│  - Title     │  - Code editing area                │
│  - Badge     │  - Syntax highlighting              │
│  - Desc      │  - Line numbers                     │
│  - Tests     │                                       │
│              ├───────────────────────────────────────┤
│              │  Control Bar                         │
│              │  [Run Tests] [Get Hint] [Reset]     │
│              ├───────────────────────────────────────┤
│              │  Results Panel (expandable)         │
│              │  ✓ Test 1: Multiple of 3            │
│              │  ✗ Test 2: Multiple of 5            │
│              │                                       │
└──────────────┴───────────────────────────────────────┘
```

### Dashboard Layout

```
┌─────────────────────────────────────────────────────┐
│  Navbar                                             │
├─────────────────────────────────────────────────────┤
│  Progress Bar (0/3 challenges completed)           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Challenge│  │ Challenge│  │ Challenge│        │
│  │    1     │  │    2     │  │    3     │        │
│  │  Easy    │  │  Medium  │  │  Hard    │        │
│  │ ✓ Done   │  │ In Prog  │  │ Locked   │        │
│  └──────────┘  └──────────┘  └──────────┘        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Component Patterns

### Buttons

```tsx
// Primary CTA
<button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
                   text-[var(--color-text-inverse)] px-4 py-2 rounded-[var(--radius-md)]">
  Run Tests
</button>

// Secondary
<button className="border border-[var(--color-border)] text-[var(--color-text)]
                   hover:bg-[var(--color-surface)] px-4 py-2 rounded-[var(--radius-md)]">
  Get Hint
</button>

// Danger
<button className="bg-[var(--color-error)] hover:bg-[var(--color-error-muted)]
                   text-[var(--color-text-inverse)] px-4 py-2 rounded-[var(--radius-md)]">
  Reset Code
</button>
```

### Cards

```tsx
// Challenge Card
<div
  className="bg-[var(--color-card)] border border-[var(--color-border)] 
                rounded-[var(--radius-lg)] p-6 
                hover:bg-[var(--color-card-hover)] hover:border-[var(--color-primary)]
                transition-all duration-200 cursor-pointer
                shadow-[var(--shadow-md)]"
>
  {/* Card content */}
</div>
```

### Badges

```tsx
// Difficulty Badge
<span
  className={`
  px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide
  ${
    difficulty === "easy" &&
    "bg-[var(--color-badge-easy)] text-[var(--color-text-inverse)]"
  }
  ${
    difficulty === "medium" &&
    "bg-[var(--color-badge-medium)] text-[var(--color-text-inverse)]"
  }
  ${
    difficulty === "hard" &&
    "bg-[var(--color-badge-hard)] text-[var(--color-text-inverse)]"
  }
`}
>
  {difficulty}
</span>
```

### Test Results

```tsx
// Test Result Item
<div className="flex items-center gap-3 py-2 border-b border-[var(--color-border)] last:border-0">
  {passed ? (
    <span className="text-[var(--color-success)] text-xl">✓</span>
  ) : (
    <span className="text-[var(--color-error)] text-xl">✗</span>
  )}
  <div className="flex-1">
    <p className="text-[var(--color-text)] font-medium">{testName}</p>
    {!passed && (
      <p className="text-[var(--color-text-muted)] text-sm">
        Expected: <code>{expected}</code>, Got: <code>{actual}</code>
      </p>
    )}
  </div>
</div>
```

### Hints Display

```tsx
// AI Hint Card
<div
  className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)] 
                rounded-[var(--radius-md)] p-4 animate-[var(--animate-fade-in)]"
>
  <div className="flex items-start gap-3">
    <span className="text-2xl">💡</span>
    <div>
      <p className="text-[var(--color-warning)] font-semibold mb-2">Hint</p>
      <p className="text-[var(--color-text)]">{hintText}</p>
    </div>
  </div>
</div>
```

---

## Animation Guidelines

### Timing Functions

```css
--animate-fade-in: fade-in 0.3s ease-out
--animate-slide-in: slide-in 0.3s ease-out
--animate-slide-up: slide-up 0.3s ease-out
--animate-scale-in: scale-in 0.2s ease-out
--animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
```

### When to Animate

**DO animate:**

- Page transitions (fade-in, slide-up)
- Modal/dialog appearances (scale-in)
- Test result updates (slide-in from right)
- Success states (confetti, scale)
- Loading states (pulse, spinner)
- Button hovers (subtle scale: 1.02)

**DON'T animate:**

- Text content changes
- Layout shifts
- Scrolling
- Frequent state updates (would be janky)

### Animation Rules

1. **Keep it subtle** - Animations should enhance, not distract
2. **Fast durations** - 200-300ms for most transitions
3. **Ease-out** - Feels more responsive than linear
4. **One at a time** - Don't stack animations
5. **Respect motion preferences** - Check `prefers-reduced-motion`

```tsx
// Respect user preferences
<div className="motion-safe:animate-[var(--animate-fade-in)]">
  {/* Content */}
</div>
```

---

## State Management

### Client State (React Hooks)

```tsx
// Code editor state
const [code, setCode] = useState(challenge.starter_code);
const [isRunning, setIsRunning] = useState(false);
const [results, setResults] = useState<TestResult[] | null>(null);

// Hint state
const [hints, setHints] = useState<AIHint[]>([]);
const [isGeneratingHint, setIsGeneratingHint] = useState(false);

// UI state
const [showSidebar, setShowSidebar] = useState(true);
const [activeTab, setActiveTab] = useState<"description" | "hints">(
  "description"
);
```

### Server State (React Server Components)

```tsx
// Fetch challenge data server-side
const { data: challenge } = await supabase
  .from("challenges")
  .select("*")
  .eq("id", params.id)
  .single();

// Fetch user progress
const { data: progress } = await supabase
  .from("user_progress")
  .select("*")
  .eq("user_id", user.id)
  .eq("challenge_id", params.id)
  .single();
```

### No Global State Needed

This app is simple enough that **prop drilling + server components** is sufficient. Avoid Redux/Zustand unless complexity grows significantly.

---

## API Design

### Route Patterns

```
POST /api/submit
POST /api/hint
GET  /api/progress
GET  /api/challenges
```

### Request/Response Format

```typescript
// Submit Code
POST /api/submit
{
  challengeId: string
  code: string
}
→ Response: {
  success: boolean
  passed: boolean
  test_results: TestResult[]
  execution_time_ms: number
  attempt_id: string
}

// Generate Hint
POST /api/hint
{
  challengeId: string
  code: string
  failedTests: TestResult[]
}
→ Response: {
  hint: string
  hint_type: 'syntax' | 'logic' | 'approach' | 'edge_case'
  hint_id: string
}
```

### Error Handling

```typescript
// Consistent error format
{
  error: string           // User-facing message
  code: string           // Machine-readable code
  details?: unknown      // Optional debug info
}

// HTTP Status Codes
200 - Success
400 - Bad Request (validation error)
401 - Unauthorized (not logged in)
404 - Not Found (challenge doesn't exist)
429 - Too Many Requests (rate limit)
500 - Internal Server Error
```

---

## Database Schema

### Key Tables

**challenges** - Core coding challenges

- `id`, `title`, `description`, `difficulty`, `language`
- `starter_code`, `solution_code`, `test_cases`
- `hints` (fallback if AI fails)

**attempts** - User code submissions

- `user_id`, `challenge_id`, `code`, `passed`
- `test_results`, `execution_time_ms`, `error_message`

**ai_hints** - Generated hints log

- `user_id`, `challenge_id`, `user_code`, `hint_text`
- `hint_type`, `tokens_used`

**user_progress** - Completion tracking

- `user_id`, `challenge_id`, `status`
- `attempts_count`, `hints_used`, `completed_at`

### RLS Policies

All tables have Row Level Security enabled:

- Users can only read/write their own data
- Challenges are publicly readable
- Service role bypasses RLS for admin operations

---

## AI Hint Generation

### Prompt Strategy

```typescript
const HINT_PROMPT = `You are an experienced coding mentor.

CHALLENGE:
${challenge.description}

STUDENT'S CODE:
\`\`\`${language}
${userCode}
\`\`\`

FAILED TESTS:
${failedTests.map(
  (t) => `- ${t.name}: Expected ${t.expected}, got ${t.actual}`
)}

PREVIOUS HINTS:
${previousHints.join("\n")}

Provide ONE guiding hint that:
1. Identifies a specific issue (not multiple)
2. Asks a leading question
3. Does NOT include solution code
4. Uses beginner-friendly language
5. Encourages them to think through the logic

Format: { "hint": "...", "type": "syntax|logic|approach|edge_case" }`;
```

### Hint Quality Guidelines

**Good hints:**

- "What happens when you divide 15 by both 3 and 5? Should you check that case first?"
- "The modulo operator (%) gives you the remainder. If n % 3 equals 0, what does that mean?"
- "You're returning the number, but the tests expect a string. How can you convert it?"

**Bad hints:**

- "Use this code: `return str(n)`" ← Gives solution
- "You have several issues..." ← Too vague
- "The answer is FizzBuzz for multiples of 15" ← Reveals logic

### Rate Limiting

- Max 3 hints per challenge per user
- 30-second cooldown between hint requests
- Log all hints for analytics

---

## Testing Strategy

### What to Test

**Unit Tests:**

- Hint generation doesn't reveal solution code
- Hint generation identifies error types correctly
- Code execution parses results correctly

**Component Tests:**

- CodeEditor renders Monaco
- TestResults displays pass/fail states
- HintDisplay shows hint text

**Integration Tests:**

- Submit code → Execute → Save attempt → Update progress
- Generate hint → Save to DB → Display to user

### What NOT to Test

- External APIs (Judge0, OpenAI) - mock these
- Supabase queries - trust the library
- UI styling - visual regression is overkill for MVP

### Example Test

```typescript
describe("Hint Generation", () => {
  it("should not reveal solution code", async () => {
    const challenge = {
      solution_code: 'return "FizzBuzz"',
      // ...
    };

    const hint = await generateHint(challenge, userCode, failedTests);

    expect(hint.hint.toLowerCase()).not.toContain("fizzbuzz");
    expect(hint.hint).not.toMatch(/return\s+"FizzBuzz"/);
  });
});
```

---

## Performance Considerations

### Bundle Size

- Monaco Editor is ~2MB - load asynchronously
- Use dynamic imports for Framer Motion
- Tree-shake unused Radix components

### Code Execution

- Set timeout: 2 seconds max per test
- Rate limit: 10 submissions per minute per user
- Cache challenge data (rarely changes)

### Database Queries

- Use indexes on `user_id`, `challenge_id`
- Paginate attempts history (don't load all)
- Use RLS for security, not app-level filters

---

## Deployment

### Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=

# Code Execution (choose one)
RAPIDAPI_KEY=              # Judge0 via RapidAPI
PISTON_API_URL=            # Or free Piston API

# Optional
NEXT_PUBLIC_APP_URL=       # For redirects
```

### Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Supabase production project created
- [ ] Database migrations run
- [ ] Challenges seeded
- [ ] Auth redirect URLs configured
- [ ] RLS policies enabled
- [ ] Demo account created
- [ ] Error monitoring enabled (Sentry/Vercel)

---

## Accessibility

### Requirements

- WCAG AA compliant
- Keyboard navigation works everywhere
- Focus indicators visible
- Color contrast ratio > 4.5:1
- Screen reader friendly

### Implementation

```tsx
// Focus management
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
  Run Tests
</button>

// ARIA labels
<button aria-label="Generate hint for current code">
  💡
</button>

// Skip links
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

---

## Common Patterns

### Loading States

```tsx
{isLoading ? (
  <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
    <div className="spinner w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent" />
    <span>Loading...</span>
  </div>
) : (
  // Content
)}
```

### Empty States

```tsx
{challenges.length === 0 ? (
  <div className="text-center py-12">
    <p className="text-[var(--color-text-muted)] text-lg mb-4">
      No challenges yet
    </p>
    <Button>Create First Challenge</Button>
  </div>
) : (
  // Challenge list
)}
```

### Error States

```tsx
{
  error && (
    <div
      className="bg-[var(--color-error)]/10 border border-[var(--color-error)] 
                  rounded-[var(--radius-md)] p-4"
    >
      <p className="text-[var(--color-error)] font-medium">Error</p>
      <p className="text-[var(--color-text)] text-sm mt-1">{error.message}</p>
    </div>
  );
}
```

---

## File Organization

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── login/             # Auth pages
│   ├── signup/
│   ├── dashboard/         # Protected routes
│   └── challenge/[id]/
├── components/            # React components
│   ├── ui/               # Base UI components (Button, Input, etc.)
│   ├── CodeEditor.tsx    # Monaco wrapper
│   ├── TestResults.tsx
│   └── HintDisplay.tsx
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase clients
│   ├── openai.ts         # AI integration
│   ├── judge0.ts         # Code execution
│   └── utils.ts          # Helpers
├── hooks/                 # Custom React hooks
│   ├── useChallenge.ts
│   └── useCodeExecution.ts
└── types/                 # TypeScript types
    └── index.ts
```

---

## Common Questions

### Q: Why no state management library?

**A:** The app is simple enough that React's built-in state + server components handle everything. Adding Redux would be over-engineering.

### Q: Why Supabase instead of Firebase?

**A:** Better TypeScript support, PostgreSQL (more powerful), and RLS policies for security. Also easier for job demo (SQL is universal).

### Q: Why Judge0 instead of running code locally?

**A:** Security - never run arbitrary user code on your server. Judge0 provides sandboxed execution with resource limits.

### Q: Why custom auth pages instead of Supabase UI?

**A:** Shows you can build forms from scratch. Also better control over styling to match terminal aesthetic.

### Q: Should I add user profiles/avatars?

**A:** Not for MVP. Focus on core learning experience first. Can add later if needed.

---

## What Makes This a Strong Portfolio Piece

1. **Full-stack** - Frontend, backend, database, AI integration
2. **Modern stack** - Latest Next.js, React 19, Turbopack
3. **Real complexity** - Code execution, AI hints, progress tracking
4. **Production-ready** - Auth, RLS, error handling, testing
5. **Product thinking** - Solves real problem (adaptive learning)
6. **Clean code** - TypeScript, consistent patterns, documented

---

## Next Features (Post-MVP)

If this becomes a real product:

- [ ] More languages (Ruby, Go, Rust)
- [ ] Video solution walkthroughs
- [ ] Community solutions view
- [ ] Leaderboards
- [ ] Cohort/classroom mode
- [ ] Custom challenge creation
- [ ] Spaced repetition algorithm
- [ ] Mobile app (React Native)

---

## Getting Help

When working with an AI assistant on this codebase:

**Always specify:**

- Which component/page you're working on
- What the terminal aesthetic should look like
- Whether it needs to be accessible
- If it should use existing patterns

**Example prompts:**

- "Create a ChallengeCard component using the terminal aesthetic from CLAUDE.md"
- "Add loading states to the CodeEditor following the patterns in CLAUDE.md"
- "Fix the auth flow but keep the styling consistent with the design system"

---

Last updated: January 2026
Version: 1.0.0
