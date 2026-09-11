import { Container } from "@/components/layout/Container";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { productService } from "@/services/product.service";

export const metadata = { title: "Shop — FitPro" };
export const dynamic = "force-dynamic"; // live data — don't prerender at build time

export default async function ShopPage() {
  const products = await productService.list();

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
          <ProductGrid products={products} />
        </div>
      </Container>
    </div>
  );
}
