const OUTLET = process.env.NGENIUS_OUTLET_ID;
const BASE = process.env.NGENIUS_API_BASE;
const API_KEY = process.env.NGENIUS_API_KEY;
const ORDER_REF = "d6483608-666f-45ac-9186-68f026b6726c";

// Get token
const tokenRes = await fetch(`${process.env.NGENIUS_TOKEN_URL}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/vnd.ni-identity.v1+json",
    Accept: "application/vnd.ni-identity.v1+json",
    Authorization: `Basic ${API_KEY}`,
  },
  body: JSON.stringify({ grant_type: "client_credentials", realm: "ni" }),
});
const tokenJson = await tokenRes.json();
const token = tokenJson.access_token;

// Get order
const url = `${BASE}/transactions/outlets/${OUTLET}/orders/${ORDER_REF}`;
const res = await fetch(url, {
  headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.ni-payment.v2+json" },
});
const order = await res.json();
const payment = order._embedded?.payment?.[0];
console.log("state:", payment?.state);
console.log("amount:", payment?.amount);
console.log("authResponse:", payment?.authResponse);
console.log("orderReference:", order.reference);
console.log("merchantOrderReference:", order.merchantOrderReference);
