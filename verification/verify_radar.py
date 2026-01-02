from playwright.sync_api import sync_playwright, expect
import time

def verify_radar_size():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate iPhone 16 Pro dimensions (approx)
        context = browser.new_context(
            viewport={'width': 402, 'height': 874},
            device_scale_factor=3,
            is_mobile=True,
            has_touch=True
        )
        page = context.new_page()

        # Navigate to home
        page.goto("http://localhost:5173/")

        # Wait for app to load and navigate to Settings
        page.get_by_text("Settings").click()

        # Click "Check Security" to go to Security Dashboard
        page.get_by_text("Check Security").click()

        # Wait for the dashboard to load
        page.wait_for_selector("text=Security & KYC")

        # Take a screenshot of the radar area specifically to verify size
        # We can also just take the full page
        time.sleep(1) # Let animation render

        page.screenshot(path="verification/security_dashboard_radar_254.png")

        # Verify the container size using evaluate
        # The Lottie container is the parent div of the SVG
        # In my code: <div className="w-[254px] h-[254px] ...">
        # Let's find it. It's inside a flex-1 container.

        container_size = page.evaluate("""() => {
            const lotties = document.querySelectorAll('div[class*="w-[254px]"]');
            if (lotties.length > 0) {
                const rect = lotties[0].getBoundingClientRect();
                return { width: rect.width, height: rect.height };
            }
            return null;
        }""")

        print(f"Detected Radar Container Size: {container_size}")

        browser.close()

if __name__ == "__main__":
    verify_radar_size()
