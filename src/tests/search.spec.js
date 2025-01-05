import { test, expect } from '@playwright/test';

test('Search for a specific recipe', async ({ page }) => {
    await page.goto('http://localhost:5173/login');

    await page.fill('#input-4', 'test@test.com');
    await page.fill('#input-6', 'test123');

    await page.click('button.v-btn.v-btn--block.v-btn--elevated.v-theme--light.v-btn--density-default.v-btn--size-default.v-btn--variant-elevated.bg-grey-darken-3.text-white.mt-2[type="submit"]');

    await page.fill('#input-9', 'American Hamburger');
    await page.press('#input-9', 'Enter');
    const americanHamburgerCard = await page.locator('.v-card-title', { hasText: 'American Hamburger' });
    await expect(americanHamburgerCard).toBeVisible()
  });