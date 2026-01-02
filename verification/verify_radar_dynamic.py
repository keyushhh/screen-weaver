import pytest
from playwright.sync_api import sync_playwright, expect

def test_security_dashboard_radar_dynamic():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 402, "height": 874})

        # --- State 1: Incomplete (Security Breach-ish) -> Expect error.json ---
        page = context.new_page()
        # Set localStorage for Incomplete
        page.goto("http://localhost:8085/#/security-dashboard")
        page.evaluate("window.localStorage.setItem('dotpe_user_state', JSON.stringify({kycStatus: 'incomplete'}))")
        page.reload()
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/dashboard_incomplete_radar.png", full_page=True)

        # --- State 2: Pending (In Progress) -> Expect in-progress.json ---
        # Set localStorage for Pending
        page.evaluate("window.localStorage.setItem('dotpe_user_state', JSON.stringify({kycStatus: 'pending'}))")
        page.reload()
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/dashboard_pending_radar.png", full_page=True)

        # --- State 3: Complete (Looks Good) -> Expect dotpe-radar.json ---
        # Set localStorage for Complete
        page.evaluate("window.localStorage.setItem('dotpe_user_state', JSON.stringify({kycStatus: 'complete'}))")
        page.reload()
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/dashboard_complete_radar.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    test_security_dashboard_radar_dynamic()
