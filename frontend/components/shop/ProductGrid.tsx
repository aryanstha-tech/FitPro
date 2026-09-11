"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

const categories = [
  "All",
  "Apparel",
  "Equipment",
  "Nutrition",
  "Accessories",
];

export function ProductGrid({ products }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") {
      return products;
    }

    return products.filter(
      (product) => product.category === selectedCategory
    );
  }, [products, selectedCategory]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map((category) => {
          const active = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                active
                  ? "border-accent bg-accent text-white"
                  : "border-base-border bg-base-surface text-ink-muted hover:border-accent hover:text-ink"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {filteredProducts.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-muted">
          No products found in this category.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}