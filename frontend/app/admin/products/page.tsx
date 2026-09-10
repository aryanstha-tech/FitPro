"use client";

import { FormEvent, useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { productService } from "@/services/product.service";
import { ApiError } from "@/lib/api-client";
import type { Product } from "@/types/product";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductManagementPage() {
 const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function loadProducts() {
  productService
    .list()
    .then(setProducts)
    .catch((err) =>
      setError(err instanceof ApiError ? err.message : "Couldn't load products.")
    );
}

  useEffect(loadProducts, []);

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name"));

    try {
      await productService.create({
        slug: slugify(name),
        name,
        price: String(form.get("price")),
        category: String(form.get("category")),
        image: String(form.get("image") || "/products/placeholder.jpg"),
        description: String(form.get("description")),
      });
      setShowAdd(false);
      loadProducts();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't create product.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-display-md text-ink">Products</h1>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          Add product
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8">
        {products === null && !error ? (
          <p className="text-sm text-ink-muted">Loading...</p>
        ) : (
          <DataTable
            rows={products ?? []}
            rowKey={(p) => p.id}
            columns={[
              { header: "Name", render: (p) => p.name },
              { header: "Category", render: (p) => <span className="text-ink-muted">{p.category}</span> },
              { header: "Price", render: (p) => `$${p.price}` },
              {
                header: "Status",
                render: (p) => (
                  <Badge tone={p.inStock ? "accent" : "neutral"}>
                    {p.inStock ? "In stock" : "Out of stock"}
                  </Badge>
                ),
              },
            ]}
          />
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add product">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <Input label="Name" name="name" required />
          <Input label="Price" name="price" type="number" min="0" step="0.01" required />
          <Input label="Category" name="category" required />
          <Input label="Image path" name="image" placeholder="/products/example.jpg" />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm text-ink-muted">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              className="rounded-control border border-base-border bg-base-raised px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
            />
          </div>
          <p className="text-xs text-ink-faint">
            New products start at 0 stock — set real stock afterward from the Inventory page.
          </p>
          {formError && <span className="text-sm text-red-400">{formError}</span>}
          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? "Creating..." : "Create product"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
