/**
 * Deterministic, seeded product catalog generator.
 *
 * Everyone who opens the app profiles the SAME data, so timings are comparable
 * across machines and across the before/after of each fix. No `faker`, no
 * `Math.random()` — just a tiny seeded PRNG.
 */

export interface Product {
  id: number;
  sku: string;
  name: string;
  category: Category;
  price: number; // in DKK
  stock: number;
  rating: number; // 0..5, one decimal
}

export const CATEGORIES = [
  "Skincare",
  "Makeup",
  "Fragrance",
  "Hair",
  "Bath & Body",
  "Wellness",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** mulberry32 — small, fast, deterministic PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ADJECTIVES = [
  "Hydrating",
  "Radiance",
  "Velvet",
  "Pure",
  "Botanical",
  "Daily",
  "Intense",
  "Gentle",
  "Nordic",
  "Glow",
  "Repair",
  "Silk",
];

const NOUNS: Record<Category, string[]> = {
  Skincare: ["Serum", "Moisturizer", "Cleanser", "Eye Cream", "Toner"],
  Makeup: ["Foundation", "Lipstick", "Mascara", "Blush", "Concealer"],
  Fragrance: ["Eau de Parfum", "Body Mist", "Cologne", "Roll-On"],
  Hair: ["Shampoo", "Conditioner", "Hair Oil", "Dry Shampoo", "Mask"],
  "Bath & Body": ["Shower Gel", "Body Lotion", "Hand Cream", "Bath Salt"],
  Wellness: ["Vitamin C", "Omega-3", "Magnesium", "Probiotic", "Collagen"],
};

/** Generate a stable catalog. `count` defaults to 600. */
export function generateProducts(count = 600): Product[] {
  const rand = mulberry32(0xc0ffee);
  const products: Product[] = [];

  for (let id = 1; id <= count; id++) {
    const category = CATEGORIES[Math.floor(rand() * CATEGORIES.length)];
    const adj = ADJECTIVES[Math.floor(rand() * ADJECTIVES.length)];
    const noun = NOUNS[category][Math.floor(rand() * NOUNS[category].length)];

    products.push({
      id,
      sku: `SF-${String(id).padStart(4, "0")}`,
      name: `${adj} ${noun}`,
      category,
      price: 39 + Math.floor(rand() * 60) * 10, // 39..639 DKK
      stock: Math.floor(rand() * 250),
      rating: Math.round((2.5 + rand() * 2.5) * 10) / 10, // 2.5..5.0
    });
  }

  return products;
}

/** The single shared catalog instance. */
export const PRODUCTS: Product[] = generateProducts();
