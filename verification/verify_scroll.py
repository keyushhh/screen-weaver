from playwright.sync_api import sync_playwright

def verify_scroll_opacity():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use iPhone dimensions
        context = browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()

        # Navigate
        page.goto("http://localhost:8082/#/add-address-details")
        page.wait_for_timeout(2000)

        # Inject spacer into the main container
        # We find the main container by finding the h1 and going up to the overflowing div
        page.evaluate("""
            const headerH1 = Array.from(document.querySelectorAll('h1')).find(el => el.textContent.includes('Add New Address'));
            if (headerH1) {
                // h1 -> header div -> safe-area div -> main container
                const container = headerH1.parentElement.parentElement.parentElement;

                // Verify this is indeed the scroll container
                if (window.getComputedStyle(container).overflowY === 'auto') {
                   const spacer = document.createElement('div');
                   spacer.style.height = '1000px';
                   spacer.textContent = 'Forced Scroll Spacer';
                   // Append to the safe-area div so it flows in the container
                   headerH1.parentElement.parentElement.appendChild(spacer);
                   console.log("Spacer injected");
                } else {
                   console.error("Could not find scroll container");
                }
            }
        """)

        page.wait_for_timeout(500)

        # Scroll the container
        page.evaluate("""
            const headerH1 = Array.from(document.querySelectorAll('h1')).find(el => el.textContent.includes('Add New Address'));
            const container = headerH1.parentElement.parentElement.parentElement;
            container.scrollTo(0, 100);
        """)

        page.wait_for_timeout(1000)

        # Check opacity
        opacity = page.evaluate("""
            (() => {
                const headerH1 = Array.from(document.querySelectorAll('h1')).find(el => el.textContent.includes('Add New Address'));
                const header = headerH1.parentElement;
                return window.getComputedStyle(header).opacity;
            })()
        """)
        print(f"Final Opacity after 100px scroll: {opacity}")

        browser.close()

if __name__ == "__main__":
    verify_scroll_opacity()
