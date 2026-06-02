import { memo } from "react";
import type { Product } from "../data/products";
import { expensiveFormat, ratingStars } from "../lib/expensiveFormat";
import { useTheme } from "../theme/ThemeContext";

interface ProductRowProps {
  product: Product;
  isWishlisted: boolean;
  // ✅ FIX #3: receives the STABLE callback and supplies its own id, so the prop
  // crossing the memo boundary keeps the same identity across renders.
  onToggle: (id: number) => void;
}

// ✅ FIX #2 + #3: memo + a stable onToggle prop now work together. Toggle one
// heart and the Profiler shows only the clicked row re-render — every other row
// is greyed out / skipped. That's the "measure, don't guess — here's the proof"
// payoff.
//
// 🐞 ISSUE #5 (broad context) still lands here: this row calls useTheme() purely
// to colour the heart, so flipping the theme re-renders every row. (Fixed later.)
function ProductRowImpl({ product, isWishlisted, onToggle }: ProductRowProps) {
  const { accent } = useTheme();

  return (
    <tr>
      <td className="cell-sku">{product.sku}</td>
      <td>{product.name}</td>
      <td>{product.category}</td>
      <td className="cell-num">{expensiveFormat(product.price)}</td>
      <td className="cell-num">{product.stock}</td>
      <td className="cell-rating" title={product.rating.toFixed(1)}>
        {ratingStars(product.rating)}
      </td>
      <td>
        <button
          className="wishlist-btn"
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          style={{ color: isWishlisted ? accent : "var(--muted)" }}
          onClick={() => onToggle(product.id)}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>
      </td>
    </tr>
  );
}

export const ProductRow = memo(ProductRowImpl);
