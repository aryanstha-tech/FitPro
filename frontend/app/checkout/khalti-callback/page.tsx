"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { orderService } from "@/services/order.service";
import { useCart } from "@/lib/cart-context";
import { ApiError } from "@/lib/api-client";
import type { Order } from "@/types/order";

function KhaltiCallbackContent() {
    const params = useSearchParams();
    const { clear } = useCart();
    const [order, setOrder] = useState<Order | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // purchase_order_id is what we set to str(order.id) when calling
        // Khalti's /epayment/initiate/ — it comes back unchanged in the
        // redirect. We deliberately ignore Khalti's own `status` query param
        // here: per Khalti's docs, only a server-side lookup (verifyPayment,
        // which calls verify_order_payment on the backend) is trustworthy.
        const orderId = params.get("purchase_order_id");
        if (!orderId) {
            setError("Missing order reference from the payment redirect.");
            return;
        }
        orderService
            .verifyPayment(Number(orderId))
            .then((result) => {
                setOrder(result);
                if (result.status === "paid") clear(); // only now do we know it was really paid
            })
            .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't verify payment."));
    }, [params]);

    if (error) {
        return (
            <>
                <h1 className="text-display-md text-ink">Payment couldn&apos;t be verified</h1>
                <p className="mt-2 text-sm text-red-400">{error}</p>
                <Link href="/cart" className="mt-6 inline-block text-sm text-accent hover:underline">
                    Back to cart
                </Link>
            </>
        );
    }

    if (!order) {
        return <p className="text-sm text-ink-muted">Confirming your payment...</p>;
    }

    if (order.status === "paid") {
        return order.packageName ? (
            <>
                <h1 className="text-display-md text-ink">Payment successful</h1>
                <p className="mt-2 text-sm text-ink-muted">Your {order.packageName} membership is now active.</p>
                <Link href="/dashboard/membership" className="mt-6 inline-block text-sm text-accent hover:underline">
                    View your membership
                </Link>
            </>
        ) : (
            <>
                <h1 className="text-display-md text-ink">Payment successful</h1>
                <p className="mt-2 text-sm text-ink-muted">Order #{order.id} is confirmed.</p>
                <Link href="/dashboard/orders" className="mt-6 inline-block text-sm text-accent hover:underline">
                    View your orders
                </Link>
            </>
        );
    }

    // Anything else here means verify_order_payment's fallback ran:
    // status was Pending/Expired/User canceled at Khalti. For a product
    // order the backend already released the reserved stock; for a
    // membership order, nothing was ever activated in the first place.
    return (
        <>
            <h1 className="text-display-md text-ink">Payment didn&apos;t complete</h1>
            <p className="mt-2 text-sm text-ink-muted">
                You weren&apos;t charged
                {order.packageName ? " and your membership wasn't changed" : ", and your cart is unchanged"} — you
                can try again whenever you&apos;re ready.
            </p>
            <Link
                href={order.packageName ? "/membership" : "/cart"}
                className="mt-6 inline-block text-sm text-accent hover:underline"
            >
                {order.packageName ? "Back to membership plans" : "Back to cart"}
            </Link>
        </>
    );
}

export default function KhaltiCallbackPage() {
    return (
        <RequireAuth requiredRole="member">
            <div className="pb-24 pt-36">
                <Container className="max-w-lg">
                    <Suspense fallback={<p className="text-sm text-ink-muted">Loading...</p>}>
                        <KhaltiCallbackContent />
                    </Suspense>
                </Container>
            </div>
        </RequireAuth>
    );
}