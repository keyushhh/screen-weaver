
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should successfully login with test phone number and OTP', async ({ page }) => {
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
    // Since InputOTP might be complex, typing generally works if focus is correct.
    // The previous error was about the button, so typing likely worked.
    await page.keyboard.type('123456');

    // Click Continue - Be strict
    const continueButton = page.getByRole('button', { name: 'Continue', exact: true });

    // Wait for it to be enabled (it might take a moment after typing)
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    // Expect transition to MPIN setup screen
    // This confirms the verifyOtp call succeeded and we moved to the next screen
    await expect(page.getByText('Secure your account')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Create a secure 4 digit MPIN')).toBeVisible();
  });
});
