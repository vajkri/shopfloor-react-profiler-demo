# 🗝️ Facilitator Guide & Answer Key

Everything below is the stuff participants **don't** get. Each fix also lives as one commit on the **`solutions`** branch (`git log --oneline solutions`), so you can reveal them one at a time with `git show <commit>`.

## Running the session

- **Audience:** mixed front-end. Issues are ordered easy → hard; let people self-pace.
- **Format:** everyone forks the CodeSandbox (or clones `main`). They profile, diagnose, fix. Reconvene per issue and reveal.
- **The recurring lesson:** *measure → diagnose → fix → measure again.* Push people to re-record after every fix and **watch components go grey**. That "it's skipped now" moment (issue #3) is the payoff.
- **Profiler settings to switch on first** (gear icon in the Profiler tab):
  - ✅ *Record why each component rendered while profiling*
  - Optionally *Hide components where renders took less than 1 ms* to cut noise.

### Two deliberate setup choices
- **StrictMode is OFF** (`src/main.tsx`). It double-invokes renders in dev, which doubles commits and confuses the "why did this render?" story for newcomers. Re-enabling it afterwards — and explaining *why* React double-renders — is a great closing discussion.
- **`expensiveFormat()` / `computeStats()` carry deterministic busy-work** (`src/lib/expensiveFormat.ts`, `src/components/SummaryPanel.tsx`). It stands in for real per-render cost (currency formatting, report roll-ups) so wasted renders register as real milliseconds. If the jank is too mild/severe on the room's hardware, tune the `WORK` / loop constants.

---

## The 5 issues

### 🟢 Issue 1 — State lifted too high (laggy search)
- **Where:** `src/App.tsx` — `searchTerm` / `selectedCategory` live in `App`.
- **Profiler signal:** every keystroke commits `<SummaryPanel>` (and the table). `SummaryPanel` has a long self-time (see #4) yet has *nothing* to do with the search term.
- **Root cause:** the search state sits in the common parent of both the search box **and** the summary, so typing re-renders the summary.
- **Fix:** colocate the search/filter state. Extract a `<Catalog>` component that owns `searchTerm`, `selectedCategory`, the `SearchBar`, and the `ProductTable`. `App` then renders `<SummaryPanel/>` and `<Catalog/>` as siblings — typing no longer re-renders the summary.
- **Prove it:** record a keystroke → `SummaryPanel` no longer appears in the commit.

### 🟢 Issue 2 — Missing `React.memo` (one ♥ flashes the whole table)
- **Where:** `src/components/ProductRow.tsx`.
- **Profiler signal:** toggling one heart → all ~600 rows re-render (ranked chart full of rows, each a slice of ms).
- **Root cause:** `ProductRow` is a plain function, so it re-renders whenever `<ProductTable>` does.
- **Fix:** `export const ProductRow = React.memo(function ProductRow(...) { ... })`.
- **Catch:** on its own this **won't** fully work yet — see #3. That's intentional and is the lead-in to the best lesson of the day.

### 🟡 Issue 3 — Unstable prop defeats `memo` (rows *still* re-render)
- **Where:** `src/components/ProductTable.tsx` — `onToggle={() => onToggleWishlist(product.id)}`.
- **Profiler signal:** even with `React.memo`, rows re-render. "Why did this render?" → **props changed: `onToggle`**.
- **Root cause:** a brand-new arrow function is created for every row on every render, so memo's prop comparison always fails.
- **Fix:** give each row a **stable** handler. Cleanest: pass the stable `onToggleWishlist` down and let the row call it with its own id.
  - Wrap `toggleWishlist` in `useCallback(..., [])` (use the functional `setWishlist` updater so the dep array stays empty).
  - Change `ProductRow`'s prop to `onToggle: (id: number) => void` and call `onClick={() => onToggle(product.id)}` **inside** the memoized row — the function identity passed *to* the memo boundary is now stable.
- **Prove it (the payoff 🎉):** record a heart toggle → only the **one** clicked row re-renders; every other row is **grey/skipped**. This is the "measure, don't guess — and here's the proof" moment. Linger on it.

### 🟡 Issue 4 — Expensive compute in render (heavy summary)
- **Where:** `src/components/SummaryPanel.tsx` — `computeStats(products)` runs every render.
- **Profiler signal:** `<SummaryPanel>` dominates self-render time in each commit it appears in.
- **Root cause:** the heavy roll-up is recomputed on every render with no memoization. (Combined with #1, it ran on every keystroke.)
- **Fix:** `const stats = useMemo(() => computeStats(products), [products]);` Since `products` here is the stable full `PRODUCTS` reference, the work now runs once.
- **Prove it:** even when `SummaryPanel` does re-render, its self-time collapses to ~0 ms.
- **Stretch talking point:** fixing #1 *and* #4 are independent and compound — colocation stops it re-rendering on type; `useMemo` makes the render cheap when it *does* happen.

### 🔴 Issue 5 — Context consumed too broadly (theme flips re-render everything)
- **Where:** `src/theme/ThemeContext.tsx` (churning value) + `src/components/ProductRow.tsx` (every row calls `useTheme()` for the heart colour).
- **Profiler signal:** flip the theme → all ~600 rows re-render in one commit, just to change one accent colour.
- **Root cause:** every row subscribes to the theme context, and the provider hands out a fresh value object each render. A purely visual concern (colour) is being broadcast through React's render path to hundreds of components.
- **Fix (two complementary moves):**
  1. **Stop broadcasting colour through context.** The app already themes via CSS variables (`[data-theme]` in `styles.css`). Drive the heart colour the same way: replace the inline `style={{ color: accent }}` with a CSS class that reads `var(--accent)`, and remove `useTheme()` from `ProductRow`. Now flipping the theme re-renders **zero** rows — CSS handles it.
  2. **Memoize the provider value** (`const value = useMemo(() => ({ theme, accent, toggleTheme }), [theme, accent])`) and/or split theme state from setters. Good hygiene so unrelated provider re-renders don't churn consumers.
- **Prove it:** record a theme flip → the catalog rows are **grey/skipped**; only the toggle button and any genuine theme consumers re-render.
- **Discussion:** "context too broad" is an architecture smell. Narrow what subscribes, push static styling to CSS, and split high-churn state into its own context.

---

## Suggested timing (≈90 min)
| Segment | Time |
|---|---|
| Intro + Profiler primer (live demo of record/flamegraph/ranked) | 15 min |
| Issues 1–2 (easy wins, build confidence) | 20 min |
| Issue 3 (the memo "aha") — do this one together | 20 min |
| Issues 4–5 (harder, more independent) | 25 min |
| Wrap-up: re-enable StrictMode, discuss, Q&A | 10 min |

## Reset between groups
The starter is `main`. To wipe local experiments: `git checkout -- .` (or re-fork the sandbox).
