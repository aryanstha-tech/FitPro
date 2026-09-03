"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";

interface CartItemProps {
  name: string;
  price: number;
  image: string;
  quantity: number;
  onQuantityChange: (next: number) => void;
  onRemove: () => void;
}

export function CartItem({
  name,
  price,
  image,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex items-center gap-4 border-b border-base-border py-4 last:border-0">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-control bg-base-raised">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      <div className="flex-1">
        <h4 className="text-sm font-medium text-ink">{name}</h4>
        <span className="text-sm text-ink-muted">${price}</span>
      </div>

      <div className="flex items-center gap-2 rounded-control border border-base-border px-2 py-1">
        <button
          aria-label="Decrease quantity"
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="text-ink-muted hover:text-ink"
        >
          <Minus size={14} />
        </button>
        <span className="w-5 text-center text-sm">{quantity}</span>
        <button
          aria-label="Increase quantity"
          onClick={() => onQuantityChange(quantity + 1)}
          className="text-ink-muted hover:text-ink"
        >
          <Plus size={14} />
        </button>
      </div>

      <button aria-label="Remove item" onClick={onRemove} className="text-ink-faint hover:text-red-400">
        <X size={16} />
      </button>
    </div>
  );
}
