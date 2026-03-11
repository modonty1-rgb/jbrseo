
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** jbrseo.com
- **Date:** 2026-03-11
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Homepage to in-page pricing anchor and plan CTA drives to signup with plan parameter
- **Test Code:** [TC001_Homepage_to_in_page_pricing_anchor_and_plan_CTA_drives_to_signup_with_plan_parameter.py](./TC001_Homepage_to_in_page_pricing_anchor_and_plan_CTA_drives_to_signup_with_plan_parameter.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/8335d902-7d29-4cf9-8166-d095b1edb95f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 Homepage: scroll through key sections and confirm CTA visibility
- **Test Code:** [TC002_Homepage_scroll_through_key_sections_and_confirm_CTA_visibility.py](./TC002_Homepage_scroll_through_key_sections_and_confirm_CTA_visibility.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/ecd1d228-a302-4d01-92d6-0fac5c4d75b7
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 Header navigation: About page loads from public site
- **Test Code:** [TC003_Header_navigation_About_page_loads_from_public_site.py](./TC003_Header_navigation_About_page_loads_from_public_site.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/938b21f1-e165-466f-bcee-25991bad8ba9
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 Header navigation: Team page loads from public site
- **Test Code:** [TC004_Header_navigation_Team_page_loads_from_public_site.py](./TC004_Header_navigation_Team_page_loads_from_public_site.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/a366729b-d6fd-47e0-b356-7788c5bb9766
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Legal navigation: Terms page is accessible and displays content
- **Test Code:** [TC005_Legal_navigation_Terms_page_is_accessible_and_displays_content.py](./TC005_Legal_navigation_Terms_page_is_accessible_and_displays_content.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/d2eacbb7-616a-45e8-867a-1fa820d64773
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Legal navigation: Privacy page is accessible and displays content
- **Test Code:** [TC006_Legal_navigation_Privacy_page_is_accessible_and_displays_content.py](./TC006_Legal_navigation_Privacy_page_is_accessible_and_displays_content.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/6010217f-ff2f-4816-a955-16a16426d955
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Pricing link fallback: navigating to /pricing when homepage anchor is not used
- **Test Code:** [TC007_Pricing_link_fallback_navigating_to_pricing_when_homepage_anchor_is_not_used.py](./TC007_Pricing_link_fallback_navigating_to_pricing_when_homepage_anchor_is_not_used.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Dedicated '/pricing' route not reachable: clicking the navigation link 'الأسعار' anchors to '#pricing' on the homepage instead of navigating to '/pricing'.
- URL does not contain '/pricing' (current URL is http://localhost:3000/#pricing).
- Page title does not contain the English word 'Pricing'.
- Cannot verify navigation to '/signup' because the primary CTA on a dedicated '/pricing' page cannot be clicked when that dedicated route is not present.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/1fc9cf06-92b2-49a0-8aff-609687542291
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Signup page: plan parameter highlights the intended plan preference
- **Test Code:** [TC008_Signup_page_plan_parameter_highlights_the_intended_plan_preference.py](./TC008_Signup_page_plan_parameter_highlights_the_intended_plan_preference.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/19c88ac7-3274-480e-b2ae-03658e127dad
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Successful signup redirects to thank-you page with confirmation
- **Test Code:** [TC009_Successful_signup_redirects_to_thank_you_page_with_confirmation.py](./TC009_Successful_signup_redirects_to_thank_you_page_with_confirmation.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Name input field not found on signup page.
- Plan option 'Basic' not present on signup page (only differently labeled plan buttons visible).
- Signup flow cannot be completed because required form field(s)/option(s) are missing.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/24cb3859-0330-49be-9b31-cfd19012ae48
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 Thank-you page shows next steps content after signup
- **Test Code:** [TC010_Thank_you_page_shows_next_steps_content_after_signup.py](./TC010_Thank_you_page_shows_next_steps_content_after_signup.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Signup form not found on /signup page; required input fields (Name, Email), Plan dropdown, and Submit button are not present.
- Thank-you page '/signup/thank-you' could not be reached because the signup form could not be submitted.
- Page shows skeleton/loading placeholders and lacks the interactive form controls required to complete the signup flow.
- Only one interactive element detected on the page (index 2670, a <div>), which is not a usable form control.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/8829ef33-1c55-4fab-b16b-3f07cb5fb7cb
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Validation prevents submission when email is missing
- **Test Code:** [TC011_Validation_prevents_submission_when_email_is_missing.py](./TC011_Validation_prevents_submission_when_email_is_missing.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/31c0bc4b-ba01-4e09-be2c-190d7c111917
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 Validation prevents submission with invalid email format
- **Test Code:** [TC012_Validation_prevents_submission_with_invalid_email_format.py](./TC012_Validation_prevents_submission_with_invalid_email_format.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/01e48ae0-41c7-4e23-982a-163dfd2fcb1f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Validation prevents submission when name is missing
- **Test Code:** [TC013_Validation_prevents_submission_when_name_is_missing.py](./TC013_Validation_prevents_submission_when_name_is_missing.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Required 'Name' input field not found on the /signup page; only an optional 'اسم النشاط التجاري (اختياري)' field is present.
- Plan option named 'Basic' not found on the /signup page.
- Form submission could not be used to trigger required-field validation for a blank name because the required name field is absent or only optional.
- No inline 'required' validation message was observed after attempting to locate and trigger name validation.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/948b6a7b-a385-4e62-8f01-430d95c4bf93
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Plan preference must be selected before submission (if required)
- **Test Code:** [TC014_Plan_preference_must_be_selected_before_submission_if_required.py](./TC014_Plan_preference_must_be_selected_before_submission_if_required.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Name input field ('Name' / 'الاسم') not found on the signup page; visible interactive inputs are email (index 3006), phone (index 3009), businessName (index 3015), and businessType (index 3019).
- Form submission test cannot be completed because the required 'Name' field is missing and thus the specified form state cannot be reproduced.
- Validation message 'required' could not be verified because no submission was performed due to the missing field.
- The presence or required state of a 'Plan' preference control could not be conclusively tested: plan selection buttons exist but their required/validation behavior is not exposed without completing the form flow.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/e085f887-18b2-401a-99e1-2b5980c62bd9
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015 User remains on signup page when submission is blocked by validation
- **Test Code:** [TC015_User_remains_on_signup_page_when_submission_is_blocked_by_validation.py](./TC015_User_remains_on_signup_page_when_submission_is_blocked_by_validation.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/be553657-755f-459d-b01b-3800b7fedcea
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016 Successful admin login redirects to admin dashboard
- **Test Code:** [TC016_Successful_admin_login_redirects_to_admin_dashboard.py](./TC016_Successful_admin_login_redirects_to_admin_dashboard.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Email/username input field not found on the /admin/login page.
- Login flow cannot be completed because a required credential field (email/username) is missing.
- Admin dashboard could not be verified because login could not be performed due to the missing field.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/696c5e2e-9563-4a02-a673-f13cae5eacb3
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017 Invalid password shows error and stays on login page
- **Test Code:** [TC017_Invalid_password_shows_error_and_stays_on_login_page.py](./TC017_Invalid_password_shows_error_and_stays_on_login_page.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/ac64b6f9-74e5-4762-a8a7-57482c0f72a2
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018 Empty password blocks submission with visible validation feedback
- **Test Code:** [TC018_Empty_password_blocks_submission_with_visible_validation_feedback.py](./TC018_Empty_password_blocks_submission_with_visible_validation_feedback.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Admin email input not found on /admin/login page, so the test to submit the form without a password cannot be executed as specified
- Validation message visibility could not be verified because the required form field (email) is missing
- The page contains only a password input and a submit button (indexes [1622], [1623]), which is insufficient to reproduce the requested scenario
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/3e58b1d7-b4f3-428d-a845-dfd911e1664a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC019 Empty email blocks submission with visible validation feedback
- **Test Code:** [TC019_Empty_email_blocks_submission_with_visible_validation_feedback.py](./TC019_Empty_email_blocks_submission_with_visible_validation_feedback.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Admin email input field not found on /admin/login page.
- Cannot verify form submission without email because the email field is missing.
- Validation message visibility could not be tested because the form could not be submitted as intended.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/d3a87506-3649-4c86-9438-d9096f552da8
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020 Login via Enter key submits the form successfully
- **Test Code:** [TC020_Login_via_Enter_key_submits_the_form_successfully.py](./TC020_Login_via_Enter_key_submits_the_form_successfully.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Admin email/username input not found on the /admin/login page, preventing filling credentials and submitting the form.
- Cannot verify that pressing Enter in the password field submits the form because the required email field is missing and the login form is incomplete.
- Login could not be attempted with credentials example@gmail.com / password123 because the page lacks the email input.
- Unable to confirm URL contains '/admin' and that 'Admin dashboard' is visible due to inability to submit a valid login.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/ebd15f8c-ffd9-4e37-9108-b66720ef7eb7
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC021 Invalid email format shows visible error and does not log in
- **Test Code:** [TC021_Invalid_email_format_shows_visible_error_and_does_not_log_in.py](./TC021_Invalid_email_format_shows_visible_error_and_does_not_log_in.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Email input field not found on /admin/login page
- Cannot enter invalid email because the email field is missing
- Error message for invalid email could not be verified because the form cannot be submitted
- Login attempt not performed because the required email field is absent (submit present but form incomplete)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/8e2a18cd-a5c0-4377-9d7f-bf6acf8b6699
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC022 Login and load Admin dashboard home
- **Test Code:** [TC022_Login_and_load_Admin_dashboard_home.py](./TC022_Login_and_load_Admin_dashboard_home.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Username/email input field not found on admin login page
- Login flow expects an email/username input but only a password input is present
- Unable to perform the required step 'Type "{{LOGIN_USER}}" into the email or username field' because the field does not exist
- Admin dashboard access could not be verified because the login cannot be completed
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/5241f242-f860-472d-a155-ad1e85dd7d11
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC023 Edit SEO settings and save successfully
- **Test Code:** [TC023_Edit_SEO_settings_and_save_successfully.py](./TC023_Edit_SEO_settings_and_save_successfully.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Admin login failed: 'Invalid password' message displayed after submitting credentials.
- Admin settings page could not be reached because authentication did not succeed and the login form remains visible.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/5597d344-21e9-444b-b768-467586dc57ea
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC024 Edit general content (Header/Footer content page) and save successfully
- **Test Code:** [TC024_Edit_general_content_HeaderFooter_content_page_and_save_successfully.py](./TC024_Edit_general_content_HeaderFooter_content_page_and_save_successfully.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Admin login failed: 'Invalid password' message displayed after entering the password and clicking 'Log in'.
- Login did not proceed: the page remains on /admin/login with the password input and 'Log in' button visible.
- No username/email field is present on the login page, preventing trying alternate credentials via the UI.
- Unable to access admin Content -> Header & Footer because authentication did not succeed, so the remaining test steps cannot be executed.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/d9819035-9c14-4224-a5fe-107424353879
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC025 Manage Emojis content page: edit and save successfully
- **Test Code:** [TC025_Manage_Emojis_content_page_edit_and_save_successfully.py](./TC025_Manage_Emojis_content_page_edit_and_save_successfully.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Email/username input not found on admin login page, preventing required credential entry.
- Login failed - 'Invalid password' message displayed after submitting password.
- Admin content pages (e.g., Content > Emojis) were not reachable because authentication did not succeed.
- Unable to type a shortcode into an emoji field or save changes because the Emoji content interface could not be accessed.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/9382dc22-2312-4802-859b-a055d81fa6d6
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC026 View subscribers list in admin dashboard
- **Test Code:** [TC026_View_subscribers_list_in_admin_dashboard.py](./TC026_View_subscribers_list_in_admin_dashboard.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Login failed - 'Invalid password' error displayed after submitting the password.
- Username/email input field not found on admin login page; only a password field is present.
- Subscribers page could not be accessed because authentication did not succeed.
- Admin navigation for "Subscribers" is not reachable from the login page while unauthenticated.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/0d74fa75-c7e6-4911-8d23-38becb015b40
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC027 Add or edit a subscriber note and save successfully
- **Test Code:** [TC027_Add_or_edit_a_subscriber_note_and_save_successfully.py](./TC027_Add_or_edit_a_subscriber_note_and_save_successfully.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Admin login failed - 'Invalid password' message displayed after submitting password
- Admin dashboard not accessible because the login attempt did not succeed
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/e7dda03f-de5a-4282-a966-ecf3f955124d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC028 Update Tracking settings and save successfully
- **Test Code:** [TC028_Update_Tracking_settings_and_save_successfully.py](./TC028_Update_Tracking_settings_and_save_successfully.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Admin login failed - 'Invalid password' message displayed after submitting password.
- Email/username field not found on admin login page, preventing entering username.
- Settings/Tracking pages could not be accessed because authentication did not succeed.
- No visible navigation or alternative access to Settings/Tracking without logging in.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/db414648-d4a2-4c68-8919-981c2d6f3052
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC029 Update Images settings and save successfully
- **Test Code:** [TC029_Update_Images_settings_and_save_successfully.py](./TC029_Update_Images_settings_and_save_successfully.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Login failed - 'Invalid password' error displayed after entering the test password and clicking Log in
- Admin settings page not reachable because login did not succeed
- Username/email input missing on the login page (single-field form), preventing standard credential login
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/d537f8a0-3aa5-47b8-9447-3cf9695195d1
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC030 Validation error on save shows error notification and remains on the same admin page
- **Test Code:** [TC030_Validation_error_on_save_shows_error_notification_and_remains_on_the_same_admin_page.py](./TC030_Validation_error_on_save_shows_error_notification_and_remains_on_the_same_admin_page.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Login failed - 'Invalid password' error is displayed after submitting test credentials.
- Admin dashboard/settings page not reachable because authentication did not succeed.
- SEO settings editor could not be accessed; therefore validation of saving invalid settings cannot be performed.
- Login page presents only a password input and no alternative authentication flow was available to retry with different credentials.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9e2d3a5b-a685-4a4d-bcbc-ba4bf53d739d/ac77bee1-ea44-4076-b145-d6cc75f48a98
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **36.67** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---