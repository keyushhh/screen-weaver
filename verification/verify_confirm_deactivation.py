
import os
import sys
import json
import time
from playwright.sync_api import sync_playwright, expect

# Ensure we can import modules if needed, though this is a standalone script
sys.path.append(os.getcwd())

def verify_confirm_deactivation():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 402, 'height': 874}, # iPhone 16 Pro approx
            device_scale_factor=2
        )
        page = context.new_page()

        # Seed LocalStorage with a known MPIN
        # We need to do this before loading the app logic that might depend on it,
        # or inject it immediately after load.
        # Since we use HashRouter, we can load the root, inject, then reload/navigate.

        print("Loading app...")
        # Use port 8081 as detected
        base_url = "http://localhost:8081"

        try:
            page.goto(base_url)
        except Exception:
             base_url = "http://localhost:8080" # Fallback
             page.goto(base_url)

        print(f"Connected to {base_url}")

        # Inject User State
        user_state = {
            "mpin": "1234",
            "name": "Test User",
            "phoneNumber": "9999999999",
            "kycStatus": "complete"
        }

        page.evaluate(f"localStorage.setItem('dotpe_user_state', '{json.dumps(user_state)}');")
        page.reload()

        # 1. Navigate to Delete Account Page
        print("Navigating to Delete Account...")
        page.goto(f"{base_url}/#/delete-account")
        time.sleep(1) # Wait for fade in

        # 2. Select Deactivate and Proceed
        print("Selecting Deactivate...")
        # Verify "Deactivate Account" is selected by default or select it
        # Based on code, it defaults to 'deactivate'.

        print("Clicking Proceed...")
        page.get_by_role("button", name="Proceed").click()

        # 3. Verify Navigation to Confirm Deactivation
        print("Verifying Confirm Deactivation Page...")
        expect(page).to_have_url(f"{base_url}/#/confirm-deactivation")
        expect(page.get_by_role("heading", name="Confirm Deactivation")).to_be_visible()
        expect(page.get_by_text("Just to be sure — enter your MPIN to confirm.")).to_be_visible()

        # 4. Verify Button is Disabled initially
        deactivate_btn = page.get_by_role("button", name="Deactivate Account")
        print("Checking button disabled state...")
        # Note: We used standard HTML disabled attribute or just CSS class.
        # Playwright's `to_be_disabled()` checks the attribute.
        expect(deactivate_btn).to_be_disabled()

        # Take Screenshot of Empty State
        page.screenshot(path="verification/1_empty_state.png")

        # 5. Enter Wrong MPIN
        print("Entering wrong MPIN '0000'...")
        # We need to target the input.
        # shadcn InputOTP might be tricky to target individual slots,
        # but usually there's a hidden input or we can type into the container.
        # The code uses InputOTP with inputMode="numeric".

        # Clicking the input area to focus
        page.locator("input[autocomplete='one-time-code']").focus()
        page.keyboard.type("0000")

        time.sleep(0.5)
        # Check for error state (red border) - visual check in screenshot
        # And button should still be disabled
        expect(deactivate_btn).to_be_disabled()
        page.screenshot(path="verification/2_error_state.png")

        # 6. Enter Correct MPIN
        print("Entering correct MPIN '1234'...")
        # Clear input first? Or just backspace.
        for _ in range(4):
            page.keyboard.press("Backspace")

        page.keyboard.type("1234")
        time.sleep(0.5)

        # 7. Verify Button Enabled
        print("Checking button enabled state...")
        expect(deactivate_btn).to_be_enabled()
        page.screenshot(path="verification/3_success_state.png")

        # 8. Click Deactivate
        print("Clicking Deactivate...")
        deactivate_btn.click()

        # 9. Verify Redirection to Index/Login
        print("Verifying redirection...")
        # Should go to "/"
        time.sleep(1)
        expect(page).to_have_url(f"{base_url}/#/")

        print("Verification Complete!")
        browser.close()

if __name__ == "__main__":
    verify_confirm_deactivation()
