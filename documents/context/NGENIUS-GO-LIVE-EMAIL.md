# Email to N-Genius — Go-Live Request

**To:** support@ngenius-payments.com (KSA integrations team)
**Subject:** JBRSEO — Sandbox Integration Verified · Requesting Webhook Whitelist + Live Credentials
**Date:** 2026-07-13

---

Dear N-Genius Integration Team,

I hope this email finds you well. I am writing to request activation of live credentials and webhook whitelisting for our KSA merchant integration.

## Merchant Details

- **Merchant / Business name:** JBRSEO
- **Website:** https://www.jbrseo.com
- **Outlet reference (sandbox):** `a1d0ebbb-13e0-4b42-ad3c-bdbda9efec94`
- **Integration type:** Hosted Session (server-side order create + browser SDK for card capture)
- **Region:** KSA sandbox (`api-gateway.sandbox.ksa.ngenius-payments.com`)

## Integration Status — Verified End-to-End on Production

We have completed the sandbox integration and verified the full payment flow on our production infrastructure (`https://www.jbrseo.com`):

| Step | Result |
|---|---|
| Access token generation | ✅ 200 OK |
| Create Hosted Session order (SAR 1,299) | ✅ Reference returned |
| Card capture via browser SDK (test card `4111 1111 1111 1111`) | ✅ Encrypted |
| 3D Secure challenge (fake 3ds2 sandbox page) | ✅ OTP submitted & authorised |
| Order state — `GET /transactions/outlets/{outlet}/orders/{ref}` | ✅ `PURCHASED` |
| Auth response: `resultCode=00`, `success=true` | ✅ Successful approval |
| Merchant DB reconciliation via polling backup | ✅ Payment marked as paid |

**Reference test transaction:** N-Genius order `f4179b5f-6bc1-4252-941d-97b451baebae` on 2026-07-12.

## What We Need to Go Live

### 1. Whitelist our production webhook URL

- **URL:** `https://www.jbrseo.com/api/webhooks/n-genius`
- **Method:** POST · **Content-Type:** application/json
- **Auth:** Custom header `X-NGenius-Webhook-Secret` (shared secret already configured on our side)
- **Idempotency:** We de-duplicate incoming events via `providerEventId` — safe to retry
- **Verification:** On every webhook we call back `GET /orders/{ref}` before mutating the merchant DB (webhook body alone is never trusted)

### 2. LIVE credentials

Please provision production credentials for the same outlet and share:
- **`NGENIUS_API_KEY`** (Base64 client credentials for `POST /identity/auth/access-token`)
- **`NGENIUS_OUTLET_ID`** (Outlet reference for the live merchant record)
- **`NGENIUS_API_BASE`** (Production API base URL — `api-gateway.ksa.ngenius-payments.com` or equivalent)
- **`NGENIUS_TOKEN_URL`** (Production `identity/auth/access-token` URL)
- **`NGENIUS_HOSTED_SESSION_API_KEY`** (Client-side Hosted Session API key)
- **`NGENIUS_SDK_URL`** (Production Hosted Session SDK URL, e.g. `https://paypage.ksa.ngenius-payments.com/hosted-sessions/sdk.js`)
- **`NGENIUS_WEBHOOK_SECRET`** (Shared secret for the header above — we will use the same value we configure on your portal)

We will swap the sandbox values with the LIVE values only after your confirmation.

## Contact

- **Technical contact:** Khalid ([email address])
- **Business contact:** [Business owner name] ([phone])
- **Preferred communication:** Email (WhatsApp acceptable for urgent matters)

Please let me know if you need any additional information — a screenshot of the sandbox admin, a screen recording of the E2E flow, or a signed integration certification document. We are ready to proceed as soon as the LIVE credentials and webhook whitelist are in place.

Thank you for your support.

Best regards,
Khalid
JBRSEO — https://www.jbrseo.com

---

## Notes for Khalid (internal, remove before sending)

- **Fill in personal contact info** in the "Contact" section before sending.
- **Optional:** attach a screen recording of the E2E flow (record `/sa/checkout` → 3DS OTP → success page).
- **After receiving LIVE creds:**
  1. Update all `NGENIUS_*` env vars on Vercel to LIVE values (use POST `/v10/projects/{proj}/env` with `upsert=true` — same mechanism used for sandbox sync).
  2. Update `NEXT_PUBLIC_NGENIUS_SDK_URL` if the LIVE SDK URL differs.
  3. Update `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to real Cloudflare Turnstile keys bound to `jbrseo.com` (current values are dummy test keys `1x00...`).
  4. Trigger a redeploy so NEXT_PUBLIC vars are baked in.
  5. Run one final sandbox test to make sure nothing regressed, then flip.
- **Whitelist:** N-Genius' webhook system requires manual whitelisting of the outbound URL. Without it, webhooks won't fire and we rely 100% on polling. Polling works (verified today) but is slower — mostly OK, but ideal to have both.
