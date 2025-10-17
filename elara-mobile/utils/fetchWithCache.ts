// lib/fetchWithCache.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

type CachedPayload<T = unknown> = {
  data: T;
  ts: number; // stored at (ms since epoch)
};

const inflight = new Map<string, Promise<Response>>();

/**
 * Fetch with:
 * - TTL caching in AsyncStorage
 * - in-flight de-duping
 * - stale-while-revalidate (return cached immediately, then refresh in background)
 *
 * @param key unique cache key
 * @param url fetch URL
 * @param opts fetch options
 * @param ttlMs how long the cache is "fresh"
 * @param swr if true, returns cached immediately and revalidates in background
 */
export async function fetchWithCache<T>(
  key: string,
  url: string,
  opts: RequestInit = {},
  ttlMs = 5 * 60 * 1000, // 5 minutes
  swr = true
): Promise<{
  data: T | null;
  cachedAgeMs: number;
  fromCache: boolean;
  refresh: () => Promise<void>;
}> {
  const now = Date.now();

  // Try cache
  const raw = await AsyncStorage.getItem(key);
  let cached: CachedPayload<T> | null = null;
  if (raw) {
    try {
      cached = JSON.parse(raw) as CachedPayload<T>;
    } catch {}
  }

  const age = cached ? now - cached.ts : Number.POSITIVE_INFINITY;
  const fresh = cached && age < ttlMs;

  const doFetch = async () => {
    // de-dupe concurrent fetches for the same URL
    if (!inflight.has(url)) {
      inflight.set(
        url,
        fetch(url, {
          ...opts,
          headers: { accept: "application/json", ...(opts.headers || {}) },
        })
      );
    }
    try {
      const resp = await inflight.get(url)!;
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = (await resp.json()) as T;
      await AsyncStorage.setItem(
        key,
        JSON.stringify({ data: json, ts: Date.now() } as CachedPayload<T>)
      );
    } finally {
      inflight.delete(url);
    }
  };

  // If we have fresh cache, return it and optionally revalidate in background (SWR)
  if (fresh) {
    if (swr) doFetch().catch(() => {}); // background refresh
    return {
      data: cached!.data,
      cachedAgeMs: age,
      fromCache: true,
      refresh: () => doFetch(),
    };
  }

  // Otherwise, try network; if it fails but we have any cache, return stale
  try {
    await doFetch();
    const raw2 = await AsyncStorage.getItem(key);
    const saved = raw2 ? (JSON.parse(raw2) as CachedPayload<T>) : null;
    return {
      data: saved?.data ?? null,
      cachedAgeMs: 0,
      fromCache: false,
      refresh: () => doFetch(),
    };
  } catch (e) {
    // Network error or 429 — fall back to stale cache if available
    if (cached) {
      return {
        data: cached.data,
        cachedAgeMs: age,
        fromCache: true,
        refresh: () => doFetch(),
      };
    }
    // no cache and failed
    return {
      data: null,
      cachedAgeMs: Infinity,
      fromCache: false,
      refresh: () => doFetch(),
    };
  }
}
