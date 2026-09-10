"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { CartItem } from "@/components/shop/CartItem";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useCart } from "@/lib/cart-context";
import { orderService } from "@/services/order.service";
import { ApiError } from "@/lib/api-client";

function CartContent() {
  const { lines, updateQuantity, removeItem, clear, total } = useCart();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [idempotencyKey] = useState(() => crypto.randomUUID());

  async function placeOrder() {
    setPlacing(true);
    setError(null);
    try {
      const order = await orderService.create({
        items: lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
        idempotencyKey,
      });
      clear();
      router.push(`/dashboard/orders?placed=${order.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't place your order.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="pb-24 pt-36">
      <Container className="max-w-2xl">
        <h1 className="text-display-md text-ink">Your cart</h1>

        {lines.length === 0 ? (
          <p className="mt-6 text-sm text-ink-muted">Your cart is empty.</p>
        ) : (
          <>
            <div className="mt-8">
              {lines.map((line) => (
                <CartItem
                  key={line.productId}
                  name={line.name}
                  price={line.price}
                  image={line.image}
                  quantity={line.quantity}
                  onQuantityChange={(next) => updateQuantity(line.productId, next)}
                  onRemove={() => removeItem(line.productId)}
                />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-base-border pt-6">
              <span className="text-sm text-ink-muted">Total</span>
              <span className="text-lg font-semibold text-ink">${total.toFixed(2)}</span>
            </div>

            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

            <Button size="lg" className="mt-6 w-full" disabled={placing} onClick={placeOrder}>
              {placing ? "Placing order..." : "Place order"}
            </Button>
          </>
        )}
      </Container>
    </div>
  );
}

export default function CartPage() {
  return (
    <RequireAuth requiredRole="member">
      <CartContent />
    </RequireAuth>
  );
}