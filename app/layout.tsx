import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/components/providers/GameProvider";

export const metadata: Metadata = {
  title: "Life RPG — Turn Your Life Into a Quest",
  description:
    "Complete real-world quests, earn XP and gold, build attributes, keep streaks, and unlock legendary gear.",
  openGraph: {
    title: "Life RPG — Turn Your Life Into a Quest",
    description: "Real life, gamified. Quests, XP, streaks, armory.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-rpg min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-gold-500 focus:px-3 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
