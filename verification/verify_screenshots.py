from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Home Error State
        page.goto("http://localhost:8080")
        page.wait_for_selector("text=Let's get started!")

        # Trigger Home Error (Type partial and click? Or just verify empty state disabled?)
        # User wants to see the error. I'll type partial.
        page.get_by_placeholder("Enter your mobile number").fill("123")
        page.get_by_role("button", name="Request OTP").click()

        # Capture Home Error
        page.screenshot(path="verification/home_error.png")
        print("Captured home_error.png")

        # 2. OTP Error State
        # Fix input
        page.get_by_placeholder("Enter your mobile number").fill("9876543210")
        page.get_by_role("button", name="Request OTP").click()

        page.wait_for_selector("text=Enter your OTP")

        # Trigger OTP Error (Wrong code)
        page.keyboard.type("123450")
        page.get_by_role("button", name="Continue", exact=True).click()

        # Capture OTP Error
        page.screenshot(path="verification/otp_error.png")
        print("Captured otp_error.png")

        browser.close()

if __name__ == "__main__":
    run()
