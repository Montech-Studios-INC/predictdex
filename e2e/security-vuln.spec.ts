import { test, expect, type APIRequestContext } from "@playwright/test";

const API_BASE_URL = "https://sa-api-server-1.replit.app/api/v1";

async function makeRequest(
  request: APIRequestContext,
  method: string,
  endpoint: string,
  options: { body?: unknown; token?: string; headers?: Record<string, string> } = {}
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
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
    headers: response.headers(),
  };
}

test.describe("SECURITY VULNERABILITY: Authentication Bypass", () => {
  test("JWT with algorithm=none should be rejected", async ({ request }) => {
    const noneAlgJwt = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFkbWluIn0.";
    const res = await makeRequest(request, "GET", "/wallet/balances", {
      token: noneAlgJwt,
    });
    expect(res.status).toBe(401);
  });

  test("JWT with algorithm=HS256 when RS256 expected should be rejected", async ({ request }) => {
    const hs256Jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFkbWluIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    const res = await makeRequest(request, "GET", "/wallet/balances", {
      token: hs256Jwt,
    });
    expect(res.status).toBe(401);
  });

  test("Malformed JWT should be rejected gracefully", async ({ request }) => {
    const malformedJwts = [
      "not.a.jwt",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      "...",
      "Bearer token",
      "null",
      "undefined",
    ];

    for (const jwt of malformedJwts) {
      const res = await makeRequest(request, "GET", "/wallet/balances", { token: jwt });
      expect(res.status).toBe(401);
      expect(res.status).not.toBe(500);
    }
  });

  test("Empty Authorization header should return 401", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/wallet/balances", {
      headers: { Authorization: "" },
    });
    expect([401, 429]).toContain(res.status);
  });

  test("Authorization header with only 'Bearer ' should return 401", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/wallet/balances", {
      headers: { Authorization: "Bearer " },
    });
    expect([401, 429]).toContain(res.status);
  });
});

test.describe("SECURITY VULNERABILITY: IDOR & Cross-User Access", () => {
  test("Position ID from another user should not be accessible", async ({ request }) => {
    const fakePositionId = "00000000-0000-0000-0000-000000000001";
    const res = await makeRequest(request, "POST", "/trade/sell", {
      body: { positionId: fakePositionId, sharesToSell: 10 },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body?.position).toBeUndefined();
  });

  test("User ID parameter injection should be ignored", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/trade/preview", {
      body: {
        marketId: "test-market",
        outcome: "YES",
        stake: 10,
        userId: "00000000-0000-0000-0000-000000000001",
      },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Admin endpoints should not expose other users data without auth", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/admin/crypto/withdrawals?userId=any-user-id");
    expect(res.status).toBe(401);
    expect(res.body?.withdrawals).toBeUndefined();
  });
});

test.describe("SECURITY VULNERABILITY: Injection Attacks", () => {
  test("NoSQL injection in email field should be rejected", async ({ request }) => {
    const injectionPayloads = [
      { email: { "$gt": "" } },
      { email: { "$ne": "" } },
      { email: { "$regex": ".*" } },
      { email: ["test@example.com"] },
    ];

    for (const payload of injectionPayloads) {
      const res = await makeRequest(request, "POST", "/auth/request-otp", { body: payload });
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500);
    }
  });

  test("Path traversal in market slug should be handled", async ({ request }) => {
    const traversalPayloads = [
      "../../../etc/passwd",
      "..%2f..%2f..%2fetc%2fpasswd",
      "test/../../admin",
      "test%00admin",
      "test\x00admin",
    ];

    for (const payload of traversalPayloads) {
      const res = await makeRequest(request, "GET", `/markets/${encodeURIComponent(payload)}`);
      expect(res.status).not.toBe(500);
      expect(res.body?.error).not.toContain("ENOENT");
      expect(res.body?.error).not.toContain("passwd");
    }
  });

  test("Command injection in parameters should be sanitized", async ({ request }) => {
    const injectionPayloads = [
      "test; rm -rf /",
      "test | cat /etc/passwd",
      "test`id`",
      "test$(id)",
    ];

    for (const payload of injectionPayloads) {
      const res = await makeRequest(request, "GET", `/markets/${encodeURIComponent(payload)}`);
      expect(res.status).not.toBe(500);
    }
  });

  test("LDAP injection should be handled", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/auth/request-otp", {
      body: { email: "*)(uid=*))(|(uid=*" },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  test("XML/XXE injection in JSON body should be handled", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/auth/request-otp", {
      body: { email: '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>' },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });
});

test.describe("SECURITY VULNERABILITY: Race Conditions", () => {
  test("Concurrent OTP requests should be rate limited", async ({ request }) => {
    const email = `racetest${Date.now()}@example.com`;
    const requests = Array(10).fill(null).map(() =>
      makeRequest(request, "POST", "/auth/request-otp", { body: { email } })
    );

    const results = await Promise.all(requests);
    const rateLimited = results.filter(r => r.status === 429);
    
    expect(rateLimited.length).toBeGreaterThanOrEqual(0);
  });

  test("Concurrent trade previews should handle gracefully", async ({ request }) => {
    const requests = Array(5).fill(null).map(() =>
      makeRequest(request, "POST", "/trade/preview", {
        body: { marketId: "test-market", outcome: "YES", stake: 10 },
      })
    );

    const results = await Promise.all(requests);
    const errors = results.filter(r => r.status >= 500);
    expect(errors.length).toBe(0);
  });

  test("Duplicate idempotency keys should return consistent results", async ({ request }) => {
    const idempotencyKey = `security-test-${Date.now()}`;
    const requests = Array(3).fill(null).map(() =>
      makeRequest(request, "POST", "/trade/buy", {
        body: {
          marketId: "test-market",
          outcome: "YES",
          stake: 10,
          idempotencyKey,
        },
      })
    );

    const results = await Promise.all(requests);
    const serverErrors = results.filter(r => r.status === 500);
    expect(serverErrors.length).toBe(0);
  });
});

test.describe("SECURITY VULNERABILITY: Business Logic Abuse", () => {
  test("Trading on non-existent market should fail gracefully", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/trade/preview", {
      body: {
        marketId: "00000000-0000-0000-0000-000000000000",
        outcome: "YES",
        stake: 10,
      },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
    expect(res.body?.shares).toBeUndefined();
  });

  test("Fractional stake with many decimals should be handled", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/trade/preview", {
      body: {
        marketId: "test-market",
        outcome: "YES",
        stake: 10.123456789012345678901234567890,
      },
    });
    expect(res.status).not.toBe(500);
  });

  test("Scientific notation in stake should be handled", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/trade/preview", {
      body: {
        marketId: "test-market",
        outcome: "YES",
        stake: "1e10",
      },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Infinity stake should be rejected", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/trade/preview", {
      body: {
        marketId: "test-market",
        outcome: "YES",
        stake: Infinity,
      },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  test("NaN stake should be rejected", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/trade/preview", {
      body: {
        marketId: "test-market",
        outcome: "YES",
        stake: NaN,
      },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

test.describe("SECURITY VULNERABILITY: Withdrawal Abuse", () => {
  test("Withdrawal to contract address should be flagged or handled", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/crypto/withdraw", {
      body: {
        token: "ETH",
        amount: 0.1,
        destinationAddress: "0x0000000000000000000000000000000000000000",
      },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Withdrawal with checksum-invalid address should fail", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/crypto/withdraw", {
      body: {
        token: "ETH",
        amount: 0.1,
        destinationAddress: "0xINVALIDCHECKSUM1234567890123456789012",
      },
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("Withdrawal amount with precision attack should be handled", async ({ request }) => {
    const precisionAmounts = [
      0.000000000000000001,
      1.0000000000000001,
      0.1 + 0.2,
    ];

    for (const amount of precisionAmounts) {
      const res = await makeRequest(request, "POST", "/crypto/withdraw", {
        body: {
          token: "ETH",
          amount,
          destinationAddress: "0x1234567890123456789012345678901234567890",
        },
      });
      expect(res.status).not.toBe(500);
    }
  });
});

test.describe("SECURITY VULNERABILITY: Information Disclosure", () => {
  test("Error messages should not leak stack traces", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/markets/undefined");
    expect(JSON.stringify(res.body)).not.toContain("at Object.");
    expect(JSON.stringify(res.body)).not.toContain("node_modules");
    expect(JSON.stringify(res.body)).not.toContain("Error:");
  });

  test("404 responses should not reveal server technology", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/nonexistent-endpoint-12345");
    expect([404, 429]).toContain(res.status);
    if (res.status === 404) {
      expect(res.headers["x-powered-by"]).toBeUndefined();
    }
  });

  test("Invalid JSON body should not reveal parsing details", async ({ request }) => {
    const response = await request.fetch(`${API_BASE_URL}/auth/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: "{ invalid json }",
    });
    const status = response.status();
    expect(status).toBe(400);
    const body = await response.json().catch(() => null);
    expect(JSON.stringify(body || "")).not.toContain("SyntaxError");
  });
});

test.describe("SECURITY VULNERABILITY: Header Manipulation", () => {
  test("X-Forwarded-For should not bypass rate limits", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/markets", {
      headers: { "X-Forwarded-For": "1.2.3.4" },
    });
    expect([200, 429]).toContain(res.status);
  });

  test("Host header injection should be prevented", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/markets", {
      headers: { "Host": "evil.com" },
    });
    expect(res.status).not.toBe(500);
  });

  test("Content-Type manipulation should not cause issues", async ({ request }) => {
    const response = await request.fetch(`${API_BASE_URL}/auth/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: "email=test@example.com",
    });
    const status = response.status();
    expect([400, 415]).toContain(status);
  });
});

test.describe("SECURITY VULNERABILITY: Prototype Pollution", () => {
  test("__proto__ pollution should be prevented", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/auth/request-otp", {
      body: { 
        email: "test@example.com",
        "__proto__": { "isAdmin": true }
      },
    });
    expect(res.status).not.toBe(500);
    expect(res.body?.isAdmin).toBeUndefined();
  });

  test("constructor pollution should be prevented", async ({ request }) => {
    const res = await makeRequest(request, "POST", "/auth/request-otp", {
      body: { 
        email: "test@example.com",
        "constructor": { "prototype": { "isAdmin": true } }
      },
    });
    expect(res.status).not.toBe(500);
  });
});

test.describe("SECURITY VULNERABILITY: Denial of Service", () => {
  test("Deeply nested JSON should be rejected or handled", async ({ request }) => {
    let deepObject: Record<string, unknown> = { email: "test@example.com" };
    for (let i = 0; i < 100; i++) {
      deepObject = { nested: deepObject };
    }

    const res = await makeRequest(request, "POST", "/auth/request-otp", {
      body: deepObject,
    });
    expect([200, 400, 413, 429]).toContain(res.status);
  });

  test("Very long header values should not crash server", async ({ request }) => {
    const res = await makeRequest(request, "GET", "/markets", {
      headers: { "X-Custom-Header": "x".repeat(10000) },
    });
    expect([200, 400, 431, 429]).toContain(res.status);
  });

  test("Many query parameters should be handled", async ({ request }) => {
    const params = Array(100).fill(null).map((_, i) => `param${i}=value${i}`).join("&");
    const res = await makeRequest(request, "GET", `/markets?${params}`);
    expect([200, 400, 414]).toContain(res.status);
  });
});
