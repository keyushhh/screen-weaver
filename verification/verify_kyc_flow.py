from playwright.sync_api import sync_playwright
import time
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Server port should be 8080 based on previous run
        url = "http://localhost:8080/#/kyc-selfie"
        print(f"Navigating to {url}...")
        page.goto(url)

        # 1. Open Camera
        print("Clicking Open Camera...")
        page.click("text=Open Camera")

        # Wait for camera UI
        time.sleep(1)
        print("Taking screenshot of Camera UI...")
        page.screenshot(path="verification/kyc_camera_ui.png")

        # 2. Click Shutter
        print("Clicking Shutter...")
        # Since I didn't add an ID/role to the shutter button, I'll find it by the image alt text or just use a selector
        # Based on code: img alt="Capture" inside a button
        page.click("img[alt='Capture']")

        # 3. Verify Result
        time.sleep(1)
        print("Verifying result UI...")
        try:
            page.wait_for_selector("text=You didn’t have to snap this hard", timeout=5000)
            print("Found result text.")

            # Verify Continue button exists
            page.wait_for_selector("text=Continue", timeout=5000)
            print("Found Continue button.")

            print("Taking screenshot of Result UI...")
            page.screenshot(path="verification/kyc_selfie_result.png")

        except Exception as e:
            print(f"Error finding elements: {e}")
            page.screenshot(path="verification/error_kyc_selfie_result.png")

        browser.close()

if __name__ == "__main__":
    run()
