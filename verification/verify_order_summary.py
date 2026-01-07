
from playwright.sync_api import sync_playwright
import time

def verify_order_cash_summary():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 402, 'height': 874}
        )
        page = context.new_page()

        # Seed data - using port 8082 based on lsof
        page.goto('http://localhost:8082/')
        page.evaluate('''() => {
            localStorage.setItem('dotpe_user_state', JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                phoneNumber: '9999999999',
                kycStatus: 'complete'
            }));
        }''')

        page.goto('http://localhost:8082/#/order-cash')

        # Click 5, 0, 0 to enter 500
        page.click('button:has-text("5")')
        page.click('button:has-text("0")')
        page.click('button:has-text("0")')

        page.click('button:has-text("Place Order")')

        time.sleep(2)

        # Open To Pay dropdown
        page.click('text=To Pay')
        time.sleep(1)

        # Expand Tip
        page.click('text=Add Tip')
        time.sleep(1)

        # Select 20 tip
        page.click('text=₹20')
        time.sleep(1)

        # Screenshot 1: Tip Applied
        page.screenshot(path='verification/tip_applied.png')

        # Clear Tip - using a more robust selector for the cross icon
        # It is inside the button with text ₹20
        # The cross icon is an img with src containing cross-icon
        page.click('button:has-text("₹20") >> img[alt="Remove"]')
        time.sleep(1)

        # Screenshot 2: Tip Cleared
        page.screenshot(path='verification/tip_cleared.png')

        browser.close()

if __name__ == '__main__':
    verify_order_cash_summary()
