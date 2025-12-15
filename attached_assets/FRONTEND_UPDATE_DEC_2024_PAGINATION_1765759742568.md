# Frontend Team Update: Pagination Changes (December 2024)

## Summary

The portfolio endpoints now have enhanced pagination with DoS protection. These changes are **backwards compatible** but include new constraints you should be aware of.

## Affected Endpoints

### GET /api/v1/portfolio
- **limit**: max 100, default 50
- **offset**: max 10,000, default 0

### GET /api/v1/portfolio/history  
- **limit**: max 100, default 20
- **offset**: max 10,000, default 0

## Key Changes

### 1. MAX_OFFSET Cap (10,000)

**Before**: Offset could be any positive number  
**After**: Offset is capped at 10,000

```javascript
// This will work - offset capped to 10,000
GET /api/v1/portfolio?offset=999999
// Actual offset used: 10,000

// This works normally
GET /api/v1/portfolio?offset=500
// Actual offset used: 500
```

**Frontend Impact**: If you have pagination controls that allow users to skip to very high page numbers, they will be capped. For a dataset with limit=50 and max offset=10,000, users can access up to page 200 (10,000/50).

### 2. Invalid Values Now Use Defaults

**Before**: Some edge cases clamped to minimum (e.g., limit=0 → limit=1)  
**After**: Invalid values fall to safe defaults

| Input | Before | After |
|-------|--------|-------|
| `limit=0` | 1 | 50 (default) |
| `limit=-5` | 1 | 50 (default) |
| `limit=NaN` | 50 | 50 (default) |
| `offset=-10` | 0 | 0 |
| `offset=Infinity` | 0 | 0 |

### 3. Response Behavior

The API does **not** return error codes for out-of-bounds pagination. Instead, values are silently clamped to valid ranges. This means:

- `limit=1000` becomes `limit=100` (no error)
- `offset=50000` becomes `offset=10000` (no error)

## Recommendations for Frontend

### 1. Update Pagination Controls

If you display page numbers, calculate the maximum page based on total items and limit:

```javascript
const maxPage = Math.min(
  Math.ceil(totalItems / limit),
  Math.floor(10000 / limit) // MAX_OFFSET constraint
);
```

### 2. Handle Edge Cases

For infinite scroll implementations, stop fetching when:
- No more items returned, OR
- Offset reaches 10,000

```javascript
const canLoadMore = items.length > 0 && currentOffset < 10000;
```

### 3. Portfolio History Default Limit

Note that `/portfolio/history` uses a default limit of 20 (not 50 like the main portfolio endpoint).

## No Action Required If...

- Your pagination stays within reasonable bounds (< 200 pages with default limits)
- You already handle empty responses gracefully
- You don't allow direct offset input from users

## Questions?

Contact the backend team if you have questions about these changes.
