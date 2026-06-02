import { useCallback, useState } from "react";
import { PRODUCTS } from "../data/products";
import { SearchBar } from "./SearchBar";
import { CategoryFilter, type CategoryChoice } from "./CategoryFilter";
import { ProductTable } from "./ProductTable";

// ✅ FIX #1 (colocation): all the table-related state — search term, category,
// wishlist — now lives HERE, next to the only components that use it. Typing in
// the search box re-renders <Catalog> and its table (which genuinely need to
// update) but no longer re-renders App or its sibling <SummaryPanel>.
export function Catalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryChoice>("All");
  const [wishlist, setWishlist] = useState<Set<number>>(() => new Set());

  // ✅ FIX #3 (stable callback): useCallback with an empty dep array gives every
  // render the SAME function identity. The functional `setWishlist` updater is
  // what lets the deps stay empty (we never read `wishlist` directly here).
  const toggleWishlist = useCallback((id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const filtered = PRODUCTS.filter(
    (p) =>
      (selectedCategory === "All" || p.category === selectedCategory) &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
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
  );
}
