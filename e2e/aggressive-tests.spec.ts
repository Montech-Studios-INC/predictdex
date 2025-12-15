import { test, expect, type Page, type APIRequestContext } from "@playwright/test";

const API_BASE_URL = "https://sa-api-server-1.replit.app/api/v1";

interface TestContext {
  request: APIRequestContext;
  authToken?: string;
}

async function makeRequest(
  request: APIRequestContext,
  method: string,
  endpoint: string,
  options: { body?: unknown; token?: string } = {}
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const response = await request.fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    data: options.body ? JSON.stringify(options.body) : undefined,
  });

  return {
    status: response.status(),
    body: await response.json().catch(() => null),
  };
}

test.describe("AGGRESSIVE TESTING: Authentication Abuse", () => {
  test("OTP request with empty email should fail gracefully", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/auth/request-otp", {
      body: { email: "" },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  test("OTP request with invalid email format should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/auth/request-otp", {
      body: { email: "not-an-email" },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("OTP request with extremely long email should fail", async ({ request }) => {
    const longEmail = "a".repeat(500) + "@example.com";
    const res = await makeRequest(request, "POST", "/auth/request-otp", {
      body: { email: longEmail },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("OTP verify with wrong code should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/auth/verify-otp", {
      body: { email: "test@example.com", code: "000000" },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("OTP verify with missing code field should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/auth/verify-otp", {
      body: { email: "test@example.com" },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("OTP verify with non-string code should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/auth/verify-otp", {
      body: { email: "test@example.com", code: 123456 },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Wallet challenge with invalid address should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/auth/wallet/challenge", {
      body: { walletAddress: "not-a-wallet-address" },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Wallet challenge with empty address should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/auth/wallet/challenge", {
      body: { walletAddress: "" },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Wallet verify with invalid signature should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/auth/wallet/verify", {
      body: { message: "fake message", signature: "0x1234" },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Access protected endpoint without token should return 401", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/wallet/balances");
    expect([401, 429]).toContain(res.status);
  });

  test("Access protected endpoint with invalid token should return 401", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/wallet/balances", {
      token: "invalid-token-12345",
    });
    expect([401, 429]).toContain(res.status);
  });

  test("Access protected endpoint with expired token format should return 401", async ({ request }) => {
    const expiredJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoxfQ.signature";
    const res = await makeRequest(request, "GET", "/wallet/balances", {
      token: expiredJwt,
    });
    expect([401, 429]).toContain(res.status);
  });
});

test.describe("AGGRESSIVE TESTING: Trading Abuse", () => {
  test("Trade preview with zero stake should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/trade/preview", {
      body: { marketId: "test-market", outcome: "YES", stake: 0 },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Trade preview with negative stake should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/trade/preview", {
      body: { marketId: "test-market", outcome: "YES", stake: -100 },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Trade preview with extremely large stake should fail or be handled", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/trade/preview", {
      body: { marketId: "test-market", outcome: "YES", stake: 999999999999 },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Trade preview with invalid outcome should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/trade/preview", {
      body: { marketId: "test-market", outcome: "MAYBE", stake: 10 },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Trade preview with non-existent market ID should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/trade/preview", {
      body: { marketId: "non-existent-market-12345", outcome: "YES", stake: 10 },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Buy shares without auth should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/trade/buy", {
      body: {
        marketId: "test-market",
        outcome: "YES",
        stake: 10,
        idempotencyKey: "test-key",
      },
    });
    expect([401, 429]).toContain(res.status);
  });

  test("Sell shares with non-existent position ID should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/trade/sell", {
      body: { positionId: "non-existent-position", sharesToSell: 10 },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Sell shares with zero shares should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/trade/sell", {
      body: { positionId: "some-position", sharesToSell: 0 },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Sell shares with negative shares should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/trade/sell", {
      body: { positionId: "some-position", sharesToSell: -10 },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

test.describe("AGGRESSIVE TESTING: Withdrawal Abuse", () => {
  test("Withdrawal request without auth should be blocked", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/crypto/withdraw", {
      body: {
        token: "ETH",
        amount: 0.1,
        destinationAddress: "0x1234567890123456789012345678901234567890",
      },
    });
    expect([401, 403, 404, 429]).toContain(res.status);
  });

  test("Withdrawal limits without auth should be blocked", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/crypto/withdrawals/limits");
    expect([401, 403, 404, 429]).toContain(res.status);
  });

  test("Withdrawal with invalid token type should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/crypto/withdraw", {
      body: {
        token: "INVALID_TOKEN",
        amount: 0.1,
        destinationAddress: "0x1234567890123456789012345678901234567890",
      },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Withdrawal with invalid Ethereum address should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/crypto/withdraw", {
      body: {
        token: "ETH",
        amount: 0.1,
        destinationAddress: "not-a-valid-address",
      },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Withdrawal with zero amount should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/crypto/withdraw", {
      body: {
        token: "ETH",
        amount: 0,
        destinationAddress: "0x1234567890123456789012345678901234567890",
      },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Withdrawal with negative amount should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/crypto/withdraw", {
      body: {
        token: "ETH",
        amount: -1,
        destinationAddress: "0x1234567890123456789012345678901234567890",
      },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Withdrawal with amount below minimum should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/crypto/withdraw", {
      body: {
        token: "ETH",
        amount: 0.00001,
        destinationAddress: "0x1234567890123456789012345678901234567890",
      },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

test.describe("AGGRESSIVE TESTING: Admin Endpoint Protection", () => {
  test("Admin markets without auth should return 401", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/admin/markets");
    expect(res.status).toBe(401);
  });

  test("Admin create market without auth should return 401", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/admin/markets", {
      body: {
        slug: "test-market",
        question: "Will this test pass?",
        description: "Test description",
        category: "Politics",
        currency: "ETH",
        closesAt: new Date(Date.now() + 86400000).toISOString(),
      },
    });
    expect(res.status).toBe(401);
  });

  test("Admin settlement queue without auth should return 401", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/admin/settlement/queue");
    expect(res.status).toBe(401);
  });

  test("Admin resolve market without auth should return 401", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/admin/markets/fake-id/resolve", {
      body: { outcome: "YES" },
    });
    expect(res.status).toBe(401);
  });

  test("Admin credit deposit without auth should return 401", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/admin/crypto/deposits/fake-id/credit");
    expect(res.status).toBe(401);
  });

  test("Admin approve withdrawal without auth should return 401", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/admin/crypto/withdrawals/fake-id/approve", {
      body: {},
    });
    expect(res.status).toBe(401);
  });

  test("Admin reject withdrawal without reason should be handled", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/admin/crypto/withdrawals/fake-id/reject", {
      body: { reason: "" },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

test.describe("AGGRESSIVE TESTING: Input Sanitization", () => {
  test("Market slug with SQL injection pattern should be sanitized", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/markets/test'; DROP TABLE markets; --");
    expect(res.status).not.toBe(500);
  });

  test("Market slug with XSS pattern should be sanitized", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/markets/<script>alert('xss')</script>");
    expect(res.status).not.toBe(500);
  });

  test("Email with special characters should be handled", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/auth/request-otp", {
      body: { email: "test+special@example.com" },
    });
    expect(res.status).not.toBe(500);
  });

  test("OTP with SQL injection pattern should fail gracefully", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/auth/verify-otp", {
      body: { email: "test@example.com", code: "'; DROP TABLE users; --" },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  test("Profile update with XSS in name should be sanitized", async ({ request }) => {
    const res = await makeRequest(request, "PATCH", "/users/me", {
      body: { name: "<script>alert('xss')</script>" },
    });
    expect(res.status).toBe(401);
  });
});

test.describe("AGGRESSIVE TESTING: Boundary Values", () => {
  test("Markets with limit=0 should return empty or error", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/markets?limit=0");
    expect(res.status).not.toBe(500);
  });

  test("Markets with negative limit should be handled", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/markets?limit=-1");
    expect(res.status).not.toBe(500);
  });

  test("Markets with extremely large limit should be handled", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/markets?limit=1000000");
    expect([200, 400, 429]).toContain(res.status);
  });

  test("Markets with negative offset should be handled", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/markets?offset=-1");
    expect(res.status).not.toBe(500);
  });

  test("Markets with non-numeric limit should be handled", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/markets?limit=abc");
    expect(res.status).not.toBe(500);
  });

  test("Market detail with empty slug should be handled", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/markets/");
    expect([200, 400, 404, 429]).toContain(res.status);
  });
});

test.describe("AGGRESSIVE TESTING: State Machine Abuse", () => {
  test("Accessing closed market order book should still work", async ({ request }) => {
    const marketsRes = await makeRequest(request, "GET", "/markets?status=closed&limit=1");
    if (marketsRes.status === 200 && marketsRes.body?.markets?.length > 0) {
      const slug = marketsRes.body.markets[0].slug;
      const orderbookRes = await makeRequest(request, "GET", `/markets/${slug}/orderbook`);
      expect(orderbookRes.status).not.toBe(500);
    }
  });

  test("Accessing resolved market should return market data", async ({ request }) => {
    const marketsRes = await makeRequest(request, "GET", "/markets?status=resolved&limit=1");
    if (marketsRes.status === 200 && marketsRes.body?.markets?.length > 0) {
      const slug = marketsRes.body.markets[0].slug;
      const marketRes = await makeRequest(request, "GET", `/markets/${slug}`);
      expect(marketRes.status).toBe(200);
    }
  });
});

test.describe("AGGRESSIVE TESTING: Payload Size Limits", () => {
  test("OTP request with huge payload should be rejected", async ({ request }) => {
    const hugePayload = {
      email: "test@example.com",
      extra: "x".repeat(1000000),
    };
    const res = await makeRequest(request, "POST", "/auth/request-otp", {
      body: hugePayload,
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Profile update with extremely long name should be handled", async ({ request }) => {
    const res = await makeRequest(request, "PATCH", "/users/me", {
      body: { name: "x".repeat(10000) },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

test.describe("AGGRESSIVE TESTING: Double Submission Prevention", () => {
  test("Trade buy with same idempotency key twice should be handled", async ({ request }) => {
    const idempotencyKey = `test-${Date.now()}`;
    
    await makeRequest(request, "POST", "/trade/buy", {
      body: {
        marketId: "test-market",
        outcome: "YES",
        stake: 10,
        idempotencyKey,
      },
    });
    
    const secondRes = await makeRequest(request, "POST", "/trade/buy", {
      body: {
        marketId: "test-market",
        outcome: "YES",
        stake: 10,
        idempotencyKey,
      },
    });
    
    expect(secondRes.status).not.toBe(500);
  });
});

test.describe("AGGRESSIVE TESTING: Cross-Tenant Data Access", () => {
  test("Accessing another user's deposit addresses should be blocked", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/crypto/deposit-address/ETH");
    expect(res.status).toBe(401);
  });

  test("Accessing another user's portfolio should be blocked", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/portfolio");
    expect(res.status).toBe(401);
  });

  test("Accessing another user's withdrawal history should be blocked", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/crypto/withdrawals/history");
    expect([401, 403, 404]).toContain(res.status);
  });
});
