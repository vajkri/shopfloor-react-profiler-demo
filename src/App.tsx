import { PRODUCTS } from "./data/products";
import { useTheme } from "./theme/ThemeContext";
import { SummaryPanel } from "./components/SummaryPanel";
import { Catalog } from "./components/Catalog";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  // ✅ FIX #1 (colocation): App no longer owns the search/filter/wishlist state —
  // it moved down into <Catalog>. App now only re-renders on a theme change, so
  // typing in the search box can't re-render <SummaryPanel> any more.
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
      <Catalog />
    </div>
  );
}
