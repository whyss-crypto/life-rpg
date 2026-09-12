"use client";

import React from "react";
import Link from "next/link";
import { GameNav } from "./GameNav";
import { useGame } from "@/components/providers/GameProvider";
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
      <main id="main" className="flex-1 px-4 pb-24 pt-4 lg:px-2 lg:pb-10" tabIndex={-1}>
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
          children
        )}
      </main>
    </div>
  );
}
