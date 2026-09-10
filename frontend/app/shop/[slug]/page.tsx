import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { productService } from "@/services/product.service";
import { ApiError } from "@/lib/api-client";

interface ProductPageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic"; // live data — don't prerender at build time

export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const product = await productService.bySlug(params.slug);
    return { title: `${product.name} — FitPro` };
  } catch {
    return { title: "Product — FitPro" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product;
  try {
    product = await productService.bySlug(params.slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const price = Number(product.price);

  return (
    <div className="pb-24 pt-36">
      <Container className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-card bg-base-raised">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>

        <div>
          <span className="text-xs text-ink-faint">{product.category}</span>
          <h1 className="mt-2 text-display-md text-ink">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xl text-accent">${price}</span>
            <Badge tone={product.inStock ? "accent" : "neutral"}>
              {product.inStock ? "In stock" : "Out of stock"}
            </Badge>
          </div>
          <p className="mt-6 max-w-md text-sm text-ink-muted">{product.description}</p>
          <AddToCartButton product={product} />
        </div>
      </Container>
    </div>
  );
}