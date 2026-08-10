import { NextResponse } from "next/server";
import { PrismaClient, PaymentStatus } from "@prisma/client";
import { authoriseOrder, captureOrder, getOrder } from "@/lib/tamara/orders";
import { verifyTamaraToken } from "@/lib/tamara/webhook-token";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const prisma = new PrismaClient();

const NOTIFICATION_TOKEN = process.env.TAMARA_NOTIFICATION_TOKEN ?? "";

/**
 * Tamara webhook receiver.
 *
 * SECURITY MODEL — two independent checks, because they answer different questions:
 *   1. The `tamaraToken` is a JWT signed HS256 with our notification secret. Verifying it
 *      proves the caller is Tamara. Anyone can POST this URL; only Tamara can sign.
 *   2. We then ask Tamara what the order's status actually is. The signature says who is
 *      speaking, not whether the body still matches reality by the time we read it, and
 *      the body is what would otherwise decide whether someone is marked as paid.
 *
 * IDEMPOTENCY: `WebhookEvent.providerEventId` is unique, so a redelivery — Tamara's or an
 * attacker's replay of a captured request — is written once and processed once.
 */

type TamaraWebhookBody = {
  order_id?: string;
  order_reference_id?: string;
  order_number?: string;
  event_type?: string;
  data?: unknown;
};

/** Header or query string — the docs send it either way. */
function extractToken(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return new URL(req.url).searchParams.get("tamaraToken");
}

/** Tamara's order status → what our Subscriber column means. */
function statusToPaymentStatus(status: string): PaymentStatus | null {
  const s = status.toLowerCase();
  if (s === "fully_captured" || s === "partially_captured" || s === "authorised") {
    return PaymentStatus.paid;
  }
  if (s === "declined" || s === "expired") return PaymentStatus.failed;
  if (s === "canceled" || s === "cancelled") return PaymentStatus.abandoned;
  if (s === "fully_refunded" || s === "partially_refunded") return PaymentStatus.refunded;
  return null; // "new" / "approved" — not yet an outcome we record
}

export async function POST(req: Request) {
  const token = extractToken(req);
  if (!token) return new NextResponse("unauthorized", { status: 401 });

  const verdict = verifyTamaraToken(token, NOTIFICATION_TOKEN);
  if (!verdict.ok) {
    console.error("tamara webhook: rejected —", verdict.reason);
    return new NextResponse("unauthorized", { status: 401 });
  }

  const rawText = await req.text();
  let body: TamaraWebhookBody;
  try {
    body = JSON.parse(rawText) as TamaraWebhookBody;
  } catch {
    return new NextResponse("bad-request", { status: 400 });
  }

  const orderId = body.order_id;
  const eventType = body.event_type ?? "unknown";
  if (!orderId) return new NextResponse("bad-request", { status: 400 });

  // Dedup gate. A duplicate delivery is a success, not an error — answering 200 stops
  // Tamara retrying something we have already done.
  const eventId = `${orderId}::${eventType}`;
  try {
    await prisma.webhookEvent.create({
      data: {
        provider: "tamara",
        providerEventId: eventId,
        eventType,
        payload: JSON.parse(rawText) as object,
        signature: token.slice(0, 200),
      },
    });
  } catch {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  // Never trust the body for the outcome — ask Tamara.
  let order;
  try {
    order = await getOrder(orderId);
  } catch (err) {
    console.error("tamara webhook: order lookup failed", err);
    // 500 so Tamara retries; the event row stays unprocessed for the next delivery.
    await prisma.webhookEvent
      .delete({ where: { providerEventId: eventId } })
      .catch(() => { /* leave the row; a retry will dedupe on it */ });
    return new NextResponse("lookup-failed", { status: 500 });
  }

  // `order_reference_id` is the Subscriber id we sent when creating the session.
  const subscriberId = order.order_reference_id || body.order_reference_id;

  // An approved order is a promise, not money. Authorise it, then capture — unless the
  // account is set to auto-capture, in which case authorising already did it.
  if (eventType === "order_approved" || order.status.toLowerCase() === "approved") {
    try {
      const auth = await authoriseOrder(orderId);
      if (!auth.auto_captured) {
        await captureOrder(orderId, order.total_amount, new Date());
      }
    } catch (err) {
      console.error("tamara webhook: authorise/capture failed", err);
      await prisma.webhookEvent
        .delete({ where: { providerEventId: eventId } })
        .catch(() => { /* next delivery retries */ });
      return new NextResponse("capture-failed", { status: 500 });
    }
  }

  // Re-read: authorise/capture just changed the status we are about to record.
  const finalStatus = await getOrder(orderId)
    .then((o) => o.status)
    .catch(() => order.status);
  const paymentStatus = statusToPaymentStatus(finalStatus);

  if (subscriberId && paymentStatus) {
    await prisma.subscriber
      .update({
        where: { id: subscriberId },
        data: {
          paymentStatus,
          paymentRef: orderId,
          paidAt: paymentStatus === PaymentStatus.paid ? new Date() : undefined,
          failReason: paymentStatus === PaymentStatus.paid ? null : finalStatus,
        },
      })
      .catch((err) => console.error("tamara webhook: subscriber update failed", err));
  }

  await prisma.webhookEvent
    .update({
      where: { providerEventId: eventId },
      data: { processed: true, processedAt: new Date() },
    })
    .catch(() => { /* the work is done; bookkeeping failure must not retrigger it */ });

  return NextResponse.json({ ok: true, status: finalStatus });
}
