// hooks/useGoldDelta.ts
import { useEffect, useState } from "react";
import { fetchWithCache } from "@/utils/fetchWithCache";

type SeriesPoint = [number, number];
type MarketChart = { prices: SeriesPoint[] };

export function useGoldDelta() {
  const [pctChange30d, setPct] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<string | null>(null);
  const [cachedAgeMs, setAge] = useState(0);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);

      const url =
        "https://api.coingecko.com/api/v3/coins/pax-gold/market_chart?vs_currency=usd&days=30";
      const { data, cachedAgeMs } = await fetchWithCache<MarketChart>(
        "cg:paxg:market_chart_30d",
        url,
        {},
        15 * 60 * 1000, // 15min TTL
        true // SWR
      );

      if (!alive) return;

      try {
        const series = data?.prices ?? [];
        if (series.length >= 2) {
          const first = series[0][1];
          const last = series[series.length - 1][1];
          const change = ((last - first) / first) * 100;
          setPct(change);
          setErr(null);
          setAge(cachedAgeMs);
        } else {
          throw new Error("Insufficient data");
        }
      } catch (e: any) {
        setErr(e?.message ?? "Failed to compute delta");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { pctChange30d, loading, error, cachedAgeMs };
}
