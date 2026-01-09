"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 48, text: "text-2xl" },
  xl: { icon: 64, text: "text-3xl" },
};

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const { icon, text } = sizes[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoIcon size={icon} />
      {showText && (
        <span className={cn("font-display text-[var(--color-text)]", text)}>
          CodeMentor
        </span>
      )}
    </div>
  );
}

interface LogoIconProps {
  size?: number;
  className?: string;
}

export function LogoIcon({ size = 32, className }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CodeMentor Logo"
    >
      {/* Background rounded square */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="10"
        fill="var(--color-surface)"
        stroke="var(--color-border)"
        strokeWidth="2"
      />

      {/* Greater than symbol (>) - Terminal prompt */}
      <path
        d="M12 16L22 24L12 32"
        stroke="var(--color-primary)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Underscore/cursor (_) - with animation */}
      <rect
        x="26"
        y="28"
        width="12"
        height="4"
        rx="1"
        fill="var(--color-success)"
        className="animate-pulse"
      />
    </svg>
  );
}

// Alternative: Minimalist version without background
export function LogoIconMinimal({ size = 32, className }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CodeMentor Logo"
    >
      {/* Greater than symbol (>) */}
      <path
        d="M8 12L24 24L8 36"
        stroke="var(--color-primary)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Underscore/cursor (_) */}
      <rect
        x="28"
        y="30"
        width="14"
        height="5"
        rx="2"
        fill="var(--color-success)"
        className="animate-pulse"
      />
    </svg>
  );
}

// Alternative: Stacked/compact version
export function LogoIconStacked({ size = 32, className }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CodeMentor Logo"
    >
      {/* Outer bracket forming a "C" shape for Code */}
      <path
        d="M32 8L12 24L32 40"
        stroke="var(--color-primary)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner cursor representing mentorship/guidance */}
      <rect
        x="22"
        y="21"
        width="16"
        height="6"
        rx="2"
        fill="var(--color-success)"
        className="animate-pulse"
      />
    </svg>
  );
}

// Animated version with blinking cursor
export function LogoIconAnimated({ size = 32, className }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CodeMentor Logo"
    >
      {/* Background */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="10"
        fill="var(--color-surface)"
        stroke="var(--color-border)"
        strokeWidth="2"
      />

      {/* Greater than symbol (>) */}
      <path
        d="M12 16L22 24L12 32"
        stroke="var(--color-primary)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Blinking cursor */}
      <rect x="26" y="28" width="12" height="4" rx="1" fill="var(--color-success)">
        <animate
          attributeName="opacity"
          values="1;0;1"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
}
