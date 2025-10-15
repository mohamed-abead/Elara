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
        if acc.get("type") == "wallet" and acc.get("address"):
            return {
                "address": acc["address"],
                "chain_type": acc.get("chain_type"),            # e.g. "ethereum"
                "chain_id": acc.get("chain_id"),                # e.g. "eip155:1"
                "wallet_index": acc.get("wallet_index"),        # e.g. 0
                "wallet_client": acc.get("wallet_client"),      # e.g. "privy"
                "connector_type": acc.get("connector_type"),    # e.g. "embedded"
                "recovery_method": acc.get("recovery_method"),  # e.g. "privy-v2"
            }
    return None
