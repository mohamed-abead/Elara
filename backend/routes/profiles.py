from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Annotated
from clients.privy_client import create_privy_user, extract_primary_wallet, get_wallet_balance
from clients.supabase_client import postgrest_as_user
from core.security import verify_supabase_jwt

router = APIRouter(prefix="/profiles", tags=["profiles"])

def current_user(authorization: Annotated[str | None, Header()] = None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = authorization.split(" ")[-1]
    return {"token": token, "claims": verify_supabase_jwt(token)}


@router.post("/create_wallet")
def create_or_get_wallet(user=Depends(current_user)):
    user_id = user["claims"]["sub"]

    # 1) Check if wallet exists already
    with postgrest_as_user(user["token"]) as pg:
        r = pg.get("/profiles", params={"select": "wallet_id", "id": f"eq.{user_id}"})
        rows = r.json()
        if rows and rows[0].get("wallet_id"):
            return {"wallet": {"wallet_id": rows[0]["wallet_id"]}, "status": "exists"}

    # 2) Create/ensure Privy user; extract wallet directly from linked_accounts
    privy_user = create_privy_user(user_id)
    wallet = extract_primary_wallet(privy_user)
    if not wallet:
        raise HTTPException(502, "Privy user created but no wallet returned")

    # 3) Persist useful fields into profiles
    with postgrest_as_user(user["token"]) as pg:
        pg.post(
            "/profiles",
            json={
                "id": user_id,
                "wallet_address": wallet["wallet_address"],
                "wallet_id": wallet["wallet_id"],
                "privy_user_id": privy_user["id"],
                "wallet_chain_id": wallet.get("chain_id"),
                "wallet_chain_type": wallet.get("chain_type"),
                "wallet_index": wallet.get("wallet_index"),
                "wallet_client": wallet.get("wallet_client"),
                "wallet_connector_type": wallet.get("connector_type"),
                "wallet_recovery_method": wallet.get("recovery_method"),
            },
            params={"on_conflict": "id"},
        )

    return {"wallet": wallet, "status": "created"}

@router.get("/get_balance")
def get_balance(user=Depends(current_user)):
    user_id = user["claims"]["sub"]
    
    with postgrest_as_user(user["token"]) as pg:
        r = pg.get("/profiles", params={"select": "wallet_id, wallet_chain_type", "id": f"eq.{user_id}"})
        rows = r.json()
        if rows and rows[0].get("wallet_id"):
            wallet_id = rows[0].get("wallet_id")
            chain = rows[0].get("wallet_chain_type")
        else:
            raise HTTPException(404, "No wallet associated with the user")

    return get_wallet_balance(wallet_id, chain)['total_usd']