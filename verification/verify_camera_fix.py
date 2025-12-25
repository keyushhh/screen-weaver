from playwright.sync_api import sync_playwright

def verify_camera_fix():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 393, "height": 852})
        page = context.new_page()

        try:
            # 1. Check Camera Page
            page.goto("http://localhost:8082/#/camera-page")

            # Check for specific text
            page.wait_for_selector("text=Align your card within the frame")

            # Screenshot Camera Page
            page.screenshot(path="verification/camera_fix.png")
            print("Screenshot captured: verification/camera_fix.png")

            # 2. Check KYC Form Back Button
            # Navigate to KYC Form
            page.goto("http://localhost:8082/#/kyc-form")

            # Click Back Button
            # The back button is the first button in the header
            page.click("button >> nth=0")

            # Verify we are at KYC Intro
            # Wait for URL to change or element specific to Intro
            # Intro has "Complete your eKYC" text
            page.wait_for_selector("text=Complete your eKYC")
            print("Successfully navigated back to KYC Intro")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_camera_fix()
