import { test, expect } from '@playwright/test';

test.describe('Address Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Login first
    await page.goto('/');

    // Check if we are already logged in (if state persists), otherwise login
    // Since browser context is fresh usually, we login.
    const startButton = page.getByText("Let's get started!");
    if (await startButton.isVisible()) {
        await page.getByPlaceholder('Enter your mobile number').fill('9999999999');
        await page.getByRole('button', { name: 'Request OTP' }).click();
        await expect(page.getByText('Enter your OTP')).toBeVisible({ timeout: 10000 });
        await page.keyboard.type('123456');
        await page.getByRole('button', { name: 'Continue', exact: true }).click();
        await expect(page.getByText('Secure your account')).toBeVisible({ timeout: 15000 });
        // Bypass MPIN setup if possible or complete it?
        // The onboarding flow usually navigates to Home after MPIN setup.
        // Let's assume we need to setup MPIN if it's a fresh user (test user is reused though).
        // If we are on MPIN setup:
        if (await page.getByText('Create a secure 4 digit MPIN').isVisible()) {
             // Try to find the input directly if possible, or click slots
             // Assuming first input group is for Create, second for Confirm

             const mpin = '9274';

             // Click first slot
             await page.locator('input').first().focus();
             await page.keyboard.type(mpin);

             await page.waitForTimeout(500);

             // Focus second input - assuming there are two hidden inputs for OTP fields
             const inputs = await page.locator('input').all();
             if (inputs.length >= 2) {
                 await inputs[1].focus();
                 await page.keyboard.type(mpin);
             } else {
                 // Fallback to text click
                 await page.getByText('Re-enter MPIN').click();
                 await page.keyboard.type(mpin);
             }

             await page.waitForTimeout(1000);
             await page.getByRole('button', { name: 'Setup' }).click();
        }
    }

    // Wait for Home
    await expect(page.url()).toContain('/home');
  });

  test('should add, view, and delete an address', async ({ page }) => {
    // 2. Navigate to Address Selection (usually via Header on Homepage)
    // Click on the address header "Delivering to..."
    await page.locator('.flex.items-center.gap-3').first().click();

    // 3. Click "Add new address"
    await page.getByText('Add new address').click();

    // 4. We are on Map page (/add-address). Simulate confirming location.
    // It should auto-fetch location. We just click "Confirm Location".
    await expect(page.getByText('Confirm Location')).toBeVisible();
    await page.getByText('Confirm Location').click();

    // 5. Fill Details (/add-address-details)
    await expect(page.getByText('Add New Address')).toBeVisible();

    await page.getByPlaceholder('House / Flat / Floor').fill('Flat 101');
    await page.getByPlaceholder('Apartment / Road / Area').fill('Tech Park');
    await page.getByPlaceholder('Your Name').fill('Test User');
    await page.locator('input[type="tel"]').fill('9876543210');

    // Select tag (default is Home, let's select Work)
    await page.getByText('Work').click();

    // Save
    await page.getByRole('button', { name: 'Save Address' }).click();

    // 6. Verify back on Home and Address Sheet shows the new address
    // Wait for toast or navigation
    await expect(page.url()).toContain('/home');

    // Open sheet again to verify list
    await page.locator('.flex.items-center.gap-3').first().click();

    // Check if "Work" address is visible
    await expect(page.getByText('Tech Park').first()).toBeVisible();

    // Verify contact phone is displayed (checking data persistence)
    // The sheet displays "Phone number: <phone>"
    await expect(page.getByText('Phone number: 9876543210')).toBeVisible();

    // 7. Delete the address
    // Find the delete button for the address we just made.
    // It's usually a trash icon inside the address card.
    // We target the card containing 'Tech Park'
    const addressCard = page.locator('div', { hasText: 'Tech Park' }).last();
    // Note: AddressSelectionSheet renders multiple cards.

    // Click delete icon (assuming alt="Delete")
    await addressCard.getByAltText('Delete').click();

    // Verify it's gone
    await expect(page.getByText('Tech Park')).not.toBeVisible();
  });
});
