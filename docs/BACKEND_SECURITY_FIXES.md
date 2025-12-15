# Backend Security Fixes Required

**From:** Frontend Team  
**To:** Backend Team  
**Date:** December 15, 2025  
**Subject:** Priority Security Fixes from Vulnerability Audit

---

## Summary

We conducted a comprehensive vulnerability-driven security audit of the AfricaPredicts platform. While the frontend has been hardened with CSP headers, input validation, and proper token handling, we identified several **critical and high-priority fixes** that require backend implementation.

---

## CRITICAL Priority (Fix Before Launch)

### 1. Rate Limiting on Authentication Endpoints

**Vulnerability:** No apparent rate limiting on OTP verification allows brute-force attacks on 6-digit codes (1,000,000 combinations).

**Affected Endpoints:**
- `POST /auth/request-otp`
- `POST /auth/verify-otp`
- `POST /auth/wallet/challenge`
- `POST /auth/wallet/verify`

**Recommended Fix:**
```typescript
// Example using express-rate-limit
import rateLimit from 'express-rate-limit';

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window per email
  keyGenerator: (req) => req.body.email || req.ip,
  message: { 
    error: 'Too many verification attempts. Please try again in 15 minutes.',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/auth/verify-otp', otpVerifyLimiter, verifyOtpHandler);
```

**Additional Measures:**
- Lock account after 10 failed attempts in 24 hours
- Send email notification on account lockout
- Log all failed authentication attempts for monitoring

---

### 2. Idempotency Key Enforcement for Trades

**Vulnerability:** Concurrent trade submissions with the same idempotency key could potentially execute multiple times if not enforced at the database level.

**Affected Endpoints:**
- `POST /trade/buy`

**Recommended Fix:**
```sql
-- Add unique constraint on idempotency_key
ALTER TABLE trades ADD CONSTRAINT idx_trades_idempotency 
  UNIQUE (idempotency_key) WHERE idempotency_key IS NOT NULL;
```

```typescript
// Handler implementation
async function executeTrade(req) {
  const { idempotencyKey, marketId, outcome, stake } = req.body;
  
  // Check for existing trade with this key
  const existing = await db.trades.findFirst({
    where: { idempotencyKey }
  });
  
  if (existing) {
    // Return cached result instead of executing again
    return res.status(200).json(existing);
  }
  
  // Proceed with trade...
}
```

---

### 3. Balance Locking with Database Transactions

**Vulnerability:** Race condition possible when two concurrent withdrawals check balance before either deducts funds.

**Affected Endpoints:**
- `POST /crypto/withdraw`
- `POST /trade/buy` (balance deduction)

**Recommended Fix:**
```typescript
// Use SELECT FOR UPDATE to lock the row during transaction
async function processWithdrawal(userId: string, amount: number, token: string) {
  return await prisma.$transaction(async (tx) => {
    // Lock the balance row
    const balance = await tx.$queryRaw`
      SELECT available FROM balances 
      WHERE user_id = ${userId} AND token = ${token}
      FOR UPDATE
    `;
    
    if (balance[0].available < amount) {
      throw new BadRequestError('Insufficient balance');
    }
    
    // Deduct balance atomically
    await tx.balances.update({
      where: { userId_token: { userId, token } },
      data: { available: { decrement: amount } }
    });
    
    // Create withdrawal record
    return await tx.withdrawals.create({
      data: { userId, amount, token, status: 'pending' }
    });
  });
}
```

---

## HIGH Priority (Fix Within First Week)

### 4. Market Status Validation Before Trade

**Vulnerability:** Trades may be accepted on closed/resolved markets if status check is not atomic with trade execution.

**Affected Endpoints:**
- `POST /trade/preview`
- `POST /trade/buy`

**Recommended Fix:**
```typescript
async function previewTrade(marketId: string, outcome: string, stake: number) {
  const market = await db.markets.findUnique({ where: { id: marketId } });
  
  if (!market) {
    throw new NotFoundError('Market not found');
  }
  
  if (market.status !== 'open') {
    throw new BadRequestError(`Market is ${market.status}. Trading is not available.`);
  }
  
  if (new Date(market.closesAt) < new Date()) {
    throw new BadRequestError('Market has closed for trading');
  }
  
  // Proceed with preview...
}
```

---

### 5. Position Share Validation on Sell

**Vulnerability:** User could attempt to sell more shares than they own.

**Affected Endpoints:**
- `POST /trade/sell`

**Recommended Fix:**
```typescript
async function sellShares(userId: string, positionId: string, sharesToSell: number) {
  return await prisma.$transaction(async (tx) => {
    const position = await tx.positions.findFirst({
      where: { id: positionId, userId, status: 'open' }
    });
    
    if (!position) {
      throw new NotFoundError('Position not found');
    }
    
    if (sharesToSell > position.shares) {
      throw new BadRequestError(
        `Cannot sell ${sharesToSell} shares. You only have ${position.shares} shares.`
      );
    }
    
    if (sharesToSell <= 0) {
      throw new BadRequestError('Shares to sell must be positive');
    }
    
    // Proceed with sell...
  });
}
```

---

### 6. User Isolation on All Endpoints

**Vulnerability:** Ensure all authenticated endpoints filter by the JWT user ID, never accepting user_id from request body.

**Affected Endpoints:**
- All authenticated endpoints

**Audit Checklist:**
- [ ] `GET /portfolio` - Filter by `req.user.id`
- [ ] `GET /wallet/balances` - Filter by `req.user.id`
- [ ] `GET /crypto/deposit-addresses` - Filter by `req.user.id`
- [ ] `POST /trade/sell` - Verify position belongs to `req.user.id`
- [ ] `GET /crypto/withdrawals/history` - Filter by `req.user.id`

**Pattern to Follow:**
```typescript
// GOOD: Use authenticated user from JWT
async function getPortfolio(req) {
  const userId = req.user.id; // From verified JWT
  return await db.positions.findMany({ where: { userId } });
}

// BAD: Never accept userId from request
async function getPortfolioBAD(req) {
  const userId = req.body.userId; // VULNERABLE TO IDOR
  return await db.positions.findMany({ where: { userId } });
}
```

---

## MEDIUM Priority (Fix Post-Launch)

### 7. JWT Algorithm Pinning
Ensure JWT verification explicitly specifies allowed algorithms to prevent algorithm confusion attacks.

```typescript
jwt.verify(token, publicKey, { 
  algorithms: ['RS256'], // Only accept RS256
  issuer: 'africapredicts.com'
});
```

### 8. OTP One-Time Use
Ensure OTP codes are invalidated immediately after successful verification.

### 9. SIWE Nonce Expiration
Ensure wallet challenge nonces expire after single use and within time window.

### 10. Enhanced Logging
Log all authentication failures, admin actions, and withdrawal requests for security monitoring.

---

## Testing Your Fixes

We've created comprehensive security tests. After implementing fixes, run:

```bash
# From frontend repo - tests against your API
npx playwright test e2e/security-vuln.spec.ts
npx playwright test e2e/aggressive-tests.spec.ts
```

These tests will verify:
- Rate limiting is enforced
- Invalid tokens are rejected
- IDOR attempts fail
- Injection attacks are blocked
- Race conditions are handled

---

## Questions?

Please reach out to the frontend team if you need clarification on any of these items. We're happy to help test the fixes once implemented.

**Priority Summary:**
| Priority | Count | Timeline |
|----------|-------|----------|
| CRITICAL | 3 | Before launch |
| HIGH | 3 | Within first week |
| MEDIUM | 4 | Post-launch |
