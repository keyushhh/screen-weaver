from playwright.sync_api import sync_playwright

def verify_kyc_intro_back():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 393, "height": 852})
        page = context.new_page()

        try:
            # 1. Start at KYC Intro
            page.goto("http://localhost:8082/#/kyc-intro")

            # Check we are on KYC Intro
            page.wait_for_selector("text=Complete your eKYC")

            # 2. Click Back Button (Header)
            page.click("button >> nth=0")

            # 3. Verify we are on Settings
            # Settings page has "Security & KYC" text or title
            page.wait_for_selector("text=Settings") # Assuming header "Settings"
            print("Successfully navigated back to Settings")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_kyc_intro_back()
