# CodeMentor AI

An adaptive learning platform for coding challenges with AI-powered hints. Built with Next.js, TypeScript, Supabase, and OpenAI.

https://github.com/user-attachments/assets/e40691aa-0623-4f20-93d5-67999e9d3814



## 🎯 Features

- **Adaptive Learning**: Personalized challenge recommendations based on performance
- **AI-Powered Hints**: Context-aware hints using OpenAI GPT-4
- **Multi-Language Support**: Python, JavaScript, and TypeScript
- **Real-Time Code Execution**: Secure code execution via Piston API
- **Progress Tracking**: Comprehensive analytics and learning path visualization
- **Modern Stack**: Next.js 16, TypeScript, Supabase, Tailwind CSS

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL + Auth)
- **AI/ML**: OpenAI GPT-4 for adaptive hints
- **Code Execution**: Piston API for secure code execution
- **Deployment**: Vercel (Frontend), Supabase (Database)

### Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── hint/         # AI hint generation
│   │   └── submit/       # Code submission & testing
│   ├── challenge/        # Challenge pages
│   ├── dashboard/        # User dashboard
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   ├── CodeEditor.tsx    # Monaco editor integration
│   └── TestResults.tsx   # Test execution results
├── lib/                  # Utility libraries
│   ├── openai.ts         # OpenAI integration
│   ├── piston.ts         # Code execution
│   └── supabase/         # Supabase client utilities
├── types/                # TypeScript type definitions
└── supabase/             # Database migrations & config
    └── migrations/       # SQL migration files
```

### Key Design Patterns

- **Server Components**: Leveraging Next.js server components for data fetching
- **Type Safety**: Comprehensive TypeScript types generated from database schema
- **Row Level Security**: Supabase RLS policies for data access control
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Separation of Concerns**: Clear separation between UI, business logic, and data access

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun
- Supabase account (or local Supabase instance)
- OpenAI API key
- Piston API instance (or use public instance)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd codementor-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   OPENAI_API_KEY=your_openai_api_key
   PISTON_URL=http://localhost:2000  # or your Piston instance
   ```

4. **Set up the database**

   ```bash
   # Run migrations
   supabase migration up

   # Seed with sample data (optional)
   supabase db reset
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage

# Run E2E tests
npm test:e2e
```

### Test Structure

- `__tests__/unit/` - Unit tests for utilities and business logic
- `__tests__/integration/` - API route integration tests
- `__tests__/e2e/` - End-to-end user flow tests

## 📝 Development Workflow

### Code Quality

- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier (recommended)
- **Type Checking**: TypeScript strict mode
- **Pre-commit Hooks**: Husky + lint-staged (recommended setup)

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `fix/*` - Bug fixes

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

## 🏭 Production Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to `main`

### Database Migrations

Run migrations in production:

```bash
supabase db push
```

### Monitoring

- **Error Tracking**: Sentry (recommended)
- **Analytics**: Vercel Analytics or custom solution
- **Performance**: Vercel Speed Insights

## 🤝 Contributing

### For Apprentices

1. Read the [Architecture Guide](./docs/ARCHITECTURE.md)
2. Check the [Component Library](./docs/COMPONENTS.md)
3. Review [Code Review Checklist](./docs/CODE_REVIEW.md)
4. Create a feature branch from `develop`
5. Write tests for your changes
6. Submit a PR with a clear description

### Code Review Process

1. Automated checks (tests, linting) must pass
2. At least one approval required
3. Address all review comments
4. Squash commits before merging

## 📚 Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md) - System design and patterns
- [API Documentation](./docs/API.md) - API endpoints and contracts
- [Component Library](./docs/COMPONENTS.md) - Reusable components
- [Database Schema](./docs/DATABASE.md) - Schema documentation

## 🎓 Learning Resources

### For New Developers

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

## 📄 License

MIT

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Code editor powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- Database hosted on [Supabase](https://supabase.com)
