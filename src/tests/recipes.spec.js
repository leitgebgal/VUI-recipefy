import { test, expect } from '@playwright/test';

test('Load recipes for logged-in user', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
   
    await page.fill('#input-4', 'test@test.com');
    await page.fill('#input-6', 'test123');

    await page.click('button.v-btn.v-btn--block.v-btn--elevated.v-theme--light.v-btn--density-default.v-btn--size-default.v-btn--variant-elevated.bg-grey-darken-3.text-white.mt-2[type="submit"]');
  
    await page.waitForSelector('.v-card.v-card--link', { timeout: 5000 });
    const recipeCards = await page.locator('.v-card.v-card--link');
    const cardCount = await recipeCards.count();
    expect(cardCount).toBeGreaterThan(0);
  });
  