"use client";

import type { DemoItem } from "@/components/providers/GameProvider";
import { EmptyState } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function InventoryVault({
  owned,
  catalog,
  equippedTitle,
  onEquip,
}: {
  owned: string[];
  catalog: DemoItem[];
  equippedTitle: string | null;
  onEquip: (name: string | null) => void;
}) {
  const items = catalog.filter((c) => owned.includes(c.id));
  if (items.length === 0) {
    return (
      <EmptyState
        title="An empty vault."
        body="Relics you acquire in the armory are kept here. Titles can be worn beside your name."
      />
    );
  }
  return (
    <ul className="border-t hairline">
      {items.map((item) => {
        const equipped = item.type === "title" && equippedTitle === item.name;
        return (
          <li key={item.id} className="grid gap-2 border-b hairline py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
            <div>
              <p className="kicker !text-[10px] text-fog-faint">{item.type}</p>
              <h3 className="font-display mt-1.5 text-lg font-bold text-ink">{item.name}</h3>
              {item.description && <p className="mt-0.5 text-sm text-fog">{item.description}</p>}
            </div>
            {item.type === "title" ? (
              <button
                onClick={() => onEquip(equipped ? null : item.name)}
                className={cn(
                  "press min-h-[44px] rounded-sharp border px-5 text-sm font-semibold transition",
                  equipped
                    ? "border-moss/50 text-moss"
                    : "border-white/15 text-fog hover:border-white/30 hover:text-ink"
                )}
                aria-pressed={equipped}
                aria-label={equipped ? `Take off ${item.name}` : `Wear ${item.name}`}
              >
                {equipped ? "Worn" : "Wear"}
              </button>
            ) : (
              <span className="kicker !text-[10px] text-fog-faint">Kept</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
