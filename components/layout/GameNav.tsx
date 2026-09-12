"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Swords, User, ShoppingBag, Backpack, Trophy, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quests", label: "Quests", icon: Swords },
  { href: "/character", label: "Character", icon: User },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/inventory", label: "Vault", icon: Backpack },
  { href: "/achievements", label: "Feats", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function GameNav() {
  const path = usePathname();
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-white/10 bg-obsidian-900/70 p-4 backdrop-blur lg:flex" aria-label="Primary">
        <Link href="/" className="mb-4 flex items-center gap-2 px-2" aria-label="Life RPG home">
          <span className="flex h-9 w-9 items-center justify-center rounded-rune bg-gradient-to-b from-gold-300 to-gold-700 font-display text-lg font-bold text-black">
            L
          </span>
          <span className="font-display text-lg tracking-widest">
            LIFE <span className="gold-text">RPG</span>
          </span>
        </Link>
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href === "/dashboard" && path === "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-rune px-3 py-2.5 text-sm transition",
                active ? "bg-gold-500/15 text-gold-300" : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {active && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-gold-400" aria-hidden="true" />}
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
        <div className="rune-divider my-3" aria-hidden="true" />
        <p className="px-2 text-xs text-muted-500">Complete quests. Earn legend.</p>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-obsidian-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        aria-label="Primary mobile"
      >
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {LINKS.slice(0, 5).map(({ href, label, icon: Icon }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-rune text-[11px]",
                  active ? "bg-gold-500/15 text-gold-300" : "text-slate-400"
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
