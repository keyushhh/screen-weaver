from playwright.sync_api import sync_playwright, expect
import time

def test_forgot_mpin_placement():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # 1. Seed data to bypass onboarding (ensure user has MPIN set)
        page.goto("http://localhost:5173/")
        page.evaluate("""
            localStorage.setItem("dotpe_user_state", JSON.stringify({
                name: "Test User",
                phoneNumber: "9999999999",
                mpin: "1234",
                kycStatus: "complete"
            }));
        """)
        page.reload()

        # 2. Navigate to Mpin Settings (Change MPIN flow)
        page.goto("http://localhost:5173/#/security/mpin-settings")

        # 3. Verify "Forgot MPIN?" is NOT in the status card
        # The status card text usually says "MPIN Set".
        # We need to make sure the "Forgot MPIN?" button is gone.
        # Previously it was a button with text "Forgot MPIN?".
        expect(page.get_by_role("button", name="Forgot MPIN?")).not_to_be_visible()

        print("Verified: 'Forgot MPIN?' link removed from Settings page.")

        # 4. Click 'Change MPIN' to open sheet
        page.get_by_role("button", name="Change MPIN").click()

        # 5. Verify Sheet opens
        expect(page.get_by_text("Enter your current MPIN")).to_be_visible()

        # 6. Verify "Forgot MPIN?" link exists in sheet
        forgot_link = page.get_by_role("button", name="Forgot MPIN?")
        expect(forgot_link).to_be_visible()

        # Check styling? (Hard to check styling via playwright logic easily without screenshot, but we can check CSS classes if we want.
        # But 'clickability' is the main functional test here)

        print("Verified: 'Forgot MPIN?' link appears in MpinSheet.")

        # 7. Take screenshot
        page.screenshot(path="verification/forgot_mpin_placement.png")

        # 8. Click and verify navigation
        forgot_link.click()

        expect(page).to_have_url("http://localhost:5173/#/forgot-mpin")
        print("Verified: Clicking link navigates to /forgot-mpin")

        browser.close()

if __name__ == "__main__":
    test_forgot_mpin_placement()
