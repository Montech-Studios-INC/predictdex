# AfricaPredicts Security Test Plan

## Vulnerability-Driven Testing Mode
**Date:** December 15, 2025
**Goal:** Find and expose vulnerabilities, weaknesses, and unsafe assumptions

---

## 1. Attack Surface Analysis

### 1.1 Authentication & Session Management
| Attack Surface | What Attacker Would Try | Worst Outcome |
|----------------|------------------------|---------------|
| Email OTP | Brute force OTP codes, OTP reuse, timing attacks | Account takeover |
| Wallet SIWE | Replay signature attacks, message tampering | Wallet impersonation |
| JWT Tokens | Token theft, expired token reuse, forged tokens | Session hijacking |
| Session Storage | XSS to steal localStorage tokens | Account takeover |

### 1.2 Authorization / RBAC
| Attack Surface | What Attacker Would Try | Worst Outcome |
|----------------|------------------------|---------------|
| Admin Routes | Access admin endpoints as regular user | Full platform control |
| User Data | Access another user's portfolio/balances | Data theft, privacy breach |
| Role Escalation | Modify own role in requests | Privilege escalation |

### 1.3 Input Handling
| Attack Surface | What Attacker Would Try | Worst Outcome |
|----------------|------------------------|---------------|
| Email Field | SQL injection, NoSQL injection, XSS | Database breach, XSS |
| Market Slugs | Path traversal, SSRF, injection | Server compromise |
| Trade Stakes | Integer overflow, negative values | Financial loss |
| Wallet Addresses | Invalid format, null bytes, injection | Transaction failures |

### 1.4 Sensitive Data
| Attack Surface | What Attacker Would Try | Worst Outcome |
|----------------|------------------------|---------------|
| Wallet Balances | View other users' balances | Financial privacy breach |
| Deposit Addresses | Access other users' addresses | Deposit theft |
| Position Data | View other users' positions | Competitive advantage theft |
| User PII | Access emails, names, KYC status | Identity theft |

### 1.5 State Transitions
| Attack Surface | What Attacker Would Try | Worst Outcome |
|----------------|------------------------|---------------|
| Market Lifecycle | Trade on closed/resolved markets | Unfair trading |
| Trade Execution | Double-spend via race conditions | Financial loss |
| Withdrawal | Withdraw more than available | Platform insolvency |
| Position Selling | Sell more shares than owned | Negative balance |

### 1.6 External Integrations
| Attack Surface | What Attacker Would Try | Worst Outcome |
|----------------|------------------------|---------------|
| Crypto Deposits | Fake deposit confirmations | Free money |
| Withdrawals | Send to malicious addresses | Fund theft |
| Price Feeds | Manipulate external prices | Arbitrage exploitation |

---

## 2. Test Scenarios by Attack Category

### 2.1 Authentication Bypass Tests

#### SCENARIO: OTP Brute Force Attack
```
GIVEN: Valid email that has requested OTP
WHEN: Attacker sends 1000+ OTP verification requests with sequential codes
THEN: Rate limiting kicks in after ~5 attempts, account locked temporarily
```

#### SCENARIO: OTP Replay Attack
```
GIVEN: User successfully verified OTP "123456"
WHEN: Attacker captures OTP and tries to reuse it
THEN: OTP is invalidated after first use, request rejected
```

#### SCENARIO: SIWE Signature Replay
```
GIVEN: Valid SIWE message signed by user
WHEN: Attacker captures signature and replays within expiry window
THEN: Nonce prevents replay, request rejected
```

#### SCENARIO: JWT Algorithm Confusion
```
GIVEN: Server uses RS256 for JWT
WHEN: Attacker sends JWT with alg=none or alg=HS256
THEN: Server rejects non-RS256 algorithms
```

### 2.2 Authorization Bypass Tests

#### SCENARIO: User Accesses Admin Endpoints with User Token
```
GIVEN: Authenticated user with role="user"
WHEN: User calls /admin/markets with valid JWT
THEN: Returns 403 Forbidden, no data leaked
```

#### SCENARIO: Cross-User Portfolio Access via ID Manipulation
```
GIVEN: User A authenticated, User B exists
WHEN: User A calls /portfolio with User B's position ID
THEN: Returns 403 or 404, no User B data exposed
```

#### SCENARIO: IDOR on Deposit Addresses
```
GIVEN: User A authenticated
WHEN: User A modifies user_id parameter in deposit address request
THEN: Server ignores parameter, returns only User A's addresses
```

### 2.3 Input Validation Tests

#### SCENARIO: SQL Injection in Market Slug
```
GIVEN: Public markets endpoint
WHEN: Request /markets/test' OR '1'='1' --
THEN: Returns 400/404, no SQL error exposed, no data leaked
```

#### SCENARIO: NoSQL Injection in Email Field
```
GIVEN: OTP request endpoint
WHEN: Submit { email: { "$gt": "" } }
THEN: Validation rejects non-string, returns 400
```

#### SCENARIO: Prototype Pollution in JSON Body
```
GIVEN: Any POST endpoint
WHEN: Submit { "__proto__": { "isAdmin": true } }
THEN: Server sanitizes, no prototype pollution occurs
```

#### SCENARIO: Integer Overflow in Stake Amount
```
GIVEN: Trade preview endpoint
WHEN: Submit stake: 9999999999999999999999999 (beyond JS safe integer)
THEN: Server rejects or handles gracefully, no overflow
```

### 2.4 Race Condition Tests

#### SCENARIO: Double-Spend on Trade Execution
```
GIVEN: User with $100 balance
WHEN: Two concurrent /trade/buy requests for $100 each
THEN: Only one succeeds, other gets insufficient balance error
```

#### SCENARIO: Withdrawal Race Condition
```
GIVEN: User with 1 ETH balance
WHEN: Two concurrent withdrawals for 1 ETH each
THEN: Only one succeeds, balance never goes negative
```

### 2.5 State Machine Abuse Tests

#### SCENARIO: Trade on Closed Market
```
GIVEN: Market with status="closed"
WHEN: Submit trade preview/buy for this market
THEN: Returns error "Market is closed", no trade created
```

#### SCENARIO: Sell More Shares Than Owned
```
GIVEN: Position with 10 shares
WHEN: Submit sell for 100 shares
THEN: Returns error, sell rejected, position unchanged
```

#### SCENARIO: Withdraw Locked Funds
```
GIVEN: User has 100 USDC, 80 USDC locked in positions
WHEN: Attempt to withdraw 50 USDC
THEN: Returns error "Insufficient available balance"
```

---

## 3. Proposed Fixes for Common Vulnerabilities

### Fix 1: Rate Limiting (OTP Brute Force)
**Vulnerability:** No rate limiting on OTP verification
**Fix:**
```typescript
// Backend: Add rate limiter middleware
const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  keyGenerator: (req) => req.body.email,
  message: { error: "Too many attempts. Try again later." }
});
app.post('/auth/verify-otp', otpRateLimiter, verifyOtpHandler);
```

### Fix 2: Idempotency Key Enforcement (Double-Spend)
**Vulnerability:** Trade executed multiple times for same request
**Fix:**
```typescript
// Backend: Enforce idempotency at database level
CREATE UNIQUE INDEX idx_trades_idempotency ON trades(idempotency_key) 
WHERE idempotency_key IS NOT NULL;

// Handler: Check before insert
const existing = await db.query('SELECT id FROM trades WHERE idempotency_key = $1', [key]);
if (existing.rows.length > 0) {
  return res.status(200).json(existing.rows[0]); // Return cached result
}
```

### Fix 3: Token Scoping (Cross-User Access)
**Vulnerability:** No tenant isolation on API responses
**Fix:**
```typescript
// Backend: Always filter by authenticated user
async getPortfolio(req) {
  const userId = req.user.id; // From JWT
  return await db.positions.findMany({
    where: { userId } // NEVER accept userId from request body
  });
}
```

### Fix 4: Balance Locking (Concurrent Withdrawals)
**Vulnerability:** Race condition on balance checks
**Fix:**
```typescript
// Backend: Use database transaction with row locking
await db.transaction(async (tx) => {
  const balance = await tx.query(
    'SELECT available FROM balances WHERE user_id = $1 FOR UPDATE',
    [userId]
  );
  if (balance < amount) throw new Error('Insufficient balance');
  await tx.query('UPDATE balances SET available = available - $1 WHERE user_id = $2', [amount, userId]);
});
```

### Fix 5: State Machine Enforcement (Trading on Closed Markets)
**Vulnerability:** Market status not checked before trade
**Fix:**
```typescript
// Backend: Check market status atomically
const market = await db.markets.findUnique({ where: { id: marketId } });
if (market.status !== 'open') {
  throw new BadRequestError('Market is not open for trading');
}
```

---

## 4. Frontend Security Checklist

### 4.1 Token Storage
- [x] JWT stored in localStorage (acceptable for this use case)
- [x] Token cleared on logout
- [ ] Consider httpOnly cookie for enhanced security

### 4.2 XSS Prevention
- [x] React auto-escapes JSX by default
- [x] CSP headers configured in next.config.js
- [ ] Ensure no dangerouslySetInnerHTML with user data

### 4.3 Sensitive Data Exposure
- [x] No API keys in client code
- [x] Environment variables properly prefixed
- [ ] Audit console.log for sensitive data leaks

### 4.4 CSRF Protection
- [x] JWT tokens in headers (not cookies) - immune to CSRF
- [x] Idempotency keys for mutations

---

## 5. Test File Mapping

| Vulnerability | Test File | Test Name |
|---------------|-----------|-----------|
| OTP Brute Force | e2e/security-vuln.spec.ts | "OTP rate limiting prevents brute force" |
| Cross-User Access | e2e/security-vuln.spec.ts | "Cannot access another user's portfolio" |
| SQL Injection | e2e/aggressive-tests.spec.ts | "Market slug with SQL injection pattern" |
| Double-Spend | e2e/security-vuln.spec.ts | "Concurrent trades with same idempotency key" |
| Negative Balance | e2e/security-vuln.spec.ts | "Cannot sell more shares than owned" |
| Closed Market Trade | e2e/security-vuln.spec.ts | "Cannot trade on closed market" |
| Withdrawal Overflow | e2e/aggressive-tests.spec.ts | "Withdrawal with amount below minimum" |

---

## 6. Priority Action List

### CRITICAL (Fix Immediately)
1. **Rate Limiting** - Add rate limiting on OTP verification and login endpoints
2. **Idempotency Enforcement** - Ensure duplicate trades are rejected/idempotent
3. **Balance Locking** - Use database transactions with row locking for withdrawals

### HIGH (Fix Before Launch)
4. **Market Status Checks** - Verify market is open before accepting trades
5. **Position Validation** - Cannot sell more shares than owned
6. **Cross-User Isolation** - Verify all endpoints filter by authenticated user

### MEDIUM (Fix Post-Launch)
7. **JWT Algorithm Pinning** - Reject non-expected JWT algorithms
8. **SIWE Nonce Rotation** - One-time use for SIWE nonces
9. **Enhanced Logging** - Log all authentication failures for monitoring

### LOW (Technical Debt)
10. **httpOnly Cookies** - Consider for enhanced token security
11. **CORS Tightening** - Restrict to known origins in production
12. **Input Sanitization** - Additional sanitization layer on all inputs

---

## 7. Running Security Tests

```bash
# Run all security-focused tests
npx playwright test e2e/security-vuln.spec.ts

# Run aggressive tests
npx playwright test e2e/aggressive-tests.spec.ts

# Run all E2E tests with verbose output
npx playwright test --reporter=list
```

---

## 8. Continuous Security Monitoring

### Recommended Tools
- **Snyk** - Dependency vulnerability scanning
- **npm audit** - Regular dependency audits
- **Sentry** - Real-time error monitoring for attack detection
- **CloudFlare WAF** - Web Application Firewall for production

### Monitoring Alerts
Set up alerts for:
- Spike in 401/403 responses (brute force attempts)
- Unusual withdrawal patterns
- Multiple OTP requests from same IP
- JWT validation failures
