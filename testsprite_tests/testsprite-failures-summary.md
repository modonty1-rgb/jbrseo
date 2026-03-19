## Failed Test Cases Summary

This file lists only the **failed** TestSprite cases from the latest run, grouped by area, so you can quickly see what to review or align with the spec.

---

### A. Public Navigation / Pricing

- **TC007 – Pricing link fallback: navigating to `/pricing` when homepage anchor is not used**  
  - **What the test expects:** Clicking the “Pricing / الأسعار” link should navigate to a dedicated `/pricing` page, then on to `/signup`.  
  - **What actually happened:** The link scrolls to `/#pricing` on the homepage (no route change), matching the current design.  
  - **Why it failed:** URL never becomes `/pricing`, so checks for a dedicated pricing page and its CTA fail. This is a **spec mismatch**, not a broken link.

---

### B. Signup Flow

- **TC009 – Successful signup redirects to thank‑you page with confirmation**  
  - **Issue:** Test could not find a `Name` field or a plan labeled “Basic”; required inputs/options for its scripted flow are missing.  
  - **Impact:** It cannot complete signup or verify `/signup/thank-you`.

- **TC010 – Thank‑you page shows next steps content after signup**  
  - **Issue:** On `/signup`, TestSprite mostly sees skeleton/loading placeholders and only one clickable `<div>`; standard inputs (Name, Email, Plan dropdown, Submit) are not visible.  
  - **Impact:** Signup cannot be submitted, so the thank‑you page and its next‑steps copy cannot be asserted.

- **TC013 – Validation prevents submission when name is missing**  
  - **Issue:** No required “Name” field exists; the closest is an optional business-name field (“اسم النشاط التجاري (اختياري)”).  
  - **Impact:** The test cannot trigger “missing required name” validation, so it marks the scenario as failed.

- **TC014 – Plan preference must be selected before submission (if required)**  
  - **Issue:** Test expects a `Name`/`الاسم` field and a specific form structure; only email, phone, businessName, and businessType inputs are visible.  
  - **Impact:** It cannot reproduce the expected form state or verify that plan selection is strictly required before submission.

---

### C. Admin Authentication & Dashboard

> Note: The app implements **password‑only admin login** on `/admin/login` (no email field, shared password `admin123`), but many tests still assume a classic email+password form.

- **TC016 – Successful admin login redirects to admin dashboard**  
  - **Issue:** No email/username field; test cannot perform the scripted “email + password” login.  
  - **Impact:** Dashboard redirect and content cannot be verified.

- **TC018 – Empty password blocks submission with visible validation feedback**  
  - **Issue:** Test requires an email+password form; actual UI only has a password field and submit button.  
  - **Impact:** Scenario “no password” as defined in the test cannot be reproduced.

- **TC019 – Empty email blocks submission with visible validation feedback**  
  - **Issue:** There is no email field at all.  
  - **Impact:** Test cannot submit “empty email” and therefore cannot observe validation.

- **TC020 – Login via Enter key submits the form successfully**  
  - **Issue:** Again depends on email+password fields and a redirect to `/admin`; missing email input prevents the flow.  
  - **Impact:** Press‑Enter submission behavior is not exercised as the test expects.

- **TC021 – Invalid email format shows visible error and does not log in**  
  - **Issue:** No email input to type an invalid email into.  
  - **Impact:** Email‑format validation cannot be tested.

- **TC022 – Login and load Admin dashboard home**  
  - **Issue:** Script wants to type `{{LOGIN_USER}}` into an email/username field that doesn’t exist.  
  - **Impact:** Admin dashboard is never reached in this flow.

- **TC023 – Edit SEO settings and save successfully**  
  - **Issue:** Login attempts are rejected with “Invalid password”; settings page never loads.  
  - **Impact:** SEO form and save behavior are not exercised.

- **TC024 – Edit Header/Footer content page and save successfully**  
  - **Issue:** Same pattern: password‑only login plus rejected password, no email field.  
  - **Impact:** Admin Content → Header & Footer UI is never reached.

- **TC025 – Manage Emojis content page: edit and save successfully**  
  - **Issue:** Missing email field and “Invalid password” block admin access.  
  - **Impact:** Emojis page cannot be opened; no edits are made.

- **TC026 – View subscribers list in admin dashboard**  
  - **Issue:** Login shows “Invalid password” and lacks email; subscribers nav is unavailable.  
  - **Impact:** Subscribers table/empty state cannot be verified.

- **TC027 – Add or edit a subscriber note and save successfully**  
  - **Issue:** Same login failure as above.  
  - **Impact:** Subscriber detail view and notes UI are not exercised.

- **TC028 – Update Tracking settings and save successfully**  
  - **Issue:** Login fails and there’s no email field to try alternative credentials.  
  - **Impact:** Admin tracking is now on `/admin/settings` (merged with general). Saving tracking config is tested there.

- **TC029 – Update Images settings and save successfully**  
  - **Issue:** Login fails with “Invalid password”; single password field only.  
  - **Impact:** `/admin/settings/images` UI not reached; image settings save not verified.

- **TC030 – Validation error on save shows error notification and remains on same admin page**  
  - **Issue:** Requires SEO settings editor, but login never succeeds.  
  - **Impact:** Cannot test invalid‑settings save behavior or error notification.

---

### How to use this file

- Use this list to decide which failures are **real bugs** vs **test/spec mismatches**:
  - TC007 and many admin tests are mostly **expectation mismatches** (anchor vs `/pricing`, email+password vs password‑only login).
  - TC009–TC014 point to **form model / labeling differences** on signup (Name, Country, plan labels).
- For each test you care about, open the linked visualization URL in the raw report to see the exact run, then decide whether to:
  - Update the product UX, or  
  - Update the TestSprite test definitions/spec to match the current behavior.

