from playwright.sync_api import sync_playwright

def verify_ui_polish():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        page.goto("http://localhost:8080")
        page.wait_for_load_state("networkidle")

        # Take a screenshot
        page.screenshot(path="verification/ui_polish_home.png")
        print("Captured ui_polish_home.png")

        # --- Check Phone Input Screen ---

        # Check "Cash access, reimagined"
        subheading = page.get_by_text("Cash access, reimagined.")
        sub_style = subheading.evaluate("""el => {
            const s = window.getComputedStyle(el);
            return { fontSize: s.fontSize, fontWeight: s.fontWeight };
        }""")
        print(f"Subheading: {sub_style}") # Expect 18px, 400

        # Check "Let's get started!"
        heading = page.get_by_text("Let's get started!")
        heading_style = heading.evaluate("""el => {
            const s = window.getComputedStyle(el);
            return { fontSize: s.fontSize, fontWeight: s.fontWeight };
        }""")
        print(f"Heading: {heading_style}") # Expect 26px, 500

        # Check Button dimensions
        btn = page.get_by_role("button", name="Request OTP")
        btn_box = btn.bounding_box()
        print(f"Button Height: {btn_box['height']}") # Expect 48

        # Check Phone Input Height (approx)
        phone_input_div = page.locator(".input-surface").first
        input_box = phone_input_div.bounding_box()
        print(f"Input Height: {input_box['height']}") # Expect 48

        # --- Check OTP Screen ---

        # Enter number and go to next screen
        page.get_by_placeholder("Enter your mobile number").fill("9876543210")
        btn.click()
        page.wait_for_timeout(2000) # Wait for simulation

        page.screenshot(path="verification/ui_polish_otp.png")
        print("Captured ui_polish_otp.png")

        # Check OTP Slot Radius and Gap
        # Note: Gap is on the group container
        otp_group = page.locator("div[role='group']").first
        # We can check the gap style if applied via flex/grid

        # Check OTP slot border radius
        # Slot is likely an input or div inside the group
        # The code renders `InputOTPSlot` which are divs
        slot = otp_group.locator("div").first
        slot_radius = slot.evaluate("el => window.getComputedStyle(el).borderRadius")
        print(f"OTP Slot Radius: {slot_radius}") # Expect 7px

        # Check Error Text font
        # Trigger error
        verify_btn = page.get_by_role("button", name="Continue")
        # Need to fill OTP first to enable button? No, disabled logic is length < 6.
        # Fill wrong code
        page.keyboard.type("000000")
        verify_btn.click()
        page.wait_for_timeout(500)

        error_msg = page.get_by_text("That code's off target. Double-check your SMS.")
        err_style = error_msg.evaluate("""el => {
            const s = window.getComputedStyle(el);
            return { fontSize: s.fontSize, fontWeight: s.fontWeight };
        }""")
        print(f"Error Msg: {err_style}") # Expect 14px, 400

        browser.close()

if __name__ == "__main__":
    verify_ui_polish()
