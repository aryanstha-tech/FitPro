import { Container } from "@/components/layout/Container";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { productService } from "@/services/product.service";
import type { Product as MockProduct } from "@/lib/mock-data";

export const metadata = { title: "Shop — FitPro" };
export const dynamic = "force-dynamic"; // live data — don't prerender at build time

export default async function ShopPage() {
  const products = await productService.list();

  // ProductGrid/ProductCard expect the mock-data Product shape (price as
  // a number, id as a string) — adapt the wire shape at the boundary.
  const adapted: MockProduct[] = products.map((p) => ({
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    price: Number(p.price),
    category: p.category,
    image: p.image,
    description: p.description,
    inStock: p.inStock,
  }));

  return (
    <div className="pb-24 pt-36">
      <Container>
        <div className="max-w-lg">
          <h1 className="text-display-md md:text-display-lg text-ink">Shop</h1>
          <p className="mt-4 text-ink-muted">
            Apparel, equipment and nutrition — picked by our coaches.
          </p>
        </div>

        <div className="mt-14">
          <ProductGrid products={adapted} />
        </div>
      </Container>
    </div>
  );
}
