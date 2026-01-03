from playwright.sync_api import sync_playwright

def verify_account_deactivation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate iPhone 16 Pro dimensions (as per memory)
        context = browser.new_context(
            viewport={"width": 402, "height": 874},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
        )
        page = context.new_page()

        print("Navigating to Account Deactivated page...")
        # Direct navigation to capture the UI
        page.goto("http://localhost:8082/#/account-deactivated")

        # Wait for elements to load
        page.wait_for_selector("text=Deactivated")
        page.wait_for_selector("text=So we really are on a break, huh?")

        # Take screenshot
        screenshot_path = "verification/account_deactivated_ui.png"
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    verify_account_deactivation()
