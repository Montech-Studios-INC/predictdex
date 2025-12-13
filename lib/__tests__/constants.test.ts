import { isValidEthAddress, getErrorMessage, CACHE_TTL_MS, ORDERBOOK_POLL_MS } from '../constants';

describe('constants', () => {
  describe('isValidEthAddress', () => {
    it('should return true for valid Ethereum addresses', () => {
      expect(isValidEthAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f123456')).toBe(false);
      expect(isValidEthAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f12345')).toBe(true);
      expect(isValidEthAddress('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B')).toBe(true);
    });

    it('should return false for invalid addresses', () => {
      expect(isValidEthAddress('')).toBe(false);
      expect(isValidEthAddress('0x')).toBe(false);
      expect(isValidEthAddress('not-an-address')).toBe(false);
      expect(isValidEthAddress('0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG')).toBe(false);
      expect(isValidEthAddress('742d35Cc6634C0532925a3b844Bc9e7595f12345')).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should extract message from Error instances', () => {
      expect(getErrorMessage(new Error('test error'), 'fallback')).toBe('test error');
    });

    it('should return fallback for non-Error values', () => {
      expect(getErrorMessage('string', 'fallback')).toBe('fallback');
      expect(getErrorMessage(null, 'fallback')).toBe('fallback');
      expect(getErrorMessage(undefined, 'fallback')).toBe('fallback');
      expect(getErrorMessage({ message: 'not an error' }, 'fallback')).toBe('fallback');
    });
  });

  describe('timing constants', () => {
    it('should have reasonable values', () => {
      expect(CACHE_TTL_MS).toBe(30_000);
      expect(ORDERBOOK_POLL_MS).toBe(30_000);
    });
  });
});
