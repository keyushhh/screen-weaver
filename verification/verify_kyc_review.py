from playwright.sync_api import sync_playwright, expect
import os
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 375, 'height': 812},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        )
        page = context.new_page()

        # Try multiple ports just in case
        ports = [8081, 3000, 8080, 8082, 5173]
        base_url = None

        for port in ports:
            try:
                url = f"http://localhost:{port}"
                page.goto(url, timeout=2000)
                base_url = url
                print(f"Connected to {url}")
                break
            except:
                continue

        if not base_url:
            print("Could not connect to localhost on any common port.")
            return

        # Navigate directly to the review page
        print(f"Navigating to {base_url}/#/kyc-review")
        page.goto(f"{base_url}/#/kyc-review")

        # Wait for key elements to ensure page loaded
        page.wait_for_selector("text=Review & Submit")
        page.wait_for_selector("#scroll-container")

        # Scroll to the bottom to verify padding clears the footer
        page.evaluate("document.querySelector('#scroll-container').scrollTo(0, document.querySelector('#scroll-container').scrollHeight)")

        # Small wait for scroll to settle
        time.sleep(0.5)

        # Take a screenshot
        screenshot_path = os.path.join(os.getcwd(), "verification", "kyc_review.png")
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    run()
