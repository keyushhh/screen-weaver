
import { test, expect } from '@playwright/test';

test('Verify Order Cancelled Flow', async ({ page }) => {
  // Navigate to domain to enable localStorage. Use 8080 as per server log.
  await page.goto('http://localhost:8080');

  // Seed data
  await page.evaluate(() => {
    const savedAddress = {
      id: "addr_123",
      tag: "Home",
      house: "404",
      area: "Lost Street",
      plusCode: "87H4+XX Bengaluru"
    };
    localStorage.setItem('dotpe_user_address', JSON.stringify(savedAddress));
    localStorage.setItem('dotpe_user_state', 'logged_in');

    // Push state for OrderCashSuccess
    const state = {
        totalAmount: 2000,
        savedAddress: savedAddress
    };
    window.history.pushState(state, '', '#/order-cash-success');
  });

  // Reload to render OrderCashSuccess
  await page.reload();

  // Debug Screenshot
  await page.screenshot({ path: 'e2e/debug-order-success.png' });

  // Verify we are on OrderCashSuccess
  await expect(page.locator('h1', { hasText: 'Order Successful' })).toBeVisible();

  // Open Hamburger Menu
  await page.locator('img[alt="Menu"]').click();

  // Click Cancel Order
  await page.getByText('Cancel Order (').click();

  // Verify Popup
  await expect(page.locator('text=Cancel Order?')).toBeVisible();

  // Select a reason (default is 0, so "I changed my mind" is selected)
  // Click "Pull the plug"
  await page.getByRole('button', { name: 'Pull the plug' }).click();

  // Verify Navigation to OrderCancelled
  await expect(page).toHaveURL(/.*#\/order-cancelled/);

  // Verify Order Cancelled UI
  await expect(page.locator('h1', { hasText: 'Order Cancelled' })).toBeVisible();
  await expect(page.locator('text=Well, that escalated unnecessarily fast.')).toBeVisible();

  // Verify Amount
  await expect(page.locator('text=Your order for amount ₹2,000 has been cancelled.')).toBeVisible();

  // Verify Countdown Button
  await expect(page.getByRole('button', { name: /Redirecting Home in/ })).toBeVisible();
});
