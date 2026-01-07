"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-[var(--animate-fade-in)]">
          <h1 className="font-[var(--font-display)] text-5xl text-[var(--color-text)] mb-2">
            CodeMentor AI
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg">
            Sign in to continue learning
          </p>
        </div>

        {/* Login Form */}
        <div
          className="bg-[var(--color-card)] border border-[var(--color-border)]
                     rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-lg)]
                     animate-[var(--animate-slide-up)]"
        >
          <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-text)] mb-6">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
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
                className="mt-1 bg-[var(--color-input)] border-[var(--color-input-border)]
                          text-[var(--color-text)]"
              />
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
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm">
            <p className="text-[var(--color-text-muted)]">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[var(--color-primary)] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
