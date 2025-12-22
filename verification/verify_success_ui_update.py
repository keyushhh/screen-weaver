import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()

        # Set viewport to mobile size
        await page.set_viewport_size({"width": 375, "height": 812})

        # Base URL - updating to port 8084 as found in logs, but will try multiple if needed
        base_url = "http://localhost:8084"

        # Navigate directly to the success page
        print(f"Navigating to {base_url}/#/kyc-success")
        try:
            await page.goto(f"{base_url}/#/kyc-success", timeout=10000)
        except Exception as e:
             print(f"Failed to load page: {e}")
             await browser.close()
             return

        # Wait for the main elements to load
        try:
            # Check for header
            await page.wait_for_selector("text=KYC", timeout=5000)
            print("Header found.")

            await page.wait_for_selector("text=Your KYC details has been submitted successfully!", timeout=5000)
            print("Main title found.")

            await page.wait_for_selector("text=Redirecting Home in", timeout=5000)
            print("Countdown button text found.")

            await page.wait_for_selector("text=(Because refreshing the screen won’t make it go faster.)", timeout=5000)
            print("Disclaimer 1 found.")

            await page.wait_for_selector("text=If accepted, you’ll officially be one of us. If rejected... it’s probably your lighting.", timeout=5000)
            print("Footer disclaimer found.")

            # Take a screenshot
            screenshot_path = "verification/success_screen_v2.png"
            await page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")

        except Exception as e:
            print(f"Verification failed: {e}")
            await page.screenshot(path="verification/error_success_screen.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
