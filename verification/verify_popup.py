from playwright.sync_api import sync_playwright

def verify_popup():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # iPhone 14 Pro viewport
        context = browser.new_context(viewport={"width": 393, "height": 852})
        page = context.new_page()

        try:
            # 1. Start at Add Card
            # Use the port we found earlier or let it fail and I'll check log again,
            # but I'll assume 8082 from previous turn or check server log
            page.goto("http://localhost:8082/#/cards/add")

            # 2. Fill inputs to enable Save
            page.fill('input[placeholder="XXXX XXXX XXXX XXXX"]', "5244 3156 7891 1203")
            # Fill Expiry
            page.fill('input[placeholder="MM/YY"]', "12/26")
            # Fill CVV
            page.fill('input[placeholder="XXX"]', "123")
            # Fill Name
            page.fill('input[placeholder="CARDHOLDER NAME"]', "TEST USER")

            # 3. Click Save Card
            # Wait for button to be enabled
            page.wait_for_selector("button:text('Save Card')", state="visible")
            page.click("button:text('Save Card')")

            # 4. Wait for My Cards page and Popup
            # Check for header
            page.wait_for_selector("text=Card Added Successfully")

            # 5. Screenshot
            page.screenshot(path="verification/success_popup.png")
            print("Screenshot captured: verification/success_popup.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_popup()
