import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Navigation */}
      <nav className="border-b border-[var(--color-border)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl text-[var(--color-text)]">
            <span className="text-[var(--color-primary)]">&gt;</span> CodeMentor
            <span className="text-[var(--color-success)]">_</span>
          </Link>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-sm"
                >
                  Dashboard
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-sm"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4">
        <section className="py-20 md:py-32 text-center">
          {/* Terminal prompt */}
          <div className="inline-block mb-8 motion-safe:animate-[var(--animate-fade-in)]">
            <span className="font-mono text-sm text-[var(--color-text-muted)] bg-[var(--color-surface)] px-4 py-2 rounded-full border border-[var(--color-border)]">
              <span className="text-[var(--color-success)]">$</span> learn --with-ai
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-display text-4xl md:text-6xl text-[var(--color-text)] mb-6 motion-safe:animate-[var(--animate-slide-up)]">
            Learn to Code with
            <br />
            <span className="text-gradient">AI-Powered Hints</span>
          </h1>

          {/* Subheadline */}
          <p className="text-[var(--color-text-muted)] text-lg md:text-xl max-w-2xl mx-auto mb-10 motion-safe:animate-[var(--animate-slide-up)]">
            Adaptive coding challenges that guide you with contextual hints—like
            having a mentor who asks the right questions instead of giving away
            the answers.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 motion-safe:animate-[var(--animate-slide-up)]">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] px-8 py-3 rounded-[var(--radius-md)] font-medium transition-colors w-full sm:w-auto"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] px-8 py-3 rounded-[var(--radius-md)] font-medium transition-colors w-full sm:w-auto"
                >
                  Start Learning Free
                </Link>
                <Link
                  href="/login"
                  className="border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] px-8 py-3 rounded-[var(--radius-md)] font-medium transition-colors w-full sm:w-auto"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Code Preview Section */}
        <section className="py-16 motion-safe:animate-[var(--animate-fade-in)]">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-lg)] overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-card)] border-b border-[var(--color-border)]">
                <div className="w-3 h-3 rounded-full bg-[var(--color-error)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--color-warning)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--color-success)]" />
                <span className="ml-4 text-[var(--color-text-muted)] text-sm font-mono">
                  fizzbuzz.js
                </span>
              </div>

              {/* Code content */}
              <div className="p-6 font-mono text-sm">
                <pre className="text-[var(--color-text)]">
                  <code>
                    <span className="text-[var(--color-primary)]">function</span>{" "}
                    <span className="text-[var(--color-warning)]">fizzBuzz</span>
                    (n) {"{"}
                    {"\n"}
                    {"  "}
                    <span className="text-[var(--color-text-muted)]">
                      {"// Your code here..."}
                    </span>
                    {"\n"}
                    {"  "}
                    <span className="text-[var(--color-primary)]">if</span> (n %{" "}
                    <span className="text-[var(--color-success)]">15</span> ==={" "}
                    <span className="text-[var(--color-success)]">0</span>) {"{"}
                    {"\n"}
                    {"    "}
                    <span className="text-[var(--color-primary)]">return</span>{" "}
                    <span className="text-[var(--color-error)]">???</span>
                    {"\n"}
                    {"  }"}
                    {"\n"}
                    {"}"}
                  </code>
                </pre>
              </div>

              {/* Hint preview */}
              <div className="mx-6 mb-6 bg-[var(--color-warning)]/10 border border-[var(--color-warning)] rounded-[var(--radius-md)] p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <p className="text-[var(--color-warning)] font-semibold text-sm mb-1">
                      Hint
                    </p>
                    <p className="text-[var(--color-text)] text-sm">
                      What string should you return when a number is divisible
                      by both 3 and 5? Think about what &quot;FizzBuzz&quot;
                      means...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 border-t border-[var(--color-border)]">
          <h2 className="font-display text-2xl md:text-3xl text-[var(--color-text)] text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 hover:border-[var(--color-primary)] transition-colors">
              <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-[var(--radius-md)] flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-display text-lg text-[var(--color-text)] mb-2">
                1. Solve Challenges
              </h3>
              <p className="text-[var(--color-text-muted)] text-sm">
                Write code in our browser-based editor with syntax highlighting
                and real-time feedback.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 hover:border-[var(--color-primary)] transition-colors">
              <div className="w-12 h-12 bg-[var(--color-warning)]/10 rounded-[var(--radius-md)] flex items-center justify-center mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-display text-lg text-[var(--color-text)] mb-2">
                2. Get Smart Hints
              </h3>
              <p className="text-[var(--color-text-muted)] text-sm">
                Stuck? Our AI analyzes your code and asks guiding questions to
                help you discover the solution.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 hover:border-[var(--color-primary)] transition-colors">
              <div className="w-12 h-12 bg-[var(--color-success)]/10 rounded-[var(--radius-md)] flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-display text-lg text-[var(--color-text)] mb-2">
                3. Track Progress
              </h3>
              <p className="text-[var(--color-text-muted)] text-sm">
                See your improvement over time with detailed progress tracking
                and difficulty progression.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center border-t border-[var(--color-border)]">
          <h2 className="font-display text-2xl md:text-3xl text-[var(--color-text)] mb-4">
            {isLoggedIn ? "Continue your journey" : "Ready to level up?"}
          </h2>
          <p className="text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
            {isLoggedIn
              ? "Pick up where you left off and keep building your skills."
              : "Join developers who are learning to code the smart way—with guidance that makes you think."}
          </p>
          <Link
            href={isLoggedIn ? "/dashboard" : "/signup"}
            className="inline-block bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] px-8 py-3 rounded-[var(--radius-md)] font-medium transition-colors"
          >
            {isLoggedIn ? "Go to Dashboard" : "Start Your First Challenge"}
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[var(--color-text-muted)] text-sm font-mono">
            <span className="text-[var(--color-primary)]">&gt;</span> Built with
            Next.js, Supabase &amp; OpenAI
          </p>
        </div>
      </footer>
    </div>
  );
}
