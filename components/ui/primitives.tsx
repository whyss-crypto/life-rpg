import React from "react";
import { cn } from "@/lib/utils";

export function Button({
  children,
  variant = "gold",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "gold" | "ghost" | "steel" | "arcane" | "danger";
}) {
  const styles =
    variant === "gold"
      ? "bg-gold-500 font-semibold text-black hover:bg-gold-400"
      : variant === "steel" || variant === "arcane"
        ? "bg-steel-500/15 text-steel-300 hover:bg-steel-500/25"
        : variant === "danger"
          ? "border border-blood/30 bg-blood/10 text-blood hover:bg-blood/20"
          : "border hairline bg-transparent text-ink hover:bg-white/[0.05]";
  return (
    <button
      className={cn(
        "press inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sharp px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50",
        styles,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-sharp bg-white/[0.06]", className)} aria-hidden="true" />;
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 py-12">
      <p className="font-display text-2xl font-bold text-fog">{title}</p>
      <p className="max-w-sm text-[15px] leading-relaxed text-fog">{body}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
