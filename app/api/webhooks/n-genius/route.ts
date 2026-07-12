import { NextResponse } from "next/server";
import { PrismaClient, PaymentStatus } from "@prisma/client";
import { findNGeniusOrder, primaryPayment, isPaymentSucceeded, isPaymentFailed } from "@/lib/ngenius/find-order";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const prisma = new PrismaClient();

/**
 * N-Genius webhook receiver.
 *
 * SECURITY MODEL (per N-Genius docs — they do NOT sign webhooks with HMAC):
 *   1. First line of defence: exact-match on our custom secret header. The
 *      merchant configures both sides via portal + env — a leak = a rotate.
 *   2. Second line of defence: findOrder() — we NEVER trust the webhook body
 *      alone. We call N-Genius back and confirm the true state before touching
 *      the Subscriber row. If the API says "still pending" but the webhook
 *      claims "captured", we ignore the webhook.
 *
 * IDEMPOTENCY:
 *   Layer 3 from Decision #2 lives here — WebhookEvent has @unique on
 *   providerEventId. Even if N-Genius (or an attacker) fires the same event
 *   twice, we process it once.
 */

const HEADER_NAME = "x-ngenius-webhook-secret";
const SECRET = process.env.NGENIUS_WEBHOOK_SECRET ?? "";

// Shape we care about from the webhook body — real payloads have more fields
// but we anchor on these to build a stable providerEventId.
type NGeniusWebhookBody = {
  event?: string;                         // e.g. "CAPTURED", "DECLINED"
  order?: { reference?: string; id?: string };
  transaction?: { id?: string; state?: string; date?: string };
  timestamp?: string;
  merchantOrderReference?: string;
};

function buildEventId(body: NGeniusWebhookBody): string {
  const parts = [
    body.event ?? "unknown",
    body.transaction?.id ?? body.order?.id ?? "no-txn",
    body.timestamp ?? body.transaction?.date ?? "no-ts",
  ];
  return parts.join("::");
}

export async function POST(req: Request) {
  // Verify shared-secret header first — cheap gate before any DB work.
  const provided = req.headers.get(HEADER_NAME);
  if (!SECRET || provided !== SECRET) {
    return new NextResponse("unauthorized", { status: 401 });
  }

  let body: NGeniusWebhookBody;
  const rawText = await req.text();
  try {
    body = JSON.parse(rawText) as NGeniusWebhookBody;
  } catch {
    return new NextResponse("invalid-json", { status: 400 });
  }

  const eventId = buildEventId(body);
  const orderRef = body.order?.reference;
  if (!orderRef) {
    return new NextResponse("missing-order-reference", { status: 400 });
  }

  // Idempotency — bail if we've already processed this exact event.
  const existing = await prisma.webhookEvent.findUnique({
    where: { providerEventId: eventId },
  });
  if (existing?.processed) {
    return new NextResponse("already-processed", { status: 200 });
  }

  // Record the event before doing any state mutation (so re-fires bail early).
  await prisma.webhookEvent.upsert({
    where: { providerEventId: eventId },
    create: {
      provider: "n-genius",
      providerEventId: eventId,
      eventType: body.event ?? "unknown",
      payload: body as unknown as object,
      signature: provided ?? "",
    },
    update: {},
  });

  // Secondary verify — never trust webhook body alone.
  let trueState: string | undefined;
  let failReason: string | undefined;
  try {
    const trueOrder = await findNGeniusOrder(orderRef);
    const payment = primaryPayment(trueOrder);
    trueState = payment?.state;
    if (isPaymentFailed(trueState)) {
      failReason = payment?.authResponse?.resultCode ?? trueState ?? "unknown";
    }
  } catch (e) {
    // If N-Genius API is unreachable, we can't verify. Log + bail cleanly —
    // the /processing polling path will catch up when N-Genius is back.
    console.error("[webhook] findOrder failed:", e);
    return new NextResponse("verify-failed", { status: 503 });
  }

  const subscriberId = body.merchantOrderReference || orderRef;

  // Update Subscriber based on TRUTH from N-Genius API (not webhook claim).
  try {
    if (isPaymentSucceeded(trueState)) {
      await prisma.subscriber.update({
        where: { id: subscriberId },
        data: {
          paymentStatus: PaymentStatus.paid,
          paymentRef: orderRef,
          paidAt: new Date(),
          failReason: null,
        },
      });
      // TODO Level 8: notify Modonty via HMAC to create Client + welcome email
    } else if (isPaymentFailed(trueState)) {
      await prisma.subscriber.update({
        where: { id: subscriberId },
        data: {
          paymentStatus: PaymentStatus.failed,
          failReason: failReason ?? "unknown",
        },
      });
    }
    // Any other state (STARTED, AUTHORISED-pending-capture) — leave subscriber pending.
  } catch (e) {
    // Subscriber not found — record but don't 500 (webhook still valid to log).
    console.error("[webhook] subscriber update failed:", e);
  }

  await prisma.webhookEvent.update({
    where: { providerEventId: eventId },
    data: { processed: true, processedAt: new Date() },
  });

  return new NextResponse("ok", { status: 200 });
}
