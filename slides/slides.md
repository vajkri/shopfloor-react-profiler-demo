---
marp: true
theme: default
paginate: true
header: 'React Profiler · Knowledge Sharing'
---

<!-- _class: invert lead -->
<!-- _paginate: false -->
<!-- _header: '' -->

# The React Profiler

### Find what's slow. Prove what's fast.

Knowledge sharing → hands-on hackathon

---

# What it helps you find & fix

- ⌨️ **Typing feels laggy** — every keystroke re-renders the world
- 💥 **Small click → whole page re-renders**
- 🔁 **A component re-renders for no reason**
- ✅ **Proving an optimization actually worked**

> Measure, don't guess.

---

# What the Profiler is

## A **render recorder**.

It answers three questions:

- **What** rendered
- **Why** it rendered
- **How long** it took

---

# Two tabs, two jobs

Both come from the **React DevTools** extension:

- 📷 **Components** = a *photo* — the tree, props / state / hooks, this exact instant
- 🎥 **Profiler** = a *video + stopwatch* — what happened over time

⚠️ Not the same as Chrome's built-in **Performance** tab (that's lower-level and not React-aware).

---

# Reading a recording

1. **Commits bar** — each bar = one commit *(tall + yellow = slow)*
2. **Flame graph** — component hierarchy; bar width = render time
3. **Ranked chart** — same commit, slowest first
4. **"Why did this render?"** — props / hooks / parent rendered

---

# Don't panic when…

- **StrictMode double-renders** in dev → render counts look doubled (expected)
- **Dev build is slower than prod** → treat the numbers as **relative**, not absolute
- The Profiler needs a **dev / profiling build** to work at all

---

<!-- _class: invert lead -->

# Your turn: Hunt → Fix → Prove

1. 🎯 **Hunt** — find the worst offender
2. 🔧 **Fix** — apply one change
3. 🏆 **Prove** — re-record, show before / after

🔗 Sandbox link → *[drop in chat]*
