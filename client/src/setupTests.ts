import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

// Mock fetch globally
globalThis.fetch = vi.fn();

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});