
from playwright.sync_api import sync_playwright
import time

def verify_issues():
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

        # Expand Tip (Click Add Tip)
        page.click('text=Add Tip')
        time.sleep(1)

        # Check Pill Sizing - Select 20
        page.click('text=₹20')
        time.sleep(1)

        # Screenshot Pills
        page.screenshot(path='verification/pills_selected.png')

        # Check Add Tip Obstruction
        # Select Other
        page.click('text=Other')
        time.sleep(0.5)
        # Type 50
        page.fill('input[placeholder="Enter tip amount"]', '50')
        page.click('text=Apply')
        time.sleep(0.5)

        # Now clear it via the Cross on the Other pill?
        # Or clear via custom input clear?
        # The user says "when we clear the tip".
        # The cross icon on 'Other' pill is visible when selected.
        page.click('button:has-text("Other") >> img[alt="Remove"]')
        time.sleep(1)

        # Screenshot To Pay area
        # We want to focus on the 'Delivery Tip' row
        page.screenshot(path='verification/to_pay_cleared.png')

        browser.close()

if __name__ == '__main__':
    verify_issues()
