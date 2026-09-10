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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
   const image = form.get("image");

   if (!(image instanceof File) || image.size === 0) {
     setFormError("Please select a product image.");
     setSubmitting(false);
     return;
}

form.set("slug", slugify(name));

try {
  await productService.create(form);
      setShowAdd(false);
      setImagePreview(null);
      e.currentTarget.reset();
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
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-sm text-ink-muted">
              Category
            </label>

            <select
              id="category"
              name="category"
              required
              defaultValue=""
              className="rounded-control border border-base-border bg-base-raised px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="Apparel">Apparel</option>
              <option value="Equipment">Equipment</option>
              <option value="Nutrition">Nutrition</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
  <label htmlFor="product-image" className="text-sm text-ink-muted">
    Product Image
  </label>

  <input
    id="product-image"
    name="image"
    type="file"
    accept="image/*"
    required
    onChange={(e) => {
      const file = e.target.files?.[0];

      if (!file) {
        setImagePreview(null);
        return;
      }

      setImagePreview(URL.createObjectURL(file));
    }}
    className="text-sm text-ink-muted file:mr-4 file:rounded-control file:border-0 file:bg-base-raised file:px-4 file:py-2 file:text-sm file:text-ink"
  />

  {imagePreview && (
    <div className="mt-2 overflow-hidden rounded-card border border-base-border">
      <img
        src={imagePreview}
        alt="Product preview"
        className="h-48 w-full object-cover"
      />
    </div>
  )}
</div>
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
