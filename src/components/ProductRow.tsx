import { memo } from "react";
import type { Product } from "../data/products";
import { expensiveFormat, ratingStars } from "../lib/expensiveFormat";
import { useTheme } from "../theme/ThemeContext";

interface ProductRowProps {
  product: Product;
  isWishlisted: boolean;
  onToggle: () => void;
}

// ✅ FIX #2 (React.memo): wrapping the row in memo lets React SKIP re-rendering
// it when its props are unchanged. Toggling one heart should now re-render only
// the row that changed.
//
// 🐞 ISSUE #3 (unstable prop) still bites though: <ProductTable> hands every row
// a brand-new `onToggle` arrow on each render, so memo's prop comparison fails
// and the rows re-render anyway. "Why did this render?" → props changed:
// onToggle. (Fixed in the next commit.)
//
// 🐞 ISSUE #5 (broad context) also still lands here: this row calls useTheme()
// purely to colour the heart, so flipping the theme re-renders every row.
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
          onClick={onToggle}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>
      </td>
    </tr>
  );
}

export const ProductRow = memo(ProductRowImpl);
