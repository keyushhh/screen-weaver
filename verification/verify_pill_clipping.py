
from playwright.sync_api import sync_playwright
import time

def verify_pill_clipping():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 402, 'height': 874}
        )
        page = context.new_page()

        # Seed data
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

        # Enable button with amount
        page.click('button:has-text("5")')
        page.click('button:has-text("0")')
        page.click('button:has-text("0")')

        # Navigate
        page.click('button:has-text("Place Order")')
        time.sleep(2)

        # Expand Tip
        page.click('text=To Pay')
        time.sleep(1)
        page.click('text=Add Tip')
        time.sleep(1)

        # Screenshot 20 pill (unselected, has banner)
        page.screenshot(path='verification/pill_20_clipping.png')

        browser.close()

if __name__ == '__main__':
    verify_pill_clipping()
