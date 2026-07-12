import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { isSupportedCountrySlug } from "@/lib/country-config";
import { CheckoutHeader } from "../_components/CheckoutHeader";
import { ProcessingClient } from "./ProcessingClient";

export const metadata: Metadata = {
  title: { absolute: "جارٍ معالجة الدفع — JBRSEO" },
  robots: { index: false, follow: false },
};

const prisma = new PrismaClient();

type Props = {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutProcessingPage({ params, searchParams }: Props) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) notFound();

  const countrySlug = slug as "sa" | "eg";
  if (countrySlug === "eg") notFound();

  const { order } = await searchParams;
  if (!order || !order.trim()) {
    redirect(`/${countrySlug}#pricing`);
  }

  const subscriber = await prisma.subscriber.findUnique({
    where: { id: order.trim() },
    select: { id: true, paymentStatus: true, failReason: true, paymentRef: true },
  }).catch(() => null);

  if (!subscriber) {
    redirect(`/${countrySlug}#pricing`);
  }

  // Server-side short-circuit: if state is already resolved, skip the spinner
  // and jump straight to the final page. Prevents flashing "processing" UI
  // for users who returned via back-button after payment already settled.
  if (subscriber.paymentStatus === "paid") {
    redirect(`/${countrySlug}/checkout/success?order=${order}`);
  }
  if (subscriber.paymentStatus === "failed") {
    const reason = subscriber.failReason ? `&reason=${encodeURIComponent(subscriber.failReason)}` : "";
    redirect(`/${countrySlug}/checkout/failed?order=${order}${reason}`);
  }
  if (subscriber.paymentStatus === "abandoned" || subscriber.paymentStatus === "refunded") {
    redirect(`/${countrySlug}#pricing`);
  }

  // Still pending — render polling UI
  const refShort = subscriber.paymentRef || `JBR-${subscriber.id.slice(-8).toUpperCase()}`;

  return (
    <>
      <CheckoutHeader backHref={`/${countrySlug}#pricing`} />
      <ProcessingClient
        countrySlug={countrySlug}
        order={order.trim()}
        refShort={refShort}
      />
    </>
  );
}
