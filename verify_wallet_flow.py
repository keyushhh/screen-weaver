import time
from playwright.sync_api import sync_playwright

def verify_wallet_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a mobile viewport
        context = browser.new_context(
            viewport={'width': 375, 'height': 812},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        )
        page = context.new_page()

        print("Navigating to Home...")
        # Navigate directly to home, bypassing potential auth redirects if possible,
        # or assuming the app lets us view home in dev mode.
        # If it redirects to '/', we might need to handle onboarding.
        # Let's try navigating to /#/home directly.
        page.goto("http://localhost:8080/#/home")

        # Wait for the page to settle
        time.sleep(5)

        # Check if we are on home or redirected to onboarding
        # If we see "Quick Actions" or the Wallet icon, we are good.
        try:
            # Look for the Wallet text or icon
            print("Checking for Wallet button...")
            wallet_btn = page.locator("text=Wallet")
            if not wallet_btn.is_visible():
                print("Wallet button not found immediately. Checking if we are on Onboarding.")
                # If on index/onboarding, we might need to simulate login or just force navigate for this verification
                # But let's assume we can interact.
                # If strictly testing the flow, we should be on Home.
                # Let's try to inject a mock session or just proceed if possible.
                # For now, if failed, we will force navigate to /#/home and try again or report.
                print("Current URL:", page.url)
        except Exception as e:
            print(f"Error finding wallet button: {e}")

        # Click Wallet
        print("Clicking Wallet...")
        page.locator("text=Wallet").click()

        # Expect to be on Wallet Intro (/wallet)
        print("Waiting for Wallet Intro...")
        page.wait_for_url("**/#/wallet")
        time.sleep(2)

        # Check for 'Get Started'
        print("Checking for Get Started button...")
        get_started_btn = page.locator("button:has-text('Get Started')")
        if get_started_btn.is_visible():
            print("Get Started button found.")
        else:
            print("Get Started button NOT found!")
            browser.close()
            return

        # Click Get Started
        print("Clicking Get Started...")
        get_started_btn.click()

        # Expect to be on Wallet Created (/wallet-created)
        print("Waiting for Wallet Created screen...")
        page.wait_for_url("**/#/wallet-created")
        time.sleep(2)

        # Verify elements on Wallet Created
        print("Verifying Wallet Created elements...")
        balance_visible = page.locator("text=WALLET BALANCE").is_visible()
        history_visible = page.locator("text=Transaction History").is_visible()

        if balance_visible and history_visible:
            print("SUCCESS: Wallet Created screen verified!")
        else:
            print(f"FAILURE: Elements missing. Balance: {balance_visible}, History: {history_visible}")

        # Screenshot
        print("Taking screenshot...")
        page.screenshot(path="wallet_flow_verification.png")

        browser.close()

if __name__ == "__main__":
    verify_wallet_flow()
