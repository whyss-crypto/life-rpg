"use client";

// Reward flight choreography: a small token travels from the completed quest
// to the HUD figure it augments (XP → lifetime total, gold → treasury).
// Transforms + opacity only. Resolves instantly under reduced motion.

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function center(r: DOMRect): { x: number; y: number } {
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

export async function flyToken(opts: {
  from: DOMRect;
  to: DOMRect;
  label: string;
  tone: "ivory" | "gold";
  delay?: number;
}): Promise<void> {
  if (prefersReducedMotion()) return;
  const { gsap } = await import("gsap");
  const a = center(opts.from);
  const b = center(opts.to);
  const el = document.createElement("div");
  el.className = "flight-token tnum";
  el.textContent = opts.label;
  el.style.color = opts.tone === "gold" ? "#d9b45c" : "#ece7da";
  el.style.borderColor =
    opts.tone === "gold" ? "rgba(195,154,59,0.5)" : "rgba(255,255,255,0.16)";
  document.body.appendChild(el);
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  gsap.set(el, { x: a.x - w / 2, y: a.y - h / 2, opacity: 0, scale: 0.85 });

  await new Promise<void>((resolve) => {
    const tl = gsap.timeline({ delay: opts.delay ?? 0, onComplete: resolve });
    tl.to(el, { opacity: 1, scale: 1, duration: 0.18, ease: "power2.out" });
    // Rise slightly, then travel to the target with a soft arc.
    tl.to(el, { y: `-=${Math.max(24, Math.abs(b.y - a.y) * 0.18)}`, duration: 0.22, ease: "power2.out" }, 0.1);
    tl.to(
      el,
      { x: b.x - w / 2, y: b.y - h / 2, duration: 0.62, ease: "power2.inOut" },
      0.24
    );
    tl.to(el, { opacity: 0, scale: 0.7, duration: 0.16, ease: "power2.in" }, "-=0.12");
  });
  el.remove();
}

export async function pulseHud(target: "xp" | "gold"): Promise<void> {
  if (prefersReducedMotion()) return;
  const el = document.querySelector(`[data-hud="${target}"]`);
  if (!(el instanceof HTMLElement)) return;
  const { gsap } = await import("gsap");
  gsap.fromTo(el, { scale: 1 }, { scale: 1.12, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.out" });
}

export function hudTarget(name: "xp" | "gold"): DOMRect | null {
  const el = document.querySelector(`[data-hud="${name}"]`);
  return el instanceof HTMLElement ? el.getBoundingClientRect() : null;
}
