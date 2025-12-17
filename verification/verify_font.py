from playwright.sync_api import sync_playwright

def verify_font():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        page.goto("http://localhost:8080")

        # Wait for the page to load
        page.wait_for_load_state("networkidle")

        # Take a screenshot
        page.screenshot(path="verification/font_check.png")
        print("Captured font_check.png")

        # Check computed font family for the body or a specific element
        # We'll check the 'Request OTP' button or the main heading
        heading = page.get_by_text("Let's get started!")
        computed_font = heading.evaluate("el => window.getComputedStyle(el).fontFamily")
        print(f"Computed font family: {computed_font}")

        browser.close()

if __name__ == "__main__":
    verify_font()
