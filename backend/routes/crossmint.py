import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Header

from clients.crossmint_client import crossmint_client
from core.security import verify_supabase_jwt


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/2022-06-09", tags=["crossmint"])


def current_user(authorization: Annotated[str | None, Header()] = None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = authorization.split(" ")[-1]
    return {"token": token, "claims": verify_supabase_jwt(token)}


@router.post("/orders")
def create_order(payload: dict, user=Depends(current_user)):
    if not isinstance(payload, dict):
        raise HTTPException(status_code=400, detail="Invalid request body")

    try:
        print("GOT ROUTED TO BACKEND /orders")
        result = crossmint_client.create_order(payload)
    except HTTPException:
        raise
    except Exception:
        logger.exception(
            "Unexpected error while creating Crossmint order for user %s",
            user["claims"].get("sub"),
        )
        raise HTTPException(status_code=500, detail="Unexpected Crossmint error")

    print("Crossmint order created for user", user["claims"].get("sub"), ": \n",  result)
    return result
