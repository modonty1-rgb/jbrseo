/**
 * READ-ONLY — check N-Genius order state directly
 */
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const idx = l.indexOf("=");
      let v = l.slice(idx + 1).trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      return [l.slice(0, idx).trim(), v];
    })
);

const orderRef = process.argv[2] || "f4179b5f-6bc1-4252-941d-97b451baebae";

// 1. Auth
const tokenRes = await fetch(env.NGENIUS_TOKEN_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/vnd.ni-identity.v1+json",
    Accept: "application/vnd.ni-identity.v1+json",
    Authorization: `Basic ${env.NGENIUS_API_KEY}`,
  },
  body: JSON.stringify({ grant_type: "client_credentials", realm: "ni" }),
});
const tokenData = await tokenRes.json();
if (!tokenData.access_token) throw new Error("No token: " + JSON.stringify(tokenData));

// 2. Fetch order
const orderRes = await fetch(
  `${env.NGENIUS_API_BASE}/transactions/outlets/${env.NGENIUS_OUTLET_ID}/orders/${orderRef}`,
  {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/vnd.ni-payment.v2+json",
      Accept: "application/vnd.ni-payment.v2+json",
    },
  }
);

const order = await orderRes.json();
console.log("Order ref     :", orderRef);
console.log("HTTP status   :", orderRes.status);
console.log("Order state   :", order._embedded?.payment?.[0]?.state || order.state || "?");
console.log("Auth response :", JSON.stringify(order._embedded?.payment?.[0]?.authResponse || {}, null, 2));
console.log("3DS state     :", order._embedded?.payment?.[0]?.["3ds"]?.status || "?");
console.log("");
console.log("Full order (compact):");
console.log(JSON.stringify({
  state: order._embedded?.payment?.[0]?.state,
  amount: order.amount,
  paymentMethod: order._embedded?.payment?.[0]?.paymentMethod,
  authResponse: order._embedded?.payment?.[0]?.authResponse,
  errors: order.errors,
}, null, 2));
