# 🛒 ShopFloor — React Profiler Hackathon

A deliberately **slow** e-commerce catalog admin. Your job: open the **React DevTools Profiler**, find out *why* it's slow, fix it, and **prove** each fix with the Profiler.

This isn't about guessing. The whole point is the loop:

> **measure → diagnose → fix → measure again**

There are **5 performance issues** hidden in here, ordered roughly easy → hard. See how many you can find and fix.

---

## Setup

### Option A — CodeSandbox (no install)
1. Open the sandbox link your facilitator shared (or import this repo: **codesandbox.io → Import → paste the GitHub URL**).
2. Click **Fork** to get your own copy.
3. The app runs automatically. Open the preview in its own window for profiling.

### Option B — Local
```bash
npm install
npm run dev
```
Then open the printed `http://localhost:5190` URL.

> **You need the React Developer Tools browser extension** (Chrome/Edge/Firefox). Install it, then open DevTools → you'll see a **⚛️ Profiler** tab.

---

## How to use the Profiler (60-second primer)

1. Open browser DevTools (`F12`) → **Profiler** tab.
2. Click the blue **● Record** circle.
3. Do **one** interaction in the app (type a letter, click a heart, flip the theme).
4. Click **● Stop**.
5. Read the result:
   - **Flamegraph** — what rendered in each commit, and how long.
   - **Ranked chart** — the same commit sorted slowest-first. Great for "what's expensive."
   - Click a component → the right panel shows **"Why did this render?"** (props changed / hook changed / parent rendered). Turn this on via the Profiler's **⚙️ settings → "Record why each component rendered"**.
   - The **commit timeline** (top) — each bar is one commit; grey = a component that *didn't* re-render (that's what you're aiming for).

💡 **Tip:** the settings gear also has **"Hide components where renders took less than [N] ms"** — handy for cutting noise.

---

## The 5 challenges

Profile each interaction below. The hint tells you *what to look for*, not the answer.

| # | Try this | It feels… | Hint: what is the Profiler telling you? |
|---|----------|-----------|------------------------------------------|
| 1 | Type in the **search box** | laggy per keystroke | Which components re-render on a keystroke that have *nothing to do* with search? |
| 2 | Click **one** wishlist ♥ | the whole table flashes | How many rows re-render when only one changed? |
| 3 | (After you try to fix #2) click a ♥ again | rows *still* re-render | Open "Why did this render?" on a row. What changed? |
| 4 | Type in search again, watch one card | sluggish, heavy | Which single component has a long *self* render time, every commit? |
| 5 | Flip the **theme** (🌙/☀️) | the entire catalog re-renders | How many components light up just to change a colour? Did they *need* to? |

For each: record → diagnose → fix → **record again and confirm the wasted renders are gone** (components go grey / commit times drop). That last step is the real win.

---

## Rules of thumb you'll (re)discover

- A component re-renders when its **parent** re-renders, its **props** change, its **state** changes, or a **context** it consumes changes.
- `React.memo` skips a re-render **only if props are referentially equal** — which is why inline `{}`, `[]`, and `() => {}` props quietly defeat it.
- `useMemo` / `useCallback` exist to keep those references **stable**.
- The cheapest re-render is the one that **doesn't happen**. Profile to know which those are.

Good luck — and remember to **measure, don't guess.** 🏁

*(Facilitators: the answer key lives in [`FACILITATOR.md`](./FACILITATOR.md) and on the `solutions` branch.)*
