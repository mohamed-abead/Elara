// utils/create-wallet.ts
import { Platform } from "react-native";

const API_BASE = "http://localhost:8000";

export async function createWalletIfNeeded(
  accessToken: string,
  showToast?: (msg: string) => void
) {
  try {
    const res = await fetch(`${API_BASE}/profiles/wallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: "{}",
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(json?.detail || `Wallet endpoint failed (${res.status})`);

    console.log("Wallet:", json);
    return json;
  } catch (err: any) {
    console.warn("createWalletIfNeeded error:", err?.message || err);
    if (showToast) showToast(err?.message || "Could not set up wallet.");
    return null;
  }
}
