import time
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Pre-populate localStorage
    page.goto("http://localhost:8082/")
    page.evaluate("""
        localStorage.setItem('dotpe_user_state', JSON.stringify({
            phoneNumber: '9999999999',
            name: 'Test User',
            email: 'test@example.com',
            emailVerified: true,
            kycStatus: 'complete'
        }));
    """)
    page.reload()

    page.goto("http://localhost:8082/#/order-cash-success")
    time.sleep(3)

    # Try to find the menu button
    try:
        page.wait_for_selector('img[alt="Menu"]', timeout=5000)
        page.click('img[alt="Menu"]')
        time.sleep(1)

        # Verify cancel option visible
        page.click('text=Cancel Order')
        time.sleep(1)
        page.screenshot(path="verification/cancel_popup_v2.png")
        print("Cancel Popup V2 Verified")

    except Exception as e:
        print(f"Error: {e}")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
