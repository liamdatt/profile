type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

export function assertRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.expiresAt <= now) {
    buckets.set(key, { count: 1, expiresAt: now + windowMs });
    return { ok: true };
  }

  if (current.count >= limit) {
    return {
      ok: false,
      retryAfter: Math.ceil((current.expiresAt - now) / 1000),
    };
  }

  current.count += 1;
  buckets.set(key, current);
  return { ok: true };
}
