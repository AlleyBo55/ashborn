// Session-based rate limiter (5 runs per 3 minutes)
// Dev: resets on server restart
// Prod: persists in memory (no bypass)

const LIMIT = 5;
const WINDOW_MS = 3 * 60 * 1000; // 3 minutes

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export function checkRateLimit(sessionId: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = store.get(sessionId);

  // No entry or expired window
  if (!entry || now >= entry.resetAt) {
    store.set(sessionId, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: LIMIT - 1, resetIn: WINDOW_MS };
  }

  // Within window
  if (entry.count < LIMIT) {
    entry.count++;
    return { allowed: true, remaining: LIMIT - entry.count, resetIn: entry.resetAt - now };
  }

  // Rate limited
  return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
}
