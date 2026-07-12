import { NextResponse } from "next/server";
import { PrismaClient, PaymentStatus } from "@prisma/client";
import {
  findNGeniusOrder,
  isPaymentFailed,
  isPaymentSucceeded,
  primaryPayment,
} from "@/lib/ngenius/find-order";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Client-facing polling endpoint used by /checkout/processing.
 *
 * Two truth sources exist:
 *   1. Our Subscriber row — flipped to `paid`/`failed` by the webhook.
 *   2. N-Genius API — canonical state, always up to date.
 *
 * If the webhook has already arrived, (1) is authoritative and cheap.
 * If it hasn't (delayed, dropped, or dev without a tunnel), we call (2) with
 * the stored `paymentRef` (= N-Genius orderReference) and reconcile. This is
 * the "polling backup" from the integration plan — recovers a lost webhook
 * without user intervention.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const order = url.searchParams.get("order")?.trim();
  if (!order) {
    return NextResponse.json({ error: "missing_order" }, { status: 400 });
  }

  const subscriber = await prisma.subscriber.findUnique({
    where: { id: order },
    select: {
      id: true,
      paymentStatus: true,
      paymentRef: true,
      failReason: true,
      paidAt: true,
    },
  }).catch(() => null);

  if (!subscriber) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Already resolved — return DB truth as-is.
  if (subscriber.paymentStatus !== "pending") {
    return NextResponse.json({
      order: subscriber.id,
      status: subscriber.paymentStatus,
      failReason: subscriber.failReason ?? null,
      paidAt: subscriber.paidAt?.toISOString() ?? null,
    });
  }

  const debug = url.searchParams.get("debug") === "1";
  let pollErr: string | null = null;
  let pollState: string | null = null;

  // Still pending but we have an N-Genius orderReference — ask N-Genius directly.
  if (subscriber.paymentRef) {
    try {
      const trueOrder = await findNGeniusOrder(subscriber.paymentRef);
      const payment = primaryPayment(trueOrder);
      const state = payment?.state;
      pollState = state ?? "no-state";

      if (isPaymentSucceeded(state)) {
        const paidAt = new Date();
        await prisma.subscriber.update({
          where: { id: subscriber.id },
          data: {
            paymentStatus: PaymentStatus.paid,
            paidAt,
            failReason: null,
          },
        });
        return NextResponse.json({
          order: subscriber.id,
          status: "paid",
          failReason: null,
          paidAt: paidAt.toISOString(),
        });
      }

      if (isPaymentFailed(state)) {
        const failReason = payment?.authResponse?.resultCode ?? state ?? "unknown";
        await prisma.subscriber.update({
          where: { id: subscriber.id },
          data: {
            paymentStatus: PaymentStatus.failed,
            failReason,
          },
        });
        return NextResponse.json({
          order: subscriber.id,
          status: "failed",
          failReason,
          paidAt: null,
        });
      }
      // Otherwise still in-flight (STARTED / AUTHORISED-pending-capture) — fall through.
    } catch (err) {
      pollErr = err instanceof Error ? err.message : String(err);
      console.error("[checkout/status] N-Genius poll failed:", pollErr);
    }
  }

  return NextResponse.json({
    order: subscriber.id,
    status: "pending",
    failReason: null,
    paidAt: null,
    ...(debug ? { _debug: { pollErr, pollState, paymentRef: subscriber.paymentRef } } : {}),
  });
}
