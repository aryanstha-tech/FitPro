import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/Badge";

interface ProductCardProps {
  id: number;
  slug: string;
  name: string;
  price: string;
  category: string;
  image: string;
  inStock: boolean;
}

export function ProductCard({ slug, name, price, category, image, inStock }: ProductCardProps) {
  return (
    <Link
      href={`/shop/${slug}`}
      className="group block overflow-hidden rounded-card border border-base-border bg-base-surface transition-colors hover:border-ink/20"
    >
      <div className="relative aspect-square overflow-hidden bg-base-raised">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />
        {!inStock && (
          <div className="absolute inset-x-3 top-3">
            <Badge tone="neutral">Out of stock</Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-ink-faint">{category}</span>
        <h3 className="mt-1 text-sm font-medium text-ink">{name}</h3>
        <span className="mt-2 block text-sm text-accent">${price}</span>
      </div>
    </Link>
  );
}
