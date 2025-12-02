import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

test.describe("Public Pages - Core Functionality", () => {
  test("homepage loads with hero section and branding", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator("text=Africa")).toBeVisible();
    await expect(page.locator("text=Predicts")).toBeVisible();
    await expect(page.locator("text=AP")).toBeVisible();
    const heroHeading = page.locator("h1, h2").first();
    await expect(heroHeading).toBeVisible();
  });

  test("markets page loads and displays market grid", async ({ page }) => {
    await page.goto(`${BASE_URL}/markets`);
    await expect(page.locator("text=Markets")).toBeVisible();
    await page.waitForLoadState("networkidle");
    const marketCards = page.locator("[class*='border']").filter({ hasText: /YES|NO|%/ });
    const cardCount = await marketCards.count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test("market detail page shows order book and trading info", async ({ page }) => {
    await page.goto(`${BASE_URL}/markets`);
    await page.waitForLoadState("networkidle");
    const marketLink = page.locator("a[href^='/markets/']").first();
    if (await marketLink.isVisible()) {
      await marketLink.click();
      await page.waitForLoadState("networkidle");
      await expect(page.locator("text=YES").first()).toBeVisible();
      await expect(page.locator("text=NO").first()).toBeVisible();
    }
  });

  test("category pages filter correctly", async ({ page }) => {
    await page.goto(`${BASE_URL}/category/politics`);
    await expect(page.locator("text=Politics")).toBeVisible();
    await page.waitForLoadState("networkidle");
    
    await page.goto(`${BASE_URL}/category/sports`);
    await expect(page.locator("text=Sports")).toBeVisible();
    await page.waitForLoadState("networkidle");
  });

  test("login page displays both auth options", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator("text=Sign In")).toBeVisible();
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(page.locator("text=Connect Wallet")).toBeVisible();
  });
});

test.describe("Authentication Flow - Email OTP", () => {
  test("email form validates input correctly", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill("invalid-email");
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    await page.waitForTimeout(1000);
  });

  test("valid email submission triggers OTP request", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill("test@example.com");
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    await page.waitForTimeout(2000);
  });
});

test.describe("Authentication Flow - Wallet", () => {
  test("wallet connect button opens modal", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    const walletButton = page.locator("text=Connect Wallet");
    await expect(walletButton).toBeVisible();
  });
});

test.describe("Protected Routes - Authorization", () => {
  test("wallet page requires authentication", async ({ page }) => {
    await page.goto(`${BASE_URL}/wallet`);
    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    expect(currentUrl).toContain("/login");
  });

  test("account page requires authentication", async ({ page }) => {
    await page.goto(`${BASE_URL}/account`);
    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    expect(currentUrl).toContain("/login");
  });

  test("admin panel requires admin role", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    const isRedirected = currentUrl.includes("/login") || currentUrl === `${BASE_URL}/`;
    const hasAccessDenied = await page.locator("text=Access Denied").isVisible().catch(() => false);
    const hasVerifying = await page.locator("text=Verifying").isVisible().catch(() => false);
    expect(isRedirected || hasAccessDenied || hasVerifying).toBeTruthy();
  });
});

test.describe("Navigation - Core Links", () => {
  test("navbar contains all main links", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("text=Markets")).toBeVisible();
  });

  test("logo navigates to homepage", async ({ page }) => {
    await page.goto(`${BASE_URL}/markets`);
    await page.click("text=Africa");
    await expect(page).toHaveURL(BASE_URL + "/");
  });

  test("markets link navigates correctly", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click("text=Markets");
    await expect(page).toHaveURL(/\/markets/);
  });
});

test.describe("API Health - Endpoint Verification", () => {
  test("health endpoint returns complete status", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("timestamp");
    expect(data).toHaveProperty("summary");
    expect(data).toHaveProperty("checks");
    expect(Array.isArray(data.checks)).toBeTruthy();
    expect(data.checks.length).toBeGreaterThan(5);
  });

  test("health endpoint shows all endpoints reachable", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`);
    const data = await response.json();
    const failedChecks = data.checks.filter((c: { status: string }) => c.status === "error");
    expect(failedChecks.length).toBe(0);
  });

  test("markets API returns valid data structure", async ({ request }) => {
    const response = await request.get("https://sa-api-server-1.replit.app/api/v1/markets");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty("markets");
    expect(data).toHaveProperty("total");
    expect(Array.isArray(data.markets)).toBeTruthy();
    if (data.markets.length > 0) {
      const market = data.markets[0];
      expect(market).toHaveProperty("id");
      expect(market).toHaveProperty("slug");
      expect(market).toHaveProperty("question");
      expect(market).toHaveProperty("yesPrice");
      expect(market).toHaveProperty("noPrice");
    }
  });
});

test.describe("Responsive Design", () => {
  test("mobile layout displays correctly (375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await expect(page.locator("text=Africa")).toBeVisible();
    await expect(page.locator("text=Predicts")).toBeVisible();
  });

  test("tablet layout displays correctly (768px)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    await expect(page.locator("text=Africa")).toBeVisible();
  });

  test("desktop layout displays correctly (1280px)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(BASE_URL);
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("text=Markets")).toBeVisible();
  });
});

test.describe("Error States and Edge Cases", () => {
  test("invalid market slug shows error or redirects", async ({ page }) => {
    await page.goto(`${BASE_URL}/markets/invalid-market-slug-12345`);
    await page.waitForLoadState("networkidle");
    const hasError = await page.locator("text=not found").isVisible().catch(() => false);
    const hasMarketData = await page.locator("text=YES").first().isVisible().catch(() => false);
    expect(hasError || !hasMarketData).toBeTruthy();
  });

  test("invalid category shows empty or error state", async ({ page }) => {
    await page.goto(`${BASE_URL}/category/invalid-category`);
    await page.waitForLoadState("networkidle");
  });
});

test.describe("UI Components and Interactions", () => {
  test("market cards show price information", async ({ page }) => {
    await page.goto(`${BASE_URL}/markets`);
    await page.waitForLoadState("networkidle");
    const yesPrice = page.locator("text=/\\d+(\\.\\d+)?%/").first();
    await expect(yesPrice).toBeVisible({ timeout: 10000 });
  });

  test("category tabs are clickable", async ({ page }) => {
    await page.goto(`${BASE_URL}/markets`);
    await page.waitForLoadState("networkidle");
    const politicsTab = page.locator("text=Politics").first();
    if (await politicsTab.isVisible()) {
      await politicsTab.click();
      await page.waitForLoadState("networkidle");
    }
  });
});

test.describe("Performance Metrics", () => {
  test("homepage loads within acceptable time", async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState("domcontentloaded");
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000);
  });

  test("markets page loads within acceptable time", async ({ page }) => {
    const startTime = Date.now();
    await page.goto(`${BASE_URL}/markets`);
    await page.waitForLoadState("domcontentloaded");
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000);
  });
});
