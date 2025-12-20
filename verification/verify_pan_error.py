from playwright.sync_api import sync_playwright

def verify_pan_error():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use iPhone 13 viewport to match the mobile app feel
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
        )
        page = context.new_page()

        print("Navigating to KYC Form...")
        # Assuming localhost:8080 based on previous checks
        page.goto("http://localhost:8080/#/kyc-form")
        page.wait_for_selector("text=Choose a document")

        print("Selecting PAN Card...")
        # Find the PAN Card element. Based on code, it has text "PAN Card"
        page.click("text=PAN Card")

        print("Clicking Continue...")
        page.click("button:has-text('Continue')")

        print("Waiting for Upload page...")
        page.wait_for_url("**/kyc-upload?doc=pan")
        page.wait_for_selector("input[placeholder='Document Number']")

        print("Entering invalid PAN...")
        page.fill("input[placeholder='Document Number']", "123")

        print("Checking for error message...")
        # Expect error message "Enter a valid PAN Card number"
        # The code sets error message in a p tag with text-red-500
        # Wait a bit for state to update
        page.wait_for_timeout(500)

        # Take screenshot
        page.screenshot(path="verification/kyc_pan_error.png")
        print("Screenshot saved to verification/kyc_pan_error.png")

        # Verify text content
        error_msg = page.locator("p.text-red-500").text_content()
        print(f"Error message found: '{error_msg}'")

        if "Enter a valid PAN Card number" in error_msg:
            print("SUCCESS: Error message is correct.")
        else:
            print("FAILURE: Error message is incorrect.")

        browser.close()

if __name__ == "__main__":
    verify_pan_error()
