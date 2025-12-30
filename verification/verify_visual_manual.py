from playwright.sync_api import sync_playwright, expect
import socket
import time

def verify_visual_manual():
    # Detect port
    port = 3000
    for p in [3000, 5173, 8080, 8081, 8082, 8083, 8084]:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('localhost', p)) == 0:
                port = p
                break

    url = f"http://localhost:{port}/#/banking/add"
    print(f"Navigating to {url}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # iPhone 13 viewport for consistency
        page = browser.new_page(viewport={"width": 390, "height": 844})

        try:
            page.goto(url)
            page.wait_for_selector("text=Add bank account manually")

            # Select Manual
            page.get_by_text("Add bank account manually").click()

            # Fill form
            page.get_by_placeholder("Account Number", exact=True).fill("1234567890")
            page.get_by_placeholder("Confirm Account Number", exact=True).fill("1234567890")

            # Invalid IFSC to show error/empty state first? No, let's show success state.
            ifsc = page.get_by_placeholder("IFSC Code", exact=True)
            ifsc.fill("HDFC0001234")

            # Wait for "HDFC Bank" to appear
            expect(page.get_by_text("HDFC Bank")).to_be_visible()

            # Wait a bit for animations
            time.sleep(0.5)

            # Take screenshot
            screenshot_path = "verification/manual_flow_verified.png"
            page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")

        finally:
            browser.close()

if __name__ == "__main__":
    verify_visual_manual()
