from playwright.sync_api import sync_playwright, expect
import time

def verify_order_cash_summary():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # iPhone 12 viewport for mobile view
        context = browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()

        # Seed data
        page.add_init_script("""
            localStorage.setItem('dotpe_user_state', JSON.stringify({
                phoneNumber: '9876543210',
                name: 'Test User',
                email: 'test@example.com',
                emailVerified: true,
                kycStatus: 'complete',
                biometricEnabled: false
            }));
            localStorage.setItem('dotpe_user_cards', '[]');
            localStorage.setItem('dotpe_user_bank_accounts', '[]');
        """)

        try:
            # Go to Order Cash page
            page.goto("http://localhost:8080/#/order-cash")
            page.wait_for_load_state("networkidle")

            # The amount display is just text, not an input.
            # We need to click the keypad buttons.
            # "5" "0" "0" "0"
            page.get_by_role("button", name="5", exact=True).click()
            page.get_by_role("button", name="0", exact=True).click()
            page.get_by_role("button", name="0", exact=True).click()
            page.get_by_role("button", name="0", exact=True).click()

            # Click Place Order
            page.get_by_role("button", name="Place Order").click()

            # Wait for navigation to summary
            page.wait_for_url("**/order-cash-summary")
            page.wait_for_load_state("networkidle")

            # Scroll to bottom to verify padding and visibility
            page.evaluate("document.querySelector('.overflow-y-auto').scrollTo(0, 1000)")
            page.wait_for_timeout(1000)

            # Take screenshot
            page.screenshot(path="verification/order_cash_summary_fixed.png", full_page=True)
            print("Captured OrderCashSummary screenshot")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_order_cash_summary()
