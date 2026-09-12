import React from "react";
import { cn } from "@/lib/utils";

export function Button({
  children,
  variant = "gold",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "gold" | "ghost" | "arcane" | "danger";
}) {
  const styles =
    variant === "gold"
      ? "bg-gradient-to-b from-gold-300 to-gold-600 text-black font-semibold hover:brightness-110 shadow-gold-glow"
      : variant === "arcane"
        ? "bg-arcane-500/90 text-white hover:bg-arcane-400"
        : variant === "danger"
          ? "bg-blood/15 text-blood border border-blood/30 hover:bg-blood/25"
          : "bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10";
  return (
    <button
      className={cn(
        "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-rune px-5 py-2.5 text-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
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
  return <div className={cn("animate-pulse rounded-rune bg-white/10", className)} aria-hidden="true" />;
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
    <div className="card-surface rounded-rune flex flex-col items-center gap-3 px-8 py-14 text-center">
      <p className="font-display text-xl tracking-widest text-gold-400">{title}</p>
      <p className="max-w-sm text-sm text-slate-300">{body}</p>
      {action}
    </div>
  );
}
