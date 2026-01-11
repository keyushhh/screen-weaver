from playwright.sync_api import sync_playwright

def verify_address_details():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a mobile viewport
        context = browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()

        # Mock local storage if needed or navigate directly
        # Since AddAddressDetails relies on location.state, we might need to mock the navigation
        # OR navigate from AddAddress if possible.
        # But easier: Inject state directly via script if we can, or just mock the route.
        # Actually, let"s try to navigate to the route.
        # The app uses HashRouter, so we can try navigating to /#/add-address-details
        # But we need to pass state.

        # We can use page.evaluate to push state to history and then reload or render?
        # A better way is to load the app, and then manually trigger navigation via console or UI.

        # Let"s load the app first
        page.goto("http://localhost:8081/")
        page.wait_for_timeout(2000)

        # We can execute a script to navigate with state
        # "window.history.pushState({ addressLine: \"123 Test St\", city: \"Test City\", state: \"Test State\", postcode: \"123456\" }, \"\", \"#/add-address-details\");"
        # "window.dispatchEvent(new PopStateEvent(\"popstate\"));"
        # React Router might not pick this up easily without using the router"s own navigation.

        # Alternative: Go to add address, click confirm.
        # But that requires map interaction which is flaky in headless.

        # Let"s try to inject a simple component or just navigate and see if it crashes without state.
        # The code handles "initialState" being null gracefully (useEffect checks it).

        # Let"s just navigate to the page and verify layout (padding)
        page.goto("http://localhost:8081/#/add-address-details")
        page.wait_for_timeout(2000)

        # 1. Verify bottom padding
        # We can check the computed style of the main container
        # The main container is the first div under #root usually?
        # Or look for text "Add New Address" and find its container.

        # Let"s take a screenshot first to see if it loaded
        page.screenshot(path="verification/verify_details_padding.png")

        # 2. Verify scroll opacity logic
        # We need to inject content to make it scrollable if it is not.
        # The page has some inputs, might not be enough to scroll on 844px height?
        # "pb-10" + content.
        # Let"s inject some tall content to force scroll.
        page.evaluate("""
            const div = document.createElement("div");
            div.style.height = "1000px";
            div.innerText = "Spacer";
            document.querySelector(".space-y-\\[10px\\]").appendChild(div);
        """)

        # Scroll down
        page.mouse.wheel(0, 100)
        page.wait_for_timeout(500)

        # Take screenshot of header (should be faded)
        page.screenshot(path="verification/verify_details_faded.png")

        # Scroll back up
        page.mouse.wheel(0, -100)
        page.wait_for_timeout(500)

        # Take screenshot of header (should be visible)
        page.screenshot(path="verification/verify_details_visible.png")

        browser.close()

if __name__ == "__main__":
    verify_address_details()
