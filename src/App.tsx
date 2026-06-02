import { useState } from "react";
import { PRODUCTS } from "./data/products";
import { useTheme } from "./theme/ThemeContext";
import { SearchBar } from "./components/SearchBar";
import { CategoryFilter, type CategoryChoice } from "./components/CategoryFilter";
import { ProductTable } from "./components/ProductTable";
import { SummaryPanel } from "./components/SummaryPanel";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  // 🐞 ISSUE #1 (state lifted too high):
  // `searchTerm` and `selectedCategory` live up here in App, the common parent
  // of BOTH the search box and the <SummaryPanel>. So every keystroke re-renders
  // App, which re-renders <SummaryPanel> — even though the summary describes the
  // whole catalog and couldn't care less about the search term. Profile a few
  // keystrokes and watch <SummaryPanel> (issue #4) light up on every one.
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryChoice>("All");
  const [wishlist, setWishlist] = useState<Set<number>>(() => new Set());

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = PRODUCTS.filter(
    (p) =>
      (selectedCategory === "All" || p.category === selectedCategory) &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="app" data-theme={theme}>
      <header className="app-header">
        <h1>ShopFloor</h1>
        <span className="subtitle">Catalog admin</span>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>

      <SummaryPanel products={PRODUCTS} />

      <section className="catalog">
        <div className="catalog-controls">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>
        <ProductTable
          products={filtered}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
        />
      </section>
    </div>
  );
}
