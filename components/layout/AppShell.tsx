import React from "react";
import { GameNav } from "./GameNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl gap-0 lg:gap-6 lg:p-6">
      <GameNav />
      <main id="main" className="flex-1 px-4 pb-24 pt-4 lg:px-2 lg:pb-10" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
