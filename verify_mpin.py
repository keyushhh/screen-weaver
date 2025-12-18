
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # 1. Navigate to home
    page.goto("http://localhost:3000")

    # 2. Enter Phone Number
    # The phone input might be an input field.
    page.wait_for_selector("input[type='tel']")
    page.fill("input[type='tel']", "9999999999")

    # 3. Click Request OTP
    page.click("button:has-text('Request OTP')")

    # Wait for processing
    page.wait_for_timeout(2000)

    # 4. Enter OTP
    # The OTP input is InputOTP. We can type into the first input or just type on the page.
    # It has autoFocus.
    page.keyboard.type("123456")

    # 5. Click Continue
    page.click("button:has-text('Continue')")

    # Wait for processing
    page.wait_for_timeout(2000)

    # 6. Setup MPIN Screen
    # Should see "Create a secure 4 digit MPIN"
    expect(page.get_by_text("Create a secure 4 digit MPIN")).to_be_visible()

    # 7. Type "1234" to trigger error
    page.keyboard.type("1234")

    # Wait for effect
    page.wait_for_timeout(500)

    # 8. Take screenshot
    page.screenshot(path="verification_mpin.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
