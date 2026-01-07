
from playwright.sync_api import sync_playwright
import time

def verify_pill_layout_v2():
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

        # We need to enter amount > 500 to enable button
        page.click('button:has-text("5")')
        page.click('button:has-text("0")')
        page.click('button:has-text("0")')

        # Place order to get to summary
        page.click('button:has-text("Place Order")')
        time.sleep(2)

        # Expand To Pay
        page.click('text=To Pay')
        time.sleep(1)

        # Expand Tip
        page.click('text=Add Tip')
        time.sleep(1)

        # Screenshot 1: Default state (20 has banner, unselected)
        page.screenshot(path='verification/pill_20_unselected.png')

        # Select 20
        page.click('text=₹20')
        time.sleep(1)

        # Screenshot 2: 20 Selected (Banner + Cross)
        page.screenshot(path='verification/pill_20_selected_v2.png')

        browser.close()

if __name__ == '__main__':
    verify_pill_layout_v2()
