
import os
import time
from playwright.sync_api import sync_playwright, expect

def verify_modal_styles():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a mobile viewport
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
        )
        page = context.new_page()

        # Direct override since previous detection failed or was flaky
        base_url = "http://localhost:8080/#"
        print(f"Connecting to {base_url}")

        try:
            page.goto(f"{base_url}/cards")
            page.wait_for_selector("text=My Cards", timeout=5000)
        except Exception as e:
            print(f"Failed to load page: {e}")
            return

        # Inject state to ensure we have cards to test with
        page.evaluate("""() => {
            const cards = [
                { id: 'c1', number: '4242424242424242', holder: 'JOHN DOE', expiry: '12/25', cvv: '123', type: 'visa', isDefault: false, backgroundIndex: 1 },
                { id: 'c2', number: '5555555555555555', holder: 'JANE SMITH', expiry: '10/24', cvv: '456', type: 'mastercard', isDefault: true, backgroundIndex: 2 }
            ];
            localStorage.setItem('dotpe_user_cards', JSON.stringify(cards));
        }""")
        page.reload()

        # Wait for cards to load
        page.wait_for_selector(".card-wrapper")
        print("Cards loaded")

        # NOTE: The default card (c2) might be overlaying c1 in stacked mode.
        # We need to click the stack wrapper, not necessarily the text inside, to be safe.
        # Or force "unstack" programmatically or click the visible top card.

        # Click the top card (c2, JANE SMITH) to unstack
        page.locator("#card-wrapper-c2").click(force=True)
        print("Clicked stack to expand")
        time.sleep(1) # Wait for unstack animation

        # Now click c1 (JOHN DOE) which should be visible in list view
        page.locator("#card-wrapper-c1").click(force=True)
        print("Clicked card c1 to expand menu")
        time.sleep(1)

        # 3. Click "Set as Default"
        print("Clicking Set as Default")
        # Use force=True to bypass potential overlap issues
        page.click("text=Set as Default?", force=True)
        time.sleep(1) # Wait for modal

        # 4. Take Screenshot of Default Modal
        page.screenshot(path="verification/default_modal_new.png")
        print("Captured verification/default_modal_new.png")

        # 5. Close Modal
        page.click("text=Cancel", force=True)
        time.sleep(0.5)

        # 6. Click "Remove Card"
        print("Clicking Remove Card")
        page.click("text=Remove Card", force=True)
        time.sleep(1)

        # 7. Take Screenshot of Remove Modal
        page.screenshot(path="verification/remove_modal_new.png")
        print("Captured verification/remove_modal_new.png")

        browser.close()

if __name__ == "__main__":
    verify_modal_styles()
