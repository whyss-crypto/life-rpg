"use client";

import React from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { GameNav } from "./GameNav";
import { useGame } from "@/components/providers/GameProvider";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button, Skeleton } from "@/components/ui/primitives";

function LoadingBoard() {
  return (
    <div className="flex flex-col gap-3" aria-label="Loading your realm" role="status">
      <Skeleton className="h-24 w-full" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-40 w-full" />
      <span className="sr-only">Loading your realm…</span>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { status, error, refresh } = useGame();
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl gap-0 lg:gap-6 lg:p-6">
      <GameNav />
      <main id="main" className="min-w-0 flex-1 px-4 pb-24 pt-4 sm:px-5 lg:px-2 lg:pb-10" tabIndex={-1}>
        {status === "loading" ? (
          <LoadingBoard />
        ) : status === "error" ? (
          <div
            className="card-surface rounded-sharp mx-auto mt-10 max-w-lg p-8 text-center"
            role="alert"
          >
            <p className="font-display text-xl tracking-widest text-blood">REALM UNREACHABLE</p>
            <p className="mt-3 text-sm text-fog">{error}</p>
            <div className="mt-6 flex justify-center gap-2">
              <Button onClick={() => void refresh()}>Retry</Button>
              <Link
                href="/"
                className="press inline-flex min-h-[44px] items-center rounded-sharp border hairline bg-white/[0.03] px-5 text-sm text-fog hover:text-ink"
              >
                Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            <MobilePlayerBar />
            {children}
          </>
        )}
      </main>
    </div>
  );
}

/**
 * Compact player strip for small screens: identity, treasury, settings.
 * The sidebar (with the full identity block) takes over at lg.
 */
function MobilePlayerBar() {
  const { state } = useGame();
  const c = state.character;
  return (
    <div className="mb-4 flex items-center gap-3 border-b hairline pb-3 lg:hidden" aria-label="Player summary">
      <span
        className="display-num flex h-10 w-10 shrink-0 items-center justify-center rounded-sharp border hairline bg-white/[0.03] text-lg font-bold text-ink"
        aria-hidden="true"
      >
        {c.level}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink" title={state.username}>
          {state.username || "Adventurer"}
        </p>
        <p className="tnum text-xs text-fog">
          Lv {c.level} · <span className="font-semibold text-gold-400">{c.gold.toLocaleString()} G</span>
          {" · "}Day {c.current_streak}
        </p>
      </div>
      <Link
        href="/settings"
        className="press rounded-sharp p-2.5 text-fog transition hover:text-ink"
        aria-label="Open settings"
      >
        <Settings className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      </Link>
    </div>
  );
}
