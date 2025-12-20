from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Navigate to KYC Upload page using the correct port
    # Since it's HashRouter, we use /#/kyc-upload
    page.goto("http://localhost:8082/#/kyc-upload")

    # Wait for key elements to ensure page is loaded
    # Wait for "Upload Document" text
    expect(page.get_by_text("Upload Document")).to_be_visible()

    # Wait for the clear all button (conflict resolution check)
    clear_btn = page.get_by_text("Clear All")
    expect(clear_btn).to_be_visible()

    # Take a screenshot
    page.screenshot(path="verification/kyc_upload_verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
