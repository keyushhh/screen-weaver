from playwright.sync_api import sync_playwright, expect

def verify_address_details_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Determine the URL based on the log output, but since I can't read it dynamically easily inside python without passing it,
        # I'll rely on the fact that I saw 8081 in the log earlier.
        url = "http://localhost:8081/#/add-address-details"

        print(f"Navigating to {url}")
        page.goto(url)

        # Verify page content
        expect(page.get_by_text("Add New Address")).to_be_visible()
        expect(page.get_by_role("button", name="Save Address")).to_be_attached()

        # Scroll to bottom to ensure button is visible
        page.locator("div.overflow-y-auto").evaluate("node => node.scrollTop = node.scrollHeight")

        # Take screenshot
        screenshot_path = "verification/address_details_ui.png"
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    verify_address_details_ui()
