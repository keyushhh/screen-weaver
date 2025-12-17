import re
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # 1. Navigate to page
        page.goto("http://localhost:8080")
        page.wait_for_selector("text=Let's get started!")
        print("Page loaded.")

        # 2. Check Request OTP Button Disabled on Empty
        req_btn = page.get_by_role("button", name="Request OTP")
        expect(req_btn).to_be_disabled()
        print("Request OTP button disabled when empty.")

        # 3. Enter partial number
        phone_input = page.get_by_placeholder("Enter your mobile number")
        phone_input.fill("123")
        # Button should be enabled now?
        # Code: disabled={isLoading || phoneNumber.length === 0}
        # "123" length is 3. So enabled.
        expect(req_btn).to_be_enabled()
        print("Request OTP button enabled for partial input.")

        # 4. Click -> Expect Error
        req_btn.click()
        error_text = page.get_by_text("Don't ghost us, drop your number.")
        expect(error_text).to_be_visible()
        # Check red border on input wrapper (PhoneInput div)
        # The div has class 'input-surface'.
        # We look for the border-red-500 class.
        phone_input_wrapper = page.locator(".input-surface")
        expect(phone_input_wrapper).to_have_class(re.compile(r"border-red-500"))
        print("Phone error visible and red border applied.")

        # 5. Enter valid number
        phone_input.fill("9876543210")
        expect(error_text).not_to_be_visible() # Error clears on change
        req_btn.click()

        # 6. Wait for OTP Screen
        page.wait_for_selector("text=Enter your OTP")
        print("OTP Screen loaded.")

        # 7. Check Continue Button Disabled on Empty/Partial
        cont_btn = page.get_by_role("button", name="Continue", exact=True)
        # Code: disabled={isLoading || otp.length < 6}
        expect(cont_btn).to_be_disabled()

        otp_input = page.locator("input[data-input-otp]") # Shadcn OTP input hidden input
        # Note: Shadcn OTP usually focuses automatically. We can simulate typing.
        page.keyboard.type("12345") # 5 digits
        expect(cont_btn).to_be_disabled()
        print("Continue button disabled for partial OTP.")

        # 8. Enter 6th digit (Wrong code)
        page.keyboard.type("0") # Total "123450"
        expect(cont_btn).to_be_enabled()
        cont_btn.click()

        # 9. Expect Error
        otp_error_text = page.get_by_text("That code's off target. Double-check your SMS.")
        expect(otp_error_text).to_be_visible()

        # Check slot border
        # The slots have class 'border-red-500' when error.
        # We can check one of the slots.
        # We target the slots by the unique dimensions we gave them
        slot0 = page.locator(".h-14.w-12").first
        # Note: My code adds 'border border-red-500 ring-1 ring-red-500' to className of slot.
        # shadcn slot class names are dynamic but should contain my added classes.
        expect(slot0).to_have_class(re.compile(r"border-red-500"))
        print("OTP error visible and red border applied.")

        # 10. Fix OTP
        # Simulate deleting and retyping?
        # Or just verify the error shows.
        # Let's type correct OTP.
        # We need to clear or overwrite.
        # Shadcn OTP behavior: backspace 6 times
        for _ in range(6):
            page.keyboard.press("Backspace")

        page.keyboard.type("123456")

        # In the current code, setting OTP resets error immediately.
        # verify error is gone
        expect(otp_error_text).not_to_be_visible() # Error clears on change
        cont_btn.click()

        # 11. Success?
        # My code currently just logs to console.
        # But verify no error.
        expect(otp_error_text).not_to_be_visible()
        print("Correct OTP submitted.")

        browser.close()

if __name__ == "__main__":
    run()
