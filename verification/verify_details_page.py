import time
from playwright.sync_api import sync_playwright, expect

def verify_add_address_details():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create a context with viewport to match the mobile screenshots (approx iPhone size)
        context = browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()

        print("Navigating to Add Address page...")
        # Server running on 8080 as discovered
        page.goto("http://localhost:8080/#/add-address")

        # Wait for map to load (simulated wait as map loading might take time)
        page.wait_for_timeout(3000)

        print("Zooming in to enable button...")
        # We can try to zoom by double clicking the map center multiple times
        map_el = page.locator(".maplibregl-canvas")
        if map_el.count() > 0:
            bbox = map_el.bounding_box()
            if bbox:
                cx = bbox["x"] + bbox["width"] / 2
                cy = bbox["y"] + bbox["height"] / 2
                page.mouse.dblclick(cx, cy)
                page.wait_for_timeout(1000)
                page.mouse.dblclick(cx, cy)
                page.wait_for_timeout(1000)

        # Check if button is visible
        confirm_btn = page.get_by_role("button", name="Confirm Location")
        if confirm_btn.is_visible():
            print("Confirm button visible. Clicking...")
            confirm_btn.click()

            print("Waiting for Details page...")
            expect(page).to_have_url("http://localhost:8080/#/add-address-details")

            # Allow animations to settle
            page.wait_for_timeout(1000)

            # Verify elements on the new page
            print("Verifying Details Page elements...")
            expect(page.get_by_text("Add New Address")).to_be_visible()
            expect(page.get_by_text("Save address as*")).to_be_visible()
            expect(page.get_by_placeholder("House / Flat / Floor *")).to_be_visible()

            # Interact with input to test font change
            input_house = page.get_by_placeholder("House / Flat / Floor *")
            input_house.fill("Flat 101")

            # Take screenshot
            screenshot_path = "verification/add_address_details.png"
            page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")

        else:
            print("Could not trigger Confirm Location button. Taking debug screenshot.")
            page.screenshot(path="verification/debug_map.png")
            # Fallback: Navigate directly to check the UI even if flow failed
            print("Navigating directly to details page for UI check...")
            # We need to inject state for it to render correctly
            page.evaluate("""
                window.location.hash = '#/add-address-details';
                history.replaceState({
                    usr: {},
                    key: 'test',
                    state: {
                        addressTitle: 'Bangalore, India',
                        addressLine: 'C-102, Lotus Residency, JP Nagar',
                        plusCode: '7MRH5Q5C+CX',
                        city: 'Bangalore',
                        state: 'Karnataka',
                        postcode: '560078'
                    }
                }, '');
            """)
            page.reload()
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/add_address_details_direct.png")
            print("Direct navigation screenshot saved.")

        browser.close()

if __name__ == "__main__":
    verify_add_address_details()
