from playwright.sync_api import sync_playwright
import time
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # The app uses HashRouter, so we navigate to the base URL and let it handle the hash
        # Wait a bit for the server to come up if needed
        time.sleep(2)

        # Navigate directly to the new page to test it in isolation first
        # Correct port found from server.log is 8080
        url = "http://localhost:8080/#/kyc-selfie"
        print(f"Navigating to {url}...")
        page.goto(url)

        # Wait for the specific elements of the new page
        print("Waiting for page content...")
        try:
            page.wait_for_selector("text=Verify your identity", timeout=10000)
            page.wait_for_selector("text=Step 3/4", timeout=5000)
            page.wait_for_selector("text=Take a clear selfie", timeout=5000)

            # Take screenshot of the new page
            print("Taking screenshot...")
            page.screenshot(path="verification/kyc_selfie.png")
            print("Screenshot saved to verification/kyc_selfie.png")

        except Exception as e:
            print(f"Error finding elements: {e}")
            page.screenshot(path="verification/error_kyc_selfie.png")

        browser.close()

if __name__ == "__main__":
    run()
