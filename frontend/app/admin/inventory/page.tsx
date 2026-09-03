"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { inventoryService } from "@/services/inventory.service";
import { ApiError } from "@/lib/api-client";
import type { InventoryItem } from "@/types/dashboard";

export default function InventoryManagementPage() {
  const [inventory, setInventory] = useState<InventoryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    inventoryService
      .list()
      .then(setInventory)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load inventory."));
  }, []);

  const lowStockCount = inventory?.filter((i) => i.stock <= i.reorderAt).length ?? 0;

  return (
    <div>
      <h1 className="text-display-md text-ink">Inventory</h1>
      <p className="mt-2 text-sm text-ink-muted">
        {inventory === null ? "Loading..." : `${lowStockCount} items at or below reorder point.`}
      </p>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8">
        {inventory !== null && (
          <DataTable
            rows={inventory}
            rowKey={(i) => String(i.productId)}
            columns={[
              { header: "Product", render: (i) => i.name },
              { header: "SKU", render: (i) => <span className="text-ink-muted">{i.sku}</span> },
              { header: "In stock", render: (i) => i.stock },
              { header: "Reorder at", render: (i) => <span className="text-ink-muted">{i.reorderAt}</span> },
              {
                header: "Status",
                render: (i) => {
                  if (i.stock === 0) return <Badge tone="danger">Out of stock</Badge>;
                  if (i.stock <= i.reorderAt) return <Badge tone="warning">Reorder soon</Badge>;
                  return <Badge tone="accent">Healthy</Badge>;
                },
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
