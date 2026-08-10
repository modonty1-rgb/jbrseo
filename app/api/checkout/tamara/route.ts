import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { orderLimiter } from "@/lib/rate-limit";
import { priceForDuration, type PlanDuration } from "@/lib/pricing-durations";
import { TamaraError, tamaraIsConfigured } from "@/lib/tamara/client";
import {
  createCheckoutSession,
  digitalShippingAddress,
  splitName,
} from "@/lib/tamara/checkout";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const prisma = new PrismaClient();

/**
 * The Tamara half of checkout — the same order, paid in instalments instead of by card.
 *
 * Every guard the card route runs, this one runs too, in the same order: a customer must
 * not be able to skip Turnstile or the rate limit by choosing the other button. What is
 * deliberately NOT shared is the price: it is read from the database here as well, so
 * neither route can be talked into a total by its client.
 *
 * Country is fixed to SA because that is what this merchant account is enabled for —
 * Tamara answers Egypt with `400 not_supported_delivery_country`, and offering a button
 * that always fails is worse than not offering it.
 */
const Body = z.object({
  turnstileToken: z.string().min(10),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(6).max(20),
  plan: z.enum(["presence", "starter", "growth", "scale"]),
  duration: z.coerce
    .number()
    .refine((n): n is PlanDuration => n === 3 || n === 6 || n === 12, "invalid duration"),
  country: z.enum(["SA"]),
});

function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "127.0.0.1"
  );
}

export async function POST(req: Request) {
  if (!tamaraIsConfigured()) {
    return NextResponse.json({ error: "tamara-not-configured" }, { status: 503 });
  }

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "invalid-body" }, { status: 400 });
  }

  const ip = getIp(req);

  const turn = await verifyTurnstileToken(body.turnstileToken, ip);
  if (!turn.success) {
    return NextResponse.json({ error: "bot-check-failed", codes: turn.errorCodes }, { status: 403 });
  }

  const rl = await orderLimiter.limit(ip);
  if (!rl.success) {
    return NextResponse.json(
      { error: "rate-limited", retryAfter: Math.ceil((rl.reset - Date.now()) / 1000) },
      { status: 429 },
    );
  }

  const plan = await prisma.plan.findFirst({
    where: { country: body.country, slug: body.plan, visible: true },
  });
  if (!plan) {
    return NextResponse.json({ error: "plan-not-found" }, { status: 400 });
  }

  // Same rule as the card route: monthly base × duration, charged once. Tamara then
  // splits THAT total into its own instalments — the two schedules are unrelated, and
  // free service months stay a fulfillment bonus rather than a discount.
  const totalMajor = priceForDuration(plan.priceMonthly, body.duration).total;
  if (totalMajor <= 0) {
    return NextResponse.json({ error: "invalid-total" }, { status: 400 });
  }
  const billingKey = `${body.duration}m`;

  const subscriber = await prisma.subscriber.upsert({
    where: { email_plan_billing: { email: body.email, plan: body.plan, billing: billingKey } },
    update: {
      contactName: body.name,
      phone: body.phone,
      paymentStatus: "pending",
      failReason: null,
    },
    create: {
      contactName: body.name,
      email: body.email,
      phone: body.phone,
      planName: plan.name,
      plan: body.plan,
      billing: billingKey,
      country: body.country,
      isAnnual: body.duration === 12,
      paymentStatus: "pending",
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jbrseo.com";
  const country = body.country.toLowerCase();
  const { first, last } = splitName(body.name);
  const money = { amount: totalMajor, currency: "SAR" };
  const description = `${plan.name} — ${body.duration} شهور`;

  try {
    const session = await createCheckoutSession({
      order_reference_id: subscriber.id,
      total_amount: money,
      description: description.slice(0, 256),
      country_code: body.country,
      payment_type: "PAY_BY_INSTALMENTS",
      locale: "ar_SA",
      items: [
        {
          reference_id: plan.slug,
          type: "Digital",
          name: plan.name,
          sku: `${plan.slug}-${billingKey}`,
          quantity: 1,
          total_amount: money,
        },
      ],
      consumer: {
        first_name: first,
        last_name: last,
        phone_number: body.phone,
        email: body.email,
      },
      shipping_address: digitalShippingAddress(first, last, body.country, body.phone),
      tax_amount: { amount: 0, currency: "SAR" },
      shipping_amount: { amount: 0, currency: "SAR" },
      merchant_url: {
        success: `${siteUrl}/${country}/checkout/processing?order=${subscriber.id}&via=tamara`,
        failure: `${siteUrl}/${country}/checkout/failed?order=${subscriber.id}&via=tamara`,
        cancel: `${siteUrl}/${country}/checkout?plan=${body.plan}&duration=${body.duration}&error=cancelled_by_user&order=${subscriber.id}`,
        notification: `${siteUrl}/api/webhooks/tamara`,
      },
    });

    // Tamara's own order id is what every later lookup and webhook is keyed by, so it is
    // stored exactly where the card flow stores its reference — one column, one meaning.
    await prisma.subscriber
      .update({ where: { id: subscriber.id }, data: { paymentRef: session.order_id } })
      .catch(() => { /* non-fatal — the webhook carries the reference too */ });

    return NextResponse.json({
      checkoutUrl: session.checkout_url,
      orderId: session.order_id,
      subscriberId: subscriber.id,
    });
  } catch (err) {
    const isTamara = err instanceof TamaraError;
    const code = isTamara ? err.code ?? `http-${err.status}` : "tamara-error";
    const message = err instanceof Error ? err.message.slice(0, 300) : "unknown";

    await prisma.subscriber
      .update({
        where: { id: subscriber.id },
        data: { paymentStatus: "failed", failReason: message.slice(0, 200) },
      })
      .catch(() => { /* ignore secondary error */ });

    await prisma.paymentAttempt
      .create({
        data: {
          stage: "create-payment",
          outcome: "error",
          code,
          message,
          plan: body.plan,
          duration: billingKey,
          country: body.country,
          email: body.email,
          ip,
          subscriberId: subscriber.id,
        },
      })
      .catch(() => { /* logging must never break the flow */ });

    // The customer never sees Tamara's wording — it is written for a developer.
    return NextResponse.json({ error: "tamara-failed", code }, { status: 502 });
  }
}
