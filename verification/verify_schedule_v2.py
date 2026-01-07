
import os
import time
from playwright.sync_api import sync_playwright, expect

def verify_schedule_delivery():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Use port 8080 as discovered previously
        url = "http://localhost:8080/#/schedule-delivery"
        print(f"Navigating to {url}")

        try:
            page.goto(url)

            # Wait for content
            page.wait_for_selector("text=Schedule Delivery", timeout=10000)
            page.wait_for_selector("text=Time")

            # Screenshot Initial State (AM Default)
            page.screenshot(path="verification/schedule_delivery_am_v2.png")
            print("Captured AM state (v2).")

            # Click PM switch
            page.get_by_role("button", name="PM").click()

            # Wait a moment for React state update
            time.sleep(1)

            # Screenshot PM State
            page.screenshot(path="verification/schedule_delivery_pm_v2.png")
            print("Captured PM state (v2).")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_schedule_delivery()
