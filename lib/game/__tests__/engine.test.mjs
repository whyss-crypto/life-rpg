import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { xpRequired, levelForXp, progressForXp } from "../levels.mjs";
import { nextStreak } from "../streaks.mjs";
import { rewardsFor } from "../economy.mjs";
import { evaluateAchievements } from "../achievements.mjs";
import { attributeForCategory } from "../attributes.mjs";

// NOTE: this file is ESM-consumable (.mjs) so `npm test` (node --test) runs without a TS loader.
// A mirrored TS version lives at engine.test.ts for editors.

describe("levels", () => {
  it("xp curve is strictly increasing", () => {
    let prev = 0;
    for (let l = 1; l <= 20; l++) {
      const need = xpRequired(l);
      assert.ok(need > prev, `level ${l} should exceed previous`);
      prev = need;
    }
  });
  it("level 1 needs 100 xp", () => {
    assert.equal(xpRequired(1), 100);
  });
  it("multi-level jumps resolve", () => {
    assert.equal(levelForXp(0), 1);
    assert.equal(levelForXp(99), 1);
    assert.equal(levelForXp(100), 2);
    const p = progressForXp(100);
    assert.equal(p.level, 2);
    assert.ok(p.progress >= 0 && p.progress <= 1);
  });
});

describe("streaks", () => {
  it("first activity starts streak", () => {
    const r = nextStreak({ current: 0, best: 0, lastDate: null }, "2026-09-12");
    assert.deepEqual(r, { current: 1, best: 1, incremented: true });
  });
  it("same-day is no-op", () => {
    const r = nextStreak({ current: 3, best: 5, lastDate: "2026-09-12" }, "2026-09-12");
    assert.equal(r.incremented, false);
    assert.equal(r.current, 3);
  });
  it("consecutive day increments", () => {
    const r = nextStreak({ current: 3, best: 3, lastDate: "2026-09-11" }, "2026-09-12");
    assert.equal(r.current, 4);
    assert.equal(r.best, 4);
  });
  it("missed day resets but keeps best", () => {
    const r = nextStreak({ current: 5, best: 9, lastDate: "2026-09-09" }, "2026-09-12");
    assert.equal(r.current, 1);
    assert.equal(r.best, 9);
  });
});

describe("economy", () => {
  it("difficulty tiers match PRD baselines", () => {
    assert.deepEqual(rewardsFor("easy"), { xp: 50, gold: 10, attrPoints: 1 });
    assert.deepEqual(rewardsFor("normal"), { xp: 100, gold: 20, attrPoints: 2 });
    assert.deepEqual(rewardsFor("hard"), { xp: 175, gold: 35, attrPoints: 3 });
    assert.deepEqual(rewardsFor("epic"), { xp: 300, gold: 60, attrPoints: 5 });
  });
});

describe("achievements", () => {
  it("first quest + centurion trigger", () => {
    const unlocked = evaluateAchievements({ totalQuests: 1, totalXp: 1200, level: 2, streak: 1 });
    assert.ok(unlocked.includes("FIRST QUEST"));
    assert.ok(unlocked.includes("CENTURION"));
  });
  it("does not re-unlock owned", () => {
    const unlocked = evaluateAchievements(
      { totalQuests: 60, totalXp: 99999, level: 20, streak: 30 },
      ["FIRST QUEST"]
    );
    assert.ok(!unlocked.includes("FIRST QUEST"));
    assert.ok(unlocked.includes("QUEST MASTER"));
  });
});

describe("attributes", () => {
  it("maps categories", () => {
    assert.equal(attributeForCategory("coding"), "intellect");
    assert.equal(attributeForCategory("fitness"), "strength");
    assert.equal(attributeForCategory("running"), "endurance");
    assert.equal(attributeForCategory("unknown-xyz"), "focus");
  });
});
