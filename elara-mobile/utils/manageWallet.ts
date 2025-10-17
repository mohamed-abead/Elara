// utils/create-wallet.ts
import { Platform } from "react-native";

const API_BASE = "http://localhost:8000";

export async function createWalletIfNeeded(
  accessToken: string,
  showToast?: (msg: string) => void
) {
  try {
    const res = await fetch(`${API_BASE}/profiles/create_wallet`, {
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

export async function getWalletBalance(
  accessToken: string,
  showToast?: (msg: string) => void
): Promise<number | null> {
  try {
    const res = await fetch(`${API_BASE}/profiles/get_balance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await res.json().catch(() => ({}));

    // Handle common error cases cleanly
    if (!res.ok) {
      const msg =
        json?.detail ||
        (res.status === 404
          ? "No wallet associated with the user"
          : `Balance endpoint failed (${res.status})`);
      throw new Error(msg);
    }

    return json;

  } catch (err: any) {
    console.warn("getWalletBalance error:", err?.message || err);
    if (showToast) showToast(err?.message || "Could not fetch wallet balance.");
    return null;
  }
}
