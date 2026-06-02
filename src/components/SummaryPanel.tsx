import { useMemo } from "react";
import type { Product } from "../data/products";
import { expensiveFormat } from "../lib/expensiveFormat";

interface SummaryPanelProps {
  products: Product[];
}

interface Stats {
  totalValue: number;
  avgPrice: number;
  inStock: number;
  topCategory: string;
}

// A deliberately heavy aggregate — stands in for the kind of real reporting
// math (roll-ups, sorting, grouping) you find on dashboards. It costs a few
// milliseconds every time it runs.
function computeStats(products: Product[]): Stats {
  // Deterministic busy-work so the panel clearly dominates self-render time.
  let warmup = 0;
  for (let i = 0; i < 300_000; i++) {
    warmup = (warmup + i * 7) % 9973;
  }
  void warmup;

  const byCategory = new Map<string, number>();
  let totalValue = 0;
  let priceSum = 0;
  let inStock = 0;

  for (const p of products) {
    totalValue += p.price * p.stock;
    priceSum += p.price;
    if (p.stock > 0) inStock++;
    byCategory.set(p.category, (byCategory.get(p.category) ?? 0) + 1);
  }

  const topCategory =
    [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return {
    totalValue,
    avgPrice: products.length ? priceSum / products.length : 0,
    inStock,
    topCategory,
  };
}

export function SummaryPanel({ products }: SummaryPanelProps) {
  // ✅ FIX #4 (useMemo): the heavy aggregate is now memoized on `products`.
  // Since the full catalog reference is stable, computeStats() runs once instead
  // of on every render. Even when this component does re-render, its self-render
  // time collapses to ~0 ms in the Profiler.
  const stats = useMemo(() => computeStats(products), [products]);

  return (
    <section className="summary-panel" aria-label="Catalog summary">
      <Stat label="Inventory value" value={expensiveFormat(stats.totalValue)} />
      <Stat label="Avg. price" value={expensiveFormat(Math.round(stats.avgPrice))} />
      <Stat label="In stock" value={`${stats.inStock} / ${products.length}`} />
      <Stat label="Top category" value={stats.topCategory} />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
