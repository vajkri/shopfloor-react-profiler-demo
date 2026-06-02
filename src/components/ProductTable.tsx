import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { Product } from "../data/products";
import { ProductRow } from "./ProductRow";

interface ProductTableProps {
  products: Product[];
  wishlist: Set<number>;
  onToggleWishlist: (id: number) => void;
}

const columnHelper = createColumnHelper<Product>();

// TanStack Table is *headless*: it models columns/rows but renders nothing
// itself. We use it for the header definitions and the core row model, then
// render each body row with our own <ProductRow>. That's deliberate — it
// mirrors a real e-commerce table while keeping the row-level render behaviour
// (and its bugs) fully in our hands.
const columns = [
  columnHelper.accessor("sku", { header: "SKU" }),
  columnHelper.accessor("name", { header: "Product" }),
  columnHelper.accessor("category", { header: "Category" }),
  columnHelper.accessor("price", { header: "Price" }),
  columnHelper.accessor("stock", { header: "Stock" }),
  columnHelper.accessor("rating", { header: "Rating" }),
  columnHelper.display({ id: "wishlist", header: "♥" }),
];

export function ProductTable({
  products,
  wishlist,
  onToggleWishlist,
}: ProductTableProps) {
  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="table-wrap">
      <div className="table-meta">{products.length} products</div>
      <table className="product-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const product = row.original;
            return (
              <ProductRow
                key={product.id}
                product={product}
                isWishlisted={wishlist.has(product.id)}
                // ✅ FIX #3: pass the STABLE callback straight through. The row
                // closes over its own id internally, so the prop identity that
                // crosses the memo boundary no longer changes every render.
                onToggle={onToggleWishlist}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
