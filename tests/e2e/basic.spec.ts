import { test, expect } from '@playwright/test';

// Simple e2e test launching the renderer standalone

test('load UI', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page.locator('text=MCP 서버')).toBeVisible();
});
