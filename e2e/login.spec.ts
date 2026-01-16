
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should successfully login with test phone number and OTP', async ({ page }) => {
    // Setup console listener for debugging
    page.on('console', msg => console.log(`BROWSER LOG: ${msg.type()}: ${msg.text()}`));

    // Wait for the "Let's get started!" text
    await expect(page.getByText("Let's get started!")).toBeVisible();

    // Enter phone number
    const phoneInput = page.getByPlaceholder('Enter your mobile number');
    await phoneInput.fill('9999999999');

    // Click Request OTP
    const requestButton = page.getByRole('button', { name: 'Request OTP' });
    await expect(requestButton).toBeEnabled();
    await requestButton.click();

    // Wait for "Enter your OTP" screen
    await expect(page.getByText('Enter your OTP')).toBeVisible({ timeout: 10000 });

    // Check for the phone number display
    await expect(page.getByText('+91 9999999999')).toBeVisible();

    // Enter OTP "123456"
    await page.keyboard.type('123456');

    // Click Continue
    const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    // Check for error messages if we don't succeed
    try {
        await expect(page.getByText('Secure your account')).toBeVisible({ timeout: 15000 });
    } catch (e) {
        // Look for error text in the UI
        const errorText = await page.locator('.text-red-500').allTextContents();
        console.log('UI Errors found:', errorText);
        throw e;
    }

    await expect(page.getByText('Create a secure 4 digit MPIN')).toBeVisible();
  });

  test('should fail login with invalid OTP', async ({ page }) => {
    // Setup console listener for debugging
    page.on('console', msg => console.log(`BROWSER LOG: ${msg.type()}: ${msg.text()}`));

    await page.goto('/');

    // Enter valid phone number
    await page.getByPlaceholder('Enter your mobile number').fill('9999999999');
    await page.getByRole('button', { name: 'Request OTP' }).click();
    await expect(page.getByText('Enter your OTP')).toBeVisible({ timeout: 10000 });

    // Enter INVALID OTP
    await page.keyboard.type('000000');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();

    // Expect error message
    // The exact error message depends on Supabase response, usually "Token has expired or is invalid"
    // OR our fallback "That code's off target..."
    // We check for the error text container or content
    await expect(page.locator('.text-red-500')).toBeVisible({ timeout: 10000 });

    // Ensure we did NOT navigate to MPIN setup
    await expect(page.getByText('Secure your account')).not.toBeVisible();
  });
});
