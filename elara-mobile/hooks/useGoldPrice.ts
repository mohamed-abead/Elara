// hooks/useGoldPrice.ts
import { useEffect, useState } from "react";
import { fetchWithCache } from "@/utils/fetchWithCache";

export function useGoldPrice() {
  const [priceUsdPerOz, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<string | null>(null);
  const [cachedAgeMs, setAge] = useState(0);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);

      const url =
        "https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd";
      const { data, cachedAgeMs, fromCache } = await fetchWithCache<any>(
        "cg:paxg:simple_price_usd",
        url,
        {},
        5 * 60 * 1000, // 5min TTL
        true           // SWR
      );

      if (!alive) return;

      if (data && typeof data["pax-gold"]?.usd === "number") {
        setPrice(data["pax-gold"].usd);
        setAge(cachedAgeMs);
        setErr(null);
      } else {
        setErr("Failed to fetch price");
      }
      setLoading(false);

      // Optional: if we served stale data, it will refresh in the background;
      // You could listen to storage events to auto-update, but for simplicity we leave it here.
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { priceUsdPerOz, loading, error, cachedAgeMs };
}
