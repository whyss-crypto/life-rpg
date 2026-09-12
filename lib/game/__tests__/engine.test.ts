import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { xpRequired, levelForXp, progressForXp } from "../levels";
import { nextStreak } from "../streaks";
import { rewardsFor } from "../economy";
import { evaluateAchievements } from "../achievements";
import { attributeForCategory } from "../attributes";

// Mirrors engine.test.mjs (which is the runnable suite via `npm test`).
describe("engine(ts mirror)", () => {
  it("xp curve strictly increasing", () => {
    let prev = 0;
    for (let l = 1; l <= 20; l++) {
      const need = xpRequired(l);
      assert.ok(need > prev);
      prev = need;
    }
  });
  it("streak same-day no-op", () => {
    const r = nextStreak({ current: 2, best: 2, lastDate: "2026-09-12" }, "2026-09-12");
    assert.equal(r.incremented, false);
  });
  it("rewards baseline", () => {
    assert.deepEqual(rewardsFor("epic"), { xp: 300, gold: 60, attrPoints: 5 });
  });
  it("achievements evaluate", () => {
    const u = evaluateAchievements({ totalQuests: 1, totalXp: 5, level: 1, streak: 1 });
    assert.ok(u.includes("FIRST QUEST"));
  });
  it("category mapping", () => {
    assert.equal(attributeForCategory("coding"), "intellect");
    void levelForXp;
    void progressForXp;
  });
});
