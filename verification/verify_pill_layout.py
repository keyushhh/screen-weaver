
from playwright.sync_api import sync_playwright
import time

def verify_pill_layout():
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

        # Click 5, 0, 0
        page.click('button:has-text("5")')
        page.click('button:has-text("0")')
        page.click('button:has-text("0")')

        page.click('button:has-text("Place Order")')
        time.sleep(2)

        # Expand To Pay
        page.click('text=To Pay')
        time.sleep(1)

        # Expand Tip
        page.click('text=Add Tip')
        time.sleep(1)

        # Select 20
        page.click('text=₹20')
        time.sleep(1)

        # Screenshot 1: 20 Selected
        page.screenshot(path='verification/pill_layout_20_selected.png')

        # Select Other
        page.click('text=Other')
        time.sleep(1)

        # Screenshot 2: Other Selected
        page.screenshot(path='verification/pill_layout_other_selected.png')

        browser.close()

if __name__ == '__main__':
    verify_pill_layout()
