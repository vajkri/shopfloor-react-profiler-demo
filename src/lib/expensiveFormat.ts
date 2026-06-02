/**
 * Controlled, DETERMINISTIC synthetic cost.
 *
 * This stands in for the kind of real per-render work you find in production
 * code: locale-aware currency formatting, parsing, deriving display strings,
 * etc. We make it cost a small-but-measurable amount of time so that *wasted*
 * re-renders show up as real milliseconds in the React Profiler.
 *
 * It is intentionally NOT random — given the same input it always does the same
 * work and returns the same string — so "before vs after" Profiler numbers are
 * honest and comparable.
 */

// How many iterations of busy-work per call. Tuned so ~600 rows is clearly
// felt in a dev build but never freezes CodeSandbox. Lower it if your machine
// is slow; raise it to make the jank more dramatic on stage.
const WORK = 1500;

export function expensiveFormat(amount: number): string {
  // Deterministic busy-work: derive a stable number from `amount`.
  let acc = amount;
  for (let i = 0; i < WORK; i++) {
    acc = (acc * 1.0000001 + i) % 9973; // prime modulus keeps it bounded
  }
  // The busy-work result is discarded on purpose — only its time cost matters.
  void acc;

  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Cheap star string, e.g. 4.3 -> "★★★★☆". Deterministic, no busy-work. */
export function ratingStars(rating: number): string {
  const full = Math.round(rating);
  return "★★★★★☆☆☆☆☆".slice(5 - full, 10 - full);
}
