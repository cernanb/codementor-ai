/**
 * Rate limiting middleware
 * Demonstrates production-ready infrastructure patterns
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  identifier?: string; // Custom identifier (defaults to user ID)
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: Date;
  retryAfter?: number;
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: Date }>();

/**
 * Rate limiter using sliding window algorithm
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const identifier = await getRateLimitIdentifier(request, config.identifier);
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);

  // Get or create rate limit entry
  const entry = rateLimitStore.get(identifier);
  
  if (!entry || entry.resetAt < now) {
    // New window or expired entry
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: new Date(now.getTime() + config.windowMs),
    });
    
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetAt: new Date(now.getTime() + config.windowMs),
    };
  }

  // Increment count
  entry.count += 1;

  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt.getTime() - now.getTime()) / 1000);
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter,
    };
  }

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Gets identifier for rate limiting
 * Defaults to user ID, falls back to IP address
 */
async function getRateLimitIdentifier(
  request: NextRequest,
  customIdentifier?: string
): Promise<string> {
  if (customIdentifier) {
    return customIdentifier;
  }

  // Try to get authenticated user ID
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      return `user:${user.id}`;
    }
  } catch {
    // Fall through to IP-based limiting
  }

  // Fall back to IP address
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";
  return `ip:${ip}`;
}

/**
 * Rate limit middleware wrapper
 * Returns 429 if rate limit exceeded
 */
export async function withRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  handler: (req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const result = await rateLimit(request, config);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        code: "RATE_LIMIT_EXCEEDED",
        retryAfter: result.retryAfter,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": config.maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": result.resetAt.toISOString(),
          "Retry-After": result.retryAfter?.toString() || "60",
        },
      }
    );
  }

  const response = await handler(request);

  // Add rate limit headers to successful responses
  response.headers.set("X-RateLimit-Limit", config.maxRequests.toString());
  response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
  response.headers.set("X-RateLimit-Reset", result.resetAt.toISOString());

  return response;
}

/**
 * Cleanup expired entries (run periodically)
 * In production, use Redis TTL instead
 */
export function cleanupRateLimitStore() {
  const now = new Date();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
