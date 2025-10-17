import base64, httpx
from core.settings import settings

def privy_headers() -> dict:
    auth = base64.b64encode(f"{settings.PRIVY_APP_ID}:{settings.PRIVY_APP_SECRET}".encode()).decode()
    return {"Authorization": f"Basic {auth}", "privy-app-id": settings.PRIVY_APP_ID, "Content-Type": "application/json"}

def create_privy_user(user_id: str, chain_type: str = "ethereum"):
    """
    Create/ensure a Privy user linked to your Supabase user_id.
    Your org auto-creates an embedded wallet, so the wallet is in linked_accounts.
    Returns the Privy user object.
    """
    body = {"linked_accounts": [{"type": "custom_auth", "custom_user_id": user_id}], "wallets": [{"chain_type": chain_type}],}
    with httpx.Client(timeout=10) as client:
        resp = client.post(f"{settings.PRIVY_API_BASE}/v1/users", headers=privy_headers(), json=body)
    resp.raise_for_status()
    return resp.json()

def extract_primary_wallet(privy_user: dict) -> dict | None:
    """
    From a Privy user object, return the first wallet-like linked account as a normalized dict.
    """
    for acc in privy_user.get("linked_accounts", []):
        if acc.get("type") == "wallet":
            return {
                "wallet_address": acc["address"],
                "wallet_id": acc["id"],
                "chain_type": acc.get("chain_type"),            # e.g. "ethereum"
                "chain_id": acc.get("chain_id"),                # e.g. "eip155:1"
                "wallet_index": acc.get("wallet_index"),        # e.g. 0
                "wallet_client": acc.get("wallet_client"),      # e.g. "privy"
                "connector_type": acc.get("connector_type"),    # e.g. "embedded"
                "recovery_method": acc.get("recovery_method"),  # e.g. "privy-v2"
            }
    return None

def get_wallet_balance(wallet_id: str, chain: str) -> dict[str, any]:
    """
    Fetch the wallet's balances from Privy and return a USD summary.

    Returns:
      {
        "wallet_id": "...",
        "total_usd": 12.34,
        "balances": [
          {"chain": "base", "asset": "eth", "usd": 2.56, "raw_value": "1000...", "decimals": 18},
          ...
        ],
        "raw": {...original Privy payload...}
      }
    """
    # Full set of assets/chains supported by the endpoint (as of docs):
    # asset: eth, usdc, pol, usdt, sol
    # chain: ethereum, arbitrum, base, linea, optimism, polygon, solana, zksync_era, + testnets
    params = {
        "include_currency": "usd",
        "asset":["usdc", "eth", "pol", "usdt"],
        "chain": chain
    }

    with httpx.Client(timeout=15) as client:
        resp = client.get(
            f"{settings.PRIVY_API_BASE}/v1/wallets/{wallet_id}/balance",
            headers=privy_headers(),
            params=params,  # httpx will repeat list params correctly (?asset=eth&asset=usdc&...)
        )
    resp.raise_for_status()
    payload = resp.json()

    balances: list[dict[str, any]] = []
    total_usd = 0.0

    for item in payload.get("balances", []):
        dv = item.get("display_values") or {}
        usd_str = dv.get("usd")
        try:
            usd_val = float(usd_str) if usd_str is not None else None
        except (TypeError, ValueError):
            usd_val = None

        if usd_val is not None:
            total_usd += usd_val
            balances.append({
                "chain": item.get("chain"),
                "asset": item.get("asset"),
                "usd": usd_val,
                "raw_value": item.get("raw_value"),
                "decimals": item.get("raw_value_decimals"),
            })

    return {
        "wallet_id": wallet_id,
        "total_usd": round(total_usd, 2),
        "balances": balances,
        "raw": payload,
    }