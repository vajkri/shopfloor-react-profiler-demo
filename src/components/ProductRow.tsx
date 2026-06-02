import type { Product } from "../data/products";
import { expensiveFormat, ratingStars } from "../lib/expensiveFormat";
import { useTheme } from "../theme/ThemeContext";

interface ProductRowProps {
  product: Product;
  isWishlisted: boolean;
  onToggle: () => void;
}

// 🐞 ISSUE #2 (missing React.memo):
// This component is a plain function, so it re-renders every single time its
// parent (<ProductTable>) renders — even when this row's own data hasn't
// changed. Toggle ONE wishlist heart and the Profiler's ranked chart shows all
// ~600 rows re-rendering. Each does a little expensiveFormat() work, so the
// wasted time is real and visible.
//
// 🐞 ISSUE #3 (unstable prop) is the *sequel*: wrap this in React.memo and the
// rows STILL re-render, because <ProductTable> hands every row a brand-new
// `onToggle` arrow function on each render. The Profiler's "Why did this
// render?" panel will say: props changed → onToggle.
//
// 🐞 ISSUE #5 (broad context) also lands here: this row calls useTheme() purely
// to colour the heart, so flipping the theme re-renders the entire catalog.
export function ProductRow({ product, isWishlisted, onToggle }: ProductRowProps) {
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
