from playwright.sync_api import sync_playwright

def verify_kyc_intro():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 393, "height": 852})
        page = context.new_page()

        try:
            # Navigate to the intro page
            page.goto("http://localhost:3000/#/kyc-intro")

            # Wait for content
            page.wait_for_selector("text=Higher Wallet Limits")

            # Check for the back button (top left)
            # The back button is a button inside a div with flex
            # It has a ChevronLeft icon
            back_btn = page.locator("button").first
            # Verify it exists
            if not back_btn.is_visible():
                print("Back button not found!")
            else:
                print("Back button is visible.")

            # Check bullet alignment
            # We will take a screenshot to visually verify
            page.screenshot(path="verification/kyc_intro_verified.png")
            print("Screenshot saved to verification/kyc_intro_verified.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_kyc_intro()
