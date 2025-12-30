import os
import time
from playwright.sync_api import sync_playwright

def verify_banking_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 402, "height": 874})
        page = context.new_page()

        page.goto("http://localhost:8081/#/banking")
        time.sleep(2)

        # Inject 2 Accounts: 1 Default (HDFC), 1 Non-Default (IDFC)
        # This allows us to see both states.
        # We need to click "Expanded" to see the non-default one clearly or just rely on stack view peek.
        # Ideally, we verify the Expanded view logic to check padding.

        local_storage_script = """
        const accounts = [
            {
                id: "1",
                bankName: "HDFC Bank",
                accountType: "Savings Account",
                accountNumber: "12345678901234",
                ifsc: "HDFC0001234",
                branch: "HDFC Bank, Koramangala Branch",
                logo: "",
                isDefault: true,
                backgroundIndex: 0
            },
            {
                id: "2",
                bankName: "IDFC Bank",
                accountType: "Current Account",
                accountNumber: "98765432109876",
                ifsc: "IDFC0004321",
                branch: "IDFC Bank, Indiranagar Branch",
                logo: "",
                isDefault: false,
                backgroundIndex: 1
            }
        ];
        localStorage.setItem("dotpe_user_bank_accounts", JSON.stringify(accounts));
        """
        page.evaluate(local_storage_script)
        page.reload()
        time.sleep(2)

        # Click to unstack/expand
        # The main container (or card wrapper) click handler toggles stack
        # `onClick={() => { if (!isStacked) setIsStacked(true); }}` on main div
        # `onClick={(e) => handleAccountClick(e, account.id)}` on card wrapper toggles selection or stack

        # Click the first card to unstack
        page.locator(".account-wrapper").first.click()
        time.sleep(1)

        page.screenshot(path="verification/banking_ui_check_stack.png")
        print("Screenshot taken: verification/banking_ui_check_stack.png")
        browser.close()

if __name__ == "__main__":
    verify_banking_ui()
