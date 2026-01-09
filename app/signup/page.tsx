"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = await createClient();

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split("@")[0],
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Check if email confirmation is required
      if (data.user && !data.session) {
        setSuccess(true);
      } else {
        // Auto-signed in (if email confirmation is disabled)
        router.push("/dashboard");
        router.refresh();
      }
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div
            className="bg-[var(--color-card)] border border-[var(--color-success)] 
                        rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-lg)]"
          >
            <div
              className="w-16 h-16 bg-[var(--color-success)] rounded-full 
                          flex items-center justify-center mx-auto mb-4"
            >
              <svg
                className="w-8 h-8 text-[var(--color-text-inverse)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-text)] mb-2">
              Check Your Email
            </h2>
            <p className="text-[var(--color-text-muted)] mb-6">
              We&apos;ve sent a confirmation link to <strong>{email}</strong>.
              Click the link to activate your account.
            </p>
            <Link href="/login">
              <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-[var(--animate-fade-in)]">
          <h1 className="font-[var(--font-display)] text-5xl text-[var(--color-text)] mb-2">
            CodeMentor AI
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg">
            Start your coding journey today
          </p>
        </div>

        {/* Sign Up Form */}
        <div
          className="bg-[var(--color-card)] border border-[var(--color-border)] 
                     rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-lg)]
                     animate-[var(--animate-slide-up)]"
        >
          <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-text)] mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Username Field */}
            <div>
              <Label htmlFor="username" className="text-[var(--color-text)]">
                Username (optional)
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="coolcoder123"
                className="mt-1 bg-[var(--color-input)] border-[var(--color-input-border)] 
                          text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
              />
            </div>

            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-[var(--color-text)]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1 bg-[var(--color-input)] border-[var(--color-input-border)] 
                          text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
              />
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-[var(--color-text)]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="mt-1 bg-[var(--color-input)] border-[var(--color-input-border)] 
                          text-[var(--color-text)]"
              />
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Minimum 6 characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="bg-[var(--color-error)]/10 border border-[var(--color-error)] 
                            rounded-[var(--radius-sm)] p-3 text-[var(--color-error)] text-sm"
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] 
                       text-[var(--color-text-inverse)] font-medium"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm">
            <p className="text-[var(--color-text-muted)]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[var(--color-primary)] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-4 text-xs text-center text-[var(--color-text-muted)]">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
